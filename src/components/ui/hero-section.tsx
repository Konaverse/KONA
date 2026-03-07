"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import React from "react";


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

// ── Scramble Text — triggers on mount + re-triggers on hover ──────────────
const SCRAMBLE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

function HeroScrambleText({
  lines,
  entranceDelay = 0,
}: {
  lines: string[];
  entranceDelay?: number;
}) {
  const [triggerKey, setTriggerKey] = useState(0);

  // Trigger entrance animation after delay
  useEffect(() => {
    const t = setTimeout(() => setTriggerKey(1), entranceDelay);
    return () => clearTimeout(t);
  }, [entranceDelay]);

  const handleHover = useCallback(() => {
    setTriggerKey((k) => k + 1);
  }, []);

  return (
    <span onMouseEnter={handleHover}>
      {lines.map((line, i) => (
        <React.Fragment key={i}>
          <ScrambleLine text={line} triggerKey={triggerKey} />
          {i < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </span>
  );
}

function ScrambleLine({
  text,
  triggerKey,
}: {
  text: string;
  triggerKey: number;
}) {
  const [display, setDisplay] = useState(text.replace(/\S/g, " "));
  const frameRef = useRef(0);

  useEffect(() => {
    if (triggerKey === 0) return; // don't animate until triggered
    frameRef.current = 0;
    const duration = 20;
    const interval = setInterval(() => {
      frameRef.current++;
      if (frameRef.current >= duration) {
        setDisplay(text);
        clearInterval(interval);
        return;
      }
      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < (frameRef.current / duration) * text.length) return text[i];
            return SCRAMBLE_CHARS[
              Math.floor(Math.random() * SCRAMBLE_CHARS.length)
            ];
          })
          .join("")
      );
    }, 35);
    return () => clearInterval(interval);
  }, [text, triggerKey]);

  return <>{display}</>;
}

// ── Device capability check ───────────────────────────────────────────────
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

// ── Solution labels with hover preview ────────────────────────────────────
const solutionItems = [
  {
    label: "Web Development",
    href: "/solutions/web-development",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=560&h=320&fit=crop",
    title: "Web Development",
    subtitle: "Fast, scalable, beautifully crafted websites",
  },
  {
    label: "Web Applications",
    href: "/solutions/web-applications",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=560&h=320&fit=crop",
    title: "Web Applications",
    subtitle: "Complex platforms engineered for scale",
  },
  {
    label: "Digital Advertising",
    href: "/solutions/digital-advertising",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=560&h=320&fit=crop",
    title: "Digital Advertising",
    subtitle: "Data-driven campaigns that convert",
  },
  {
    label: "Social Media",
    href: "/solutions/social-media",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=560&h=320&fit=crop",
    title: "Social Media",
    subtitle: "Community building & brand narrative",
  },
  {
    label: "Videography",
    href: "/solutions/videography",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=560&h=320&fit=crop",
    title: "Videography",
    subtitle: "Cinematic storytelling for your brand",
  },
];

function SolutionLabels() {
  const [preview, setPreview] = useState<(typeof solutionItems)[number] | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  // Preload images
  useEffect(() => {
    solutionItems.forEach((item) => {
      const img = new window.Image();
      img.src = item.image;
    });
  }, []);

  const updatePos = useCallback((e: React.MouseEvent) => {
    const cardW = 300;
    const cardH = 250;
    const gap = 20;
    let x = e.clientX - cardW / 2;
    let y = e.clientY - cardH - gap;
    if (x + cardW > window.innerWidth - 20) x = window.innerWidth - cardW - 20;
    if (x < 20) x = 20;
    if (y < 20) y = e.clientY + gap;
    setPos({ x, y });
  }, []);

  return (
    <>
      <nav
        aria-label="Solutions"
        style={{
          position: "absolute",
          top: "clamp(100px, 14vh, 140px)",
          right: "clamp(32px, 5vw, 80px)",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          alignItems: "flex-end",
        }}
      >
        {solutionItems.map((item, i) => (
          <a
            key={item.href}
            href={item.href}
            style={{
              display: "block",
              padding: "6px 16px",
              fontFamily: "var(--font-geist-mono, 'Geist Mono', monospace)",
              fontSize: "11px",
              fontWeight: 400,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              color: "#c8b4a0",
              border: "1px solid rgba(200, 180, 160, 0.2)",
              borderRadius: 2,
              transition: "border-color 0.25s ease, color 0.25s ease, background 0.25s ease",
              opacity: 0,
              animation: `solutionLabelIn 0.5s ease ${0.6 + i * 0.1}s forwards`,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(200, 180, 160, 0.5)";
              e.currentTarget.style.color = "#f8f7f5";
              e.currentTarget.style.background = "rgba(200, 180, 160, 0.08)";
              setPreview(item);
              setVisible(true);
              updatePos(e);
            }}
            onMouseMove={(e) => {
              updatePos(e);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(200, 180, 160, 0.2)";
              e.currentTarget.style.color = "#c8b4a0";
              e.currentTarget.style.background = "transparent";
              setVisible(false);
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* ── Floating preview card ─────────────────────────────────────────── */}
      {preview && (
        <div
          style={{
            position: "fixed",
            left: pos.x,
            top: pos.y,
            zIndex: 1000,
            pointerEvents: "none",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0) scale(1)" : "translateY(10px) scale(0.95)",
            transition: "opacity 0.25s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <div
            style={{
              background: "#1a1a1a",
              borderRadius: 16,
              padding: 8,
              boxShadow:
                "0 25px 50px -12px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1), 0 0 60px rgba(200,180,160,0.1)",
              overflow: "hidden",
              backdropFilter: "blur(10px)",
            }}
          >
            <img
              src={preview.image}
              alt={preview.title}
              style={{
                width: 280,
                height: "auto",
                borderRadius: 10,
                display: "block",
              }}
            />
            <div
              style={{
                padding: "12px 8px 4px",
                fontSize: "0.85rem",
                color: "#fff",
                fontWeight: 600,
                fontFamily: "var(--font-geist-mono, 'Geist Mono', monospace)",
              }}
            >
              {preview.title}
            </div>
            <div
              style={{
                padding: "0 8px 8px",
                fontSize: "0.75rem",
                color: "#888",
              }}
            >
              {preview.subtitle}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Hero Section ──────────────────────────────────────────────────────────
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

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: "#000",
      }}
    >
      {/* ── Hero background image ──────────────────────────────────────── */}
      <img
        src="/hero_figure.png"
        alt=""
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center top",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      {/* ── Spline 3D background (temporarily disabled) ────────────────── */}
      {/*
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
      */}

      {/* ── Spline logo cover (temporarily disabled) ─────────────────────── */}
      {/*
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 23,
          right: 15,
          width: 140,
          height: 32,
          background: "#6b7f62",
          zIndex: 1,
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
      */}

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

      {/* ── Solution labels — top right ──────────────────────────────────── */}
      <SolutionLabels />

      {/* ── Hero headline — top left ─────────────────────────────────────── */}
      <h1
        style={{
          position: "absolute",
          top: "clamp(100px, 14vh, 140px)",
          left: "clamp(32px, 5vw, 80px)",
          zIndex: 10,
          fontFamily: "var(--font-monument, 'Monument Extended', sans-serif)",
          fontSize: "clamp(0.5rem, 6vw, 5.5rem)",
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
          color: "#c8b4a0",
          margin: 0,
          pointerEvents: "auto",
          cursor: "default",
        }}
      >
        <HeroScrambleText
          lines={["ENTER THE.", "DIGITAL.", "ERA."]}
          entranceDelay={300}
        />
      </h1>

      {/* ── Hero subheadline — right ─────────────────────────────────────── */}
      <h2
        style={{
          position: "absolute",
          bottom: "10%",
          right: "clamp(32px, 5vw, 80px)",
          transform: "translateY(-50%)",
          textAlign: "right",
          zIndex: 10,
          fontFamily: "var(--font-geist-mono, 'Geist Mono', monospace)",
          fontSize: "clamp(0.5rem, 6vw, 1.5rem)",
          fontWeight: 100,
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
          color: "#ebebebff",
          margin: 0,
          pointerEvents: "auto",
          cursor: "default",
        }}
      >
        <HeroScrambleText
          lines={[
            "KONAVERSE PROVIDES YOU",
            "WITH THE TOOLS TO",
            "BUILD YOUR OWN",
            "DIGITAL REALM",
          ]}
          entranceDelay={800}
        />
      </h2>


    </div>
  );
}

export default HeroSection;
