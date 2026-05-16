import { Search, Plus, Trash2 } from 'lucide-react';
import { useAgentStore } from "@/store/useAgentStore";
import { IssueCard } from "./IssueCard";
import { KanbanColumn } from "./KanbanColumn";

interface IssueKanbanProps {
  issueSearch: string;
  setIssueSearch: (s: string) => void;
  setShowNewIssueModal: (show: boolean) => void;
  setActiveIssueDetailId: (id: string | null) => void;
  activeIssueDetailId: string | null;
}

export function IssueKanban({
  issueSearch,
  setIssueSearch,
  setShowNewIssueModal,
  setActiveIssueDetailId,
  activeIssueDetailId
}: IssueKanbanProps) {
  const { activeIssues, updateIssueStatus } = useAgentStore();

  const onDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("issueId", id);
  };

  const onDrop = (e: React.DragEvent, status: any) => {
    const id = e.dataTransfer.getData("issueId");
    updateIssueStatus(id, status);
  };

  const filteredIssues = activeIssues.filter(i => 
    i.title.toLowerCase().includes(issueSearch.toLowerCase()) ||
    i.assignee.toLowerCase().includes(issueSearch.toLowerCase())
  );

  const columns = [
    { id: 'todo', label: 'Todo', color: 'text-zinc-500' },
    { id: 'in_progress', label: 'In Progress', color: 'text-cyan-400' },
    { id: 'completed', label: 'Resolved / Stalled', color: 'text-emerald-500' }
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden p-10 space-y-8 animate-in fade-in duration-500">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="relative w-96 group">
           <Search size={16} className="absolute left-4 top-3 text-white/20 group-focus-within:text-cyan-400 transition" />
           <input 
            type="text" 
            placeholder="Search issues, agents, or tags..."
            value={issueSearch}
            onChange={(e) => setIssueSearch(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs text-white outline-none focus:border-cyan-500/30 focus:bg-white/[0.05] transition"
           />
        </div>
         <div className="flex gap-4">
            <button 
              onClick={() => { if(confirm("Clear all active missions?")) useAgentStore.getState().clearAllIssues() }}
              className="flex items-center gap-2 bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 text-white/40 hover:text-rose-400 px-4 py-3 rounded-xl text-[10px] font-black transition cursor-pointer"
            >
              <Trash2 size={14} /> Clear Missions
            </button>
            <button onClick={() => setShowNewIssueModal(true)} className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-3 rounded-xl text-xs font-black transition shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer">
              <Plus size={16} /> New Issue
            </button>
         </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-6 overflow-x-auto custom-scrollbar pb-6">
         {columns.map(column => (
           <KanbanColumn 
            key={column.id}
            column={column}
            issues={filteredIssues.filter(i => column.id === 'completed' ? (i.status === 'completed' || i.status === 'blocked') : i.status === column.id)}
            onDrop={onDrop}
            onDragStart={onDragStart}
            setActiveIssueDetailId={setActiveIssueDetailId}
            activeIssueDetailId={activeIssueDetailId}
           />
         ))}
      </div>
    </div>
  );
}
