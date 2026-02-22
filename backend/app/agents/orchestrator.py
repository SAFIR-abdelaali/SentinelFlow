import json
import re
from groq import Groq
from app.tools.logistics import get_shipping_status
from app.tools.emailer import draft_apology_email
from app.core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY, timeout=30)

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_shipping_status",
            "description": "Retrieves current shipping status from the carrier API.",
            "parameters": {
                "type": "object",
                "properties": {
                    "order_id": {"type": "string", "description": "The order ID to look up"}
                },
                "required": ["order_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "draft_apology_email",
            "description": "Drafts an apology email for a delayed shipment. Returns the draft content.",
            "parameters": {
                "type": "object",
                "properties": {
                    "customer_name": {"type": "string", "description": "Customer name"},
                    "order_id": {"type": "string", "description": "The order ID"},
                    "reason": {"type": "string", "description": "Reason for the delay"}
                },
                "required": ["customer_name", "order_id", "reason"]
            }
        }
    }
]

TOOL_MAP = {
    "get_shipping_status": lambda args: get_shipping_status.invoke(args),
    "draft_apology_email": lambda args: draft_apology_email.invoke(args),
}

SYSTEM_PROMPT = (
    "You are SentinelFlow's logistics assistant. Follow these rules strictly:\n"
    "1. Use get_shipping_status to check the order status.\n"
    "2. If the order is DELAYED, also use draft_apology_email to draft an apology (use 'Valued Customer' as the customer name).\n"
    "3. If the order is ON TIME or DELIVERED, simply report the status. Do NOT draft an email.\n"
    "4. When an email is drafted, include the FULL email content in your response.\n"
    "5. Give a concise, direct summary. Do NOT add disclaimers or meta-commentary."
)


def _parse_failed_generation(failed_gen: str):
    match = re.match(r'<function=(\w+)>(.*)', failed_gen, re.DOTALL)
    if match:
        fn_name = match.group(1)
        try:
            fn_args = json.loads(match.group(2))
            return fn_name, fn_args
        except json.JSONDecodeError:
            pass
    return None, None


def _execute_tool(fn_name: str, fn_args: dict, called_tools: set, last_shipping_status: str | None) -> str:
    called_tools.add(fn_name)

    if fn_name == "draft_apology_email":
        if not last_shipping_status or "delayed" not in last_shipping_status.lower():
            return "Email skipped — order is not delayed."

    return str(TOOL_MAP.get(fn_name, lambda a: "Unknown tool")(fn_args))


def run_agent_stream(prompt_text: str):
    try:
        order_match = re.search(r'(ORD-\d+)', prompt_text, re.IGNORECASE)
        order_id = order_match.group(1).upper() if order_match else "unknown order"

        yield {"type": "step", "data": "Accessing internal logistics database..."}
        yield {"type": "step", "data": f"Looking up shipment records for {order_id}..."}

        yield {"type": "step", "data": f"Executing shipment status check for {order_id}..."}
        status = str(get_shipping_status.invoke({"order_id": order_id}))
        yield {"type": "step", "data": _tool_result_step("get_shipping_status", status)}

        if "not found" in status.lower():
            yield {"type": "step", "data": "Compiling final report..."}
            yield {"type": "result", "data": f"Order {order_id} was not found in the database."}
            return

        if "delayed" not in status.lower():
            yield {"type": "step", "data": "Compiling final report..."}
            yield {"type": "result", "data": f"Order {order_id} status: {status}. No action required."}
            return

        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt_text},
            {"role": "assistant", "content": f"I checked the status. Result: {status}"},
        ]

        called_tools = {"get_shipping_status"}
        email_draft = None
        last_shipping_status = status

        for round_num in range(3):
            try:
                response = client.chat.completions.create(
                    model="llama-3.1-8b-instant",
                    messages=messages,
                    tools=TOOLS,
                    tool_choice="auto",
                    temperature=0,
                )
            except Exception as api_err:
                err_body = getattr(api_err, 'body', {}) or {}
                if isinstance(err_body, dict) and err_body.get('error', {}).get('code') == 'tool_use_failed':
                    failed_gen = err_body['error'].get('failed_generation', '')
                    fn_name, fn_args = _parse_failed_generation(failed_gen)
                    if fn_name and fn_name in TOOL_MAP and fn_name not in called_tools:
                        result = _execute_tool(fn_name, fn_args, called_tools, last_shipping_status)
                        if fn_name == "get_shipping_status":
                            last_shipping_status = str(result)
                        if fn_name == "draft_apology_email" and "skipped" not in str(result).lower():
                            email_draft = str(result)
                        yield {"type": "step", "data": f"Executing {_tool_step_label(fn_name, fn_args)}..."}
                        yield {"type": "step", "data": _tool_result_step(fn_name, str(result))}
                        messages.append({"role": "assistant", "content": f"I called {fn_name}. Result: {result}"})
                        continue
                raise

            msg = response.choices[0].message

            if not msg.tool_calls:
                content = msg.content or ""
                if "<function=" in content:
                    fn_name, fn_args = _parse_failed_generation(content.strip())
                    if fn_name and fn_name in TOOL_MAP and fn_name not in called_tools:
                        result = _execute_tool(fn_name, fn_args, called_tools, last_shipping_status)
                        if fn_name == "get_shipping_status":
                            last_shipping_status = str(result)
                        if fn_name == "draft_apology_email" and "skipped" not in str(result).lower():
                            email_draft = str(result)
                        yield {"type": "step", "data": f"Executing {_tool_step_label(fn_name, fn_args)}..."}
                        yield {"type": "step", "data": _tool_result_step(fn_name, str(result))}
                        messages.append({"role": "assistant", "content": f"I called {fn_name}. Result: {result}"})
                        continue
                yield {"type": "step", "data": "Compiling final report..."}
                final_output = content or "No response generated."
                if email_draft and "Subject:" not in final_output:
                    final_output += f"\n\n📧 Drafted Email:\n{email_draft}"
                yield {"type": "result", "data": final_output}
                return

            messages.append({"role": "assistant", "tool_calls": [
                {"id": tc.id, "type": "function", "function": {"name": tc.function.name, "arguments": tc.function.arguments}}
                for tc in msg.tool_calls
            ]})

            for tool_call in msg.tool_calls:
                fn_name = tool_call.function.name
                fn_args = json.loads(tool_call.function.arguments)

                if fn_name in called_tools:
                    messages.append({
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "content": "Already executed.",
                    })
                    continue

                result = _execute_tool(fn_name, fn_args, called_tools, last_shipping_status)
                if fn_name == "get_shipping_status":
                    last_shipping_status = str(result)
                if fn_name == "draft_apology_email" and "skipped" not in str(result).lower():
                    email_draft = str(result)
                yield {"type": "step", "data": f"Executing {_tool_step_label(fn_name, fn_args)}..."}
                yield {"type": "step", "data": _tool_result_step(fn_name, str(result))}
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": str(result),
                })

        yield {"type": "step", "data": "Compiling final report..."}
        final = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages,
            temperature=0,
        )
        content = final.choices[0].message.content or "No response generated."
        if "<function=" in content:
            content = re.sub(r'<function=\w+>.*', '', content, flags=re.DOTALL).strip()
            content = content or "Processing complete."
        if email_draft and "Subject:" not in content:
            content += f"\n\n📧 Drafted Email:\n{email_draft}"
        yield {"type": "result", "data": content}

    except Exception as e:
        import traceback
        traceback.print_exc()
        yield {"type": "step", "data": f"Error encountered: {str(e)}"}
        yield {"type": "result", "data": f"Agent error: {str(e)}"}


def _tool_step_label(fn_name: str, fn_args: dict) -> str:
    if fn_name == "get_shipping_status":
        return f"shipment status check for {fn_args.get('order_id', 'order')}"
    elif fn_name == "draft_apology_email":
        return f"apology email draft for {fn_args.get('order_id', 'order')}"
    return fn_name


def _tool_result_step(fn_name: str, result: str) -> str:
    if fn_name == "get_shipping_status":
        if "delayed" in result.lower():
            return f"⚠ Delay detected — {result}"
        elif "delivered" in result.lower():
            return f"✓ Shipment confirmed — {result}"
        elif "on time" in result.lower():
            return f"✓ Shipment on track — {result}"
        if "not found" in result.lower():
            return f"✗ {result}"
        return f"Status retrieved: {result}"
    elif fn_name == "draft_apology_email":
        return f"✉ Email drafted:\n{result}"
    return f"Tool result: {result}"