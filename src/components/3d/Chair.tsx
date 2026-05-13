import { useRef } from "react";
import * as THREE from "three";

export function Chair({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, Math.PI, 0]}>
      {/* Seat */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.1, 0.8]} />
        <meshStandardMaterial color="#3a2a1a" />
      </mesh>
      
      {/* Backrest - Now at the actual BACK (relative to 180 rotation) */}
      <mesh position={[0, 0.9, -0.35]} castShadow>
        <boxGeometry args={[0.8, 1, 0.1]} />
        <meshStandardMaterial color="#3a2a1a" />
      </mesh>
      
      {/* Legs */}
      {[
        [-0.3, 0.2, 0.3],
        [0.3, 0.2, 0.3],
        [-0.3, 0.2, -0.3],
        [0.3, 0.2, -0.3]
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} castShadow>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshStandardMaterial color="#2a1a0a" />
        </mesh>
      ))}
    </group>
  );
}
