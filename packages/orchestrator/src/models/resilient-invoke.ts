import { BaseMessage } from "@langchain/core/messages";
import { AgentState } from "../state";
import { 
  getGemini, 
  getGroq, 
  getOpenAI,
  getCodex
} from "./providers";

export async function resilientInvoke(
  messages: BaseMessage[],
  state: AgentState,
  preferredModel?: "minimax" | "glm",
  env?: any
): Promise<{ content: string; tokenCost: number }> {
  if (state.budget.spent >= state.budget.limit) throw new Error("Budget exhausted.");
  
  const attempts = [];
  
  if (preferredModel === "minimax") {
    attempts.push({ name: "Codex", fn: () => getCodex(env?.CODEX_API_KEY) });
    attempts.push({ name: "OpenAI", fn: () => getOpenAI(env?.OPENAI_API_KEY) });
  } else {
    attempts.push({ name: "OpenAI", fn: () => getOpenAI(env?.OPENAI_API_KEY) });
    attempts.push({ name: "Codex", fn: () => getCodex(env?.CODEX_API_KEY) });
  }
  
  attempts.push({ name: "Groq", fn: () => getGroq(env?.GROQ_API_KEY) });
  attempts.push({ name: "Gemini", fn: () => getGemini(env?.GOOGLE_GENERATIVE_AI_API_KEY || env?.GEMINI_API_KEY) });
  for (const { name, fn } of attempts) {
    let timeoutId: NodeJS.Timeout | undefined;
    try {
      console.log(`[Orchestrator] Invoking ${name}...`);

      let response;
      if (name === "OpenAI" || name === "Codex") {
        // Manual fetch to bypass LangChain/OpenAI SDK parsing errors in Cloudflare Workers
        const apiKey = name === "OpenAI" ? env?.OPENAI_API_KEY : env?.CODEX_API_KEY;
        if (!apiKey) {
          console.warn(`[Invoke] ${name} skipped: Missing API Key`);
          continue;
        }

        const model = name === "OpenAI" ? "gpt-5.5" : "gpt-5.3-codex";
        const rawResponse = await fetch("https://api.freemodel.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: messages.map(m => ({
              role: m._getType() === "system" ? "system" : m._getType() === "human" ? "user" : "assistant",
              content: m.content,
            })),
            max_tokens: 2048,
          }),
        });

        if (!rawResponse.ok) {
          throw new Error(`Freemodel API error: ${rawResponse.status} ${await rawResponse.text()}`);
        }

        const json = await rawResponse.json() as any;
        response = { content: json.choices[0].message.content };
      } else {
        const model = fn();
        if (!model) {
          console.warn(`[Invoke] ${name} skipped: Missing API Key`);
          continue;
        }

        response = await Promise.race([
          model.invoke(messages),
          new Promise((_, reject) => {
            timeoutId = setTimeout(() => {
              reject(new Error(`${name} timeout after 90s`));
            }, 90000);
          })
        ]) as any;
      }

      if (timeoutId) clearTimeout(timeoutId);

      const content = typeof response.content === "string" ? response.content : JSON.stringify(response.content);
      const tokenCost = (content.length / 4) * 0.000000075;
      console.log(`[Orchestrator] ${name} success.`);
      return { content, tokenCost };
    } catch (err) {
      if (timeoutId) clearTimeout(timeoutId);
      console.warn(`[Invoke] ${name} failed: ${err instanceof Error ? err.stack : err}`);
    }
  }
  throw new Error("All LLM attempts failed.");
}
