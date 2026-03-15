"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import ArchitectHero from "@/components/three/ArchitectHero";
import SceneManager from "@/components/three/SceneManager";
import CylinderNav from "@/components/layout/CylinderNav";
import ParticleField from "@/components/effects/ParticleField";
import BlueprintSection from "@/components/sections/BlueprintSection";
import ClientsSection from "@/components/sections/ClientsSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ServicesBackground from "@/components/three/ServicesBackground";
import type { HoveredCardState } from "@/components/three/SceneManager";


// Mirror of ServicesSection timing — used to lift serviceSolIndex for SceneManager + ServicesBackground
const SVC_CURTAIN = 0.28;
const SVC_PER = 0.14;
function getSvcIndex(p: number): number {
  if (p < SVC_CURTAIN) return 0;
  for (let i = 0; i < 5; i++) {
    if (p < SVC_CURTAIN + (i + 1) * SVC_PER) return i;
  }
  return 4;
}

export default function HomePage() {
  const [entranceComplete, setEntranceComplete] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [serviceSolIndex, setServiceSolIndex] = useState(0);

  // Lifted state for 3D interactions
  const [hoveredCard, setHoveredCard] = useState<HoveredCardState | null>(null);
  const [headPosition, setHeadPosition] = useState({ x: 0, y: 0 });

  // ── Welcome Text position ──
  const welcomeTop = 44; // vh

  // Force scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ── Three wrapper refs ──
  const heroWrapperRef = useRef<HTMLDivElement>(null);
  const blueprintWrapperRef = useRef<HTMLDivElement>(null);
  const clientsWrapperRef = useRef<HTMLDivElement>(null);
  const servicesWrapperRef = useRef<HTMLDivElement>(null);
  const interludeWrapperRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);

  // ── Section-scoped scroll progress ──
  const { scrollYProgress: heroScrollY } = useScroll({
    target: heroWrapperRef,
    offset: ["start start", "end start"],
  });
  const { scrollYProgress: blueprintScrollY } = useScroll({
    target: blueprintWrapperRef,
    offset: ["start start", "end start"],
  });
  const { scrollYProgress: clientsScrollY } = useScroll({
    target: clientsWrapperRef,
    offset: ["start start", "end start"],
  });
  const { scrollYProgress: servicesScrollY } = useScroll({
    target: servicesWrapperRef,
    offset: ["start start", "end start"],
  });
  const { scrollYProgress: interludeScrollY } = useScroll({
    target: interludeWrapperRef,
    offset: ["start start", "end start"],
  });
  const { scrollYProgress: textScrollY } = useScroll({
    target: textWrapperRef,
    offset: ["start start", "end start"],
  });

  // ── Smoothed values for animation ──
  const smoothedHeroProgress = useSpring(heroScrollY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const smoothedBlueprintProgress = useSpring(blueprintScrollY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const smoothedClientsProgress = useSpring(clientsScrollY, {
    stiffness: 80,
    damping: 28,
    restDelta: 0.001,
  });
  const smoothedServicesProgress = useSpring(servicesScrollY, {
    stiffness: 80,
    damping: 28,
    restDelta: 0.001,
  });
  const smoothedTextProgress = useSpring(textScrollY, {
    stiffness: 80,
    damping: 28,
    restDelta: 0.001,
  });

  // ── Scene environment: swap instantly behind the curtain ──
  const [behindCurtain, setBehindCurtain] = useState(false);
  const [behindServicesCurtain, setBehindServicesCurtain] = useState(false);

  // ── activeIndex — raw scroll for instant section detection ──
  useMotionValueEvent(blueprintScrollY, "change", (val) => {
    if (val > 0.02 && clientsScrollY.get() <= 0.02) setActiveIndex(1);
    if (val <= 0.02) setActiveIndex(0);
  });
  useMotionValueEvent(clientsScrollY, "change", (val) => {
    if (val > 0.02) setActiveIndex(2);
    else if (blueprintScrollY.get() > 0.02) setActiveIndex(1);
    else setActiveIndex(0);
  });
  useMotionValueEvent(servicesScrollY, "change", (val) => {
    if (val > 0.02) setActiveIndex(3);
    else if (clientsScrollY.get() > 0.02) setActiveIndex(2);
    else if (blueprintScrollY.get() > 0.02) setActiveIndex(1);
    else setActiveIndex(0);
  });
  useMotionValueEvent(interludeScrollY, "change", (val) => {
    if (val > 0.02) setActiveIndex(4);
    else if (servicesScrollY.get() > 0.02) setActiveIndex(3);
    else if (clientsScrollY.get() > 0.02) setActiveIndex(2);
    else if (blueprintScrollY.get() > 0.02) setActiveIndex(1);
    else setActiveIndex(0);
  });
  useMotionValueEvent(textScrollY, "change", (val) => {
    if (val > 0.02) setActiveIndex(5);
    else if (interludeScrollY.get() > 0.02) setActiveIndex(4);
    else if (servicesScrollY.get() > 0.02) setActiveIndex(3);
    else if (clientsScrollY.get() > 0.02) setActiveIndex(2);
    else if (blueprintScrollY.get() > 0.02) setActiveIndex(1);
    else setActiveIndex(0);
  });

  // ── behindCurtain — driven by the SPRING so it fires exactly when curtains
  //    reach y:0% (full viewport coverage at smoothed progress = 0.05) ──
  useMotionValueEvent(smoothedBlueprintProgress, "change", (val) => {
    if (val >= 0.05 && !behindCurtain) setBehindCurtain(true);
    if (val < 0.05 && behindCurtain) setBehindCurtain(false);
  });
  // ── behindServicesCurtain + serviceSolIndex ──────────────────
  useMotionValueEvent(smoothedServicesProgress, "change", (val) => {
    if (val >= 0.09 && !behindServicesCurtain) setBehindServicesCurtain(true);
    if (val < 0.09 && behindServicesCurtain) setBehindServicesCurtain(false);
    setServiceSolIndex(getSvcIndex(val));
  });

  // ── Scroll lock (replaces overflowY on container) ──
  useEffect(() => {
    document.body.style.overflowY = entranceComplete ? "auto" : "hidden";
    return () => { document.body.style.overflowY = ""; };
  }, [entranceComplete]);

  // ── Welcome text — hero-scoped ──
  const lineScaleX = useTransform(heroScrollY, [0.40, 0.47], [0, 1]);
  const lineOpacity = useTransform(heroScrollY, [0.40, 0.44, 0.60, 0.64], [0, 1, 1, 0]);
  const topTextY = useTransform(heroScrollY, [0.44, 0.52], [0, -32]);
  const topTextOpacity = useTransform(heroScrollY, [0.44, 0.47, 0.60, 0.64], [0, 1, 1, 0]);
  const bottomTextY = useTransform(heroScrollY, [0.47, 0.52], [0, 28]);
  const bottomTextOpacity = useTransform(heroScrollY, [0.47, 0.52, 0.60, 0.64], [0, 1, 1, 0]);

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

      {/* ══════ Services Background — mounts behind the curtain, unmounts behind it too ══════ */}
      {/* Rendered BEFORE SceneManager so SceneManager (alpha:true) paints on top at the same zIndex */}
      {behindServicesCurtain && <ServicesBackground serviceIndex={serviceSolIndex} />}

      {/* ══════ 3D Canvas ══════ */}
      <SceneManager
        activeSection={activeIndex}
        scrollProgress={smoothedHeroProgress}
        hoveredCard={hoveredCard}
        onHeadPositionUpdate={setHeadPosition}
        sparkActive={entranceComplete}
        serviceIndex={serviceSolIndex}
        textProgress={smoothedTextProgress}
      />

      {/* ══════ Particles — hidden instantly when curtains close ══════ */}
      {entranceComplete && !behindCurtain && <ParticleField />}

      {/* ══════ Main Scroll Container ══════ */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          background: "transparent",
        }}
      >
        {/* Hero wrapper — owns its own scroll progress */}
        <div ref={heroWrapperRef} style={{ height: "200vh", position: "relative" }}>
          <div style={{ position: "sticky", top: 0, height: "100vh", width: "100%", overflow: "visible" }}>
            <ArchitectHero
              onEntranceComplete={() => setEntranceComplete(true)}
              hoveredCard={hoveredCard}
              onHoverCard={setHoveredCard}
              headPosition={headPosition}
              scrollProgress={smoothedHeroProgress}
            />
          </div>
        </div>

        {/* Blueprint wrapper — owns its own scroll progress */}
        <div ref={blueprintWrapperRef} style={{ height: "150vh", position: "relative" }}>
          <div style={{ position: "sticky", top: 0, height: "100vh", width: "100%", overflow: "hidden" }}>
            <BlueprintSection
              progress={smoothedBlueprintProgress}
              visible={activeIndex >= 1}
            />
          </div>
        </div>

        {/* Clients wrapper — owns its own scroll progress */}
        <div ref={clientsWrapperRef} style={{ height: "320vh", position: "relative" }}>
          <div style={{ position: "sticky", top: 0, height: "100vh", width: "100%", overflow: "visible" }}>
            <ClientsSection
              progress={smoothedClientsProgress}
              scrollY={clientsScrollY}
              visible={activeIndex >= 2}
            />
          </div>
        </div>

        {/* Services wrapper — owns its own scroll progress */}
        <div ref={servicesWrapperRef} style={{ height: "1000vh", position: "relative" }}>
          <div style={{ position: "sticky", top: 0, height: "100vh", width: "100%", overflow: "hidden" }}>
            <ServicesSection
              progress={smoothedServicesProgress}
              visible={activeIndex >= 3}
            />
          </div>
        </div>


        {/* Interlude spacer — transparent, architect drifts to center */}
        <div ref={interludeWrapperRef} style={{ height: "200vh", position: "relative" }} />

        {/* Text section — 3D depth text animates through scene */}
        <div ref={textWrapperRef} style={{ height: "300vh", position: "relative" }} />

      </div>
    </>
  );
}
