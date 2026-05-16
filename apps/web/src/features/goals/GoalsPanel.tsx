import { useAgentStore } from "@/store/useAgentStore";

export function GoalsPanel() {
  const { companyGoals } = useAgentStore();

  return (
    <div className="max-w-4xl space-y-6">
       {companyGoals.map(goal => (
         <div key={goal.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-5">
           <span className="text-xs font-bold text-white/80">{goal.text}</span>
           <span className="text-[9px] font-black uppercase text-white/20">{goal.status}</span>
         </div>
       ))}
    </div>
  );
}
