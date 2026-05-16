import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { Stars, Sky, ContactShadows, MeshReflectorMaterial } from "@react-three/drei";
import { Agent, useAgentStore } from "../../store/useAgentStore";
import { AgentMesh } from "../AgentMesh";
import { ZoneFloor } from "../ZoneFloor";
import { CameraControlsUI } from "./CameraControlsUI";
import { AgentOverlay } from "./AgentOverlay";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";

function CameraRig() {
  const agents = useAgentStore((s) => s.agents);
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(18, 18, 18));
  const lookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    // Basic cinematic follow or free orbit
  });
  return null;
}

function SkyAndLights() {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const { scene } = useThree();

  useFrame(() => {
    scene.background = new THREE.Color("#0a0e1a");
  });

  return (
    <>
      <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight ref={ambientRef} intensity={0.4} />
      <directionalLight
        ref={sunRef}
        position={[12, 18, 8]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </>
  );
}

export function Scene() {
  const agents = useAgentStore((s) => s.agents);

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [12, 12, 12], fov: 45 }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#0a0e1a"]} />
        <fog attach="fog" args={["#0a0e1a", 10, 40]} />
        
        <SkyAndLights />
        <ZoneFloor />

        {agents.map((a) => (
          <AgentMesh key={a.id} agent={a} />
        ))}
        
        {/* Reflective Floor */}
        <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50]} />
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
          position={[0, -0.39, 0]} 
          opacity={0.4} 
          scale={20} 
          blur={2} 
          far={4.5} 
        />

        <CameraRig />
        <OrbitControls
          makeDefault
          enablePan={true}
          dampingFactor={0.1}
          enableDamping={true}
          maxDistance={40}
          minDistance={5}
        />
        
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={1} mipmapBlur intensity={0.5} radius={0.4} />
          <Noise opacity={0.02} />
          <Vignette offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
      <AgentOverlay />
    </>
  );
}

