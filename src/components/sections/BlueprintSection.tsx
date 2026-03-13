"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useTransform, MotionValue } from "framer-motion";

// ─── Card Content ────────────────────────────────────────
const PRINCIPLES = [
  {
    label: "01_PHILOSOPHY",
    text: "We don't build websites. We architect digital ecosystems that convert visitors into believers.",
  },
  {
    label: "02_APPROACH",
    text: "Every pixel earns its place. Every interaction is designed to resonate. No templates. No shortcuts.",
  },
  {
    label: "03_COMMITMENT",
    text: "Small team. Direct collaboration. We treat your brand like our own because your success is ours.",
  },
];

// ─── SVG Blueprint Grid ─────────────────────────────────
function BlueprintGrid({ progress }: { progress: MotionValue<number> }) {
  const dashOffset = useTransform(progress, [0.15, 0.4], [1000, 0]);
  const gridOpacity = useTransform(progress, [0.15, 0.25, 0.85, 1.0], [0, 0.12, 0.12, 0]);

  return (
    <motion.svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: gridOpacity,
        pointerEvents: "none",
      }}
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
    >
      {[100, 200, 300, 400, 500].map((y) => (
        <motion.line
          key={`h-${y}`}
          x1="0" y1={y} x2="800" y2={y}
          stroke="var(--kona-accent)"
          strokeWidth="0.5"
          strokeDasharray="1000"
          style={{ strokeDashoffset: dashOffset }}
        />
      ))}
      {[100, 200, 400, 600, 700].map((x) => (
        <motion.line
          key={`v-${x}`}
          x1={x} y1="0" x2={x} y2="600"
          stroke="var(--kona-accent)"
          strokeWidth="0.5"
          strokeDasharray="1000"
          style={{ strokeDashoffset: dashOffset }}
        />
      ))}
      <motion.line
        x1="50" y1="550" x2="750" y2="50"
        stroke="var(--kona-accent)"
        strokeWidth="0.3"
        strokeDasharray="1000"
        style={{ strokeDashoffset: dashOffset }}
      />
    </motion.svg>
  );
}

// ─── Self-Drawing Border Card ────────────────────────────
function PrincipleCard({
  label,
  text,
  index,
  progress,
}: {
  label: string;
  text: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0, perimeter: 0 });

  useEffect(() => {
    if (cardRef.current) {
      const { width, height } = cardRef.current.getBoundingClientRect();
      setDims({ w: width, h: height, perimeter: 2 * (width + height) });
    }
  }, []);

  const start = 0.14 + index * 0.04;
  const borderEnd = start + 0.12;
  const contentStart = start + 0.06;
  const contentEnd = contentStart + 0.08;

  const dashOffset = useTransform(
    progress,
    [start, borderEnd],
    [dims.perimeter || 800, 0]
  );
  const contentOpacity = useTransform(progress, [contentStart, contentEnd], [0, 1]);

  return (
    <motion.div
      ref={cardRef}
      style={{
        position: "relative",
        padding: "24px 28px",
        background: "var(--grad-subtle)",
        y: useTransform(
          progress,
          [start, borderEnd, 0.85, 0.95],
          [30, 0, 0, -80]
        ),
        opacity: useTransform(
          progress,
          [start, start + 0.03, 0.85, 0.95],
          [0, 1, 1, 0]
        ),
        willChange: "transform, opacity",
      }}
    >
      {dims.w > 0 && (
        <svg
          width={dims.w}
          height={dims.h}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <motion.rect
            x="0.5" y="0.5"
            width={dims.w - 1} height={dims.h - 1}
            fill="none"
            stroke="var(--kona-accent)"
            strokeOpacity={0.4}
            strokeWidth="1"
            strokeDasharray={dims.perimeter}
            style={{ strokeDashoffset: dashOffset }}
          />
        </svg>
      )}

      <motion.div
        style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: "var(--kona-accent)",
          opacity: useTransform(progress, [contentStart, contentEnd], [0, 0.6]),
        }}
      />

      <motion.div style={{ opacity: contentOpacity }}>
        <div style={{
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: 10, fontWeight: 600, letterSpacing: "0.15em",
          color: "var(--kona-accent)", textTransform: "uppercase", marginBottom: 12,
        }}>
          {label}
        </div>
        <p style={{
          fontFamily: "var(--font-geist-sans), sans-serif",
          fontSize: 15, fontWeight: 300, lineHeight: 1.7,
          color: "var(--kona-text)", margin: 0,
        }}>
          {text}
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Blueprint Section ──────────────────────────────
interface BlueprintSectionProps {
  progress: MotionValue<number>;
  visible: boolean;
}

export default function BlueprintSection({ progress, visible }: BlueprintSectionProps) {
  // ── Curtain: rise up to cover viewport, then split open ──
  const curtainY = useTransform(progress, [0, 0.05], [100, 0]);
  const curtainX = useTransform(progress, [0.06, 0.14], [0, 105]);

  // ── Ghost "02" visible through the curtain gap ──
  const ghostOpacity = useTransform(progress, [0.04, 0.06, 0.12, 0.18], [0, 0.04, 0.04, 0]);

  // ── Section header ──
  const headerOpacity = useTransform(progress, [0.08, 0.12, 0.88, 0.95], [0, 1, 1, 0]);
  const headerY = useTransform(progress, [0.08, 0.12, 0.88, 0.95], [20, 0, 0, -40]);

  // ── Title ──
  const titleOpacity = useTransform(progress, [0.1, 0.14, 0.88, 0.95], [0, 1, 1, 0]);
  const titleY = useTransform(progress, [0.1, 0.14, 0.88, 0.95], [20, 0, 0, -40]);

  return (
    <>
      {/* ══════ CURTAINS — fixed, full viewport, covers everything ══════ */}
      <motion.div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 20,
          pointerEvents: "none",
          // Hide curtains entirely once they've fully opened
          opacity: useTransform(progress, [0, 0.001, 0.16, 0.17], [0, 1, 1, 0]),
        }}
      >
        {/* Left curtain */}
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
        {/* Right curtain */}
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

      {/* ══════ NEW WORLD — the Blueprint scene ══════ */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {/* Background is transparent — scene backdrop in home-page handles the world */}

        {/* Blueprint grid */}
        <BlueprintGrid progress={progress} />

        {/* Ghost "02" number */}
        <motion.div
          style={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            fontFamily: "var(--font-monument), sans-serif",
            fontSize: "clamp(120px, 20vw, 280px)",
            fontWeight: 900,
            color: "var(--kona-accent)",
            opacity: ghostOpacity,
            userSelect: "none",
            pointerEvents: "none",
            lineHeight: 1,
          }}
        >
          02
        </motion.div>

        {/* ── Content — right-aligned, architect stays on the left ── */}
        <div
          style={{
            position: "absolute",
            top: 0, bottom: 0, right: "5%",
            width: "55%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            gap: 24,
            zIndex: 2,
            paddingBottom: "6vh",
            paddingTop: "35vh",
          }}
        >
          <motion.div
            style={{
              opacity: headerOpacity, y: headerY,
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: 12, fontWeight: 500,
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: "var(--kona-accent)",
              willChange: "transform, opacity",
            }}
          >
            02 — The Blueprint
          </motion.div>

          <motion.h2
            style={{
              opacity: titleOpacity, y: titleY,
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontSize: "clamp(28px, 3.5vw, 48px)",
              fontWeight: 200, lineHeight: 1.2,
              color: "white", margin: 0,
              willChange: "transform, opacity",
            }}
          >
            Not an agency.
            <br />
            <span style={{ color: "#00ff88" }}>A creative partner.</span>
          </motion.h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 520 }}>
            {PRINCIPLES.map((p, i) => (
              <PrincipleCard
                key={p.label}
                label={p.label}
                text={p.text}
                index={i}
                progress={progress}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
