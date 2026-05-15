export type AgentStatus = "idle" | "moving" | "working" | "learning" | "reviewing";
export type Vec3 = [number, number, number];
export type TimeOfDay = "day" | "night";

export interface Agent {
  id: string;
  name: string;
  role: string;
  color: string;
  status: AgentStatus;
  position: Vec3;
  targetPosition: Vec3;
  personaPrompt: string;
  mcpTools: string[];
  knowledgeBase: string[];
  workstation: Vec3;
  currentTask?: string | null;
  lastResult?: string | null;
  speechBubble?: string | null;
  tasksCompleted?: number;
  sparkleAt?: number;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  message: string;
  type: "info" | "system" | "mcp";
}
