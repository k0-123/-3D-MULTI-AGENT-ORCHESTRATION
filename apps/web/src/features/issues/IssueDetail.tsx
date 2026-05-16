import { XCircle, AlertTriangle, Clock, Terminal, ExternalLink, CheckCircle2, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from "framer-motion";
import { useAgentStore } from "@/store/useAgentStore";

interface IssueDetailProps {
  issueId: string | null;
  onClose: () => void;
}

export function IssueDetail({ issueId, onClose }: IssueDetailProps) {
  const { activeIssues, deliverables, updateIssueStatus, deleteIssue } = useAgentStore();
  const issue = activeIssues.find(i => i.id === issueId);
  const issueDeliverables = deliverables.filter(d => d.issueId === issueId);

  return (
    <AnimatePresence>
      {issueId && issue && (
        <motion.div 
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute right-0 top-0 bottom-0 w-[500px] border-l border-white/10 bg-[#0b0e16] shadow-[-20px_0_40px_rgba(0,0,0,0.5)] z-40 flex flex-col pointer-events-auto"
        >
           <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={onClose} className="p-2 -ml-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition">
                  <XCircle size={20} />
                </button>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Issue Insight</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-white/10 ${issue.status === 'blocked' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'}`}>
                  {issue.status}
                </span>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-12">
              <section className="space-y-4">
                 <h2 className="text-2xl font-black text-white leading-tight">{issue.title}</h2>
                 <div className="flex items-center gap-6">
                    <div className="space-y-1">
                       <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Assignee</p>
                       <p className="text-xs font-bold text-white/80">{issue.assignee}</p>
                    </div>
                    <div className="h-8 w-px bg-white/5" />
                    <div className="space-y-1">
                       <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Priority</p>
                       <p className={`text-xs font-bold uppercase tracking-tighter ${issue.priority === 'high' ? 'text-rose-400' : 'text-white/60'}`}>{issue.priority}</p>
                    </div>
                 </div>
              </section>

              {issue.status === 'blocked' && (
                <section className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-3">
                   <div className="flex items-center gap-2 text-rose-400">
                     <AlertTriangle size={16} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Blocker Identified</span>
                   </div>
                   <p className="text-sm text-rose-200/80 leading-relaxed italic">"{issue.reason}"</p>
                </section>
              )}

              <section className="space-y-6">
                 <div className="flex items-center justify-between">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Agent Deliverables</h3>
                   <span className="text-[10px] font-bold text-white/20">{issueDeliverables.length} files</span>
                 </div>
                 
                 <div className="space-y-6">
                    {issueDeliverables.length === 0 ? (
                      <div className="py-12 text-center rounded-2xl border border-dashed border-white/5 bg-white/[0.01]">
                        <Clock size={24} className="mx-auto text-white/10 mb-3" />
                        <p className="text-[10px] font-bold text-white/10 uppercase tracking-widest">Awaiting output...</p>
                      </div>
                    ) : (
                      issueDeliverables.map(del => (
                        <div key={del.id} className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden shadow-xl">
                           <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-5 py-3">
                              <div className="flex items-center gap-2">
                                <Terminal size={12} className="text-cyan-400" />
                                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{del.agentId} · {new Date(del.timestamp).toLocaleTimeString()}</span>
                              </div>
                              <button className="text-white/20 hover:text-white transition">
                                <ExternalLink size={12} />
                              </button>
                           </div>
                           <div className="p-6 font-mono text-[11px] leading-relaxed text-white/70 whitespace-pre-wrap max-h-[300px] overflow-y-auto custom-scrollbar">
                             {del.content}
                           </div>
                        </div>
                      ))
                    )}
                 </div>
              </section>
           </div>

           <div className="p-8 border-t border-white/5 bg-white/[0.02] flex gap-4">
              {issue.status === 'completed' ? (
                <button 
                  onClick={() => updateIssueStatus(issue.id, 'todo')}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white/5 py-3 text-xs font-black text-white hover:bg-white/10 transition border border-white/10"
                >
                  <CheckCircle2 size={16} /> Reopen Mission
                </button>
              ) : (
                <button 
                  onClick={() => {
                    updateIssueStatus(issue.id, 'completed');
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 text-xs font-black text-black hover:bg-cyan-400 transition shadow-lg"
                >
                  <CheckCircle2 size={16} /> Mark as Resolved
                </button>
              )}
              <button 
                onClick={() => {
                  deleteIssue(issue.id);
                  onClose();
                }}
                className="p-3 rounded-xl border border-white/10 text-white/40 hover:text-rose-400 hover:border-rose-500/20 transition"
              >
                <Trash2 size={18} />
              </button>
           </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
