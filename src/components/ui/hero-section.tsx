"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const RobotHero = dynamic(() => import("./robot-hero"), {
  ssr: false,
  loading: () => null,
});

const SplineScene = dynamic(
  () => import("@splinetool/react-spline"),
  { ssr: false, loading: () => null }
);

const SPLINE_URL =
  "https://prod.spline.design/O0Tmhaxl-NFS9DJl/scene.splinecode";

const colors = {
  50: "#f8f7f5",
  200: "#c8b4a0",
};

function useCanLoadSpline() {
  const [canLoad, setCanLoad] = useState(false);
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const isLowEnd = navigator.hardwareConcurrency <= 2;
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    setCanLoad(!isMobile && !isLowEnd && !!gl);
  }, []);
  return canLoad;
}

export function HeroSection() {
  const canLoadSpline = useCanLoadSpline();
  const [splineReady, setSplineReady] = useState(false);
  const [splineFailed, setSplineFailed] = useState(false);

  // Timeout — if Spline hasn't loaded in 10s, give up
  useEffect(() => {
    if (!canLoadSpline || splineReady) return;
    const t = setTimeout(() => {
      if (!splineReady) setSplineFailed(true);
    }, 10000);
    return () => clearTimeout(t);
  }, [canLoadSpline, splineReady]);

  // Animate .word elements on mount — staggered via data-delay attribute
  useEffect(() => {
    const words = document.querySelectorAll<HTMLElement>(".word");
    const delayScale = 0.31;
    const wordDurationMs = 600;
    words.forEach((word) => {
      const baseDelay = parseInt(word.getAttribute("data-delay") || "0", 10);
      const delay = Math.round(baseDelay * delayScale);
      setTimeout(() => {
        word.style.animation = `word-appear ${wordDurationMs}ms ease-out forwards`;
      }, delay);
    });

    // Word hover glow
    words.forEach((word) => {
      word.addEventListener("mouseenter", () => {
        word.style.textShadow = "0 0 20px rgba(200, 180, 160, 0.5)";
      });
      word.addEventListener("mouseleave", () => {
        word.style.textShadow = "none";
      });
    });
  }, []);

  return (
    <div
      className="bg-gradient-to-br from-[#1a1d18] via-black to-[#2a2e26]"
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* ── Spline 3D background ─────────────────────────────────────────── */}
      {canLoadSpline && !splineFailed && (
        <SplineScene
          scene={SPLINE_URL}
          onLoad={() => setSplineReady(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
            opacity: splineReady ? 1 : 0,
            transition: "opacity 0.8s ease",
            pointerEvents: "auto",
          }}
        />
      )}

      {/* ── Spline logo cover — adjust position/size as needed ────────────── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 23,       // ← tweak to move up/down
          right: 15,        // ← tweak to move left/right
          width: 140,      // ← tweak to make wider/narrower
          height: 32,      // ← tweak to make taller/shorter
          background: "#6b7f62",  // ← match your page's dark bg
          zIndex: 1,       // sits on top of Spline (z-index 0)
          borderRadius: 12,
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-geist-mono, 'Geist Mono', monospace)",
            fontSize: "11px",
            fontWeight: 500,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#f8f7f5",
          }}
        >
          Konaverse
        </span>
      </div>
      {/* ── SVG grid pattern + detail dots ─────────────────────────────────── */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ zIndex: 1, pointerEvents: "none" }}
      >
        <defs>
          <pattern
            id="hero-grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="rgba(200,180,160,0.08)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
        <line x1="0" y1="20%" x2="100%" y2="20%" className="grid-line" style={{ animationDelay: "0.5s" }} />
        <line x1="0" y1="80%" x2="100%" y2="80%" className="grid-line" style={{ animationDelay: "1s" }} />
        <line x1="20%" y1="0" x2="20%" y2="100%" className="grid-line" style={{ animationDelay: "1.5s" }} />
        <line x1="80%" y1="0" x2="80%" y2="100%" className="grid-line" style={{ animationDelay: "2s" }} />
        <line x1="50%" y1="0" x2="50%" y2="100%" className="grid-line" style={{ animationDelay: "2.5s", opacity: 0.05 }} />
        <line x1="0" y1="50%" x2="100%" y2="50%" className="grid-line" style={{ animationDelay: "3s", opacity: 0.05 }} />
        <circle cx="20%" cy="20%" r="2" className="detail-dot" style={{ animationDelay: "3s" }} />
        <circle cx="80%" cy="20%" r="2" className="detail-dot" style={{ animationDelay: "3.2s" }} />
        <circle cx="20%" cy="80%" r="2" className="detail-dot" style={{ animationDelay: "3.4s" }} />
        <circle cx="80%" cy="80%" r="2" className="detail-dot" style={{ animationDelay: "3.6s" }} />
        <circle cx="50%" cy="50%" r="1.5" className="detail-dot" style={{ animationDelay: "4s" }} />
      </svg>

      {/* ── Corner elements ────────────────────────────────────────────────── */}
      <div className="corner-element top-8 left-8" style={{ animationDelay: "4s", zIndex: 2, pointerEvents: "none" }}>
        <div className="absolute top-0 left-0 w-2 h-2 opacity-30" style={{ background: colors[200] }} />
      </div>
      <div className="corner-element top-8 right-8" style={{ animationDelay: "4.2s", zIndex: 2, pointerEvents: "none" }}>
        <div className="absolute top-0 right-0 w-2 h-2 opacity-30" style={{ background: colors[200] }} />
      </div>
      <div className="corner-element bottom-8 left-8" style={{ animationDelay: "4.4s", zIndex: 2, pointerEvents: "none" }}>
        <div className="absolute bottom-0 left-0 w-2 h-2 opacity-30" style={{ background: colors[200] }} />
      </div>
      <div className="corner-element bottom-8 right-8" style={{ animationDelay: "4.6s", zIndex: 2, pointerEvents: "none" }}>
        <div className="absolute bottom-0 right-0 w-2 h-2 opacity-30" style={{ background: colors[200] }} />
      </div>

      {/* ── Floating elements ──────────────────────────────────────────────── */}
      <div className="floating-element" style={{ top: "25%", left: "15%", animationDelay: "5s", zIndex: 2, pointerEvents: "none" }} />
      <div className="floating-element" style={{ top: "60%", left: "85%", animationDelay: "5.5s", zIndex: 2, pointerEvents: "none" }} />
      <div className="floating-element" style={{ top: "40%", left: "10%", animationDelay: "6s", zIndex: 2, pointerEvents: "none" }} />
      <div className="floating-element" style={{ top: "75%", left: "90%", animationDelay: "6.5s", zIndex: 2, pointerEvents: "none" }} />

      {/* ── Noise overlay ──────────────────────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          opacity: 0.045,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />

      {/* ── Radial vignette ────────────────────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 90% 85% at 50% 50%, transparent 20%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* ── Text content — original layout ─────────────────────────────────── */}
      <div className="relative z-10 h-full flex flex-col justify-between items-center px-8 pt-20 pb-12 md:px-16 md:pt-24 md:pb-20" style={{ pointerEvents: "none" }}>
        {/* Top tagline */}
        <div className="text-center mt-8 md:mt-12">
          <h2
            className="text-xs md:text-sm font-mono font-light uppercase tracking-[0.2em] opacity-80"
            style={{ color: colors[200] }}
          >
            <span className="word" data-delay="0">Welcome</span>
            <span className="word" data-delay="200"> to</span>
            <span className="word" data-delay="400"> <b>Konaverse</b></span>
            <span className="word" data-delay="600"> —</span>
            <span className="word" data-delay="800"> Where</span>
            <span className="word" data-delay="1000"> digital</span>
            <span className="word" data-delay="1200"> dreams</span>
            <span className="word" data-delay="1400"> take</span>
            <span className="word" data-delay="1600"> form.</span>
          </h2>
          <div
            className="mt-4 w-16 h-px mx-auto opacity-30"
            style={{
              background: `linear-gradient(to right, transparent, ${colors[200]}, transparent)`,
            }}
          />
        </div>

        {/* Main headline */}
        <div className="text-center max-w-5xl mx-auto -mt-24 md:-mt-40">
          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-extralight leading-tight tracking-tight"
            style={{ color: colors[50] }}
          >
            <div className="mb-4 md:mb-6">
              <span className="word" data-delay="1800">We</span>
              <span className="word" data-delay="1950"> craft</span>
              <span className="word" data-delay="2100"> digital</span>
              <span className="word" data-delay="2250"> experiences</span>
              <span className="word" data-delay="2400"> that</span>
              <span className="word" data-delay="2550"> convert.</span>
            </div>
            <div
              className="text-2xl md:text-3xl lg:text-4xl font-thin leading-relaxed"
              style={{ color: colors[200] }}
            >
              <span className="word" data-delay="2800">Strategy,</span>
              <span className="word" data-delay="2950"> design,</span>
              <span className="word" data-delay="3100"> and</span>
              <span className="word" data-delay="3250"> development</span>
              <span className="word" data-delay="3400"> — unified</span>
              <span className="word" data-delay="3550"> under</span>
              <span className="word" data-delay="3700"> one</span>
              <span className="word" data-delay="3850"> vision.</span>
            </div>
          </h1>
        </div>

        {/* Bottom tagline */}
        <div className="text-center">
          <div
            className="mb-4 w-16 h-px mx-auto opacity-30"
            style={{
              background: `linear-gradient(to right, transparent, ${colors[200]}, transparent)`,
            }}
          />
          <h2
            className="text-xs md:text-sm font-mono font-light uppercase tracking-[0.2em] opacity-80"
            style={{ color: colors[200] }}
          >
            <span className="word" data-delay="4200">Web</span>
            <span className="word" data-delay="4350"> design</span>
            <span className="word" data-delay="4500"> ·</span>
            <span className="word" data-delay="4650"> Development</span>
            <span className="word" data-delay="4800"> ·</span>
            <span className="word" data-delay="4950"> Brand</span>
            <span className="word" data-delay="5100"> strategy</span>
          </h2>
          <div
            className="mt-6 flex justify-center space-x-4 opacity-0"
            style={{
              animation: "word-appear 1s ease-out forwards",
              animationDelay: "4.5s",
            }}
          >
            <div className="w-1 h-1 rounded-full opacity-40" style={{ background: colors[200] }} />
            <div className="w-1 h-1 rounded-full opacity-60" style={{ background: colors[200] }} />
            <div className="w-1 h-1 rounded-full opacity-40" style={{ background: colors[200] }} />
          </div>
        </div>
      </div>

      {/* ── 3D Robot ───────────────────────────────────────────────────────── */}
      <RobotHero />
    </div>
  );
}

export default HeroSection;
