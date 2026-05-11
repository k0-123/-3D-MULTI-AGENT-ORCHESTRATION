import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { VoxelRoom } from "./VoxelRoom";
import { MinecraftAgent } from "./MinecraftAgent";
import { useAgentStore } from "@/store/useAgentStore";

export function Scene() {
  const agents = useAgentStore((s) => s.agents);

  return (
    <Canvas
      shadows
      camera={{ position: [14, 14, 14], fov: 45 }}
      gl={{ antialias: false }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={["#0b0e16"]} />
      <fog attach="fog" args={["#0b0e16", 25, 55]} />

      <ambientLight intensity={0.55} />
      <directionalLight
        position={[10, 15, 8]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-8, 10, -8]} intensity={0.3} color="#7aa2ff" />

      <VoxelRoom />
      {agents.map((a) => (
        <MinecraftAgent key={a.id} agent={a} />
      ))}

      <OrbitControls
        enablePan={false}
        minDistance={10}
        maxDistance={35}
        maxPolarAngle={Math.PI / 2.2}
      />
    </Canvas>
  );
}
