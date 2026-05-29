"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useVelocity,
  useTransform,
} from "framer-motion";

const ACCENT = "#6b7f62";
const EASE = [0.22, 1, 0.36, 1] as const;

type Service = { title: string; tags: string[]; img: string };

const SERVICES: Service[] = [
  {
    title: "Web Development",
    tags: ["Next.js", "Web Apps", "E-commerce"],
    img: "/Hero/A_futuristic_workspace_featuring_holographic_202605290214.jpeg",
  },
  {
    title: "UI / UX Design",
    tags: ["Interfaces", "Design Systems", "Prototyping"],
    img: "/Hero/A_heavily_distorted_close-up_of_202605290214.jpeg",
  },
  {
    title: "SEO & Performance",
    tags: ["Core Web Vitals", "Technical SEO", "Speed"],
    img: "/General/The_interior_of_a_futuristic_202605290256.jpeg",
  },
  {
    title: "Brand Identity",
    tags: ["Logo", "Visual Systems", "Guidelines"],
    img: "/General/A_close-up_of_a_human_202605290256.jpeg",
  },
];

function ArrowButton() {
  return (
    <span
      aria-hidden
      style={{
        flexShrink: 0,
        width: "clamp(34px, 3vw, 44px)",
        height: "clamp(34px, 3vw, 44px)",
        borderRadius: "50%",
        background: ACCENT,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 30px -8px rgba(107,127,98,0.7)",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path
          d="M5 8h6M8 5l3 3-3 3"
          stroke="#0a0a0a"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function ServicesSection() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const reduce = useReducedMotion();

  // Cursor-following image — mouse position relative to the section, smoothed
  // by a spring, with a tilt driven by horizontal velocity.
  const sectionRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 220, damping: 28, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 220, damping: 28, mass: 0.5 });
  const xVelocity = useVelocity(springX);
  const rotate = useTransform(xVelocity, [-1600, 1600], [-14, 14], { clamp: true });

  function handleMove(e: React.MouseEvent) {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={reduce ? undefined : handleMove}
      style={{
        position: "relative",
        width: "100%",
        height: "100svh",
        minHeight: 560,
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        className="container-padding services-grid"
        style={{ width: "100%" }}
      >
        {/* ── Left column ─────────────────────────────── */}
        <div className="services-left">
          <p
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontWeight: 300,
              fontSize: "0.95rem",
              lineHeight: 1.4,
              color: "rgba(244,243,239,0.85)",
              margin: 0,
            }}
          >
            services that
            <br />
            we provide
          </p>

          {/* Circular badge */}
          <div
            className="services-badge"
            style={{ position: "relative", width: "clamp(150px, 14vw, 210px)", aspectRatio: "1" }}
          >
            <svg
              viewBox="0 0 200 200"
              className={reduce ? undefined : "badge-spin"}
              style={{ width: "100%", height: "100%" }}
            >
              <defs>
                <path
                  id="badgeCircle"
                  d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"
                  fill="none"
                />
              </defs>
              <text
                fill="rgba(244,243,239,0.75)"
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "12px",
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                }}
              >
                <textPath href="#badgeCircle" startOffset="0">
                  KONAVERSE WEB STUDIO • SINCE 2024 •
                </textPath>
              </text>
            </svg>
            {/* center logo */}
            <span
              style={{
                position: "absolute",
                inset: "30%",
                display: "block",
              }}
            >
              <Image
                src="/About/KonaLogoNoBg.png"
                alt="KONAVERSE"
                fill
                sizes="90px"
                style={{ objectFit: "contain", opacity: 0.9 }}
              />
            </span>
          </div>
        </div>

        {/* ── Right column — accordion ────────────────── */}
        <div
          className="services-list"
          onMouseLeave={() => setHovered(null)}
        >
          {SERVICES.map((s, i) => {
            const isActive = i === active;
            return (
              <div
                key={s.title}
                onMouseEnter={() => {
                  setActive(i);
                  setHovered(i);
                }}
                onClick={() => setActive(i)}
                data-cursor="link"
                style={{
                  borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.12)",
                  padding: "clamp(0.9rem, 2.2vh, 1.6rem) 0",
                  cursor: "pointer",
                }}
              >
                {/* title row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "clamp(0.8rem, 1.5vw, 1.4rem)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "clamp(0.85rem, 1vw, 1.05rem)",
                      color: isActive ? ACCENT : "rgba(244,243,239,0.28)",
                      transition: "color 0.4s ease",
                      flexShrink: 0,
                    }}
                  >
                    0{i + 1}.
                  </span>

                  <h3
                    style={{
                      flex: 1,
                      margin: 0,
                      fontFamily: "var(--font-inter), sans-serif",
                      fontWeight: 400,
                      fontSize: "clamp(2rem, 4.4vw, 4rem)",
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                      color: isActive ? "#f4f3ef" : "rgba(244,243,239,0.2)",
                      transition: "color 0.45s ease",
                    }}
                  >
                    <span
                      style={{
                        borderBottom: isActive
                          ? "2px solid rgba(244,243,239,0.85)"
                          : "2px solid transparent",
                        paddingBottom: "0.12em",
                        transition: "border-color 0.45s ease",
                      }}
                    >
                      {s.title}
                    </span>
                  </h3>

                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.4, ease: EASE }}
                      >
                        <ArrowButton />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* tags (active only) */}
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                      style={{ overflow: "hidden" }}
                    >
                      <div
                        style={{
                          display: "inline-flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: "0.6rem 0.9rem",
                          marginTop: "clamp(0.8rem, 1.6vh, 1.2rem)",
                          marginLeft: "clamp(1.6rem, 2.5vw, 2.4rem)",
                          padding: "0.5rem 1.1rem",
                          borderRadius: 9999,
                          border: "1px solid rgba(255,255,255,0.14)",
                        }}
                      >
                        {s.tags.map((t, ti) => (
                          <span
                            key={t}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.6rem",
                              fontFamily: "var(--font-dm-sans), sans-serif",
                              fontWeight: 300,
                              fontSize: "0.72rem",
                              color: "rgba(244,243,239,0.75)",
                            }}
                          >
                            {ti > 0 && (
                              <span style={{ color: ACCENT, fontSize: "0.6rem" }}>•</span>
                            )}
                            {t}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Cursor-following image ──────────────────────── */}
      {!reduce && (
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            x: springX,
            y: springY,
            zIndex: 5,
            pointerEvents: "none",
          }}
        >
          <motion.div
            className="services-follower"
            style={{ rotate }}
            animate={{
              opacity: hovered !== null ? 1 : 0,
              scale: hovered !== null ? 1 : 0.82,
            }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <AnimatePresence mode="popLayout">
              {hovered !== null && (
                <motion.div
                  key={hovered}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  style={{ position: "absolute", inset: 0 }}
                >
                  <Image
                    src={SERVICES[hovered].img}
                    alt=""
                    fill
                    sizes="330px"
                    style={{ objectFit: "cover" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            {/* green cinematic tint */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg, rgba(107,127,98,0.35) 0%, rgba(10,10,10,0.55) 100%)",
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
