import { useEffect, useState } from "react";
import { Sun, Moon, Activity } from "lucide-react";
import { useAgentStore } from "@/store/useAgentStore";
import { AgentConfigModal } from "./AgentConfigModal";

const statusColor: Record<string, string> = {
  idle: "bg-zinc-500/30 text-zinc-200 border-zinc-400/40",
  moving: "bg-amber-500/20 text-amber-200 border-amber-400/40 animate-pulse",
  working: "bg-emerald-500/20 text-emerald-200 border-emerald-400/40",
  learning: "bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-400/40 animate-pulse",
};

const logColor: Record<string, string> = {
  info: "text-white/80",
  system: "text-emerald-300",
  mcp: "text-cyan-300",
};

function LogTime({ ts }: { ts: number }) {
  const [text, setText] = useState("");
  useEffect(() => {
    if (ts) setText(new Date(ts).toLocaleTimeString());
    else setText("--:--:--");
  }, [ts]);
  return <span className="text-white/30">{text}</span>;
}

export function DashboardOverlay() {
  const agents = useAgentStore((s) => s.agents);
  const logs = useAgentStore((s) => s.logs);
  const timeOfDay = useAgentStore((s) => s.timeOfDay);
  const toggleTimeOfDay = useAgentStore((s) => s.toggleTimeOfDay);
  const setActiveModalAgent = useAgentStore((s) => s.setActiveModalAgent);
  const activeModalAgentId = useAgentStore((s) => s.activeModalAgentId);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col">
      {/* Top bar */}
      <div className="pointer-events-auto m-4 flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Activity size={16} className="text-emerald-400" />
          <h1 className="text-sm font-semibold tracking-wider text-white">
            MCP · 3D MULTI-AGENT ORCHESTRATION
          </h1>
          <span className="ml-2 text-[10px] uppercase tracking-[0.2em] text-white/50">
            {agents.length} agents · {timeOfDay} cycle
          </span>
        </div>
        <button
          onClick={toggleTimeOfDay}
          className="flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/10"
        >
          {timeOfDay === "day" ? <Moon size={14} /> : <Sun size={14} />}
          Toggle {timeOfDay === "day" ? "Night" : "Day"}
        </button>
      </div>

      <div className="flex flex-1 gap-4 px-4 pb-4 overflow-hidden">
        {/* Left panel — agent list */}
        <aside className="pointer-events-auto w-80 shrink-0 overflow-y-auto rounded-xl border border-white/10 bg-black/40 p-3 backdrop-blur-md">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/60">Agents</h2>
          <ul className="space-y-2">
            {agents.map((a) => (
              <li key={a.id}>
                <button
                  onClick={() => setActiveModalAgent(a.id)}
                  className={`w-full rounded-lg border p-2.5 text-left transition ${
                    activeModalAgentId === a.id
                      ? "border-cyan-400/60 bg-cyan-500/10 shadow-[0_0_18px_rgba(34,211,238,0.25)]"
                      : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: a.color }} />
                      <span className="text-sm font-semibold text-white">{a.name}</span>
                    </div>
                    <span className={`rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-wider ${statusColor[a.status]}`}>
                      {a.status}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-white/50">
                    <span className="uppercase tracking-wider">{a.role}</span>
                    <span className="font-mono">[{a.position.map((n) => n.toFixed(1)).join(", ")}]</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex-1" />
      </div>

      {/* Bottom: audit log */}
      <div className="pointer-events-auto m-4 mt-0 flex flex-col gap-2 rounded-xl border border-white/10 bg-black/50 p-3 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white/60">
            Audit Terminal · MCP Stream
          </h2>
          <span className="text-[10px] text-white/40">{logs.length} events</span>
        </div>
        <div className="h-44 overflow-y-auto rounded-md border border-white/5 bg-black/70 p-2 font-mono text-[11px] leading-relaxed">
          {logs.map((l) => (
            <div key={l.id} className="flex gap-2">
              <LogTime ts={l.timestamp} />
              <span className={`font-bold ${logColor[l.type]}`}>[{l.type.toUpperCase()}]</span>
              <span className={logColor[l.type]}>{l.message}</span>
            </div>
          ))}
        </div>
      </div>

      <AgentConfigModal />
    </div>
  );
}
