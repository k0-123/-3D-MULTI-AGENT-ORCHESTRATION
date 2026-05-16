import { useMemo } from "react";
import { WORKSTATIONS } from "@/store/useAgentStore";
import * as THREE from "three";
import { Chair } from "./Chair";
import { Float, Sparkles, MeshDistortMaterial } from "@react-three/drei";

function Fireflies({ count = 20 }) {
  return (
    <group>
      {Array.from({ length: count }).map((_, i) => (
        <Sparkles
          key={i}
          count={10}
          scale={5}
          size={2}
          speed={0.4}
          color="#a0feff"
          position={[
            (Math.random() - 0.5) * 30,
            Math.random() * 5,
            (Math.random() - 0.5) * 30,
          ]}
        />
      ))}
    </group>
  );
}

function FloatingCrystal({ position, color = "#42a5f5" }: { position: [number, number, number], color?: string }) {
  return (
    <Float speed={2} rotationIntensity={2} floatIntensity={2}>
      <mesh position={position}>
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={2} 
          transparent 
          opacity={0.8}
        />
      </mesh>
    </Float>
  );
}

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
        <meshStandardMaterial color="#1a1a1a" emissive="#3aa0ff" emissiveIntensity={1.5} flatShading />
      </mesh>
      
      {/* Table Glow */}
      <pointLight position={[0, 1, 0]} intensity={0.5} color="#3aa0ff" distance={3} />
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

function VoxelFloor({ size = 32 }: { size?: number }) {
  const meshRef = useMemo(() => {
    const tempObject = new THREE.Object3D();
    const tempColor = new THREE.Color();
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ flatShading: true });
    
    const count = size * size;
    const mesh = new THREE.InstancedMesh(geometry, material, count);
    
    let i = 0;
    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        const id = i++;
        const posX = x - size / 2 + 0.5;
        const posZ = z - size / 2 + 0.5;
        
        // Slight height variation for "organic" voxel look
        const noise = Math.sin(x * 0.5) * Math.cos(z * 0.5) * 0.15;
        tempObject.position.set(posX, noise - 0.2, posZ);
        tempObject.updateMatrix();
        mesh.setMatrixAt(id, tempObject.matrix);
        
        // Color variation (shades of green)
        const greenBase = 0.4 + Math.random() * 0.1;
        tempColor.setHSL(0.33, 0.4 + Math.random() * 0.2, greenBase);
        mesh.setColorAt(id, tempColor);
      }
    }
    mesh.instanceColor!.needsUpdate = true;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    return mesh;
  }, [size]);

  return <primitive object={meshRef} />;
}

export function VoxelWorld({ night }: { night: boolean }) {
  // Floating Island Base (Dirt)
  const dirtBase = (
    <mesh position={[0, -1.2, 0]} receiveShadow>
      <boxGeometry args={[32.5, 1.5, 32.5]} />
      <meshStandardMaterial color="#4a311d" flatShading />
    </mesh>
  );

  return (
    <group>
      {/* Environmental Lighting Adjustments */}
      <ambientLight intensity={night ? 0.2 : 0.6} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={night ? 0.3 : 1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      {night && <pointLight position={[0, 2, 0]} intensity={15} color="#ffaa00" distance={10} />}
      
      {dirtBase}
      <VoxelFloor size={32} />
      
      {/* Trees at the very edges to avoid blocking view */}
      <Tree position={[-15, 0.2, -15]} />
      <Tree position={[15, 0.2, -15]} />
      <Tree position={[-15, 0.2, 15]} />
      <Tree position={[15, 0.2, 15]} />
      
      {/* Remove middle trees that block the workstations */}

      {/* Workstations with Chairs */}
      {WORKSTATIONS.map((p, i) => (
        <group key={i} position={[p[0], p[1] + 0.1, p[2]]}>
          <Workstation position={[0, 0, 0]} />
          <Chair position={[0, 0, 1.1]} />
        </group>
      ))}
      
      {/* Data Hub */}
      <DataHub night={night} />

      {/* Decorations */}
      <Fireflies count={15} />
      
      {/* Floating Crystals around the hub */}
      <FloatingCrystal position={[-3, 4, -3]} color="#f5c542" />
      <FloatingCrystal position={[3, 5, 3]} color="#ab47bc" />
      <FloatingCrystal position={[-4, 3, 2]} color="#42a5f5" />
      <FloatingCrystal position={[4, 6, -2]} color="#ef5350" />
    </group>
  );
}
