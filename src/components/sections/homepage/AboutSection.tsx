"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import CinemaScene from "./CinemaScene";

const ACCENT = "#6b7f62";
const DARK = "#161616";
const MUTED = "#bdbcb6";

const PILL_1 = "/Hero/A_heavily_distorted_close-up_of_202605290214.jpeg";
const PILL_2 = "/Hero/hero_background.jpeg";
const CARD_IMPACT = "/Hero/A_heavily_distorted_close-up_of_202605290214.jpeg";
const CARD_PROCESS =
  "/Hero/A_futuristic_workspace_featuring_holographic_202605290214.jpeg";

/* Six-line asterisk / sparkle mark */
function Sparkle({ size = 16, color = ACCENT }: { size?: number; color?: string }) {
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

/* Inline rounded image inside the headline */
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

type CardProps = {
  tag: string;
  title: string;
  sub: string;
  variant: "dark" | "image" | "light";
  img?: string;
};

function Card({ tag, title, sub, variant, img }: CardProps) {
  const onDark = variant === "dark" || variant === "image";
  const isImage = variant === "image";
  const textColor = onDark ? "#f4f3ef" : "#161616";
  const subColor = onDark ? "rgba(244,243,239,0.55)" : "rgba(22,22,22,0.5)";
  const tagBorder = onDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.14)";
  const tagColor = onDark ? "rgba(244,243,239,0.8)" : "rgba(22,22,22,0.7)";
  const bg = variant === "light" ? "#e7e5df" : "#0e0e12";

  return (
    <div
      className="about-card"
      style={{
        position: "relative",
        borderRadius: 18,
        overflow: "hidden",
        background: bg,
        border: onDark
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "clamp(14px, 1.1vw, 20px)",
      }}
    >
      {isImage && img && (
        <>
          <Image
            src={img}
            alt=""
            fill
            sizes="(max-width: 900px) 50vw, 25vw"
            style={{ objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(8,8,12,0.2) 0%, rgba(8,8,12,0.55) 55%, rgba(8,8,12,0.88) 100%)",
            }}
          />
        </>
      )}

      {/* tag */}
      <div style={{ position: "relative", zIndex: 1, alignSelf: "flex-start" }}>
        <span
          style={{
            display: "inline-block",
            padding: "5px 12px",
            borderRadius: 9999,
            border: `1px solid ${tagBorder}`,
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "0.56rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: tagColor,
            background: onDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.5)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
        >
          {tag}
        </span>
      </div>

      {/* content */}
      <div style={{ position: "relative", zIndex: 1, marginTop: "2.5rem" }}>
        <Sparkle size={15} color={ACCENT} />
        <h3
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontWeight: 400,
            fontSize: "clamp(0.98rem, 1.05vw, 1.2rem)",
            lineHeight: 1.18,
            letterSpacing: "-0.01em",
            color: textColor,
            margin: "0.6rem 0 0",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontWeight: 300,
            fontSize: "0.72rem",
            lineHeight: 1.5,
            color: subColor,
            margin: "0.5rem 0 0",
          }}
        >
          {sub}
        </p>
      </div>
    </div>
  );
}

export default function AboutSection() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Negative sticky offset = (viewportHeight − aboutHeight). This pins the
  // section's LAST 100vh once its bottom meets the viewport bottom, so the
  // Services vault can iris over the held frame. Measured because the height
  // is content-driven (taller than the viewport).
  const [stickyTop, setStickyTop] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setStickyTop(Math.min(0, window.innerHeight - el.offsetHeight));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Progress 0 → 1 as the section rises from the bottom of the viewport to the top.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });

  // Tilt in on entry, straighten as it closes in.
  const rotateX = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [12, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.96, 1]);

  return (
    <section ref={ref} className="about-pin" style={{ top: stickyTop }}>
      <motion.div
        style={{
          rotateX,
          scale,
          transformPerspective: 1400,
          transformOrigin: "50% 0%",
          willChange: "transform",
          background: "#f4f3ee",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          boxShadow: "0 -40px 120px -45px rgba(0,0,0,0.65)",
          minHeight: "100svh",
          paddingTop: "clamp(2.5rem, 7vh, 5.5rem)",
          paddingBottom: 0,
        }}
      >
        <div
          className="container-padding"
          style={{ paddingBottom: "clamp(3rem, 8vh, 6rem)" }}
        >
          {/* Headline block — offset to the right */}
          <div style={{ maxWidth: 840, marginLeft: "auto" }}>
            {/* eyebrow */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.55rem",
                marginBottom: "1.3rem",
                color: "#9a9a94",
              }}
            >
              <Sparkle size={14} color={ACCENT} />
              <span
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                About studio
              </span>
            </div>

            {/* headline */}
            <h2
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontWeight: 400,
                fontSize: "clamp(1.5rem, 3.4vw, 3.1rem)",
                lineHeight: 1.24,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              <span style={{ color: DARK }}>
                KONAVERSE — is a web development studio of bold
              </span>
              <Pill src={PILL_1} />
              <span style={{ color: DARK }}>engineers </span>
              <span style={{ color: MUTED }}>
                that delivers fast, refined digital products with
              </span>
              <Pill src={PILL_2} />
              <span style={{ color: DARK }}>future-facing strategy</span>
            </h2>

            {/* caption */}
            <p
              style={{
                marginLeft: "auto",
                marginTop: "clamp(1.5rem, 3.5vh, 2.5rem)",
                maxWidth: "34ch",
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontWeight: 300,
                fontSize: "0.8rem",
                lineHeight: 1.6,
                color: "#9a9a94",
              }}
            >
              A two-person studio engineering high-performance websites and digital
              products for brands that refuse the ordinary.
            </p>
          </div>

          {/* Cards */}
          <div
            className="about-cards"
            style={{ marginTop: "clamp(2.5rem, 6vh, 4.5rem)" }}
          >
            <Card
              variant="dark"
              tag="Strategy"
              title="Bold strategies that shape brands"
              sub="We turn raw concepts into defining digital identities."
            />
            <Card
              variant="image"
              img={CARD_IMPACT}
              tag="Impact"
              title="Driving measurable growth through impact"
              sub="Built around conversion, speed, and real ROI."
            />
            <Card
              variant="image"
              img={CARD_PROCESS}
              tag="Process"
              title="Creative processes with rapid delivery"
              sub="Ideas into live results — fast, without losing the craft."
            />
            <Card
              variant="light"
              tag="Team"
              title="A dedicated team behind success"
              sub="Two specialists in your corner, from kickoff to launch."
            />
          </div>
        </div>

        {/* Cinematic scene — full-bleed, held as the section's last frame */}
        <CinemaScene />
      </motion.div>
    </section>
  );
}
