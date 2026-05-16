import { useState } from "react";
import { Plus } from 'lucide-react';
import { useAgentStore } from "@/store/useAgentStore";

interface NewRoutineModalProps {
  onClose: () => void;
}

export function NewRoutineModal({ onClose }: NewRoutineModalProps) {
  const [routineTitle, setRoutineTitle] = useState("");
  const [routineInstructions, setRoutineInstructions] = useState("");

  const handleCreateRoutine = () => {
    if (!routineTitle.trim()) return;
    const { addRoutine } = useAgentStore.getState();
    addRoutine({
      title: routineTitle,
      assignee: "ceo",
      instructions: routineInstructions,
      project: "General"
    });
    setRoutineTitle("");
    setRoutineInstructions("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md pointer-events-auto">
      <div className="w-full max-w-xl rounded-xl border border-white/10 bg-[#0b0e16] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
        <div className="p-8 border-b border-white/5">
          <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 mb-1">New Routine</h3>
          <p className="text-[11px] text-white/40 leading-relaxed mb-6">Define the recurring work first. Default project and agent are optional for draft routines.</p>
          <div className="space-y-6">
            <input autoFocus type="text" placeholder="Routine title" value={routineTitle} onChange={(e) => setRoutineTitle(e.target.value)} className="w-full bg-transparent text-2xl font-black text-white/90 placeholder:text-white/10 outline-none" />
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-white/20">For</span>
              <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-[10px] font-bold text-white/40">Assignee</div>
              <span className="text-[11px] font-bold text-white/20">in</span>
              <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-[10px] font-bold text-white/40">Project</div>
            </div>
          </div>
        </div>
        <div className="p-8 space-y-6">
           <textarea placeholder="Add instructions..." value={routineInstructions} onChange={(e) => setRoutineInstructions(e.target.value)} className="w-full bg-transparent text-sm text-white/60 placeholder:text-white/10 outline-none resize-none h-24" />
           <div className="rounded-lg border border-dashed border-white/5 bg-white/[0.01] p-4 text-center">
             <p className="text-[10px] font-medium text-white/30 italic">Use {"{{variable_name}}"} placeholders in the instructions to prompt for inputs when the routine runs.</p>
           </div>
        </div>
        <div className="p-8 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
           <p className="max-w-[200px] text-[9px] font-medium text-white/20 leading-relaxed">After creation, Agent-Board takes you straight to trigger setup.</p>
           <div className="flex gap-4 items-center">
              <button type="button" onClick={onClose} className="text-[11px] font-bold text-white/40 hover:text-white transition">Cancel</button>
              <button onClick={handleCreateRoutine} className="flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 text-[11px] font-black text-black hover:bg-white/90 transition"><Plus size={14} /> Create routine</button>
           </div>
        </div>
      </div>
    </div>
  );
}
