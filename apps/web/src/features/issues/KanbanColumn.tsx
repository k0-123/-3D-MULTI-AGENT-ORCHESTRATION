import { IssueCard } from "./IssueCard";

interface KanbanColumnProps {
  column: { id: string, label: string, color: string };
  issues: any[];
  onDrop: (e: React.DragEvent, status: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  setActiveIssueDetailId: (id: string | null) => void;
  activeIssueDetailId: string | null;
}

export function KanbanColumn({
  column,
  issues,
  onDrop,
  onDragStart,
  setActiveIssueDetailId,
  activeIssueDetailId
}: KanbanColumnProps) {
  return (
    <div 
      className="flex-1 min-w-[320px] flex flex-col space-y-4"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, column.id === 'completed' ? 'completed' : column.id)}
    >
      <div className="flex items-center justify-between px-2">
         <div className="flex items-center gap-2">
           <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${column.color}`}>{column.label}</h3>
           <span className="text-[10px] font-bold text-white/20 bg-white/5 px-2 rounded-full">
             {issues.length}
           </span>
         </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2 min-h-[200px]">
         {issues.map(issue => (
           <IssueCard 
             key={issue.id}
             issue={issue}
             onDragStart={onDragStart}
             onClick={() => setActiveIssueDetailId(issue.id)}
             isActive={activeIssueDetailId === issue.id}
           />
         ))}
      </div>
    </div>
  );
}
