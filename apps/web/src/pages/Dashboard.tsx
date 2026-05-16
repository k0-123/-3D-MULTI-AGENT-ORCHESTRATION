import { useEffect, useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { Header } from "../components/layout/Header";
import { IssueKanban } from "../features/issues/IssueKanban";
import { ResultsList } from "../features/results/ResultsList";
import { InboxPanel } from "../features/inbox/InboxPanel";
import { RoutinesList } from "../features/routines/RoutinesList";
import { GoalsPanel } from "../features/goals/GoalsPanel";
import { IssueDetail } from "../features/issues/IssueDetail";
import { NewIssueModal } from "../features/issues/NewIssueModal";
import { NewRoutineModal } from "../features/routines/NewRoutineModal";
import { PaperclipDashboard } from "../components/ui/PaperclipDashboard";
import { Onboarding } from "../components/ui/Onboarding";
import { Login } from "../components/ui/Login";
import { AgentConfigModal } from "../components/ui/AgentConfigModal";
import { useAgentStore } from "@/store/useAgentStore";
import { supabase } from "@/lib/supabase";

export function Dashboard() {
  const { 
    timeOfDay, 
    deliverables,
    setUserId,
    fetchInitialData,
    userId,
  } = useAgentStore();

  const [activeSection, setActiveSection] = useState<"dashboard" | "inbox" | "issues" | "results" | "goals" | "routines">("dashboard");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showNewIssueModal, setShowNewIssueModal] = useState(false);
  const [activeIssueDetailId, setActiveIssueDetailId] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasNewResults, setHasNewResults] = useState(false);
  const [issueSearch, setIssueSearch] = useState("");
  const [showNewRoutineModal, setShowNewRoutineModal] = useState(false);

  useEffect(() => {
    // Check session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUserId(session?.user.id || null);
      if (session) fetchInitialData();
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUserId(session?.user.id || null);
      if (session) fetchInitialData();
      setLoading(false);
    });

    const complete = localStorage.getItem("onboarding_complete");
    if (!complete) setShowOnboarding(true);

    return () => subscription.unsubscribe();
  }, []);

  // Watch for new deliverables
  useEffect(() => {
    if (deliverables.length > 0 && activeSection !== "results") {
      setHasNewResults(true);
    }
    if (activeSection === "results") {
      setHasNewResults(false);
    }
  }, [deliverables.length, activeSection]);

  if (loading) return null;

  if (!session) {
    return <Login onSuccess={() => {}} />;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex overflow-hidden bg-[#0a0c14]">
      <Sidebar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        setShowNewIssueModal={setShowNewIssueModal}
        hasNewResults={hasNewResults}
        setHasNewResults={setHasNewResults}
      />

      <main className="pointer-events-auto flex flex-1 flex-col overflow-hidden relative">
        <Header activeSection={activeSection} />

        <div className="flex-1 overflow-hidden custom-scrollbar bg-[#0a0c14] flex flex-col">
          {activeSection === "issues" && (
            <IssueKanban 
              issueSearch={issueSearch}
              setIssueSearch={setIssueSearch}
              setShowNewIssueModal={setShowNewIssueModal}
              setActiveIssueDetailId={setActiveIssueDetailId}
              activeIssueDetailId={activeIssueDetailId}
            />
          )}

          {activeSection !== "issues" && (
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              {activeSection === "results" && (
                <ResultsList 
                  setActiveSection={setActiveSection}
                  setActiveIssueDetailId={setActiveIssueDetailId}
                />
              )}
              {activeSection === "dashboard" && <PaperclipDashboard />}
              {activeSection === "inbox" && (
                <InboxPanel 
                  setActiveSection={setActiveSection}
                  setActiveIssueDetailId={setActiveIssueDetailId}
                />
              )}
              {activeSection === "routines" && (
                <RoutinesList setShowNewRoutineModal={setShowNewRoutineModal} />
              )}
              {activeSection === "goals" && <GoalsPanel />}
            </div>
          )}
        </div>

        <IssueDetail 
          issueId={activeIssueDetailId}
          onClose={() => setActiveIssueDetailId(null)}
        />

        <footer className="border-t border-white/5 bg-[#0b0e16] p-2 px-10">
           <p className="text-[9px] font-medium text-white/20 italic tracking-wide">
             {timeOfDay === "day" ? "Daylight protocol active. Agents at workstations." : "Nighttime learning active. Agents optimizing codebase."}
           </p>
        </footer>
      </main>

      {showNewIssueModal && (
        <NewIssueModal onClose={() => setShowNewIssueModal(false)} />
      )}

      {showNewRoutineModal && (
        <NewRoutineModal onClose={() => setShowNewRoutineModal(false)} />
      )}

      <AgentConfigModal />
      {showOnboarding && <Onboarding onComplete={() => { setShowOnboarding(false); localStorage.setItem("onboarding_complete", "true"); }} />}
    </div>
  );
}
