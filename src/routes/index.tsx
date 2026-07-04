import { motion, useScroll, useTransform, useInView, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { HeroScene } from "@/components/mova/HeroScene";
import { TechOrbitScene, TECH_MODULES } from "@/components/mova/TechOrbitScene";
import { Cursor } from "@/components/mova/Cursor";
import { SmoothScroll } from "@/components/mova/SmoothScroll";
import { Nav } from "@/components/mova/Nav";
import { MagneticButton } from "@/components/mova/MagneticButton";

export const Route = createFileRoute("/")({
  component: Landing,
});

/* ---------- shared bits ---------- */

function SectionEyebrow({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-cyan/80">
      <span className="font-mono">{index}</span>
      <span className="w-8 h-px bg-cyan/40" />
      <span className="text-muted-foreground">{title}</span>
    </div>
  );
}

function GridBackdrop() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0 / 0.4) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-cyan/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-purple/25 blur-[140px]" />
    </>
  );
}

function Counter({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const mv = useMotionValue(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, {
      duration: 2.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = v.toFixed(decimals) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, to, mv, suffix, decimals]);
  return <span ref={ref}>0{suffix}</span>;
}

/* ---------- HERO ---------- */

function Hero() {
  const [showCopy, setShowCopy] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShowCopy(true), 3800);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="top" className="relative h-[100svh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <HeroScene />
      </div>

      {/* vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#050505_90%)]" />

      {/* scanline */}
      <div className="pointer-events-none absolute inset-x-0 h-24 opacity-30 animate-scan bg-gradient-to-b from-transparent via-cyan/20 to-transparent" />

      {/* corner HUD */}
      <div className="absolute top-24 left-6 md:left-10 text-[10px] font-mono tracking-[0.3em] text-cyan/70">
        <div>SYS/MOVA-01</div>
        <div className="text-muted-foreground">DOCK · 47.3821° N</div>
      </div>
      <div className="absolute top-24 right-6 md:right-10 text-[10px] font-mono tracking-[0.3em] text-cyan/70 text-right">
        <div>STATUS · LIVE</div>
        <div className="text-muted-foreground">v.2026.11</div>
      </div>

      <div className="absolute inset-x-0 bottom-0 pb-14 md:pb-24 px-6 md:px-12 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={showCopy ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
            Now boarding the future
          </div>
          <h1 className="font-display font-medium text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] text-gradient">
            Move Smarter.
            <br />
            Live Freer.
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-muted-foreground text-base md:text-lg">
            Intelligent dock-based urban mobility, engineered from silicon to sidewalk.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <MagneticButton variant="primary" href="#platform">Explore Platform</MagneticButton>
            <MagneticButton variant="ghost" href="#join">Join the Movement</MagneticButton>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={showCopy ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-14 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-muted-foreground"
        >
          <span>Scroll to enter</span>
          <div className="w-px h-10 bg-gradient-to-b from-cyan to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- SECTION 1: The Future of Shared Mobility ---------- */

function FutureCity() {
  return (
    <section id="platform" className="relative py-32 md:py-48 px-6 md:px-12 overflow-hidden">
      <GridBackdrop />
      <div className="relative max-w-6xl mx-auto">
        <SectionEyebrow index="01" title="The network" />
        <h2 className="mt-4 font-display font-medium text-[clamp(2rem,5vw,4.5rem)] leading-[1] max-w-3xl">
          The future of <span className="text-gradient">shared mobility</span>, wired into the city itself.
        </h2>
        <p className="mt-5 max-w-xl text-muted-foreground">
          Every dock is a node. Every ride is data. MOVA weaves an intelligent lattice across the city so mobility becomes as ambient as the streetlights above it.
        </p>

        <div className="mt-20 relative aspect-[16/10] rounded-3xl overflow-hidden glass-strong">
          <CityHologram />
        </div>
      </div>
    </section>
  );
}

function CityHologram() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rot = useTransform(scrollYProgress, [0, 1], [8, -8]);
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const nodes = Array.from({ length: 14 }, (_, i) => ({
    x: 8 + (i * 37) % 84,
    y: 15 + (i * 53) % 70,
    d: (i * 0.2) % 1.6,
  }));

  return (
    <motion.div ref={ref} style={{ rotateX: rot, y }} className="absolute inset-0 [transform-style:preserve-3d] [perspective:1200px]">
      {/* neon perspective grid */}
      <div className="absolute inset-0 [transform:rotateX(60deg)_translateY(20%)_scale(1.6)] origin-center">
        <div
          className="absolute inset-0 animate-grid-move"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.88 0.16 210 / 0.5) 1px, transparent 1px), linear-gradient(90deg, oklch(0.88 0.16 210 / 0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage: "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)",
          }}
        />
      </div>

      {/* connection network */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="line" x1="0" x2="1">
            <stop offset="0" stopColor="#00E7FF" stopOpacity="0" />
            <stop offset="0.5" stopColor="#00E7FF" stopOpacity="0.9" />
            <stop offset="1" stopColor="#8A5CFF" stopOpacity="0" />
          </linearGradient>
        </defs>
        {nodes.map((n, i) => {
          const m = nodes[(i + 1) % nodes.length];
          return (
            <motion.line
              key={i}
              x1={n.x} y1={n.y} x2={m.x} y2={m.y}
              stroke="url(#line)"
              strokeWidth="0.2"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 1.5, delay: n.d, ease: "easeOut" }}
            />
          );
        })}
        {nodes.map((n, i) => (
          <g key={"n" + i}>
            <circle cx={n.x} cy={n.y} r="1.4" fill="#00E7FF" opacity="0.2" />
            <circle cx={n.x} cy={n.y} r="0.5" fill="#00E7FF">
              <animate attributeName="opacity" values="1;0.3;1" dur={`${2 + (i % 3)}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </svg>

      {/* moving scooters */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-purple shadow-[0_0_18px_#8A5CFF]"
          initial={{ x: "0%", y: `${20 + i * 25}%` }}
          animate={{ x: ["0%", "100%"] }}
          transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "linear", delay: i * 1.4 }}
        />
      ))}

      {/* labels */}
      <div className="absolute top-4 left-4 text-[10px] font-mono tracking-widest text-cyan/70">CITY.NET · 14 DOCKS · 384 FLEET</div>
      <div className="absolute bottom-4 right-4 text-[10px] font-mono tracking-widest text-cyan/70">LATENCY 12ms</div>
    </motion.div>
  );
}

/* ---------- SECTION 2: Smart Docking ---------- */

const DOCK_FEATURES = [
  { id: "qr", label: "QR Unlock", desc: "Sub-second cryptographic ride authorization." , x: 22, y: 30 },
  { id: "iot", label: "IoT Controller", desc: "Edge-compute node handling telemetry & safety.", x: 78, y: 22 },
  { id: "gps", label: "GPS", desc: "Centimeter-grade positioning per dock cell.", x: 82, y: 55 },
  { id: "charge", label: "Smart Charging", desc: "Adaptive current per battery health state.", x: 18, y: 62 },
  { id: "battery", label: "Battery Monitoring", desc: "Per-cell voltage, thermal, and cycle tracking.", x: 30, y: 82 },
  { id: "lock", label: "Automatic Lock", desc: "Magnetic dock lock verified end-to-end.", x: 74, y: 82 },
  { id: "led", label: "LED Guidance", desc: "Ambient light choreography guides riders in.", x: 50, y: 12 },
];

function SmartDock() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotY = useTransform(scrollYProgress, [0, 1], [-25, 25]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.05, 0.95]);

  return (
    <section id="dock" ref={ref} className="relative py-32 md:py-48 px-6 md:px-12 overflow-hidden">
      <GridBackdrop />
      <div className="relative max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <SectionEyebrow index="02" title="Smart docking" />
            <h2 className="mt-4 font-display font-medium text-[clamp(2rem,5vw,4.5rem)] leading-[1] max-w-2xl">
              Every dock is <span className="text-gradient">an intelligent gateway.</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm">
            Seven subsystems, engineered in unison. Scroll to inspect the anatomy of a MOVA dock.
          </p>
        </div>

        <div className="mt-20 relative aspect-[4/3] md:aspect-[16/9] rounded-3xl glass-strong overflow-hidden [perspective:1400px]">
          <motion.div style={{ rotateY: rotY, scale }} className="absolute inset-0 grid place-items-center [transform-style:preserve-3d]">
            <DockSVG />
          </motion.div>

          {DOCK_FEATURES.map((f, i) => (
            <Hotspot key={f.id} {...f} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DockSVG() {
  return (
    <svg viewBox="0 0 600 340" className="w-[85%] h-auto drop-shadow-[0_0_60px_rgba(0,231,255,0.25)]">
      <defs>
        <linearGradient id="metal" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#2a2a2a" />
          <stop offset="1" stopColor="#0a0a0a" />
        </linearGradient>
        <linearGradient id="neon" x1="0" x2="1">
          <stop offset="0" stopColor="#00E7FF" />
          <stop offset="1" stopColor="#8A5CFF" />
        </linearGradient>
      </defs>
      {/* base */}
      <rect x="60" y="240" width="480" height="24" rx="6" fill="url(#metal)" stroke="#333" />
      <rect x="72" y="262" width="456" height="3" fill="url(#neon)">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2.4s" repeatCount="indefinite" />
      </rect>
      {/* post */}
      <rect x="90" y="80" width="26" height="160" rx="4" fill="url(#metal)" stroke="#333" />
      <rect x="100" y="90" width="6" height="140" fill="#8A5CFF" opacity="0.9">
        <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
      </rect>
      {/* scooter */}
      <g transform="translate(180,150)">
        {/* wheel back */}
        <circle cx="20" cy="90" r="26" fill="#0a0a0a" stroke="#222" strokeWidth="2" />
        <circle cx="20" cy="90" r="10" fill="#00E7FF" opacity="0.7" />
        {/* deck */}
        <rect x="20" y="76" width="180" height="14" rx="4" fill="url(#metal)" stroke="#333" />
        {/* stem */}
        <path d="M200 80 L245 -10" stroke="#333" strokeWidth="10" strokeLinecap="round" />
        <path d="M200 80 L245 -10" stroke="url(#neon)" strokeWidth="2" strokeLinecap="round" />
        {/* handlebar */}
        <path d="M215 -10 L275 -10" stroke="#333" strokeWidth="8" strokeLinecap="round" />
        <circle cx="245" cy="-10" r="6" fill="#00E7FF">
          <animate attributeName="r" values="6;8;6" dur="1.6s" repeatCount="indefinite" />
        </circle>
        {/* wheel front */}
        <circle cx="200" cy="90" r="26" fill="#0a0a0a" stroke="#222" strokeWidth="2" />
        <circle cx="200" cy="90" r="10" fill="#8A5CFF" opacity="0.7" />
      </g>
      {/* charging pulse */}
      <g>
        <circle cx="103" cy="160" r="4" fill="#00E7FF">
          <animate attributeName="cy" values="220;90;220" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0;1" dur="2.5s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  );
}

function Hotspot({ x, y, label, desc, delay }: { x: number; y: number; label: string; desc: string; delay: number }) {
  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2 group"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      data-cursor-hover
    >
      <div className="relative">
        <div className="w-3 h-3 rounded-full bg-cyan shadow-[0_0_18px_#00E7FF]" />
        <div className="absolute inset-0 rounded-full bg-cyan/40 animate-ping" />
      </div>
      <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="glass-strong rounded-xl px-4 py-3 min-w-[220px]">
          <div className="text-xs font-medium">{label}</div>
          <div className="text-[11px] text-muted-foreground mt-1">{desc}</div>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- SECTION 3: Ride Experience ---------- */

function RideExperience() {
  const metrics = [
    { label: "Battery", value: "82%", accent: "cyan" },
    { label: "Speed", value: "22 km/h", accent: "purple" },
    { label: "Distance", value: "4.7 km", accent: "cyan" },
    { label: "Ride Time", value: "18:42", accent: "purple" },
    { label: "CO₂ Saved", value: "1.2 kg", accent: "cyan" },
  ];

  return (
    <section id="ride" className="relative py-32 md:py-48 px-6 md:px-12 overflow-hidden">
      <GridBackdrop />
      <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <SectionEyebrow index="03" title="Ride experience" />
          <h2 className="mt-4 font-display font-medium text-[clamp(2rem,5vw,4.5rem)] leading-[1]">
            Undock. Unbind. <span className="text-gradient">Unfold the city.</span>
          </h2>
          <p className="mt-5 text-muted-foreground max-w-md">
            The moment your scooter clears the dock, MOVA becomes a heads-up companion — routing, coaching, saving carbon in real time.
          </p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className="glass rounded-2xl p-4"
              >
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{m.label}</div>
                <div className={`mt-1 font-display text-2xl ${m.accent === "cyan" ? "text-cyan" : "text-purple"}`}>{m.value}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <RideMap />
      </div>
    </section>
  );
}

function RideMap() {
  return (
    <div className="relative aspect-square rounded-3xl glass-strong overflow-hidden">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.88 0.16 210 / 0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(0.88 0.16 210 / 0.3) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="path" x1="0" x2="1">
            <stop offset="0" stopColor="#00E7FF" />
            <stop offset="1" stopColor="#8A5CFF" />
          </linearGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="3" /></filter>
        </defs>
        <motion.path
          d="M40 340 Q 120 240 160 260 T 260 180 T 360 60"
          stroke="url(#path)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          filter="url(#glow)"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />
        <motion.path
          d="M40 340 Q 120 240 160 260 T 260 180 T 360 60"
          stroke="url(#path)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />
        <circle cx="40" cy="340" r="6" fill="#00E7FF" />
        <circle cx="360" cy="60" r="6" fill="#8A5CFF" />
        <circle r="5" fill="white">
          <animateMotion dur="6s" repeatCount="indefinite" path="M40 340 Q 120 240 160 260 T 260 180 T 360 60" />
        </circle>
      </svg>
      <div className="absolute top-4 left-4 text-[10px] font-mono tracking-widest text-cyan/70">RIDE#4021 · ROUTE OPTIMIZED</div>
      <div className="absolute bottom-4 left-4 glass rounded-xl px-3 py-2">
        <div className="text-[10px] text-muted-foreground uppercase tracking-widest">ETA</div>
        <div className="text-lg font-display">12 min</div>
      </div>
    </div>
  );
}

/* ---------- SECTION 4: Technology Stack ---------- */

function TechStack() {
  return (
    <section id="tech" className="relative py-32 md:py-48 px-6 md:px-12 overflow-hidden">
      <GridBackdrop />
      <div className="relative max-w-6xl mx-auto">
        <SectionEyebrow index="04" title="Technology core" />
        <div className="mt-4 grid md:grid-cols-2 gap-8 items-end">
          <h2 className="font-display font-medium text-[clamp(2rem,5vw,4.5rem)] leading-[1]">
            A stack that <span className="text-gradient">orbits itself.</span>
          </h2>
          <p className="text-muted-foreground max-w-md">
            No cards. No lists. Twelve services, three orbits — one intelligent core routing every ride, every dock, every packet.
          </p>
        </div>

        <div className="mt-16 relative aspect-square md:aspect-[16/10] max-w-4xl mx-auto rounded-3xl glass-strong overflow-hidden">
          <TechOrbitScene />
          {/* labels along orbits */}
          <div className="pointer-events-none absolute inset-0 flex flex-wrap gap-x-6 gap-y-2 p-6 items-end justify-center content-end">
            {TECH_MODULES.map((m, i) => (
              <motion.span
                key={m}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground"
              >
                · {m}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- SECTION 5: How MOVA Works ---------- */

const STEPS = [
  { n: "01", t: "Find Dock", d: "MOVA locates the nearest available dock in your radius." },
  { n: "02", t: "Scan QR", d: "Cryptographic handshake in under 400 milliseconds." },
  { n: "03", t: "Unlock", d: "Magnetic dock releases. Scooter powers up." },
  { n: "04", t: "Ride", d: "Adaptive routing keeps you in the safest, fastest lane." },
  { n: "05", t: "Park", d: "Auto-detected safe parking zones inside the geo-net." },
  { n: "06", t: "Dock", d: "LED guidance choreographs the perfect return." },
  { n: "07", t: "Payment", d: "Ride sealed. Receipt, carbon report, done." },
];

function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 20%"] });
  const line = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="how" ref={ref} className="relative py-32 md:py-48 px-6 md:px-12 overflow-hidden">
      <GridBackdrop />
      <div className="relative max-w-4xl mx-auto">
        <SectionEyebrow index="05" title="How MOVA works" />
        <h2 className="mt-4 font-display font-medium text-[clamp(2rem,5vw,4.5rem)] leading-[1]">
          Seven steps. <span className="text-gradient">Zero friction.</span>
        </h2>

        <div className="mt-20 relative pl-8 md:pl-16">
          <div className="absolute left-2 md:left-6 top-0 bottom-0 w-px bg-white/10" />
          <motion.div
            style={{ height: line }}
            className="absolute left-2 md:left-6 top-0 w-px bg-gradient-to-b from-cyan via-purple to-transparent"
          />
          <div className="space-y-16">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 0.7, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <div className="absolute -left-8 md:-left-16 top-1.5">
                  <div className="relative w-4 h-4 rounded-full bg-obsidian border-2 border-cyan shadow-[0_0_16px_#00E7FF]" />
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-xs text-cyan/70">{s.n}</span>
                  <h3 className="font-display text-2xl md:text-4xl">{s.t}</h3>
                </div>
                <p className="mt-2 text-muted-foreground max-w-lg">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- SECTION 6: Sustainability ---------- */

function Sustainability() {
  const stats = [
    { v: 2847, s: "t", l: "CO₂ Saved" },
    { v: 12.4, s: "M", l: "Electric Miles", d: 1 },
    { v: 384, s: "", l: "Dock Stations" },
    { v: 96, s: "K", l: "Active Riders" },
    { v: 41, s: "%", l: "Energy Saved" },
  ];

  return (
    <section id="impact" className="relative py-32 md:py-48 px-6 md:px-12 overflow-hidden">
      <GridBackdrop />
      <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div className="relative aspect-square max-w-md mx-auto md:mx-0">
          {/* Earth */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,#0f3460,#050505_70%)] shadow-[inset_0_0_80px_rgba(0,231,255,0.25)] overflow-hidden">
            <div className="absolute inset-0 opacity-60"
              style={{
                background:
                  "radial-gradient(circle at 30% 40%, #2dd4a8 0 8%, transparent 12%), radial-gradient(circle at 65% 55%, #22c55e 0 10%, transparent 14%), radial-gradient(circle at 50% 75%, #16a34a 0 6%, transparent 10%)",
              }}
            />
            <div className="absolute inset-0 animate-pulse-glow" style={{ background: "radial-gradient(circle at 30% 30%, #00E7FF 0%, transparent 40%)" }} />
          </div>
          <div className="absolute -inset-6 rounded-full border border-cyan/20 animate-[float-slow_10s_ease-in-out_infinite]" />
          <div className="absolute -inset-14 rounded-full border border-purple/15" />
          {/* orbiting leaves */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 20 + i * 6, repeat: Infinity, ease: "linear" }}
            >
              <div
                className="absolute left-1/2 top-0 w-2 h-2 rounded-full bg-cyan shadow-[0_0_16px_#00E7FF]"
                style={{ transform: `translate(-50%, -${20 + i * 20}px)` }}
              />
            </motion.div>
          ))}
        </div>

        <div>
          <SectionEyebrow index="06" title="Sustainability" />
          <h2 className="mt-4 font-display font-medium text-[clamp(2rem,5vw,4.5rem)] leading-[1]">
            A greener city, <span className="text-gradient">measured by the ride.</span>
          </h2>
          <p className="mt-5 text-muted-foreground max-w-md">
            MOVA turns every trip into a receipt for the planet — verifiable, transparent, cumulative.
          </p>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.l} className="glass rounded-2xl p-4">
                <div className="font-display text-3xl text-gradient">
                  <Counter to={s.v} suffix={s.s} decimals={s.d || 0} />
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- SECTION 7: Fleet Intelligence ---------- */

function FleetIntelligence() {
  const bars = Array.from({ length: 20 }, (_, i) => 30 + ((i * 37) % 70));
  const heat = Array.from({ length: 64 });

  return (
    <section id="fleet" className="relative py-32 md:py-48 px-6 md:px-12 overflow-hidden">
      <GridBackdrop />
      <div className="relative max-w-6xl mx-auto">
        <SectionEyebrow index="07" title="Fleet intelligence" />
        <h2 className="mt-4 font-display font-medium text-[clamp(2rem,5vw,4.5rem)] leading-[1] max-w-3xl">
          A control room for the <span className="text-gradient">living fleet.</span>
        </h2>

        <div className="mt-16 grid md:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="glass-strong rounded-3xl p-6 md:col-span-2 h-72 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Live scooter positions</div>
                <div className="font-display text-xl mt-1">Sector 07 · Real-time</div>
              </div>
              <div className="text-xs font-mono text-cyan/70 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" /> STREAM OK
              </div>
            </div>
            <div className="absolute inset-0 top-20 grid grid-cols-8 grid-rows-8 gap-1 p-6">
              {heat.map((_, i) => {
                const intensity = ((i * 53) % 100) / 100;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: intensity * 0.9 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.01 }}
                    className="rounded"
                    style={{ background: intensity > 0.6 ? "#8A5CFF" : "#00E7FF" }}
                  />
                );
              })}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="glass-strong rounded-3xl p-6 h-72 relative overflow-hidden">
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Dock occupancy</div>
            <div className="font-display text-xl mt-1">78%</div>
            <div className="absolute inset-x-6 bottom-6 flex items-end gap-1 h-32">
              {bars.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex-1 rounded-sm bg-gradient-to-t from-cyan/20 to-cyan"
                />
              ))}
            </div>
          </motion.div>

          {["Ride Analytics", "Battery Health", "Anomalies"].map((t, i) => (
            <motion.div key={t} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }} className="glass rounded-3xl p-6 h-48 relative overflow-hidden">
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{t}</div>
              <div className="mt-2 font-display text-3xl text-gradient">{["12,482", "97.4%", "0"][i]}</div>
              <svg className="absolute bottom-0 left-0 right-0" viewBox="0 0 200 60" preserveAspectRatio="none">
                <motion.path
                  d={["M0 40 Q 40 10 80 30 T 160 20 T 200 30", "M0 20 Q 40 40 80 20 T 160 40 T 200 30", "M0 50 L 200 50"][i]}
                  stroke="url(#path)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.8, delay: 0.3 }}
                />
                <defs>
                  <linearGradient id="path" x1="0" x2="1">
                    <stop offset="0" stopColor="#00E7FF" />
                    <stop offset="1" stopColor="#8A5CFF" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FINAL: Join MOVA ---------- */

function FinalScene() {
  return (
    <section id="join" className="relative min-h-[100svh] flex flex-col items-center justify-center px-6 md:px-12 py-32 overflow-hidden">
      {/* space backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#0b0b18_0%,#050505_60%)]" />
      <div className="absolute inset-0">
        {Array.from({ length: 80 }).map((_, i) => (
          <span
            key={i}
            className="absolute w-px h-px bg-white rounded-full"
            style={{
              top: `${(i * 53) % 100}%`,
              left: `${(i * 37) % 100}%`,
              opacity: 0.3 + ((i * 13) % 70) / 100,
              boxShadow: i % 6 === 0 ? "0 0 6px #00E7FF" : "none",
            }}
          />
        ))}
      </div>

      {/* glowing city arc */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[180vw] aspect-square rounded-full bg-[radial-gradient(circle_at_center,#00E7FF_0%,transparent_50%)] opacity-20 blur-3xl" />
      <div className="absolute bottom-[-40vw] left-1/2 -translate-x-1/2 w-[180vw] aspect-square rounded-full border-t border-cyan/40" />

      {/* logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, filter: "blur(20px)" }}
        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center"
      >
        <div className="text-[10px] uppercase tracking-[0.5em] text-cyan/70 mb-6">MOVA · 2026</div>
        <h2 className="font-display font-medium text-[clamp(3rem,12vw,10rem)] leading-none text-gradient tracking-tighter">
          MOVA
        </h2>
        <div className="mt-6 text-lg md:text-xl text-muted-foreground">Redefining Urban Mobility.</div>
        <div className="mt-10 flex justify-center">
          <MagneticButton variant="primary" href="#top">Join MOVA</MagneticButton>
        </div>
      </motion.div>

      <div className="absolute bottom-6 inset-x-0 text-center text-[10px] font-mono uppercase tracking-[0.35em] text-muted-foreground">
        © MOVA Systems · Built for cities that never sit still
      </div>
    </section>
  );
}

/* ---------- Root ---------- */

function Landing() {
  return (
    <main className="relative bg-obsidian text-foreground">
      <SmoothScroll />
      <Cursor />
      <Nav />
      <Hero />
      <FutureCity />
      <SmartDock />
      <RideExperience />
      <TechStack />
      <HowItWorks />
      <Sustainability />
      <FleetIntelligence />
      <FinalScene />
    </main>
  );
}
