"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ServiceText } from "./ServiceText";
import { CursorSpotlight } from "./CursorSpotlight";
import { SocialBar } from "./SocialBar";
import { StatsCounter } from "./StatsCounter";
import { MobileFallback } from "./MobileFallback";
import {
    TOTAL_VH,
    SERVICES,
    INVITATION,
    HERO,
    ATMOSPHERE,
    getTotalScroll,
    vhToPx,
} from "./scrollConstants";

gsap.registerPlugin(ScrollTrigger);

/* ─── Asset paths ────────────────────────────────────────── */
const HERO_ASSETS = {
    void:  "/assets/hero/background-void.png",
    slabL: "/assets/hero/slab-left.png",
    slabR: "/assets/hero/slab-right.png",
    glow:  "/assets/hero/crack-glow.png",
    smoke: "/assets/hero/smoke-foregraound.png", // filename has typo in asset
};

const ATMOSPHERE_BG   = "/assets/atmosphere/atmosphere-bg.png";
const INVITATION_IMG  = "/assets/atmosphere/atmosphere-bg-2.png";

/* ─── Shared styles for service images ───────────────────── */
const SERVICE_IMG_STYLE: React.CSSProperties = {
    opacity: 0,
    mixBlendMode: "lighten",
    WebkitMaskImage: "radial-gradient(ellipse 70% 60% at center, black 30%, transparent 100%)",
    maskImage: "radial-gradient(ellipse 70% 60% at center, black 30%, transparent 100%)",
    willChange: "transform, opacity",
};

export default function ScrollytellingExperience() {
    const containerRef  = useRef<HTMLDivElement>(null);
    const fixedLayerRef = useRef<HTMLDivElement>(null);

    /* Layer refs — hero */
    const atmosphereRef = useRef<HTMLImageElement>(null);
    const crackGlowRef  = useRef<HTMLImageElement>(null);
    const slabLeftRef   = useRef<HTMLImageElement>(null);
    const slabRightRef  = useRef<HTMLImageElement>(null);
    const smokeRef      = useRef<HTMLImageElement>(null);

    /* Layer refs — services (image only, no rift elements) */
    const serviceImageRefs = useRef<(HTMLImageElement | null)[]>([]);

    /* Invitation ref */
    const invitationImgRef = useRef<HTMLImageElement>(null);

    /* Scroll progress for the progress bar */
    const progressRef = useRef<HTMLDivElement>(null);

    const [isMobile, setIsMobile] = useState(false);

    /* ─── Mobile detection ──────────────────────────────── */
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    /* ─── Fade fixed layer out at sequence end ──────────── */
    useEffect(() => {
        if (isMobile) return;
        const el = fixedLayerRef.current;
        if (!el) return;

        let current = 1;
        let rafId: number;

        const tick = () => {
            const totalScroll = getTotalScroll();
            const FADE_START = totalScroll - 400;
            const scrollY = window.scrollY;
            const target =
                scrollY >= totalScroll ? 0
                : scrollY > FADE_START ? 1 - (scrollY - FADE_START) / (totalScroll - FADE_START)
                : 1;

            current += (target - current) * 0.12;
            el.style.opacity = String(current);
            el.style.pointerEvents = current < 0.05 ? "none" : "";
            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, [isMobile]);

    /* ─── Scroll progress bar ───────────────────────────── */
    useEffect(() => {
        if (isMobile) return;
        const bar = progressRef.current;
        if (!bar) return;

        let rafId: number;
        const tick = () => {
            const totalScroll = getTotalScroll();
            const progress = Math.min(1, window.scrollY / totalScroll);
            bar.style.height = `${progress * 100}%`;
            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, [isMobile]);

    /* ─── GSAP ScrollTrigger animations ─────────────────── */
    useEffect(() => {
        if (isMobile) return;

        // Ensure we start at the top
        window.scrollTo(0, 0);

        const ctx = gsap.context(() => {
            /* ── A. Hero crack opening (scroll 0 → 3vh) ─── */

            // Left slab slides off-screen left
            gsap.to(slabLeftRef.current, {
                x: "-100%",
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: `+=${vhToPx(HERO.endVh)}`,
                    scrub: 0.5,
                },
            });

            // Right slab slides off-screen right
            gsap.to(slabRightRef.current, {
                x: "100%",
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: `+=${vhToPx(HERO.endVh)}`,
                    scrub: 0.5,
                },
            });

            // Crack glow scales up and fades as crack widens
            gsap.to(crackGlowRef.current, {
                scale: 3,
                opacity: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: `+=${vhToPx(2)}`,
                    scrub: 0.5,
                },
            });

            // Foreground smoke drifts upward and dissipates
            gsap.to(smokeRef.current, {
                y: "-30%",
                opacity: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: `+=${vhToPx(2.5)}`,
                    scrub: 0.5,
                },
            });

            // Atmosphere fades in as crack opens
            gsap.to(atmosphereRef.current, {
                opacity: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: `+=${vhToPx(ATMOSPHERE.startVh)}`,
                    end: `+=${vhToPx(ATMOSPHERE.endVh)}`,
                    scrub: 0.5,
                },
            });

            /* ── B. Service image cycles (no rift elements) ─ */
            SERVICES.forEach((service, i) => {
                const startPx  = vhToPx(service.startVh);
                const endPx    = vhToPx(service.endVh);
                const duration = endPx - startPx;
                const serviceImg = serviceImageRefs.current[i];

                if (!serviceImg) return;

                // Fade in (first 25% of section)
                gsap.fromTo(serviceImg,
                    { opacity: 0, scale: 1.1 },
                    {
                        opacity: 0.85,
                        scale: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: `+=${startPx}`,
                            end: `+=${startPx + duration * 0.25}`,
                            scrub: 0.5,
                        },
                    },
                );

                // Fade out (last 25% of section)
                gsap.to(serviceImg, {
                    opacity: 0,
                    scale: 0.95,
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: `+=${startPx + duration * 0.75}`,
                        end: `+=${endPx}`,
                        scrub: 0.5,
                    },
                });
            });

            /* ── C. Invitation section ──────────────────── */
            const invStart = vhToPx(INVITATION.startVh);
            const invEnd   = vhToPx(INVITATION.endVh);
            const invDur   = invEnd - invStart;

            // Invitation image fades in and stays
            if (invitationImgRef.current) {
                gsap.fromTo(invitationImgRef.current,
                    { opacity: 0, scale: 1.05 },
                    {
                        opacity: 0.85,
                        scale: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: `+=${invStart}`,
                            end: `+=${invStart + invDur * 0.4}`,
                            scrub: 0.5,
                        },
                    },
                );
            }
        });

        return () => ctx.revert();
    }, [isMobile]);

    /* ─── Mobile fallback ──────────────────────────────── */
    if (isMobile) {
        return <MobileFallback />;
    }

    /* ─── Desktop: layered parallax experience ──────────── */
    const totalScrollPx = `${TOTAL_VH * 100}vh`;

    return (
        <div
            ref={containerRef}
            className="relative bg-[#0a0b09]"
            style={{ height: totalScrollPx }}
        >
            {/* Text overlays — positioned in scroll flow */}
            <ServiceText />

            {/* Fixed viewport layer — stays pinned to screen */}
            <div
                ref={fixedLayerRef}
                className="fixed inset-0 w-full h-full overflow-hidden"
                style={{ zIndex: 1 }}
            >
                {/* LAYER 0: Background void (deepest) */}
                <img
                    src={HERO_ASSETS.void}
                    alt=""
                    loading="eager"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* LAYER 1: Atmosphere background (fades in as crack opens) */}
                <img
                    ref={atmosphereRef}
                    src={ATMOSPHERE_BG}
                    alt=""
                    loading="eager"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ opacity: 0, willChange: "opacity" }}
                />

                {/* LAYER 2: Service images (lighten blend + radial vignette) */}
                {SERVICES.map((service, i) => (
                    <img
                        key={service.id}
                        ref={(el) => { serviceImageRefs.current[i] = el; }}
                        src={service.image}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={SERVICE_IMG_STYLE}
                    />
                ))}

                {/* LAYER 2b: Invitation scene image */}
                <img
                    ref={invitationImgRef}
                    src={INVITATION_IMG}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={SERVICE_IMG_STYLE}
                />

                {/* LAYER 3: Hero crack glow (visible at start, fades as crack opens) */}
                <img
                    ref={crackGlowRef}
                    src={HERO_ASSETS.glow}
                    alt=""
                    loading="eager"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ mixBlendMode: "screen", willChange: "transform, opacity" }}
                />

                {/* LAYER 4: Left slab */}
                <img
                    ref={slabLeftRef}
                    src={HERO_ASSETS.slabL}
                    alt=""
                    loading="eager"
                    className="absolute top-0 left-0 h-full"
                    style={{
                        width: "50%",
                        objectFit: "cover",
                        objectPosition: "right center",
                        willChange: "transform",
                    }}
                />

                {/* LAYER 5: Right slab */}
                <img
                    ref={slabRightRef}
                    src={HERO_ASSETS.slabR}
                    alt=""
                    loading="eager"
                    className="absolute top-0 right-0 h-full"
                    style={{
                        width: "50%",
                        objectFit: "cover",
                        objectPosition: "left center",
                        willChange: "transform",
                    }}
                />

                {/* LAYER 6: Foreground smoke (hero only) */}
                <img
                    ref={smokeRef}
                    src={HERO_ASSETS.smoke}
                    alt=""
                    loading="eager"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ mixBlendMode: "screen", willChange: "transform, opacity" }}
                />

                {/* LAYER 7: Cursor spotlight */}
                <CursorSpotlight />

                {/* Social bar */}
                <SocialBar />

                {/* Stats counter */}
                <StatsCounter />

                {/* Scroll progress bar */}
                <div className="fixed top-0 right-0 w-[2px] h-screen bg-[rgba(107,127,98,0.1)] z-[20]">
                    <div
                        ref={progressRef}
                        className="w-full bg-[#6b7f62]"
                        style={{ height: "0%", transition: "height 0.1s linear" }}
                    />
                </div>
            </div>
        </div>
    );
}
