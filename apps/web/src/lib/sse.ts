import { OrchestrateEvent } from "@repo/shared";

export async function consumeSSE(
  response: Response,
  onEvent: (event: OrchestrateEvent) => void,
  onDone: () => void,
  onError: (error: Error) => void
) {
  const reader = response.body?.getReader();
  if (!reader) {
    onError(new Error("No response body"));
    return;
  }

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        onDone();
        break;
      }

      const raw = decoder.decode(value, { stream: true });
      buffer += raw;

      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";

      for (const event of events) {
        const lines = event.split("\n");
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || !trimmedLine.startsWith("data: ")) continue;

          try {
            const data = JSON.parse(trimmedLine.slice(6)) as OrchestrateEvent;
            onEvent(data);
          } catch (parseErr) {
            console.warn("[SSE] Parse Error:", parseErr, "Line:", trimmedLine);
          }
        }
      }
    }
  } catch (err: any) {
    onError(err);
  } finally {
    reader.releaseLock();
  }
}
