import { AlertTriangle, UserPlus, CheckCircle2 } from 'lucide-react';
import { useAgentStore } from "@/store/useAgentStore";

interface InboxPanelProps {
  setActiveSection: (s: any) => void;
  setActiveIssueDetailId: (id: string | null) => void;
}

export function InboxPanel({ setActiveSection, setActiveIssueDetailId }: InboxPanelProps) {
  const { inbox, hireAgent, resolveInboxItem } = useAgentStore();

  return (
    <div className="max-w-5xl space-y-12 animate-in fade-in duration-700">
      <section className="space-y-6">
        <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Board Approvals & Alerts</h3>
        <div className="grid grid-cols-1 gap-4">
          {inbox.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/5 bg-white/[0.01] py-12 text-center">
              <p className="text-[10px] font-bold text-white/10 uppercase tracking-widest">No pending notifications</p>
            </div>
          ) : (
            inbox.map(item => (
              <div key={item.id} className={`rounded-2xl border p-6 flex items-center justify-between shadow-2xl transition hover:translate-x-1 ${item.type === 'blocked_alert' ? 'bg-rose-500/5 border-rose-500/20' : 'bg-[#0d101a] border-white/10'}`}>
                <div className="flex items-center gap-5">
                   <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${item.type === 'blocked_alert' ? 'bg-rose-500/10 border-rose-500/20' : 'bg-cyan-500/10 border-cyan-500/20'}`}>
                      {item.type === 'blocked_alert' ? <AlertTriangle size={20} className="text-rose-400" /> : <UserPlus size={20} className="text-cyan-400" />}
                   </div>
                   <div className="space-y-1">
                      <p className="text-sm font-bold text-white">{item.content}</p>
                      <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">From: {item.from}</p>
                   </div>
                </div>
                <div className="flex gap-4">
                   {item.type === 'hire_request' && (
                     <>
                       <button onClick={() => { hireAgent(item.metadata); resolveInboxItem(item.id); }} className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-2.5 text-[10px] font-black text-black transition hover:bg-cyan-400">
                         <CheckCircle2 size={14} /> Approve
                       </button>
                       <button onClick={() => resolveInboxItem(item.id)} className="rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-[10px] font-black text-white/40 transition hover:bg-white/10">Decline</button>
                     </>
                   )}
                   {item.type === 'blocked_alert' && (
                     <button 
                      onClick={() => {
                        const issueId = item.id.replace('blocked-', '');
                        setActiveSection('issues');
                        setActiveIssueDetailId(issueId);
                        resolveInboxItem(item.id);
                      }}
                      className="rounded-xl bg-white/5 border border-white/10 px-6 py-2.5 text-[10px] font-black text-white/40 transition hover:bg-white/10"
                     >
                       View Task
                     </button>
                   )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
