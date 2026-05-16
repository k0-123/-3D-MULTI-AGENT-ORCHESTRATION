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

/** Flat SSE event shape emitted by packages/orchestrator/src/stream.ts */
export interface OrchestrateEvent {
  agentId?: string;
  targetAgentId?: string | null;
  actionLog?: string;
  newStatus?: AgentStatus;
  auditLog?: string[];
  budget?: Budget;
  roadmap?: RoadmapStep[];
  result?: string;
  activeIssues?: any[];
  status?: "completed" | "error";
}

