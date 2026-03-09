"use client";

import { useEffect, useRef } from "react";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import { TOTAL_FRAMES, PIXELS_PER_FRAME } from "./useFrameSequence";
const TOTAL_SCROLL = TOTAL_FRAMES * PIXELS_PER_FRAME;
const FADE_ZONE = TOTAL_SCROLL * 0.06;

// ── Update these to the real profiles ────────────────────────
const SOCIAL_LINKS = [
    {
        label: "Instagram",
        href: "https://www.instagram.com/konaverse",
        Icon: Instagram,
    },
    {
        label: "Facebook",
        href: "https://www.facebook.com/konaverse",
        Icon: Facebook,
    },
    {
        label: "LinkedIn",
        href: "https://www.linkedin.com/company/konaverse",
        Icon: Linkedin,
    },
];

// Icon entrance: 300ms initial delay, 150ms stagger, 400ms duration each
// Line entrance: starts 100ms after last icon finishes
const ICON_INITIAL_DELAY = 300;
const ICON_STAGGER = 150;
const ICON_DURATION = 400;
const LINE_DELAY = ICON_INITIAL_DELAY + (SOCIAL_LINKS.length - 1) * ICON_STAGGER + ICON_DURATION + 100;

export function SocialBar() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Scroll-based fade out — direct DOM, no re-renders
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        let rafId: number;
        let currentOpacity = 1;

        const tick = () => {
            const scrollY = window.scrollY;
            const fadeStart = TOTAL_SCROLL - FADE_ZONE;
            const targetOpacity =
                scrollY >= TOTAL_SCROLL ? 0
                : scrollY > fadeStart ? 1 - (scrollY - fadeStart) / FADE_ZONE
                : 1;

            currentOpacity += (targetOpacity - currentOpacity) * 0.1;
            el.style.opacity = String(currentOpacity);
            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, []);

    return (
        <>
            <style>{`
                @keyframes social-icon-in {
                    from {
                        opacity: 0;
                        transform: translateX(-16px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes social-line-in {
                    from { transform: scaleY(0); }
                    to   { transform: scaleY(1); }
                }
            `}</style>

            <div
                ref={containerRef}
                style={{
                    position: "fixed",
                    left: "24px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 15,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "32px",
                    pointerEvents: "none", // container transparent to interaction
                }}
            >
                {/* Connecting line — draws itself after icons appear */}
                <div
                    style={{
                        position: "absolute",
                        left: "calc(50% - 0.5px)",
                        top: "20px",   // bottom edge of first icon
                        bottom: "20px", // top edge of last icon
                        width: "1px",
                        background: "rgba(255, 255, 255, 0.15)",
                        transformOrigin: "top",
                        animation: `social-line-in 600ms ease-out forwards`,
                        animationDelay: `${LINE_DELAY}ms`,
                        transform: "scaleY(0)", // hidden before animation
                    }}
                />

                {/* Icons */}
                {SOCIAL_LINKS.map(({ label, href, Icon }, i) => (
                    <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        style={{
                            color: "rgba(255, 255, 255, 0.5)",
                            pointerEvents: "auto",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "color 250ms ease, filter 250ms ease",
                            opacity: 0, // animation starts from here
                            animation: `social-icon-in ${ICON_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1) forwards`,
                            animationDelay: `${ICON_INITIAL_DELAY + i * ICON_STAGGER}ms`,
                            position: "relative",
                            zIndex: 1, // sits above the line
                        }}
                        onMouseEnter={(e) => {
                            const el = e.currentTarget as HTMLAnchorElement;
                            el.style.color = "#6b7f62";
                            el.style.filter = "drop-shadow(0 0 8px rgba(107, 127, 98, 0.65))";
                        }}
                        onMouseLeave={(e) => {
                            const el = e.currentTarget as HTMLAnchorElement;
                            el.style.color = "rgba(255, 255, 255, 0.5)";
                            el.style.filter = "none";
                        }}
                    >
                        <Icon size={20} strokeWidth={1.5} />
                    </a>
                ))}
            </div>
        </>
    );
}
