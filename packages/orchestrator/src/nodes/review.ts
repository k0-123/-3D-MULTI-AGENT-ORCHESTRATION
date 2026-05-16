import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { audit, sanitizeResponse } from "@repo/shared";
import { AgentState } from "../state";
import { resilientInvoke } from "../models/resilient-invoke";

export async function reviewNode(state: AgentState): Promise<Partial<AgentState>> {
  const currentStep = state.roadmap[state.currentStepIndex];
  if (!currentStep) return { error: "No step found" };

  console.log(`[Review] Reviewing work for: ${currentStep.agentId}`);

  const systemPrompt = `You are the CEO Reviewer. Analyze the WORKER OUTPUT against the TASK.
  
TASK: ${currentStep.task}
WORKER OUTPUT: ${state.workerOutput}

If the work is sufficient, respond with "APPROVED".
If it needs changes, respond with specific "FEEDBACK: [instructions]"`;

  const { content, tokenCost } = await resilientInvoke([
    new SystemMessage(systemPrompt),
    new HumanMessage("Review the output.")
  ], state, "minimax", state.env);

  const sanitized = sanitizeResponse(content);
  const isApproved = sanitized.toUpperCase().includes("APPROVED");
  const feedback = isApproved ? null : sanitized.replace(/FEEDBACK:\s*/i, "");

  return {
    reviewFeedback: feedback,
    budget: { ...state.budget, spent: state.budget.spent + tokenCost },
    auditLog: [audit("ceo", isApproved ? `Approved ${currentStep.agentId}'s work.` : `Requested revision for ${currentStep.agentId}.`)],
    agentUpdates: [{ agentId: "ceo", newStatus: "reviewing", actionLog: isApproved ? "Work approved." : "Feedback sent for revision." }],
  };
}
