"use client";

import { motion, useTransform, MotionValue } from "framer-motion";

// ─── Principle Data ───────────────────────────────────────
const PRINCIPLES = [
  {
    num: "01",
    label: "PHILOSOPHY",
    claim: "ARCHITECTS,\nNOT BUILDERS",
    text: "We don't build websites. We architect digital ecosystems that convert visitors into believers.",
  },
  {
    num: "02",
    label: "APPROACH",
    claim: "CRAFT OVER\nCONVENIENCE",
    text: "Every pixel earns its place. Every interaction is designed to resonate. No templates. No shortcuts.",
  },
  {
    num: "03",
    label: "COMMITMENT",
    claim: "YOUR BRAND,\nOUR OBSESSION",
    text: "Small team. Direct collaboration. We treat your brand like our own because your success is ours.",
  },
];

// ─── Principle Entry ──────────────────────────────────────
function PrincipleEntry({
  num,
  label,
  claim,
  text,
}: {
  num: string;
  label: string;
  claim: string;
  text: string;
}) {
  return (
    <div style={{ position: "relative" }}>
      {/* Hairline above */}
      <div
        style={{
          height: 1,
          background: "var(--kona-accent)",
          opacity: 0.35,
          marginBottom: 14,
        }}
      />

      <div style={{ display: "flex", alignItems: "flex-start", gap: 18 }}>
        {/* Ghost index number */}
        <div
          style={{
            fontFamily: "var(--font-monument), sans-serif",
            fontSize: "clamp(36px, 4.5vw, 60px)",
            fontWeight: 800,
            lineHeight: 1,
            color: "var(--kona-accent)",
            opacity: 0.1,
            flexShrink: 0,
            marginTop: -2,
            letterSpacing: "-0.05em",
            userSelect: "none",
          }}
        >
          {num}
        </div>

        <div style={{ flex: 1 }}>
          {/* Mono category label */}
          <div
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: 9,
              fontWeight: 500,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "var(--kona-accent)",
              marginBottom: 7,
            }}
          >
            {label}
          </div>

          {/* Bold claim */}
          <div
            style={{
              fontFamily: "var(--font-monument), sans-serif",
              fontSize: "clamp(13px, 1.5vw, 18px)",
              fontWeight: 800,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.95)",
              lineHeight: 1.2,
              marginBottom: 10,
              whiteSpace: "pre-line",
            }}
          >
            {claim}
          </div>

          {/* Body */}
          <p
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontSize: "clamp(11px, 1vw, 13px)",
              fontWeight: 300,
              lineHeight: 1.75,
              color: "rgba(255, 255, 255, 0.48)",
              margin: 0,
            }}
          >
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Blueprint Grid ───────────────────────────────────────
function BlueprintGrid({ opacity }: { opacity: MotionValue<number> }) {
  return (
    <motion.svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity,
        pointerEvents: "none",
      }}
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
    >
      {[100, 200, 300, 400, 500].map((y) => (
        <line
          key={`h-${y}`}
          x1="0" y1={y} x2="800" y2={y}
          stroke="var(--kona-accent)"
          strokeWidth="0.5"
        />
      ))}
      {[100, 200, 400, 600, 700].map((x) => (
        <line
          key={`v-${x}`}
          x1={x} y1="0" x2={x} y2="600"
          stroke="var(--kona-accent)"
          strokeWidth="0.5"
        />
      ))}
    </motion.svg>
  );
}

// ─── Main Section ─────────────────────────────────────────
interface BlueprintSectionProps {
  progress: MotionValue<number>;
  visible: boolean;
}

export default function BlueprintSection({ progress, visible }: BlueprintSectionProps) {
  // Curtain: rise up, then split
  const curtainY = useTransform(progress, [0, 0.05], [100, 0]);
  const curtainX = useTransform(progress, [0.06, 0.14], [0, 105]);

  // Everything behind the curtain: single scroll-driven Y offset
  // Starts at +50vh (bottom half of viewport), scrolls up to -100vh (exits top)
  const contentY = useTransform(progress, [0.14, 0.92], ["50vh", "-100vh"]);

  // Fade in after curtain clears, fade out at end
  const contentOpacity = useTransform(progress, [0.14, 0.18, 0.88, 0.95], [0, 1, 1, 0]);

  // Boundary rule
  const ruleOpacity = useTransform(progress, [0.14, 0.18, 0.88, 0.95], [0, 0.14, 0.14, 0]);

  return (
    <>
      {/* ══════ CURTAINS ══════ */}
      <motion.div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 20,
          pointerEvents: "none",
          opacity: useTransform(progress, [0, 0.001, 0.16, 0.17], [0, 1, 1, 0]),
        }}
      >
        <motion.div
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: "50%", height: "100%",
            background: "#00ff88",
            willChange: "transform",
            y: useTransform(curtainY, (v) => `${v}%`),
            x: useTransform(curtainX, (v) => `${-v}%`),
          }}
        />
        <motion.div
          style={{
            position: "absolute",
            top: 0, left: "50%",
            width: "50%", height: "100%",
            background: "#00ff88",
            willChange: "transform",
            y: useTransform(curtainY, (v) => `${v}%`),
            x: useTransform(curtainX, (v) => `${v}%`),
          }}
        />
      </motion.div>

      {/* ══════ SCENE ══════ */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
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
            background: "linear-gradient(to bottom, transparent, var(--kona-accent), transparent)",
            opacity: ruleOpacity,
          }}
        />

        {/* ── Content column — single scrolling block ── */}
        <motion.div
          style={{
            position: "absolute",
            right: "4%",
            width: "50%",
            zIndex: 2,
            y: contentY,
            opacity: contentOpacity,
          }}
        >
          {/* Section label */}
          <div
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "var(--kona-accent)",
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ opacity: 0.5 }}>◆</span>
            <span>02 — The Blueprint</span>
          </div>

          {/* Headline */}
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                fontFamily: "var(--font-monument), sans-serif",
                fontSize: "clamp(24px, 3.4vw, 52px)",
                fontWeight: 200,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.88)",
                lineHeight: 1.1,
              }}
            >
              Not an agency.
            </div>
            <div
              style={{
                fontFamily: "var(--font-monument), sans-serif",
                fontSize: "clamp(24px, 3.4vw, 52px)",
                fontWeight: 800,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                color: "var(--kona-accent)",
                lineHeight: 1.1,
              }}
            >
              A creative partner.
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: "linear-gradient(to right, var(--kona-accent), rgba(0,255,136,0.1))",
              marginBottom: 28,
            }}
          />

          {/* Principles */}
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {PRINCIPLES.map((p) => (
              <PrincipleEntry
                key={p.num}
                num={p.num}
                label={p.label}
                claim={p.claim}
                text={p.text}
              />
            ))}
          </div>

          {/* Footer annotation */}
          <div
            style={{
              marginTop: 30,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: 9,
                letterSpacing: "0.22em",
                color: "rgba(255, 255, 255, 0.18)",
                textTransform: "uppercase",
              }}
            >
              Konaverse · Studio · Europe
            </span>
            <span
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: 9,
                letterSpacing: "0.22em",
                color: "rgba(0, 255, 136, 0.28)",
                textTransform: "uppercase",
              }}
            >
              Est. 2024
            </span>
          </div>
        </motion.div>
      </div>
    </>
  );
}
