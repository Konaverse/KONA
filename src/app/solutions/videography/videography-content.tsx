"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import HomeFooter from "@/components/sections/HomeFooter";
import { ArrowUpRight } from "lucide-react";

/* ── Data ── */
const FILM_TYPES = [
  {
    title: "Brand Films",
    text: "Cinematic storytelling that distills your brand essence into something people feel, not just see.",
  },
  {
    title: "Social Content",
    text: "Platform-native short-form and reels engineered for the algorithm and designed for humans.",
  },
  {
    title: "Event Coverage",
    text: "Multi-camera setups, same-day edits, and highlight reels that make every event unforgettable.",
  },
  {
    title: "Product Videos",
    text: "Studio and lifestyle shoots that make your product the undeniable hero of the frame.",
  },
  {
    title: "Testimonials",
    text: "Authentic customer stories captured with cinematic quality. Social proof that actually converts.",
  },
];

const PRODUCTION = [
  {
    phase: "Pre-Production",
    items: [
      "Creative brief & concept development",
      "Scriptwriting & storyboarding",
      "Location scouting & talent casting",
      "Shot list & production schedule",
    ],
  },
  {
    phase: "Production",
    items: [
      "Professional cinema cameras & lenses",
      "Lighting design & audio capture",
      "Directed performances & B-roll",
      "Multi-angle coverage",
    ],
  },
  {
    phase: "Post-Production",
    items: [
      "Professional color grading",
      "Sound design & music licensing",
      "Motion graphics & titles",
      "Format optimization per platform",
    ],
  },
];

/* ── Film Card — spotlight + glow ── */
function FilmCard({
  film,
  index,
}: {
  film: { title: string; text: string };
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top, opacity: 1 });
  };

  return (
    <div className="flex-shrink-0 w-[320px] md:w-[400px]">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setSpotlight((s) => ({ ...s, opacity: 0 })); }}
        className="relative overflow-hidden rounded-lg px-7 py-8 md:px-9 md:py-10 h-full transition-all duration-500 cursor-default"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: `1px solid ${isHovered ? "rgba(0,255,136,0.18)" : "rgba(255,255,255,0.07)"}`,
          boxShadow: isHovered
            ? "0 0 50px rgba(0,255,136,0.07), 0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)"
            : "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
          transform: isHovered ? "translateY(-3px)" : "translateY(0)",
        }}
      >
        {/* Mouse-tracking green spotlight */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: spotlight.opacity,
            background: `radial-gradient(500px circle at ${spotlight.x}px ${spotlight.y}px, rgba(0,255,136,0.08), transparent 40%)`,
          }}
        />

        {/* Top accent line — reveals on hover */}
        <div
          className="absolute top-0 left-0 right-0 h-px transition-opacity duration-500"
          style={{
            opacity: isHovered ? 1 : 0,
            background: "linear-gradient(90deg, transparent, rgba(0,255,136,0.4), transparent)",
          }}
        />

        {/* Sprocket holes */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {[0, 1].map((d) => (
            <div
              key={d}
              className="w-2 h-2 rounded-sm transition-colors duration-500"
              style={{ background: isHovered ? "rgba(0,255,136,0.2)" : "rgba(255,255,255,0.06)" }}
            />
          ))}
        </div>
        <div className="absolute bottom-3 right-3 flex gap-1.5">
          {[0, 1].map((d) => (
            <div
              key={d}
              className="w-2 h-2 rounded-sm transition-colors duration-500"
              style={{ background: isHovered ? "rgba(0,255,136,0.2)" : "rgba(255,255,255,0.06)" }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Frame number */}
          <div
            className="font-mono text-[10px] tracking-[0.2em] mb-6 transition-colors duration-400"
            style={{ color: isHovered ? "rgba(0,255,136,0.7)" : "rgba(0,255,136,0.35)" }}
          >
            FRAME 0{index + 1}
          </div>

          <h3
            className="uppercase mb-4 transition-colors duration-400"
            style={{
              fontFamily: "var(--font-monument), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(18px, 2.2vw, 26px)",
              letterSpacing: "0.04em",
              color: isHovered ? "#ffffff" : "rgba(255,255,255,0.85)",
            }}
          >
            {film.title}
          </h3>

          {/* Green divider — grows on hover */}
          <div
            className="mb-5 transition-all duration-500 origin-left"
            style={{
              width: isHovered ? "50px" : "24px",
              height: 1,
              background: "#00ff88",
              boxShadow: isHovered ? "0 0 10px rgba(0,255,136,0.4)" : "none",
            }}
          />

          <p
            className="text-sm leading-[1.75] transition-colors duration-400"
            style={{ color: isHovered ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.45)" }}
          >
            {film.text}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Production Card — same spotlight treatment as FilmCard ── */
function ProductionCard({
  phase,
  index,
}: {
  phase: { phase: string; items: string[] };
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top, opacity: 1 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setSpotlight((s) => ({ ...s, opacity: 0 })); }}
        className="relative overflow-hidden backdrop-blur-md rounded-xl px-6 py-7 md:px-7 md:py-8 h-full transition-all duration-500 cursor-default"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: `1px solid ${isHovered ? "rgba(0,255,136,0.18)" : "rgba(255,255,255,0.05)"}`,
          boxShadow: isHovered
            ? "0 0 50px rgba(0,255,136,0.07), 0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)"
            : "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
          transform: isHovered ? "translateY(-3px)" : "translateY(0)",
        }}
      >
        {/* Mouse-tracking green spotlight */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: spotlight.opacity,
            background: `radial-gradient(500px circle at ${spotlight.x}px ${spotlight.y}px, rgba(0,255,136,0.08), transparent 40%)`,
          }}
        />

        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px transition-opacity duration-500"
          style={{
            opacity: isHovered ? 1 : 0,
            background: "linear-gradient(90deg, transparent, rgba(0,255,136,0.4), transparent)",
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          <div
            className="font-mono text-[10px] tracking-[0.2em] mb-4 transition-colors duration-400"
            style={{ color: isHovered ? "rgba(0,255,136,0.7)" : "rgba(0,255,136,0.4)" }}
          >
            PHASE 0{index + 1}
          </div>

          <h3
            className="uppercase mb-4 transition-colors duration-400"
            style={{
              fontFamily: "var(--font-monument), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(14px, 1.6vw, 18px)",
              letterSpacing: "0.04em",
              color: isHovered ? "#ffffff" : "rgba(255,255,255,0.85)",
            }}
          >
            {phase.phase}
          </h3>

          {/* Green divider — grows on hover */}
          <div
            className="mb-5 transition-all duration-500 origin-left"
            style={{
              width: isHovered ? "50px" : "24px",
              height: 1,
              background: "#00ff88",
              boxShadow: isHovered ? "0 0 10px rgba(0,255,136,0.4)" : "none",
            }}
          />

          <ul className="flex flex-col gap-3">
            {phase.items.map((item) => (
              <li
                key={item}
                className="text-xs leading-[1.7] flex items-start gap-2 transition-colors duration-400"
                style={{ color: isHovered ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.45)" }}
              >
                <span
                  className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0 transition-colors duration-400"
                  style={{ background: isHovered ? "rgba(0,255,136,0.6)" : "rgba(0,255,136,0.35)" }}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MOBILE: Vertical accordion stack with filmstrip rail + swipe nav
───────────────────────────────────────────────────────────────── */
function MobileWhatWeShoot() {
  const [active, setActive] = useState(0);

  const navigate = (dir: 1 | -1) => {
    setActive((prev) =>
      Math.max(0, Math.min(FILM_TYPES.length - 1, prev + dir))
    );
  };

  return (
    <div className="px-5 py-10">
      {/* Section label */}
      <p
        className="font-mono text-[10px] tracking-[0.3em] uppercase mb-8"
        style={{ color: "rgba(0,255,136,0.5)" }}
      >
        What We Shoot
      </p>

      {/* Filmstrip rail + cards */}
      <div className="relative">
        {/* Continuous vertical rail on the left */}
        <div
          className="absolute left-[18px] top-0 bottom-0 w-px"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,255,136,0.6) 0%, rgba(0,255,136,0.15) 100%)",
            boxShadow: "0 0 6px rgba(0,255,136,0.4)",
          }}
        />

        <div className="flex flex-col gap-3 pl-10">
          {FILM_TYPES.map((film, i) => {
            const isActive = active === i;

            return (
              <motion.div
                key={film.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
                className="relative"
              >
                {/* Rail dot */}
                <div
                  className="absolute -left-[34px] top-[22px] rounded-full transition-all duration-300"
                  style={{
                    width: isActive ? 10 : 6,
                    height: isActive ? 10 : 6,
                    marginLeft: isActive ? -2 : 0,
                    background: isActive ? "#00ff88" : "rgba(0,255,136,0.3)",
                    boxShadow: isActive
                      ? "0 0 10px rgba(0,255,136,0.8), 0 0 20px rgba(0,255,136,0.3)"
                      : "none",
                    transition: "width 0.3s, height 0.3s, box-shadow 0.3s, background 0.3s",
                  }}
                />

                {/* Card — drag x to navigate */}
                <motion.div
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -40) navigate(1);
                    else if (info.offset.x > 40) navigate(-1);
                  }}
                  className="relative overflow-hidden rounded-xl cursor-pointer select-none"
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, rgba(0,255,136,0.06) 0%, rgba(255,255,255,0.03) 100%)"
                      : "rgba(255,255,255,0.02)",
                    border: `1px solid ${isActive ? "rgba(0,255,136,0.28)" : "rgba(255,255,255,0.07)"}`,
                    boxShadow: isActive
                      ? "0 0 28px rgba(0,255,136,0.1), inset 0 1px 0 rgba(255,255,255,0.07)"
                      : "none",
                    transition: "border-color 0.4s, box-shadow 0.4s, background 0.4s",
                  }}
                  onClick={() => setActive(i)}
                >
                  {/* Top accent line (active only) */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px transition-opacity duration-500"
                    style={{
                      opacity: isActive ? 1 : 0,
                      background:
                        "linear-gradient(90deg, transparent, rgba(0,255,136,0.5), transparent)",
                    }}
                  />

                  {/* Sprocket holes — top left */}
                  <div className="absolute top-2.5 left-3 flex gap-1.5">
                    {[0, 1].map((d) => (
                      <div
                        key={d}
                        className="w-1.5 h-1.5 rounded-sm transition-colors duration-400"
                        style={{
                          background: isActive
                            ? "rgba(0,255,136,0.25)"
                            : "rgba(255,255,255,0.06)",
                        }}
                      />
                    ))}
                  </div>

                  {/* Header row — always visible */}
                  <div className="flex items-center justify-between px-5 pt-7 pb-4">
                    <div>
                      <div
                        className="font-mono text-[9px] tracking-[0.2em] mb-1.5 transition-colors duration-300"
                        style={{
                          color: isActive
                            ? "rgba(0,255,136,0.75)"
                            : "rgba(0,255,136,0.35)",
                        }}
                      >
                        FRAME 0{i + 1}
                      </div>
                      <h3
                        className="uppercase transition-colors duration-300"
                        style={{
                          fontFamily: "var(--font-monument), sans-serif",
                          fontWeight: 800,
                          fontSize: "clamp(15px, 4.5vw, 20px)",
                          letterSpacing: "0.04em",
                          color: isActive
                            ? "#ffffff"
                            : "rgba(255,255,255,0.7)",
                        }}
                      >
                        {film.title}
                      </h3>
                    </div>

                    {/* +/× toggle */}
                    <motion.div
                      animate={{ rotate: isActive ? 45 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full"
                      style={{
                        border: `1px solid ${isActive ? "rgba(0,255,136,0.35)" : "rgba(255,255,255,0.1)"}`,
                        background: isActive
                          ? "rgba(0,255,136,0.08)"
                          : "transparent",
                        transition: "border-color 0.3s, background 0.3s",
                      }}
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M5 1V9M1 5H9"
                          stroke={isActive ? "#00ff88" : "rgba(255,255,255,0.4)"}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Expandable body */}
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-6">
                          {/* Divider line */}
                          <div
                            className="mb-4 origin-left"
                            style={{
                              width: 40,
                              height: 1,
                              background: "#00ff88",
                              boxShadow: "0 0 8px rgba(0,255,136,0.4)",
                            }}
                          />
                          <p
                            className="text-sm leading-[1.8]"
                            style={{ color: "rgba(255,255,255,0.62)" }}
                          >
                            {film.text}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Sprocket holes — bottom right */}
                  <div className="absolute bottom-2.5 right-3 flex gap-1.5">
                    {[0, 1].map((d) => (
                      <div
                        key={d}
                        className="w-1.5 h-1.5 rounded-sm transition-colors duration-400"
                        style={{
                          background: isActive
                            ? "rgba(0,255,136,0.25)"
                            : "rgba(255,255,255,0.06)",
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Swipe hint */}
      <p
        className="font-mono text-[9px] tracking-[0.2em] text-center mt-6"
        style={{ color: "rgba(255,255,255,0.2)" }}
      >
        ← swipe card to navigate →
      </p>
    </div>
  );
}

/* ── Component ── */
export default function VideographyContent() {
  const heroRef = useRef<HTMLDivElement>(null);
  const filmstripRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const { scrollYProgress: filmstripProgress } = useScroll({
    target: filmstripRef,
    offset: ["start start", "end end"],
  });

  const layer1Y = useTransform(heroProgress, [0, 1], [0, -40]);
  const layer2Y = useTransform(heroProgress, [0, 1], [0, -220]);
  const filmstripX = useTransform(filmstripProgress, [0, 1], ["0%", "-60%"]);

  return (
    <div className="bg-black min-h-screen" style={{ overflowX: "clip" }}>

      {/* ══════════════════════════════════════════════════════════
          HERO — 2-layer parallax + horizontal line
      ══════════════════════════════════════════════════════════ */}
      <div ref={heroRef} className="relative h-screen overflow-hidden">
        {/* Layer 1 — background */}
        <motion.div className="absolute inset-0" style={{ y: layer1Y, zIndex: 1 }}>
          <Image
            src="/images/solutions/videography/layer1-lens flares.png"
            alt="Cinematic lens flares"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </motion.div>

        {/* Layer 2 — foreground */}
        <motion.div className="absolute inset-0" style={{ y: layer2Y, zIndex: 2 }}>
          <Image
            src="/images/solutions/videography/layer2 - videocamera.png"
            alt="Professional video camera"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>

        {/* Gradient veil */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[60%] z-[3]"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
          }}
        />

        {/* Faded watermark */}
        <div
          className="absolute top-[10vh] right-[clamp(1.5rem,6vw,6rem)] z-[3] select-none pointer-events-none"
          style={{
            fontFamily: "var(--font-monument), sans-serif",
            fontWeight: 800,
            fontSize: "clamp(180px, 25vw, 360px)",
            lineHeight: 1,
            color: "rgba(255,255,255,0.025)",
          }}
        >
          03
        </div>

        {/* Title block */}
        <div className="absolute bottom-16 left-[clamp(1.5rem,4vw,4rem)] z-[4]">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-mono text-[10px] tracking-[0.35em] uppercase mb-5"
            style={{ color: "#00ff88" }}
          >
            Solution 03
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="uppercase leading-[0.88]"
            style={{
              fontFamily: "var(--font-monument), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(28px, 9vw, 110px)",
              color: "#fff",
            }}
          >
            Videography
          </motion.h1>
        </div>

        {/* Animated horizontal line at bottom */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
          className="absolute bottom-0 left-[20%] z-[4] origin-left"
          style={{
            width: "60%",
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(0,255,136,0.3), transparent)",
          }}
        />
      </div>

      {/* ══════════════════════════════════════════════════════════
          CINEMATIC STATEMENT — letterboxed layout
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-44 px-[clamp(1.5rem,4vw,4rem)]">
        <div className="relative z-[1] max-w-5xl mx-auto">
          {/* Cinema frame */}
          <div className="relative overflow-hidden rounded-lg">
            {/* Top letterbox bar */}
            <motion.div
              initial={{ translateY: -100 }}
              whileInView={{ translateY: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8 }}
              className="w-full h-12 md:h-16"
              style={{ background: "#000" }}
            />

            {/* Content inside cinema frame */}
            <div
              className="px-8 py-16 md:px-16 md:py-24"
              style={{
                background: "rgba(255,255,255,0.01)",
                borderLeft: "1px solid rgba(255,255,255,0.04)",
                borderRight: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="font-mono text-[10px] tracking-[0.3em] uppercase mb-8"
                style={{ color: "rgba(0,255,136,0.5)" }}
              >
                Philosophy
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="uppercase leading-[0.95] mb-8"
                style={{
                  fontFamily: "var(--font-monument), sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(24px, 4vw, 52px)",
                  color: "#fff",
                }}
              >
                Your Brand Deserves
                <br />
                A Director, <span style={{ color: "#00ff88" }}>Not A Videographer.</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: 0.7 }}
                className="max-w-xl text-sm md:text-base leading-[1.8]"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Anyone can hold a camera. We craft visual narratives &mdash;
                intentional compositions, deliberate pacing, and a cinematic eye
                that turns ordinary moments into compelling stories.
              </motion.p>
            </div>

            {/* Bottom letterbox bar */}
            <motion.div
              initial={{ translateY: 100 }}
              whileInView={{ translateY: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8 }}
              className="w-full h-12 md:h-16"
              style={{ background: "#000" }}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SERVICE TYPES — filmstrip horizontal scroll (desktop)
                        — vertical accordion stack  (mobile)
      ══════════════════════════════════════════════════════════ */}

      {/* Mobile */}
      <div className="md:hidden">
        <MobileWhatWeShoot />
      </div>

      {/* Desktop */}
      <div ref={filmstripRef} className="relative hidden md:block" style={{ height: `${FILM_TYPES.length * 60}vh` }}>
        <div className="sticky top-0 h-screen overflow-hidden flex items-center">
          <div className="w-full px-[clamp(1.5rem,4vw,4rem)]">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="font-mono text-[10px] tracking-[0.3em] uppercase mb-10"
              style={{ color: "rgba(0,255,136,0.5)" }}
            >
              What We Shoot
            </motion.p>

            <motion.div
              className="flex gap-6 md:gap-8"
              style={{ x: filmstripX }}
            >
              {FILM_TYPES.map((film, i) => (
                <FilmCard key={film.title} film={film} index={i} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          PRODUCTION TIMELINE — 3 horizontal phases
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-44 px-[clamp(1.5rem,4vw,4rem)]">
        {/* Grid bg */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs>
            <pattern id="g-prod" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#g-prod)" />
        </svg>

        <div className="relative z-[1] max-w-6xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[10px] tracking-[0.3em] uppercase mb-16"
            style={{ color: "rgba(0,255,136,0.5)" }}
          >
            Production Process
          </motion.p>

          {/* Horizontal SVG connector */}
          <div className="hidden md:block relative mb-12">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1, delay: 0.2 }}
              className="origin-left mx-auto"
              style={{
                width: "80%",
                height: 1,
                background:
                  "linear-gradient(90deg, rgba(0,255,136,0.3), rgba(0,255,136,0.15), rgba(0,255,136,0.3))",
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {PRODUCTION.map((p, i) => (
              <ProductionCard key={p.phase} phase={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          PROMISE
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-36 md:py-48 px-[clamp(1.5rem,4vw,4rem)]">
        <div className="relative z-[1] max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[10px] tracking-[0.3em] uppercase mb-8"
            style={{ color: "rgba(0,255,136,0.5)" }}
          >
            Our Promise
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="uppercase leading-[0.95] mb-8"
            style={{
              fontFamily: "var(--font-monument), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(24px, 3.5vw, 44px)",
              color: "#fff",
            }}
          >
            The Standard
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="origin-left mb-10"
            style={{
              width: "clamp(60px, 10vw, 140px)",
              height: 2,
              background: "#00ff88",
              boxShadow: "0 0 16px rgba(0,255,136,0.3)",
            }}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-base md:text-lg leading-[1.8] max-w-2xl"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Every frame will be intentional. Every edit will serve the story.
            You&apos;ll receive content that makes your competitors wonder who
            you hired.
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          PROJECTS LINK
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-20 px-[clamp(1.5rem,4vw,4rem)]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="relative z-[1] max-w-3xl mx-auto"
        >
          <Link
            href="/projects/videography"
            className="group block rounded-2xl px-8 py-10 md:px-12 md:py-14 transition-all duration-300"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(0,255,136,0.2)";
              e.currentTarget.style.background = "rgba(0,255,136,0.03)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
              e.currentTarget.style.background = "rgba(255,255,255,0.02)";
            }}
          >
            <p
              className="font-mono text-[10px] tracking-[0.3em] uppercase mb-4"
              style={{ color: "rgba(0,255,136,0.5)" }}
            >
              Portfolio
            </p>
            <div className="flex items-center justify-between gap-4">
              <h3
                className="uppercase"
                style={{
                  fontFamily: "var(--font-monument), sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(20px, 3vw, 36px)",
                  color: "#fff",
                }}
              >
                See Our Video Work
              </h3>
              <ArrowUpRight
                className="w-6 h-6 md:w-8 md:h-8 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                style={{ color: "#00ff88" }}
              />
            </div>
            <p
              className="text-sm mt-3"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Explore the films and videos we&apos;ve produced for brands across Europe.
            </p>
          </Link>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CTA
      ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(0,255,136,0.04) 0%, transparent 60%)",
          }}
        />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs>
            <pattern id="cta-g-vid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-g-vid)" />
        </svg>
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.2) 30%, rgba(0,255,136,0.2) 70%, transparent 100%)",
          }}
        />

        <div className="relative z-[1] flex flex-col items-center justify-center min-h-[80vh] px-6 py-32">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[11px] tracking-[0.3em] uppercase mb-8"
            style={{ color: "rgba(0,255,136,0.5)" }}
          >
            Ready to Roll?
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-center leading-[0.95] uppercase mb-6"
            style={{
              fontFamily: "var(--font-monument), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(32px, 7vw, 80px)",
              color: "#ffffff",
            }}
          >
            Let&apos;s Tell
            <br />
            <span style={{ color: "#00ff88" }}>Your Story</span>
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 origin-center"
            style={{
              width: "clamp(80px, 12vw, 160px)",
              height: 2,
              background: "#00ff88",
              boxShadow: "0 0 20px rgba(0,255,136,0.3)",
            }}
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center text-sm md:text-base leading-relaxed max-w-lg mb-12"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Whether you need a brand film, social content, or full event
            coverage &mdash; we&apos;re ready to create something cinematic.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-fit"
          >
            <Button href="/contact" variant="primary" size="lg">
              <span style={{ color: "#00ff88" }}>Get a Quote</span>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ══════ Footer ══════ */}
      <HomeFooter />
    </div>
  );
}
