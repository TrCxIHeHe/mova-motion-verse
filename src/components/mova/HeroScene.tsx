import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";

/* ---------------- Particle logo that morphs into a dock ---------------- */

function sampleTextPositions(text: string, count: number): Float32Array {
  const canvas = document.createElement("canvas");
  const w = 1024, h = 256;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "white";
  ctx.font = "bold 200px 'Space Grotesk', system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, w / 2, h / 2);
  const data = ctx.getImageData(0, 0, w, h).data;
  const pts: [number, number][] = [];
  for (let y = 0; y < h; y += 3) {
    for (let x = 0; x < w; x += 3) {
      const i = (y * w + x) * 4;
      if (data[i] > 128) pts.push([x, y]);
    }
  }
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const p = pts[Math.floor(Math.random() * pts.length)];
    if (!p) continue;
    out[i * 3] = (p[0] - w / 2) / 60;
    out[i * 3 + 1] = -(p[1] - h / 2) / 60;
    out[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
  }
  return out;
}

function dockPositions(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = Math.random();
    let x = 0, y = 0, z = 0;
    if (r < 0.6) {
      // dock base slab
      x = (Math.random() - 0.5) * 8;
      y = -1.8 + (Math.random() - 0.5) * 0.15;
      z = (Math.random() - 0.5) * 2.4;
    } else if (r < 0.85) {
      // dock post
      x = -2.2 + (Math.random() - 0.5) * 0.4;
      y = -1.8 + Math.random() * 2.6;
      z = (Math.random() - 0.5) * 0.4;
    } else {
      // scooter silhouette
      const t = Math.random();
      x = -0.5 + t * 2.6;
      y = -0.8 + Math.sin(t * Math.PI) * 0.8;
      z = (Math.random() - 0.5) * 0.3;
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

function ParticleField({ phase }: { phase: number }) {
  // phase 0..1 -> logo -> dock
  const COUNT = 6500;
  const meshRef = useRef<THREE.Points>(null);
  const [ready, setReady] = useState(false);
  const targetsA = useRef<Float32Array>(new Float32Array(COUNT * 3));
  const targetsB = useRef<Float32Array>(new Float32Array(COUNT * 3));
  const seed = useRef<Float32Array>(new Float32Array(COUNT * 3));

  useEffect(() => {
    // random initial cloud
    for (let i = 0; i < COUNT; i++) {
      seed.current[i * 3] = (Math.random() - 0.5) * 30;
      seed.current[i * 3 + 1] = (Math.random() - 0.5) * 20;
      seed.current[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    targetsA.current = sampleTextPositions("MOVA", COUNT);
    targetsB.current = dockPositions(COUNT);
    setReady(true);
  }, []);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3));
    const colors = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const t = Math.random();
      // cyan -> purple gradient
      const c = new THREE.Color().lerpColors(
        new THREE.Color("#00E7FF"),
        new THREE.Color("#8A5CFF"),
        t,
      );
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, []);

  useFrame((state) => {
    if (!ready || !meshRef.current) return;
    const t = state.clock.getElapsedTime();
    const pos = meshRef.current.geometry.attributes.position.array as Float32Array;
    // assembly progress based on time (0..1) then blend into phase
    const assemble = Math.min(1, t / 2.6);
    const blend = phase; // 0 = logo, 1 = dock

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      const ax = targetsA.current[ix];
      const ay = targetsA.current[ix + 1];
      const az = targetsA.current[ix + 2];
      const bx = targetsB.current[ix];
      const by = targetsB.current[ix + 1];
      const bz = targetsB.current[ix + 2];
      const tx = ax * (1 - blend) + bx * blend;
      const ty = ay * (1 - blend) + by * blend;
      const tz = az * (1 - blend) + bz * blend;

      const sx = seed.current[ix];
      const sy = seed.current[ix + 1];
      const sz = seed.current[ix + 2];

      const px = sx * (1 - assemble) + tx * assemble;
      const py = sy * (1 - assemble) + ty * assemble;
      const pz = sz * (1 - assemble) + tz * assemble;

      // gentle drift
      pos[ix] = px + Math.sin(t * 0.6 + i) * 0.02;
      pos[ix + 1] = py + Math.cos(t * 0.5 + i * 0.3) * 0.02;
      pos[ix + 2] = pz;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.rotation.y = Math.sin(t * 0.15) * 0.15;
  });

  return (
    <points ref={meshRef} geometry={geom}>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/* ---------------- Dock hardware forming behind the particles ---------------- */

function DockHardware({ reveal }: { reveal: number }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    group.current.scale.setScalar(0.6 + reveal * 0.6);
    (group.current as THREE.Group).traverse((c) => {
      const m = (c as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
      if (m && "opacity" in m) {
        m.transparent = true;
        m.opacity = reveal * 0.9;
      }
    });
    group.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
  });

  return (
    <group ref={group} position={[0, -1.2, 0]}>
      {/* Base slab */}
      <mesh position={[0, -0.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[6, 0.3, 2]} />
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.9}
          roughness={0.25}
          emissive="#00E7FF"
          emissiveIntensity={0.05}
        />
      </mesh>
      {/* LED strip along base */}
      <mesh position={[0, -0.35, 1.02]}>
        <boxGeometry args={[5.6, 0.03, 0.02]} />
        <meshStandardMaterial color="#00E7FF" emissive="#00E7FF" emissiveIntensity={3} />
      </mesh>
      {/* Post */}
      <mesh position={[-2.2, 0.5, 0]}>
        <boxGeometry args={[0.25, 2.2, 0.4]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.3} />
      </mesh>
      {/* Post glow */}
      <mesh position={[-2.2, 0.5, 0.22]}>
        <boxGeometry args={[0.05, 2.0, 0.02]} />
        <meshStandardMaterial color="#8A5CFF" emissive="#8A5CFF" emissiveIntensity={3} />
      </mesh>
      {/* Scooter silhouette */}
      <group position={[0.4, -0.05, 0]}>
        {/* deck */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.6, 0.1, 0.32]} />
          <meshStandardMaterial color="#111" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* stem */}
        <mesh position={[0.7, 0.55, 0]} rotation={[0, 0, -0.15]}>
          <cylinderGeometry args={[0.04, 0.04, 1.2, 16]} />
          <meshStandardMaterial color="#222" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* handlebar */}
        <mesh position={[0.85, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.7, 16]} />
          <meshStandardMaterial color="#00E7FF" emissive="#00E7FF" emissiveIntensity={0.5} />
        </mesh>
        {/* wheels */}
        {[-0.7, 0.7].map((x, i) => (
          <mesh key={i} position={[x, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.22, 0.06, 12, 24]} />
            <meshStandardMaterial color="#0a0a0a" metalness={0.6} roughness={0.4} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function CameraRig() {
  const { camera, mouse } = useThree();
  useFrame(() => {
    camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.05;
    camera.position.y += (-mouse.y * 0.6 + 0.2 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export function HeroScene() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    // transition from logo -> dock after ~3.6s
    const t = window.setTimeout(() => {
      const start = performance.now();
      const anim = (now: number) => {
        const p = Math.min(1, (now - start) / 1800);
        setPhase(p * p * (3 - 2 * p));
        if (p < 1) requestAnimationFrame(anim);
      };
      requestAnimationFrame(anim);
    }, 3200);
    return () => clearTimeout(t);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.2, 8], fov: 45 }}
    >
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 8, 22]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[4, 4, 4]} intensity={2} color="#00E7FF" />
      <pointLight position={[-4, -2, 2]} intensity={2} color="#8A5CFF" />
      <Float speed={0.6} rotationIntensity={0.15} floatIntensity={0.4}>
        <ParticleField phase={phase} />
      </Float>
      <DockHardware reveal={phase} />
      <CameraRig />
      <Environment preset="night" />
    </Canvas>
  );
}
