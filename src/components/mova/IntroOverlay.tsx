import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function IntroOverlay() {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setVisible(false);
            return;
        }
        const t = window.setTimeout(() => setVisible(false), 1900);
        return () => clearTimeout(t);
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="fixed inset-0 z-[100] bg-obsidian flex items-center justify-center"
                    exit={{
                        clipPath: "circle(0% at 50% 50%)",
                        transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
                    }}
                    style={{ clipPath: "circle(150% at 50% 50%)" }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.7, filter: "blur(12px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className="relative"
                    >
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan to-purple blur-2xl opacity-60 animate-pulse-glow" />
                        <div className="relative w-16 h-16 rounded-full bg-obsidian border border-white/20 grid place-items-center">
                            <span className="font-display font-bold text-lg tracking-widest">M</span>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="absolute bottom-16 text-[10px] uppercase tracking-[0.4em] text-muted-foreground"
                    >
                        Booting the dock network
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}