"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  sectionReveal,
  itemReveal,
  viewportConfig,
  sectionLabelStyle,
  sectionHeadingStyle,
  accentRuleStyle,
  BRAND_EASE,
} from "./motion-presets";

// ── Data ──
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
    accent: "#00ff88",
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
    accent: "#00ddcc",
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
    accent: "#88ffcc",
  },
];

const STATS = [
  { value: 12, suffix: "+", label: "Founders\nLaunched" },
  { value: 3, suffix: "", label: "Industries\nServed" },
  { value: 100, suffix: "%", label: "Client\nRetention" },
];

// ── Animated rolling counter ──
function AnimatedCounter({
  value,
  suffix,
  inView,
}: {
  value: number;
  suffix: string;
  inView: boolean;
}) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * value);
      setDisplayed(current);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <span>
      {displayed}
      {suffix}
    </span>
  );
}

// ── Sticky stacking card ──
function StackCard({
  card,
  index,
  total,
  scrollYProgress,
}: {
  card: typeof CARDS[number];
  index: number;
  total: number;
  scrollYProgress: any;
}) {
  // Each card scales down slightly as the next card arrives
  const scaleRange = [
    index / total,
    (index + 1) / total,
  ];
  const scale = useTransform(
    scrollYProgress,
    scaleRange,
    [1, index < total - 1 ? 0.93 : 1]
  );
  const brightness = useTransform(
    scrollYProgress,
    scaleRange,
    [1, index < total - 1 ? 0.6 : 1]
  );

  return (
    <motion.div
      style={{
        position: "sticky",
        top: 100 + index * 28,
        scale,
        transformOrigin: "top center",
        zIndex: index,
        marginBottom: index < total - 1 ? -16 : 0,
      }}
    >
      <motion.div
        style={{
          filter: useTransform(brightness, (v) => `brightness(${v})`),
          padding: "28px 22px",
          background: `linear-gradient(135deg, rgba(${index * 20},${30 + index * 10},${20 + index * 5},0.4) 0%, rgba(0,0,0,0.85) 100%)`,
          border: `1px solid ${card.accent}22`,
          borderRadius: 14,
          backdropFilter: "blur(12px)",
          boxShadow: `0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 ${card.accent}15`,
          minHeight: 260,
        }}
      >
        {/* Top edge glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "10%",
            right: "10%",
            height: 1,
            background: `linear-gradient(to right, transparent, ${card.accent}44, transparent)`,
            borderRadius: "0 0 50% 50%",
          }}
        />

        {/* Card number + label row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div
            style={{
              fontFamily: "var(--font-monument), sans-serif",
              fontSize: 42,
              fontWeight: 800,
              color: `${card.accent}18`,
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            0{index + 1}
          </div>
          <div
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: 9,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: card.accent,
              opacity: 0.8,
            }}
          >
            {card.label}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontFamily: "var(--font-monument), sans-serif",
            fontSize: "clamp(22px, 6vw, 30px)",
            fontWeight: 800,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.95)",
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
            color: "rgba(255,255,255,0.5)",
            marginBottom: 18,
          }}
        >
          {card.desc}
        </p>

        {/* Traits */}
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {card.traits.map((trait) => (
            <div
              key={trait}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: "clamp(11px, 2.8vw, 13px)",
                lineHeight: 1.4,
                color: "rgba(255,255,255,0.65)",
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 1,
                  background: card.accent,
                  opacity: 0.5,
                  flexShrink: 0,
                }}
              />
              {trait}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main section ──
export default function MobileClientsSection() {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });

  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ["start start", "end end"],
  });

  return (
    <section style={{ position: "relative" }}>
      {/* Section header + stats */}
      <div style={{ padding: "80px 24px 40px" }}>
        {/* Top accent border */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 24,
            right: 24,
            height: 1,
            background:
              "linear-gradient(to right, transparent, rgba(0,255,136,0.2), transparent)",
          }}
        />

        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <motion.div variants={itemReveal} style={sectionLabelStyle}>
            <span style={{ opacity: 0.5 }}>&#9670;</span>
            03 — The Clients
          </motion.div>

          <motion.div
            variants={itemReveal}
            style={{ ...sectionHeadingStyle, marginBottom: 8 }}
          >
            We build for
            <br />
            <span style={{ color: "#00ff88" }}>ambition.</span>
          </motion.div>

          <motion.div variants={itemReveal} style={accentRuleStyle} />
        </motion.div>

        {/* Animated stats row */}
        <div
          ref={statsRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
            marginTop: 36,
          }}
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease: BRAND_EASE, delay: i * 0.1 }}
              style={{
                textAlign: "center",
                padding: "20px 8px 16px",
                position: "relative",
              }}
            >
              {/* Animated vertical line accent */}
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: BRAND_EASE, delay: 0.3 + i * 0.15 }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  width: 1,
                  height: 10,
                  background: "#00ff88",
                  transformOrigin: "top",
                  boxShadow: "0 0 6px rgba(0,255,136,0.4)",
                }}
              />

              <div
                style={{
                  fontFamily: "var(--font-monument), sans-serif",
                  fontSize: "clamp(28px, 8vw, 40px)",
                  fontWeight: 800,
                  color: "#00ff88",
                  lineHeight: 1,
                  marginBottom: 8,
                  textShadow: "0 0 20px rgba(0,255,136,0.3)",
                }}
              >
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  inView={statsInView}
                />
              </div>
              <div
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: 9,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.4)",
                  lineHeight: 1.5,
                  whiteSpace: "pre-line",
                }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          style={{
            textAlign: "center",
            marginTop: 32,
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 9,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)",
          }}
        >
          scroll to explore ↓
        </motion.div>
      </div>

      {/* Sticky stacking cards — needs scroll height to work */}
      <div
        ref={stackRef}
        style={{
          position: "relative",
          padding: "0 20px 120px",
          // Give enough scroll room for the stacking effect:
          // each card needs ~50vh of scroll to reveal the next
          minHeight: `${CARDS.length * 55}vh`,
        }}
      >
        {CARDS.map((card, i) => (
          <StackCard
            key={card.title}
            card={card}
            index={i}
            total={CARDS.length}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
}
