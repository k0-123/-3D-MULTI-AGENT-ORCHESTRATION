import { useMemo } from "react";
import { WORKSTATIONS } from "@/store/useAgentStore";
import * as THREE from "three";

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Trunk */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0.5 + i, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 1, 0.6]} />
          <meshStandardMaterial color="#6b3f1d" flatShading />
        </mesh>
      ))}
      {/* Leaves cluster */}
      {[
        [0, 0, 0],
        [1, 0, 0],
        [-1, 0, 0],
        [0, 0, 1],
        [0, 0, -1],
        [0, 1, 0],
        [1, 1, 0],
        [-1, 1, 0],
        [0, 1, 1],
        [0, 1, -1],
      ].map((p, i) => (
        <mesh key={i} position={[p[0], 4 + p[1], p[2]]} castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#3a8c3a" : "#2f7a2f"} flatShading />
        </mesh>
      ))}
    </group>
  );
}

function Workstation({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Wooden plank base */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.8, 1.2]} />
        <meshStandardMaterial color="#a8743a" flatShading />
      </mesh>
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[2.05, 0.05, 1.25]} />
        <meshStandardMaterial color="#8a5a26" flatShading />
      </mesh>
      {/* Laptop base */}
      <mesh position={[0, 0.85, 0.1]} castShadow>
        <boxGeometry args={[0.9, 0.05, 0.6]} />
        <meshStandardMaterial color="#3a3a3a" flatShading />
      </mesh>
      {/* Laptop screen */}
      <mesh position={[0, 1.15, -0.18]} rotation={[-0.25, 0, 0]} castShadow>
        <boxGeometry args={[0.9, 0.6, 0.04]} />
        <meshStandardMaterial color="#1a1a1a" emissive="#3aa0ff" emissiveIntensity={0.4} flatShading />
      </mesh>
    </group>
  );
}

function DataHub({ night }: { night: boolean }) {
  return (
    <group position={[0, 0, 0]}>
      {/* Stone ring base */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const r = 1.6;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * r, 0.3, Math.sin(angle) * r]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.55, 0.6, 0.55]} />
            <meshStandardMaterial color={i % 2 ? "#6c6c70" : "#828286"} flatShading />
          </mesh>
        );
      })}
      {/* Logs */}
      <mesh position={[0, 0.45, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <boxGeometry args={[0.3, 1.6, 0.3]} />
        <meshStandardMaterial color="#5a3a1a" flatShading />
      </mesh>
      <mesh position={[0, 0.45, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <boxGeometry args={[0.3, 1.6, 0.3]} />
        <meshStandardMaterial color="#5a3a1a" flatShading />
      </mesh>
      {/* Fire blocks (only at night) */}
      {night && (
        <>
          <mesh position={[0, 1, 0]}>
            <boxGeometry args={[0.6, 0.6, 0.6]} />
            <meshStandardMaterial
              color="#ff8c2a"
              emissive="#ff5a1a"
              emissiveIntensity={2.5}
              flatShading
            />
          </mesh>
          <mesh position={[0, 1.5, 0]}>
            <boxGeometry args={[0.4, 0.5, 0.4]} />
            <meshStandardMaterial
              color="#ffd54a"
              emissive="#ffaa2a"
              emissiveIntensity={2.5}
              flatShading
            />
          </mesh>
        </>
      )}
    </group>
  );
}

export function VoxelWorld({ night }: { night: boolean }) {
  const tiles = useMemo(() => {
    const arr: React.ReactElement[] = [];
    const size = 32;
    for (let x = -size / 2; x < size / 2; x++) {
      for (let z = -size / 2; z < size / 2; z++) {
        const variant = ((x * 7 + z * 13) >>> 0) % 4;
        const colors = ["#3c8a3c", "#3f9440", "#357f36", "#458f44"];
        arr.push(
          <mesh key={`${x}-${z}`} position={[x + 0.5, -0.05, z + 0.5]} receiveShadow>
            <boxGeometry args={[1, 0.1, 1]} />
            <meshStandardMaterial color={colors[variant]} flatShading />
          </mesh>,
        );
      }
    }
    return arr;
  }, []);

  // Dirt layer below
  const dirt = (
    <mesh position={[0, -0.55, 0]} receiveShadow>
      <boxGeometry args={[32, 1, 32]} />
      <meshStandardMaterial color="#5a3a22" flatShading />
    </mesh>
  );

  return (
    <group>
      {dirt}
      {tiles}
      {/* Trees at corners */}
      <Tree position={[-13, 0, -13]} />
      <Tree position={[13, 0, -13]} />
      <Tree position={[-13, 0, 13]} />
      <Tree position={[13, 0, 13]} />
      {/* Workstations */}
      {WORKSTATIONS.map((p, i) => (
        <Workstation key={i} position={p} />
      ))}
      {/* Data Hub */}
      <DataHub night={night} />
    </group>
  );
}
