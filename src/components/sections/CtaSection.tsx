"use client";

import {
  motion,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { Button } from "@/components/ui/button";

import {
  CTA_FADE_IN_0,
  CTA_FADE_IN_1,
  CTA_FADE_OUT_0,
  CTA_FADE_OUT_1,
} from "./cta-timing";

// Re-export timing so callers can import from here if needed
export * from "./cta-timing";

// ── Types ───────────────────────────────────────────────────────────────────
interface CtaSectionProps {
  progress: MotionValue<number>;
  visible: boolean;
}

// ── Main component ──────────────────────────────────────────────────────────
export default function CtaSection({ progress, visible }: CtaSectionProps) {
  const contentOpacity = useTransform(
    progress,
    [CTA_FADE_IN_0, CTA_FADE_IN_1, CTA_FADE_OUT_0, CTA_FADE_OUT_1],
    [0, 1, 1, 0]
  );

  const contentY = useTransform(
    progress,
    [CTA_FADE_IN_0, CTA_FADE_IN_1],
    [30, 0]
  );

  if (!visible) return null;

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        opacity: contentOpacity,
        pointerEvents: "none",
      }}
    >
      {/* Content positioned on the right side (architect is on the left) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "55%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingLeft: "5%",
          paddingRight: "8%",
          zIndex: 1,
        }}
      >
        <motion.div
          style={{
            y: contentY,
            willChange: "transform",
          }}
        >
          {/* ── Section label ── */}
          <div
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#00ff88",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ opacity: 0.5 }}>◆</span>
            06 — Contact
          </div>

          {/* ── Title ── */}
          <div
            style={{
              fontFamily: "var(--font-monument), sans-serif",
              fontSize: "clamp(28px, 4.5vw, 64px)",
              fontWeight: 800,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.95)",
              lineHeight: 1.1,
              marginBottom: 24,
            }}
          >
            Let&apos;s Build
            <br />
            <span style={{ color: "#00ff88" }}>Together.</span>
          </div>

          {/* ── Subtitle ── */}
          <p
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "clamp(12px, 1.1vw, 15px)",
              lineHeight: 1.7,
              color: "rgba(255, 255, 255, 0.5)",
              maxWidth: 440,
              marginBottom: 40,
            }}
          >
            Ready to bring your vision to life? Get in touch and let&apos;s
            start a conversation.
          </p>

          {/* ── CTA Button — same style as navbar "Get a Quote", scaled up ── */}
          <div style={{ pointerEvents: "auto" }}>
            <Button href="/contact" size="lg" className="!border-[#00ff88]/40">
              <span style={{ color: "#00ff88" }}>Get a Quote</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
