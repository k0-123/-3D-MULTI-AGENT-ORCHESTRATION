import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { VoxelWorld } from "./VoxelWorld";
import { MinecraftAgent } from "./MinecraftAgent";
import { useAgentStore } from "@/store/useAgentStore";

function CameraRig() {
  const activeId = useAgentStore((s) => s.activeModalAgentId);
  const agents = useAgentStore((s) => s.agents);
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(18, 18, 18));
  const lookAt = useRef(new THREE.Vector3(0, 0, 0));
  const tmp = useRef(new THREE.Vector3());

  useFrame(() => {
    const focus = activeId ? agents.find((a) => a.id === activeId) : null;
    if (focus) {
      targetPos.current.set(focus.position[0] + 4, focus.position[1] + 4, focus.position[2] + 4);
      lookAt.current.set(...focus.position);
    } else {
      targetPos.current.set(18, 18, 18);
      lookAt.current.set(0, 0, 0);
    }
    camera.position.lerp(targetPos.current, 0.05);
    tmp.current.lerpVectors(tmp.current, lookAt.current, 0.1);
    camera.lookAt(lookAt.current);
  });
  return null;
}

function SkyAndLights() {
  const time = useAgentStore((s) => s.timeOfDay);
  const night = time === "night";
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const fireRef = useRef<THREE.PointLight>(null);
  const bgColor = useRef(new THREE.Color("#7ec8ff"));
  const targetBg = useRef(new THREE.Color());
  const { scene } = useThree();

  useFrame(() => {
    targetBg.current.set(night ? "#0a0f24" : "#7ec8ff");
    bgColor.current.lerp(targetBg.current, 0.04);
    scene.background = bgColor.current;
    if (scene.fog) (scene.fog as THREE.Fog).color.copy(bgColor.current);

    if (ambientRef.current)
      ambientRef.current.intensity = THREE.MathUtils.lerp(ambientRef.current.intensity, night ? 0.15 : 0.7, 0.05);
    if (sunRef.current)
      sunRef.current.intensity = THREE.MathUtils.lerp(sunRef.current.intensity, night ? 0.05 : 1.4, 0.05);
    if (fireRef.current)
      fireRef.current.intensity = THREE.MathUtils.lerp(fireRef.current.intensity, night ? 6 : 0, 0.05);
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.7} />
      <directionalLight
        ref={sunRef}
        position={[12, 18, 8]}
        intensity={1.4}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />
      <pointLight ref={fireRef} position={[0, 1.3, 0]} intensity={0} color="#ffaa55" distance={22} decay={1.4} castShadow />
    </>
  );
}

export function Scene() {
  const agents = useAgentStore((s) => s.agents);
  const time = useAgentStore((s) => s.timeOfDay);
  const setActiveModalAgent = useAgentStore((s) => s.setActiveModalAgent);

  return (
    <Canvas
      shadows
      camera={{ position: [18, 18, 18], fov: 45 }}
      gl={{ antialias: false }}
      dpr={[1, 1.5]}
      onPointerMissed={() => setActiveModalAgent(null)}
    >
      <fog attach="fog" args={["#7ec8ff", 28, 70]} />
      <SkyAndLights />
      <VoxelWorld night={time === "night"} />
      {agents.map((a) => (
        <MinecraftAgent key={a.id} agent={a} />
      ))}
      <CameraRig />
      <OrbitControls
        enablePan={false}
        minDistance={10}
        maxDistance={45}
        maxPolarAngle={Math.PI / 2.2}
      />
    </Canvas>
  );
}
