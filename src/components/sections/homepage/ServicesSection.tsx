"use client";

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap";

// ── Constants ─────────────────────────────────────────────
const NEON = "#00ff88";

// ── Service data ──────────────────────────────────────────
type ParallaxType =
  | "zoom-in" // slow push into the frame — focus, pressure
  | "zoom-out" // slow pull revealing scale — revelation, ambition
  | "drift-left" // lateral slide — forward momentum
  | "drift-right" // lateral slide — bold, directional
  | "drift-up"; // upward crawl — cinematic dolly

interface Service {
  id: string;
  name: string;
  descriptor: string;
  image: string;
  link: string;
  /** Controls how fast the image blooms to fullscreen. >1 = faster, <1 = slower */
  bloomSpeed: number;
  /** How the fullscreen image moves during the inhabit phase */
  parallax: { type: ParallaxType; intensity: number };
}

const SERVICES: Service[] = [
  {
    id: "web-development",
    name: "Web Development",
    descriptor: "Architecture that performs under pressure.",
    image: "/homepage/beat4-services/web-development.jpg",
    link: "/solutions/web-development",
    bloomSpeed: 1.3,
    parallax: { type: "zoom-in", intensity: 1.0 }, // Architectural focus — slow deliberate push
  },
  {
    id: "web-applications",
    name: "Web Applications",
    descriptor: "Systems that think while you sleep.",
    image: "/homepage/beat4-services/web-applications.jpg",
    link: "/solutions/web-applications",
    bloomSpeed: 1.0,
    parallax: { type: "drift-left", intensity: 1.0 }, // Systems in motion — lateral momentum
  },
  {
    id: "videography",
    name: "Videography",
    descriptor: "Stories told in frames and feeling.",
    image: "/homepage/beat4-services/videography.jpg",
    link: "/solutions/videography",
    bloomSpeed: 0.65,
    parallax: { type: "drift-up", intensity: 1.0 }, // Cinematic dolly — slow upward crawl
  },
  {
    id: "digital-advertising",
    name: "Digital Advertising",
    descriptor: "The right message. The only moment.",
    image: "/homepage/beat4-services/digital-advertising.jpg",
    link: "/solutions/digital-advertising",
    bloomSpeed: 1.6,
    parallax: { type: "drift-right", intensity: 1.0 }, // Bold directional sweep
  },
  {
    id: "social-media",
    name: "Social Media",
    descriptor: "Presence that compounds.",
    image: "/homepage/beat4-services/social-media.jpg",
    link: "/solutions/social-media",
    bloomSpeed: 1.1,
    parallax: { type: "zoom-out", intensity: 1.0 }, // Network expanding — slow pull reveal
  },
];

const COUNT = SERVICES.length;
const CARD_SLICE = 1 / COUNT;

// ── Helpers ───────────────────────────────────────────────
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// ── Corner bracket SVG (reused at each corner) ───────────
function CornerBracket({
  position,
  draw,
  opacity,
}: {
  position: "tl" | "tr" | "bl" | "br";
  draw: number; // 0–1, how much of the stroke is drawn
  opacity: number;
}) {
  const pathLength = 56; // approximate
  const dashOffset = (1 - draw) * pathLength;

  const posClass = {
    tl: "top-0 left-0",
    tr: "top-0 right-0",
    bl: "bottom-0 left-0",
    br: "bottom-0 right-0",
  }[position];

  const d = {
    tl: "M2 28 L2 2 L28 2",
    tr: "M52 28 L52 2 L26 2",
    bl: "M2 26 L2 52 L28 52",
    br: "M52 26 L52 52 L26 52",
  }[position];

  return (
    <svg
      className={`absolute ${posClass} pointer-events-none`}
      width="54"
      height="54"
      viewBox="0 0 54 54"
      fill="none"
      style={{ opacity }}
    >
      <path
        d={d}
        stroke={NEON}
        strokeWidth="3"
        strokeLinecap="square"
        strokeDasharray={pathLength}
        strokeDashoffset={dashOffset}
      />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────
export default function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const ctxRef = useRef<ReturnType<typeof gsap.context> | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // ── Media queries ──
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);

    const rmql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(rmql.matches);
    const rHandler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    rmql.addEventListener("change", rHandler);

    return () => {
      mql.removeEventListener("change", handler);
      rmql.removeEventListener("change", rHandler);
    };
  }, []);

  // ── Preload service images ──
  useEffect(() => {
    SERVICES.forEach((s) => {
      const img = new Image();
      img.src = s.image;
    });
  }, []);

  // ── GSAP: Pin & scrub ──
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const timer = setTimeout(() => {
      ctxRef.current?.revert();

      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: `+=${isMobile ? 750 : 1000}%`,
          scrub: 1.2,
          pin: true,
          pinSpacing: true,
          onUpdate: (self) => setProgress(self.progress),
        });
      }, section);

      ctxRef.current = ctx;
    }, 150);

    return () => {
      clearTimeout(timer);
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
  }, [isMobile]);

  // ── Active card index ──
  const activeIndex = Math.min(
    COUNT - 1,
    Math.floor(progress / CARD_SLICE)
  );

  // ── Per-card visual state calculator ──
  const getCardVisuals = (i: number) => {
    const cardStart = i * CARD_SLICE;

    // Peek offset: cards after the first start appearing slightly before
    // their nominal range so they're visible behind the exiting card
    const peekOffset = i > 0 ? 0.025 : 0;
    const lp = (progress - cardStart + peekOffset) / CARD_SLICE;

    // Skip cards far outside visible range
    if (lp < -0.02 || lp > 1.12) return null;

    const { bloomSpeed, parallax } = SERVICES[i];
    const motionScale = reducedMotion ? 0.2 : isMobile ? 0.5 : 1;

    // ── Phase 1: Approach (0.00–0.28) ──
    // Image enters from the right as a small polaroid
    const approachP = clamp01(lp / 0.28);

    // ── Phase 2: Bloom (0.28–bloomEnd) ──
    // Image scales from polaroid to full viewport
    const bloomDuration = 0.20 / bloomSpeed;
    const bloomEnd = Math.min(0.28 + bloomDuration, 0.55);
    const bloomP = clamp01((lp - 0.28) / (bloomEnd - 0.28));

    // ── Phase 3: Inhabit (bloomEnd–0.88) ──
    // Full viewport, text and CTA appear, parallax moves the image
    const inhabitP = clamp01((lp - bloomEnd) / (0.88 - bloomEnd));

    // ── Phase 4: Exit (0.88–1.0) ──
    // Fades away as next card peeks in (not for last card)
    const isLast = i === COUNT - 1;
    const exitP = isLast ? 0 : clamp01((lp - 0.88) / 0.12);

    // ── Derived transforms ──────────────────────────────

    // X translation: starts off-right, eases to center
    const travelDist = 30 * motionScale;
    const easeOut = 1 - Math.pow(1 - approachP, 2.5);
    const x = (1 - easeOut) * travelDist;

    // Scale: polaroid → fullscreen
    const smallScale = isMobile ? 0.35 : 0.20;
    const easedBloom = 1 - Math.pow(1 - bloomP, 1.3 + bloomSpeed * 0.3);
    const scale = smallScale + easedBloom * (1 - smallScale);

    // Opacity
    const fadeIn = clamp01(lp / 0.06);
    const fadeOut = 1 - exitP;
    const opacity = Math.min(fadeIn, fadeOut);

    // Neon frame (visible during approach, dissolves in bloom)
    const frameOp =
      clamp01(approachP * 1.8) * clamp01(1 - bloomP * 2.5) * opacity;

    // Corner bracket draw progress (draws in during approach)
    const cornerDraw = clamp01(approachP * 1.4);

    // ── Parallax (active once bloom is ~80% done through inhabit) ──
    const parallaxStart = bloomEnd - 0.04;
    const parallaxEnd = 0.90;
    const parallaxP =
      clamp01((lp - parallaxStart) / (parallaxEnd - parallaxStart)) *
      motionScale;
    const pI = parallax.intensity;

    let imgTransform = "";
    switch (parallax.type) {
      case "zoom-in":
        // Slow push — scale 1.0 → 1.08
        imgTransform = `scale(${1 + parallaxP * 0.08 * pI})`;
        break;
      case "zoom-out":
        // Slow pull — scale 1.07 → 1.0
        imgTransform = `scale(${1 + (1 - parallaxP) * 0.07 * pI})`;
        break;
      case "drift-left":
        // Lateral left + base scale to prevent edge gaps
        imgTransform = `scale(1.06) translateX(${-parallaxP * 4 * pI}%)`;
        break;
      case "drift-right":
        // Lateral right + base scale
        imgTransform = `scale(1.06) translateX(${parallaxP * 4 * pI}%)`;
        break;
      case "drift-up":
        // Upward crawl + base scale — cinematic dolly feel
        imgTransform = `scale(1.06) translateY(${-parallaxP * 3 * pI}%)`;
        break;
    }

    // Text
    const textOp = clamp01(inhabitP * 2.5) * clamp01(1 - exitP * 3);
    const textY = (1 - clamp01(inhabitP * 1.5)) * 25 * motionScale;

    // Descriptor (slightly staggered after title)
    const descOp =
      clamp01((inhabitP - 0.1) / 0.5) * clamp01(1 - exitP * 3);

    // Button (staggered after descriptor)
    const btnOp =
      clamp01((inhabitP - 0.2) / 0.4) * clamp01(1 - exitP * 3);

    // Dark overlay for text readability
    const overlayOp = textOp * 0.85;

    return {
      x,
      scale,
      opacity,
      frameOp,
      cornerDraw,
      imgTransform,
      textOp,
      textY,
      descOp,
      btnOp,
      overlayOp,
    };
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ background: "#000", zIndex: 15 }}
    >
      {/* ── Service card layers ── */}
      {SERVICES.map((service, i) => {
        const v = getCardVisuals(i);
        if (!v) return null;

        return (
          <div
            key={service.id}
            className="absolute inset-0"
            style={{
              zIndex: i === activeIndex ? 3 : 2,
              opacity: v.opacity,
              willChange: "opacity",
            }}
          >
            {/* ── Position wrapper (horizontal travel) ── */}
            <div
              className="absolute inset-0 will-change-transform"
              style={{ transform: `translateX(${v.x}vw)` }}
            >
              {/* ── Scale wrapper (polaroid → fullscreen bloom) ── */}
              <div
                className="absolute inset-0 will-change-transform"
                style={{
                  transform: `scale(${v.scale})`,
                  transformOrigin: "center center",
                }}
              >
                {/* Image — parallax transform applied here */}
                <div
                  className="absolute inset-0 bg-cover bg-center will-change-transform"
                  style={{
                    backgroundImage: `url(${service.image})`,
                    transform: v.imgTransform || undefined,
                  }}
                />

                {/* Neon corner brackets (structural accent) */}
                {v.frameOp > 0.01 && (
                  <>
                    <CornerBracket
                      position="tl"
                      draw={v.cornerDraw}
                      opacity={v.frameOp}
                    />
                    <CornerBracket
                      position="tr"
                      draw={v.cornerDraw}
                      opacity={v.frameOp}
                    />
                    <CornerBracket
                      position="bl"
                      draw={v.cornerDraw}
                      opacity={v.frameOp}
                    />
                    <CornerBracket
                      position="br"
                      draw={v.cornerDraw}
                      opacity={v.frameOp}
                    />
                    {/* Ambient glow behind the polaroid */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        boxShadow: `0 0 80px rgba(0,255,136,0.08), 0 0 160px rgba(0,255,136,0.04)`,
                        opacity: v.frameOp,
                      }}
                    />
                  </>
                )}

                {/* Dark gradient overlay for text readability */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `
                      linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.08) 70%, transparent 100%),
                      linear-gradient(to right, rgba(0,0,0,0.45) 0%, transparent 50%)
                    `,
                    opacity: v.overlayOp,
                  }}
                />
              </div>
            </div>

            {/* ── Text overlay (outside scale wrapper so text doesn't scale) ── */}
            {v.textOp > 0.01 && (
              <div
                className="absolute bottom-[8vh] md:bottom-[12vh] left-6 md:left-16 z-10 will-change-transform pointer-events-none"
                style={{
                  opacity: v.textOp,
                  transform: `translateY(${v.textY}px)`,
                }}
              >
                {/* Service label */}
                <div
                  className="flex items-center gap-3 mb-4"
                  style={{ opacity: v.descOp }}
                >
                  <div
                    className="h-[1px] w-8"
                    style={{ background: `${NEON}44` }}
                  />
                  <span
                    className="text-[9px] md:text-[10px] tracking-[0.4em] uppercase"
                    style={{
                      color: `${NEON}66`,
                      fontFamily: "var(--font-geist-mono, monospace)",
                    }}
                  >
                    Service {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="text-3xl md:text-5xl lg:text-[5rem] font-bold leading-[1.0] tracking-tight"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "rgba(255,255,255,0.95)",
                    textShadow: "0 4px 60px rgba(0,0,0,0.6)",
                  }}
                >
                  {service.name}
                </h3>

                {/* Descriptor */}
                <p
                  className="mt-3 md:mt-4 text-sm md:text-base leading-[1.6] max-w-[320px] md:max-w-[400px] will-change-transform"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "rgba(255,255,255,0.45)",
                    opacity: v.descOp,
                    transform: `translateY(${(1 - v.descOp) * 8}px)`,
                  }}
                >
                  {service.descriptor}
                </p>

                {/* CTA button */}
                <a
                  href={service.link}
                  className="inline-flex items-center gap-3 mt-6 md:mt-8 group pointer-events-auto"
                  style={{ opacity: v.btnOp }}
                >
                  <span
                    className="text-[10px] md:text-[11px] tracking-[0.2em] uppercase"
                    style={{
                      color: NEON,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    Explore
                  </span>
                  <span
                    className="inline-block w-6 h-[1px] group-hover:w-10 transition-all duration-300 ease-out"
                    style={{ background: NEON }}
                  />
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  >
                    <path
                      d="M1 5h8M6 2l3 3-3 3"
                      stroke={NEON}
                      strokeWidth="1"
                      strokeLinecap="round"
                    />
                  </svg>
                </a>
              </div>
            )}
          </div>
        );
      })}

      {/* ── Progress dots ── */}
      <div
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-[6px] items-center z-20"
        style={{
          opacity: clamp01(progress / 0.02),
          transition: "opacity 0.3s ease",
        }}
      >
        {SERVICES.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-500 ease-out"
            style={{
              width: activeIndex === i ? 24 : 6,
              height: 6,
              background:
                activeIndex === i ? NEON : "rgba(255,255,255,0.15)",
              boxShadow:
                activeIndex === i ? `0 0 10px ${NEON}66` : "none",
            }}
          />
        ))}
      </div>

      {/* ── Counter (top right) ── */}
      <div
        className="absolute top-6 right-6 md:top-8 md:right-8 z-20"
        style={{
          opacity: clamp01(progress / 0.02),
          transition: "opacity 0.3s ease",
        }}
      >
        <span
          className="text-[10px] tracking-[0.3em] uppercase"
          style={{
            color: "rgba(255,255,255,0.2)",
            fontFamily: "var(--font-geist-mono, monospace)",
          }}
        >
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(COUNT).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}
