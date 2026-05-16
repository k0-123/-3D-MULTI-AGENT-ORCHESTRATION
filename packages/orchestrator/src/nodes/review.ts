import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { audit, sanitizeResponse } from "@repo/shared";
import { AgentState } from "../state";
import { resilientInvoke } from "../models/resilient-invoke";

export async function reviewNode(state: AgentState): Promise<Partial<AgentState>> {
  const currentStep = state.roadmap[state.currentStepIndex];
  if (!currentStep) return { error: "No step found" };

  console.log(`[Review] Reviewing work for: ${currentStep.agentId}`);

  const output = state.workerOutput || "";

  // Pre-Flight AST/HTML Validation (Self-Healing Gate)
  if (currentStep.agentId === "senior-developer") {
    const missingTailwind = !output.includes("cdn.tailwindcss.com");
    const missingReact = !output.includes("react@") && !output.includes("react-dom@");
    const missingBabel = !output.includes("babel.min.js");
    const unclosedScript = (output.match(/<script/g) || []).length !== (output.match(/<\/script>/g) || []).length;
    const unclosedDivs = (output.match(/<div/g) || []).length !== (output.match(/<\/div>/g) || []).length;

    let syntaxError = "";
    if (missingTailwind) syntaxError += "- Missing required Tailwind CSS CDN script.\n";
    if (missingReact) syntaxError += "- Missing required React or ReactDOM CDN scripts.\n";
    if (missingBabel) syntaxError += "- Missing required Babel standalone CDN script.\n";
    if (unclosedScript) syntaxError += "- Mismatched <script> tags (unclosed script block detected).\n";
    if (unclosedDivs) syntaxError += "- Mismatched <div> tags (unclosed JSX/HTML elements detected).\n";

    if (syntaxError) {
      console.warn(`[Review] Pre-flight AST/HTML validation failed. Triggering autonomous self-healing loop.`);
      const criticalFeedback = `CRITICAL SYNTAX / STRUCTURE ERROR DETECTED:\n${syntaxError}\nYou MUST fix these structural errors immediately and ensure all CDN scripts and JSX tags are properly closed.`;
      return {
        reviewFeedback: criticalFeedback,
        auditLog: [audit("ceo", `Pre-flight validation failed for ${currentStep.agentId}. Triggering self-healing repair.`)],
        agentUpdates: [{ agentId: "ceo", newStatus: "reviewing", actionLog: "Pre-flight validation failed. Requesting autonomous repair." }],
      };
    }
  }

  const systemPrompt = `You are the CEO Reviewer. Analyze the WORKER OUTPUT against the TASK.
  
TASK: ${currentStep.task}
WORKER OUTPUT: ${output}

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
