import { motion } from "framer-motion";

const links = [
  { label: "Platform", href: "#platform" },
  { label: "Dock", href: "#dock" },
  { label: "Ride", href: "#ride" },
  { label: "Tech", href: "#tech" },
  { label: "Impact", href: "#impact" },
];

export function Nav() {
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(1200px,calc(100vw-2rem))]"
    >
      <div className="glass-strong rounded-full px-5 py-3 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 group">
          <div className="relative w-7 h-7">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan to-purple opacity-90 blur-[6px] group-hover:blur-[10px] transition-all" />
            <div className="absolute inset-[3px] rounded-full bg-obsidian border border-white/20" />
            <div className="absolute inset-0 grid place-items-center text-[10px] font-bold tracking-widest">M</div>
          </div>
          <span className="font-display font-semibold tracking-[0.2em] text-sm">MOVA</span>
        </a>
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative px-3 py-1.5 text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#join"
          className="relative inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.15em] font-medium text-obsidian bg-gradient-to-r from-cyan to-purple hover:shadow-glow-cyan transition-shadow"
        >
          Join
          <span className="w-1 h-1 rounded-full bg-obsidian animate-pulse" />
        </a>
      </div>
    </motion.header>
  );
}
