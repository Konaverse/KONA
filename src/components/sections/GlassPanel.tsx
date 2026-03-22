"use client";

import { useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";

const SPRING = { stiffness: 200, damping: 30, mass: 0.5 };

export default function GlassPanel({
  children,
  opacity,
  y,
  scale,
}: {
  children: React.ReactNode;
  opacity: MotionValue<number>;
  y?: MotionValue<number>;
  scale?: MotionValue<number>;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Raw mouse position (0-1 within panel)
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Smoothed for the glow
  const smoothX = useSpring(mouseX, SPRING);
  const smoothY = useSpring(mouseY, SPRING);

  // Glow position as CSS percentage
  const glowX = useTransform(smoothX, (v) => `${v * 100}%`);
  const glowY = useTransform(smoothY, (v) => `${v * 100}%`);

  // Border glow — angle from center to cursor
  const borderAngle = useTransform([smoothX, smoothY], ([x, y]: number[]) => {
    const angle = Math.atan2(y - 0.5, x - 0.5) * (180 / Math.PI) + 90;
    return `${angle}deg`;
  });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = panelRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={panelRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "absolute",
        top: "80px",
        right: "24px",
        bottom: "24px",
        left: "50%",
        borderRadius: "24px",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 40%, rgba(0,255,136,0.02) 100%)",
        backdropFilter: "blur(40px) saturate(1.4)",
        WebkitBackdropFilter: "blur(40px) saturate(1.4)",
        boxShadow: [
          "0 8px 32px rgba(0,0,0,0.4)",
          "0 32px 64px rgba(0,0,0,0.2)",
          "inset 0 1px 0 rgba(255,255,255,0.1)",
          "inset 0 -1px 0 rgba(255,255,255,0.02)",
          "inset 1px 0 0 rgba(255,255,255,0.05)",
          "inset -1px 0 0 rgba(255,255,255,0.03)",
          "inset 0 0 80px rgba(0,0,0,0.15)",
          "inset 0 0 120px rgba(0,255,136,0.02)",
        ].join(", "),
        opacity,
        y,
        scale,
        overflow: "hidden",
        zIndex: 5,
      }}
    >
      {/* Border light trace — conic gradient rotates toward cursor */}
      <motion.div
        style={{
          position: "absolute",
          inset: -1,
          borderRadius: "24px",
          background: useTransform(borderAngle, (a) =>
            `conic-gradient(from ${a}, rgba(255,255,255,0.25) 0deg, transparent 60deg, transparent 300deg, rgba(255,255,255,0.25) 360deg)`
          ),
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1px",
          pointerEvents: "none",
        }}
      />

      {/* Cursor-following radial glow */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "24px",
          background: useTransform(
            [glowX, glowY],
            ([x, y]: string[]) =>
              `radial-gradient(600px circle at ${x} ${y}, rgba(0,255,136,0.06) 0%, rgba(255,255,255,0.03) 30%, transparent 70%)`
          ),
          pointerEvents: "none",
        }}
      />

      {/* Inner edge highlight (static) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "24px",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 30%, transparent 80%, rgba(0,0,0,0.1) 100%)",
          pointerEvents: "none",
        }}
      />

      {children}
    </motion.div>
  );
}
