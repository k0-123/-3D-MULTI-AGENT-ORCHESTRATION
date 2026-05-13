import { Text } from "@react-three/drei";

const ZONES = [
  { id: "research", label: "Research", pos: [-6, 0, -6] as [number,number,number], color: "#3b82f6" },
  { id: "coding",   label: "Code",     pos: [6,  0, -6] as [number,number,number], color: "#8b5cf6" },
  { id: "analysis", label: "Analysis", pos: [-6, 0, 6]  as [number,number,number], color: "#f59e0b" },
  { id: "comms",    label: "Comms",    pos: [6,  0, 6]  as [number,number,number], color: "#10b981" },
  { id: "idle",     label: "Rest",     pos: [0,  0, 0]  as [number,number,number], color: "#6b7280" },
];

export const ZoneFloor = () => (
  <>
    {/* Grid floor */}
    <gridHelper args={[24, 24, "#1a2438", "#1a2438"]} />

    {ZONES.map(zone => (
      <group key={zone.id} position={zone.pos}>
        {/* Zone circle decal */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <circleGeometry args={[2.2, 32]} />
          <meshBasicMaterial color={zone.color} transparent opacity={0.12} />
        </mesh>
        {/* Zone ring border */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[2.1, 2.3, 32]} />
          <meshBasicMaterial color={zone.color} transparent opacity={0.4} />
        </mesh>
        {/* Floating label */}
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.35}
          color={zone.color}
          anchorX="center"
          anchorY="middle"
        >
          {zone.label.toUpperCase()}
        </Text>
      </group>
    ))}
  </>
);
