"use client";

import { motion, MotionValue } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function MobileHeroContent({
  opacity,
  y,
}: {
  opacity: MotionValue<number>;
  y: MotionValue<number>;
}) {
  return (
    <motion.div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        paddingTop: "80px",
        paddingLeft: "24px",
        paddingRight: "24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        zIndex: 5,
        opacity,
        y,
        pointerEvents: "auto",
      }}
    >
      <h1 style={{ color: "white", textTransform: "uppercase", lineHeight: 1.05 }}>
        <span
          style={{
            fontFamily: "var(--font-rubik-glitch), sans-serif",
            fontSize: "clamp(24px, 7vw, 42px)",
            letterSpacing: "0.04em",
            display: "block",
          }}
        >
          Experience the
        </span>
        <span
          style={{
            fontFamily: "var(--font-rubik-glitch), sans-serif",
            fontSize: "clamp(36px, 12vw, 72px)",
            color: "#00ff88",
            letterSpacing: "0.02em",
            display: "block",
          }}
        >
          Digital Era
        </span>
      </h1>

      <p
        style={{
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "clamp(11px, 3vw, 14px)",
          color: "rgba(255,255,255,0.5)",
          lineHeight: 1.6,
          maxWidth: "360px",
          marginTop: "12px",
        }}
      >
        From concept to launch — websites, video production, and social media
        strategies that move your brand forward.
      </p>

      <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
        <Button href="/solutions" variant="primary" size="md">
          <span style={{ color: "#00ff88" }}>Solutions</span>
        </Button>
        <Button href="/projects" variant="secondary" size="md">
          View Work
        </Button>
      </div>
    </motion.div>
  );
}
