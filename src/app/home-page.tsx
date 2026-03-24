"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import ArchitectHeroV2 from "@/components/three/ArchitectHeroV2";
import SceneManager from "@/components/three/SceneManager";
import CylinderNav from "@/components/layout/CylinderNav";
import BlueprintSection from "@/components/sections/BlueprintSection";
import ClientsSection from "@/components/sections/ClientsSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ServicesBackground from "@/components/three/ServicesBackground";
import ProjectsIntro from "@/components/sections/ProjectsIntro";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ProjectsMobile from "@/components/sections/ProjectsMobile";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CtaSection from "@/components/sections/CtaSection";
import HomeFooter from "@/components/sections/HomeFooter";
import HolographicTableBackground from "@/components/three/HolographicTableBackground";
import StarFieldBackground from "@/components/three/StarFieldBackground";
import GlobeBackground from "@/components/three/GlobeBackground";
import HeroPanel from "@/components/sections/HeroPanel";
import GlassPanel from "@/components/sections/GlassPanel";
import EntranceGate from "@/components/ui/EntranceGate";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { HoveredCardState } from "@/components/three/SceneManager";
import { ACT_1_START, ACT_2_START, ACT_3_START } from "@/components/sections/projects-timing";
import { TEST_CURTAIN_IN } from "@/components/sections/testimonials-timing";


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
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const [entranceComplete, setEntranceComplete] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [canMountCanvas, setCanMountCanvas] = useState(false);
  const [activeIndex, _setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const setActiveIndex = (v: number) => { if (v !== activeIndexRef.current) { activeIndexRef.current = v; _setActiveIndex(v); } };

  const [serviceSolIndex, _setServiceSolIndex] = useState(0);
  const serviceSolIndexRef = useRef(0);
  const setServiceSolIndex = (v: number) => { if (v !== serviceSolIndexRef.current) { serviceSolIndexRef.current = v; _setServiceSolIndex(v); } };

  // Lifted state for 3D interactions
  const [hoveredCard, setHoveredCard] = useState<HoveredCardState | null>(null);
  const headPositionRef = useRef({ x: 0, y: 0 });
  const stableHeadUpdate = useCallback((pos: { x: number; y: number }) => { headPositionRef.current = pos; }, []);

  // ── Projects active act (for holographic table color) ──
  const [projectsActiveAct, _setProjectsActiveAct] = useState(0);
  const projectsActiveActRef = useRef(0);
  const setProjectsActiveAct = (v: number) => { if (v !== projectsActiveActRef.current) { projectsActiveActRef.current = v; _setProjectsActiveAct(v); } };

  // ── Welcome Text position ──
  const welcomeTop = 44; // vh

  // Force scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ── Wrapper refs ──
  const heroWrapperRef = useRef<HTMLDivElement>(null);
  const blueprintWrapperRef = useRef<HTMLDivElement>(null);
  const clientsWrapperRef = useRef<HTMLDivElement>(null);
  const servicesWrapperRef = useRef<HTMLDivElement>(null);
  const projectsIntroRef = useRef<HTMLDivElement>(null);
  const projectsActsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

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
  const { scrollYProgress: projectsIntroScrollY } = useScroll({
    target: projectsIntroRef,
    offset: ["start start", "end end"],
  });
  const { scrollYProgress: projectsActsScrollY } = useScroll({
    target: projectsActsRef,
    offset: ["start start", "end end"],
  });
  const { scrollYProgress: testimonialsScrollY } = useScroll({
    target: testimonialsRef,
    offset: ["start start", "end end"],
  });
  const { scrollYProgress: ctaScrollY } = useScroll({
    target: ctaRef,
    offset: ["start start", "end end"],
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
  const smoothedProjectsIntroProgress = useSpring(projectsIntroScrollY, {
    stiffness: 80,
    damping: 28,
    restDelta: 0.001,
  });
  const smoothedProjectsActsProgress = useSpring(projectsActsScrollY, {
    stiffness: 80,
    damping: 28,
    restDelta: 0.001,
  });
  const smoothedTestimonialsProgress = useSpring(testimonialsScrollY, {
    stiffness: 80,
    damping: 28,
    restDelta: 0.001,
  });
  const smoothedCtaProgress = useSpring(ctaScrollY, {
    stiffness: 80,
    damping: 28,
    restDelta: 0.001,
  });

  // ── Scene environment: swap instantly behind the curtain ──
  const [behindCurtain, setBehindCurtain] = useState(false);
  const [behindServicesCurtain, setBehindServicesCurtain] = useState(false);
  const [behindProjectsCurtain, setBehindProjectsCurtain] = useState(false);
  const [behindTestimonialsCurtain, setBehindTestimonialsCurtain] = useState(false);

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
  // Projects intro — sets activeIndex to 4 (projects)
  useMotionValueEvent(projectsIntroScrollY, "change", (val) => {
    if (val > 0.02) setActiveIndex(4);
    else if (servicesScrollY.get() > 0.02) setActiveIndex(3);
    else if (clientsScrollY.get() > 0.02) setActiveIndex(2);
    else if (blueprintScrollY.get() > 0.02) setActiveIndex(1);
    else setActiveIndex(0);
  });
  // Projects acts — also activeIndex 4, plus active act tracking
  useMotionValueEvent(projectsActsScrollY, "change", (val) => {
    if (val > 0.02) {
      setActiveIndex(4);
      // Track active act for holographic table color shift
      const act = val < ACT_2_START ? 0 : val < ACT_3_START ? 1 : 2;
      setProjectsActiveAct(act);
    } else if (projectsIntroScrollY.get() > 0.02) setActiveIndex(4);
    else if (servicesScrollY.get() > 0.02) setActiveIndex(3);
    else if (clientsScrollY.get() > 0.02) setActiveIndex(2);
    else if (blueprintScrollY.get() > 0.02) setActiveIndex(1);
    else setActiveIndex(0);
  });
  // Testimonials — activeIndex 5
  useMotionValueEvent(testimonialsScrollY, "change", (val) => {
    if (val > 0.02) setActiveIndex(5);
    else if (projectsActsScrollY.get() > 0.02) setActiveIndex(4);
    else if (projectsIntroScrollY.get() > 0.02) setActiveIndex(4);
    else if (servicesScrollY.get() > 0.02) setActiveIndex(3);
    else if (clientsScrollY.get() > 0.02) setActiveIndex(2);
    else if (blueprintScrollY.get() > 0.02) setActiveIndex(1);
    else setActiveIndex(0);
  });
  // CTA — activeIndex 6
  useMotionValueEvent(ctaScrollY, "change", (val) => {
    if (val > 0.02) setActiveIndex(6);
    else if (testimonialsScrollY.get() > 0.02) setActiveIndex(5);
    else if (projectsActsScrollY.get() > 0.02) setActiveIndex(4);
    else if (projectsIntroScrollY.get() > 0.02) setActiveIndex(4);
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
  // ── behindProjectsCurtain — fires at 0.20, just after curtain fully covers
  //    viewport (CURTAIN_IN = 0.17). Services unmounts and holographic table
  //    mounts while the curtain is still opaque, so the swap is invisible.
  useMotionValueEvent(smoothedProjectsIntroProgress, "change", (val) => {
    if (val >= 0.17 && !behindProjectsCurtain) setBehindProjectsCurtain(true);
    if (val < 0.17 && behindProjectsCurtain) setBehindProjectsCurtain(false);
  });
  // ── behindTestimonialsCurtain — fires at TEST_CURTAIN_IN (0.18), when the
  //    bottom-to-top green sweep fully covers the viewport. Holographic table
  //    unmounts and star field mounts while the curtain is opaque.
  useMotionValueEvent(smoothedTestimonialsProgress, "change", (val) => {
    if (val >= TEST_CURTAIN_IN && !behindTestimonialsCurtain) setBehindTestimonialsCurtain(true);
    if (val < TEST_CURTAIN_IN && behindTestimonialsCurtain) setBehindTestimonialsCurtain(false);
  });

  // ── Scroll lock (replaces overflowY on container) ──
  useEffect(() => {
    document.body.style.overflowY = entranceComplete ? "auto" : "hidden";
    return () => { document.body.style.overflowY = ""; };
  }, [entranceComplete]);

  // ── Welcome text — hero-scoped ──
  const heroPlaceholderOpacity = useTransform(heroScrollY, [0, 0.15], [1, 0]);
  // Parallax exit — each layer moves at a different speed
  const heroPanelY = useTransform(heroScrollY, [0, 0.2], [0, -120]);
  const heroPanelScale = useTransform(heroScrollY, [0, 0.15], [1, 0.96]);
  const lineScaleX = useTransform(heroScrollY, [0.40, 0.47], [0, 1]);
  const lineOpacity = useTransform(heroScrollY, [0.40, 0.44, 0.90, 0.99], [0, 1, 1, 0]);
  const topTextY = useTransform(heroScrollY, [0.44, 0.52], [0, -32]);
  const topTextOpacity = useTransform(heroScrollY, [0.44, 0.47, 0.90, 0.99], [0, 1, 1, 0]);
  const bottomTextY = useTransform(heroScrollY, [0.47, 0.52], [0, 28]);
  const bottomTextOpacity = useTransform(heroScrollY, [0.47, 0.52, 0.90, 0.99], [0, 1, 1, 0]);

  return (
    <>
      {/* ══════ ENTRANCE GATE — cinematic reveal ══════ */}
      {!entranceComplete && (
        <EntranceGate
          sceneReady={sceneReady}
          onIntroComplete={() => setCanMountCanvas(true)}
          onRevealComplete={() => setEntranceComplete(true)}
        />
      )}

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
          background: "#000000",
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

      {/* ══════ Globe background — hero section (deferred until gate intro done) ══════ */}
      {canMountCanvas && !behindCurtain && <GlobeBackground heroScrollY={smoothedHeroProgress} />}

      {/* ══════ Services Background — mounts behind the curtain, unmounts behind it too ══════ */}
      {/* Rendered BEFORE SceneManager so SceneManager (alpha:true) paints on top at the same zIndex */}
      {behindServicesCurtain && !behindProjectsCurtain && <ServicesBackground serviceIndex={serviceSolIndex} />}

      {/* ══════ Holographic Table Background — projects section ══════ */}
      {behindProjectsCurtain && !behindTestimonialsCurtain && (
        <HolographicTableBackground activeAct={projectsActiveAct} />
      )}

      {/* ══════ Star Field Background — testimonials section ══════ */}
      {behindTestimonialsCurtain && <StarFieldBackground />}

      {/* ══════ 3D Canvas (deferred until gate intro done) ══════ */}
      {canMountCanvas && (
        <SceneManager
          activeSection={activeIndex}
          scrollProgress={smoothedHeroProgress}
          hoveredCard={hoveredCard}
          onHeadPositionUpdate={stableHeadUpdate}
          sparkActive={entranceComplete}
          serviceIndex={serviceSolIndex}
          projectsAct={projectsActiveAct}
          projectsProgress={smoothedProjectsActsProgress}
          onSceneReady={() => setSceneReady(true)}
        />
      )}

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
            <ArchitectHeroV2
              hoveredCard={hoveredCard}
              onHoverCard={setHoveredCard}
              headPosition={headPositionRef.current}
              scrollProgress={smoothedHeroProgress}
            />

            {/* ── Hero glassmorphism panel ── */}
            <GlassPanel opacity={heroPlaceholderOpacity} y={heroPanelY} scale={heroPanelScale}>
              <HeroPanel entranceComplete={entranceComplete} />
            </GlassPanel>

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

        {/* Services wrapper — scroll tracking only, content is fixed */}
        <div ref={servicesWrapperRef} style={{ height: "1000vh", position: "relative" }}>
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "100vh", overflow: "hidden" }}>
            <ServicesSection
              progress={smoothedServicesProgress}
              visible={activeIndex >= 3 && !behindProjectsCurtain}
            />
          </div>
        </div>

        {/* ══════ PROJECTS — three separate wrappers ══════ */}

        {isMobile ? (
          /* Mobile: single static layout for all project acts */
          <div style={{ position: "relative" }}>
            <ProjectsMobile />
          </div>
        ) : (
          <>
            {/* 1) Projects intro — curtain + "Selected Work" header (sticky) */}
            <div ref={projectsIntroRef} style={{ height: "600vh", position: "relative", marginTop: "-100vh" }}>
              <div style={{ position: "sticky", top: 0, height: "100vh", width: "100%", overflow: "hidden" }}>
                <ProjectsIntro
                  progress={smoothedProjectsIntroProgress}
                  visible={activeIndex >= 3}
                />
              </div>
            </div>

            {/* 2) Acts 1, 2 & 3 — Websites + Videos + Social (sticky, scroll-progress-driven) */}
            <div ref={projectsActsRef} style={{ height: "1500vh", position: "relative" }}>
              <div style={{ position: "sticky", top: 0, height: "100vh", width: "100%", overflow: "hidden" }}>
                <ProjectsSection
                  progress={smoothedProjectsActsProgress}
                  visible={activeIndex >= 4 && !behindTestimonialsCurtain}
                />
              </div>
            </div>

            {/* 3) Testimonials — green curtain + star field + testimonial cards */}
            <div ref={testimonialsRef} style={{ height: "800vh", position: "relative" }}>
              <div style={{ position: "sticky", top: 0, height: "100vh", width: "100%", overflow: "hidden" }}>
                <TestimonialsSection
                  progress={smoothedTestimonialsProgress}
                  visible={activeIndex >= 4}
                />
              </div>
            </div>

            {/* 4) CTA — contact call-to-action */}
            <div ref={ctaRef} style={{ height: "400vh", position: "relative" }}>
              <div style={{ position: "sticky", top: 0, height: "100vh", width: "100%", overflow: "hidden" }}>
                <CtaSection
                  progress={smoothedCtaProgress}
                  visible={activeIndex >= 5}
                />
              </div>
            </div>
          </>
        )}

        {/* ══════ FOOTER — scrolls over the fixed canvas ══════ */}
        <HomeFooter />

      </div>
    </>
  );
}
