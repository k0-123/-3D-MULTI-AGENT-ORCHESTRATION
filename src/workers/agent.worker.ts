// Runs off main thread — 3D scene never blocks
const MODEL_MAP: Record<string, string> = {
  simple:      "microsoft/phi-3-mini-128k-instruct:free",
  reasoning:   "meta-llama/llama-3.1-8b-instruct:free",
  longContext: "microsoft/phi-3-mini-128k-instruct:free",
  general:     "mistralai/mistral-7b-instruct:free",
};

type TaskType = "simple" | "reasoning" | "longContext" | "general";

interface WorkerMessage {
  agentId: string;
  messages: { role: string; content: string }[];
  taskType?: TaskType;
}

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  const { agentId, messages, taskType = "general" } = e.data;

  self.postMessage({ agentId, status: "thinking" });

  // Truncate to 3000 chars per message (free tier safety)
  const safe = messages.map(m => ({ ...m, content: m.content.slice(0, 3000) }));

  let attempt = 0;
  const maxRetries = 3;

  while (attempt < maxRetries) {
    try {
      const res = await fetch("/api/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: MODEL_MAP[taskType],
          messages: safe,
          max_tokens: 512,
          temperature: 0.7,
        }),
      });

      if (res.status === 429) {
        // Rate limited — exponential backoff
        await new Promise(r => setTimeout(r, 3000 * Math.pow(2, attempt)));
        attempt++;
        continue;
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const result = data.choices?.[0]?.message?.content ?? "No response.";

      self.postMessage({ agentId, result, status: "done" });
      return;

    } catch (err) {
      attempt++;
      if (attempt >= maxRetries) {
        self.postMessage({ agentId, error: String(err), status: "error" });
      }
    }
  }
};
