"use client";

import { motion } from "framer-motion";
import {
  sectionReveal,
  itemReveal,
  itemRevealFast,
  viewportConfig,
  sectionLabelStyle,
  sectionHeadingStyle,
  accentRuleStyle,
} from "./motion-presets";

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

const STATS = [
  { value: "12+", label: "FOUNDERS\nLAUNCHED" },
  { value: "3", label: "INDUSTRIES\nSERVED" },
  { value: "100%", label: "CLIENT\nRETENTION" },
];

export default function MobileClientsSection() {
  return (
    <section style={{ position: "relative", padding: "80px 24px 64px" }}>
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
          03 — The Clients
        </motion.div>

        {/* Headline */}
        <motion.div variants={itemReveal} style={{ ...sectionHeadingStyle, marginBottom: 8 }}>
          We build for
          <br />
          <span style={{ color: "#00ff88" }}>ambition.</span>
        </motion.div>

        <motion.div variants={itemReveal} style={accentRuleStyle} />
      </motion.div>

      {/* Stats row */}
      <motion.div
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          marginTop: 36,
          marginBottom: 40,
        }}
      >
        {STATS.map((stat) => (
          <motion.div
            key={stat.label}
            variants={itemRevealFast}
            style={{
              textAlign: "center",
              padding: "16px 8px",
              background: "rgba(0,255,136,0.03)",
              border: "1px solid rgba(0,255,136,0.08)",
              borderRadius: 6,
            }}
          >
            {/* Glowing dot */}
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#00ff88",
                boxShadow: "0 0 8px rgba(0,255,136,0.5)",
                margin: "0 auto 10px",
              }}
            />
            <div
              style={{
                fontFamily: "var(--font-monument), sans-serif",
                fontSize: "clamp(22px, 6vw, 32px)",
                fontWeight: 800,
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1,
                marginBottom: 6,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: 8,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                lineHeight: 1.5,
                whiteSpace: "pre-line",
              }}
            >
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Client archetype cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {CARDS.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
            style={{
              padding: "24px 20px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(0,255,136,0.1)",
              borderRadius: 8,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Subtle top-left corner accent */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 24,
                height: 1,
                background: "#00ff88",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 1,
                height: 24,
                background: "#00ff88",
              }}
            />

            {/* Archetype label */}
            <div
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: 9,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "#00ff88",
                marginBottom: 10,
              }}
            >
              {card.label}
            </div>

            {/* Title */}
            <div
              style={{
                fontFamily: "var(--font-monument), sans-serif",
                fontSize: "clamp(20px, 5.5vw, 28px)",
                fontWeight: 800,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1.1,
                marginBottom: 12,
              }}
            >
              {card.title}
            </div>

            {/* Description */}
            <p
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: "clamp(12px, 3.2vw, 14px)",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.45)",
                marginBottom: 16,
              }}
            >
              {card.desc}
            </p>

            {/* Traits */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {card.traits.map((trait) => (
                <div
                  key={trait}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: "clamp(11px, 2.8vw, 13px)",
                    lineHeight: 1.5,
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  <span
                    style={{
                      color: "#00ff88",
                      fontSize: 7,
                      marginTop: 4,
                      flexShrink: 0,
                    }}
                  >
                    ◆
                  </span>
                  {trait}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
