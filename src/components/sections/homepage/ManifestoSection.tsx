"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

// ── Config ───────────────────────────────────────────────
const MANIFESTO =
  "We're a small team that builds digital experiences for builders, brands, and visionaries who refuse to blend in.";

const NEON = "#00ff88";
const NEON_DIM = "rgba(0, 255, 136, 0.4)";

// Words that get neon highlight treatment
const KEYWORD_SET = new Set([
  "builders,",
  "brands,",
  "visionaries",
  "refuse",
  "blend",
  "in.",
]);

// ── Word component — opacity + weight + color driven by scroll ───
function Word({
  children,
  progress,
  range,
  isKeyword,
  index,
  total,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  isKeyword: boolean;
  index: number;
  total: number;
}) {
  // ── Reveal phase (0.25–0.55) ──
  const opacity = useTransform(progress, range, [0.12, 1]);

  // ── Exit phase ──
  // Each word exits at a slightly different time for a burst/spread effect.
  // Words near the center of the sentence exit slightly later (linger longer).
  const centeredness = 1 - Math.abs(index / total - 0.5) * 2; // 0 at edges, 1 at center
  const exitStart = 0.58 + centeredness * 0.03; // center words start exiting later
  const exitEnd = exitStart + 0.12;

  const exitOpacity = useTransform(
    progress,
    [exitStart, exitEnd],
    [1, 0]
  );

  // Words scatter outward: left-half words drift left, right-half drift right
  const side = index < total / 2 ? -1 : 1;
  const drift = (1 - centeredness) * 60 * side; // outer words drift further
  const exitX = useTransform(progress, [exitStart, exitEnd], [0, drift]);

  // All words scale up (rushing toward camera)
  const exitScale = useTransform(
    progress,
    [exitStart, exitEnd],
    [1, 1.3 + centeredness * 0.5] // center words scale more (closer to camera)
  );

  // Blur as words rush past
  const exitBlur = useTransform(
    progress,
    [exitStart, exitStart + 0.06],
    [0, 6 + centeredness * 4]
  );

  return (
    <motion.span
      className="relative mx-[0.3em] inline-block will-change-transform"
      style={{
        opacity: exitOpacity,
        x: exitX,
        scale: exitScale,
        filter: useTransform(exitBlur, (v) => `blur(${v}px)`),
      }}
    >
      {/* Ghost layer — always visible at low opacity for context */}
      <span
        style={{
          position: "absolute",
          opacity: 0.12,
          color: isKeyword ? NEON : "white",
        }}
      >
        {children}
      </span>
      {/* Revealed layer — scroll-driven */}
      <motion.span
        style={{
          opacity,
          color: isKeyword ? NEON : "white",
          textShadow: isKeyword
            ? `0 0 20px ${NEON_DIM}, 0 0 40px rgba(0,255,136,0.15)`
            : "none",
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

// ── Component ────────────────────────────────────────────
export default function ManifestoSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const words = MANIFESTO.split(" ");

  // Each word gets an evenly distributed slice of the scroll range.
  const rangeStart = 0.25;
  const rangeEnd = 0.55;
  const step = (rangeEnd - rangeStart) / words.length;

  // Ambient glow behind the text block — intensifies as more words reveal, fades on exit
  const ambientOpacity = useTransform(
    scrollYProgress,
    [0.25, 0.42, 0.55, 0.68],
    [0, 0.3, 0.15, 0]
  );
  const ambientScale = useTransform(
    scrollYProgress,
    [0.25, 0.42, 0.58, 0.72],
    [0.8, 1.2, 1.2, 2.0]
  );

  // Accent line: appears after reveal, exits with the text
  const lineOpacity = useTransform(
    scrollYProgress,
    [0.48, 0.54, 0.58, 0.66],
    [0, 0.4, 0.4, 0]
  );
  const lineScale = useTransform(
    scrollYProgress,
    [0.58, 0.68],
    [1, 2.5]
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-black"
      style={{ minHeight: "500vh" }}
    >
      {/* Sticky container — centered in viewport */}
      <div
        className="sticky top-0 flex h-screen w-full items-center justify-center"
        style={{ pointerEvents: "none" }}
      >
        {/* Ambient neon radial glow behind text */}
        <motion.div
          className="absolute"
          style={{
            width: "clamp(300px, 50vw, 700px)",
            height: "clamp(200px, 30vh, 400px)",
            background: `radial-gradient(ellipse, ${NEON}18 0%, transparent 70%)`,
            opacity: ambientOpacity,
            scale: ambientScale,
            filter: "blur(60px)",
          }}
        />

        <p
          className="relative flex max-w-4xl flex-wrap items-center justify-center px-6 text-center text-3xl leading-[1.4] tracking-tight md:text-5xl lg:text-6xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {words.map((word, i) => {
            const start = rangeStart + i * step;
            const end = start + step;
            const isKeyword = KEYWORD_SET.has(word.toLowerCase());

            return (
              <Word
                key={i}
                progress={scrollYProgress}
                range={[start, end]}
                isKeyword={isKeyword}
                index={i}
                total={words.length}
              >
                {word}
              </Word>
            );
          })}
        </p>

        {/* Subtle neon accent line below text — exits with burst */}
        <motion.div
          className="absolute bottom-[15vh] left-1/2 -translate-x-1/2"
          style={{
            width: "clamp(60px, 8vw, 120px)",
            height: 1,
            background: NEON,
            opacity: lineOpacity,
            scale: lineScale,
            boxShadow: `0 0 20px ${NEON}40`,
          }}
        />
      </div>
    </section>
  );
}
