import { Zap, Plus } from 'lucide-react';
import { useAgentStore } from "@/store/useAgentStore";

interface RoutinesListProps {
  setShowNewRoutineModal: (show: boolean) => void;
}

export function RoutinesList({ setShowNewRoutineModal }: RoutinesListProps) {
  const { routines } = useAgentStore();

  return (
    <div className="max-w-5xl space-y-8 animate-in fade-in duration-700">
       <div className="space-y-1">
         <h2 className="text-2xl font-black text-white">Routines</h2>
         <p className="text-xs text-white/40">Recurring work definitions that materialize into auditable execution issues.</p>
       </div>
       <div className="flex border-b border-white/5 gap-8">
         <button className="border-b-2 border-white pb-2 text-[10px] font-bold uppercase tracking-widest text-white">Routines</button>
         <button className="pb-2 text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white/40 transition">Recent Runs</button>
       </div>
       {routines.length === 0 ? (
         <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/5 py-24 text-center">
           <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">0 routines</p>
           <button onClick={() => setShowNewRoutineModal(true)} className="mt-4 rounded-xl bg-white px-6 py-2 text-[10px] font-black text-black hover:bg-white/90 transition">+ Create your first recurring workflow</button>
         </div>
       ) : (
         <div className="grid grid-cols-1 gap-4">
           {routines.map(r => (
             <div key={r.id} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 flex items-center justify-between">
               <div className="flex items-center gap-4">
                 <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                   <Zap size={14} className="text-cyan-400" />
                 </div>
                 <div>
                   <h4 className="text-xs font-bold text-white/80">{r.title}</h4>
                   <p className="text-[9px] text-white/20 uppercase tracking-widest">{r.assignee} · {r.project}</p>
                 </div>
               </div>
               <button className="text-[10px] font-black text-white/20 hover:text-white transition">RUN NOW</button>
             </div>
           ))}
           <button onClick={() => setShowNewRoutineModal(true)} className="flex items-center justify-center gap-2 p-4 rounded-2xl border border-dashed border-white/5 hover:bg-white/[0.02] transition text-[10px] font-bold text-white/20 hover:text-white/40">
             <Plus size={14} /> Add Another Routine
           </button>
         </div>
       )}
    </div>
  );
}
