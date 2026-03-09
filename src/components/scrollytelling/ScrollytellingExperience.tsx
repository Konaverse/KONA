"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback, startTransition } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useFrameSequence, TOTAL_FRAMES } from "./useFrameSequence";
import { FrameCanvas } from "./FrameCanvas";
import { ServiceText } from "./ServiceText";
import { CursorSpotlight } from "./CursorSpotlight";
import { SocialBar } from "./SocialBar";
import { StatsCounter } from "./StatsCounter";

gsap.registerPlugin(ScrollTrigger);

/* ─── Magnetic checkpoints (hero frames) ────────────────── */
const CHECKPOINTS = [0, 151, 302, 453, 604, 844, 1083];
const SNAP_POINTS = CHECKPOINTS.map((cp) => cp / (TOTAL_FRAMES - 1));

/* ─── Scroll weight ─────────────────────────────────────── */
const PIXELS_PER_FRAME = 14;
const TOTAL_SCROLL = TOTAL_FRAMES * PIXELS_PER_FRAME;

export default function ScrollytellingExperience() {
    const { isInitialLoaded, getImage } = useFrameSequence();

    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fixedLayerRef = useRef<HTMLDivElement>(null);
    const lastFrameRef = useRef(-1);

    const [currentFrame, setCurrentFrame] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    /* ─── Fade fixed layer out at sequence end ──────────── */
    useEffect(() => {
        const el = fixedLayerRef.current;
        if (!el) return;

        const FADE_START = TOTAL_SCROLL - 400;
        let current = 1;
        let rafId: number;

        const tick = () => {
            const scrollY = window.scrollY;
            const target =
                scrollY >= TOTAL_SCROLL ? 0
                : scrollY > FADE_START  ? 1 - (scrollY - FADE_START) / (TOTAL_SCROLL - FADE_START)
                : 1;

            current += (target - current) * 0.12;
            el.style.opacity = String(current);
            // disable pointer-events when nearly invisible so footer links are reachable
            el.style.pointerEvents = current < 0.05 ? "none" : "";
            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, []);

    /* ─── Mobile detection ──────────────────────────────── */
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    /* ─── Canvas drawing (object-fit: cover, DPR-aware) ──── */
    const drawFrame = useCallback(
        (index: number) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            const img = getImage(index);
            if (!ctx || !img) return;

            const hR = canvas.width / img.width;
            const vR = canvas.height / img.height;
            const ratio = Math.max(hR, vR);
            const cx = (canvas.width - img.width * ratio) / 2;
            const cy = (canvas.height - img.height * ratio) / 2;

            // Cover mode guarantees full canvas coverage — skip clearRect
            ctx.drawImage(
                img,
                0, 0, img.width, img.height,
                cx, cy, img.width * ratio, img.height * ratio,
            );
        },
        [getImage],
    );

    /* ─── Canvas resize (DPR-scaled for sharp rendering) ── */
    useEffect(() => {
        const resize = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            if (lastFrameRef.current >= 0) drawFrame(lastFrameRef.current);
        };
        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, [drawFrame]);

    /* ─── ScrollTrigger + magnetic snap ─────────────────── */
    useEffect(() => {
        if (isMobile || !isInitialLoaded) return;

        // Ensure we start at the top
        window.scrollTo(0, 0);

        // Draw the opening frame immediately
        drawFrame(0);
        lastFrameRef.current = 0;

        // Proxy for GSAP tween — maps progress to frame index
        const proxy = { frame: 0 };

        const tween = gsap.to(proxy, {
            frame: TOTAL_FRAMES - 1,
            ease: "none",
            onUpdate: () => {
                const f = Math.round(proxy.frame);
                if (f !== lastFrameRef.current) {
                    lastFrameRef.current = f;
                    drawFrame(f); // Direct canvas blit — always runs at full speed
                    // Defer text overlay re-renders so they never block the canvas
                    startTransition(() => setCurrentFrame(f));
                }
            },
        });

        const trigger = ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            animation: tween,
            scrub: true, // 1:1 scroll → frame. Preserves native OS inertia.
            snap: {
                snapTo: SNAP_POINTS,
                duration: { min: 0.8, max: 3.0 }, // short hops are fast, long jumps breathe
                delay: 0,           // snap immediately — no dead zone
                ease: "power3.out", // fast grab, gentle settle — the "magnetic" feel
                inertia: true,      // respects velocity to pick the right target
            },
        });

        return () => {
            trigger.kill();
            tween.kill();
        };
    }, [isMobile, isInitialLoaded, drawFrame]);

    /* ─── Chapter label ─────────────────────────────────── */
    const activeChapterLabel = useMemo(() => {
        if (currentFrame < 151) return "00 — Opening";
        if (currentFrame < 302) return "01 — Web Development";
        if (currentFrame < 453) return "02 — Web Applications";
        if (currentFrame < 604) return "03 — Videography";
        if (currentFrame < 844) return "04 — Digital Advertising";
        if (currentFrame < 1008) return "05 — Social Media";
        return "06 — Invitation";
    }, [currentFrame]);

    /* ─── Mobile stub ───────────────────────────────────── */
    if (isMobile) {
        return (
            <section className="h-screen w-full flex items-center justify-center bg-[#111] text-[#faf7f2] font-mono uppercase text-sm tracking-widest px-6 text-center">
                Full experience available on desktop.
            </section>
        );
    }

    /* ─── Desktop: scroll spacer drives the experience ──── */
    return (
        <div
            ref={containerRef}
            className="relative bg-[#0a0b09]"
            style={{ height: `${TOTAL_SCROLL}px` }}
        >
            {/* Fixed visual layer — fades out at sequence end */}
            <div ref={fixedLayerRef}>
                <FrameCanvas ref={canvasRef} isInitialLoaded={isInitialLoaded} />
                <CursorSpotlight />
                <SocialBar />
                <StatsCounter />
                <ServiceText currentFrame={currentFrame} />

                {/* Archive label */}
                <div
                    className="fixed bottom-8 right-8 z-[9]"
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

                {/* Scroll progress — frame-accurate */}
                <div className="fixed top-0 right-0 w-[2px] h-screen bg-[rgba(107,127,98,0.1)] z-[20]">
                    <div
                        className="w-full bg-[#6b7f62]"
                        style={{
                            height: `${(currentFrame / (TOTAL_FRAMES - 1)) * 100}%`,
                            transition: "height 0.1s linear",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
