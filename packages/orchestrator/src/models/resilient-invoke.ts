import { BaseMessage } from "@langchain/core/messages";
import { AgentState } from "../state";
import { 
  getGemini, 
  getGroq, 
  getOpenRouterGLM, 
  getOpenRouterMiniMax 
} from "./providers";

export async function resilientInvoke(
  messages: BaseMessage[],
  state: AgentState,
  preferredModel?: "minimax" | "glm"
): Promise<{ content: string; tokenCost: number }> {
  if (state.budget.spent >= state.budget.limit) throw new Error("Budget exhausted.");
  
  const attempts = [];
  if (preferredModel === "glm") {
    attempts.push({ name: "OpenRouter GLM", fn: getOpenRouterGLM });
    attempts.push({ name: "OpenRouter MiniMax", fn: getOpenRouterMiniMax });
  } else {
    attempts.push({ name: "OpenRouter MiniMax", fn: getOpenRouterMiniMax });
    attempts.push({ name: "OpenRouter GLM", fn: getOpenRouterGLM });
  }
  
  attempts.push({ name: "Groq", fn: getGroq });
  attempts.push({ name: "Gemini", fn: getGemini });

  for (const { name, fn } of attempts) {
    const model = fn();
    if (!model) continue;
    
    let timeoutId: NodeJS.Timeout | undefined;
    try {
      console.log(`[Orchestrator] Invoking ${name}...`);
      
      const response = await Promise.race([
        model.invoke(messages),
        new Promise((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error(`${name} timeout after 90s`));
          }, 90000);
        })
      ]) as any;
      
      if (timeoutId) clearTimeout(timeoutId);
      
      const content = typeof response.content === "string" ? response.content : JSON.stringify(response.content);
      const tokenCost = (content.length / 4) * 0.000000075;
      console.log(`[Orchestrator] ${name} success.`);
      return { content, tokenCost };
    } catch (err) {
      if (timeoutId) clearTimeout(timeoutId);
      console.warn(`[Invoke] ${name} failed: ${err || "Unknown error"}`);
    }
  }
  throw new Error("All LLM attempts failed.");
}
