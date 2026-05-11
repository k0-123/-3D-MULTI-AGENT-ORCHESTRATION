import { create } from "zustand";

export type AgentStatus = "idle" | "moving" | "working" | "meeting";
export type Vec3 = [number, number, number];

export interface Agent {
  id: string;
  name: string;
  role: string;
  color: string;
  status: AgentStatus;
  current_location: Vec3;
  target_location: Vec3;
}

export interface LogEntry {
  id: string;
  ts: number;
  kind: "mcp" | "dialogue" | "system";
  who?: string;
  text: string;
}

// Fixed coordinates
export const DESKS: Record<string, Vec3> = {
  "Desk 1": [-8, 0, -6],
  "Desk 2": [-8, 0, 0],
  "Desk 3": [-8, 0, 6],
  "Desk 4": [8, 0, -6],
  "Desk 5": [8, 0, 0],
  "Desk 6": [8, 0, 6],
};
export const MEETING_HUB: Vec3 = [0, 0, 0];

// Meeting seat positions around the hub
export const MEETING_SEATS: Vec3[] = [
  [-2.5, 0, -2.5],
  [2.5, 0, -2.5],
  [-2.5, 0, 2.5],
  [2.5, 0, 2.5],
  [0, 0, -3.5],
  [0, 0, 3.5],
];

const initialAgents: Agent[] = [
  { id: "ceo", name: "Tony", role: "CEO", color: "#f5c542", status: "idle", current_location: DESKS["Desk 1"], target_location: DESKS["Desk 1"] },
  { id: "arch", name: "Alex", role: "Architect", color: "#42a5f5", status: "idle", current_location: DESKS["Desk 2"], target_location: DESKS["Desk 2"] },
  { id: "rain", name: "Jordan", role: "Rainmaker", color: "#66bb6a", status: "idle", current_location: DESKS["Desk 3"], target_location: DESKS["Desk 3"] },
  { id: "growth", name: "Gary", role: "Growth", color: "#ef5350", status: "idle", current_location: DESKS["Desk 4"], target_location: DESKS["Desk 4"] },
  { id: "funnel", name: "Russell", role: "Funnel", color: "#ab47bc", status: "idle", current_location: DESKS["Desk 5"], target_location: DESKS["Desk 5"] },
  { id: "ops", name: "Seth", role: "Ops", color: "#26c6da", status: "idle", current_location: DESKS["Desk 6"], target_location: DESKS["Desk 6"] },
];

interface AgentStore {
  agents: Agent[];
  logs: LogEntry[];
  setAgentStatus: (id: string, status: AgentStatus) => void;
  setAgentTarget: (id: string, target: Vec3) => void;
  setAgentLocation: (id: string, loc: Vec3) => void;
  log: (entry: Omit<LogEntry, "id" | "ts">) => void;
  runMission: (mission: string) => void;
}

export const useAgentStore = create<AgentStore>((set, get) => ({
  agents: initialAgents,
  logs: [
    { id: "boot", ts: Date.now(), kind: "system", text: "MCP Orchestrator online. 6 agents registered." },
  ],
  setAgentStatus: (id, status) =>
    set((s) => ({ agents: s.agents.map((a) => (a.id === id ? { ...a, status } : a)) })),
  setAgentTarget: (id, target) =>
    set((s) => ({ agents: s.agents.map((a) => (a.id === id ? { ...a, target_location: target, status: "moving" } : a)) })),
  setAgentLocation: (id, loc) =>
    set((s) => ({ agents: s.agents.map((a) => (a.id === id ? { ...a, current_location: loc } : a)) })),
  log: (entry) =>
    set((s) => ({
      logs: [...s.logs, { ...entry, id: Math.random().toString(36).slice(2), ts: Date.now() }].slice(-200),
    })),
  runMission: (mission) => {
    const { log, setAgentTarget, setAgentStatus } = get();
    log({ kind: "system", text: `> Mission received: "${mission}"` });
    log({ kind: "mcp", who: "MCP", text: "tool.invoke → ceo.analyze_mission()" });
    log({ kind: "dialogue", who: "Tony (CEO)", text: "CEO analyzing mission." });

    setAgentTarget("ceo", DESKS["Desk 1"]);

    setTimeout(() => {
      log({ kind: "dialogue", who: "Tony (CEO)", text: "CEO calling meeting." });
      log({ kind: "mcp", who: "MCP", text: "tool.invoke → orchestrator.summon(['ceo','arch','ops'])" });
      setAgentTarget("ceo", MEETING_SEATS[0]);
      setAgentTarget("arch", MEETING_SEATS[1]);
      setAgentTarget("ops", MEETING_SEATS[2]);
    }, 2000);

    setTimeout(() => {
      const ids = ["ceo", "arch", "ops"];
      ids.forEach((id) => setAgentStatus(id, "meeting"));
      log({ kind: "system", text: "Meeting in session at Central Hub." });
    }, 6500);
  },
}));
