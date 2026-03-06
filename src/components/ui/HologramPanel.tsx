"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ServiceItem {
    number: string;
    name: string;
}

interface SpeechBubbleProps {
    isVisible: boolean;
    label: string;
    title: string;
    paragraphs: string[];
    services: ServiceItem[];
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const bubbleVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
    exit: {
        opacity: 0,
        y: 10,
        scale: 0.98,
        transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
    },
};

const childVariant = (delay: number) => ({
    hidden: { opacity: 0, y: 6 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1] as const,
            delay,
        },
    },
});

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function RobotSpeechBubble({
    isVisible,
    label,
    title,
    paragraphs,
    services,
}: SpeechBubbleProps) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key="robot-speech-bubble"
                    variants={bubbleVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    style={{
                        position: "absolute",
                        top: "6%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 15,
                        width: "min(440px, 38vw)",
                        pointerEvents: "none",
                    }}
                >
                    {/* ── Bubble body ──────────────────────────────────────────────── */}
                    <div
                        style={{
                            position: "relative",
                            padding: "22px 26px 20px",
                            background: "rgba(13, 15, 12, 0.72)",
                            backdropFilter: "blur(20px)",
                            WebkitBackdropFilter: "blur(20px)",
                            border: "1px solid rgba(107, 127, 98, 0.18)",
                            borderRadius: "6px",
                        }}
                    >
                        {/* ── Label ──────────────────────────────────────────────────── */}
                        <motion.p
                            variants={childVariant(0.05)}
                            initial="hidden"
                            animate="visible"
                            style={{
                                fontFamily:
                                    "var(--font-geist-mono, 'Geist Mono', monospace)",
                                fontSize: "9px",
                                fontWeight: 300,
                                letterSpacing: "0.25em",
                                textTransform: "uppercase",
                                color: "#6b7f62",
                                margin: 0,
                                marginBottom: "12px",
                            }}
                        >
                            {label}
                        </motion.p>

                        {/* ── Divider ────────────────────────────────────────────────── */}
                        <motion.div
                            variants={childVariant(0.1)}
                            initial="hidden"
                            animate="visible"
                            style={{
                                width: "28px",
                                height: "1px",
                                background:
                                    "linear-gradient(to right, #6b7f62, transparent)",
                                marginBottom: "14px",
                            }}
                        />

                        {/* ── Title ──────────────────────────────────────────────────── */}
                        <motion.p
                            variants={childVariant(0.15)}
                            initial="hidden"
                            animate="visible"
                            style={{
                                fontFamily:
                                    "var(--font-geist-sans, 'Geist', sans-serif)",
                                fontSize: "14px",
                                fontWeight: 200,
                                color: "#faf7f2",
                                letterSpacing: "0.04em",
                                lineHeight: 1.4,
                                margin: 0,
                                marginBottom: "12px",
                            }}
                        >
                            {title}
                        </motion.p>

                        {/* ── Body paragraphs ────────────────────────────────────────── */}
                        <motion.div
                            variants={childVariant(0.28)}
                            initial="hidden"
                            animate="visible"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                            }}
                        >
                            {paragraphs.map((text, i) => (
                                <p
                                    key={i}
                                    style={{
                                        fontFamily:
                                            "var(--font-geist-sans, 'Geist', sans-serif)",
                                        fontSize: "11px",
                                        fontWeight: 300,
                                        color: "#b6a492",
                                        letterSpacing: "0.03em",
                                        lineHeight: 1.7,
                                        margin: 0,
                                    }}
                                >
                                    {text}
                                </p>
                            ))}
                        </motion.div>

                        {/* ── Services list ───────────────────────────────────────────── */}
                        <div
                            style={{
                                borderTop: "1px solid rgba(107, 127, 98, 0.1)",
                                marginTop: "14px",
                                paddingTop: "12px",
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "0 16px",
                            }}
                        >
                            {services.map((service, i) => (
                                <motion.div
                                    key={service.number}
                                    variants={childVariant(0.42 + i * 0.06)}
                                    initial="hidden"
                                    animate="visible"
                                    style={{
                                        fontFamily:
                                            "var(--font-geist-mono, 'Geist Mono', monospace)",
                                        fontSize: "9px",
                                        fontWeight: 300,
                                        color: "#c8b4a0",
                                        letterSpacing: "0.1em",
                                        textTransform: "uppercase",
                                        padding: "5px 0",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <span
                                        style={{
                                            color: "#6b7f62",
                                            marginRight: "6px",
                                            fontVariantNumeric: "tabular-nums",
                                        }}
                                    >
                                        {service.number}
                                    </span>
                                    {service.name}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* ── Tail / pointer triangle ───────────────────────────────────── */}
                    <div
                        style={{
                            position: "relative",
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <div
                            style={{
                                width: 0,
                                height: 0,
                                borderLeft: "8px solid transparent",
                                borderRight: "8px solid transparent",
                                borderTop: "10px solid rgba(13, 15, 12, 0.72)",
                                filter: "drop-shadow(0 1px 0 rgba(107, 127, 98, 0.15))",
                            }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
