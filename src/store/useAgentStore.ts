import { create } from "zustand";

export type AgentStatus = "idle" | "moving" | "working" | "learning";
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
  sparkleAt?: number;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  message: string;
  type: "info" | "system" | "mcp";
}

// Outdoor workstations scattered around the data hub
export const WORKSTATIONS: Vec3[] = [
  [-10, 0, -8],
  [-12, 0, 4],
  [-6, 0, 10],
  [10, 0, -8],
  [12, 0, 4],
  [6, 0, 10],
];

export const DATA_HUB: Vec3 = [0, 0, 0];

// Positions agents take around the hub when learning at night
export const HUB_RING: Vec3[] = [
  [-3, 0, -3],
  [3, 0, -3],
  [-4, 0, 0],
  [4, 0, 0],
  [-3, 0, 3],
  [3, 0, 3],
];

const baseAgents = [
  { id: "ceo", name: "Karan", role: "CEO", color: "#f5c542" },
  { id: "senior", name: "Senior Builder", role: "Full Stack", color: "#42a5f5" },
  { id: "intern", name: "Intern Builder", role: "Full Stack", color: "#80deea" },
  { id: "offer", name: "Offer Architect", role: "Strategy", color: "#ab47bc" },
  { id: "growth", name: "Growth Hacker", role: "Growth", color: "#ef5350" },
  { id: "funnel", name: "Funnel Engineer", role: "Funnel", color: "#66bb6a" },
];

const initialAgents: Agent[] = baseAgents.map((b, i) => ({
  ...b,
  status: "idle" as AgentStatus,
  position: WORKSTATIONS[i],
  targetPosition: WORKSTATIONS[i],
  workstation: WORKSTATIONS[i],
  personaPrompt: `You are ${b.name}, the ${b.role}. Operate with precision and proactivity.`,
  mcpTools: ["Web Search"],
  knowledgeBase: ["framework.pdf", "playbook.md"],
}));

interface AgentStore {
  timeOfDay: TimeOfDay;
  activeModalAgentId: string | null;
  agents: Agent[];
  logs: LogEntry[];
  setTarget: (id: string, coords: Vec3) => void;
  setStatus: (id: string, status: AgentStatus) => void;
  setPosition: (id: string, coords: Vec3) => void;
  toggleTimeOfDay: () => void;
  updateAgentConfig: (id: string, config: Partial<Agent>) => void;
  setActiveModalAgent: (id: string | null) => void;
  addLog: (message: string, type?: LogEntry["type"]) => void;
}

const makeLog = (message: string, type: LogEntry["type"] = "info"): LogEntry => ({
  id: Math.random().toString(36).slice(2),
  timestamp: 0, // hydration-safe; rendered as relative
  message,
  type,
});

export const useAgentStore = create<AgentStore>((set, get) => ({
  timeOfDay: "day",
  activeModalAgentId: null,
  agents: initialAgents,
  logs: [
    makeLog("MCP Orchestrator online. 6 agents registered.", "system"),
    makeLog("Daylight protocol active. Agents at workstations.", "info"),
  ],
  setTarget: (id, coords) =>
    set((s) => ({
      agents: s.agents.map((a) =>
        a.id === id ? { ...a, targetPosition: coords, status: "moving" } : a,
      ),
    })),
  setStatus: (id, status) =>
    set((s) => ({ agents: s.agents.map((a) => (a.id === id ? { ...a, status } : a)) })),
  setPosition: (id, coords) =>
    set((s) => ({ agents: s.agents.map((a) => (a.id === id ? { ...a, position: coords } : a)) })),
  toggleTimeOfDay: () => {
    const { timeOfDay, addLog, agents } = get();
    const next: TimeOfDay = timeOfDay === "day" ? "night" : "day";
    set({ timeOfDay: next });
    if (next === "night") {
      addLog("Sunsetting daily operations. Karan: Initiating nighttime optimization protocol.", "system");
      agents.forEach((a, i) => {
        set((s) => ({
          agents: s.agents.map((x) =>
            x.id === a.id ? { ...x, targetPosition: HUB_RING[i], status: "moving" } : x,
          ),
        }));
      });
      // After arrival, mark as learning + inject feedback logs
      setTimeout(() => {
        get().agents.forEach((a) => get().setStatus(a.id, "learning"));
        addLog("Cross-referencing daily actions with ingested Knowledge Base.", "system");
      }, 4500);
      setTimeout(() => {
        addLog("Growth Hacker: updating strategy weights based on 'youtube_transcript_01.txt'.", "mcp");
      }, 6000);
      setTimeout(() => {
        addLog("Funnel Engineer: re-indexing conversion graph from 'analytics_q3.csv'.", "mcp");
      }, 7500);
    } else {
      addLog("Sunrise. Agents returning to workstations.", "system");
      get().agents.forEach((a) => {
        set((s) => ({
          agents: s.agents.map((x) =>
            x.id === a.id ? { ...x, targetPosition: x.workstation, status: "moving" } : x,
          ),
        }));
      });
    }
  },
  updateAgentConfig: (id, config) => {
    set((s) => ({
      agents: s.agents.map((a) =>
        a.id === id ? { ...a, ...config, sparkleAt: Date.now() } : a,
      ),
    }));
    const agent = get().agents.find((a) => a.id === id);
    if (agent) get().addLog(`Updated neural weights for ${agent.name}.`, "system");
  },
  setActiveModalAgent: (id) => set({ activeModalAgentId: id }),
  addLog: (message, type = "info") =>
    set((s) => ({
      logs: [...s.logs, { id: Math.random().toString(36).slice(2), timestamp: Date.now(), message, type }].slice(-200),
    })),
}));
