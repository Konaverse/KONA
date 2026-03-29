"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  sectionReveal,
  itemReveal,
  viewportConfig,
  sectionLabelStyle,
  sectionHeadingStyle,
  accentRuleStyle,
} from "./motion-presets";

export default function MobileCtaSection() {
  return (
    <section
      style={{
        position: "relative",
        padding: "80px 24px 80px",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      {/* Radial green glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "120%",
          height: "100%",
          background: "radial-gradient(ellipse, rgba(0,255,136,0.03) 0%, transparent 60%)",
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
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Section label */}
        <motion.div
          variants={itemReveal}
          style={{ ...sectionLabelStyle, justifyContent: "center" }}
        >
          <span style={{ opacity: 0.5 }}>◆</span>
          06 — Contact
        </motion.div>

        {/* Headline */}
        <motion.div variants={itemReveal}>
          <div
            style={{
              ...sectionHeadingStyle,
              fontSize: "clamp(32px, 9vw, 52px)",
              textAlign: "center",
            }}
          >
            Let&apos;s Build
            <br />
            <span style={{ color: "#00ff88" }}>Together.</span>
          </div>
        </motion.div>

        <motion.div
          variants={itemReveal}
          style={{ ...accentRuleStyle, margin: "18px auto" }}
        />

        {/* Subtitle */}
        <motion.p
          variants={itemReveal}
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "clamp(12px, 3.2vw, 14px)",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.45)",
            maxWidth: 340,
            marginBottom: 32,
            textAlign: "center",
          }}
        >
          Ready to bring your vision to life? Get in touch and let&apos;s start
          a conversation.
        </motion.p>

        {/* CTA Button */}
        <motion.div variants={itemReveal}>
          <Button href="/contact" size="lg" className="!border-[#00ff88]/40">
            <span style={{ color: "#00ff88" }}>Get a Quote</span>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
