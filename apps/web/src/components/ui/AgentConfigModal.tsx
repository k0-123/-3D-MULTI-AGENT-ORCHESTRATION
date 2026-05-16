import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Brain, Database, Wrench, Upload, FileText } from "lucide-react";
import { useAgentStore } from "@/store/useAgentStore";

const AVAILABLE_TOOLS = ["Web Search", "GitHub", "Terminal"];

export function AgentConfigModal() {
  const activeId = useAgentStore((s) => s.activeModalAgentId);
  const agent = useAgentStore((s) => s.agents.find((a) => a.id === activeId));
  const close = useAgentStore((s) => s.setActiveModalAgent);
  const updateAgentConfig = useAgentStore((s) => s.updateAgentConfig);

  const [tab, setTab] = useState<"persona" | "rag" | "tools">("persona");
  const [persona, setPersona] = useState("");
  const [tools, setTools] = useState<string[]>([]);
  const [kb, setKb] = useState<string[]>([]);

  useEffect(() => {
    if (agent) {
      setPersona(agent.personaPrompt);
      setTools(agent.mcpTools);
      setKb(agent.knowledgeBase);
      setTab("persona");
    }
  }, [agent?.id]);

  const onSave = () => {
    if (!agent) return;
    updateAgentConfig(agent.id, { personaPrompt: persona, mcpTools: tools, knowledgeBase: kb });
    close(null);
  };

  return (
    <AnimatePresence>
      {agent && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="pointer-events-auto fixed inset-0 m-auto z-50 flex h-fit w-[480px] flex-col rounded-2xl border border-white/10 bg-[#0b0e16] p-8 shadow-[0_0_100px_rgba(0,0,0,0.8)]"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: agent.color }} />
                <h3 className="text-lg font-bold text-white">{agent.name}</h3>
              </div>
              <p className="text-xs uppercase tracking-widest text-white/50">{agent.role}</p>
            </div>
            <button onClick={() => close(null)} className="rounded-md p-1 text-white/60 hover:bg-white/10 hover:text-white">
              <X size={18} />
            </button>
          </div>

          <div className="mt-4 flex gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
            {[
              { id: "persona", label: "Persona", icon: Brain },
              { id: "rag", label: "Knowledge", icon: Database },
              { id: "tools", label: "MCP Tools", icon: Wrench },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id as typeof tab)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  tab === id ? "bg-cyan-500/20 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.3)]" : "text-white/60 hover:text-white"
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>

          <div className="mt-4 flex-1 overflow-y-auto">
            {tab === "persona" && (
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-widest text-white/50">System Prompt</label>
                <textarea
                  value={persona}
                  onChange={(e) => setPersona(e.target.value)}
                  rows={10}
                  className="w-full resize-none rounded-md border border-white/10 bg-black/40 p-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan-400/60"
                  placeholder="Describe how this agent should think and act..."
                />
              </div>
            )}

            {tab === "rag" && (
              <div className="space-y-3">
                <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-white/20 bg-white/5 p-6 text-center">
                  <Upload size={24} className="text-white/40" />
                  <p className="mt-2 text-sm text-white/70">Drag & drop files here</p>
                  <p className="text-xs text-white/40">PDF, MD, TXT, CSV</p>
                </div>
                <div className="space-y-1.5">
                  {kb.map((f) => (
                    <div key={f} className="flex items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-cyan-300" />
                        {f}
                      </div>
                      <button
                        onClick={() => setKb(kb.filter((x) => x !== f))}
                        className="text-xs text-white/40 hover:text-rose-300"
                      >
                        remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "tools" && (
              <div className="space-y-2">
                {AVAILABLE_TOOLS.map((t) => {
                  const on = tools.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => setTools(on ? tools.filter((x) => x !== t) : [...tools, t])}
                      className="flex w-full items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white transition hover:bg-white/10"
                    >
                      <span>{t}</span>
                      <span className={`relative h-5 w-9 rounded-full transition ${on ? "bg-cyan-500" : "bg-white/20"}`}>
                        <span
                          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${on ? "left-4" : "left-0.5"}`}
                        />
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={onSave}
            className="mt-4 rounded-md bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
          >
            Save Configuration
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
