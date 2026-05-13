import { useEffect, useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Billboard, Sparkles, Torus } from "@react-three/drei";
import * as THREE from "three";
import { useAgentStore, type Agent } from "@/store/useAgentStore";

// ─── Status → color mapping ───────────────────────────────────────────────────
const STATUS_COLOR: Record<string, string> = {
  idle:     "#888888",
  working:  "#22c55e",
  moving:   "#f59e0b",
  learning: "#a78bfa",
  reviewing: "#f59e0b",
};

const STATUS_LABEL: Record<string, string> = {
  idle:     "idle",
  working:  "working",
  moving:   "moving",
  learning: "learning",
  reviewing: "reviewing",
};

// ─── Truncate speech bubble text ─────────────────────────────────────────────
function truncate(s: string, n = 28): string {
  if (!s) return "";
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

// ─── Arc movement helper (smooth curved path, feels less robotic) ─────────────
function arcLerp(from: THREE.Vector3, to: THREE.Vector3, t: number): THREE.Vector3 {
  // Midpoint lifted slightly for an arc
  const mid = new THREE.Vector3().lerpVectors(from, to, 0.5);
  mid.y += Math.sin(Math.PI * t) * 1.2;
  // Quadratic bezier: from → mid → to
  const a = new THREE.Vector3().lerpVectors(from, mid, t);
  const b = new THREE.Vector3().lerpVectors(mid, to, t);
  return new THREE.Vector3().lerpVectors(a, b, t);
}

interface Props {
  agent: Agent;
  /** Optional: ID of the agent this one is currently sending a task to */
  taskTargetId?: string;
}

export function MinecraftAgent({ agent, taskTargetId }: Props) {
  const root       = useRef<THREE.Group>(null);
  const head       = useRef<THREE.Group>(null);
  const leftArm    = useRef<THREE.Group>(null);
  const rightArm   = useRef<THREE.Group>(null);
  const leftLeg    = useRef<THREE.Group>(null);
  const rightLeg   = useRef<THREE.Group>(null);
  const ringRef    = useRef<THREE.Mesh>(null);
  const beamRef    = useRef<THREE.Mesh>(null);

  const setPosition        = useAgentStore(s => s.setPosition);
  const setStatus          = useAgentStore(s => s.setStatus);
  const activeModalAgentId = useAgentStore(s => s.activeModalAgentId);
  const setActiveModalAgent = useAgentStore(s => s.setActiveModalAgent);
  const logs               = useAgentStore(s => s.logs);
  const agents             = useAgentStore(s => s.agents);

  // ── Refs for movement math ───────────────────────────────────────────────
  const tmpTarget  = useRef(new THREE.Vector3());
  const arcFrom    = useRef(new THREE.Vector3());
  const arcT       = useRef(0);
  const totalDist  = useRef(0);
  const isArcMove  = useRef(false);
  const lastActiveTarget = useRef(new THREE.Vector2());

  // ── States for UI ────────────────────────────────────────────────────────
  const [showSparkles, setShowSparkles]   = useState(false);
  const [speechText, setSpeechText]       = useState("");
  const [typingDots, setTypingDots]       = useState("");

  // ── Sparkle on config update ──────────────────────────────────────────────
  useEffect(() => {
    if (!agent.sparkleAt) return;
    setShowSparkles(true);
    const t = setTimeout(() => setShowSparkles(false), 2000);
    return () => clearTimeout(t);
  }, [agent.sparkleAt]);

  // ── Pull latest log line for this agent into speech bubble ────────────────
  useEffect(() => {
    const agentLogs = logs
      .filter(l => l.message.toUpperCase().startsWith(agent.id.toUpperCase() + ":"))
      .slice(-1);
    if (agentLogs.length) {
      const raw = agentLogs[0].message.replace(/^[^:]+:\s*/i, "");
      setSpeechText(truncate(raw, 30));
    }
  }, [logs, agent.id]);

  // ── Typing dots animation when working ───────────────────────────────────
  useEffect(() => {
    if (agent.status !== "working") { setTypingDots(""); return; }
    const interval = setInterval(() => {
      setTypingDots(d => d.length >= 3 ? "" : d + ".");
    }, 400);
    return () => clearInterval(interval);
  }, [agent.status]);

  // ── Start arc movement only when target changes significantly ─────────────
  useEffect(() => {
    if (!root.current) return;
    const newT = new THREE.Vector2(agent.targetPosition[0], agent.targetPosition[2]);
    const dist = newT.distanceTo(lastActiveTarget.current);
    
    // Increased sensitivity for small movements
    if (dist > 0.1) {
      arcFrom.current.copy(root.current.position);
      const isHub = newT.length() < 2;
      tmpTarget.current.set(newT.x, 0, isHub ? newT.y : newT.y + 1.1);
      totalDist.current = arcFrom.current.distanceTo(tmpTarget.current);
      arcT.current = 0;
      isArcMove.current = true;
      lastActiveTarget.current.copy(newT);
    }
  }, [agent.targetPosition[0], agent.targetPosition[2]]);

  // ── Task beam target position ─────────────────────────────────────────────
  const beamTarget = useMemo(() => {
    if (!taskTargetId) return null;
    const target = agents.find(a => a.id === taskTargetId);
    return target ? new THREE.Vector3(...target.position) : null;
  }, [taskTargetId, agents]);

  // ─── Main animation loop ──────────────────────────────────────────────────
  useFrame((state, delta) => {
    if (!root.current) return;
    const lerp  = THREE.MathUtils.lerp;
    const speed = 4.5; // Slightly faster for responsiveness

    const pos = root.current.position;
    const moving = isArcMove.current && arcT.current < 1;
    const atHub = Math.hypot(agent.targetPosition[0], agent.targetPosition[2]) < 2;
    const isSitting = !atHub && !moving;

    if (moving) {
      // PROPER MATH: Advance t based on total distance and constant speed
      arcT.current = Math.min(arcT.current + (speed * delta) / Math.max(totalDist.current, 0.1), 1);
      
      const arcPos = arcLerp(arcFrom.current, tmpTarget.current, arcT.current);
      pos.copy(arcPos);

      // Face movement direction
      const dir = new THREE.Vector3().subVectors(tmpTarget.current, pos);
      if (dir.length() > 0.01) {
        const angle = Math.atan2(dir.x, dir.z);
        const snapped = Math.round(angle / (Math.PI / 2)) * (Math.PI / 2);
        root.current.rotation.y = lerp(root.current.rotation.y, snapped, 0.3);
      }

      // Final arrival snap
      if (arcT.current >= 1) {
        pos.copy(tmpTarget.current);
        isArcMove.current = false;
        setPosition(agent.id, [pos.x, pos.y, pos.z]);
        if (agent.status === "moving") {
          setStatus(agent.id, atHub ? "learning" : "working");
        }
      }

      // Walk swing
      const t = state.clock.elapsedTime * 8;
      const sw = Math.sin(t) * 0.7;
      if (leftArm.current)  leftArm.current.rotation.x  = sw;
      if (rightArm.current) rightArm.current.rotation.x = -sw;
      if (leftLeg.current)  leftLeg.current.rotation.x  = -sw;
      if (rightLeg.current) rightLeg.current.rotation.x = sw;
      root.current.position.y = Math.abs(Math.sin(t)) * 0.08;

    } else {
      // Sitting / Idle animations
      if (isSitting) {
        root.current.rotation.y = lerp(root.current.rotation.y, Math.PI, 0.15);
        root.current.position.y = lerp(root.current.position.y, -0.4, 0.12);
        const typingSwing = agent.status === "working" ? Math.sin(state.clock.elapsedTime * 14) * 0.08 : -1.1;
        if (leftArm.current)  leftArm.current.rotation.x  = lerp(leftArm.current.rotation.x,  -1.1 + typingSwing, 0.12);
        if (rightArm.current) rightArm.current.rotation.x = lerp(rightArm.current.rotation.x, -1.1 - typingSwing, 0.12);
        if (leftLeg.current)  leftLeg.current.rotation.x  = lerp(leftLeg.current.rotation.x,  -Math.PI / 2, 0.15);
        if (rightLeg.current) rightLeg.current.rotation.x = lerp(rightLeg.current.rotation.x, -Math.PI / 2, 0.15);
      } else {
        root.current.position.y = lerp(root.current.position.y, 0, 0.12);
        if (leftArm.current)  leftArm.current.rotation.x  = lerp(leftArm.current.rotation.x,  0, 0.15);
        if (rightArm.current) rightArm.current.rotation.x = lerp(rightArm.current.rotation.x, 0, 0.15);
        if (leftLeg.current)  leftLeg.current.rotation.x  = lerp(leftLeg.current.rotation.x,  0, 0.15);
        if (rightLeg.current) rightLeg.current.rotation.x = lerp(rightLeg.current.rotation.x, 0, 0.15);
      }
    }

    // ── Head animations ───────────────────────────────────────────────────
    if (head.current) {
      if (agent.status === "learning") {
        // Slow curious tilt during night cycle
        head.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.2) * 0.3 - 0.1;
        head.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.25;
      } else if (agent.status === "working") {
        // Subtle look-down at screen
        head.current.rotation.x = lerp(head.current.rotation.x, -0.2, 0.08);
        head.current.rotation.y = lerp(head.current.rotation.y, 0, 0.1);
      } else {
        head.current.rotation.x = lerp(head.current.rotation.x, 0, 0.08);
        head.current.rotation.y = lerp(head.current.rotation.y, 0, 0.08);
      }
    }

    // ── Focus ring spin ───────────────────────────────────────────────────
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 1.8;
    }
  });

  const skin    = "#e8b89a";
  const shirt   = agent.color;
  const pants   = "#3a3a55";
  const focused = activeModalAgentId === agent.id;
  const statusColor = STATUS_COLOR[agent.status] ?? "#888888";

  return (
    <group ref={root} position={agent.position}>

      {/* ── Clickable body ───────────────────────────────────────────── */}
      <group onClick={e => { e.stopPropagation(); setActiveModalAgent(agent.id); }}>

        {/* Body */}
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[0.6, 0.9, 0.35]} />
          <meshStandardMaterial color={shirt} flatShading />
        </mesh>

        {/* Head */}
        <group ref={head} position={[0, 1.85, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color={skin} flatShading />
          </mesh>
        </group>

        {/* Arms */}
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

        {/* Legs */}
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

      {/* ── Name tag + status (always visible, faces camera) ─────────── */}
      <Billboard position={[0, 2.85, 0]} follow lockX={false} lockY={false} lockZ={false}>
        {/* Status dot */}
        <mesh position={[-0.52, 0, 0]}>
          <circleGeometry args={[0.06, 12]} />
          <meshBasicMaterial color={statusColor} />
        </mesh>
        {/* Name */}
        <Text fontSize={0.18} color="white" anchorX="center" anchorY="middle"
          outlineWidth={0.012} outlineColor="#000000">
          {agent.name}
        </Text>
        {/* Role sub-label */}
        <Text fontSize={0.12} color="#aaaaaa" anchorX="center" anchorY="middle"
          position={[0, -0.22, 0]} outlineWidth={0.008} outlineColor="#000000">
          {agent.role} · {STATUS_LABEL[agent.status]}
        </Text>
      </Billboard>

      {/* ── Speech bubble (working or learning) ─────────────────────── */}
      {(agent.status === "working" || agent.status === "learning") && speechText && (
        <Billboard position={[0, 3.5, 0]} follow lockX={false} lockY={false} lockZ={false}>
          {/* Bubble background */}
          <mesh>
            <planeGeometry args={[2.2, 0.4]} />
            <meshBasicMaterial color="#111827" transparent opacity={0.75} />
          </mesh>
          {/* Bubble border (slightly larger plane behind) */}
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[2.24, 0.44]} />
            <meshBasicMaterial color={agent.color} transparent opacity={0.6} />
          </mesh>
          <Text fontSize={0.13} color="white" anchorX="center" anchorY="middle"
            maxWidth={2.0} outlineWidth={0.006} outlineColor="#000000">
            {agent.status === "working" ? `${speechText}${typingDots}` : `💭 ${speechText}`}
          </Text>
        </Billboard>
      )}

      {/* ── Focus ring (holographic, selected agent) ─────────────────── */}
      {focused && (
        <Torus ref={ringRef as any} args={[1.1, 0.04, 8, 32]}
          position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee"
            emissiveIntensity={2} transparent opacity={0.8} />
        </Torus>
      )}

      {/* ── Learning glow (night cycle) ───────────────────────────────── */}
      {agent.status === "learning" && (
        <>
          <pointLight position={[0, 1.5, 0]} intensity={3} color="#a78bfa" distance={4} />
          <Sparkles count={20} scale={2.5} size={3} speed={0.3}
            position={[0, 1.5, 0]} color="#a78bfa" />
        </>
      )}

      {/* ── Task delegation sparkles ──────────────────────────────────── */}
      {showSparkles && (
        <Sparkles count={30} scale={2} size={4} speed={0.6}
          position={[0, 2.2, 0]} color="#fde047" />
      )}

      {/* ── Task beam (CEO → delegated agent) ────────────────────────── */}
      {taskTargetId && beamTarget && (
        <TaskBeam from={new THREE.Vector3(...agent.position)} to={beamTarget} color={shirt} />
      )}

    </group>
  );
}

// ─── Task Beam: animated line from one agent to another ──────────────────────
function TaskBeam({ from, to, color }: { from: THREE.Vector3; to: THREE.Vector3; color: string }) {
  const ref    = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  const { mid, length, rotation } = useMemo(() => {
    const dir    = new THREE.Vector3().subVectors(to, from);
    const length = dir.length();
    const mid    = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
    mid.y += 2; // arc upward
    const rotation = new THREE.Euler();
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize()
    );
    rotation.setFromQuaternion(quat);
    return { mid, length, rotation };
  }, [from, to]);

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.opacity = 0.4 + Math.sin(state.clock.elapsedTime * 6) * 0.3;
    }
  });

  return (
    <mesh ref={ref} position={mid} rotation={rotation}>
      <cylinderGeometry args={[0.04, 0.04, length, 6]} />
      <meshBasicMaterial ref={matRef} color={color} transparent opacity={0.5} />
    </mesh>
  );
}
