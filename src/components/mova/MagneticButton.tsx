import { motion, useMotionValue, useSpring } from "framer-motion";
import type { ReactNode, MouseEvent } from "react";
import { useRef } from "react";

export function MagneticButton({
  children,
  variant = "primary",
  href = "#",
  className = "",
}: {
  children: ReactNode;
  variant?: "primary" | "ghost";
  href?: string;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18 });
  const sy = useSpring(y, { stiffness: 220, damping: 18 });

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.25);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "group relative inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide overflow-hidden";
  const styles =
    variant === "primary"
      ? "text-obsidian bg-gradient-to-r from-cyan to-purple shadow-[0_0_40px_-8px_theme(colors.white/40%)]"
      : "text-foreground glass-strong hover:border-cyan/50";

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`${base} ${styles} ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <span className="relative z-10 w-4 h-px bg-current group-hover:w-8 transition-all duration-300" />
      {variant === "primary" && (
        <span className="absolute inset-0 bg-gradient-to-r from-purple to-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}
    </motion.a>
  );
}
