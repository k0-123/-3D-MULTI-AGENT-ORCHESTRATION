import { agentGraph } from "./graph";
import { AgentState } from "./state";

export async function* runAgentStream(task: string, currentGoal: string, env?: any, useOpenDesign = false) {
  const initial: AgentState = {
    task,
    messages: [],
    auditLog: [],
    activeIssues: [],
    agentUpdates: [],
    budget: { limit: 10.0, spent: 0.0 },
    roadmap: [],
    currentStepIndex: 0,
    workerOutput: "",
    reviewFeedback: null,
    result: "",
    retryCount: 0,
    error: null,
    useOpenDesign,
    activeDesignSystem: null,
    stepResults: {},
  };

  try {
    let latestResult = "";
    const stream = await agentGraph.stream(initial, { streamMode: "updates" });
    
    for await (const chunk of stream) {
      if (!chunk) continue;
      const [nodeName, nodeState] = Object.entries(chunk)[0] as [string, Partial<AgentState>];
      
      let newResultVal = nodeState.result || nodeState.workerOutput;
      let resultToSend = "";
      
      if (newResultVal && newResultVal !== latestResult) {
        latestResult = newResultVal;
        resultToSend = latestResult;
      }
      
      const currentAgentId = nodeState.agentUpdates?.[0]?.agentId 
        || nodeState.roadmap?.[nodeState.currentStepIndex || 0]?.agentId 
        || "worker";

      yield {
        agentId: nodeName === "review" || nodeName === "ceo" ? "ceo" : currentAgentId,
        targetAgentId: nodeName === "worker" ? "ceo" : (nodeName === "review" ? currentAgentId : null),
        actionLog: nodeState.agentUpdates?.[0]?.actionLog ?? "Processing...",
        newStatus: nodeState.agentUpdates?.[0]?.newStatus ?? "working",
        auditLog: nodeState.auditLog ?? [],
        budget: nodeState.budget,
        roadmap: nodeState.roadmap,
        result: resultToSend,
      };
    }
    
    yield { 
      status: "completed", 
      agentId: "system", 
      actionLog: "Mission successful.", 
      auditLog: ["[SYSTEM] Roadmap fully executed and validated."], 
      result: "" 
    };
  } catch (err) {
    console.error("[Orchestrator] Stream error:", err);
    yield { 
      status: "error", 
      agentId: "system", 
      actionLog: `Fatal: ${err}`, 
      auditLog: [`[ERROR] ${err}`], 
      result: "" 
    };
  }
}
