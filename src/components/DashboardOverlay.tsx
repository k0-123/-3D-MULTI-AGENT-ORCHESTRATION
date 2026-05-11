import { useState } from "react";
import { useAgentStore } from "@/store/useAgentStore";

const statusColor: Record<string, string> = {
  idle: "bg-zinc-500/30 text-zinc-200 border-zinc-400/40",
  moving: "bg-amber-500/20 text-amber-200 border-amber-400/40 animate-pulse",
  working: "bg-emerald-500/20 text-emerald-200 border-emerald-400/40",
  meeting: "bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-400/40",
};

export function DashboardOverlay() {
  const agents = useAgentStore((s) => s.agents);
  const logs = useAgentStore((s) => s.logs);
  const runMission = useAgentStore((s) => s.runMission);
  const [input, setInput] = useState("");

  const submit = () => {
    if (!input.trim()) return;
    runMission(input.trim());
    setInput("");
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col">
      {/* Top bar */}
      <div className="pointer-events-auto m-4 flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-4 py-2 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
          <h1 className="text-sm font-semibold tracking-wider text-white">
            MCP · 3D MULTI-AGENT ORCHESTRATION
          </h1>
        </div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">
          voxel runtime · {agents.length} agents online
        </span>
      </div>

      <div className="flex flex-1 gap-4 px-4 pb-4 overflow-hidden">
        {/* Left panel — agent list */}
        <aside className="pointer-events-auto w-80 shrink-0 overflow-y-auto rounded-xl border border-white/10 bg-black/40 p-3 backdrop-blur-md">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/60">Agents</h2>
          <ul className="space-y-2">
            {agents.map((a) => (
              <li key={a.id} className="rounded-lg border border-white/10 bg-white/5 p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 rounded-sm"
                      style={{ backgroundColor: a.color }}
                    />
                    <span className="text-sm font-semibold text-white">{a.name}</span>
                    <span className="text-[10px] uppercase tracking-wider text-white/50">{a.role}</span>
                  </div>
                  <span className={`rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-wider ${statusColor[a.status]}`}>
                    {a.status}
                  </span>
                </div>
                <div className="mt-1 font-mono text-[10px] text-white/40">
                  [{a.current_location.map((n) => n.toFixed(1)).join(", ")}]
                </div>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex-1" />
      </div>

      {/* Bottom: audit log + command */}
      <div className="pointer-events-auto m-4 mt-0 flex flex-col gap-2 rounded-xl border border-white/10 bg-black/50 p-3 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white/60">
            Audit Log · MCP Calls & Dialogue
          </h2>
          <span className="text-[10px] text-white/40">{logs.length} events</span>
        </div>
        <div className="h-40 overflow-y-auto rounded-md border border-white/5 bg-black/60 p-2 font-mono text-[11px] leading-relaxed">
          {logs.map((l) => (
            <div key={l.id} className="flex gap-2">
              <span className="text-white/30">{new Date(l.ts).toLocaleTimeString()}</span>
              <span
                className={
                  l.kind === "mcp"
                    ? "text-cyan-300"
                    : l.kind === "dialogue"
                      ? "text-amber-200"
                      : "text-emerald-300"
                }
              >
                [{l.kind.toUpperCase()}]
              </span>
              {l.who && <span className="text-white/70">{l.who}:</span>}
              <span className="text-white/90">{l.text}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Give the team a mission..."
            className="flex-1 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan-400/50"
          />
          <button
            onClick={submit}
            className="rounded-md bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
