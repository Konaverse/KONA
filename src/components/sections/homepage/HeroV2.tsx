"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useCallback, useState } from "react";

const ACCENT = "#6B7F62";

const WEB_PATH =
  "M 0 0 L 593 0 L 593 33 L 559.072 70 L 559.072 182.5 L 593 233 L 593 577 L 0 577 L 0 521 L 31.469 487 L 31.469 393.5 L 0 348.5 L 0 0 Z";
const VID_PATH =
  "M 34 0 L 627 0 L 627 33 L 661 76.5 L 661 189.5 L 627 233 L 627 577 L 34 577 L 34 453.5 L 0 404 L 0 306.5 L 34 271 L 34 0 Z";

const WEB_CLIP_OBB =
  "M 0 0 L 1 0 L 1 0.0572 L 0.9428 0.1213 L 0.9428 0.3163 L 1 0.4038 L 1 1 L 0 1 L 0 0.9030 L 0.0531 0.8441 L 0.0531 0.6820 L 0 0.6042 L 0 0 Z";
const VID_CLIP_OBB =
  "M 0.0514 0 L 0.9486 0 L 0.9486 0.0572 L 1 0.1326 L 1 0.3284 L 0.9486 0.4038 L 0.9486 1 L 0.0514 1 L 0.0514 0.7858 L 0 0.7002 L 0 0.5311 L 0.0514 0.4696 L 0.0514 0 Z";

const TEXT_GRADIENT =
  "linear-gradient(180deg, rgba(8,8,12,0) 0%, rgba(8,8,12,0) 45%, rgba(8,8,12,0.55) 80%, rgba(8,8,12,0.72) 100%)";

// ---------- Animated canvas background ----------
function CinematicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Dust = { x: number; y: number; vx: number; vy: number; r: number; a: number };
    const dust: Dust[] = Array.from({ length: 72 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -(Math.random() * 0.22 + 0.04),
      r: Math.random() * 1.2 + 0.3,
      a: Math.random() * 0.28 + 0.05,
    }));

    type Ripple = { x: number; y: number; radius: number; maxR: number; speed: number; baseA: number };
    const ripples: Ripple[] = [];
    let lastSpawn = -999;

    const spawn = (t: number) => {
      lastSpawn = t;
      ripples.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 0,
        maxR: Math.random() * 220 + 70,
        speed: Math.random() * 0.55 + 0.25,
        baseA: Math.random() * 0.11 + 0.04,
      });
    };

    for (let i = 0; i < 8; i++) {
      ripples.push({
        x: Math.random() * (canvas.width || 1440),
        y: Math.random() * (canvas.height || 900),
        radius: Math.random() * 140,
        maxR: Math.random() * 220 + 70,
        speed: Math.random() * 0.55 + 0.25,
        baseA: Math.random() * 0.11 + 0.04,
      });
    }

    const tick = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (t - lastSpawn > 680) spawn(t);

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        const p = r.radius / r.maxR;
        if (p >= 1) { ripples.splice(i, 1); continue; }
        const alpha = r.baseA * Math.sin(p * Math.PI);
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(107,127,98,${alpha.toFixed(3)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      dust.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }
        if (p.x < -5) p.x = canvas.width + 5;
        if (p.x > canvas.width + 5) p.x = -5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(107,127,98,${p.a.toFixed(3)})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }}
    />
  );
}

// ---------- Shared card internals ----------
function WebCardInner() {
  return (
    <div className="group" data-cursor="card" style={{ width: "100%", height: "100%", pointerEvents: "auto" }}>
      <div
        style={{ width: "100%", height: "100%", position: "relative", transition: "all 0.5s cubic-bezier(0.23,1,0.32,1)" }}
        className="group-hover:-translate-y-1.5 group-hover:brightness-110"
      >
        <div style={{ position: "absolute", inset: 0, clipPath: "url(#heroClipWeb)", zIndex: 0 }}>
          <Image src="/web_development_floating_mockup.png" alt="" fill style={{ objectFit: "cover" }} priority />
          <div
            className="transition-opacity duration-500 group-hover:opacity-0"
            style={{ position: "absolute", inset: 0, backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", background: "rgba(255,255,255,0.06)" }}
          />
          <div style={{ position: "absolute", inset: 0, background: TEXT_GRADIENT }} />
        </div>
        <svg viewBox="0 0 593 577" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }}>
          <defs>
            <linearGradient id="shineWeb" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
              <stop offset="45%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
          <path d={WEB_PATH} fill="url(#shineWeb)" />
          <path d={WEB_PATH} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "clamp(22px, 3.2vw, 48px)", zIndex: 2 }}>
          <p style={{ fontSize: "0.55rem", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: ACCENT, marginBottom: "0.6rem", fontFamily: "var(--font-jakarta), sans-serif" }}>
            Service 01
          </p>
          <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(1.1rem, 2.4vw, 2.3rem)", fontWeight: 300, color: "#f0ede8", lineHeight: 1.15, marginBottom: "0.5rem" }}>
            Web<br />Development
          </h2>
          <p style={{ fontSize: "clamp(0.65rem, 0.85vw, 0.85rem)", fontWeight: 300, color: "rgba(240,237,232,0.65)", lineHeight: 1.6, maxWidth: 360, marginBottom: "1.2rem", fontFamily: "var(--font-jakarta), sans-serif" }}>
            Bespoke digital platforms engineered for performance, beauty, and conversion.
          </p>
          <div
            className="opacity-0 group-hover:opacity-100 translate-y-1.5 group-hover:translate-y-0 transition-all duration-300"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", fontSize: "0.68rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#f0ede8", fontFamily: "var(--font-jakarta), sans-serif" }}
          >
            Explore <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoCardInner() {
  return (
    <div className="group" data-cursor="card" style={{ width: "100%", height: "100%", pointerEvents: "auto" }}>
      <div
        style={{ width: "100%", height: "100%", position: "relative", transition: "all 0.5s cubic-bezier(0.23,1,0.32,1)" }}
        className="group-hover:-translate-y-1.5 group-hover:brightness-110"
      >
        <div style={{ position: "absolute", inset: 0, clipPath: "url(#heroClipVideo)", zIndex: 0 }}>
          <Image src="/a_pro_camera.png" alt="" fill style={{ objectFit: "cover" }} priority />
          <div
            className="transition-opacity duration-500 group-hover:opacity-0"
            style={{ position: "absolute", inset: 0, backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", background: "rgba(255,255,255,0.06)" }}
          />
          <div style={{ position: "absolute", inset: 0, background: TEXT_GRADIENT }} />
        </div>
        <svg viewBox="0 0 661 577" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }}>
          <defs>
            <linearGradient id="shineVideo" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
              <stop offset="45%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
          <path d={VID_PATH} fill="url(#shineVideo)" />
          <path d={VID_PATH} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "clamp(22px, 3.2vw, 48px)", zIndex: 2 }}>
          <p style={{ fontSize: "0.55rem", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: ACCENT, marginBottom: "0.6rem", fontFamily: "var(--font-jakarta), sans-serif" }}>
            Service 02
          </p>
          <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(1.1rem, 2.4vw, 2.3rem)", fontWeight: 300, color: "#f0ede8", lineHeight: 1.15, marginBottom: "0.5rem" }}>
            Videography
          </h2>
          <p style={{ fontSize: "clamp(0.65rem, 0.85vw, 0.85rem)", fontWeight: 300, color: "rgba(240,237,232,0.65)", lineHeight: 1.6, maxWidth: 360, marginBottom: "1.2rem", fontFamily: "var(--font-jakarta), sans-serif" }}>
            Cinematic visual narratives that capture attention and tell your brand&apos;s story with emotion.
          </p>
          <div
            className="opacity-0 group-hover:opacity-100 translate-y-1.5 group-hover:translate-y-0 transition-all duration-300"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", fontSize: "0.68rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#f0ede8", fontFamily: "var(--font-jakarta), sans-serif" }}
          >
            Explore <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Main component ----------
export default function HeroV2() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Parallax (desktop only — hooks must be unconditional)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const sx = useSpring(rawX, { stiffness: 45, damping: 20 });
  const sy = useSpring(rawY, { stiffness: 45, damping: 20 });

  const onMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = sectionRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    rawX.set(((e.clientX - left) / width) * 2 - 1);
    rawY.set(((e.clientY - top) / height) * 2 - 1);
  }, [rawX, rawY]);

  const onLeave = useCallback(() => { rawX.set(0); rawY.set(0); }, [rawX, rawY]);

  const o1x = useTransform(sx, [-1, 1], [-32, 32]);
  const o1y = useTransform(sy, [-1, 1], [-22, 22]);
  const o2x = useTransform(sx, [-1, 1], [24, -24]);
  const o2y = useTransform(sy, [-1, 1], [16, -16]);
  const o3x = useTransform(sx, [-1, 1], [-18, 18]);
  const o3y = useTransform(sy, [-1, 1], [-12, 12]);
  const c1x = useTransform(sx, [-1, 1], [-10, 10]);
  const c1y = useTransform(sy, [-1, 1], [-6, 6]);
  const c2x = useTransform(sx, [-1, 1], [13, -13]);
  const c2y = useTransform(sy, [-1, 1], [-9, 9]);
  const descX = useTransform(sx, [-1, 1], [-5, 5]);
  const descY = useTransform(sy, [-1, 1], [-3, 3]);
  const maniX = useTransform(sx, [-1, 1], [8, -8]);
  const maniY = useTransform(sy, [-1, 1], [-5, 5]);

  const EASE = [0.16, 1, 0.3, 1] as const;

  // ---------- Shared background elements ----------
  const sharedBg = (
    <>
      <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} aria-hidden>
        <defs>
          <clipPath id="heroClipWeb" clipPathUnits="objectBoundingBox"><path d={WEB_CLIP_OBB} /></clipPath>
          <clipPath id="heroClipVideo" clipPathUnits="objectBoundingBox"><path d={VID_CLIP_OBB} /></clipPath>
        </defs>
      </svg>
      <CinematicBackground />
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
          backgroundSize: "256px", pointerEvents: "none", zIndex: 100,
        }}
      />
    </>
  );

  // ═══════════════════════════════════════════════════
  // MOBILE LAYOUT
  // ═══════════════════════════════════════════════════
  if (isMobile) {
    return (
      <section
        style={{
          width: "100%",
          minHeight: "100svh",
          position: "relative",
          overflow: "hidden",
          background: "#0a0a0c",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {sharedBg}

        {/* Orbs */}
        <motion.div
          aria-hidden
          style={{ position: "absolute", width: "80vw", height: "80vw", borderRadius: "50%", background: "rgba(107,127,98,0.4)", filter: "blur(16vw)", top: "-15%", left: "-20%", pointerEvents: "none", zIndex: 3 }}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 3.5, ease: EASE, delay: 0.15 }}
        />
        <motion.div
          aria-hidden
          style={{ position: "absolute", width: "60vw", height: "60vw", borderRadius: "50%", background: "rgba(107,127,98,0.3)", filter: "blur(14vw)", bottom: "10%", right: "-15%", pointerEvents: "none", zIndex: 3 }}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 3.5, ease: EASE, delay: 0.4 }}
        />

        {/* Content — centered column */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 24px", paddingTop: "calc(64px + 6vw)", paddingBottom: "8vw", position: "relative", zIndex: 10 }}>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.7, ease: EASE, delay: 0.35 }}
            style={{ textAlign: "center", marginBottom: "5vw" }}
          >
            <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(32px, 10vw, 52px)", fontWeight: 300, lineHeight: 1.06, letterSpacing: "-0.015em", color: "#f0ede8", margin: 0 }}>
              A <em style={{ fontStyle: "italic", color: ACCENT, fontWeight: 400 }}>creative</em> studio
              <br />
              <span style={{ opacity: 0.5 }}>for the</span>{" "}
              <em style={{ fontStyle: "italic" }}>intentionally</em> modern.
            </h2>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, ease: EASE, delay: 0.55 }}
            style={{ textAlign: "center", marginBottom: "8vw" }}
          >
            <p style={{ fontFamily: "var(--font-jakarta), sans-serif", fontSize: "clamp(0.85rem, 3.6vw, 1rem)", fontWeight: 300, lineHeight: 1.7, color: "#f0ede8", letterSpacing: "-0.003em", margin: 0 }}>
              We craft digital experiences where strategy
              <br />
              <span style={{ opacity: 0.45 }}>meets narrative, shaped by taste,</span>
              <br />
              <span style={{ opacity: 0.45 }}>refined by craft.</span>
            </p>
          </motion.div>

          {/* Cards — stacked vertically, full width */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%" }}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.7, ease: EASE, delay: 0.7 }}
              style={{ width: "100%", aspectRatio: "593 / 420" }}
            >
              <WebCardInner />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.7, ease: EASE, delay: 0.88 }}
              style={{ width: "100%", aspectRatio: "661 / 420" }}
            >
              <VideoCardInner />
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  // ═══════════════════════════════════════════════════
  // DESKTOP LAYOUT
  // ═══════════════════════════════════════════════════
  return (
    <section
      ref={sectionRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ width: "100%", height: "100vh", position: "relative", overflow: "hidden", background: "#0a0a0c" }}
    >
      {sharedBg}

      {/* Orb 1 */}
      <motion.div
        aria-hidden
        style={{ x: o1x, y: o1y, position: "absolute", width: "33vw", height: "33vw", borderRadius: "50%", background: "rgba(107,127,98,0.5)", filter: "blur(8vw)", top: "-5%", left: "5%", pointerEvents: "none", zIndex: 3 }}
        initial={{ opacity: 0, scale: 0.25 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 3.8, ease: EASE, delay: 0.15 }}
      />
      {/* Orb 2 */}
      <motion.div
        aria-hidden
        style={{ x: o2x, y: o2y, position: "absolute", width: "30vw", height: "30vw", borderRadius: "50%", background: "rgba(107,127,98,0.42)", filter: "blur(8vw)", bottom: 0, right: "5%", pointerEvents: "none", zIndex: 3 }}
        initial={{ opacity: 0, scale: 0.25 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 3.8, ease: EASE, delay: 0.45 }}
      />
      {/* Orb 3 */}
      <motion.div
        aria-hidden
        style={{ x: o3x, y: o3y, position: "absolute", width: "20vw", height: "20vw", borderRadius: "50%", background: "rgba(107,127,98,0.32)", filter: "blur(8vw)", top: "40%", left: "45%", pointerEvents: "none", zIndex: 3 }}
        initial={{ opacity: 0, scale: 0.25 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 3.8, ease: EASE, delay: 0.75 }}
      />

      {/* Content container */}
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", height: "100%", width: "calc(100vw - 40px)", maxWidth: 1180, pointerEvents: "none" }}>

        {/* Description */}
        <motion.div style={{ x: descX, y: descY, position: "absolute", left: 0, top: "18vh", maxWidth: "46%", zIndex: 1, pointerEvents: "none" }}>
          <motion.div
            initial={{ opacity: 0, y: 36, filter: "blur(14px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.9, ease: EASE, delay: 0.6 }}
          >
            <p style={{ fontFamily: "var(--font-jakarta), sans-serif", fontSize: "clamp(1rem, 1.35vw, 1.25rem)", fontWeight: 300, lineHeight: 1.65, color: "#f0ede8", letterSpacing: "-0.003em", margin: 0 }}>
              We craft digital experiences where strategy
              <br />
              <span style={{ opacity: 0.45 }}>meets narrative, shaped by taste,</span>
              <br />
              <span style={{ opacity: 0.45 }}>refined by craft.</span>
            </p>
          </motion.div>
        </motion.div>

        {/* Web Dev Card */}
        <motion.div style={{ x: c1x, y: c1y, position: "absolute", left: 0, top: "37vh", width: "47%", aspectRatio: "593 / 577", maxHeight: "58vh", zIndex: 5 }}>
          <motion.div
            initial={{ opacity: 0, y: 90, filter: "blur(20px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.9, ease: EASE, delay: 0.85 }}
            style={{ width: "100%", height: "100%" }}
          >
            <WebCardInner />
          </motion.div>
        </motion.div>

        {/* Videography Card */}
        <motion.div style={{ x: c2x, y: c2y, position: "absolute", right: 0, top: "14vh", width: "53%", aspectRatio: "661 / 577", maxHeight: "58vh", zIndex: 5 }}>
          <motion.div
            initial={{ opacity: 0, y: 90, filter: "blur(20px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.9, ease: EASE, delay: 1.05 }}
            style={{ width: "100%", height: "100%" }}
          >
            <VideoCardInner />
          </motion.div>
        </motion.div>

        {/* Manifesto */}
        <motion.div style={{ x: maniX, y: maniY, position: "absolute", left: "50%", right: 0, top: "74vh", textAlign: "left", zIndex: 1, pointerEvents: "none" }}>
          <motion.div
            initial={{ opacity: 0, y: 36, filter: "blur(14px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.9, ease: EASE, delay: 1.4 }}
          >
            <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(24px, 4.2vw, 54px)", fontWeight: 300, lineHeight: 1.04, letterSpacing: "-0.015em", color: "#f0ede8", margin: 0 }}>
              A <em style={{ fontStyle: "italic", color: ACCENT, fontWeight: 400 }}>creative</em> studio
              <br />
              <span style={{ opacity: 0.5 }}>for the</span>{" "}
              <em style={{ fontStyle: "italic" }}>intentionally</em> modern.
            </h2>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
