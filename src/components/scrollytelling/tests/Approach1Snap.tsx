"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { gsap } from "gsap";
import { useFrameSequence } from "../useFrameSequence";
import { FrameCanvas } from "../FrameCanvas";
import { ServiceText } from "../ServiceText";

const CHECKPOINTS = [0, 151, 302, 453, 604, 844, 1083];
const PX_PER_FRAME = 14; // Slower, more cinematic scrubbing (was 8)
const TOTAL_HEIGHT = 1084 * PX_PER_FRAME; // ~15,176px
const SETTLE_DEBOUNCE_MS = 80; // Near-instant reaction
const SETTLE_DURATION = 0.25; // Quarter second — almost instant

export default function Approach1Snap() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { TOTAL_FRAMES, getImage, isInitialLoaded } = useFrameSequence();

    const [currentFrame, setCurrentFrame] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Refs for the settle system
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const settleTweenRef = useRef<gsap.core.Tween | null>(null);
    const isSettlingRef = useRef(false);

    // Refs for smooth frame interpolation
    const targetFrameRef = useRef(0);  // The "raw" frame from scroll position
    const displayFrameRef = useRef(0); // The smoothly interpolated display frame
    const rafRef = useRef<number | null>(null);

    // --- Draw a single frame to the canvas ---
    const drawFrame = useCallback(
        (frameIndex: number) => {
            if (!canvasRef.current) return;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            const image = getImage(frameIndex);
            if (!ctx || !image) return;

            const hRatio = canvas.width / image.width;
            const vRatio = canvas.height / image.height;
            const ratio = Math.max(hRatio, vRatio);
            const cx = (canvas.width - image.width * ratio) / 2;
            const cy = (canvas.height - image.height * ratio) / 2;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, image.width, image.height, cx, cy, image.width * ratio, image.height * ratio);
        },
        [getImage]
    );

    // --- Smooth frame interpolation loop ---
    // Instead of jumping frame 100 → 104, this smoothly tweens between them at 60fps
    useEffect(() => {
        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

        const tick = () => {
            const target = targetFrameRef.current;
            const current = displayFrameRef.current;

            // Lerp toward target (0.8 = near-instant, barely any smoothing)
            const next = lerp(current, target, 0.8);

            // When within 5 frames, snap directly — kills the Zeno crawl
            if (Math.abs(target - current) < 5) {
                if (Math.round(current) !== Math.round(target)) {
                    displayFrameRef.current = target;
                    const rounded = Math.round(target);
                    setCurrentFrame(rounded);
                    drawFrame(rounded);
                }
            } else if (Math.abs(next - current) > 0.1) {
                displayFrameRef.current = next;
                const rounded = Math.round(next);
                setCurrentFrame(rounded);
                drawFrame(rounded);
            }

            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [drawFrame]);

    // --- Convert a frame index to a scrollTop pixel value ---
    const frameToScrollTop = useCallback(
        (frame: number) => {
            if (!containerRef.current) return 0;
            const maxScroll = containerRef.current.scrollHeight - containerRef.current.clientHeight;
            return (frame / (TOTAL_FRAMES - 1)) * maxScroll;
        },
        [TOTAL_FRAMES]
    );

    // --- Find the nearest checkpoint frame to a given frame ---
    const nearestCheckpoint = useCallback((frame: number) => {
        let closest = CHECKPOINTS[0];
        let minDist = Math.abs(frame - closest);
        for (const cp of CHECKPOINTS) {
            const dist = Math.abs(frame - cp);
            if (dist < minDist) {
                minDist = dist;
                closest = cp;
            }
        }
        return closest;
    }, []);

    // --- 0. Lock outer page scroll & hide nav/footer ---
    useEffect(() => {
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";

        const nav = document.querySelector("nav");
        const footer = document.querySelector("footer");
        if (nav) (nav as HTMLElement).style.display = "none";
        if (footer) (footer as HTMLElement).style.display = "none";

        return () => {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
            if (nav) (nav as HTMLElement).style.display = "";
            if (footer) (footer as HTMLElement).style.display = "";
        };
    }, []);

    // --- 1. Mobile detection ---
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    // --- 2. Scroll → Target frame + debounced GSAP settle ---
    useEffect(() => {
        if (isMobile || !containerRef.current) return;

        const container = containerRef.current;

        const handleScroll = () => {
            const maxScroll = container.scrollHeight - container.clientHeight;
            if (maxScroll <= 0) return;
            const progress = container.scrollTop / maxScroll;

            const frame = Math.round(progress * (TOTAL_FRAMES - 1));
            const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, frame));

            // Set the TARGET frame — the interpolation loop will smoothly chase it
            targetFrameRef.current = clamped;

            // --- Debounced auto-settle ---
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            // Kill any in-progress settle if user starts scrolling again
            if (isSettlingRef.current && settleTweenRef.current) {
                settleTweenRef.current.kill();
                isSettlingRef.current = false;
            }

            scrollTimeoutRef.current = setTimeout(() => {
                const nearest = nearestCheckpoint(clamped);
                const targetScroll = frameToScrollTop(nearest);

                // Only settle if we're not already at the checkpoint
                if (Math.abs(container.scrollTop - targetScroll) > 5) {
                    isSettlingRef.current = true;

                    // Use GSAP to animate scrollTop with a cinematic easing curve
                    settleTweenRef.current = gsap.to(container, {
                        scrollTop: targetScroll,
                        duration: SETTLE_DURATION,
                        ease: "power3.out", // Snappy — fast start, clean stop
                        onComplete: () => {
                            isSettlingRef.current = false;
                            settleTweenRef.current = null;
                        },
                    });
                }
            }, SETTLE_DEBOUNCE_MS);
        };

        // Detect user-initiated scroll to interrupt settle
        const handleWheel = () => {
            if (isSettlingRef.current && settleTweenRef.current) {
                settleTweenRef.current.kill();
                isSettlingRef.current = false;
            }
        };

        container.addEventListener("scroll", handleScroll, { passive: true });
        container.addEventListener("wheel", handleWheel, { passive: true });
        handleScroll();

        return () => {
            container.removeEventListener("scroll", handleScroll);
            container.removeEventListener("wheel", handleWheel);
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
            if (settleTweenRef.current) settleTweenRef.current.kill();
        };
    }, [isMobile, TOTAL_FRAMES, nearestCheckpoint, frameToScrollTop]);

    // --- Active chapter label ---
    const activeChapterLabel = useMemo(() => {
        if (currentFrame < 151) return "00 — Opening";
        if (currentFrame < 302) return "01 — Web Development";
        if (currentFrame < 453) return "02 — Web Applications";
        if (currentFrame < 604) return "03 — Videography";
        if (currentFrame < 844) return "04 — Digital Advertising";
        if (currentFrame < 1008) return "05 — Social Media";
        return "06 — Invitation";
    }, [currentFrame]);

    if (isMobile) {
        return (
            <section className="h-screen w-full flex items-center justify-center bg-[#111] text-[#faf7f2] font-mono uppercase text-sm tracking-widest px-6 text-center">
                Full experience available on desktop.
            </section>
        );
    }

    return (
        <>
            <FrameCanvas ref={canvasRef} isInitialLoaded={isInitialLoaded} />
            <ServiceText currentFrame={currentFrame} />

            {/* The scroll container: tall spacer, free scroll, no CSS snap */}
            <div
                ref={containerRef}
                className="fixed inset-0 z-[5] overflow-y-auto overflow-x-hidden scrollbar-hide"
            >
                <div style={{ height: `${TOTAL_HEIGHT}px` }} />
            </div>

            {/* Prototype badge */}
            <div className="fixed top-8 left-8 z-[20] bg-green-600/20 mix-blend-screen text-green-400 border border-green-500/50 rounded-full px-4 py-1 font-mono text-xs font-bold uppercase tracking-widest pointer-events-none">
                Debounced Settle v2
            </div>

            {/* Archive label */}
            <div
                className="fixed bottom-8 right-8 z-[20] pointer-events-none"
                style={{
                    fontFamily: "var(--font-geist-mono, 'Geist Mono', monospace)",
                    fontSize: "0.65rem",
                    color: "rgba(107, 127, 98, 0.4)",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                }}
            >
                {activeChapterLabel}
            </div>

            {/* Progress indicator */}
            <div className="fixed top-0 right-0 w-[2px] h-screen bg-[rgba(107,127,98,0.1)] z-[20] pointer-events-none">
                <div
                    className="w-full bg-[#6b7f62]"
                    style={{
                        height: `${(currentFrame / (TOTAL_FRAMES - 1)) * 100}%`,
                        transition: "height 0.15s linear",
                    }}
                />
            </div>
        </>
    );
}
