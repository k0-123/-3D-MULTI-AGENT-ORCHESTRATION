import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Users, Zap, ShieldCheck, Rocket } from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
}

const steps = [
  {
    title: "Welcome to Agent·Board",
    description: "Your autonomous startup command center. Real agents, real work, real-time 3D orchestration.",
    icon: <Rocket className="text-cyan-400" />,
    color: "from-cyan-500 to-blue-600"
  },
  {
    title: "Meet Karan (CEO)",
    description: "Karan leads the mission. He analyzes your goals, drafts the strategy, and delegates tasks to the best agents.",
    icon: <ShieldCheck className="text-emerald-400" />,
    color: "from-emerald-500 to-teal-600"
  },
  {
    title: "The Expert Workforce",
    description: "Our agents specialize in engineering, growth, strategy, and design. They work in parallel to scale your vision.",
    icon: <Users className="text-amber-400" />,
    color: "from-amber-500 to-orange-600"
  },
  {
    title: "Mission Control",
    description: "Watch them move in the 3D scene, review their deliverables in the inbox, and approve their work to move forward.",
    icon: <Zap className="text-fuchsia-400" />,
    color: "from-fuchsia-500 to-purple-600"
  }
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md pointer-events-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#0f121a] shadow-2xl"
      >
        <div className={`h-2 w-full bg-gradient-to-r ${steps[currentStep].color}`} />
        
        <div className="p-10 space-y-8">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center scale-125">
              {steps[currentStep].icon}
            </div>
          </div>

          <div className="text-center space-y-3">
            <h2 className="text-2xl font-black tracking-tight text-white uppercase">{steps[currentStep].title}</h2>
            <p className="text-white/50 leading-relaxed text-sm">
              {steps[currentStep].description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 rounded-full transition-all duration-300 ${i === currentStep ? "w-8 bg-white" : "w-2 bg-white/10"}`} 
                />
              ))}
            </div>
            
            <button 
              onClick={handleNext}
              className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-black text-black hover:bg-white/90 transition active:scale-95"
            >
              {currentStep === steps.length - 1 ? "Start Mission" : "Continue"}
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <button 
          onClick={onComplete}
          className="absolute top-6 right-6 text-white/20 hover:text-white transition"
        >
          <X size={20} />
        </button>
      </motion.div>
    </div>
  );
}
