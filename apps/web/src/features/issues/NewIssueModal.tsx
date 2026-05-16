import { useState } from "react";
import { Zap, Plus } from 'lucide-react';
import { useAgentStore } from "@/store/useAgentStore";

interface NewIssueModalProps {
  onClose: () => void;
}

export function NewIssueModal({ onClose }: NewIssueModalProps) {
  const { runOrchestration } = useAgentStore();
  const [newIssuePrompt, setNewIssuePrompt] = useState("");
  const [showDiscovery, setShowDiscovery] = useState(false);
  const [brief, setBrief] = useState({ audience: '', tone: '', fidelity: 'High (Brand Grade)', surface: '' });

  const handleCreateIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIssuePrompt.trim()) return;
    
    let prompt = newIssuePrompt;
    if (showDiscovery) {
      prompt = `MISSION BRIEF:
Audience: ${brief.audience || 'General'}
Tone: ${brief.tone || 'Professional'}
Fidelity: ${brief.fidelity}
Surface: ${brief.surface || 'Digital'}

TASK: ${newIssuePrompt}`;
    }

    setNewIssuePrompt("");
    onClose();
    await runOrchestration(prompt);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0f121a] p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">New Mission Assignment</h3>
            <span className="text-[8px] font-black uppercase tracking-widest text-cyan-400 mt-1">Open Design Intelligence: ON</span>
          </div>
          <button 
            type="button"
            onClick={() => setShowDiscovery(prev => !prev)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition text-[9px] font-black uppercase tracking-wider ${showDiscovery ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
          >
            <Zap size={10} /> {showDiscovery ? 'Hide Brief' : 'Add Brief'}
          </button>
        </div>

        {showDiscovery && (
          <div className="mb-6 grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-1.5">
              <label className="text-[8px] font-black uppercase tracking-widest text-white/20">Audience</label>
              <input type="text" placeholder="e.g. Investors" value={brief.audience} onChange={e => setBrief({...brief, audience: e.target.value})} className="w-full bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-[10px] text-white outline-none focus:border-cyan-500/30" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[8px] font-black uppercase tracking-widest text-white/20">Tone</label>
              <input type="text" placeholder="e.g. Futuristic" value={brief.tone} onChange={e => setBrief({...brief, tone: e.target.value})} className="w-full bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-[10px] text-white outline-none focus:border-cyan-500/30" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[8px] font-black uppercase tracking-widest text-white/20">Fidelity</label>
              <select value={brief.fidelity} onChange={e => setBrief({...brief, fidelity: e.target.value})} className="w-full bg-black/20 border border-white/5 rounded-lg px-3 py-1.5 text-[10px] text-white outline-none">
                <option>High (Brand Grade)</option>
                <option>Medium (Functional)</option>
                <option>Low (Wireframe)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[8px] font-black uppercase tracking-widest text-white/20">Surface</label>
              <input type="text" placeholder="e.g. Desktop Web" value={brief.surface} onChange={e => setBrief({...brief, surface: e.target.value})} className="w-full bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-[10px] text-white outline-none focus:border-cyan-500/30" />
            </div>
          </div>
        )}
        <form onSubmit={handleCreateIssue} className="space-y-6">
          <div className="space-y-4">
            <textarea autoFocus value={newIssuePrompt} onChange={(e) => setNewIssuePrompt(e.target.value)} placeholder="Describe the mission goal..." className="w-full h-32 rounded-xl bg-black/40 border border-white/10 p-4 text-sm text-white focus:border-cyan-500/50 outline-none" />
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Priority</label>
                <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500/50 outline-none appearance-none">
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Execution</label>
                <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500/50 outline-none appearance-none">
                  <option value="auto">Auto-Orchestrate</option>
                  <option value="manual">Manual Start</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
            <button type="button" onClick={onClose} className="text-xs font-bold text-white/20 hover:text-white transition">Cancel</button>
            <button type="submit" className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-2.5 text-xs font-black text-black hover:bg-cyan-400 transition shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <Plus size={14} /> Create & Run
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
