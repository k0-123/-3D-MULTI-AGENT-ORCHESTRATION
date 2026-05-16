import { Clock, Terminal, ArrowRight, Download, ShieldCheck } from 'lucide-react';
import { useAgentStore } from "@/store/useAgentStore";
import { ArtifactPreview } from "../../components/ui/ArtifactPreview";
import { MarkdownRenderer } from "../../components/ui/MarkdownRenderer";

interface ResultsListProps {
  setActiveSection: (s: any) => void;
  setActiveIssueDetailId: (id: string | null) => void;
}

export function ResultsList({ setActiveSection, setActiveIssueDetailId }: ResultsListProps) {
  const { deliverables, activeIssues } = useAgentStore();

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-white tracking-tight">Mission Results</h2>
          <p className="text-xs text-white/40 uppercase tracking-[0.2em]">Comprehensive output log from all active agents</p>
        </div>
        <button onClick={() => useAgentStore.getState().clearDeliverables()} className="text-[10px] font-black uppercase text-white/20 hover:text-rose-400 transition">
          Clear Log
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
         {deliverables.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-32 rounded-3xl border border-dashed border-white/5 bg-white/[0.01]">
              <Clock size={48} className="text-white/5 mb-6" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Awaiting agent deliverables...</p>
           </div>
         ) : (
           deliverables.map(del => {
             const issue = activeIssues.find(i => i.id === del.issueId);
             return (
              <div key={del.id} className="group relative rounded-3xl border border-white/10 bg-[#0d101a] overflow-hidden shadow-2xl transition hover:border-cyan-500/30">
                 <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                         <Terminal size={20} className="text-cyan-400" />
                      </div>
                      <div>
                         <div className="flex items-center gap-2">
                           <span className="text-xs font-black text-white uppercase tracking-widest">{del.agentId}</span>
                           <span className="text-[10px] text-white/20">·</span>
                           <span className="text-[10px] text-white/40">{new Date(del.timestamp).toLocaleString()}</span>
                         </div>
                         <p className="text-[10px] font-bold text-cyan-500/60 uppercase tracking-tighter">
                           {issue ? `Linked to: ${issue.title}` : "General Output"}
                         </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                       {issue && (
                         <button 
                          onClick={() => { setActiveSection('issues'); setActiveIssueDetailId(issue.id); }}
                          className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-[10px] font-black text-white/40 hover:bg-white/10 hover:text-white transition"
                         >
                           <ArrowRight size={14} /> Open Task
                         </button>
                       )}
                       <button 
                         onClick={() => {
                           const isHtml = del.content.includes('<!DOCTYPE html>') || del.content.includes('<html');
                           const ext = isHtml ? 'html' : 'md';
                           const mime = isHtml ? 'text/html' : 'text/markdown';
                           const blob = new Blob([del.content], { type: mime });
                           const url = URL.createObjectURL(blob);
                           const a = document.createElement('a');
                           a.href = url;
                           a.download = `${del.agentId}-${del.id.slice(0,5)}.${ext}`;
                           a.click();
                           URL.revokeObjectURL(url);
                         }}
                         className="p-2 rounded-xl bg-white/5 text-white/20 hover:text-cyan-400 transition"
                         title={`Export as ${del.content.includes('<!DOCTYPE html>') || del.content.includes('<html') ? '.html' : '.md'}`}
                       >
                         <Download size={16} />
                       </button>
                    </div>
                 </div>
                 <div className="flex flex-col gap-6">
                   {(del.content.includes('<!DOCTYPE html>') || del.content.includes('<html')) ? (
                     <div className="h-[500px] w-full">
                       <ArtifactPreview content={del.content} type="html" />
                     </div>
                   ) : (
                     <MarkdownRenderer content={del.content} />
                   )}
                 </div>
                 {del.auditLog && del.auditLog.length > 0 && (
                   <div className="border-t border-white/5 bg-white/[0.01] px-10 py-6">
                     <div className="flex items-center gap-3 mb-4">
                       <ShieldCheck size={14} className="text-emerald-500" />
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/50">Quality Audit Report</span>
                     </div>
                     <div className="grid grid-cols-1 gap-2">
                       {del.auditLog.map((log, idx) => (
                         <div key={idx} className="flex items-start gap-3 rounded-lg bg-white/[0.02] p-3 border border-white/5">
                           <div className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${log.includes('APPROVED') ? 'bg-emerald-500' : (log.includes('REJECTED') ? 'bg-rose-500' : 'bg-white/20')}`} />
                           <p className="text-[11px] text-white/40 leading-relaxed font-medium">{log}</p>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}
              </div>
             );
           })
         )}
      </div>
    </div>
  );
}
