from langchain_core.tools import tool

@tool(description="Drafts an apology email for a delayed shipment.")
def draft_apology_email(customer_name: str, order_id: str, reason: str) -> str:
    draft = (
        f"Subject: Important Update Regarding Your Order {order_id}\n\n"
        f"Dear {customer_name},\n\n"
        f"We are writing to inform you that your order {order_id} is currently experiencing a delay due to: {reason}.\n"
        "We sincerely apologize for this inconvenience and are actively monitoring your shipment.\n\n"
        "Best regards,\nSentinelFlow Logistics Team"
    )
    return f"Email successfully drafted:\n\n{draft}"