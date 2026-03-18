"use client";

import { motion } from "framer-motion";

// ── CSS keyframes — two independent jitter phases for layered noise feel ──────
const STYLES = `
  @keyframes staticJitter {
    0%   { transform: translateX(0px) }
    14%  { transform: translateX(6px) }
    28%  { transform: translateX(-4px) }
    43%  { transform: translateX(7px) }
    57%  { transform: translateX(-5px) }
    71%  { transform: translateX(3px) }
    86%  { transform: translateX(-2px) }
    100% { transform: translateX(0px) }
  }
  @keyframes staticJitterB {
    0%   { transform: translateX(0px) }
    14%  { transform: translateX(-5px) }
    28%  { transform: translateX(4px) }
    43%  { transform: translateX(-7px) }
    57%  { transform: translateX(5px) }
    71%  { transform: translateX(-3px) }
    86%  { transform: translateX(2px) }
    100% { transform: translateX(0px) }
  }
`;

interface ChannelSwitchProps {
  active: boolean;
}

/**
 * Full-screen TV static flash rendered at the exact moment an act threshold
 * is crossed. The parent drives `active` true for ~300ms then false — by
 * that time the opacity keyframe has already reached zero so the unmount
 * is imperceptible.
 *
 * z-index: 18 — above act content (z:2-10), below entry curtain (z:20).
 */
export default function ChannelSwitch({ active }: ChannelSwitchProps) {
  if (!active) return null;

  return (
    <>
      <style>{STYLES}</style>

      <motion.div
        // Opacity envelope: snap in → hold → decay
        // times align to: 0ms | 12ms | 80ms | 190ms | 290ms
        animate={{ opacity: [0, 0.92, 0.75, 0.28, 0] }}
        transition={{ duration: 0.30, times: [0, 0.04, 0.27, 0.65, 1], ease: "linear" }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 18,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {/* Layer 1 — fine green scanlines, jitter A */}
        <div
          style={{
            position: "absolute",
            inset: "-6%",
            backgroundImage:
              "repeating-linear-gradient(transparent 0px, transparent 2px, rgba(0,255,136,0.10) 2px, rgba(0,255,136,0.10) 3px)",
            animation: "staticJitter 0.30s steps(6) 1 both",
          }}
        />

        {/* Layer 2 — coarser white scanlines, jitter B (anti-phase) */}
        <div
          style={{
            position: "absolute",
            inset: "-6%",
            backgroundImage:
              "repeating-linear-gradient(transparent 0px, transparent 1px, rgba(255,255,255,0.045) 1px, rgba(255,255,255,0.045) 2px)",
            animation: "staticJitterB 0.30s steps(6) 1 both",
          }}
        />

        {/* Layer 3 — overall brightness pulse */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,255,136,0.06)",
          }}
        />
      </motion.div>
    </>
  );
}
