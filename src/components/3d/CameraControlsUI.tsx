import { useThree } from "@react-three/fiber";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Plus, Minus, Move } from "lucide-react";
import * as THREE from "three";

export function CameraControlsUI() {
  const { camera, controls } = useThree();

  const move = (x: number, y: number, z: number) => {
    if (!controls) return;
    
    // Get camera's forward/right vectors
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up);

    const delta = new THREE.Vector3()
      .addScaledVector(right, x)
      .addScaledVector(forward, z)
      .addScaledVector(new THREE.Vector3(0, 1, 0), y);

    camera.position.add(delta);
    // @ts-ignore
    controls.target.add(delta);
    // @ts-ignore
    controls.update();
  };

  const zoom = (amount: number) => {
    if (!controls) return;
    camera.position.multiplyScalar(amount);
    // @ts-ignore
    controls.update();
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-4 pointer-events-auto">
      {/* Zoom Controls */}
      <div className="flex flex-col gap-2 bg-black/60 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl">
        <button onClick={() => zoom(0.9)} className="p-3 hover:bg-white/10 rounded-xl text-white transition"><Plus size={18} /></button>
        <button onClick={() => zoom(1.1)} className="p-3 hover:bg-white/10 rounded-xl text-white transition"><Minus size={18} /></button>
      </div>

      {/* D-Pad Navigation */}
      <div className="grid grid-cols-3 gap-2 bg-black/60 backdrop-blur-xl border border-white/10 p-3 rounded-3xl shadow-2xl">
        <div />
        <button 
          onMouseDown={() => move(0, 0, 1.5)} 
          className="p-4 bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-500/50 border border-white/5 rounded-2xl text-white transition shadow-lg"
        >
          <ChevronUp size={20} />
        </button>
        <div />
        
        <button 
          onMouseDown={() => move(-1.5, 0, 0)} 
          className="p-4 bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-500/50 border border-white/5 rounded-2xl text-white transition shadow-lg"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center justify-center text-cyan-400 opacity-30"><Move size={16} /></div>
        <button 
          onMouseDown={() => move(1.5, 0, 0)} 
          className="p-4 bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-500/50 border border-white/5 rounded-2xl text-white transition shadow-lg"
        >
          <ChevronRight size={20} />
        </button>

        <div />
        <button 
          onMouseDown={() => move(0, 0, -1.5)} 
          className="p-4 bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-500/50 border border-white/5 rounded-2xl text-white transition shadow-lg"
        >
          <ChevronDown size={20} />
        </button>
        <div />
      </div>

      {/* Vertical Lift */}
      <div className="flex justify-between gap-2 bg-black/60 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl">
        <button onClick={() => move(0, 1.5, 0)} className="flex-1 py-3 hover:bg-cyan-500/20 rounded-xl text-white text-[10px] font-bold uppercase tracking-widest transition">Up</button>
        <button onClick={() => move(0, -1.5, 0)} className="flex-1 py-3 hover:bg-cyan-500/20 rounded-xl text-white text-[10px] font-bold uppercase tracking-widest transition">Down</button>
      </div>
    </div>
  );
}
