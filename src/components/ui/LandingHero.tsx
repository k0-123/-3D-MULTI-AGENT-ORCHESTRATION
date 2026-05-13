import { useState } from "react";
import { Play, Shield, Zap, Cpu } from "lucide-react";

interface LandingHeroProps {
  onStart: () => void;
}

export function LandingHero({ onStart }: LandingHeroProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0b0e16] px-4">
      {/* Background Ambient Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-fuchsia-500/10 blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] h-[30%] w-[30%] rounded-full bg-blue-500/5 blur-[100px]" />
      </div>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-20" 
        style={{ 
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`,
          backgroundSize: '40px 40px' 
        }} 
      />

      {/* Content */}
      <div className="relative z-10 flex max-w-4xl flex-col items-center text-center">
        <div className="mb-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
          <Zap size={14} className="text-cyan-400" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
            Next-Gen Autonomous Intelligence
          </span>
        </div>

        <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white md:text-7xl lg:text-8xl">
          Multi-Agent <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 bg-clip-text text-transparent">
            Orchestration
          </span>
        </h1>

        <p className="mb-10 max-w-2xl text-lg text-white/40 md:text-xl">
          Coordinate specialized autonomous agents in a persistent 3D voxel environment. 
          Experience real-time task execution with advanced memory cycles and MCP integration.
        </p>

        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <button
            onClick={onStart}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-white px-8 py-4 text-lg font-bold text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
            <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
              <Play size={20} fill="currentColor" />
              Launch Workspace
            </span>
          </button>

          <div className="flex items-center gap-8 text-white/30">
            <div className="flex items-center gap-2">
              <Shield size={16} />
              <span className="text-xs font-medium uppercase tracking-widest">Secure MCP</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu size={16} />
              <span className="text-xs font-medium uppercase tracking-widest">3D Voxel Engine</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Status Indicators */}
      <div className="absolute bottom-10 left-10 hidden lg:block">
        <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 p-3 backdrop-blur-md">
          <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
            System Operational · 2.4ms Latency
          </span>
        </div>
      </div>
    </div>
  );
}
