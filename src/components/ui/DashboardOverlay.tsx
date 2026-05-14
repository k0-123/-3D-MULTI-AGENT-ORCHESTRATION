import { useEffect, useState } from "react";
import { 
  Sun, Moon, Activity, LayoutDashboard, ListTodo, Inbox, Target, Send, Plus, Eye, Box, ChevronRight, Zap, 
  CheckCircle2, XCircle, UserPlus, Search, Trash2, AlertTriangle, GripVertical, Filter, ArrowRight, 
  Terminal, FileText, Clock, ShieldCheck, ExternalLink, Download, Layout, Info, Palette
} from 'lucide-react';
import { ArtifactPreview } from './ArtifactPreview';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Link } from "@tanstack/react-router";
import { useAgentStore } from "@/store/useAgentStore";
import { AgentConfigModal } from "./AgentConfigModal";
import { PaperclipDashboard } from "./PaperclipDashboard";
import { Onboarding } from "./Onboarding";
import { Login } from "./Login";
import { supabase } from "@/lib/supabase";
import { AnimatePresence, motion } from "framer-motion";

export function DashboardOverlay() {
  const { 
    agents, 
    timeOfDay, 
    toggleTimeOfDay, 
    setActiveModalAgent,
    activeModalAgentId,
    activeIssues,
    inbox,
    deliverables,
    runOrchestration,
    companyGoals,
    routines,
    hireAgent,
    resolveInboxItem,
    resolveDeliverable,
    deleteIssue,
    updateIssueStatus,
    setUserId,
    fetchInitialData,
    userId,
    roadmap,
    useOpenDesign,
    toggleOpenDesign
  } = useAgentStore();



  const [activeSection, setActiveSection] = useState<"dashboard" | "inbox" | "issues" | "results" | "goals" | "routines">("dashboard");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [newIssuePrompt, setNewIssuePrompt] = useState("");
  const [showNewIssueModal, setShowNewIssueModal] = useState(false);
  const [activeIssueDetailId, setActiveIssueDetailId] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasNewResults, setHasNewResults] = useState(false);
  
  // Search and Filter
  const [issueSearch, setIssueSearch] = useState("");
  
  // Routine Modal State
  const [showNewRoutineModal, setShowNewRoutineModal] = useState(false);
  const [showDiscovery, setShowDiscovery] = useState(false);
  const [brief, setBrief] = useState({ audience: '', tone: '', fidelity: 'High (Brand Grade)', surface: '' });
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
    setShowNewRoutineModal(false);
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
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

  // Watch for new deliverables and alert the user
  useEffect(() => {
    if (deliverables.length > 0 && activeSection !== "results") {
      setHasNewResults(true);
    }
    if (activeSection === "results") {
      setHasNewResults(false);
    }
  }, [deliverables.length, activeSection]);


  if (!isMounted || loading) return null;

  if (!session) {
    return <Login onSuccess={() => {}} />;
  }

  const handleCreateIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIssuePrompt.trim()) return;
    
    let prompt = newIssuePrompt;
    if (showDiscovery) {
      prompt = `MISSION BRIEF:
Audience: ${brief.audience || 'General'}
Tone: ${brief.tone || 'Professional'}
Fidelity: ${brief.fidelity}
Surface: ${brief.surface || 'Digital'}

TASK: ${newIssuePrompt}`;
    }

    setNewIssuePrompt("");
    setShowNewIssueModal(false);
    setShowDiscovery(false);
    await runOrchestration(prompt);
  };

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

  const activeIssueDetail = activeIssues.find(i => i.id === activeIssueDetailId);
  const issueDeliverables = deliverables.filter(d => d.issueId === activeIssueDetailId);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex overflow-hidden bg-[#0a0c14]">
      {/* Sidebar */}
      <aside className="pointer-events-auto flex w-64 flex-col border-r border-white/5 bg-[#0b0e16] p-4 shadow-2xl">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.4)]">
            <Box size={20} className="text-black" />
          </div>
          <span className="text-sm font-black tracking-tighter text-white uppercase italic">Agent-Board</span>
        </div>

        <button 
          onClick={() => setShowNewIssueModal(true)}
          className="mb-8 flex w-full items-center gap-2 rounded-xl bg-white/[0.05] border border-white/10 px-4 py-3 text-xs font-bold text-white transition hover:bg-white/[0.08]"
        >
          <Plus size={16} className="text-cyan-400" />
          New Issue
        </button>

        <nav className="flex-1 space-y-8 overflow-y-auto custom-scrollbar pr-1">
          <div className="space-y-1">
            <button 
              onClick={() => setActiveSection("dashboard")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold transition ${activeSection === "dashboard" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-white/40 hover:text-white/60"}`}
            >
              <LayoutDashboard size={16} /> Dashboard
            </button>
            <button 
              onClick={() => setActiveSection("inbox")}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-xs font-bold transition ${activeSection === "inbox" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-white/40 hover:text-white/60"}`}
            >
              <div className="flex items-center gap-3">
                <Inbox size={16} /> Inbox
              </div>
              {inbox.length > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[8px] font-black text-black">
                  {inbox.length}
                </span>
              )}
            </button>
          </div>

          <div className="space-y-2">
            <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Work</h3>
            <div className="space-y-1">
              <button 
                onClick={() => setActiveSection("issues")}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold transition ${activeSection === "issues" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-white/40 hover:text-white/60"}`}
              >
                <ListTodo size={16} /> Issues
              </button>
              <button 
                onClick={() => { setActiveSection("results"); setHasNewResults(false); }}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-xs font-bold transition ${activeSection === "results" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-white/40 hover:text-white/60"}`}
              >
                <div className="flex items-center gap-3">
                  <FileText size={16} /> Results
                </div>
                <div className="flex items-center gap-2">
                  {hasNewResults && (
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                  {deliverables.length > 0 && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-black text-black">
                      {deliverables.length}
                    </span>
                  )}
                </div>
              </button>
              <button 
                onClick={() => setActiveSection("goals")}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold transition ${activeSection === "goals" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-white/40 hover:text-white/60"}`}
              >
                <Target size={16} /> Goals
              </button>
              <button 
                onClick={() => setActiveSection("routines")}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold transition ${activeSection === "routines" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-white/40 hover:text-white/60"}`}
              >
                <Zap size={16} /> Routines
              </button>
            </div>
          </div>


          <div className="space-y-2 pb-4">
            <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Team Roster</h3>
            <div className="space-y-1">
              {agents.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setActiveModalAgent(a.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-xs font-bold transition ${activeModalAgentId === a.id ? "bg-white/10 text-white" : "text-white/40 hover:bg-white/5 hover:text-white/60"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: a.color }} />
                    <span className="text-[11px] font-medium">{a.name === "Karan" ? "CEO" : a.role}</span>
                  </div>
                  <ChevronRight size={12} className="opacity-20" />
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Open Design: Agent Intelligence Toggle */}
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Palette size={12} className="text-white/30" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Open Design</span>
            </div>
            <button 
              onClick={toggleOpenDesign}
              className={`h-5 w-10 rounded-full p-1 transition-colors ${useOpenDesign ? "bg-cyan-500" : "bg-white/10"}`}
            >
              <div className={`h-3 w-3 rounded-full bg-black transition-transform ${useOpenDesign ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
          {useOpenDesign && (
            <p className="mt-2 px-2 text-[9px] text-white/20 leading-relaxed">Agents will autonomously select design systems and apply brand-grade styling to their outputs.</p>
          )}
        </div>

        <div className="mt-4 space-y-2 border-t border-white/5 pt-4">
          <button onClick={toggleTimeOfDay} className="flex w-full items-center justify-between rounded-xl bg-white/[0.03] p-3 transition hover:bg-white/[0.06]">
            <div className="flex items-center gap-3">
              {timeOfDay === "day" ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-cyan-400" />}
              <span className="text-[11px] font-bold text-white/80">{timeOfDay === "day" ? "Day Cycle" : "Night Cycle"}</span>
            </div>
            <div className={`h-2 w-2 rounded-full ${timeOfDay === "day" ? "bg-emerald-500" : "bg-cyan-500"}`} />
          </button>
          
          <button 
            onClick={() => supabase.auth.signOut()}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white/40 hover:bg-white/5 transition"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="pointer-events-auto flex flex-1 flex-col overflow-hidden relative">
        <header className="flex h-16 items-center justify-between border-b border-white/5 bg-[#0b0e16] px-10">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white/80">{activeSection}</h2>
          <Link to="/visualizer" className="flex items-center gap-2 text-[10px] font-bold text-cyan-500 uppercase tracking-widest hover:text-cyan-400 transition">
            <Eye size={14} /> Visualizer Mode
          </Link>
        </header>

        <div className="flex-1 overflow-hidden custom-scrollbar bg-[#0a0c14] flex flex-col">
          {activeSection === "issues" && (
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
                      className="flex items-center gap-2 bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 text-white/40 hover:text-rose-400 px-4 py-3 rounded-xl text-[10px] font-black transition cursor-pointer pointer-events-auto"
                    >
                      <Trash2 size={14} /> Clear Missions
                    </button>
                    <button onClick={() => setShowNewIssueModal(true)} className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-3 rounded-xl text-xs font-black transition shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer pointer-events-auto">
                      <Plus size={16} /> New Issue
                    </button>
                 </div>
              </div>

              {/* Kanban Board */}
              <div className="flex-1 flex gap-6 overflow-x-auto custom-scrollbar pb-6">
                 {[
                   { id: 'todo', label: 'Todo', color: 'text-zinc-500' },
                   { id: 'in_progress', label: 'In Progress', color: 'text-cyan-400' },
                   { id: 'completed', label: 'Resolved / Stalled', color: 'text-emerald-500' }
                 ].map(column => (
                   <div 
                    key={column.id} 
                    className="flex-1 min-w-[320px] flex flex-col space-y-4"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => onDrop(e, column.id === 'completed' ? 'completed' : column.id)}
                   >
                     <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                          <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${column.color}`}>{column.label}</h3>
                          <span className="text-[10px] font-bold text-white/20 bg-white/5 px-2 rounded-full">
                            {filteredIssues.filter(i => column.id === 'completed' ? (i.status === 'completed' || i.status === 'blocked') : i.status === column.id).length}
                          </span>
                        </div>
                     </div>

                     <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2 min-h-[200px]">
                        {filteredIssues.filter(i => column.id === 'completed' ? (i.status === 'completed' || i.status === 'blocked') : i.status === column.id).map(issue => (
                          <div 
                            key={issue.id}
                            draggable
                            onDragStart={(e) => onDragStart(e, issue.id)}
                            onClick={() => setActiveIssueDetailId(issue.id)}
                            className={`group relative rounded-2xl border p-5 transition cursor-pointer active:cursor-grabbing ${activeIssueDetailId === issue.id ? 'border-cyan-500/50 bg-cyan-500/5' : 'bg-[#0d101a] border-white/5 hover:border-white/10'} ${issue.status === 'blocked' ? 'bg-rose-500/5 border-rose-500/20' : ''}`}
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
                                  {deliverables.some(d => d.issueId === issue.id) && (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); setActiveSection('results'); setHasNewResults(false); }}
                                      className="flex items-center gap-1 text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition"
                                    >
                                      <FileText size={8} /> View Result
                                    </button>
                                  )}
                               </div>
                               <div className="flex -space-x-2">
                                  <div className="h-5 w-5 rounded-full border-2 border-[#0d101a] bg-zinc-800 flex items-center justify-center text-[8px] font-black text-white shadow-xl">
                                    {issue.assignee[0]}
                                  </div>
                               </div>
                            </div>
                          </div>
                        ))}
                     </div>
                   </div>
                 ))}
              </div>
            </div>
          )}

          {activeSection !== "issues" && (
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              {activeSection === "results" && (
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
                                       const blob = new Blob([del.content], { type: 'text/markdown' });
                                       const url = URL.createObjectURL(blob);
                                       const a = document.createElement('a');
                                       a.href = url;
                                       a.download = `deliverable-${del.agentId}-${del.id.slice(0,5)}.md`;
                                       a.click();
                                     }}
                                     className="p-2 rounded-xl bg-white/5 text-white/20 hover:text-cyan-400 transition"
                                     title="Export Result"
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
              )}

              {activeSection === "dashboard" && <PaperclipDashboard />}
              {activeSection === "inbox" && (
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
              )}

              {activeSection === "routines" && (
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
              )}

              {activeSection === "goals" && (
                <div className="max-w-4xl space-y-6">
                   {companyGoals.map(goal => (
                     <div key={goal.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-5">
                       <span className="text-xs font-bold text-white/80">{goal.text}</span>
                       <span className="text-[9px] font-black uppercase text-white/20">{goal.status}</span>
                     </div>
                   ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Issue Detail Sidebar */}
        <AnimatePresence>
          {activeIssueDetailId && activeIssueDetail && (
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[500px] border-l border-white/10 bg-[#0b0e16] shadow-[-20px_0_40px_rgba(0,0,0,0.5)] z-40 flex flex-col pointer-events-auto"
            >
               <div className="p-8 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setActiveIssueDetailId(null)} className="p-2 -ml-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition">
                      <XCircle size={20} />
                    </button>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Issue Insight</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-white/10 ${activeIssueDetail.status === 'blocked' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'}`}>
                      {activeIssueDetail.status}
                    </span>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-12">
                  <section className="space-y-4">
                     <h2 className="text-2xl font-black text-white leading-tight">{activeIssueDetail.title}</h2>
                     <div className="flex items-center gap-6">
                        <div className="space-y-1">
                           <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Assignee</p>
                           <p className="text-xs font-bold text-white/80">{activeIssueDetail.assignee}</p>
                        </div>
                        <div className="h-8 w-px bg-white/5" />
                        <div className="space-y-1">
                           <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Priority</p>
                           <p className={`text-xs font-bold uppercase tracking-tighter ${activeIssueDetail.priority === 'high' ? 'text-rose-400' : 'text-white/60'}`}>{activeIssueDetail.priority}</p>
                        </div>
                     </div>
                  </section>

                  {activeIssueDetail.status === 'blocked' && (
                    <section className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-3">
                       <div className="flex items-center gap-2 text-rose-400">
                         <AlertTriangle size={16} />
                         <span className="text-[10px] font-black uppercase tracking-widest">Blocker Identified</span>
                       </div>
                       <p className="text-sm text-rose-200/80 leading-relaxed italic">"{activeIssueDetail.reason}"</p>
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
                  {activeIssueDetail.status === 'completed' ? (
                    <button 
                      onClick={() => updateIssueStatus(activeIssueDetail.id, 'todo')}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white/5 py-3 text-xs font-black text-white hover:bg-white/10 transition border border-white/10"
                    >
                      <CheckCircle2 size={16} /> Reopen Mission
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        updateIssueStatus(activeIssueDetail.id, 'completed');
                        setActiveIssueDetailId(null);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 text-xs font-black text-black hover:bg-cyan-400 transition shadow-lg"
                    >
                      <CheckCircle2 size={16} /> Mark as Resolved
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      deleteIssue(activeIssueDetail.id);
                      setActiveIssueDetailId(null);
                    }}
                    className="p-3 rounded-xl border border-white/10 text-white/40 hover:text-rose-400 hover:border-rose-500/20 transition"
                  >
                    <Trash2 size={18} />
                  </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="border-t border-white/5 bg-[#0b0e16] p-2 px-10">
           <p className="text-[9px] font-medium text-white/20 italic tracking-wide">
             {timeOfDay === "day" ? "Daylight protocol active. Agents at workstations." : "Nighttime learning active. Agents optimizing codebase."}
           </p>
        </footer>
      </main>

      {/* New Issue Modal */}
      {showNewIssueModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0f121a] p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">New Mission Assignment</h3>
                <span className="text-[8px] font-black uppercase tracking-widest text-cyan-400 mt-1">Open Design Intelligence: ON</span>
              </div>
              <button 
                type="button"
                onClick={() => setShowDiscovery(prev => !prev)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition text-[9px] font-black uppercase tracking-wider ${showDiscovery ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
              >
                <Zap size={10} /> {showDiscovery ? 'Hide Brief' : 'Add Brief'}
              </button>
            </div>

            {showDiscovery && (
              <div className="mb-6 grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black uppercase tracking-widest text-white/20">Audience</label>
                  <input type="text" placeholder="e.g. Investors" value={brief.audience} onChange={e => setBrief({...brief, audience: e.target.value})} className="w-full bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-[10px] text-white outline-none focus:border-cyan-500/30" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black uppercase tracking-widest text-white/20">Tone</label>
                  <input type="text" placeholder="e.g. Futuristic" value={brief.tone} onChange={e => setBrief({...brief, tone: e.target.value})} className="w-full bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-[10px] text-white outline-none focus:border-cyan-500/30" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black uppercase tracking-widest text-white/20">Fidelity</label>
                  <select value={brief.fidelity} onChange={e => setBrief({...brief, fidelity: e.target.value})} className="w-full bg-black/20 border border-white/5 rounded-lg px-3 py-1.5 text-[10px] text-white outline-none">
                    <option>High (Brand Grade)</option>
                    <option>Medium (Functional)</option>
                    <option>Low (Wireframe)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black uppercase tracking-widest text-white/20">Surface</label>
                  <input type="text" placeholder="e.g. Desktop Web" value={brief.surface} onChange={e => setBrief({...brief, surface: e.target.value})} className="w-full bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-[10px] text-white outline-none focus:border-cyan-500/30" />
                </div>
              </div>
            )}
            <form onSubmit={handleCreateIssue} className="space-y-6">
              <div className="space-y-4">
                <textarea autoFocus value={newIssuePrompt} onChange={(e) => setNewIssuePrompt(e.target.value)} placeholder="Describe the mission goal..." className="w-full h-32 rounded-xl bg-black/40 border border-white/10 p-4 text-sm text-white focus:border-cyan-500/50 outline-none" />
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Priority</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500/50 outline-none appearance-none">
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Execution</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500/50 outline-none appearance-none">
                      <option value="auto">Auto-Orchestrate</option>
                      <option value="manual">Manual Start</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
                <button type="button" onClick={() => setShowNewIssueModal(false)} className="text-xs font-bold text-white/20 hover:text-white transition">Cancel</button>
                <button type="submit" className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-2.5 text-xs font-black text-black hover:bg-cyan-400 transition shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                  <Plus size={14} /> Create & Run
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Routine Modal */}
      {showNewRoutineModal && (
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
               <p className="max-w-[200px] text-[9px] font-medium text-white/20 leading-relaxed">After creation, Paperclip takes you straight to trigger setup.</p>
               <div className="flex gap-4 items-center">
                  <button type="button" onClick={() => setShowNewRoutineModal(false)} className="text-[11px] font-bold text-white/40 hover:text-white transition">Cancel</button>
                  <button onClick={handleCreateRoutine} className="flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 text-[11px] font-black text-black hover:bg-white/90 transition"><Plus size={14} /> Create routine</button>
               </div>
            </div>
          </div>
        </div>
      )}

      <AgentConfigModal />
      {showOnboarding && <Onboarding onComplete={() => { setShowOnboarding(false); localStorage.setItem("onboarding_complete", "true"); }} />}
    </div>
  );
}