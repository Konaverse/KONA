"use client";

import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const ACCENT = "#6B7F62";
const EASE = [0.16, 1, 0.3, 1] as const;

const testimonials = [
  {
    index: "I",
    quote:
      "Konaverse transformed our digital presence entirely. The attention to detail in both design and development was unlike anything we'd experienced before.",
    name: "Amara Laurent",
    role: "CEO, Meridian Studios",
    service: "Web Design",
  },
  {
    index: "II",
    quote:
      "The brand film they produced captured exactly what we couldn't put into words. Cinematic quality that elevated our entire brand perception overnight.",
    name: "Jonas Reyes",
    role: "Founder, Onda Collective",
    service: "Videography",
  },
  {
    index: "III",
    quote:
      "From concept to launch in six weeks — the result was a platform our users genuinely love. Performance scores through the roof, elegance throughout.",
    name: "Sofia Kim",
    role: "CTO, Noctis Finance",
    service: "Development",
  },
];

// ── Ambient background canvas ────────────────────────────────────────────
function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    type Dust = { x: number; y: number; vx: number; vy: number; r: number; a: number };
    const dust: Dust[] = Array.from({ length: 48 }, () => ({
      x: Math.random() * (canvas.width || 1200),
      y: Math.random() * (canvas.height || 600),
      vx: (Math.random() - 0.5) * 0.14,
      vy: -(Math.random() * 0.18 + 0.03),
      r: Math.random() * 1.1 + 0.2,
      a: Math.random() * 0.22 + 0.04,
    }));

    type Ripple = { x: number; y: number; radius: number; maxR: number; speed: number; baseA: number };
    const ripples: Ripple[] = Array.from({ length: 5 }, () => ({
      x: Math.random() * (canvas.width || 1200),
      y: Math.random() * (canvas.height || 600),
      radius: Math.random() * 120,
      maxR: Math.random() * 200 + 80,
      speed: Math.random() * 0.4 + 0.2,
      baseA: Math.random() * 0.08 + 0.03,
    }));
    let lastSpawn = -999;

    const tick = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (t - lastSpawn > 900) {
        lastSpawn = t;
        ripples.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: 0,
          maxR: Math.random() * 200 + 80,
          speed: Math.random() * 0.4 + 0.2,
          baseA: Math.random() * 0.08 + 0.03,
        });
      }
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        const p = r.radius / r.maxR;
        if (p >= 1) { ripples.splice(i, 1); continue; }
        const alpha = r.baseA * Math.sin(p * Math.PI);
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(107,127,98,${alpha.toFixed(3)})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
      dust.forEach((p) => {
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
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}
    />
  );
}

// ── Single card ──────────────────────────────────────────────────────────
function TestimonialCard({
  t,
  delay,
  isHovered,
  isOtherHovered,
  onHover,
  onLeave,
  isMobile,
}: {
  t: typeof testimonials[0];
  delay: number;
  isHovered: boolean;
  isOtherHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  isMobile: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.3, ease: EASE, delay }}
      style={{
        // On mobile never dim cards — no hover interaction
        filter: !isMobile && isOtherHovered ? "blur(4px) brightness(0.45)" : "blur(0px) brightness(1)",
        transition: "filter 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        zIndex: isHovered ? 10 : 1,
        position: "relative",
        height: "100%",
      }}
    >
      <div
        onMouseEnter={isMobile ? undefined : onHover}
        onMouseLeave={isMobile ? undefined : onLeave}
        style={{
          height: "100%",
          borderRadius: 20,
          border: `1px solid ${isHovered ? "rgba(107,127,98,0.38)" : "rgba(255,255,255,0.07)"}`,
          padding: isMobile ? "1.6rem 1.4rem" : "2rem 2rem",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          cursor: "default",
          background: isHovered ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.02)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          transform: isHovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: isHovered
            ? "0 30px 70px -16px rgba(0,0,0,0.55), 0 0 50px -14px rgba(107,127,98,0.12)"
            : "0 2px 24px -8px rgba(0,0,0,0.4)",
          transition:
            "border-color 0.4s ease, background 0.4s ease, transform 0.45s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s ease",
        }}
      >
        {/* Glass sheen */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, transparent 45%)", pointerEvents: "none", zIndex: 0 }} />

        {/* Accent bottom line on hover */}
        <div style={{ position: "absolute", bottom: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(90deg, transparent, ${ACCENT}55, transparent)`, opacity: isHovered ? 1 : 0, transition: "opacity 0.5s ease", zIndex: 0, pointerEvents: "none" }} />

        {/* Row 1: index + service tag */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: isMobile ? "1.4rem" : "1.8rem", zIndex: 1, position: "relative", flexShrink: 0 }}>
          <span style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 300, fontSize: isMobile ? "0.85rem" : "0.9rem", letterSpacing: "0.12em", color: isHovered ? ACCENT : "rgba(107,127,98,0.5)", fontStyle: "italic", transition: "color 0.4s" }}>
            {t.index}
          </span>
          <span style={{ fontFamily: "var(--font-jakarta), sans-serif", fontWeight: 500, fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", color: isHovered ? ACCENT : "rgba(240,237,232,0.22)", border: `1px solid ${isHovered ? "rgba(107,127,98,0.35)" : "rgba(255,255,255,0.06)"}`, borderRadius: 20, padding: "0.28rem 0.75rem", transition: "all 0.4s" }}>
            {t.service}
          </span>
        </div>

        {/* Opening quote mark */}
        <div style={{ fontFamily: "var(--font-cormorant), serif", fontSize: isMobile ? "2.8rem" : "3.5rem", lineHeight: 0.7, color: isHovered ? ACCENT : "rgba(107,127,98,0.28)", transition: "color 0.5s", marginBottom: "0.5rem", zIndex: 1, position: "relative", userSelect: "none", flexShrink: 0 }}>
          &ldquo;
        </div>

        {/* Quote body — grows */}
        <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: isMobile ? "clamp(1.05rem, 4.5vw, 1.2rem)" : "clamp(1.1rem, 1.4vw, 1.35rem)", fontWeight: 300, fontStyle: "italic", color: isHovered ? "rgba(240,237,232,0.9)" : "rgba(240,237,232,0.6)", lineHeight: 1.6, margin: 0, flexGrow: 1, zIndex: 1, position: "relative", transition: "color 0.4s" }}>
          {t.quote}
        </p>

        {/* Divider */}
        <div style={{ height: 1, background: `linear-gradient(90deg, ${ACCENT}30, rgba(255,255,255,0.05) 60%, transparent)`, margin: isMobile ? "1.2rem 0" : "1.6rem 0", zIndex: 1, position: "relative", flexShrink: 0 }} />

        {/* Attribution */}
        <div style={{ zIndex: 1, position: "relative", flexShrink: 0 }}>
          <div style={{ fontFamily: "var(--font-jakarta), sans-serif", fontWeight: 400, fontSize: isMobile ? "0.78rem" : "0.82rem", color: "#f0ede8", letterSpacing: "0.01em", marginBottom: "0.25rem" }}>
            {t.name}
          </div>
          <div style={{ fontFamily: "var(--font-jakarta), sans-serif", fontWeight: 300, fontSize: "0.62rem", letterSpacing: "0.08em", color: "rgba(240,237,232,0.38)" }}>
            {t.role}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main section ─────────────────────────────────────────────────────────
export default function TestimonialsSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Vertical offsets for the desktop staggered layout
  const desktopOffsets = ["0rem", "3.5rem", "1rem"];

  return (
    <section
      style={{
        position: "relative",
        background: "#0a0a0c",
        padding: isMobile ? "10vh 0 12vh" : "14vh 0 16vh",
        overflow: "hidden",
      }}
    >
      <AmbientBackground />

      {/* Accent orbs */}
      <div aria-hidden style={{ position: "absolute", width: isMobile ? "70vw" : "40vw", height: isMobile ? "70vw" : "40vw", borderRadius: "50%", background: "rgba(107,127,98,0.2)", filter: "blur(12vw)", top: "-10%", right: "-10%", pointerEvents: "none", zIndex: 0 }} />
      <div aria-hidden style={{ position: "absolute", width: isMobile ? "50vw" : "25vw", height: isMobile ? "50vw" : "25vw", borderRadius: "50%", background: "rgba(107,127,98,0.13)", filter: "blur(10vw)", bottom: "5%", left: "-5%", pointerEvents: "none", zIndex: 0 }} />

      <div className="w-full px-5 mx-auto" style={{ position: "relative", zIndex: 2 }}>

        {/* ── Section header ── */}
        {isMobile ? (
          // Mobile: stacked, full-width
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.3, ease: EASE }}
            style={{ marginBottom: "2.8rem" }}
          >
            <p style={{ fontFamily: "var(--font-jakarta), sans-serif", fontWeight: 500, fontSize: "0.58rem", letterSpacing: "0.28em", textTransform: "uppercase", color: ACCENT, marginBottom: "1rem" }}>
              Client Voices
            </p>
            <div style={{ containerType: "inline-size", width: "100%" }}>
              <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "14.5cqi", fontWeight: 300, lineHeight: 0.9, letterSpacing: "-0.02em", color: "#f0ede8", margin: 0, whiteSpace: "nowrap" }}>
                What They <em style={{ fontStyle: "italic", color: ACCENT }}>Say.</em>
              </h2>
            </div>
            <p style={{ fontFamily: "var(--font-jakarta), sans-serif", fontWeight: 300, fontSize: "0.78rem", color: "rgba(240,237,232,0.32)", lineHeight: 1.7, marginTop: "1.2rem", maxWidth: "90%" }}>
              Real words from real partners. The relationships we build are as considered as the work we deliver.
            </p>
          </motion.div>
        ) : (
          // Desktop: headline left, pull-quote right
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "4rem", gap: "2rem" }}>
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: EASE }}
            >
              <p style={{ fontFamily: "var(--font-jakarta), sans-serif", fontWeight: 500, fontSize: "0.6rem", letterSpacing: "0.28em", textTransform: "uppercase", color: ACCENT, marginBottom: "1.2rem" }}>
                Client Voices
              </p>
              <div style={{ containerType: "inline-size", width: "clamp(260px, 45vw, 600px)" }}>
                <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(3rem, 8cqi, 5.5rem)", fontWeight: 300, lineHeight: 0.9, letterSpacing: "-0.02em", color: "#f0ede8", margin: 0 }}>
                  What They{" "}
                  <em style={{ fontStyle: "italic", color: ACCENT }}>Say.</em>
                </h2>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.3, ease: EASE, delay: 0.2 }}
              style={{ fontFamily: "var(--font-jakarta), sans-serif", fontWeight: 300, fontSize: "clamp(0.75rem, 0.9vw, 0.88rem)", color: "rgba(240,237,232,0.35)", lineHeight: 1.72, maxWidth: 280, flexShrink: 0, paddingBottom: "0.4rem" }}
            >
              Real words from real partners — the relationships we build are as considered as the work we deliver.
            </motion.p>
          </div>
        )}

        {/* ── Cards ── */}
        {isMobile ? (
          // Mobile: single column, no stagger
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {testimonials.map((t, i) => (
              <TestimonialCard
                key={i}
                t={t}
                delay={i * 0.1}
                isHovered={false}
                isOtherHovered={false}
                onHover={() => { }}
                onLeave={() => { }}
                isMobile
              />
            ))}
          </div>
        ) : (
          // Desktop: 3-column with vertical stagger
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, alignItems: "start" }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ paddingTop: desktopOffsets[i] }}>
                <TestimonialCard
                  t={t}
                  delay={0.08 + i * 0.08}
                  isHovered={hoveredCard === i}
                  isOtherHovered={hoveredCard !== null && hoveredCard !== i}
                  onHover={() => setHoveredCard(i)}
                  onLeave={() => setHoveredCard(null)}
                  isMobile={false}
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
