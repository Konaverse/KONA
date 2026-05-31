"use client";

import Image from "next/image";
import { useRef, useState, useEffect, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import ServicesSection from "./ServicesSection";

const ACCENT = "#6b7f62";
const INK = "#f4f3ef";

/* ── Clock geometry ──────────────────────────────────────────
   A big clock whose centre sits off the left edge of the viewport;
   most of the dial bleeds out to the left. Four cards are fixed to
   the rim at 3 / 12 / 9 / 6 o'clock. Scrolling spins the whole dial
   CLOCKWISE (φ increases): the card at 3 o'clock swings down to 6
   and off the bottom-left, while the card at 12 swings down into the
   3 o'clock dock. The 3 o'clock slot — the rim's rightmost point —
   is the only position comfortably inside the viewport, so exactly
   one card is "docked" and visible at a time.

   Units are vh throughout so the dial stays a true circle (vh is a
   px-based unit on both axes). */
const CX = -18; // dial centre x, offset from the left edge (vh)
const R = 50; // dial radius (vh)
const DOCK_X = CX + R; // x of the 3 o'clock dock (vh) → centre-left
// Base angle per card, measured clockwise from 3 o'clock (screen y-down):
// 0°→3 o'clock, 90°→6, 180°→9, 270°→12.
const BASE = [0, 270, 180, 90];

const rad = (deg: number) => (deg * Math.PI) / 180;
// shortest signed distance to the 3 o'clock dock, in degrees (−180..180)
const norm = (a: number) => {
  const m = ((a % 360) + 360) % 360;
  return m > 180 ? m - 360 : m;
};

type Service = {
  title: string;
  tags: string[];
  img: string;
  /* headline shown top-right while this card is docked (About-style two-tone) */
  lead: string;
  tail: string;
  pill: string;
};

const SERVICES: Service[] = [
  {
    title: "Web Development",
    tags: ["Next.js", "Web Apps", "E-commerce"],
    img: "/Hero/A_futuristic_workspace_featuring_holographic_202605290214.jpeg",
    lead: "We build web platforms",
    tail: "that load in under a second and scale without flinching.",
    pill: "/Hero/A_futuristic_workspace_featuring_holographic_202605290214.jpeg",
  },
  {
    title: "UI / UX Design",
    tags: ["Interfaces", "Design Systems", "Prototyping"],
    img: "/Hero/A_heavily_distorted_close-up_of_202605290214.jpeg",
    lead: "We design interfaces",
    tail: "that feel inevitable — clear, calm, and quietly precise.",
    pill: "/Hero/A_heavily_distorted_close-up_of_202605290214.jpeg",
  },
  {
    title: "SEO & Performance",
    tags: ["Core Web Vitals", "Technical SEO", "Speed"],
    img: "/General/The_interior_of_a_futuristic_202605290256.jpeg",
    lead: "We tune for speed",
    tail: "Core Web Vitals, technical SEO, sub-second loads as standard.",
    pill: "/General/The_interior_of_a_futuristic_202605290256.jpeg",
  },
  {
    title: "Brand Identity",
    tags: ["Logo", "Visual Systems", "Guidelines"],
    img: "/General/A_close-up_of_a_human_202605290256.jpeg",
    lead: "We shape identities",
    tail: "visual systems built to hold their edge over time.",
    pill: "/General/A_close-up_of_a_human_202605290256.jpeg",
  },
];

/* Inline rounded image inside the headline (mirrors AboutSection's Pill) */
function Pill({ src }: { src: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        width: "clamp(48px, 5.2vw, 78px)",
        height: "clamp(26px, 2.7vw, 40px)",
        borderRadius: 10,
        overflow: "hidden",
        position: "relative",
        margin: "0 0.3em",
        transform: "translateY(-0.06em)",
      }}
    >
      <Image src={src} alt="" fill sizes="78px" style={{ objectFit: "cover" }} />
    </span>
  );
}

/* Six-line asterisk / sparkle mark */
function Sparkle({ size = 15, color = ACCENT }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <g stroke={color} strokeWidth="2.4" strokeLinecap="round">
        <line x1="12" y1="3" x2="12" y2="21" />
        <line x1="4.2" y1="7.5" x2="19.8" y2="16.5" />
        <line x1="4.2" y1="16.5" x2="19.8" y2="7.5" />
      </g>
    </svg>
  );
}

/* Faint clock dial — rim + tick marks, rotating with the dial so the
   spin is legible. Centred on the off-screen dial centre. */
function ClockDial({ phi }: { phi: MotionValue<number> }) {
  const rotate = useTransform(phi, (v) => v);
  const ticks = Array.from({ length: 60 }, (_, k) => {
    const a = rad(k * 6);
    const major = k % 15 === 0; // 3 / 6 / 9 / 12 o'clock
    const inner = major ? 84 : 92;
    const outer = 97;
    return (
      <line
        key={k}
        x1={100 + inner * Math.cos(a)}
        y1={100 + inner * Math.sin(a)}
        x2={100 + outer * Math.cos(a)}
        y2={100 + outer * Math.sin(a)}
        stroke={major ? "rgba(139,162,124,0.3)" : "rgba(244,243,239,0.07)"}
        strokeWidth={major ? 0.8 : 0.5}
        strokeLinecap="round"
      />
    );
  });

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: 0,
        top: "50%",
        width: `${2 * R}vh`,
        height: `${2 * R}vh`,
        transform: `translate(calc(-50% + ${CX}vh), -50%)`,
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      <motion.svg viewBox="0 0 200 200" width="100%" height="100%" style={{ rotate }}>
        <circle cx="100" cy="100" r="97" fill="none" stroke="rgba(244,243,239,0.06)" strokeWidth="0.4" />
        <circle cx="100" cy="100" r="84" fill="none" stroke="rgba(244,243,239,0.04)" strokeWidth="0.4" />
        {ticks}
      </motion.svg>
    </div>
  );
}

/* ── One card fixed to the rim ──────────────────────────────── */
function ClockCard({
  service,
  index,
  phi,
}: {
  service: Service;
  index: number;
  phi: MotionValue<number>;
}) {
  const cur = (p: number) => BASE[index] + p; // current angle from 3 o'clock

  const x = useTransform(phi, (p) => `calc(-50% + ${(CX + R * Math.cos(rad(cur(p)))).toFixed(2)}vh)`);
  const y = useTransform(phi, (p) => `calc(-50% + ${(R * Math.sin(rad(cur(p)))).toFixed(2)}vh)`);
  const opacity = useTransform(phi, (p) => {
    const d = Math.abs(norm(cur(p)));
    return d < 32 ? 1 : Math.max(0, 1 - (d - 32) / 40);
  });
  const scale = useTransform(phi, (p) => 1 - (Math.min(Math.abs(norm(cur(p))), 90) / 90) * 0.18);
  const rotate = useTransform(phi, (p) => Math.max(-10, Math.min(10, norm(cur(p)) * 0.06)));
  const filter = useTransform(
    phi,
    (p) => `blur(${((Math.min(Math.abs(norm(cur(p))), 90) / 90) * 3.5).toFixed(1)}px)`
  );
  const zIndex = useTransform(phi, (p) => Math.round(50 - Math.abs(norm(cur(p))) / 6));

  return (
    <motion.article
      className="orbit-card"
      data-cursor="card"
      style={{
        position: "absolute",
        left: 0,
        top: "50%",
        x,
        y,
        scale,
        rotate,
        opacity,
        filter,
        zIndex,
        width: "clamp(260px, 23vw, 400px)",
        height: "clamp(360px, 54vh, 560px)",
        borderRadius: 22,
        overflow: "hidden",
        background: "#121214",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 30px 70px -20px rgba(0,0,0,0.6)",
        willChange: "transform, opacity, filter",
      }}
    >
      {/* image background */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Image
          className="orbit-card-img"
          src={service.img}
          alt=""
          fill
          sizes="(max-width: 1100px) 320px, 400px"
          style={{ objectFit: "cover", opacity: 0.5 }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(10,10,12,0.25) 0%, rgba(10,10,12,0.6) 55%, rgba(10,10,12,0.96) 100%)",
          }}
        />
      </div>

      {/* content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "clamp(1.4rem, 1.8vw, 2.2rem)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.18em",
              color: ACCENT,
            }}
          >
            0{index + 1}
          </span>
          <Sparkle size={14} />
        </div>

        <div>
          <h3
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 300,
              fontSize: "clamp(1.4rem, 1.9vw, 2.1rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: INK,
              margin: "0 0 1rem",
            }}
          >
            {service.title}
          </h3>

          <div
            style={{
              display: "inline-flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "0.5rem 0.8rem",
              padding: "0.45rem 1rem",
              borderRadius: 9999,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          >
            {service.tags.map((t, ti) => (
              <span
                key={t}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontWeight: 300,
                  fontSize: "0.7rem",
                  color: "rgba(244,243,239,0.78)",
                }}
              >
                {ti > 0 && <span style={{ color: ACCENT, fontSize: "0.55rem" }}>•</span>}
                {t}
              </span>
            ))}
          </div>

          <span
            className="orbit-card-arrow"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.55rem",
              marginTop: "1.2rem",
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "0.66rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: INK,
            }}
          >
            Explore
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M5 8h6M8 5l3 3-3 3"
                stroke={ACCENT}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </motion.article>
  );
}

/* ── One top-right headline (cross-fades with the docked card) ── */
function ClockHeadline({
  service,
  index,
  phi,
}: {
  service: Service;
  index: number;
  phi: MotionValue<number>;
}) {
  // Card `index` docks when φ ≈ 90·index.
  const opacity = useTransform(phi, (p) => {
    const d = Math.abs(norm(p - 90 * index));
    return d < 26 ? 1 : Math.max(0, 1 - (d - 26) / 38);
  });
  const y = useTransform(phi, (p) => `${(norm(p - 90 * index) * -0.32).toFixed(1)}px`);

  return (
    <motion.h2
      style={{
        position: "absolute",
        inset: 0,
        margin: 0,
        opacity,
        y,
        fontFamily: "var(--font-inter), sans-serif",
        fontWeight: 400,
        fontSize: "clamp(1.6rem, 3.2vw, 3.1rem)",
        lineHeight: 1.22,
        letterSpacing: "-0.02em",
        color: INK,
        willChange: "transform, opacity",
      }}
    >
      <span>{service.lead} </span>
      <Pill src={service.pill} />
      <span style={{ color: "rgba(244,243,239,0.42)" }}> {service.tail}</span>
    </motion.h2>
  );
}

/* ── Stage B: pinned clock ───────────────────────────────────── */
function ClockStage() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // Spin the dial 0 → 270° (brings cards 1, 2, 3 each into the 3 o'clock
  // dock in turn; card 0 starts docked). Brief holds at both ends.
  const phi = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 0, 270, 270]);

  const [active, setActive] = useState(0);
  useMotionValueEvent(phi, "change", (v) => {
    setActive(Math.max(0, Math.min(SERVICES.length - 1, Math.round(v / 90))));
  });

  return (
    <div ref={ref} style={{ position: "relative", height: "440vh", background: "#0a0a0a" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100svh",
          overflow: "hidden",
          background: "#0a0a0a",
        }}
      >
        {/* ambient green glow behind the 3 o'clock dock */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            width: "44vw",
            height: "44vw",
            transform: `translate(calc(-50% + ${DOCK_X}vh), -50%)`,
            background:
              "radial-gradient(circle, rgba(107,127,98,0.2) 0%, rgba(107,127,98,0.06) 40%, transparent 68%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <ClockDial phi={phi} />

        {/* eyebrow + counter, top-left */}
        <div
          className="container-padding"
          style={{
            position: "absolute",
            top: "clamp(2.5rem, 9vh, 6rem)",
            left: 0,
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            color: "rgba(244,243,239,0.5)",
            zIndex: 60,
          }}
        >
          <Sparkle size={14} />
          <span
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "0.64rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            What we do — 0{active + 1} / 0{SERVICES.length}
          </span>
        </div>

        {/* cross-fading headline block, top-right */}
        <div
          style={{
            position: "absolute",
            top: "clamp(7rem, 22vh, 13rem)",
            right: "clamp(1.5rem, 8vw, 8rem)",
            width: "min(40ch, 42vw)",
            height: "clamp(8rem, 22vh, 13rem)",
            zIndex: 40,
          }}
        >
          {SERVICES.map((s, i) => (
            <ClockHeadline key={s.title} service={s} index={i} phi={phi} />
          ))}
        </div>

        {/* cards on the rim */}
        {SERVICES.map((s, i) => (
          <ClockCard key={s.title} service={s} index={i} phi={phi} />
        ))}
      </div>
    </div>
  );
}

/* ── Stage A: the accordion, tilting in over About ───────────── */
function AccordionStage() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [12, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.96, 1]);

  return (
    <div ref={ref} style={{ position: "relative", height: "150vh" }}>
      <div style={{ position: "sticky", top: 0, height: "100svh", overflow: "hidden" }}>
        <motion.div
          style={{
            height: "100%",
            rotateX,
            scale,
            transformPerspective: 1400,
            transformOrigin: "50% 0%",
            willChange: "transform",
            background: "#0a0a0a",
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            boxShadow: "0 -40px 120px -45px rgba(0,0,0,0.65)",
            overflow: "hidden",
          }}
        >
          <ServicesSection />
        </motion.div>
      </div>
    </div>
  );
}

export default function ServicesVault({ children }: { children?: ReactNode }) {
  const reduce = useReducedMotion();
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 860px)");
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Reduced motion / narrow viewports: plain stacked layout, no pin/clock.
  if (reduce || narrow) {
    return (
      <div style={{ position: "relative", zIndex: 20, background: "#0a0a0a" }}>
        <ServicesSection />
        <div
          className="container-padding"
          style={{ display: "flex", flexDirection: "column", gap: "2.5rem", padding: "5rem 0" }}
        >
          <div style={{ maxWidth: 760, marginLeft: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.2rem" }}>
              <Sparkle size={14} />
              <span
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "0.64rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(244,243,239,0.5)",
                }}
              >
                What we do
              </span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontWeight: 400,
                fontSize: "clamp(1.5rem, 6vw, 2.4rem)",
                lineHeight: 1.25,
                letterSpacing: "-0.02em",
                color: INK,
                margin: 0,
              }}
            >
              <span>From engineering to identity — </span>
              <span style={{ color: "rgba(244,243,239,0.42)" }}>
                four disciplines, one studio, built to last.
              </span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.4rem" }}>
            {SERVICES.map((s, i) => (
              <article
                key={s.title}
                className="orbit-card"
                style={{
                  position: "relative",
                  minHeight: 320,
                  borderRadius: 20,
                  overflow: "hidden",
                  background: "#121214",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "1.6rem",
                }}
              >
                <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
                  <Image
                    src={s.img}
                    alt=""
                    fill
                    sizes="100vw"
                    style={{ objectFit: "cover", opacity: 0.45 }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(180deg, rgba(10,10,12,0.3) 0%, rgba(10,10,12,0.7) 60%, rgba(10,10,12,0.96) 100%)",
                    }}
                  />
                </div>
                <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "0.72rem",
                      letterSpacing: "0.18em",
                      color: ACCENT,
                    }}
                  >
                    0{i + 1}
                  </span>
                  <Sparkle size={14} />
                </div>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontWeight: 300,
                      fontSize: "clamp(1.4rem, 6vw, 2rem)",
                      lineHeight: 1.1,
                      color: INK,
                      margin: "0 0 0.9rem",
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      fontWeight: 300,
                      fontSize: "0.85rem",
                      lineHeight: 1.5,
                      color: "rgba(244,243,239,0.6)",
                      margin: 0,
                    }}
                  >
                    {s.tail}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div style={{ position: "relative", zIndex: 20 }}>
      <AccordionStage />
      <ClockStage />
      {/* Next section (Manifesto) tilts over the clock's last frame */}
      {children}
    </div>
  );
}
