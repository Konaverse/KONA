"use client";

import { motion, useTransform, MotionValue } from "framer-motion";

// ─── Card Data ────────────────────────────────────────────
const CARDS = [
  {
    label: "STARTUP / PRE-SEED",
    title: "THE FOUNDER",
    desc: "You have vision and velocity. You need a brand that commands belief before the product ships.",
    traits: [
      "First impression that fundraises",
      "Identity that attracts talent",
      "Foundation to scale from",
    ],
  },
  {
    label: "SCALE-READY / ESTABLISHED",
    title: "THE VISIONARY BRAND",
    desc: "You've earned recognition. Now you need a digital presence that matches the weight of your ambition.",
    traits: [
      "Presence worthy of your category",
      "Digital systems that convert",
      "A story only you can tell",
    ],
  },
  {
    label: "GROWTH STAGE / B2B–B2C",
    title: "THE SCALE-UP",
    desc: "You're moving fast. Your brand needs infrastructure and experience design that keeps pace.",
    traits: [
      "Scalable design systems",
      "High-performance web ecosystems",
      "Brand architecture for growth",
    ],
  },
];

// ─── Each card has its own entry window spread across 0→1 ─
// Wider gaps ensure each card is fully visible before the next begins
const CARD_TIMING = [
  { start: 0.18, borderDone: 0.27, textIn: 0.23, textDone: 0.32 },
  { start: 0.40, borderDone: 0.49, textIn: 0.45, textDone: 0.54 },
  { start: 0.62, borderDone: 0.71, textIn: 0.67, textDone: 0.76 },
];

const FADE_OUT = [0.88, 0.95] as const;

// ─── Stat Data ────────────────────────────────────────────
const STATS = [
  { value: "12+", label: "FOUNDERS\nLAUNCHED" },
  { value: "3",   label: "INDUSTRIES\nSERVED"  },
  { value: "100%", label: "CLIENT\nRETENTION"  },
];

// Stat entry timing — slightly ahead of its paired card
const STAT_TIMING = [
  { start: 0.14, done: 0.22 },
  { start: 0.36, done: 0.44 },
  { start: 0.58, done: 0.66 },
];

// ─── Stat Pillar ──────────────────────────────────────────
function StatPillar({
  value,
  label,
  index,
  progress,
}: {
  value: string;
  label: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const { start, done } = STAT_TIMING[index];
  const [fadeOut0, fadeOut1] = FADE_OUT;

  const opacity = useTransform(
    progress,
    [start, done, fadeOut0, fadeOut1],
    [0, 1, 1, 0]
  );
  const y = useTransform(progress, [start, done], [24, 0]);

  return (
    <motion.div
      style={{
        opacity,
        y,
        willChange: "transform, opacity",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 10,
      }}
    >
      {/* Glowing dot */}
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#00ff88",
          boxShadow: "0 0 10px rgba(0,255,136,0.7), 0 0 24px rgba(0,255,136,0.3)",
          flexShrink: 0,
        }}
      />

      {/* Value */}
      <div
        style={{
          fontFamily: "var(--font-monument), sans-serif",
          fontSize: "clamp(28px, 3.5vw, 52px)",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          color: "rgba(255,255,255,0.92)",
          lineHeight: 1,
        }}
      >
        {value}
      </div>

      {/* Label */}
      <div
        style={{
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: 9,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)",
          whiteSpace: "pre-line",
          lineHeight: 1.6,
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}

// ─── Client Card ──────────────────────────────────────────
function ClientCard({
  label,
  title,
  desc,
  traits,
  index,
  progress,
}: {
  label: string;
  title: string;
  desc: string;
  traits: string[];
  index: number;
  progress: MotionValue<number>;
}) {
  const { start, borderDone, textIn, textDone } = CARD_TIMING[index];
  const [fadeOut0, fadeOut1] = FADE_OUT;

  const pathLength = useTransform(progress, [start, borderDone], [0, 1]);
  const borderOpacity = useTransform(
    progress,
    [start, start + 0.02, fadeOut0, fadeOut1],
    [0, 1, 1, 0]
  );
  const contentOpacity = useTransform(
    progress,
    [textIn, textDone, fadeOut0, fadeOut1],
    [0, 1, 1, 0]
  );
  const contentY = useTransform(progress, [textIn, textDone], [16, 0]);

  return (
    <div
      style={{
        position: "relative",
        background: "rgba(255,255,255,0.03)",
        padding: "18px 20px",
      }}
    >
      {/* SVG border draw */}
      <motion.svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: borderOpacity,
          pointerEvents: "none",
          overflow: "visible",
        }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <motion.rect
          x="0.5"
          y="0.5"
          width="99"
          height="99"
          fill="none"
          stroke="#00ff88"
          strokeWidth="0.8"
          style={{ pathLength }}
        />
      </motion.svg>

      {/* Card content */}
      <motion.div
        style={{
          opacity: contentOpacity,
          y: contentY,
          willChange: "transform, opacity",
        }}
      >
        {/* Archetype label */}
        <div
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 9,
            fontWeight: 500,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#00ff88",
            marginBottom: 8,
          }}
        >
          {label}
        </div>

        {/* Title */}
        <div
          style={{
            fontFamily: "var(--font-monument), sans-serif",
            fontSize: "clamp(18px, 2.5vw, 32px)",
            fontWeight: 800,
            letterSpacing: "0.03em",
            textTransform: "uppercase",
            color: "rgba(255, 255, 255, 0.95)",
            lineHeight: 1.1,
            marginBottom: 10,
          }}
        >
          {title}
        </div>

        {/* Description */}
        <p
          style={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontSize: "clamp(11px, 1vw, 13px)",
            fontWeight: 300,
            lineHeight: 1.7,
            color: "rgba(255, 255, 255, 0.48)",
            margin: "0 0 12px",
          }}
        >
          {desc}
        </p>

        {/* Trait bullets */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {traits.map((t) => (
            <div
              key={t}
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: 9,
                letterSpacing: "0.18em",
                color: "rgba(255, 255, 255, 0.35)",
                textTransform: "uppercase",
              }}
            >
              ◆ {t}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────
interface ClientsSectionProps {
  progress: MotionValue<number>;   // smoothed spring — drives card animations
  scrollY: MotionValue<number>;    // raw scroll — drives Y translation
  visible: boolean;
}

export default function ClientsSection({ progress, scrollY, visible }: ClientsSectionProps) {
  const [fadeOut0, fadeOut1] = FADE_OUT;

  // Section label — appears early, lower in viewport
  const headerOpacity = useTransform(progress, [0.05, 0.11, fadeOut0, fadeOut1], [0, 1, 1, 0]);
  const headerY = useTransform(progress, [0.05, 0.11], [14, 0]);

  // Opening line
  const lineOpacity = useTransform(progress, [0.09, 0.15, fadeOut0, fadeOut1], [0, 1, 1, 0]);
  const lineX = useTransform(progress, [0.09, 0.15], [-24, 0]);

  // Vertical rule
  const ruleOpacity = useTransform(progress, [0.05, 0.11, fadeOut0, fadeOut1], [0, 0.14, 0.14, 0]);

  // Content column scroll translation — raw scroll, no spring lag
  const contentTranslateY = useTransform(scrollY, [0, 1], ["0vh", "-120vh"]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "visible",
        pointerEvents: "none",
      }}
    >
      {/* Vertical boundary rule */}
      <motion.div
        style={{
          position: "absolute",
          top: "8vh",
          bottom: "8vh",
          right: "calc(52% + 2px)",
          width: 1,
          background:
            "linear-gradient(to bottom, transparent, var(--kona-accent), transparent)",
          opacity: ruleOpacity,
        }}
      />

      {/* Stat pillars — left column, scrolls with content */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: "4%",
          width: "18%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          gap: "clamp(32px, 5vh, 56px)",
          zIndex: 2,
          paddingTop: "108vh",
          y: contentTranslateY,
          willChange: "transform",
        }}
      >
        {STATS.map((s, i) => (
          <StatPillar
            key={s.value}
            value={s.value}
            label={s.label}
            index={i}
            progress={progress}
          />
        ))}
      </motion.div>

      {/* Content column — starts below fold, scrolls upward with progress */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          right: "4%",
          width: "48%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          zIndex: 2,
          paddingTop: "100vh",
          paddingBottom: "20vh",
          y: contentTranslateY,
          willChange: "transform",
        }}
      >
        {/* Section label */}
        <motion.div
          style={{
            opacity: headerOpacity,
            y: headerY,
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--kona-accent)",
            marginBottom: 18,
            willChange: "transform, opacity",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ opacity: 0.5 }}>◆</span>
          <span>03 — The Clients</span>
        </motion.div>

        {/* Opening line */}
        <motion.div
          style={{
            opacity: lineOpacity,
            x: lineX,
            fontFamily: "var(--font-monument), sans-serif",
            fontSize: "clamp(20px, 2.8vw, 40px)",
            fontWeight: 200,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            color: "rgba(255, 255, 255, 0.88)",
            lineHeight: 1.1,
            marginBottom: 28,
            willChange: "transform, opacity",
          }}
        >
          We build for ambition.
        </motion.div>

        {/* Cards — all in DOM, each animates on its own scroll window */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {CARDS.map((card, i) => (
            <ClientCard
              key={card.title}
              label={card.label}
              title={card.title}
              desc={card.desc}
              traits={card.traits}
              index={i}
              progress={progress}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
