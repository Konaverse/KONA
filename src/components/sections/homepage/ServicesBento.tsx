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
    image: "/General/ssm-green-futuristic.png",
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
];

// Desktop grid: 10-column (each 1/5 = 2 cols), 3 equal rows
// Row 1: Title(1/7 = 3/5) | Card01 Web Design(7/11 = 2/5)
// Row 2: Card02 Web Dev(1/5 = 2/5) | Card03 Videography(5/11 = 3/5)
// Row 3: Card04 Video Editing(1/7 = 3/5) | Card05 SEO(7/11 = 2/5)
const PLACEMENTS = [
  { col: "7 / 11", row: "1 / 2" }, // 01 Web Design    2/5 right
  { col: "1 / 5",  row: "2 / 3" }, // 02 Web Dev        2/5 left
  { col: "5 / 11", row: "2 / 3" }, // 03 Videography    3/5 right
  { col: "1 / 7",  row: "3 / 4" }, // 04 Video Editing  3/5 left
  { col: "7 / 11", row: "3 / 4" }, // 05 SEO            2/5 right
];

// ── Card component ──────────────────────────────────
// Every card uses the same column-flex structure:
//   [row: num ←————————————————→ icon]
//   [title]
//   [desc — grows to fill space]
//   [pills row]
// Font sizes / padding scale via clamp so narrow & wide cards both look right.

interface CardProps {
  service: (typeof services)[number];
  delay?: number;
  isHovered?: boolean;
  isOtherHovered?: boolean;
  onHover?: () => void;
  onLeave?: () => void;
}

function BentoCard({
  service,
  delay = 0,
  isHovered: hovered = false,
  isOtherHovered = false,
  onHover,
  onLeave,
}: CardProps) {
  return (
    <motion.div
      style={{
        height: "100%",
        filter: isOtherHovered ? "blur(5px) brightness(0.42)" : "blur(0px) brightness(1)",
        transition: "filter 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        zIndex: hovered ? 10 : 1,
        position: "relative",
      }}
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
          border: `1px solid ${hovered ? "rgba(107,127,98,0.38)" : "rgba(255,255,255,0.07)"}`,
          // Consistent padding on all cards — enough breathing room regardless of card width
          padding: "1.8rem 1.8rem",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
          transition: "border-color 0.4s ease, transform 0.45s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s ease",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          boxShadow: hovered
            ? "0 28px 60px -14px rgba(0,0,0,0.55), 0 0 50px -12px rgba(107,127,98,0.15)"
            : "0 2px 20px -8px rgba(0,0,0,0.35)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        {/* ── Background image — fades in fully on hover ── */}
        {service.image && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              borderRadius: 20,
              overflow: "hidden",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
              pointerEvents: "none",
            }}
          >
            <Image
              src={service.image}
              alt={service.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
              priority={false}
            />
            {/* Bottom-to-top gradient keeps text readable over any image */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(10,10,12,0.97) 0%, rgba(10,10,12,0.6) 50%, rgba(10,10,12,0.2) 100%)",
                zIndex: 1,
              }}
            />
          </div>
        )}

        {/* Resting top-left sheen */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 20,
            background: "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, transparent 50%)",
            opacity: hovered ? 0 : 1,
            transition: "opacity 0.5s ease",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Accent bottom-edge glow on hover */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "10%",
            right: "10%",
            height: 1,
            background: `linear-gradient(90deg, transparent, ${ACCENT}66, transparent)`,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.5s ease",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* ══ CARD CONTENT — identical structure for every card ══ */}

        {/* Row 1: number (left) + icon box (right) */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
            zIndex: 3,
            position: "relative",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-jakarta), sans-serif",
              fontWeight: 200,
              fontSize: "0.65rem",
              letterSpacing: "0.22em",
              color: "rgba(255,255,255,0.18)",
              lineHeight: 1,
              paddingTop: "0.1rem", // optical alignment with icon box
            }}
          >
            {service.num}
          </span>

          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: hovered ? "rgba(107,127,98,0.1)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${hovered ? "rgba(107,127,98,0.42)" : "rgba(255,255,255,0.07)"}`,
              display: "grid",
              placeItems: "center",
              transition: "background 0.4s, border-color 0.4s",
              flexShrink: 0,
            }}
          >
            <span style={{ color: hovered ? ACCENT : "rgba(240,237,232,0.35)", transition: "color 0.4s" }}>
              {service.icon}
            </span>
          </div>
        </div>

        {/* Row 2: title */}
        <h3
          style={{
            fontFamily: "var(--font-cormorant), serif",
            // clamp scales title so it fills narrow (2/5) and wide (3/5) cards proportionally
            fontSize: "clamp(1.25rem, 2.2vw, 2rem)",
            fontWeight: 400,
            color: "#f0ede8",
            lineHeight: 1.1,
            marginBottom: "0.8rem",
            whiteSpace: "pre-line",
            flexShrink: 0,
            zIndex: 3,
            position: "relative",
          }}
        >
          {service.title}
        </h3>

        {/* Row 3: description — grows to fill remaining space */}
        <p
          style={{
            fontSize: "clamp(0.73rem, 0.88vw, 0.85rem)",
            fontWeight: 300,
            color: hovered ? "rgba(240,237,232,0.6)" : "rgba(240,237,232,0.36)",
            lineHeight: 1.72,
            fontFamily: "var(--font-jakarta), sans-serif",
            flexGrow: 1,
            margin: 0,
            transition: "color 0.4s",
            zIndex: 3,
            position: "relative",
          }}
        >
          {service.desc}
        </p>

        {/* Row 4: pills — pinned to bottom */}
        <div
          style={{
            display: "flex",
            gap: "0.4rem",
            marginTop: "1.4rem",
            flexWrap: "wrap",
            zIndex: 3,
            position: "relative",
            flexShrink: 0,
          }}
        >
          {service.pills.map((p) => (
            <span
              key={p}
              style={{
                fontSize: "0.55rem",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: hovered ? ACCENT : "rgba(240,237,232,0.28)",
                border: `1px solid ${hovered ? "rgba(107,127,98,0.35)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 20,
                padding: "0.28rem 0.75rem",
                fontFamily: "var(--font-jakarta), sans-serif",
                transition: "all 0.4s",
                whiteSpace: "nowrap",
              }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Mobile card ─────────────────────────────────────
function MobileCard({
  service,
  featured = false,
  delay = 0,
}: {
  service: (typeof services)[number];
  featured?: boolean;
  delay?: number;
}) {
  const [tap, setTap] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 1, ease: EASE, delay }}
      style={{ gridColumn: featured ? "1 / 3" : undefined }}
    >
      <div
        onTouchStart={() => setTap(true)}
        onTouchEnd={() => setTap(false)}
        style={{
          borderRadius: 18,
          border: `1px solid ${tap ? "rgba(107,127,98,0.3)" : "rgba(255,255,255,0.07)"}`,
          padding: featured ? "1.8rem 1.6rem" : "1.5rem 1.3rem",
          minHeight: featured ? 200 : 170,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          transition: "border-color 0.3s ease",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        {/* Base sheen */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, transparent 50%)", pointerEvents: "none", zIndex: 0 }} />

        {/* Always-visible dim image for featured */}
        {featured && service.image && (
          <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden", borderRadius: 18 }}>
            <Image
              src={service.image}
              alt={service.title}
              fill
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center", opacity: 0.2 }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,12,0.97) 0%, rgba(10,10,12,0.5) 100%)" }} />
          </div>
        )}

        {/* Row 1: num + icon */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem", zIndex: 1, position: "relative", flexShrink: 0 }}>
          <span style={{ fontFamily: "var(--font-jakarta), sans-serif", fontWeight: 200, fontSize: "0.6rem", letterSpacing: "0.22em", color: "rgba(255,255,255,0.15)" }}>
            {service.num}
          </span>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ color: "rgba(240,237,232,0.3)" }}>{service.icon}</span>
          </div>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: featured ? "1.7rem" : "1.22rem",
            fontWeight: 400,
            color: "#f0ede8",
            lineHeight: 1.12,
            marginBottom: "0.65rem",
            whiteSpace: "pre-line",
            flexShrink: 0,
            zIndex: 1,
            position: "relative",
          }}
        >
          {service.title}
        </h3>

        {/* Desc */}
        <p
          style={{
            fontSize: "0.75rem",
            fontWeight: 300,
            color: "rgba(240,237,232,0.4)",
            lineHeight: 1.68,
            fontFamily: "var(--font-jakarta), sans-serif",
            margin: 0,
            flexGrow: 1,
            zIndex: 1,
            position: "relative",
            // Only show desc on featured; hide via maxHeight on small cards to keep height consistent
            display: featured ? undefined : "none",
          }}
        >
          {service.desc}
        </p>

        {/* Pills */}
        <div
          style={{
            display: "flex",
            gap: "0.35rem",
            marginTop: "1rem",
            flexWrap: "wrap",
            zIndex: 1,
            position: "relative",
            flexShrink: 0,
          }}
        >
          {service.pills.map((p) => (
            <span
              key={p}
              style={{
                fontSize: "0.5rem",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(240,237,232,0.27)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 20,
                padding: "0.22rem 0.6rem",
                fontFamily: "var(--font-jakarta), sans-serif",
              }}
            >
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
            // All 3 card rows share the same height — title row is taller for the headline
            gridTemplateRows: "310px 290px 290px",
            gap: 14,
          }}
        >
          {/* Title cell */}
          <motion.div
            style={{
              gridColumn: "1 / 7",
              gridRow: "1 / 2",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              paddingBottom: "2.4rem",
            }}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: EASE }}
          >
            <div style={{ containerType: "inline-size", width: "100%" }}>
              <h2
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "16cqi",
                  fontWeight: 300,
                  lineHeight: 0.85,
                  letterSpacing: "-0.02em",
                  color: "#f0ede8",
                  margin: 0,
                  whiteSpace: "nowrap",
                }}
              >
                What We <em style={{ fontStyle: "italic", color: ACCENT }}>Do.</em>
              </h2>
            </div>
          </motion.div>

          {/* Service cards */}
          {services.map((service, i) => (
            <div key={i} style={{ gridColumn: PLACEMENTS[i].col, gridRow: PLACEMENTS[i].row }}>
              <BentoCard
                service={service}
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
              <h2
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "16.5cqi",
                  fontWeight: 300,
                  lineHeight: 0.85,
                  letterSpacing: "-0.02em",
                  color: "#f0ede8",
                  margin: 0,
                  whiteSpace: "nowrap",
                }}
              >
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
