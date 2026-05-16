import { 
  Sun, Moon, LayoutDashboard, Inbox, ListTodo, FileText, Target, Zap, Box, Plus, ChevronRight, Palette
} from 'lucide-react';
import { useAgentStore } from "@/store/useAgentStore";
import { supabase } from "@/lib/supabase";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: any) => void;
  setShowNewIssueModal: (show: boolean) => void;
  hasNewResults: boolean;
  setHasNewResults: (has: boolean) => void;
}

export function Sidebar({ 
  activeSection, 
  setActiveSection, 
  setShowNewIssueModal,
  hasNewResults,
  setHasNewResults
}: SidebarProps) {
  const { 
    agents, 
    timeOfDay, 
    toggleTimeOfDay, 
    setActiveModalAgent,
    activeModalAgentId,
    inbox,
    deliverables,
    useOpenDesign,
    toggleOpenDesign
  } = useAgentStore();

  return (
    <aside className="pointer-events-auto flex w-64 flex-col border-r border-white/5 bg-[#0b0e16] p-4 shadow-2xl">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.4)]">
          <Box size={20} className="text-black" />
        </div>
        <span className="text-sm font-black tracking-tighter text-white uppercase italic">Agent-Board</span>
      </div>

      <button 
        onClick={() => setShowNewIssueModal(true)}
        className="mb-8 flex w-full items-center gap-2 rounded-xl bg-white/[0.05] border border-white/10 px-4 py-3 text-xs font-bold text-white transition hover:bg-white/[0.08]"
      >
        <Plus size={16} className="text-cyan-400" />
        New Issue
      </button>

      <nav className="flex-1 space-y-8 overflow-y-auto custom-scrollbar pr-1">
        <div className="space-y-1">
          <button 
            onClick={() => setActiveSection("dashboard")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold transition ${activeSection === "dashboard" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-white/40 hover:text-white/60"}`}
          >
            <LayoutDashboard size={16} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveSection("inbox")}
            className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-xs font-bold transition ${activeSection === "inbox" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-white/40 hover:text-white/60"}`}
          >
            <div className="flex items-center gap-3">
              <Inbox size={16} /> Inbox
            </div>
            {inbox.length > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[8px] font-black text-black">
                {inbox.length}
              </span>
            )}
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Work</h3>
          <div className="space-y-1">
            <button 
              onClick={() => setActiveSection("issues")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold transition ${activeSection === "issues" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-white/40 hover:text-white/60"}`}
            >
              <ListTodo size={16} /> Issues
            </button>
            <button 
              onClick={() => { setActiveSection("results"); setHasNewResults(false); }}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-xs font-bold transition ${activeSection === "results" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-white/40 hover:text-white/60"}`}
            >
              <div className="flex items-center gap-3">
                <FileText size={16} /> Results
              </div>
              <div className="flex items-center gap-2">
                {hasNewResults && (
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
                {deliverables.length > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-black text-black">
                    {deliverables.length}
                  </span>
                )}
              </div>
            </button>
            <button 
              onClick={() => setActiveSection("goals")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold transition ${activeSection === "goals" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-white/40 hover:text-white/60"}`}
            >
              <Target size={16} /> Goals
            </button>
            <button 
              onClick={() => setActiveSection("routines")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold transition ${activeSection === "routines" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-white/40 hover:text-white/60"}`}
            >
              <Zap size={16} /> Routines
            </button>
          </div>
        </div>

        <div className="space-y-2 pb-4">
          <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Team Roster</h3>
          <div className="space-y-1">
            {agents.map((a) => (
              <button
                key={a.id}
                onClick={() => setActiveModalAgent(a.id)}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-xs font-bold transition ${activeModalAgentId === a.id ? "bg-white/10 text-white" : "text-white/40 hover:bg-white/5 hover:text-white/60"}`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: a.color }} />
                  <span className="text-[11px] font-medium">{a.name === "Karan" ? "CEO" : a.role}</span>
                </div>
                <ChevronRight size={12} className="opacity-20" />
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Open Design Toggle */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Palette size={12} className="text-white/30" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Open Design</span>
          </div>
          <button 
            onClick={toggleOpenDesign}
            className={`h-5 w-10 rounded-full p-1 transition-colors ${useOpenDesign ? "bg-cyan-500" : "bg-white/10"}`}
          >
            <div className={`h-3 w-3 rounded-full bg-black transition-transform ${useOpenDesign ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>
        {useOpenDesign && (
          <p className="mt-2 px-2 text-[9px] text-white/20 leading-relaxed">Agents will autonomously select design systems and apply brand-grade styling.</p>
        )}
      </div>

      <div className="mt-4 space-y-2 border-t border-white/5 pt-4">
        <button onClick={toggleTimeOfDay} className="flex w-full items-center justify-between rounded-xl bg-white/[0.03] p-3 transition hover:bg-white/[0.06]">
          <div className="flex items-center gap-3">
            {timeOfDay === "day" ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-cyan-400" />}
            <span className="text-[11px] font-bold text-white/80">{timeOfDay === "day" ? "Day Cycle" : "Night Cycle"}</span>
          </div>
          <div className={`h-2 w-2 rounded-full ${timeOfDay === "day" ? "bg-emerald-500" : "bg-cyan-500"}`} />
        </button>
        
        <button 
          onClick={() => supabase.auth.signOut()}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white/40 hover:bg-white/5 transition"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
