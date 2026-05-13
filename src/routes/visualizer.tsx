import { useState, useEffect, lazy, Suspense } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { AgentHUD } from "@/components/AgentHUD";
import { useAgentStore } from "@/store/useAgentStore";

// Lazy load the Scene to avoid top-level SSR issues with Three.js
const Scene = lazy(() => import("@/components/3d/Scene").then(m => ({ default: m.Scene })));

export const Route = createFileRoute("/visualizer")({
  component: Visualizer,
});

function Visualizer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0b0e16]">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#0b0e16]">
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
          </div>
        }
      >
        <Scene />
      </Suspense>

      <AgentHUD />

      {/* Floating Back Button */}
      <div className="pointer-events-none fixed inset-0 z-50 p-6">
        <Link
          to="/"
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold text-white/50 backdrop-blur-md transition hover:bg-black/40 hover:text-white shadow-xl"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </Link>
      </div>


      {/* Camera Control Guide */}
      <div className="pointer-events-none fixed bottom-6 left-6 z-50">
        <div className="rounded-xl border border-white/10 bg-black/40 p-4 text-[10px] font-mono text-white/40 backdrop-blur-md shadow-2xl">
          <p className="mb-1 text-cyan-400/60 font-bold uppercase tracking-widest">God Mode Controls</p>
          <ul className="space-y-1">
            <li><span className="text-white/60">Rotate:</span> 1-Finger Drag</li>
            <li><span className="text-white/60">Pan (Fly):</span> SHIFT + Drag</li>
            <li><span className="text-white/60">Zoom:</span> 2-Finger Pinch</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
