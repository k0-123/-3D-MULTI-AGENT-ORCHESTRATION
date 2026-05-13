import { useAgentStore } from "@/store/useAgentStore";
import { X, Send, User, Code, Zap, Palette, Terminal, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export function AgentOverlay() {
  const activeId = useAgentStore((s) => s.activeModalAgentId);
  const agents = useAgentStore((s) => s.agents);
  const setActiveModalAgent = useAgentStore((s) => s.setActiveModalAgent);
  const [msg, setMsg] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [chat, setChat] = useState<{role: 'agent'|'user', content: string}[]>([]);

  const agent = agents.find((a) => a.id === activeId);
  
  useEffect(() => {
    if (agent) {
      setChat([{ role: 'agent', content: `Hello boss. I'm ${agent.name}. I'm currently focused on the ${agent.role} aspects of our mission. What's the plan?` }]);
    }
  }, [activeId]);

  if (!agent) return null;

  const handleSend = () => {
    if (!msg.trim()) return;
    const userMsg = msg;
    setChat(prev => [...prev, { role: 'user', content: userMsg }]);
    setMsg("");
    setIsThinking(true);
    
    setTimeout(() => {
      setIsThinking(false);
      setChat(prev => [...prev, { role: 'agent', content: `Understood. Analyzing "${userMsg}"... I'll incorporate this into my current ${agent.status} cycle.` }]);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-between p-8 pointer-events-none">
      {/* Left side: Chat Terminal */}
      <div className="w-1/3 h-2/3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col pointer-events-auto shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <Terminal className="text-cyan-400" size={20} />
          </div>
          <div>
            <h3 className="text-white font-bold tracking-tight">Direct Terminal</h3>
            <p className="text-white/40 text-[10px] uppercase font-mono">Channel: {agent.name.toLowerCase()}_secure</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
          {chat.map((c, i) => (
            <div key={i} className={`rounded-xl p-4 text-xs leading-relaxed border ${
              c.role === 'agent' ? 'bg-white/5 text-white/70 border-white/5' : 'bg-cyan-500/10 text-cyan-200 border-cyan-500/20 ml-4'
            }`}>
              {c.content}
            </div>
          ))}
          {isThinking && (
            <div className="flex items-center gap-2 text-[10px] text-cyan-400 font-mono animate-pulse">
              <Loader2 size={12} className="animate-spin" />
              AGENT_THINKING...
            </div>
          )}
        </div>

        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="relative"
        >
          <input
            type="text"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder={`Message ${agent.name}...`}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition"
          />
          <button 
            type="submit"
            className="absolute right-2 top-2 p-1.5 bg-cyan-500 rounded-lg text-black hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            disabled={isThinking}
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* Center: Close Button */}
      <button 
        onClick={() => setActiveModalAgent(null)}
        className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition pointer-events-auto backdrop-blur-md border border-white/10 shadow-xl"
      >
        <X size={24} />
      </button>

      {/* Right side: Agent Dossier */}
      <div className="w-1/3 h-2/3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col pointer-events-auto shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full mx-auto mb-4 flex items-center justify-center border border-white/10 shadow-inner">
            <User size={32} style={{ color: agent.color }} />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{agent.name}</h2>
          <p className="text-cyan-400 text-xs font-mono uppercase tracking-widest mt-1">{agent.role}</p>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-white/30 text-[10px] uppercase font-bold tracking-widest mb-3">Skill Matrix</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: <Code size={14} />, label: "Development", val: "94%" },
                { icon: <Zap size={14} />, label: "Efficiency", val: "88%" },
                { icon: <Palette size={14} />, label: "UI/UX", val: "76%" },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <div className="flex items-center gap-2 mb-1 opacity-50">
                    {s.icon}
                    <span className="text-[10px] font-bold">{s.label}</span>
                  </div>
                  <div className="text-sm font-mono text-white">{s.val}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-cyan-500/5 rounded-xl p-4 border border-cyan-500/10">
            <h4 className="text-cyan-400 text-[10px] uppercase font-bold mb-2">Live Telemetry</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/40">Status</span>
                <span className="text-white capitalize">{agent.status}</span>
              </div>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full w-3/4 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
