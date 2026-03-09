"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { subscribeParallax } from "./cursorTracker";

const MONO = "var(--font-geist-mono, 'Geist Mono', monospace)";

/* ─── Keyboard navigation hint ────────────────────────────── */
function KeyboardHint() {
    return (
        <>
            <style>{`
                @keyframes key-breathe {
                    0%, 100% {
                        border-color: rgba(250, 247, 242, 0.15);
                        color:        rgba(250, 247, 242, 0.22);
                        box-shadow:   none;
                    }
                    50% {
                        border-color: rgba(107, 127, 98, 0.8);
                        color:        rgba(107, 127, 98, 1);
                        box-shadow:   0 0 10px rgba(107, 127, 98, 0.3),
                                      inset 0 0 6px rgba(107, 127, 98, 0.08);
                    }
                }
            `}</style>

            <div style={{ marginBottom: "16px" }}>
                {/* Arrow key cluster — numpad layout */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 30px)",
                    gridTemplateRows: "repeat(2, 30px)",
                    gap: "4px",
                    marginBottom: "12px",
                    justifyContent: "flex-end",
                }}>
                    {/* Row 1: only ↑ in centre column */}
                    <div />
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid",
                        borderRadius: "5px",
                        fontSize: "13px",
                        fontFamily: MONO,
                        background: "rgba(250, 247, 242, 0.03)",
                        animation: "key-breathe 2s ease-in-out infinite",
                        animationDelay: "1s",
                    }}>↑</div>
                    <div />

                    {/* Row 2: ← ↓ → */}
                    {(["←", "↓", "→"] as const).map((arrow) => (
                        <div
                            key={arrow}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "1px solid",
                                borderRadius: "5px",
                                fontSize: "13px",
                                fontFamily: MONO,
                                background: "rgba(250, 247, 242, 0.03)",
                                ...(arrow === "↓" ? {
                                    animation: "key-breathe 2s ease-in-out infinite",
                                } : {
                                    borderColor: "rgba(250, 247, 242, 0.1)",
                                    color: "rgba(250, 247, 242, 0.15)",
                                }),
                            }}
                        >
                            {arrow}
                        </div>
                    ))}
                </div>

                {/* Hint note */}
                <p style={{
                    fontFamily: MONO,
                    fontWeight: 300,
                    fontSize: "0.6rem",
                    color: "rgba(250, 247, 242, 0.3)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    margin: 0,
                    lineHeight: 1.5,
                    textAlign: "right",
                }}>
                    Use ↑ ↓ for the<br />full experience
                </p>
            </div>
        </>
    );
}

/* ─── Glassmorphism tilt card ──────────────────────────────── */
function TiltCard({ children }: { children: React.ReactNode }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const rawX = useMotionValue(0); // normalized -1 → 1
    const rawY = useMotionValue(0);

    // Spring physics: snappy response, no oscillation on leave
    const springConfig = { stiffness: 280, damping: 28, mass: 0.6 };
    const rotateY = useSpring(useTransform(rawX, [-1, 1], [-12, 12]), springConfig);
    const rotateX = useSpring(useTransform(rawY, [-1, 1], [10, -10]), springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        rawX.set((e.clientX - rect.left - rect.width / 2) / (rect.width / 2));
        rawY.set((e.clientY - rect.top - rect.height / 2) / (rect.height / 2));
    };

    const handleMouseLeave = () => {
        rawX.set(0);
        rawY.set(0);
    };

    return (
        <>
            <style>{`
                @keyframes kona-gradient-drift {
                    0%   { background-position: 0% 50%; }
                    25%  { background-position: 100% 0%; }
                    50%  { background-position: 100% 100%; }
                    75%  { background-position: 0% 100%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>

            {/* Perspective wrapper — inline so it hugs the card width */}
            <div style={{ perspective: "700px", perspectiveOrigin: "center center", display: "inline-block" }}>
                <motion.div
                    ref={cardRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        rotateX,
                        rotateY,
                        transformStyle: "preserve-3d",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        border: "1px solid rgba(250, 247, 242, 0.09)",
                        borderRadius: "20px",
                        padding: "1.5rem 2rem",
                        display: "inline-block",
                        cursor: "default",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    {/* Forever-looping aurora gradient */}
                    <div
                        aria-hidden="true"
                        style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: "20px",
                            background: [
                                "linear-gradient(",
                                "  135deg,",
                                "  rgba(10,11,9,0.88) 0%,",
                                "  rgba(107,127,98,0.22) 25%,",
                                "  rgba(182,164,146,0.18) 50%,",
                                "  rgba(90,140,155,0.15) 70%,",
                                "  rgba(107,127,98,0.20) 85%,",
                                "  rgba(10,11,9,0.88) 100%",
                                ")",
                            ].join(""),
                            backgroundSize: "350% 350%",
                            animation: "kona-gradient-drift 8s ease infinite",
                            zIndex: 0,
                            pointerEvents: "none",
                        }}
                    />
                    {/* Content above gradient */}
                    <div style={{ position: "relative", zIndex: 1 }}>
                        {children}
                    </div>
                </motion.div>
            </div>
        </>
    );
}

interface Chapter {
    id: string;
    frameStart: number;
    frameEnd: number;
    textVisible: boolean;
    headline: string;
    subheading: string;
    cta: { label: string; href: string } | null;
    layout: string;
    headlinePosition: string;
    subheadingPosition?: string;
}

const chapters: Chapter[] = [
    {
        id: "opening",
        frameStart: -20, // Already fully visible at frame 0 (hero frame)
        frameEnd: 75,
        textVisible: true,
        headline: "EXPERIENCE \n DIGITAL\n INNOVATION",
        subheading: "KONAVERSE PROVIDES\nYOU WITH THE TOOLS\nTO BUILD YOUR OWN\nDIGITAL REALM.",
        cta: null,
        layout: "split",
        headlinePosition: "bottom-right",
        subheadingPosition: "top-left",
    },
    {
        id: "web-development",
        frameStart: 110,
        frameEnd: 200,
        textVisible: true,
        headline: "01 — Web Development",
        subheading: "Endless imagination, built to last.\nWe design and develop websites that don't just look premium — they perform, convert, and position you in a different league.",
        cta: { label: "View Web Development", href: "/solutions/web-development" },
        layout: "left",
        headlinePosition: "left",
    },
    {
        id: "web-applications",
        frameStart: 260,
        frameEnd: 360,
        textVisible: true,
        headline: "02 — Web Applications",
        subheading: "Performance without compromise.\nCustom web applications built for scale. From internal tools to client-facing platforms — engineered with precision so your business runs without friction.",
        cta: { label: "View Web Applications", href: "/solutions/web-applications" },
        layout: "right",
        headlinePosition: "right",
    },
    {
        id: "videography",
        frameStart: 410,
        frameEnd: 510,
        textVisible: true,
        headline: "03 — Videography",
        subheading: "Every frame, intentional.\nCinematic content that makes people stop. We capture your brand the way it deserves to be seen — with depth, atmosphere, and purpose.",
        cta: { label: "View Videography", href: "/solutions/videography" },
        layout: "left",
        headlinePosition: "left",
    },
    {
        id: "digital-advertising",
        frameStart: 560,
        frameEnd: 680,
        textVisible: true,
        headline: "04 — Digital Advertising",
        subheading: "Reach the right people. Every time.\nCampaigns built around conversion, not vanity metrics. We put your brand in front of audiences that matter and turn attention into revenue.",
        cta: { label: "View Digital Advertising", href: "/solutions/digital-advertising" },
        layout: "right",
        headlinePosition: "right",
    },
    {
        id: "social-media",
        frameStart: 800,
        frameEnd: 920,
        textVisible: true,
        headline: "05 — Social Media Management",
        subheading: "Presence that compounds.\nWe manage your social identity so you never have to think about it. Consistent, creative, always on-brand — your audience grows while you focus on your business.",
        cta: { label: "View Social Media", href: "/solutions/social-media" },
        layout: "center-bottom",
        headlinePosition: "center",
    },
    {
        id: "invitation",
        frameStart: 1020,
        frameEnd: 1200, // Extended past last frame so text stays at full opacity at checkpoint 1083
        textVisible: true,
        headline: "ENGAGE WITH.\nKONAVERSE.",
        subheading: "Your digital presence, perfected. Your time, protected.",
        cta: { label: "Start Your Project", href: "/contact" },
        layout: "split",
        headlinePosition: "top-right",
        subheadingPosition: "bottom-left",
    },
];

// --- Anagram Text Component ---
function AnagramText({ text, triggerKey, delay = 0, as: Component = "div", className = "", style = {} }: any) {
    const [display, setDisplay] = useState(text.replace(/\S/g, " "));
    const frameRef = useRef(0);
    const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

    useEffect(() => {
        // If we've hidden it (triggerKey = -1), reset display to spaces
        if (triggerKey < 0) {
            setDisplay(text.replace(/\S/g, " "));
            return;
        }

        if (triggerKey === 0) return;

        let timeout: NodeJS.Timeout;

        timeout = setTimeout(() => {
            frameRef.current = 0;
            const duration = 20;
            const interval = setInterval(() => {
                frameRef.current++;
                if (frameRef.current >= duration) {
                    setDisplay(text);
                    clearInterval(interval);
                    return;
                }
                setDisplay(
                    text
                        .split("")
                        .map((char: string, i: number) => {
                            if (char === " " || char === "\n") return char;
                            if (i < (frameRef.current / duration) * text.length) return text[i];
                            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
                        })
                        .join("")
                );
            }, 35);

            return () => clearInterval(interval);
        }, delay);

        return () => clearTimeout(timeout);
    }, [text, triggerKey, delay]);

    // Support multiline strings
    if (typeof display === "string" && display.includes("\n")) {
        return (
            <Component className={className} style={style}>
                {display.split("\n").map((line, i) => (
                    <React.Fragment key={i}>
                        {line}
                        {i !== display.split("\n").length - 1 && <br />}
                    </React.Fragment>
                ))}
            </Component>
        );
    }

    return <Component className={className} style={style}>{display}</Component>;
}


interface ServiceTextProps {
    currentFrame: number;
}

export function ServiceText({ currentFrame }: ServiceTextProps) {
    return (
        <div className="fixed inset-0 pointer-events-none z-[10]">
            {chapters.map((chapter) => (
                <ChapterOverlay key={chapter.id} chapter={chapter} currentFrame={currentFrame} />
            ))}
        </div>
    );
}

function ChapterOverlay({ chapter, currentFrame }: { chapter: Chapter; currentFrame: number }) {
    // Calculate opacity
    let opacity = 0;

    if (currentFrame >= chapter.frameStart && currentFrame <= chapter.frameEnd) {
        const fadeInEnd = chapter.frameStart + 20;
        const fadeOutStart = chapter.frameEnd - 20;

        if (currentFrame < fadeInEnd) {
            opacity = (currentFrame - chapter.frameStart) / 20;
        } else if (currentFrame > fadeOutStart) {
            opacity = (chapter.frameEnd - currentFrame) / 20;
        } else {
            opacity = 1;
        }
    }

    const isVisible = opacity > 0;

    // Track sequence entry to trigger anagram animation
    const [triggerKey, setTriggerKey] = useState(-1);
    const wasVisible = useRef(false);

    useEffect(() => {
        if (isVisible && !wasVisible.current) {
            setTriggerKey((k) => Math.max(1, k + 1));
            wasVisible.current = true;
        } else if (!isVisible && wasVisible.current) {
            setTriggerKey(-1);
            wasVisible.current = false;
        }
    }, [isVisible]);

    // Parallax refs — updated directly via cursorTracker (no React re-renders)
    const unifiedParallaxRef = useRef<HTMLDivElement>(null);
    const splitHeadlineRef = useRef<HTMLDivElement>(null);
    const splitSubheadingRef = useRef<HTMLDivElement>(null);
    const MAX_PX = 10;

    useEffect(() => {
        const isSplit = chapter.layout === "split";

        if (!isSplit) {
            const el = unifiedParallaxRef.current;
            if (!el) return;
            const depth = 0.75;
            return subscribeParallax((nx, ny) => {
                el.style.transform = `translate3d(${nx * MAX_PX * depth}px, ${ny * MAX_PX * depth}px, 0)`;
            });
        } else {
            const headEl = splitHeadlineRef.current;
            const subEl = splitSubheadingRef.current;
            return subscribeParallax((nx, ny) => {
                // Headline deeper, subheading shallower
                if (headEl) headEl.style.transform = `translate3d(${nx * MAX_PX}px, ${ny * MAX_PX}px, 0)`;
                if (subEl) subEl.style.transform = `translate3d(${nx * MAX_PX * 0.55}px, ${ny * MAX_PX * 0.55}px, 0)`;
            });
        }
    }, [chapter.layout]);

    if (!chapter.textVisible) return null;

    // Determine positions based on layout
    const getPositionClasses = (positionType: string, isSubheading: boolean = false) => {
        const base = "absolute pointer-events-auto ";
        switch (positionType) {
            case "top-left":
                return base + "top-[10%] left-[6%] max-w-[55%]";
            case "bottom-right":
                return base + "bottom-[6%] right-[2%] max-w-[48%] text-right";
            case "left":
                return base + "top-[50%] -translate-y-1/2 left-[6%] max-w-[38%]";
            case "right":
                return base + "top-[50%] -translate-y-1/2 right-[6%] max-w-[38%] text-right";
            case "center":
            case "center-bottom":
                return base + "bottom-[6%] left-1/2 -translate-x-1/2 w-[50%] max-w-[50%] text-center flex flex-col items-center justify-end";
            case "top-right":
                return base + "top-[10%] right-[6%] max-w-[40%] text-right";
            case "bottom-left":
                return base + "bottom-[6%] left-[6%] max-w-[40%]";
            default:
                return base;
        }
    };

    const isLargeHeadline = chapter.id === "opening" || chapter.id === "invitation";

    // Base typography styles matching PRD
    const headlineStyles = {
        fontFamily: "var(--font-monument, 'Monument Extended', sans-serif)",
        fontWeight: 800,
        fontSize: isLargeHeadline ? "clamp(2.5rem, 5vw, 5.5rem)" : "clamp(1.5rem, 3vw, 2.5rem)",
        color: "#b6a492",
        textTransform: "uppercase" as const,
        letterSpacing: "-0.02em",
        lineHeight: isLargeHeadline ? 1.1 : 1.2,
    };

    const subheadingStyles = {
        fontFamily: "var(--font-geist-sans, 'Geist', sans-serif)", // closest modern sans in project to Satoshi/Neue Montreal
        fontWeight: 300,
        fontSize: "clamp(0.85rem, 1vw, 1rem)",
        color: "#faf7f2",
        lineHeight: 1.7,
    };

    const firstLineStyles = {
        ...subheadingStyles,
        fontSize: "clamp(0.9rem, 1.2vw, 1.1rem)",
        color: "#6b7f62",
        marginBottom: "0.5rem"
    };

    const btnStyles = {
        display: "inline-block",
        border: "1px solid rgba(250, 247, 242, 0.3)",
        padding: "0.6rem 1.4rem",
        fontFamily: "var(--font-geist-mono, 'Geist Mono', monospace)",
        fontSize: "0.75rem",
        fontWeight: 300,
        letterSpacing: "0.15em",
        textTransform: "uppercase" as const,
        color: "#faf7f2",
        background: "transparent",
        transition: "border-color 0.4s ease, color 0.4s ease",
        marginTop: "1.5rem",
        pointerEvents: "auto" as const,
    };

    const openingSubheadingStyles = {
        fontFamily: "var(--font-geist-mono, 'Geist Mono', monospace)",
        fontWeight: 300,
        fontSize: "clamp(0.75rem, 1vw, 0.95rem)",
        color: "#faf7f2",
        lineHeight: 2,
        textTransform: "uppercase" as const,
        letterSpacing: "0.12em",
    };

    // Safe approach to render subheading which might have multiple lines (bold first line)
    const renderSubheading = (text: string, delay: number) => {
        const lines = text.split("\n");
        const isOpening = chapter.id === "opening";
        return (
            <div className="mt-4 pointer-events-auto">
                {lines.map((line, i) => (
                    <AnagramText
                        key={i}
                        text={line}
                        triggerKey={triggerKey}
                        delay={delay + (i * 150)}
                        as="p"
                        style={isOpening ? openingSubheadingStyles : (i === 0 ? firstLineStyles : subheadingStyles)}
                    />
                ))}
            </div>
        );
    };

    // For unified layouts (left, right, center), everything goes in one container
    if (chapter.layout === "left" || chapter.layout === "right" || chapter.layout === "center-bottom") {
        return (
            <div
                ref={unifiedParallaxRef}
                className={getPositionClasses(chapter.headlinePosition)}
                style={{
                    opacity,
                    willChange: "opacity, transform",
                    visibility: isVisible ? "visible" : "hidden"
                }}
            >
                <AnagramText
                    text={chapter.headline}
                    triggerKey={triggerKey}
                    delay={0}
                    as="h2"
                    style={headlineStyles}
                />

                {renderSubheading(chapter.subheading, 150)}

                {chapter.cta && opacity > 0.5 && (
                    <Link
                        href={chapter.cta.href}
                        className="group hover:border-[#6b7f62] hover:text-[#6b7f62]"
                        style={btnStyles}
                    >
                        <AnagramText
                            text={chapter.cta.label}
                            triggerKey={triggerKey}
                            delay={350}
                            as="span"
                        />
                    </Link>
                )}
            </div>
        );
    }

    // For split layouts, components are in separate containers
    const headlineLines = chapter.headline.split("\n");

    return (
        <div style={{ opacity, willChange: "opacity", visibility: isVisible ? "visible" : "hidden" }}>
            {/* Headline Container */}
            <div ref={splitHeadlineRef} className={getPositionClasses(chapter.headlinePosition)} style={{ willChange: "transform" }}>
                {chapter.id === "opening" ? (
                    // Opening: keyboard hint + all three lines inside the glass tilt card
                    <>
                        <KeyboardHint />
                        <TiltCard>
                            {headlineLines.map((line, i) => (
                                <AnagramText
                                    key={i}
                                    text={line}
                                    triggerKey={triggerKey}
                                    delay={i * 80}
                                    as="h2"
                                    style={headlineStyles}
                                />
                            ))}
                        </TiltCard>
                    </>
                ) : (
                    <AnagramText
                        text={chapter.headline}
                        triggerKey={triggerKey}
                        delay={0}
                        as="h2"
                        style={headlineStyles}
                    />
                )}
            </div>

            {/* Subheading & CTA Container */}
            {chapter.subheadingPosition && (
                <div ref={splitSubheadingRef} className={getPositionClasses(chapter.subheadingPosition, true)} style={{ willChange: "transform" }}>
                    {renderSubheading(chapter.subheading, 150)}

                    {chapter.cta && opacity > 0.5 && (
                        <Link
                            href={chapter.cta.href}
                            className="group hover:border-[#6b7f62] hover:text-[#6b7f62]"
                            style={btnStyles}
                        >
                            <AnagramText
                                text={chapter.cta.label}
                                triggerKey={triggerKey}
                                delay={350}
                                as="span"
                            />
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
