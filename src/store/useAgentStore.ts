import { create } from "zustand";

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

// Extended workstations for 8 potential agents
export const WORKSTATIONS: Vec3[] = [
  [-10, 0, -8],
  [-12, 0, 4],
  [-6, 0, 10],
  [10, 0, -8],
  [12, 0, 4],
  [6, 0, 10],
  [0, 0, 12],
  [0, 0, -12],
];

export const DATA_HUB: Vec3 = [0, 0, 0];

// Expanded ring for 8 agents
export const HUB_RING: Vec3[] = [
  [-3, 0, -3],
  [3, 0, -3],
  [-4, 0, 0],
  [4, 0, 0],
  [-3, 0, 3],
  [3, 0, 3],
  [0, 0, 4.5],
  [0, 0, -4.5],
];

const baseAgents = [
  { id: "ceo", name: "Karan", role: "CEO", color: "#f5c542" },
  { id: "senior", name: "Senior Builder", role: "Full Stack", color: "#42a5f5" },
  { id: "intern", name: "Intern Builder", role: "Full Stack", color: "#80deea" },
  { id: "offer", name: "Offer Architect", role: "Strategy", color: "#ab47bc" },
  { id: "growth", name: "Growth Hacker", role: "Growth", color: "#ef5350" },
  { id: "funnel", name: "Funnel Engineer", role: "Funnel", color: "#66bb6a" },
  { id: "designer", name: "Visual Designer", role: "Design", color: "#ec4899" },
  { id: "deck_master", name: "Deck Master", role: "Presentation", color: "#f97316" },
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
  currentTask: null,
  lastResult: null,
  speechBubble: null,
  tasksCompleted: 0,
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
  runOrchestration: (prompt: string, issueId?: string) => Promise<void>;
  createIssue: (title: string, assignee: string, priority?: 'low' | 'medium' | 'high') => string;
  approveTask: () => Promise<void>;
  runMorningRoutine: () => Promise<void>;
  userId: string | null;
  setUserId: (id: string | null) => void;
  fetchInitialData: () => Promise<void>;
  // --- Paperclip Patterns ---
  currentGoal: string;
  budget: { limit: number; spent: number };
  activeIssues: { 
    id: string; 
    title: string; 
    status: 'todo' | 'in_progress' | 'completed' | 'blocked' | 'reviewing'; 
    assignee: string;
    priority: 'low' | 'medium' | 'high';
    reason?: string;
  }[];
  deleteIssue: (id: string) => void;
  updateIssueStatus: (id: string, status: 'todo' | 'in_progress' | 'completed' | 'blocked' | 'reviewing', reason?: string) => void;
  inbox: { id: string; type: string; from: string; content: string; metadata?: any }[];
  requestHire: (role: string, color: string) => void;
  resolveInboxItem: (id: string) => void;
  hireAgent: (metadata: { role: string; color: string }) => void;
  deliverables: { id: string; agentId: string; issueId?: string; content: string; timestamp: number; auditLog?: string[] }[];
  addDeliverable: (deliverable: { id: string; agentId: string; issueId?: string; content: string; timestamp: number; auditLog?: string[] }) => void;
  resolveDeliverable: (id: string) => void;
  clearDeliverables: () => void;
  clearAllIssues: () => void;
  // --- Routines & Goals ---
  companyGoals: { id: string; text: string; status: "pending" | "completed" }[];
  routines: { id: string; title: string; assignee: string; instructions: string; project: string }[];
  roadmap: { agentId: string; task: string; status: "pending" | "completed" | "rejected" }[];
  addGoal: (text: string) => void;
  toggleGoal: (id: string) => void;
  addRoutine: (routine: any) => void;
  removeRoutine: (id: string) => void;
  useOpenDesign: boolean;
  toggleOpenDesign: () => void;
}

const makeLog = (message: string, type: LogEntry["type"] = "info"): LogEntry => ({
  id: Math.random().toString(36).slice(2),
  timestamp: Date.now(),
  message,
  type,
});

import { supabase } from "../lib/supabase";

export const useAgentStore = create<AgentStore>((set, get) => ({
  userId: null,
  setUserId: (id) => set({ userId: id }),
  fetchInitialData: async () => {
    const { userId } = get();
    if (!userId) return;

    // Fetch Issues
    const { data: issues } = await supabase
      .from('issues')
      .select('*')
      .eq('user_id', userId);
    
    if (issues) {
      set((s) => {
        // Keep local "in_progress" issues that haven't synced yet
        const localInProgress = s.activeIssues.filter(i => i.status === 'in_progress' && !issues.find(ri => ri.id === i.id));
        return { activeIssues: [...issues, ...localInProgress] as any };
      });
    }

    // Fetch Deliverables
    const { data: deliverables } = await supabase
      .from('deliverables')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });
    
    if (deliverables) {
      set((s) => {
        // Merge local deliverables that aren't in the DB yet
        const dbIds = new Set(deliverables.map(d => d.id));
        const locals = s.deliverables.filter(d => !dbIds.has(d.id));
        return { deliverables: [...deliverables, ...locals] as any };
      });
    }
  },
  timeOfDay: "day",
  activeModalAgentId: null,
  agents: initialAgents,
  logs: [
    makeLog("MCP Orchestrator online. 7 agents registered.", "system"),
    makeLog("Daylight protocol active. Agents at workstations.", "info"),
  ],
  currentGoal: "Complete the assigned project efficiently and safely.",
  budget: { limit: 10.0, spent: 0 },
  activeIssues: [],
  inbox: [],
  deliverables: [],
  companyGoals: [
    { id: "g1", text: "Scale AI Orchestration to 100 concurrent nodes", status: "pending" },
    { id: "g2", text: "Integrate multi-model fallback (OpenRouter + Groq)", status: "completed" },
  ],
  routines: [],
  roadmap: [],
  addGoal: (text) => set((s) => ({ companyGoals: [...s.companyGoals, { id: Math.random().toString(36).slice(2), text, status: "pending" }] })),
  toggleGoal: (id) => set((s) => ({ companyGoals: s.companyGoals.map(g => g.id === id ? { ...g, status: g.status === "completed" ? "pending" : "completed" } : g) })),
  addRoutine: (routine) => set((s) => ({ routines: [...s.routines, { ...routine, id: Math.random().toString(36).slice(2) }] })),
  removeRoutine: (id) => set((s) => ({ routines: s.routines.filter(r => r.id !== id) })),
  useOpenDesign: false,
  toggleOpenDesign: () => set((s) => ({ useOpenDesign: !s.useOpenDesign })),
  addDeliverable: (deliverable) => set((s) => {
    // Prevent duplicates by content hash or ID
    const exists = s.deliverables.some(d => d.id === deliverable.id || (d.content === deliverable.content && d.issueId === deliverable.issueId));
    if (exists) return s;
    return {
      deliverables: [deliverable, ...s.deliverables].slice(0, 100), // Keep latest 100, newest first
    };
  }),
  resolveDeliverable: (id) => set((s) => ({ deliverables: s.deliverables.filter(d => d.id !== id) })),
  clearDeliverables: () => set({ deliverables: [] }),
  hireAgent: (meta) => {
    const { agents, addLog } = get();
    const id = meta.role.toLowerCase().replace(" ", "_");
    if (agents.some(a => a.id === id)) return;

    const newAgent: Agent = {
      id,
      name: meta.role,
      role: meta.role,
      color: meta.color,
      status: "idle",
      position: [0, 0, 0],
      targetPosition: [0, 0, 0],
      workstation: [0, 0, 0],
      personaPrompt: `You are the ${meta.role}. You have been hired to enhance the company's output quality.`,
      mcpTools: ["Creative Suite", "Search"],
      knowledgeBase: ["brand_guidelines.pdf"],
    };

    set({ agents: [...agents, newAgent] });
    addLog(`HR: Successfully hired new ${meta.role}! Agent added to roster.`, "system");
  },
  requestHire: (role, color) => {
    const id = `hire-${Math.random().toString(36).slice(2, 6)}`;
    set((s) => ({
      inbox: [
        ...s.inbox,
        {
          id,
          type: "hire_request",
          from: "ceo",
          content: `CEO (Karan): Proposing to hire a new ${role} agent to expand our capabilities.`,
          metadata: { role, color },
        },
      ],
    }));
    get().addLog(`Board: CEO has submitted a formal hire request for ${role}.`, "system");
  },
  clearAllIssues: () => {
    const { userId, agents } = get();
    set({ activeIssues: [], roadmap: [] });
    
    // Reset all agents
    agents.forEach(a => {
      get().setStatus(a.id, "idle");
      get().setTarget(a.id, a.workstation);
    });

    if (userId) {
      supabase.from('issues').delete().eq('user_id', userId)
        .then(({ error }) => { if (error) console.error('[Supabase] delete issues:', error); });
    }
    get().addLog("SYSTEM: All missions cleared and agents reset.", "system");
  },
  deleteIssue: (id) => set((s) => ({ activeIssues: s.activeIssues.filter(i => i.id !== id) })),
  updateIssueStatus: (id, status, reason) => {
    set((s) => {
      const issues = s.activeIssues.map(i => 
        i.id === id ? { ...i, status, reason: reason || i.reason } : i
      );
      
      // Sync to Supabase
      const { userId } = get();
      if (userId) {
        const issue = issues.find(i => i.id === id);
        if (issue) {
          supabase.from('issues').upsert({
            ...issue,
            user_id: userId
          }).then(({ error }) => { if (error) console.error('[Supabase] upsert issue:', error); });
        }
      }

      // If blocked, add to inbox
      let newInbox = s.inbox;
      if (status === 'blocked') {
        const issue = issues.find(i => i.id === id);
        newInbox = [
          ...s.inbox,
          {
            id: `blocked-${id}`,
            type: 'blocked_alert',
            from: issue?.assignee || 'system',
            content: `CRITICAL: Task "${issue?.title}" is BLOCKED. Reason: ${reason || 'Unknown error'}`
          }
        ];
      }

      return { activeIssues: issues, inbox: newInbox };
    });
    get().addLog(`System: Issue ${id} transitioned to ${status}.`, "info");
  },
  resolveInboxItem: (id) => set({ inbox: get().inbox.filter(i => i.id !== id) }),
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
            x.id === a.id ? { ...x, targetPosition: HUB_RING[i] || DATA_HUB, status: "moving" } : x,
          ),
        }));
      });
      setTimeout(() => {
        get().agents.forEach((a) => get().setStatus(a.id, "learning"));
        addLog("Cross-referencing daily actions with ingested Knowledge Base.", "system");
      }, 4500);
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
  },
  setActiveModalAgent: (id) => set({ activeModalAgentId: id }),
  addLog: (message, type = "info") =>
    set((s) => ({
      logs: [...s.logs, { id: Math.random().toString(36).slice(2), timestamp: Date.now(), message, type }].slice(-200),
    })),
  createIssue: (title, assignee, priority = 'medium') => {
    const id = `task-${Math.random().toString(36).slice(2, 6)}`;
    const newIssue: any = { id, title, status: 'todo', assignee, priority };
    
    set((s) => ({
      activeIssues: [
        ...s.activeIssues,
        newIssue
      ]
    }));

    // Sync to Supabase
    const { userId } = get();
    if (userId) {
      supabase.from('issues').insert({
        ...newIssue,
        user_id: userId
      }).then(({ error }) => { if (error) console.error('[Supabase] insert issue:', error); });
    }

    return id;
  },
  runOrchestration: async (prompt: string, issueId?: string) => {
    const { addLog, setStatus } = get();
    addLog(`Initiating orchestration: "${prompt}"`, "system");

    // Use existing issue or create a local one for tracking
    const id = issueId || `LOCAL-${Math.random().toString(36).slice(2, 6)}`;
    if (!issueId) {
      set((s) => ({
        activeIssues: [...s.activeIssues, {
          id,
          title: prompt,
          status: "in_progress",
          assignee: "ceo",
          priority: "medium"
        }]
      }));
    } else {
      get().updateIssueStatus(id, 'in_progress');
    }

    // Force immediate local state update to ensure Kanban sees it
    const currentIssues = get().activeIssues;
    if (!currentIssues.find(i => i.id === id)) {
      set({ activeIssues: [...currentIssues, { id, title: prompt, status: 'in_progress', assignee: 'ceo', priority: 'medium' }] });
    }

    try {
      const response = await fetch("/api/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt, 
          currentGoal: get().currentGoal, 
          issueId: id,
          useOpenDesign: get().useOpenDesign 
        }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const reader = response.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const raw = decoder.decode(value, { stream: true });
        buffer += raw;

        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          const line = event.trim();
          if (!line || !line.startsWith("data: ")) continue;

          try {
            const data = JSON.parse(line.slice(6));
            
            if (data.agentId && data.agentId !== "system") {
              setStatus(data.agentId, data.newStatus || "working");
              
              /* 
              // Multi-Agent Spatial Move disabled as per user request to prioritize results
              if (data.targetAgentId && data.agentId !== "system") {
                const initiatorId = data.agentId;
                const targetId = data.targetAgentId;
                const targetAgent = get().agents.find(a => a.id === targetId);
                if (targetAgent && initiatorId !== targetId) {
                  const { setTarget, addLog } = get();
                  addLog(`NAV: ${initiatorId.toUpperCase()} is coordinating with ${targetId.toUpperCase()}.`, "info");
                  setTarget(initiatorId, [targetAgent.workstation[0] + 1.2, targetAgent.workstation[1], targetAgent.workstation[2] + 1.2]);
                }
              }
              */

              if (data.actionLog) {
                addLog(`${data.agentId.toUpperCase()}: ${data.actionLog}`, "info");
              }
              if (data.result && data.result.trim().length > 0) {
                const deliverable = {
                  id: `res-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
                  agentId: data.agentId,
                  issueId: id,
                  content: data.result,
                  timestamp: Date.now(),
                  auditLog: data.auditLog || [],
                };
                
                get().addDeliverable(deliverable);
                addLog(`RESULT: ${data.agentId.toUpperCase()} delivered output (${data.result.length} chars).`, "system");

                const { userId } = get();
                if (userId) {
                  supabase.from('deliverables').insert({
                    ...deliverable,
                    user_id: userId
                  }).then(({ error }) => { if (error) console.error('[Supabase] insert deliverable:', error); });
                }
              }
            }

            if (data.auditLog?.length) {
              data.auditLog.forEach((msg: string) => addLog(msg, "system"));
            }

            if (data.budget) {
              set({ budget: data.budget });
            }

            if (data.activeIssues?.length) {
              set((s) => {
                // Surgical replacement: only remove the local placeholder if the "real" issue has arrived
                const incomingIds = new Set(data.activeIssues.map((i: any) => i.id));
                const filtered = s.activeIssues.filter(i => {
                  if (i.id.startsWith("LOCAL-") && i.title === prompt) {
                    // If we have an incoming issue that isn't the local one, we can drop the local one
                    return false; 
                  }
                  return true;
                });
                
                const issues = [...filtered];
                data.activeIssues.forEach((issue: any) => {
                  const idx = issues.findIndex(i => i.id === issue.id);
                  if (idx > -1) issues[idx] = issue;
                  else issues.push(issue);
                });
                return { activeIssues: issues };
              });
            }

            if (data.roadmap) {
              set({ roadmap: data.roadmap });
            }

            if (data.status === "completed") {
              addLog("Mission successful. System returning to standby.", "system");
              // Capture any final result before marking completed
              if (data.result && data.result.trim().length > 0) {
                const finalDeliverable = {
                  id: `res-${Date.now()}-final`,
                  agentId: data.agentId || 'system',
                  issueId: id,
                  content: data.result,
                  timestamp: Date.now(),
                };
                get().addDeliverable(finalDeliverable);
              }
              
              // Small delay so UI sees the transition clearly
              get().updateIssueStatus(id, 'completed');

              get().agents.forEach(a => {
                get().setStatus(a.id, "idle");
                get().setTarget(a.id, a.workstation);
              });
            }

            if (data.status === "error") {
              addLog(`CRITICAL: ${data.actionLog}`, "system");
              get().agents.forEach(a => get().setStatus(a.id, "idle"));
            }
          } catch (parseErr) {
            console.warn("[Orchestration] SSE Parse Error:", parseErr);
          }
        }
      }
    } catch (error: any) {
      get().addLog(`Orchestration error: ${error.message}`, "system");
      get().agents.forEach(a => get().setStatus(a.id, "idle"));
    }
  },
  approveTask: async () => {
    const { addLog } = get();
    addLog("User: Final Approval granted. Closing active issues...", "system");
    set({ activeIssues: get().activeIssues.map(i => i.status === "completed" ? { ...i, status: "completed" } : i) });
  },
  runMorningRoutine: async () => {
    const { runOrchestration } = get();
    await runOrchestration("Good morning. Provide a strategic review of the project.");
  },
}));
