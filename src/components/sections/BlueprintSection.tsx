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
  index,
  progress,
}: {
  num: string;
  label: string;
  claim: string;
  text: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const start = 0.28 + index * 0.07;
  const end = start + 0.08;

  const opacity = useTransform(progress, [start, end, 0.87, 0.94], [0, 1, 1, 0]);
  const y = useTransform(progress, [start, end], [22, 0]);
  const lineScaleX = useTransform(progress, [start, start + 0.05], [0, 1]);

  return (
    <motion.div
      style={{
        position: "relative",
        opacity,
        y,
        willChange: "transform, opacity",
      }}
    >
      {/* Hairline above */}
      <motion.div
        style={{
          height: 1,
          background: "var(--kona-accent)",
          scaleX: lineScaleX,
          transformOrigin: "left center",
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

          {/* Bold claim — the memorable hook */}
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
    </motion.div>
  );
}

// ─── Blueprint Grid (unchanged) ───────────────────────────
function BlueprintGrid({ progress }: { progress: MotionValue<number> }) {
  const dashOffset = useTransform(progress, [0.15, 0.4], [1000, 0]);
  const gridOpacity = useTransform(progress, [0.15, 0.25, 0.85, 1.0], [0, 0.08, 0.08, 0]);

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

  // Section label
  const headerOpacity = useTransform(progress, [0.10, 0.14, 0.88, 0.95], [0, 1, 1, 0]);
  const headerY = useTransform(progress, [0.10, 0.14], [14, 0]);

  // Title line 1 — thin weight
  const t1Opacity = useTransform(progress, [0.13, 0.18, 0.88, 0.95], [0, 1, 1, 0]);
  const t1X = useTransform(progress, [0.13, 0.18], [-28, 0]);

  // Title line 2 — bold green
  const t2Opacity = useTransform(progress, [0.17, 0.22, 0.88, 0.95], [0, 1, 1, 0]);
  const t2X = useTransform(progress, [0.17, 0.22], [-28, 0]);

  // Divider hairline
  const divOpacity = useTransform(progress, [0.22, 0.26, 0.88, 0.95], [0, 1, 1, 0]);
  const divScaleX = useTransform(progress, [0.22, 0.30], [0, 1]);

  // Bottom annotation
  const footerOpacity = useTransform(progress, [0.56, 0.62, 0.88, 0.95], [0, 1, 1, 0]);

  // Boundary rule
  const ruleOpacity = useTransform(progress, [0.10, 0.14, 0.88, 0.95], [0, 0.14, 0.14, 0]);

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
        {/* Subtle blueprint grid */}
        <BlueprintGrid progress={progress} />

        {/* Vertical boundary rule at the left edge of the content zone */}
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

        {/* ── Content column (right ~52%) ── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: "4%",
            width: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            zIndex: 2,
            paddingTop: "10vh",
            paddingBottom: "6vh",
            gap: 0,
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
              marginBottom: 24,
              willChange: "transform, opacity",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ opacity: 0.5 }}>◆</span>
            <span>02 — The Blueprint</span>
          </motion.div>

          {/* Headline: counter-weight contrast */}
          <div style={{ marginBottom: 28 }}>
            <motion.div
              style={{
                opacity: t1Opacity,
                x: t1X,
                fontFamily: "var(--font-monument), sans-serif",
                fontSize: "clamp(24px, 3.4vw, 52px)",
                fontWeight: 200,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.88)",
                lineHeight: 1.1,
                willChange: "transform, opacity",
              }}
            >
              Not an agency.
            </motion.div>
            <motion.div
              style={{
                opacity: t2Opacity,
                x: t2X,
                fontFamily: "var(--font-monument), sans-serif",
                fontSize: "clamp(24px, 3.4vw, 52px)",
                fontWeight: 800,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                color: "var(--kona-accent)",
                lineHeight: 1.1,
                willChange: "transform, opacity",
              }}
            >
              A creative partner.
            </motion.div>
          </div>

          {/* Divider — scans left to right */}
          <motion.div
            style={{
              height: 1,
              background: "linear-gradient(to right, var(--kona-accent), rgba(0,255,136,0.1))",
              opacity: divOpacity,
              scaleX: divScaleX,
              transformOrigin: "left center",
              marginBottom: 28,
              willChange: "transform, opacity",
            }}
          />

          {/* Principles */}
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {PRINCIPLES.map((p, i) => (
              <PrincipleEntry
                key={p.num}
                num={p.num}
                label={p.label}
                claim={p.claim}
                text={p.text}
                index={i}
                progress={progress}
              />
            ))}
          </div>

          {/* Footer annotation */}
          <motion.div
            style={{
              opacity: footerOpacity,
              marginTop: 30,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              willChange: "opacity",
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
          </motion.div>
        </div>
      </div>
    </>
  );
}
