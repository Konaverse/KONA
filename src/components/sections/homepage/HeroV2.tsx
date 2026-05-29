"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";

const HERO_IMAGE = "/Hero/hero_background.jpeg";

const EASE = [0.16, 1, 0.3, 1] as const;
const WORDMARK = "KONAVERSE".split("");

export default function HeroV2() {
  const reduce = useReducedMotion();

  // Entrance variants — gentle blur/translate up. Collapsed when reduced-motion.
  const rise: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 24, filter: "blur(10px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 1.4, ease: EASE },
    },
  };

  // Masked letter reveal for the wordmark.
  const letter: Variants = {
    hidden: reduce ? { opacity: 0 } : { y: "110%" },
    show: (i: number) => ({
      y: "0%",
      opacity: 1,
      transition: { duration: 1.2, ease: EASE, delay: 0.55 + i * 0.08 },
    }),
  };

  return (
    <section
      aria-label="Intro"
      style={{
        position: "relative",
        width: "100%",
        height: "100svh",
        minHeight: 560,
        overflow: "hidden",
        background: "var(--color-bg)",
      }}
    >
      {/* ── Full-bleed background image ─────────────────────── */}
      <motion.div
        aria-hidden
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.2, ease: EASE }}
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
      >
        <Image
          src={HERO_IMAGE}
          alt="Abstract tech-noir portrait of blurred figures in green light"
          fill
          priority
          quality={90}
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 35%" }}
        />
      </motion.div>

      {/* ── Legibility overlays (let the center breathe) ────── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background:
            // top fade for navbar · bottom fade for wordmark · soft side vignette
            "linear-gradient(180deg, rgba(5,5,16,0.55) 0%, rgba(5,5,16,0) 22%, rgba(5,5,16,0) 55%, rgba(5,5,16,0.65) 88%, rgba(5,5,16,0.9) 100%)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background:
            "radial-gradient(120% 90% at 50% 45%, rgba(5,5,16,0) 55%, rgba(5,5,16,0.45) 100%)",
        }}
      />

      {/* ── Content layer ───────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top band: headline (left) + meta (right) */}
        <div
          className="container-padding hero-top"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "2rem",
            paddingTop: "clamp(7rem, 14vh, 11rem)",
          }}
        >
          {/* Left — headline + CTA */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } }}
            className="hero-headline"
            style={{ maxWidth: "min(34ch, 46vw)" }}
          >
            <motion.h1
              variants={rise}
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontWeight: 300,
                fontSize: "clamp(1.6rem, 3.2vw, 3rem)",
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                color: "var(--color-ink)",
                margin: 0,
              }}
            >
              Digital experiences,
              <br />
              <span
                style={{
                  backgroundImage:
                    "linear-gradient(120deg, var(--color-accent-from), var(--color-accent-to))",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  fontWeight: 500,
                }}
              >
                engineered
              </span>{" "}
              to move.
            </motion.h1>

            <motion.p
              variants={rise}
              style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontWeight: 300,
                fontSize: "clamp(0.85rem, 1vw, 1rem)",
                lineHeight: 1.7,
                color: "rgba(248,250,252,0.62)",
                margin: "1.25rem 0 0",
                maxWidth: "32ch",
              }}
            >
              A web development studio building fast, refined, future-facing
              products for brands that refuse the ordinary.
            </motion.p>

            <motion.div variants={rise} style={{ marginTop: "2rem" }}>
              <a
                href="#contact"
                data-cursor="link"
                className="hero-cta"
              >
                Start a project
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                  aria-hidden
                  style={{ transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)" }}
                >
                  <path
                    d="M2 11L11 2M11 2H4M11 2V9"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </motion.div>
          </motion.div>

          {/* Right — stacked work cards (desktop only) */}
          <motion.div
            variants={rise}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.55 }}
            className="hero-cards"
            style={{
              position: "relative",
              flexShrink: 0,
              width: "clamp(280px, 25vw, 380px)",
              aspectRatio: "4 / 3",
            }}
          >
            {/* deepest layer — image */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: "translate(38px, 38px)",
                borderRadius: 24,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 16px 50px -25px rgba(0,0,0,0.7)",
              }}
            >
              <Image
                src="/Hero/Ghostly,_heavily_blurred_forest_at_202605290213.jpeg"
                alt=""
                fill
                sizes="380px"
                style={{ objectFit: "cover", opacity: 0.8 }}
              />
              <div style={{ position: "absolute", inset: 0, background: "rgba(5,5,16,0.55)" }} />
            </div>

            {/* middle layer — image */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: "translate(19px, 19px)",
                borderRadius: 24,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 20px 60px -25px rgba(0,0,0,0.7)",
              }}
            >
              <Image
                src="/Hero/A_heavily_distorted_close-up_of_202605290214.jpeg"
                alt=""
                fill
                sizes="380px"
                style={{ objectFit: "cover", opacity: 0.9 }}
              />
              <div style={{ position: "absolute", inset: 0, background: "rgba(5,5,16,0.4)" }} />
            </div>

            {/* front layer — image + label */}
            <div
              className="hero-card-front"
              data-cursor="card"
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 24,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 30px 80px -25px rgba(0,0,0,0.75)",
              }}
            >
              <Image
                src="/Hero/A_futuristic_workspace_featuring_holographic_202605290214.jpeg"
                alt="Futuristic holographic workspace"
                fill
                priority
                sizes="380px"
                style={{ objectFit: "cover" }}
              />
              {/* legibility gradient */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(5,5,16,0) 38%, rgba(5,5,16,0.88) 100%)",
                }}
              />
              {/* glass sheen */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  background:
                    "linear-gradient(160deg, rgba(255,255,255,0.1) 0%, transparent 45%)",
                }}
              />
              {/* label */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: "clamp(14px, 1.4vw, 20px)",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  gap: "0.75rem",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    flexShrink: 0,
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.25)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255,255,255,0.06)",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                    <path
                      d="M2 11L11 2M11 2H4M11 2V9"
                      stroke="#f8fafc"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Spacer keeps the middle empty */}
        <div style={{ flex: 1 }} />

        {/* Bottom band: oversized wordmark */}
        <div>
          {/* Wordmark — full-bleed: K off the left, E off the right, dipping below the bottom */}
          <div
            aria-hidden
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
              flexWrap: "nowrap",
              lineHeight: 0.78,
              paddingBottom: 0,
              transform: "translateY(2.4vw)",
            }}
          >
            {WORDMARK.map((char, i) => (
              <span
                key={char + i}
                style={{ overflow: "hidden", display: "inline-block" }}
              >
                <motion.span
                  custom={i}
                  variants={letter}
                  initial="hidden"
                  animate="show"
                  className="hero-wordmark-letter"
                  style={{
                    display: "inline-block",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontWeight: 500,
                    fontSize: "16.4vw",
                    letterSpacing: "-0.02em",
                    color: "rgba(248,250,252,0.95)",
                    textShadow: "0 8px 60px rgba(5,5,16,0.5)",
                  }}
                >
                  {char}
                </motion.span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* visually-hidden h1 already provided above for SEO; wordmark is decorative */}
    </section>
  );
}
