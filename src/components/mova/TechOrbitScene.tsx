import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const MODULES = [
  "Backend", "Mobile App", "Cloud", "IoT",
  "GPS", "MQTT", "PostgreSQL", "Docker",
  "Flutter", "FastAPI", "Redis", "WebSockets",
];

function Core() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = s.clock.elapsedTime * 0.4;
    ref.current.rotation.x = s.clock.elapsedTime * 0.2;
  });
  return (
    <group>
      <Sphere args={[0.9, 64, 64]} ref={ref}>
        <meshStandardMaterial
          color="#0b0b0b"
          metalness={1}
          roughness={0.15}
          emissive="#00E7FF"
          emissiveIntensity={0.6}
          wireframe
        />
      </Sphere>
      <Sphere args={[0.55, 32, 32]}>
        <meshBasicMaterial color="#00E7FF" transparent opacity={0.15} />
      </Sphere>
      <pointLight position={[0, 0, 0]} intensity={3} color="#00E7FF" distance={6} />
    </group>
  );
}

function Orbit({ radius, speed, tilt, children }: { radius: number; speed: number; tilt: number; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = s.clock.elapsedTime * speed;
  });
  return (
    <group rotation={[tilt, 0, 0]}>
      <group ref={ref}>{children}</group>
    </group>
  );
}

function ModuleNode({ label, angle, radius }: { label: string; angle: number; radius: number }) {
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  return (
    <group position={[x, 0, z]}>
      <mesh>
        <icosahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial color="#8A5CFF" emissive="#8A5CFF" emissiveIntensity={1.2} />
      </mesh>
      <mesh>
        <ringGeometry args={[0.28, 0.32, 32]} />
        <meshBasicMaterial color="#00E7FF" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function OrbitRing({ radius }: { radius: number }) {
  const pts = useMemo(() => {
    const arr: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      arr.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    return arr;
  }, [radius]);
  const geom = useMemo(() => new THREE.BufferGeometry().setFromPoints(pts), [pts]);
  return (
    <line>
      <primitive object={geom} attach="geometry" />
      <lineBasicMaterial attach="material" color="#00E7FF" transparent opacity={0.15} />
    </line>
  );
}

export function TechOrbitScene() {
  const groups = [
    { radius: 2.2, speed: 0.25, tilt: 0.4, items: MODULES.slice(0, 4) },
    { radius: 3.2, speed: -0.18, tilt: -0.3, items: MODULES.slice(4, 8) },
    { radius: 4.2, speed: 0.14, tilt: 0.1, items: MODULES.slice(8, 12) },
  ];
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 2.4, 7], fov: 45 }}
    >
      <color attach="background" args={["#050505"]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[6, 6, 6]} intensity={1.5} color="#00E7FF" />
      <pointLight position={[-6, -3, -3]} intensity={1.5} color="#8A5CFF" />
      <Float speed={0.6} rotationIntensity={0.2} floatIntensity={0.3}>
        <Core />
      </Float>
      {groups.map((g, gi) => (
        <group key={gi} rotation={[g.tilt, 0, 0]}>
          <OrbitRing radius={g.radius} />
          <Orbit radius={g.radius} speed={g.speed} tilt={0}>
            {g.items.map((label, i) => (
              <ModuleNode key={label} label={label} angle={(i / g.items.length) * Math.PI * 2} radius={g.radius} />
            ))}
          </Orbit>
        </group>
      ))}
    </Canvas>
  );
}

export const TECH_MODULES = MODULES;
