"use client";

import { motion, MotionValue } from "framer-motion";
import { Button } from "@/components/ui/button";

const EASE = [0.22, 1, 0.36, 1] as const;

interface DesktopHeroContentProps {
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  scale: MotionValue<number>;
  entranceComplete: boolean;
}

export default function DesktopHeroContent({
  opacity,
  y,
  scale,
}: DesktopHeroContentProps) {
  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        y,
        scale,
        pointerEvents: "none",
        zIndex: 5,
      }}
    >
      {/* Top-right content block */}
      <div
        style={{
          position: "absolute",
          top: "clamp(50px, 15vh, 100px)",
          right: "clamp(50px, 15vw, 150px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          pointerEvents: "auto",
          maxWidth: "calc(100vw - clamp(72px, 8vw, 128px))",
        }}
      >
        {/* Headline — continuous text, natural wrapping */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.9, ease: EASE }}
          style={{
            fontFamily: "var(--font-rubik-glitch), sans-serif",
            color: "white",
            textTransform: "uppercase",
            lineHeight: 1.05,
            margin: 0,
            textAlign: "left",
            letterSpacing: "0.02em",
            fontSize: "clamp(48px, 5vw, 96px)",
            maxWidth: "clamp(450px, 50vw, 900px)",
          }}
        >
          Experience the <br /> <span style={{ color: "#00ff88" }}>Digital Era</span>
        </motion.h1>

        {/* Description — left-aligned, below headline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease: EASE }}
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "clamp(12px, 0.9vw, 15px)",
            color: "rgba(255,255,255,0.4)",
            lineHeight: 1.8,
            textAlign: "left",
            alignSelf: "flex-start",
            margin: 0,
            maxWidth: 360,
            marginTop: 28,
          }}
        >
          Websites, video production, and social media
          <br />
          strategies — from concept to launch.
        </motion.p>

        {/* CTA buttons — left-aligned below description */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7, ease: EASE }}
          style={{
            display: "flex",
            gap: 14,
            marginTop: 24,
            alignSelf: "flex-start",
          }}
        >
          <Button href="/solutions" variant="primary" size="md">
            <span style={{ color: "#00ff88" }}>Solutions</span>
          </Button>
          <Button href="/projects" variant="secondary" size="md">
            View Work
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
