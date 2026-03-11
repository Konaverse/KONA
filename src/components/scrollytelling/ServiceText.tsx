"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { TOTAL_VH, SERVICES, INVITATION, getTotalScroll, vhToPx } from "./scrollConstants";

gsap.registerPlugin(ScrollTrigger);

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
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 30px)",
                    gridTemplateRows: "repeat(2, 30px)",
                    gap: "4px",
                    marginBottom: "12px",
                    justifyContent: "flex-end",
                }}>
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
    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);

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
                    <div style={{ position: "relative", zIndex: 1 }}>
                        {children}
                    </div>
                </motion.div>
            </div>
        </>
    );
}

/* ─── Chapter data ─────────────────────────────────────────── */
interface Chapter {
    id: string;
    /** Scroll position in vh multiples where this chapter's text is centered */
    scrollPositionVh: number;
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
        scrollPositionVh: 0,
        headline: "EXPERIENCE \n DIGITAL\n INNOVATION",
        subheading: "KONAVERSE PROVIDES\nYOU WITH THE TOOLS\nTO BUILD YOUR OWN\nDIGITAL REALM.",
        cta: null,
        layout: "split",
        headlinePosition: "bottom-right",
        subheadingPosition: "top-left",
    },
    {
        id: "web-development",
        scrollPositionVh: (SERVICES[0].startVh + SERVICES[0].endVh) / 2,
        headline: "01 — Web Development",
        subheading: "Endless imagination, built to last.\nWe design and develop websites that don't just look premium — they perform, convert, and position you in a different league.",
        cta: { label: "View Web Development", href: "/solutions/web-development" },
        layout: "left",
        headlinePosition: "left",
    },
    {
        id: "web-applications",
        scrollPositionVh: (SERVICES[1].startVh + SERVICES[1].endVh) / 2,
        headline: "02 — Web Applications",
        subheading: "Performance without compromise.\nCustom web applications built for scale. From internal tools to client-facing platforms — engineered with precision so your business runs without friction.",
        cta: { label: "View Web Applications", href: "/solutions/web-applications" },
        layout: "right",
        headlinePosition: "right",
    },
    {
        id: "videography",
        scrollPositionVh: (SERVICES[2].startVh + SERVICES[2].endVh) / 2,
        headline: "03 — Videography",
        subheading: "Every frame, intentional.\nCinematic content that makes people stop. We capture your brand the way it deserves to be seen — with depth, atmosphere, and purpose.",
        cta: { label: "View Videography", href: "/solutions/videography" },
        layout: "left",
        headlinePosition: "left",
    },
    {
        id: "digital-advertising",
        scrollPositionVh: (SERVICES[3].startVh + SERVICES[3].endVh) / 2,
        headline: "04 — Digital Advertising",
        subheading: "Reach the right people. Every time.\nCampaigns built around conversion, not vanity metrics. We put your brand in front of audiences that matter and turn attention into revenue.",
        cta: { label: "View Digital Advertising", href: "/solutions/digital-advertising" },
        layout: "right",
        headlinePosition: "right",
    },
    {
        id: "social-media",
        scrollPositionVh: (SERVICES[4].startVh + SERVICES[4].endVh) / 2,
        headline: "05 — Social Media Management",
        subheading: "Presence that compounds.\nWe manage your social identity so you never have to think about it. Consistent, creative, always on-brand — your audience grows while you focus on your business.",
        cta: { label: "View Social Media", href: "/solutions/social-media" },
        layout: "center-bottom",
        headlinePosition: "center",
    },
    {
        id: "invitation",
        scrollPositionVh: (INVITATION.startVh + INVITATION.endVh) / 2,
        headline: "ENGAGE WITH.\nKONAVERSE.",
        subheading: "Your digital presence, perfected. Your time, protected.",
        cta: { label: "Start Your Project", href: "/contact" },
        layout: "split",
        headlinePosition: "top-right",
        subheadingPosition: "bottom-left",
    },
];

/* ─── Position helpers ────────────────────────────────────── */
const getPositionClasses = (positionType: string) => {
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

/* ─── Chapter content renderer ────────────────────────────── */
function ChapterContent({ chapter }: { chapter: Chapter }) {
    const isLargeHeadline = chapter.id === "opening" || chapter.id === "invitation";

    const headlineStyles = {
        fontFamily: "var(--font-monument, 'Monument Extended', sans-serif)",
        fontWeight: 800,
        fontSize: isLargeHeadline ? "clamp(2.5rem, 5vw, 5.5rem)" : "clamp(1.5rem, 3vw, 2.5rem)",
        color: "#b6a492",
        textTransform: "uppercase" as const,
        letterSpacing: "-0.02em",
        lineHeight: isLargeHeadline ? 1.1 : 1.2,
        textShadow: "0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)",
    };

    const subheadingStyles = {
        fontFamily: "var(--font-geist-sans, 'Geist', sans-serif)",
        fontWeight: 300,
        fontSize: "clamp(0.85rem, 1vw, 1rem)",
        color: "#faf7f2",
        lineHeight: 1.7,
        textShadow: "0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)",
    };

    const firstLineStyles = {
        ...subheadingStyles,
        fontSize: "clamp(0.9rem, 1.2vw, 1.1rem)",
        color: "#6b7f62",
        marginBottom: "0.5rem",
    };

    const openingSubheadingStyles = {
        fontFamily: "var(--font-geist-mono, 'Geist Mono', monospace)",
        fontWeight: 300,
        fontSize: "clamp(0.75rem, 1vw, 0.95rem)",
        color: "#faf7f2",
        lineHeight: 2,
        textTransform: "uppercase" as const,
        letterSpacing: "0.12em",
        textShadow: "0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)",
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

    const renderSubheading = (text: string) => {
        const lines = text.split("\n");
        const isOpening = chapter.id === "opening";
        return (
            <div className="mt-4 pointer-events-auto">
                {lines.map((line, i) => (
                    <p
                        key={i}
                        style={
                            isOpening
                                ? openingSubheadingStyles
                                : i === 0
                                  ? firstLineStyles
                                  : subheadingStyles
                        }
                    >
                        {line}
                    </p>
                ))}
            </div>
        );
    };

    if (chapter.layout === "left" || chapter.layout === "right" || chapter.layout === "center-bottom") {
        return (
            <div className="relative w-full h-full">
                <div className={getPositionClasses(chapter.headlinePosition)}>
                    <h2 style={{ ...headlineStyles, whiteSpace: "pre-line" }}>{chapter.headline}</h2>
                    {renderSubheading(chapter.subheading)}
                    {chapter.cta && (
                        <Link
                            href={chapter.cta.href}
                            className="group hover:border-[#6b7f62] hover:text-[#6b7f62]"
                            style={btnStyles}
                        >
                            <span>{chapter.cta.label}</span>
                        </Link>
                    )}
                </div>
            </div>
        );
    }

    const headlineLines = chapter.headline.split("\n");

    return (
        <div className="relative w-full h-full">
            <div className={getPositionClasses(chapter.headlinePosition)}>
                {chapter.id === "opening" ? (
                    <>
                        <KeyboardHint />
                        <TiltCard>
                            {headlineLines.map((line, i) => (
                                <h2 key={i} style={headlineStyles}>{line}</h2>
                            ))}
                        </TiltCard>
                    </>
                ) : (
                    <h2 style={{ ...headlineStyles, whiteSpace: "pre-line" }}>{chapter.headline}</h2>
                )}
            </div>

            {chapter.subheadingPosition && (
                <div className={getPositionClasses(chapter.subheadingPosition)}>
                    {renderSubheading(chapter.subheading)}
                    {chapter.cta && (
                        <Link
                            href={chapter.cta.href}
                            className="group hover:border-[#6b7f62] hover:text-[#6b7f62]"
                            style={btnStyles}
                        >
                            <span>{chapter.cta.label}</span>
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}

/* ─── Main export: parallax text overlays ─────────────────── */
export function ServiceText() {
    const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

    /* ─── Parallax ScrollTriggers ──────────────────────── */
    useEffect(() => {
        const ctx = gsap.context(() => {
            chapters.forEach((chapter, index) => {
                const el = blockRefs.current[index];
                if (!el) return;

                const isOpening = index === 0;
                const vh = window.innerHeight;

                if (isOpening) {
                    gsap.to(el, {
                        y: -vh * 0.4,
                        ease: "sine.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top top",
                            end: "bottom top",
                            scrub: 0.5,
                        },
                    });
                } else {
                    gsap.fromTo(
                        el,
                        { y: vh * 0.35 },
                        {
                            y: -vh * 0.35,
                            ease: "sine.inOut",
                            scrollTrigger: {
                                trigger: el,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: 0.5,
                            },
                        },
                    );
                }
            });
        });

        return () => ctx.revert();
    }, []);

    /* ─── Invitation fade-out (mirrors fixedLayerRef) ──── */
    useEffect(() => {
        const invitationEl = blockRefs.current[chapters.length - 1];
        if (!invitationEl) return;

        let current = 1;
        let rafId: number;

        const tick = () => {
            const totalScroll = getTotalScroll();
            const FADE_START = totalScroll - 400;
            const scrollY = window.scrollY;
            const target =
                scrollY >= totalScroll
                    ? 0
                    : scrollY > FADE_START
                      ? 1 - (scrollY - FADE_START) / (totalScroll - FADE_START)
                      : 1;
            current += (target - current) * 0.12;
            invitationEl.style.opacity = String(current);
            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, []);

    return (
        <>
            {chapters.map((chapter, index) => {
                const isInvitation = index === chapters.length - 1;

                // Position text block so its center aligns with the chapter's scroll position
                const topValue = isInvitation
                    ? `calc(${TOTAL_VH * 100}vh - 100vh)`
                    : `${chapter.scrollPositionVh * 100}vh`;

                return (
                    <div
                        key={chapter.id}
                        ref={(el) => {
                            blockRefs.current[index] = el;
                        }}
                        style={{
                            position: "absolute",
                            top: topValue,
                            left: 0,
                            width: "100%",
                            height: "100vh",
                            pointerEvents: "none",
                            zIndex: 10,
                            willChange: "transform",
                        }}
                    >
                        <ChapterContent chapter={chapter} />
                    </div>
                );
            })}
        </>
    );
}
