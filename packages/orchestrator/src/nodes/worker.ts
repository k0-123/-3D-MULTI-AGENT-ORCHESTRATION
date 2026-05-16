import { HumanMessage } from "@langchain/core/messages";
import { audit, sanitizeResponse } from "@repo/shared";
import { AgentState } from "../state";
import { resilientInvoke } from "../models/resilient-invoke";
import { githubAction } from "../tools/github";
import { tavilySearch } from "../tools/search";
import { retrieveMemory, storeMemory } from "../tools/memory";
import { composePromptStack } from "../prompts/composer";
import { getHtmlPrompt, getTokensForSystem } from "../prompts/html-template";
import { FEW_SHOT_EXAMPLES } from "../prompts/few-shots";

export async function workerNode(state: AgentState): Promise<Partial<AgentState>> {
  const currentStep = state.roadmap[state.currentStepIndex];
  if (!currentStep) return { error: "No step found" };

  console.log(`[Worker] Executing: ${currentStep.agentId} -> ${currentStep.task}`);

  // 1. Context Gathering
  let githubContext = "";
  if (currentStep.agentId === "senior" && currentStep.task.toLowerCase().includes("github")) {
    // Basic tool routing logic
    if (currentStep.task.toLowerCase().includes("list")) {
      githubContext = await githubAction("list", {});
    }
  }

  let searchContext = "";
  if (currentStep.task.toLowerCase().includes("search") || currentStep.task.toLowerCase().includes("research")) {
    searchContext = await tavilySearch(currentStep.task);
  }

  let historicalContext = "";
  if (state.useOpenDesign) {
    const memories = await retrieveMemory(currentStep.task, currentStep.agentId, state.userId || undefined);
    if (memories.length > 0) {
      historicalContext = memories.join("\n");
    }
  }

  // 2. Prompting
  let systemPrompt = "";
  const isHtml = currentStep.outputFormat === "html";

  if (isHtml) {
    const tokens = getTokensForSystem(state.activeDesignSystem);
    systemPrompt = getHtmlPrompt(tokens, `${state.reviewFeedback ? `CRITICAL REVISION REQUESTED BY CEO:\n${state.reviewFeedback}\n\n` : ""}YOUR TASK: ${currentStep.task}`);
  } else {
    const fewShot = (FEW_SHOT_EXAMPLES as any)[currentStep.agentId] || "";
    systemPrompt = await composePromptStack({
      designSystemId: state.activeDesignSystem || undefined,
      skillId: currentStep.skillId,
      agentPersona: `You are ${currentStep.agentId}, a specialist on a professional team.`,
      includeBlueprints: currentStep.agentId === "designer",
      taskContext: `${state.reviewFeedback ? `CRITICAL REVISION REQUESTED BY CEO:\n${state.reviewFeedback}\n\n` : ""}YOUR TASK: ${currentStep.task}\n\n${fewShot ? `EXAMPLE OF PERFECT WORK:\n${fewShot}\n\n` : ""}${historicalContext ? `HISTORY:\n${historicalContext}\n\n` : ""}${githubContext ? "GITHUB:\n" + githubContext : ""}\n${searchContext ? "SEARCH:\n" + searchContext : ""}`
    });
  }

  // 3. Execution
  const { content, tokenCost } = await resilientInvoke([
    new HumanMessage(systemPrompt + "\n\nExecute the task now.")
  ], state, currentStep.complexity === "fast" ? "minimax" : "glm", state.env);

  const sanitized = sanitizeResponse(content);

  // 4. Memory Persistence
  if (state.useOpenDesign && !isHtml) {
    await storeMemory(sanitized, currentStep.agentId, currentStep.task, state.userId || undefined);
  }

  return {
    workerOutput: sanitized,
    budget: { ...state.budget, spent: state.budget.spent + tokenCost },
    auditLog: [audit(currentStep.agentId, `Task completed: ${currentStep.task.slice(0, 50)}...`)],
    agentUpdates: [{ agentId: currentStep.agentId, newStatus: "working", actionLog: `Completed: ${currentStep.task}` }],
  };
}
