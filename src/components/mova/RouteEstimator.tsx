import { motion, AnimatePresence, useMotionValue, animate as animateValue } from "framer-motion";
import { useMemo, useRef, useState, useEffect } from "react";

/* ---------------- Mock dock network — replace with real geocoding later ---------------- */

type Place = { name: string; area: string; lat: number; lng: number };

const PLACES: Place[] = [
    { name: "Koramangala Dock", area: "Koramangala", lat: 12.9352, lng: 77.6245 },
    { name: "Indiranagar Dock", area: "Indiranagar", lat: 12.9719, lng: 77.6412 },
    { name: "MG Road Dock", area: "MG Road", lat: 12.9758, lng: 77.6068 },
    { name: "HSR Layout Dock", area: "HSR Layout", lat: 12.9121, lng: 77.6446 },
    { name: "Domlur Dock", area: "Domlur", lat: 12.9611, lng: 77.6387 },
    { name: "Jayanagar Dock", area: "Jayanagar", lat: 12.9308, lng: 77.5838 },
    { name: "Marathahalli Dock", area: "Marathahalli", lat: 12.9569, lng: 77.7011 },
    { name: "Whitefield Dock", area: "Whitefield", lat: 12.9698, lng: 77.7500 },
    { name: "Malleswaram Dock", area: "Malleswaram", lat: 13.0027, lng: 77.5738 },
    { name: "Electronic City Dock", area: "Electronic City", lat: 12.8452, lng: 77.6602 },
];

const AVG_SPEED_KMH = 19; // realistic dock-scooter cruising speed incl. lights/traffic
const DOCK_BUFFER_MIN = 2.4; // unlock + park overhead
const CO2_PER_KM_CAR_G = 120;
const CALORIES_SAVED_PER_KM = 0; // scooters aren't cycling — kept for clarity, not shown

function haversineKm(a: Place, b: Place) {
    const R = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const lat1 = (a.lat * Math.PI) / 180;
    const lat2 = (b.lat * Math.PI) / 180;
    const h =
        Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function AnimatedNumber({ value, decimals = 0 }: { value: number; decimals?: number }) {
    const mv = useMotionValue(0);
    const [display, setDisplay] = useState("0");
    useEffect(() => {
        const controls = animateValue(mv, value, {
            duration: 1.1,
            ease: [0.22, 1, 0.36, 1],
            onUpdate: (v) => setDisplay(v.toFixed(decimals)),
        });
        return () => controls.stop();
    }, [value, decimals, mv]);
    return <span>{display}</span>;
}

function PlaceField({
    label,
    value,
    onChange,
    exclude,
    accent,
}: {
    label: string;
    value: Place;
    onChange: (p: Place) => void;
    exclude: string;
    accent: "cyan" | "purple";
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        window.addEventListener("mousedown", onClick);
        return () => window.removeEventListener("mousedown", onClick);
    }, []);

    return (
        <div ref={ref} className="relative flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                {label}
            </div>
            <button
                type="button"
                data-cursor-hover
                onClick={() => setOpen((o) => !o)}
                className={`w-full flex items-center gap-3 rounded-2xl glass px-4 py-3.5 text-left transition-all duration-300 ${open ? (accent === "cyan" ? "ring-1 ring-cyan/60" : "ring-1 ring-purple/60") : ""
                    }`}
            >
                <span
                    className={`w-2 h-2 rounded-full shrink-0 ${accent === "cyan" ? "bg-cyan shadow-[0_0_10px_#00E7FF]" : "bg-purple shadow-[0_0_10px_#8A5CFF]"
                        }`}
                />
                <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium truncate">{value.area}</span>
                    <span className="block text-[10px] text-muted-foreground truncate">{value.name}</span>
                </span>
                <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-muted-foreground shrink-0">
                    ▾
                </motion.span>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute z-30 mt-2 w-full max-h-64 overflow-y-auto rounded-2xl glass-strong p-1.5"
                    >
                        {PLACES.filter((p) => p.name !== exclude).map((p) => (
                            <button
                                key={p.name}
                                data-cursor-hover
                                onClick={() => {
                                    onChange(p);
                                    setOpen(false);
                                }}
                                className="w-full text-left px-3 py-2.5 rounded-xl text-sm hover:bg-white/8 transition-colors flex items-center justify-between group"
                            >
                                <span>
                                    <span className="block">{p.area}</span>
                                    <span className="block text-[10px] text-muted-foreground">{p.name}</span>
                                </span>
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan text-xs">
                                    select
                                </span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function RouteEstimator() {
    const [from, setFrom] = useState<Place>(PLACES[0]);
    const [to, setTo] = useState<Place>(PLACES[1]);
    const [revealed, setRevealed] = useState(false);
    const [calculating, setCalculating] = useState(false);

    const distanceKm = useMemo(() => haversineKm(from, to) * 1.28, [from, to]); // *1.28 road-network fudge factor
    const timeMin = useMemo(
        () => (distanceKm / AVG_SPEED_KMH) * 60 + DOCK_BUFFER_MIN,
        [distanceKm],
    );
    const fare = useMemo(() => Math.max(15, Math.round(10 + distanceKm * 6)), [distanceKm]);
    const co2SavedG = useMemo(() => distanceKm * CO2_PER_KM_CAR_G, [distanceKm]);

    const handleSwap = () => {
        setFrom(to);
        setTo(from);
    };

    const handleEstimate = () => {
        setCalculating(true);
        setRevealed(false);
        window.setTimeout(() => {
            setCalculating(false);
            setRevealed(true);
        }, 900);
    };

    return (
        <div className="relative rounded-[2rem] glass-strong p-6 md:p-10 overflow-hidden">
            {/* ambient glow */}
            <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-cyan/20 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-purple/20 blur-[110px]" />

            <div className="relative flex flex-col lg:flex-row gap-4 lg:items-end">
                <PlaceField label="Pick up" value={from} onChange={setFrom} exclude={to.name} accent="cyan" />

                <div className="flex justify-center lg:pb-3.5">
                    <motion.button
                        type="button"
                        data-cursor-hover
                        onClick={handleSwap}
                        whileTap={{ scale: 0.85, rotate: 180 }}
                        whileHover={{ scale: 1.08 }}
                        className="w-11 h-11 shrink-0 rounded-full glass grid place-items-center text-cyan"
                        aria-label="Swap locations"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="rotate-90 lg:rotate-0">
                            <path d="M7 7h13M17 3l4 4-4 4M17 17H4M7 21l-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </motion.button>
                </div>

                <PlaceField label="Drop off" value={to} onChange={setTo} exclude={from.name} accent="purple" />

                <motion.button
                    type="button"
                    data-cursor-hover
                    onClick={handleEstimate}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={calculating}
                    className="relative shrink-0 rounded-2xl px-7 py-3.5 text-sm font-medium text-obsidian bg-gradient-to-r from-cyan to-purple overflow-hidden lg:mb-0 disabled:opacity-70"
                >
                    <AnimatePresence mode="wait">
                        {calculating ? (
                            <motion.span
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2"
                            >
                                <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                    className="w-3.5 h-3.5 rounded-full border-2 border-obsidian/30 border-t-obsidian inline-block"
                                />
                                Routing…
                            </motion.span>
                        ) : (
                            <motion.span key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                Estimate my ride
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>

            {/* live connecting line */}
            <div className="relative mt-8 h-14">
                <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="absolute inset-0 w-full h-full opacity-70">
                    <defs>
                        <linearGradient id="est-line" x1="0" x2="1">
                            <stop offset="0" stopColor="#00E7FF" />
                            <stop offset="1" stopColor="#8A5CFF" />
                        </linearGradient>
                    </defs>
                    <motion.line
                        x1="4" y1="10" x2="96" y2="10"
                        stroke="url(#est-line)" strokeWidth="0.6" strokeDasharray="1.5 2.5" strokeLinecap="round"
                        animate={{ strokeDashoffset: [0, -20] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                    />
                </svg>
                <motion.div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_16px_white]"
                    animate={calculating ? { left: ["4%", "94%"] } : { left: "4%" }}
                    transition={calculating ? { duration: 0.9, ease: [0.4, 0, 0.2, 1] } : { duration: 0.4 }}
                />
            </div>

            {/* results */}
            <AnimatePresence>
                {revealed && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                            {[
                                { label: "Est. time", value: <><AnimatedNumber value={Math.round(timeMin)} /> min</> },
                                { label: "Distance", value: <><AnimatedNumber value={distanceKm} decimals={1} /> km</> },
                                { label: "Fare", value: <>₹<AnimatedNumber value={fare} /></> },
                                { label: "CO₂ saved vs car", value: <><AnimatedNumber value={co2SavedG / 1000} decimals={2} /> kg</> },
                            ].map((s, i) => (
                                <motion.div
                                    key={s.label}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    className="rounded-2xl glass p-4"
                                >
                                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{s.label}</div>
                                    <div className="mt-1 font-display text-2xl text-gradient">{s.value}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}