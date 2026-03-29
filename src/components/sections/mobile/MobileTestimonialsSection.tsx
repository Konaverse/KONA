"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  sectionReveal,
  itemReveal,
  viewportConfig,
  sectionLabelStyle,
  sectionHeadingStyle,
  accentRuleStyle,
  BRAND_EASE,
} from "./motion-presets";

const TESTIMONIALS = [
  {
    id: "t1",
    quote: "KONA transformed our digital presence completely. The results speak for themselves.",
    author: "Alex M.",
    role: "CEO, TechStart",
  },
  {
    id: "t2",
    quote: "Working with KONA felt like having a creative partner, not just an agency.",
    author: "Sarah K.",
    role: "Marketing Director, Bloom",
  },
  {
    id: "t3",
    quote: "They delivered beyond our expectations — on time and with incredible attention to detail.",
    author: "James R.",
    role: "Founder, Vortex Labs",
  },
  {
    id: "t4",
    quote: "The website they built for us became our best-performing sales channel overnight.",
    author: "Maria L.",
    role: "COO, GreenPath",
  },
  {
    id: "t5",
    quote: "KONA doesn't just build websites, they build experiences. Truly next-level work.",
    author: "David C.",
    role: "Creative Director, Neon Studios",
  },
];

const SWIPE_THRESHOLD = 50;

export default function MobileTestimonialsSection() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isInView, setIsInView] = useState(false);

  const goTo = useCallback(
    (next: number) => {
      setDirection(next > active ? 1 : -1);
      setActive(next);
    },
    [active],
  );

  // Auto-play when in view
  useEffect(() => {
    if (!isInView) return;
    const timer = setInterval(() => {
      setDirection(1);
      setActive((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isInView, active]);

  // Touch swipe
  const [touchStart, setTouchStart] = useState(0);

  return (
    <section
      style={{
        position: "relative",
        padding: "80px 24px 64px",
        overflow: "hidden",
      }}
    >
      {/* Subtle star-like dots */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.15) 50%, transparent 50%), radial-gradient(1px 1px at 60% 60%, rgba(255,255,255,0.1) 50%, transparent 50%), radial-gradient(1px 1px at 80% 20%, rgba(255,255,255,0.12) 50%, transparent 50%), radial-gradient(1px 1px at 40% 80%, rgba(255,255,255,0.08) 50%, transparent 50%)",
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
        onViewportEnter={() => setIsInView(true)}
        onViewportLeave={() => setIsInView(false)}
      >
        {/* Section label */}
        <motion.div variants={itemReveal} style={sectionLabelStyle}>
          <span style={{ opacity: 0.5 }}>◆</span>
          05 — Testimonials
        </motion.div>

        {/* Headline */}
        <motion.div variants={itemReveal}>
          <div style={{ ...sectionHeadingStyle, marginBottom: 4 }}>
            What They
          </div>
          <div style={{ ...sectionHeadingStyle, color: "#00ff88" }}>
            Say.
          </div>
        </motion.div>

        <motion.div variants={itemReveal} style={accentRuleStyle} />
      </motion.div>

      {/* Carousel */}
      <div
        style={{ marginTop: 36, position: "relative", minHeight: 220 }}
        onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const diff = touchStart - e.changedTouches[0].clientX;
          if (Math.abs(diff) > SWIPE_THRESHOLD) {
            if (diff > 0 && active < TESTIMONIALS.length - 1) goTo(active + 1);
            if (diff < 0 && active > 0) goTo(active - 1);
          }
        }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={TESTIMONIALS[active].id}
            custom={direction}
            initial={{ opacity: 0, x: direction >= 0 ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction >= 0 ? -40 : 40 }}
            transition={{ duration: 0.35, ease: BRAND_EASE }}
            style={{
              padding: "28px 22px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(0,255,136,0.12)",
              borderRadius: 10,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Top-left green corner */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 20,
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
                height: 20,
                background: "#00ff88",
              }}
            />
            {/* Bottom-right green corner */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 20,
                height: 1,
                background: "rgba(0,255,136,0.4)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 1,
                height: 20,
                background: "rgba(0,255,136,0.4)",
              }}
            />

            {/* Quote mark */}
            <div
              style={{
                fontFamily: "var(--font-monument), sans-serif",
                fontSize: 48,
                color: "rgba(0,255,136,0.15)",
                lineHeight: 1,
                marginBottom: -8,
                userSelect: "none",
              }}
            >
              &ldquo;
            </div>

            {/* Quote */}
            <p
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: "clamp(15px, 4vw, 18px)",
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.8)",
                marginBottom: 20,
                fontStyle: "italic",
              }}
            >
              {TESTIMONIALS[active].quote}
            </p>

            {/* Author */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Green dot avatar placeholder */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "rgba(0,255,136,0.1)",
                  border: "1px solid rgba(0,255,136,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-monument), sans-serif",
                  fontSize: 12,
                  fontWeight: 800,
                  color: "#00ff88",
                }}
              >
                {TESTIMONIALS[active].author.charAt(0)}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-geist-sans), sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  {TESTIMONIALS[active].author}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: 10,
                    letterSpacing: "0.15em",
                    color: "rgba(255,255,255,0.35)",
                    textTransform: "uppercase",
                  }}
                >
                  {TESTIMONIALS[active].role}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot pagination */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          marginTop: 24,
        }}
      >
        {TESTIMONIALS.map((t, i) => (
          <button
            key={t.id}
            onClick={() => goTo(i)}
            aria-label={`Go to testimonial ${i + 1}`}
            style={{
              width: i === active ? 24 : 8,
              height: 8,
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
              background: i === active ? "#00ff88" : "rgba(255,255,255,0.15)",
              boxShadow: i === active ? "0 0 10px rgba(0,255,136,0.4)" : "none",
              transition: "all 0.3s ease",
              padding: 0,
            }}
          />
        ))}
      </div>
    </section>
  );
}
