"use client";

import { motion } from "framer-motion";
import {
  sectionReveal,
  itemReveal,
  viewportConfig,
  sectionLabelStyle,
  sectionHeadingStyle,
  accentRuleStyle,
} from "./motion-presets";

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

export default function MobileBlueprintSection() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "80px 24px 64px",
      }}
    >
      {/* Subtle blueprint grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(0,255,136,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,255,136,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at 50% 30%, black 0%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, black 0%, transparent 70%)",
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />

      {/* Top accent border */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 24,
          right: 24,
          height: 1,
          background: "linear-gradient(to right, transparent, rgba(0,255,136,0.2), transparent)",
        }}
      />

      <motion.div
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        {/* Section label */}
        <motion.div variants={itemReveal} style={sectionLabelStyle}>
          <span style={{ opacity: 0.5 }}>◆</span>
          02 — The Blueprint
        </motion.div>

        {/* Headline */}
        <motion.div variants={itemReveal}>
          <div style={{ ...sectionHeadingStyle, marginBottom: 4 }}>
            Not an agency.
          </div>
          <div style={{ ...sectionHeadingStyle, color: "#00ff88" }}>
            A creative
            <br />
            partner.
          </div>
        </motion.div>

        {/* Accent rule */}
        <motion.div variants={itemReveal} style={accentRuleStyle} />

        {/* Principles */}
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 36 }}>
          {PRINCIPLES.map((p) => (
            <motion.div
              key={p.num}
              variants={itemReveal}
              style={{
                position: "relative",
                paddingLeft: 0,
              }}
            >
              {/* Ghost number */}
              <div
                style={{
                  fontFamily: "var(--font-monument), sans-serif",
                  fontSize: "clamp(48px, 14vw, 72px)",
                  fontWeight: 800,
                  color: "rgba(255,255,255,0.03)",
                  lineHeight: 1,
                  position: "absolute",
                  top: -12,
                  right: 0,
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                {p.num}
              </div>

              {/* Label */}
              <div
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: 9,
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  color: "#00ff88",
                  marginBottom: 8,
                }}
              >
                {p.label}
              </div>

              {/* Claim */}
              <div
                style={{
                  fontFamily: "var(--font-monument), sans-serif",
                  fontSize: "clamp(18px, 5vw, 26px)",
                  fontWeight: 800,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.9)",
                  lineHeight: 1.15,
                  whiteSpace: "pre-line",
                  marginBottom: 10,
                }}
              >
                {p.claim}
              </div>

              {/* Body */}
              <p
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "clamp(12px, 3.2vw, 14px)",
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.45)",
                  maxWidth: 360,
                }}
              >
                {p.text}
              </p>

              {/* Bottom separator */}
              <div
                style={{
                  marginTop: 20,
                  height: 1,
                  background: "linear-gradient(to right, rgba(0,255,136,0.15), transparent 80%)",
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Footer annotation */}
        <motion.div
          variants={itemReveal}
          style={{
            marginTop: 48,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: 9,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            Konaverse · Studio · Europe
          </span>
          <span
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: 9,
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.15)",
            }}
          >
            Est. 2024
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
