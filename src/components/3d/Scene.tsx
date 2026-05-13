import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { VoxelWorld } from "./VoxelWorld";
import { Stars, Sky, ContactShadows, MeshReflectorMaterial } from "@react-three/drei";
import { MinecraftAgent } from "./MinecraftAgent";
import { useAgentStore } from "@/store/useAgentStore";
import { AgentOverlay } from "./AgentOverlay";
import { CameraControlsUI } from "./CameraControlsUI";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";

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
      // Cinematic close-up on the head
      targetPos.current.set(focus.position[0], focus.position[1] + 1.85, focus.position[2] + 2.5);
      lookAt.current.set(focus.position[0], focus.position[1] + 1.85, focus.position[2]);
      
      // Smoothly move to agent
      camera.position.lerp(targetPos.current, 0.05);
      camera.lookAt(lookAt.current);
    }
    // If no focus, DO NOTHING. Let OrbitControls handle it.
  });
  return null;
}

function SkyAndLights() {
  const time = useAgentStore((s) => s.timeOfDay);
  const night = time === "night";
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const fireRef = useRef<THREE.PointLight>(null);
  const bgColor = useRef(new THREE.Color("#0a0f24"));
  const targetBg = useRef(new THREE.Color());
  const { scene } = useThree();

  useFrame(() => {
    targetBg.current.set(night ? "#020412" : "#0a0f24");
    bgColor.current.lerp(targetBg.current, 0.04);
    scene.background = bgColor.current;
    if (scene.fog) (scene.fog as THREE.Fog).color.copy(bgColor.current);

    if (ambientRef.current)
      ambientRef.current.intensity = THREE.MathUtils.lerp(ambientRef.current.intensity, night ? 0.2 : 0.4, 0.05);
    if (sunRef.current)
      sunRef.current.intensity = THREE.MathUtils.lerp(sunRef.current.intensity, night ? 0.1 : 0.8, 0.05);
    if (fireRef.current)
      fireRef.current.intensity = THREE.MathUtils.lerp(fireRef.current.intensity, night ? 8 : 0, 0.05);
  });

  return (
    <>
      <Sky 
        distance={450000} 
        sunPosition={night ? [0, -1, 0] : [0, 1, 0]} 
        inclination={0} 
        azimuth={0.25} 
      />
      <Stars 
        radius={100} 
        depth={50} 
        count={night ? 10000 : 2000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1} 
      />
      <ambientLight ref={ambientRef} intensity={0.4} />
      <directionalLight
        ref={sunRef}
        position={[12, 18, 8]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight ref={fireRef} position={[0, 1.3, 0]} intensity={0} color="#ffaa55" distance={22} decay={1.4} castShadow />
    </>
  );
}

export function Scene() {
  const agents = useAgentStore((s) => s.agents);
  const time = useAgentStore((s) => s.timeOfDay);
  const setActiveModalAgent = useAgentStore((s) => s.setActiveModalAgent);
  const activeModalAgentId = useAgentStore((s) => s.activeModalAgentId);
  const activeIssues = useAgentStore((s) => s.activeIssues);

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [18, 18, 18], fov: 45 }}
        gl={{ antialias: false }}
        dpr={[1, 1.5]}
        onPointerMissed={() => setActiveModalAgent(null)}
      >
        <fog attach="fog" args={["#7ec8ff", 15, 50]} />
        <SkyAndLights />
        <VoxelWorld night={time === "night"} />
        {(() => {
          // Find the current in-progress task assignee (CEO delegates to them)
          const currentTask = activeIssues.find(i => i.status === "in_progress" || i.status === "todo");
          const ceoTaskTarget = currentTask?.assignee ?? null;

          return agents.map((a) => (
            <MinecraftAgent 
              key={a.id} 
              agent={a} 
              // CEO gets the beam pointing to the delegated agent (if not pointing to self)
              taskTargetId={a.id === "ceo" && ceoTaskTarget && ceoTaskTarget !== "ceo" ? ceoTaskTarget : undefined}
            />
          ));
        })()}
        
        {/* Reflective "Sea of Data" */}
        <mesh position={[0, -10, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[300, 300]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={1024}
            mixBlur={1}
            mixStrength={40}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#050505"
            metalness={0.5}
            mirror={1}
          />
        </mesh>

        <ContactShadows 
          position={[0, -1.2, 0]} 
          opacity={0.4} 
          scale={40} 
          blur={2} 
          far={4.5} 
        />

        <CameraRig />
        <OrbitControls
          makeDefault
          enablePan={true}
          screenSpacePanning={true}
          panSpeed={2.0}
          rotateSpeed={1.0}
          minDistance={1}
          maxDistance={250}
          dampingFactor={0.1}
          enableDamping={true}
        />
        
        {/* Touchpad Solo Controller */}
        <Html fullscreen pointerEvents="none">
          <CameraControlsUI />
        </Html>

        {/* Post-Processing Effects */}
        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={1.5} 
            mipmapBlur 
            intensity={1.2} 
            radius={0.4} 
          />
          <Noise opacity={0.02} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
      <AgentOverlay />
    </>
  );
}
