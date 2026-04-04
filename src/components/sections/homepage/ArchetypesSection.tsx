"use client";

import { useRef, useState, useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap";

// ── Data ──────────────────────────────────────────────────
const NEON = "#00ff88";

const ARCHETYPES = [
  {
    id: "builders",
    label: "Builders.",
    tagline: "For those laying foundations",
    lines: [
      "Startups, founders, and makers",
      "who need digital infrastructure",
      "that matches their ambition.",
    ],
    image: "/homepage/beat3-archetypes/builders.jpg",
    // Slow zoom in — intensity, pressure, focus
    imageTransform: (p: number) => `scale(${1.05 + p * 0.1})`,
  },
  {
    id: "brands",
    label: "Brands.",
    tagline: "For those commanding attention",
    lines: [
      "Established companies ready",
      "to sharpen their edge and own",
      "every digital touchpoint.",
    ],
    image: "/homepage/beat3-archetypes/brands.jpg",
    // Lateral slide — momentum, forward motion
    imageTransform: (p: number) => `scale(1.12) translateX(${-p * 6}%)`,
  },
  {
    id: "visionaries",
    label: "Visionaries.",
    tagline: "For those seeing the whole board",
    lines: [
      "Leaders with long horizons",
      "who think in systems,",
      "not campaigns.",
    ],
    image: "/homepage/beat3-archetypes/visionaries.jpg",
    // Slow zoom out — revelation, scale, ambition
    imageTransform: (p: number) => `scale(${1.18 - p * 0.12})`,
  },
];

// ── Helpers ───────────────────────────────────────────────
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const remap = (inLo: number, inHi: number, v: number) =>
  clamp01((v - inLo) / (inHi - inLo));

// ── Component ────────────────────────────────────────────
export default function ArchetypesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // ── Pin & scrub ──
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "+=500%",
          scrub: 1,
          pin: true,
          pinSpacing: true,
          onUpdate: (self) => setProgress(self.progress),
        });
      }, section);

      return () => ctx.revert();
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  // ── Progress mappings ──────────────────────────────────

  // Phase 0: Builders image slides up covering previous section
  const slideUpY = (1 - remap(0, 0.06, progress)) * 100; // 100% → 0%

  // Per-archetype progress: each gets ~0.31 of total, with 0.03 transition overlap
  // Archetype 0: 0.06 – 0.35
  // Archetype 1: 0.35 – 0.65
  // Archetype 2: 0.65 – 0.95
  // Exit: 0.95 – 1.00

  const archRanges = [
    [0.06, 0.35],
    [0.35, 0.65],
    [0.65, 0.95],
  ] as const;

  // Which archetype is dominant (for content)
  const activeIndex =
    progress < 0.35 ? 0 : progress < 0.65 ? 1 : 2;

  // Per-archetype local progress (0–1 within its range)
  const localP = (i: number) => {
    const [lo, hi] = archRanges[i];
    return clamp01((progress - lo) / (hi - lo));
  };

  // Image opacity (cross-fade at boundaries)
  const imageOpacity = (i: number) => {
    if (i === 0) {
      // Visible from start, fade out 0.30–0.38
      return progress < 0.30 ? 1 : 1 - remap(0.30, 0.38, progress);
    }
    if (i === 1) {
      // Fade in 0.30–0.38, fade out 0.60–0.68
      const fadeIn = remap(0.30, 0.38, progress);
      const fadeOut = 1 - remap(0.60, 0.68, progress);
      return Math.min(fadeIn, fadeOut);
    }
    // Visionaries: fade in 0.60–0.68, stay till end
    return remap(0.60, 0.68, progress);
  };

  // Image Y offset during cross-fade (parallax feel)
  const imageTranslateY = (i: number) => {
    if (i === 0) {
      // Slides up slightly as it fades out
      const fade = remap(0.30, 0.38, progress);
      return fade * -4; // percent
    }
    if (i === 1) {
      const fadeIn = remap(0.30, 0.38, progress);
      const fadeOut = remap(0.60, 0.68, progress);
      return fadeIn < 1 ? (1 - fadeIn) * 4 : fadeOut * -4;
    }
    const fadeIn = remap(0.60, 0.68, progress);
    return fadeIn < 1 ? (1 - fadeIn) * 4 : 0;
  };

  // Inset (shrink): grows in, stays, shrinks out per archetype
  const insetForArch = (i: number) => {
    const lp = localP(i);
    const shrinkIn = remap(0, 0.12, lp);    // 0→1: shrinking in
    const shrinkOut = remap(0.82, 0.92, lp); // 0→1: expanding back
    return shrinkIn * (1 - shrinkOut) * 28;  // max 28px inset
  };

  // Active archetype's inset (determines the visual frame)
  const currentInset = insetForArch(activeIndex);
  const currentRadius = (currentInset / 28) * 18; // max 18px radius

  // Content visibility per archetype
  const contentOpacity = (i: number) => {
    const lp = localP(i);
    const fadeIn = remap(0.15, 0.22, lp);
    const fadeOut = 1 - remap(0.75, 0.82, lp);
    return Math.max(0, Math.min(fadeIn, fadeOut));
  };

  // Content Y offset (parallax entry)
  const contentY = (i: number) => {
    const lp = localP(i);
    return (1 - remap(0.12, 0.25, lp)) * 60; // 60px → 0
  };

  // Per-line stagger
  const lineOpacity = (archI: number, lineI: number) => {
    const lp = localP(archI);
    const lineIn = remap(0.18 + lineI * 0.04, 0.26 + lineI * 0.04, lp);
    const lineOut = 1 - remap(0.75, 0.82, lp);
    return Math.max(0, Math.min(lineIn, lineOut));
  };

  // Tagline
  const taglineOpacity = (i: number) => {
    const lp = localP(i);
    const fadeIn = remap(0.12, 0.18, lp);
    const fadeOut = 1 - remap(0.76, 0.82, lp);
    return Math.max(0, Math.min(fadeIn, fadeOut));
  };

  // Image effect progress (the zoom/slide during content phase)
  const imageEffectP = (i: number) => remap(0.1, 0.85, localP(i));

  // Section label index (top-right, shows which archetype)
  const indexLabel = `0${activeIndex + 1} / 03`;

  // Background goes black only after the image fully covers the viewport
  const bgBlack = slideUpY <= 0;

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ zIndex: 15, background: bgBlack ? "#000" : "transparent" }}
    >
      {/* ── Image layers ── */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: `translateY(${slideUpY}%)`,
        }}
      >
        {/* Inset frame */}
        <div
          className="absolute will-change-transform overflow-hidden"
          style={{
            inset: `${currentInset}px`,
            borderRadius: `${currentRadius}px`,
            transition: "border-radius 0.3s ease",
          }}
        >
          {ARCHETYPES.map((arch, i) => {
            const op = imageOpacity(i);
            const ty = imageTranslateY(i);
            const effectP = imageEffectP(i);

            return (
              <div
                key={arch.id}
                className="absolute inset-0 will-change-transform"
                style={{
                  opacity: op,
                  visibility: op > 0.01 ? "visible" : "hidden",
                }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center will-change-transform"
                  style={{
                    backgroundImage: `url(${arch.image})`,
                    transform: `${arch.imageTransform(effectP)} translateY(${ty}%)`,
                    transition: "transform 0.05s linear",
                  }}
                />
              </div>
            );
          })}

          {/* Dark gradient overlay — bottom third */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 35%, transparent 60%),
                linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 20%)
              `,
            }}
          />

          {/* ── Content overlay ── */}
          {ARCHETYPES.map((arch, i) => {
            const cOp = contentOpacity(i);
            const cY = contentY(i);
            if (cOp < 0.01) return null;

            return (
              <div
                key={`content-${arch.id}`}
                className="absolute inset-0 flex flex-col justify-end pointer-events-none"
                style={{
                  padding: `0 ${Math.max(32, currentInset + 16)}px ${Math.max(48, currentInset + 24)}px`,
                  opacity: cOp,
                }}
              >
                {/* Tagline */}
                <div
                  className="mb-4 will-change-transform"
                  style={{
                    opacity: taglineOpacity(i),
                    transform: `translateY(${cY * 0.6}px)`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-[1px] w-10"
                      style={{ background: `${NEON}66` }}
                    />
                    <span
                      className="text-[10px] md:text-[11px] tracking-[0.4em] uppercase"
                      style={{
                        color: `${NEON}99`,
                        fontFamily: "var(--font-comfortaa)",
                      }}
                    >
                      {arch.tagline}
                    </span>
                  </div>
                </div>

                {/* Large label */}
                <h2
                  className="text-5xl md:text-7xl lg:text-[6rem] font-bold leading-[0.95] tracking-tight mb-6 will-change-transform"
                  style={{
                    fontFamily: "var(--font-comfortaa)",
                    color: "rgba(255,255,255,0.95)",
                    transform: `translateY(${cY}px)`,
                    textShadow: "0 2px 40px rgba(0,0,0,0.5)",
                  }}
                >
                  {arch.label}
                </h2>

                {/* Supporting lines */}
                <div className="flex flex-col gap-[6px] max-w-[440px]">
                  {arch.lines.map((line, li) => (
                    <span
                      key={li}
                      className="text-sm md:text-base leading-[1.6] will-change-transform"
                      style={{
                        fontFamily: "var(--font-comfortaa)",
                        color: "rgba(255,255,255,0.55)",
                        opacity: lineOpacity(i, li),
                        transform: `translateY(${(1 - lineOpacity(i, li)) * 20}px)`,
                      }}
                    >
                      {line}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}

          {/* ── Top-right index ── */}
          <div
            className="absolute top-6 right-6 md:top-8 md:right-8"
            style={{
              opacity: remap(0.08, 0.12, progress),
            }}
          >
            <span
              className="text-[10px] tracking-[0.3em] uppercase"
              style={{
                color: "rgba(255,255,255,0.2)",
                fontFamily: "var(--font-geist-mono, monospace)",
              }}
            >
              {indexLabel}
            </span>
          </div>

          {/* ── Bottom-right archetype dots ── */}
          <div
            className="absolute bottom-6 right-6 md:bottom-8 md:right-8 flex gap-2 items-center"
            style={{ opacity: remap(0.08, 0.12, progress) }}
          >
            {ARCHETYPES.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-500"
                style={{
                  width: activeIndex === i ? 20 : 6,
                  height: 6,
                  background:
                    activeIndex === i ? NEON : "rgba(255,255,255,0.2)",
                  boxShadow:
                    activeIndex === i ? `0 0 8px ${NEON}66` : "none",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
