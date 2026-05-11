import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Billboard, Sparkles, Torus } from "@react-three/drei";
import * as THREE from "three";
import { useAgentStore, type Agent } from "@/store/useAgentStore";

interface Props {
  agent: Agent;
}

export function MinecraftAgent({ agent }: Props) {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const setPosition = useAgentStore((s) => s.setPosition);
  const setStatus = useAgentStore((s) => s.setStatus);
  const activeModalAgentId = useAgentStore((s) => s.activeModalAgentId);
  const setActiveModalAgent = useAgentStore((s) => s.setActiveModalAgent);

  const tmpTarget = useRef(new THREE.Vector3());
  const tmpDir = useRef(new THREE.Vector3());
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    if (!agent.sparkleAt) return;
    setShowSparkles(true);
    const t = setTimeout(() => setShowSparkles(false), 2000);
    return () => clearTimeout(t);
  }, [agent.sparkleAt]);

  useFrame((state, delta) => {
    if (!root.current) return;
    const speed = 2.5;
    tmpTarget.current.set(...agent.targetPosition);
    const pos = root.current.position;
    const dist = pos.distanceTo(tmpTarget.current);
    const moving = dist > 0.05;

    if (moving) {
      tmpDir.current.subVectors(tmpTarget.current, pos);
      const step = Math.min(speed * delta, dist);
      tmpDir.current.normalize().multiplyScalar(step);
      pos.add(tmpDir.current);
      const angle = Math.atan2(tmpDir.current.x, tmpDir.current.z);
      const snapped = Math.round(angle / (Math.PI / 2)) * (Math.PI / 2);
      root.current.rotation.y = snapped;

      if (Math.random() < 0.1) setPosition(agent.id, [pos.x, pos.y, pos.z]);

      const t = state.clock.elapsedTime * 6;
      const swing = Math.sin(t) * 0.7;
      if (leftArm.current) leftArm.current.rotation.x = swing;
      if (rightArm.current) rightArm.current.rotation.x = -swing;
      if (leftLeg.current) leftLeg.current.rotation.x = -swing;
      if (rightLeg.current) rightLeg.current.rotation.x = swing;
    } else {
      pos.set(...agent.targetPosition);
      const lerp = THREE.MathUtils.lerp;
      if (leftArm.current) leftArm.current.rotation.x = lerp(leftArm.current.rotation.x, 0, 0.2);
      if (rightArm.current) rightArm.current.rotation.x = lerp(rightArm.current.rotation.x, 0, 0.2);
      if (leftLeg.current) leftLeg.current.rotation.x = lerp(leftLeg.current.rotation.x, 0, 0.2);
      if (rightLeg.current) rightLeg.current.rotation.x = lerp(rightLeg.current.rotation.x, 0, 0.2);

      if (agent.status === "moving") {
        // Determine new state by proximity to hub
        const atHub = Math.hypot(pos.x, pos.z) < 5.5;
        setStatus(agent.id, atHub ? "learning" : "working");
        setPosition(agent.id, [pos.x, pos.y, pos.z]);
      }

      // Learning head tilt
      if (agent.status === "learning" && head.current) {
        head.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.35 - 0.1;
      } else if (head.current) {
        head.current.rotation.x = lerp(head.current.rotation.x, 0, 0.1);
      }
    }

    // Holographic ring rotation when focused
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 1.5;
    }
  });

  const skin = "#e8b89a";
  const shirt = agent.color;
  const pants = "#3a3a55";
  const focused = activeModalAgentId === agent.id;

  return (
    <group ref={root} position={agent.position}>
      <group
        onClick={(e) => {
          e.stopPropagation();
          setActiveModalAgent(agent.id);
        }}
      >
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[0.6, 0.9, 0.35]} />
          <meshStandardMaterial color={shirt} flatShading />
        </mesh>
        <group ref={head} position={[0, 1.85, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color={skin} flatShading />
          </mesh>
        </group>
        <group ref={leftArm} position={[-0.4, 1.5, 0]}>
          <mesh position={[0, -0.4, 0]} castShadow>
            <boxGeometry args={[0.2, 0.85, 0.25]} />
            <meshStandardMaterial color={shirt} flatShading />
          </mesh>
        </group>
        <group ref={rightArm} position={[0.4, 1.5, 0]}>
          <mesh position={[0, -0.4, 0]} castShadow>
            <boxGeometry args={[0.2, 0.85, 0.25]} />
            <meshStandardMaterial color={shirt} flatShading />
          </mesh>
        </group>
        <group ref={leftLeg} position={[-0.15, 0.65, 0]}>
          <mesh position={[0, -0.4, 0]} castShadow>
            <boxGeometry args={[0.25, 0.85, 0.3]} />
            <meshStandardMaterial color={pants} flatShading />
          </mesh>
        </group>
        <group ref={rightLeg} position={[0.15, 0.65, 0]}>
          <mesh position={[0, -0.4, 0]} castShadow>
            <boxGeometry args={[0.25, 0.85, 0.3]} />
            <meshStandardMaterial color={pants} flatShading />
          </mesh>
        </group>
      </group>

      <Billboard position={[0, 2.6, 0]}>
        <Text fontSize={0.22} color="white" outlineWidth={0.02} outlineColor="black">
          {agent.name}
        </Text>
      </Billboard>

      {focused && (
        <Torus ref={ringRef} args={[1.1, 0.04, 8, 32]} position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2} transparent opacity={0.8} />
        </Torus>
      )}

      {showSparkles && (
        <Sparkles count={30} scale={2} size={4} speed={0.6} position={[0, 2.2, 0]} color="#fde047" />
      )}
    </group>
  );
}
