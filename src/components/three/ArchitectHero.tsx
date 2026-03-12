"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroHUD from "./HeroHUD";
import type { HoveredCardState } from "./SceneManager";

// ─── Door overlay ─────────────────────────────────────────────
function DoorOverlay({ onComplete }: { onComplete: () => void }) {
  const leftGlowRef = useRef<HTMLDivElement>(null);
  const rightGlowRef = useRef<HTMLDivElement>(null);
  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<number | null>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    let rafId: number;
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = (now - startRef.current) / 1000;
      if (elapsed >= 1 && elapsed < 2.5) {
        const t = (elapsed - 1) / 1.5;
        const style = { height: `${Math.min(t * 2, 1) * 100}%`, width: `${1 + t * 11}px`, opacity: "1", boxShadow: `0 0 ${10 + t * 40}px rgba(0,255,136,${0.3 + t * 0.7}), 0 0 ${(10 + t * 40) * 2.5}px rgba(0,255,136,${(0.3 + t * 0.7) * 0.3})` };
        if (leftGlowRef.current) Object.assign(leftGlowRef.current.style, style);
        if (rightGlowRef.current) Object.assign(rightGlowRef.current.style, style);
      }
      if (elapsed >= 2.5 && elapsed < 4.5) {
        const t = (elapsed - 2.5) / 2;
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        if (leftDoorRef.current) leftDoorRef.current.style.transform = `translateX(-${eased * 100}%)`;
        if (rightDoorRef.current) rightDoorRef.current.style.transform = `translateX(${eased * 100}%)`;
        const glowStyle = { opacity: `${1 - eased}`, boxShadow: `0 0 ${50 * (1-eased)}px rgba(0,255,136,${1-eased}), 0 0 ${50 * (1-eased) * 2.5}px rgba(0,255,136,${(1-eased) * 0.3})` };
        if (leftGlowRef.current) Object.assign(leftGlowRef.current.style, glowStyle);
        if (rightGlowRef.current) Object.assign(rightGlowRef.current.style, glowStyle);
      }
      if (elapsed >= 4.5 && !doneRef.current) { doneRef.current = true; onComplete(); return; }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [onComplete]);

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none", overflow: "hidden" }}>
      <div ref={leftDoorRef} style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "50%", background: "#000000", willChange: "transform" }}>
        <div ref={leftGlowRef} style={{ position: "absolute", top: "50%", right: 0, transform: "translateY(-50%)", width: 0, height: 0, background: "#00ff88", borderRadius: 2, opacity: 0 }} />
      </div>
      <div ref={rightDoorRef} style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "50%", background: "#000000", willChange: "transform" }}>
        <div ref={rightGlowRef} style={{ position: "absolute", top: "50%", left: 0, transform: "translateY(-50%)", width: 0, height: 0, background: "#00ff88", borderRadius: 2, opacity: 0 }} />
      </div>
    </div>
  );
}

export default function ArchitectHero({ 
  onEntranceComplete,
  hoveredCard,
  onHoverCard,
  headPosition
}: { 
  onEntranceComplete?: () => void;
  hoveredCard: HoveredCardState | null;
  onHoverCard: (card: HoveredCardState | null) => void;
  headPosition: { x: number, y: number };
}) {
  const [doorsVisible, setDoorsVisible] = useState(true);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", background: "transparent", overflow: "hidden" }}>
      {doorsVisible && <DoorOverlay onComplete={() => { setDoorsVisible(false); onEntranceComplete?.(); }} />}
      
      {/* Neural Link Overlay */}
      <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none" }}>
        <AnimatePresence>
          {hoveredCard && headPosition.x !== 0 && (
            <motion.svg initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ width: "100%", height: "100%" }}>
              <motion.line x1={headPosition.x} y1={headPosition.y} x2={hoveredCard.x} y2={hoveredCard.y} stroke="#00ff88" strokeWidth={1} strokeOpacity={0.6} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, ease: "easeOut" }} />
              <motion.line x1={headPosition.x} y1={headPosition.y} x2={hoveredCard.x} y2={hoveredCard.y} stroke="#00ff88" strokeWidth={3} strokeOpacity={0.3} style={{ filter: "blur(2px)" }} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, ease: "easeOut" }} />
              <motion.circle r={2} fill="#ffffff" style={{ filter: "blur(1px)" }} animate={{ cx: [headPosition.x, hoveredCard.x], cy: [headPosition.y, hoveredCard.y], opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
            </motion.svg>
          )}
        </AnimatePresence>
      </div>

      <HeroHUD visible={!doorsVisible} onHoverCard={(id, rect) => {
        if (id && rect) { onHoverCard({ id, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }); }
        else { onHoverCard(null); }
      }} />
    </div>
  );
}
