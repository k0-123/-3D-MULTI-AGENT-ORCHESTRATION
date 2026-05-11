import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { useAgentStore, type Agent } from "@/store/useAgentStore";

interface Props {
  agent: Agent;
}

export function MinecraftAgent({ agent }: Props) {
  const root = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);

  const setLocation = useAgentStore((s) => s.setAgentLocation);
  const setStatus = useAgentStore((s) => s.setAgentStatus);

  // Mutable target/current vectors to avoid re-renders
  const tmpTarget = useRef(new THREE.Vector3());
  const tmpDir = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    if (!root.current) return;
    const speed = 2.5; // units per second
    tmpTarget.current.set(...agent.target_location);
    const pos = root.current.position;
    const dist = pos.distanceTo(tmpTarget.current);

    const moving = dist > 0.05;

    if (moving) {
      // Constant-speed lerp toward target
      tmpDir.current.subVectors(tmpTarget.current, pos);
      const step = Math.min(speed * delta, dist);
      tmpDir.current.normalize().multiplyScalar(step);
      pos.add(tmpDir.current);

      // Face direction of travel (snap to 90deg increments for blocky feel)
      const angle = Math.atan2(tmpDir.current.x, tmpDir.current.z);
      const snapped = Math.round(angle / (Math.PI / 2)) * (Math.PI / 2);
      root.current.rotation.y = snapped;

      // Sync to store occasionally
      if (Math.random() < 0.1) {
        setLocation(agent.id, [pos.x, pos.y, pos.z]);
      }

      // Walk cycle
      const t = state.clock.elapsedTime * 6;
      const swing = Math.sin(t) * 0.7;
      if (leftArm.current) leftArm.current.rotation.x = swing;
      if (rightArm.current) rightArm.current.rotation.x = -swing;
      if (leftLeg.current) leftLeg.current.rotation.x = -swing;
      if (rightLeg.current) rightLeg.current.rotation.x = swing;
    } else {
      // Snap to target & idle pose
      pos.set(...agent.target_location);
      if (leftArm.current) leftArm.current.rotation.x = THREE.MathUtils.lerp(leftArm.current.rotation.x, 0, 0.2);
      if (rightArm.current) rightArm.current.rotation.x = THREE.MathUtils.lerp(rightArm.current.rotation.x, 0, 0.2);
      if (leftLeg.current) leftLeg.current.rotation.x = THREE.MathUtils.lerp(leftLeg.current.rotation.x, 0, 0.2);
      if (rightLeg.current) rightLeg.current.rotation.x = THREE.MathUtils.lerp(rightLeg.current.rotation.x, 0, 0.2);

      if (agent.status === "moving") {
        setStatus(agent.id, agent.target_location[0] === 0 && agent.target_location[2] >= -3.5 && agent.target_location[2] <= 3.5 ? "meeting" : "working");
        setLocation(agent.id, [pos.x, pos.y, pos.z]);
      }
    }
  });

  const skin = "#e8b89a";
  const shirt = agent.color;
  const pants = "#3a3a55";

  return (
    <group ref={root} position={agent.current_location}>
      {/* Torso */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[0.6, 0.9, 0.35]} />
        <meshStandardMaterial color={shirt} flatShading />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.85, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={skin} flatShading />
      </mesh>

      {/* Left Arm — pivot at shoulder */}
      <group ref={leftArm} position={[-0.4, 1.5, 0]}>
        <mesh position={[0, -0.4, 0]} castShadow>
          <boxGeometry args={[0.2, 0.85, 0.25]} />
          <meshStandardMaterial color={shirt} flatShading />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArm} position={[0.4, 1.5, 0]}>
        <mesh position={[0, -0.4, 0]} castShadow>
          <boxGeometry args={[0.2, 0.85, 0.25]} />
          <meshStandardMaterial color={shirt} flatShading />
        </mesh>
      </group>

      {/* Left Leg — pivot at hip */}
      <group ref={leftLeg} position={[-0.15, 0.65, 0]}>
        <mesh position={[0, -0.4, 0]} castShadow>
          <boxGeometry args={[0.25, 0.85, 0.3]} />
          <meshStandardMaterial color={pants} flatShading />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLeg} position={[0.15, 0.65, 0]}>
        <mesh position={[0, -0.4, 0]} castShadow>
          <boxGeometry args={[0.25, 0.85, 0.3]} />
          <meshStandardMaterial color={pants} flatShading />
        </mesh>
      </group>

      {/* Name tag */}
      <Billboard position={[0, 2.6, 0]}>
        <Text fontSize={0.22} color="white" outlineWidth={0.02} outlineColor="black">
          {agent.name} · {agent.role}
        </Text>
      </Billboard>
    </group>
  );
}
