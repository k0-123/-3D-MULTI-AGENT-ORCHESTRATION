import { Trash2, AlertTriangle, FileText } from 'lucide-react';
import { useAgentStore } from "@/store/useAgentStore";

interface IssueCardProps {
  issue: any;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onClick: () => void;
  isActive: boolean;
}

export function IssueCard({ issue, onDragStart, onClick, isActive }: IssueCardProps) {
  const { deleteIssue, deliverables } = useAgentStore();
  const hasDeliverables = deliverables.some(d => d.issueId === issue.id);

  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, issue.id)}
      onClick={onClick}
      className={`group relative rounded-2xl border p-5 transition cursor-pointer active:cursor-grabbing ${isActive ? 'border-cyan-500/50 bg-cyan-500/5' : 'bg-[#0d101a] border-white/5 hover:border-white/10'} ${issue.status === 'blocked' ? 'bg-rose-500/5 border-rose-500/20' : ''}`}
    >
      <div className="flex items-start justify-between mb-4">
         <div className="flex items-center gap-2">
           <div className={`h-1.5 w-1.5 rounded-full ${issue.status === 'blocked' ? 'bg-rose-500 animate-pulse' : issue.status === 'completed' ? 'bg-emerald-500' : 'bg-cyan-400 animate-pulse'}`} />
           <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{issue.assignee}</span>
         </div>
         <button onClick={(e) => { e.stopPropagation(); deleteIssue(issue.id); }} className="opacity-0 group-hover:opacity-100 p-1 text-white/20 hover:text-rose-400 transition">
           <Trash2 size={14} />
         </button>
      </div>
      
      <h4 className="text-sm font-bold text-white/90 mb-4 leading-snug">{issue.title}</h4>

      {issue.status === 'blocked' && (
        <div className="mb-4 rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 flex gap-2">
          <AlertTriangle size={14} className="text-rose-400 shrink-0" />
          <p className="text-[10px] text-rose-300 italic leading-relaxed line-clamp-2">{issue.reason}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
         <div className="flex gap-2">
            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-white/10 ${issue.priority === 'high' ? 'text-rose-400' : 'text-white/40'}`}>
              {issue.priority}
            </span>
            {hasDeliverables && (
              <span className="flex items-center gap-1 text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                <FileText size={8} /> Result Ready
              </span>
            )}
         </div>
         <div className="flex -space-x-2">
            <div className="h-5 w-5 rounded-full border-2 border-[#0d101a] bg-zinc-800 flex items-center justify-center text-[8px] font-black text-white shadow-xl">
              {issue.assignee[0]}
            </div>
         </div>
      </div>
    </div>
  );
}
