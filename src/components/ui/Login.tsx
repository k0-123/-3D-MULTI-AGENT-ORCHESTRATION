import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Mail, Lock, LogIn, UserPlus, ShieldCheck } from "lucide-react";

interface LoginProps {
  onSuccess: () => void;
}

export function Login({ onSuccess }: LoginProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (loginError) throw loginError;
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        alert("Verification email sent! Check your inbox.");
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0a0c14] pointer-events-auto">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0d101a] p-10 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-10 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
            <Box size={32} className="text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Agent-Board</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Secure Mission Access</p>
          </div>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 text-white/20 group-focus-within:text-cyan-400 transition" size={18} />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-white/5 bg-white/[0.03] py-3.5 pl-12 pr-4 text-sm text-white focus:border-cyan-500/50 focus:bg-white/[0.05] outline-none transition"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-white/20 group-focus-within:text-cyan-400 transition" size={18} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-white/5 bg-white/[0.03] py-3.5 pl-12 pr-4 text-sm text-white focus:border-cyan-500/50 focus:bg-white/[0.05] outline-none transition"
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-[10px] font-bold text-rose-400 uppercase tracking-widest text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-cyan-500 py-4 text-xs font-black text-black hover:bg-cyan-400 transition shadow-xl disabled:opacity-50"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
            ) : (
              <>
                {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                {isLogin ? "Sign In" : "Create Account"}
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition"
          >
            {isLogin ? "Need an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 pt-6 border-t border-white/5">
           <ShieldCheck size={14} className="text-emerald-500/50" />
           <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/10 italic">Encrypted Mission Tunnel</span>
        </div>
      </motion.div>
    </div>
  );
}
