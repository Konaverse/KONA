"use client";

import { useState } from "react";

const ACCENT = "#6B7F62";

const services = [
  {
    num: "01",
    title: "Professional\nWeb Design",
    desc: "Pixel-perfect interfaces that balance aesthetics with intuitive user journeys.",
    pills: ["UI/UX", "Responsive"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
        <rect x="3" y="3" width="18" height="14" rx="2" /><path d="M3 17h18" /><path d="M8 21h8" /><path d="M12 17v4" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Secure Web\nDevelopment",
    desc: "Robust, scalable applications built with modern frameworks and security-first architecture.",
    pills: ["Full-Stack", "Security"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
        <path d="M10 20l4-16" /><path d="M6 8l-4 4 4 4" /><path d="M18 8l4 4-4 4" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Cinematic\nVideography",
    desc: "Story-driven visuals captured with cinema-grade equipment and an editorial eye.",
    pills: ["4K+", "Narrative"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
        <rect x="2" y="4" width="15" height="16" rx="2" /><path d="M17 8l5-3v14l-5-3" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Video\nEditing",
    desc: "Precision post-production that transforms raw footage into polished, compelling stories.",
    pills: ["Color Grade", "Motion"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
        <rect x="2" y="2" width="20" height="20" rx="2" /><path d="M2 12h6l3-4 4 8 3-4h4" />
      </svg>
    ),
  },
  {
    num: "05",
    title: "SEO &\nStrategy",
    desc: "Data-driven optimization that puts your brand in front of the right audience at the right time.",
    pills: ["Analytics", "Growth"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
        <circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><ellipse cx="12" cy="12" rx="4" ry="10" />
      </svg>
    ),
  },
  {
    num: "06",
    title: "Brand\nIdentity",
    desc: "Cohesive visual systems — from logos to guidelines — that make your brand unmistakable.",
    pills: ["Logo", "Guidelines"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
];

export default function ServicesCarousel() {
  const [active, setActive] = useState(0);
  const total = services.length;

  const goTo = (idx: number) => setActive(((idx % total) + total) % total);

  const getTransform = (i: number) => {
    let diff = i - active;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    const abs = Math.abs(diff);
    const x = diff * 280;
    const z = -abs * 200;
    const rotY = diff * -12;
    const s = Math.max(0.6, 1 - abs * 0.15);
    const opacity = abs > 2 ? 0 : Math.max(0, 1 - abs * 0.35);
    const zIdx = 10 - abs;
    return { x, z, rotY, s, opacity, zIdx, isActive: abs === 0, abs };
  };

  return (
    <section
      style={{
        position: "relative",
        padding: "12vh 0 14vh",
        overflow: "hidden",
        background: "#0a0a0c",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "5rem" }}>
        <p style={{ fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: ACCENT, marginBottom: "1.2rem", fontFamily: "var(--font-jakarta), sans-serif" }}>
          What We Do
        </p>
        <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(2.5rem, 4vw, 4rem)", fontWeight: 300, color: "#f0ede8" }}>
          Our Services
        </h2>
      </div>

      {/* 3D Carousel */}
      <div style={{ position: "relative", width: "100%", height: 520, perspective: 1200, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 340, height: 460, transformStyle: "preserve-3d" }}>
          {services.map((s, i) => {
            const { x, z, rotY, s: sc, opacity, zIdx, isActive, abs } = getTransform(i);
            return (
              <div
                key={i}
                onClick={() => { if (i !== active) goTo(i); }}
                style={{
                  position: "absolute",
                  width: 340,
                  height: 460,
                  background: isActive ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${isActive ? "rgba(107,127,98,0.3)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 24,
                  padding: "2.4rem 2rem",
                  backdropFilter: "blur(40px)",
                  WebkitBackdropFilter: "blur(40px)",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  transform: `translateX(${x}px) translateZ(${z}px) rotateY(${rotY}deg) scale(${sc})`,
                  opacity,
                  zIndex: zIdx,
                  pointerEvents: abs > 2 ? "none" : "auto",
                  transition: "all 0.7s cubic-bezier(0.23,1,0.32,1)",
                  boxShadow: isActive ? "0 40px 100px -20px rgba(0,0,0,0.6), 0 0 80px -10px rgba(107,127,98,0.15)" : "none",
                  overflow: "hidden",
                  backfaceVisibility: "hidden",
                }}
              >
                {/* Sheen */}
                <div style={{ position: "absolute", inset: 0, borderRadius: 24, background: "linear-gradient(160deg, rgba(255,255,255,0.07) 0%, transparent 40%)", pointerEvents: "none" }} />

                <div style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 200, fontSize: "0.75rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.15)", marginBottom: "2rem" }}>
                  {s.num}
                </div>

                <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.04)", border: `1px solid ${isActive ? ACCENT : "rgba(255,255,255,0.07)"}`, display: "grid", placeItems: "center", marginBottom: "2rem", transition: "border-color 0.4s" }}>
                  <span style={{ color: isActive ? ACCENT : "rgba(240,237,232,0.45)", transition: "color 0.4s" }}>
                    {s.icon}
                  </span>
                </div>

                <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.65rem", fontWeight: 400, color: "#f0ede8", lineHeight: 1.2, marginBottom: "1rem", whiteSpace: "pre-line" }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: "0.82rem", fontWeight: 300, color: "rgba(240,237,232,0.45)", lineHeight: 1.7, flexGrow: 1, fontFamily: "var(--font-jakarta), sans-serif" }}>
                  {s.desc}
                </p>

                <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.8rem", flexWrap: "wrap" }}>
                  {s.pills.map((p) => (
                    <span
                      key={p}
                      style={{
                        fontSize: "0.6rem",
                        fontWeight: 500,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: isActive ? ACCENT : "rgba(240,237,232,0.45)",
                        border: `1px solid ${isActive ? "rgba(107,127,98,0.3)" : "rgba(255,255,255,0.08)"}`,
                        borderRadius: 20,
                        padding: "0.35rem 0.85rem",
                        transition: "all 0.4s",
                        fontFamily: "var(--font-jakarta), sans-serif",
                      }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nav */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "2rem", marginTop: "3rem" }}>
        <button
          onClick={() => goTo(active - 1)}
          aria-label="Previous"
          style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(240,237,232,0.45)", display: "grid", placeItems: "center", cursor: "pointer", backdropFilter: "blur(20px)", transition: "all 0.3s" }}
        >
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 5l-7 7 7 7" /></svg>
        </button>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {services.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: i === active ? 24 : 6,
                height: 6,
                borderRadius: i === active ? 3 : "50%",
                background: i === active ? ACCENT : "rgba(255,255,255,0.12)",
                boxShadow: i === active ? "0 0 10px rgba(107,127,98,0.5)" : "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>
        <button
          onClick={() => goTo(active + 1)}
          aria-label="Next"
          style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(240,237,232,0.45)", display: "grid", placeItems: "center", cursor: "pointer", backdropFilter: "blur(20px)", transition: "all 0.3s" }}
        >
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
        </button>
      </div>
    </section>
  );
}
