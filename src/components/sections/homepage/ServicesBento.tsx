"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

const ACCENT = "#6B7F62";
const EASE = [0.16, 1, 0.3, 1] as const;

const services = [
  {
    num: "01",
    title: "Professional\nWeb Design",
    desc: "Pixel-perfect interfaces that balance aesthetics with intuitive user journeys.",
    pills: ["UI/UX", "Responsive"],
    image: "/General/web-dev.png",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" width={20} height={20}>
        <rect x="3" y="3" width="18" height="14" rx="2" /><path d="M3 17h18" /><path d="M8 21h8" /><path d="M12 17v4" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Secure Web\nDevelopment",
    desc: "Robust, scalable applications built with modern frameworks and security-first architecture.",
    pills: ["Full-Stack", "Security"],
    image: "/General/web-app-green-futuristic.png",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" width={20} height={20}>
        <path d="M10 20l4-16" /><path d="M6 8l-4 4 4 4" /><path d="M18 8l4 4-4 4" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Cinematic\nVideography",
    desc: "Story-driven visuals captured with cinema-grade equipment and an editorial eye.",
    pills: ["4K+", "Narrative"],
    image: "/General/videography.png",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" width={20} height={20}>
        <rect x="2" y="4" width="15" height="16" rx="2" /><path d="M17 8l5-3v14l-5-3" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Video\nEditing",
    desc: "Precision post-production that transforms raw footage into polished, compelling stories.",
    pills: ["Color Grade", "Motion"],
    image: "/General/videography-green-futuristic.png",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" width={20} height={20}>
        <rect x="2" y="2" width="20" height="20" rx="2" /><path d="M2 12h6l3-4 4 8 3-4h4" />
      </svg>
    ),
  },
  {
    num: "05",
    title: "SEO &\nStrategy",
    desc: "Data-driven optimization that puts your brand in front of the right audience at the right time.",
    pills: ["Analytics", "Growth"],
    image: "/General/digital-ads-green-futuristic.png",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" width={20} height={20}>
        <circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><ellipse cx="12" cy="12" rx="4" ry="10" />
      </svg>
    ),
  },
  {
    num: "06",
    title: "Brand\nIdentity",
    desc: "Cohesive visual systems — from logos to guidelines — that make your brand unmistakable.",
    pills: ["Logo", "Guidelines"],
    image: "/General/brands.jpg",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" width={20} height={20}>
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
];

// Desktop grid placement: 10-column grid, 3 rows
// Row 1: Title(1-7) | Card01(7-11)
// Row 2: Card02(1-4) | Card03(4-7) | Card04(7-11)
// Row 3: Card05(1-5) | Card06(5-11)
const PLACEMENTS = [
  { col: "7 / 11", row: "1 / 2" }, // 01
  { col: "1 / 4",  row: "2 / 3" }, // 02
  { col: "4 / 7",  row: "2 / 3" }, // 03
  { col: "7 / 11", row: "2 / 3" }, // 04
  { col: "1 / 5",  row: "3 / 4" }, // 05
  { col: "5 / 11", row: "3 / 4" }, // 06
];

// ── Card component ──────────────────────────────────
interface CardProps {
  service: (typeof services)[number];
  wide?: boolean;  // 6-col bottom card
  delay?: number;
  isHovered?: boolean;
  isOtherHovered?: boolean;
  onHover?: () => void;
  onLeave?: () => void;
}

function BentoCard({ service, wide = false, delay = 0, isHovered: hovered = false, isOtherHovered = false, onHover, onLeave }: CardProps) {
  return (
    <motion.div
      style={{ height: "100%", filter: isOtherHovered ? "blur(8px) brightness(0.5)" : "blur(0px) brightness(1)", transition: "filter 0.5s cubic-bezier(0.16, 1, 0.3, 1)", zIndex: hovered ? 10 : 1, position: "relative" }}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.3, ease: EASE, delay }}
    >
      <div
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        style={{
          height: "100%",
          borderRadius: 20,
          background: hovered ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${hovered ? "rgba(107,127,98,0.28)" : "rgba(255,255,255,0.07)"}`,
          padding: wide ? "2.4rem 2.8rem" : "2rem 1.8rem",
          display: "flex",
          flexDirection: wide ? "row" : "column",
          gap: wide ? "3rem" : undefined,
          alignItems: wide ? "center" : undefined,
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
          transition: "border-color 0.4s ease, background 0.4s ease, transform 0.45s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s ease",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          boxShadow: hovered
            ? "0 28px 60px -14px rgba(0,0,0,0.45), 0 0 40px -12px rgba(107,127,98,0.12)"
            : "0 2px 20px -8px rgba(0,0,0,0.3)",
        }}
      >
        {/* Background Image Overlay */}
        <div 
          style={{ 
            position: "absolute", 
            inset: 0, 
            zIndex: 0,
            opacity: hovered ? 0.45 : 0, 
            transition: "opacity 0.6s ease",
            pointerEvents: "none"
          }}
        >
          {service.image && (
             <Image src={service.image} alt={service.title} fill className="object-cover" />
          )}
          <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(to top, rgba(10,10,12,0.95), rgba(10,10,12,0.2))" }} />
        </div>

        {/* Top-left sheen */}
        <div style={{ position: "absolute", zIndex: 1, inset: 0, borderRadius: 20, background: "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, transparent 40%)", pointerEvents: "none" }} />

        {wide ? (
          // Wide card (06) — horizontal layout
          <>
            <div style={{ flexShrink: 0 }}>
              <div style={{ fontFamily: "var(--font-jakarta), sans-serif", fontWeight: 200, fontSize: "0.68rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.12)", marginBottom: "1.8rem" }}>
                {service.num}
              </div>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.03)", border: `1px solid ${hovered ? "rgba(107,127,98,0.35)" : "rgba(255,255,255,0.07)"}`, display: "grid", placeItems: "center", transition: "border-color 0.4s" }}>
                <span style={{ color: hovered ? ACCENT : "rgba(240,237,232,0.35)", transition: "color 0.4s" }}>
                  {service.icon}
                </span>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(1.6rem, 2vw, 2.2rem)", fontWeight: 400, color: "#f0ede8", lineHeight: 1.12, marginBottom: "0.9rem", whiteSpace: "pre-line" }}>
                {service.title}
              </h3>
              <p style={{ fontSize: "0.82rem", fontWeight: 300, color: "rgba(240,237,232,0.42)", lineHeight: 1.72, fontFamily: "var(--font-jakarta), sans-serif", margin: 0 }}>
                {service.desc}
              </p>
            </div>

            <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "flex-end" }}>
              {service.pills.map((p) => (
                <span key={p} style={{ fontSize: "0.58rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: hovered ? ACCENT : "rgba(240,237,232,0.3)", border: `1px solid ${hovered ? "rgba(107,127,98,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 20, padding: "0.3rem 0.85rem", fontFamily: "var(--font-jakarta), sans-serif", transition: "all 0.4s", whiteSpace: "nowrap" }}>
                  {p}
                </span>
              ))}
            </div>
          </>
        ) : (
          // Standard vertical card
          <>
            <div style={{ fontFamily: "var(--font-jakarta), sans-serif", fontWeight: 200, fontSize: "0.68rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.12)", marginBottom: "1.6rem" }}>
              {service.num}
            </div>

            <div style={{ width: 44, height: 44, borderRadius: 13, background: "rgba(255,255,255,0.03)", border: `1px solid ${hovered ? "rgba(107,127,98,0.35)" : "rgba(255,255,255,0.07)"}`, display: "grid", placeItems: "center", marginBottom: "1.8rem", flexShrink: 0, transition: "border-color 0.4s" }}>
              <span style={{ color: hovered ? ACCENT : "rgba(240,237,232,0.35)", transition: "color 0.4s" }}>
                {service.icon}
              </span>
            </div>

            <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(1.3rem, 1.6vw, 1.75rem)", fontWeight: 400, color: "#f0ede8", lineHeight: 1.14, marginBottom: "0.85rem", whiteSpace: "pre-line", flexShrink: 0 }}>
              {service.title}
            </h3>

            <p style={{ fontSize: "0.78rem", fontWeight: 300, color: "rgba(240,237,232,0.4)", lineHeight: 1.72, fontFamily: "var(--font-jakarta), sans-serif", flexGrow: 1, margin: 0 }}>
              {service.desc}
            </p>

            <div style={{ display: "flex", gap: "0.45rem", marginTop: "1.6rem", flexWrap: "wrap" }}>
              {service.pills.map((p) => (
                <span key={p} style={{ fontSize: "0.57rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: hovered ? ACCENT : "rgba(240,237,232,0.28)", border: `1px solid ${hovered ? "rgba(107,127,98,0.28)" : "rgba(255,255,255,0.06)"}`, borderRadius: 20, padding: "0.28rem 0.72rem", fontFamily: "var(--font-jakarta), sans-serif", transition: "all 0.4s" }}>
                  {p}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

// ── Mobile card ─────────────────────────────────────
function MobileCard({ service, featured = false, delay = 0 }: { service: (typeof services)[number]; featured?: boolean; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 1, ease: EASE, delay }}
      style={{ gridColumn: featured ? "1 / 3" : undefined }}
    >
      <div style={{ borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", padding: featured ? "1.8rem 1.6rem" : "1.5rem 1.4rem", minHeight: featured ? 190 : 175, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 16, background: "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, transparent 45%)", pointerEvents: "none" }} />
        <div style={{ fontFamily: "var(--font-jakarta), sans-serif", fontWeight: 200, fontSize: "0.62rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.12)", marginBottom: "1rem" }}>
          {service.num}
        </div>
        <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: featured ? "1.65rem" : "1.2rem", fontWeight: 400, color: "#f0ede8", lineHeight: 1.14, marginBottom: featured ? "0.75rem" : 0, whiteSpace: "pre-line", flex: featured ? undefined : 1 }}>
          {service.title}
        </h3>
        {featured && (
          <p style={{ fontSize: "0.76rem", fontWeight: 300, color: "rgba(240,237,232,0.4)", lineHeight: 1.68, fontFamily: "var(--font-jakarta), sans-serif", margin: 0, flexGrow: 1 }}>
            {service.desc}
          </p>
        )}
        <div style={{ display: "flex", gap: "0.35rem", marginTop: featured ? "1.1rem" : "auto", flexWrap: "wrap" }}>
          {service.pills.map((p) => (
            <span key={p} style={{ fontSize: "0.52rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,237,232,0.27)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "0.22rem 0.6rem", fontFamily: "var(--font-jakarta), sans-serif" }}>
              {p}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Main section ────────────────────────────────────
export default function ServicesBento() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section style={{ background: "#0a0a0c", padding: "14vh 0 16vh" }}>
      <div className="w-full px-5 mx-auto">

        {/* ══ DESKTOP BENTO GRID ══════════════════════════════ */}
        <div
          className="hidden md:grid"
          style={{
            gridTemplateColumns: "repeat(10, 1fr)",
            gridTemplateRows: "310px 290px 190px",
            gap: 14,
          }}
        >
          {/* Title cell */}
          <motion.div
            style={{ gridColumn: "1 / 7", gridRow: "1 / 2", display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: "2.1rem" }}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: EASE }}
          >
            <div style={{ containerType: "inline-size", width: "100%" }}>
               <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "16cqi", fontWeight: 300, lineHeight: 0.85, letterSpacing: "-0.02em", color: "#f0ede8", margin: 0, whiteSpace: "nowrap" }}>
                 What We <em style={{ fontStyle: "italic", color: ACCENT }}>Do.</em>
               </h2>
            </div>
          </motion.div>

          {/* Service cards */}
          {services.map((service, i) => (
            <div key={i} style={{ gridColumn: PLACEMENTS[i].col, gridRow: PLACEMENTS[i].row, perspective: 1000 }}>
              <BentoCard
                service={service}
                wide={i === 5}
                delay={0.05 + i * 0.06}
                isHovered={hoveredCard === i}
                isOtherHovered={hoveredCard !== null && hoveredCard !== i}
                onHover={() => setHoveredCard(i)}
                onLeave={() => setHoveredCard(null)}
              />
            </div>
          ))}
        </div>

        {/* ══ MOBILE LAYOUT ═══════════════════════════════════ */}
        <div className="md:hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: EASE }}
            style={{ marginBottom: "2.8rem" }}
          >
            <div style={{ containerType: "inline-size", width: "100%" }}>
               <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "16.5cqi", fontWeight: 300, lineHeight: 0.85, letterSpacing: "-0.02em", color: "#f0ede8", margin: 0, whiteSpace: "nowrap" }}>
                 What We <em style={{ fontStyle: "italic", color: ACCENT }}>Do.</em>
               </h2>
            </div>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {services.map((service, i) => (
              <MobileCard
                key={i}
                service={service}
                featured={i === 0}
                delay={i * 0.05}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
