import { motion } from "framer-motion";
import { useAgentStore } from "@/store/useAgentStore";

export function PaperclipDashboard() {
  const { agents, activeIssues: issues, budget, inbox, deliverables } = useAgentStore();

  const stats = [
    { label: "Active Personnel", value: agents.length },
    { label: "Live Issues", value: issues.filter(i => i.status === 'in_progress').length },
    { label: "System Costs", value: budget.spent === 0 ? "$0.00" : `$${budget.spent.toFixed(2)}` },
    { label: "Approvals", value: inbox.length + deliverables.length }
  ];

  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      {/* Stats Row - Screenshot 2 style */}
      <div className="grid grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="space-y-1">
             <div className="text-4xl font-black text-white tracking-tighter">
               {stat.value}
             </div>
             <div className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500/60">
               {stat.label}
             </div>
          </div>
        ))}
      </div>

      {/* Agents Grid - Screenshot 2 style */}
      <div className="grid grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div 
            key={agent.id} 
            className="group relative rounded-2xl border border-white/5 bg-[#0d101a] p-6 shadow-xl transition hover:border-white/10 hover:bg-[#0f121f]"
          >
            <div className="mb-6 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: agent.color }} />
                <span className="text-sm font-bold text-white/90">{agent.name}</span>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/10">{agent.role}</span>
            </div>

            <div className="mb-8">
              <p className="text-xs italic text-white/20 leading-relaxed">
                Agent waiting for next mission instructions.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className={`rounded-full border border-white/10 bg-white/[0.02] px-3 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white/40`}>
                {agent.status}
              </div>
              <button 
                onClick={() => useAgentStore.getState().setActiveModalAgent(agent.id)}
                className="text-[10px] font-black uppercase tracking-widest text-cyan-500 hover:text-cyan-400 transition"
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
