"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import ArchitectHero from "@/components/three/ArchitectHero";
import SceneManager from "@/components/three/SceneManager";
import CylinderNav from "@/components/layout/CylinderNav";
import ParticleField from "@/components/effects/ParticleField";
import BlueprintSection from "@/components/sections/BlueprintSection";
import type { HoveredCardState } from "@/components/three/SceneManager";


export default function HomePage() {
  const [entranceComplete, setEntranceComplete] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Lifted state for 3D interactions
  const [hoveredCard, setHoveredCard] = useState<HoveredCardState | null>(null);
  const [headPosition, setHeadPosition] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // ── Welcome Text position (finalized) ──
  const welcomeTop = 44;        // vh
  const welcomeScrollStart = 20; // scrollYProgress %
  const welcomeScrollEnd = 29;   // scrollYProgress %

  // Force scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll tracking scoped to the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Hero progress: maps 0→0.33 of total scroll to 0→1
  const heroProgress = useTransform(scrollYProgress, [0, 0.33], [0, 1]);
  const smoothedProgress = useSpring(heroProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Blueprint progress: starts at 0.30 (~13.5% gap after hero video completes at ~0.165)
  const blueprintProgress = useTransform(scrollYProgress, [0.30, 0.66], [0, 1]);
  const smoothedBlueprint = useSpring(blueprintProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // ── Scene environment: swap instantly behind the curtain ──
  // curtains fully closed at blueprintProgress ~0.05 — we use 0.06 as the threshold
  const [behindCurtain, setBehindCurtain] = useState(false);

  useMotionValueEvent(smoothedBlueprint, "change", (val) => {
    if (val >= 0.06 && !behindCurtain) setBehindCurtain(true);
    if (val < 0.06 && behindCurtain) setBehindCurtain(false);
  });

  // ── Welcome text animations (driven by debug values) ──
  const welcomeAppear = welcomeScrollStart / 100;
  const welcomeMid = (welcomeScrollStart + 3) / 100;
  const welcomeFull = (welcomeScrollStart + 6) / 100;
  const welcomeFadeStart = welcomeScrollEnd / 100;
  const welcomeFadeEnd = (welcomeScrollEnd + 3) / 100;

  const lineScaleX = useTransform(scrollYProgress, [welcomeAppear, welcomeMid], [0, 1]);
  const lineOpacity = useTransform(scrollYProgress, [welcomeAppear, welcomeAppear + 0.02, welcomeFadeStart, welcomeFadeEnd], [0, 1, 1, 0]);
  const topTextY = useTransform(scrollYProgress, [welcomeAppear + 0.02, welcomeFull], [0, -32]);
  const topTextOpacity = useTransform(scrollYProgress, [welcomeAppear + 0.02, welcomeMid, welcomeFadeStart, welcomeFadeEnd], [0, 1, 1, 0]);
  const bottomTextY = useTransform(scrollYProgress, [welcomeMid, welcomeFull], [0, 28]);
  const bottomTextOpacity = useTransform(scrollYProgress, [welcomeMid, welcomeFull, welcomeFadeStart, welcomeFadeEnd], [0, 1, 1, 0]);

  // Update activeIndex based on scroll position
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest >= 0.33 && activeIndex !== 1) {
      setActiveIndex(1);
    } else if (latest < 0.33 && activeIndex !== 0) {
      setActiveIndex(0);
    }
  });

  return (
    <>
      {/* ══════ WELCOME TEXT — fixed overlay, scroll-driven ══════ */}
      <div
        style={{
          position: "fixed",
          top: `${welcomeTop}vh`,
          left: "50%",
          right: "5%",
          zIndex: 15,
          display: "flex",
          justifyContent: "flex-start",
          pointerEvents: "none",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <motion.div
            style={{
              opacity: topTextOpacity,
              y: topTextY,
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "clamp(12px, 1.5vw, 16px)",
              fontWeight: 400,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.6)",
              marginBottom: 12,
            }}
          >
            Welcome to
          </motion.div>

          <motion.div
            style={{
              width: "clamp(200px, 30vw, 400px)",
              height: 1,
              background: "#00ff88",
              scaleX: lineScaleX,
              opacity: lineOpacity,
              boxShadow: "0 0 20px rgba(0, 255, 136, 0.4)",
            }}
          />

          <motion.div
            style={{
              opacity: bottomTextOpacity,
              y: bottomTextY,
              fontFamily: "var(--font-monument), sans-serif",
              fontSize: "clamp(32px, 6vw, 72px)",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#00ff88",
              marginTop: 8,
              lineHeight: 1,
            }}
          >
            Konaverse
          </motion.div>
        </div>
      </div>

      {/* ══════ SCENE BACKDROP ══════ */}
      <motion.div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          background: "transparent",
        }}
      >
        {/* Blueprint world — swaps instantly behind the curtain */}
        {behindCurtain && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse at 50% 50%, #0a1a12 0%, #050e09 50%, #020804 100%)",
            }}
          />
        )}
      </motion.div>

      {/* ══════ 3D Canvas ══════ */}
      <SceneManager
        activeSection={activeIndex}
        scrollProgress={smoothedProgress}
        hoveredCard={hoveredCard}
        onHeadPositionUpdate={setHeadPosition}
        sparkActive={entranceComplete}
      />

      {/* ══════ Particles — hidden instantly when curtains close ══════ */}
      {entranceComplete && !behindCurtain && <ParticleField />}

      {/* ══════ Main Scroll Container ══════ */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          zIndex: 1,
          overflowY: entranceComplete ? "auto" : "hidden",
          background: "transparent",
        }}
      >
        {/* CylinderNav hidden for now — reclaim full viewport */}
        {/* <div
          style={{
            position: "fixed",
            zIndex: 10,
            opacity: entranceComplete ? 1 : 0,
            transition: "opacity 1s ease-out",
          }}
        >
          <CylinderNav activeIndex={activeIndex} />
        </div> */}

        {/* Hero section: 200vh for scroll-driven parallax */}
        <div style={{ height: "200vh", position: "relative" }}>
          <div style={{ position: "sticky", top: 0, height: "100vh", width: "100%", overflow: "visible" }}>
            <ArchitectHero
              onEntranceComplete={() => setEntranceComplete(true)}
              hoveredCard={hoveredCard}
              onHoverCard={setHoveredCard}
              headPosition={headPosition}
              scrollProgress={smoothedProgress}
            />
          </div>
        </div>

        {/* Blueprint section: 200vh for scroll-driven content reveal */}
        <div style={{ height: "200vh", position: "relative" }}>
          <div style={{ position: "sticky", top: 0, height: "100vh", width: "100%", overflow: "hidden" }}>
            <BlueprintSection
              progress={smoothedBlueprint}
              visible={activeIndex >= 1}
            />
          </div>
        </div>

        {/* Placeholder for future sections */}
        <div style={{ height: "200vh", position: "relative" }} />
      </div>
    </>
  );
}
