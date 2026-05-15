import { AgentState } from "../state";

export async function advanceNode(state: AgentState): Promise<Partial<AgentState>> {
  const currentStep = state.roadmap[state.currentStepIndex];
  const newStepResults = { ...state.stepResults, [state.currentStepIndex]: state.workerOutput };
  
  const isLastStep = state.currentStepIndex >= state.roadmap.length - 1;
  
  if (isLastStep) {
    return {
      stepResults: newStepResults,
      result: state.workerOutput, // Final result is the last worker's output
      agentUpdates: [{ agentId: "ceo", newStatus: "idle", actionLog: "Mission Accomplished." }]
    };
  }

  return {
    stepResults: newStepResults,
    currentStepIndex: state.currentStepIndex + 1,
    workerOutput: "",
    reviewFeedback: null,
    agentUpdates: [{ agentId: "ceo", newStatus: "moving", actionLog: "Advancing to next mission phase." }]
  };
}
