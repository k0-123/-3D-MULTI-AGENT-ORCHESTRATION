import { AgentStatus } from "./agent";

export interface AgentUpdate {
  agentId: string;
  newStatus: AgentStatus;
  actionLog: string;
}

export interface Budget {
  limit: number;
  spent: number;
}

export interface RoadmapStep {
  agentId: string;
  task: string;
  status: "pending" | "completed" | "rejected";
  tools?: string[];
  skillId?: string;
  group?: string;
  reviewRequired?: boolean;
  complexity?: "fast" | "deep";
  outputFormat?: "text" | "markdown" | "html";
}

export type OrchestrateEvent =
  | { type: "roadmap"; data: RoadmapStep[] }
  | { type: "agent_update"; data: AgentUpdate }
  | { type: "budget_update"; data: Budget }
  | { type: "log"; data: { message: string; type?: "info" | "system" | "mcp" } }
  | { type: "step_complete"; data: { stepIndex: number; result: string } }
  | { type: "mission_complete"; data: { result: string } }
  | { type: "error"; data: { message: string } };
