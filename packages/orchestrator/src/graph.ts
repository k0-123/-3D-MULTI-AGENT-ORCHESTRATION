import { StateGraph, START, END } from "@langchain/langgraph";
import { AgentStateSchema } from "./state";
import { ceoNode } from "./nodes/ceo";
import { workerNode } from "./nodes/worker";
import { reviewNode } from "./nodes/review";
import { advanceNode } from "./nodes/advance";

const workflow = new StateGraph(AgentStateSchema)
  .addNode("ceo", ceoNode)
  .addNode("worker", workerNode)
  .addNode("review", reviewNode)
  .addNode("advance", advanceNode)
  
  .addEdge(START, "ceo")
  .addEdge("ceo", "worker")
  .addEdge("worker", "review")
  
  .addConditionalEdges("review", (state) => {
    if (state.reviewFeedback) return "worker"; // Back to worker for revisions
    return "advance";
  })
  
  .addConditionalEdges("advance", (state) => {
    if (state.result) return END; // Final result reached
    return "worker"; // Next step
  });

export const agentGraph = workflow.compile();
