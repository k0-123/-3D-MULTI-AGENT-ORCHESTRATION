import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { Agent, useAgentStore } from "../store/useAgentStore";

const STATUS_COLOR: Record<string, string> = {
  idle:     "#4a9eff",
  walking:  "#22c55e",
  thinking: "#f59e0b",
  working:  "#8b5cf6",
  done:     "#10b981",
  error:    "#ef4444",
};

const ZONE_TARGETS: Record<string, [number, number, number]> = {
  research:  [-6, 0, -6],
  coding:    [6, 0, -6],
  analysis:  [-6, 0, 6],
  comms:     [6, 0, 6],
  idle:      [0, 0, 0],
};

interface Props { agent: Agent; }

export const AgentMesh = ({ agent }: Props) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const t = useRef(0);
  const setTarget = useAgentStore(s => s.setTarget);

  useFrame((_, delta) => {
    t.current += delta;
    if (!meshRef.current || !groupRef.current) return;

    // Smooth walk toward target — runs EVERY frame regardless of LLM status
    const curr = groupRef.current.position;
    const [tx, ty, tz] = agent.targetPosition;
    curr.x += (tx - curr.x) * 0.02;
    curr.y += (ty - curr.y) * 0.02;
    curr.z += (tz - curr.z) * 0.02;

    // Bob animation — always running
    if (agent.status === "thinking" || agent.status === "working") {
      meshRef.current.position.y = Math.sin(t.current * 5) * 0.1;
      meshRef.current.rotation.y += delta * 2;
    } else if (agent.status === "walking") {
      meshRef.current.position.y = Math.abs(Math.sin(t.current * 6)) * 0.12;
    } else {
      meshRef.current.position.y = Math.sin(t.current * 1.5) * 0.04;
    }
  });

  const color = STATUS_COLOR[agent.status] ?? "#888";
  const glow = ["thinking", "working"].includes(agent.status) ? 0.8 : 0.15;

  const setActiveModalAgent = useAgentStore(s => s.setActiveModalAgent);

  return (
    <group ref={groupRef} position={agent.position}>
      <mesh 
        ref={meshRef} 
        onClick={(e) => {
          e.stopPropagation();
          setActiveModalAgent(agent.id);
        }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        <capsuleGeometry args={[0.28, 0.75, 4, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={glow}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Status ring under agent */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.38, 0]}>
        <ringGeometry args={[0.35, 0.45, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>

      {/* Speech bubble via HTML overlay */}
      {agent.speechBubble && agent.status !== "idle" && (
        <Html position={[0, 1.4, 0]} center distanceFactor={8}>
          <div style={{
            background: "rgba(10,14,26,0.92)",
            border: `1px solid ${color}`,
            borderRadius: 8,
            padding: "6px 10px",
            fontSize: 11,
            color: "#c8d3f0",
            maxWidth: 160,
            fontFamily: "monospace",
            backdropFilter: "blur(4px)",
            pointerEvents: "none",
            lineHeight: 1.5,
          }}>
            <span style={{ color, fontSize: 9, display: "block", marginBottom: 2 }}>
              {agent.name} · {agent.status}
              {agent.status === "thinking" && <span className="dots">...</span>}
            </span>
            {agent.speechBubble}
          </div>
        </Html>
      )}
    </group>
  );
};
