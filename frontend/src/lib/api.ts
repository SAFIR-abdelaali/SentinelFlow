const API_BASE_URL = "http://localhost:8000";

export interface AgentResponse {
  output: string;
  steps: string[];
}

export async function askAgentStream(
  orderId: string,
  onStep: (step: string) => void
): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: `Check logistics for order ${orderId}` }),
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";
  let finalOutput = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data: ")) continue;

      try {
        const event = JSON.parse(trimmed.slice(6));
        if (event.type === "step") {
          onStep(event.data);
        } else if (event.type === "result") {
          finalOutput = event.data;
        }
      } catch {
      }
    }
  }

  return finalOutput || "No response received.";
}

export async function markOrderAsNotified(orderId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/mark_notified/${orderId}`, {
    method: "POST",
  });

  if (!response.ok) {
    console.error(`Failed to mark order ${orderId} as notified: ${response.status}`);
  }
}