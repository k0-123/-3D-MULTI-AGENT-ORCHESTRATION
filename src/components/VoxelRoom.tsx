import { DESKS } from "@/store/useAgentStore";

export function VoxelRoom() {
  const tiles: JSX.Element[] = [];
  const size = 24;
  for (let x = -size / 2; x < size / 2; x++) {
    for (let z = -size / 2; z < size / 2; z++) {
      const dark = (x + z) % 2 === 0;
      tiles.push(
        <mesh key={`${x}-${z}`} position={[x + 0.5, -0.05, z + 0.5]} receiveShadow>
          <boxGeometry args={[1, 0.1, 1]} />
          <meshStandardMaterial color={dark ? "#2a2f3a" : "#363c4a"} flatShading />
        </mesh>
      );
    }
  }

  return (
    <group>
      {tiles}

      {/* Walls */}
      <mesh position={[0, 1.5, -size / 2]} receiveShadow>
        <boxGeometry args={[size, 3, 0.3]} />
        <meshStandardMaterial color="#1a1d26" flatShading />
      </mesh>
      <mesh position={[0, 1.5, size / 2]} receiveShadow>
        <boxGeometry args={[size, 3, 0.3]} />
        <meshStandardMaterial color="#1a1d26" flatShading />
      </mesh>
      <mesh position={[-size / 2, 1.5, 0]} receiveShadow>
        <boxGeometry args={[0.3, 3, size]} />
        <meshStandardMaterial color="#1a1d26" flatShading />
      </mesh>
      <mesh position={[size / 2, 1.5, 0]} receiveShadow>
        <boxGeometry args={[0.3, 3, size]} />
        <meshStandardMaterial color="#1a1d26" flatShading />
      </mesh>

      {/* Desks */}
      {Object.entries(DESKS).map(([name, [x, , z]]) => (
        <group key={name} position={[x, 0, z]}>
          <mesh position={[0, 0.5, 0.7]} castShadow receiveShadow>
            <boxGeometry args={[1.6, 1, 0.8]} />
            <meshStandardMaterial color="#6b4f2a" flatShading />
          </mesh>
          <mesh position={[0, 1.15, 0.7]} castShadow>
            <boxGeometry args={[0.8, 0.3, 0.5]} />
            <meshStandardMaterial color="#111" flatShading />
          </mesh>
        </group>
      ))}

      {/* Central Meeting Table */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[5, 1, 5]} />
        <meshStandardMaterial color="#7a5230" flatShading />
      </mesh>
      <mesh position={[0, 1.05, 0]} castShadow>
        <boxGeometry args={[4.6, 0.1, 4.6]} />
        <meshStandardMaterial color="#a37444" flatShading />
      </mesh>
    </group>
  );
}
