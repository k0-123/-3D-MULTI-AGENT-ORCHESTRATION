import { Eye } from 'lucide-react';
import { Link } from "@tanstack/react-router";

interface HeaderProps {
  activeSection: string;
}

export function Header({ activeSection }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-white/5 bg-[#0b0e16] px-10">
      <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white/80">{activeSection}</h2>
      <Link to="/visualizer" className="flex items-center gap-2 text-[10px] font-bold text-cyan-500 uppercase tracking-widest hover:text-cyan-400 transition">
        <Eye size={14} /> Visualizer Mode
      </Link>
    </header>
  );
}
