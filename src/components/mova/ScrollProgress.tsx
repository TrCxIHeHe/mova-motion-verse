import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.2 });

    return (
        <motion.div
            style={{ scaleX }}
            className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[60] bg-gradient-to-r from-cyan via-purple to-cyan"
        />
    );
}