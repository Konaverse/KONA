"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
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
    <div className="bg-black min-h-screen overflow-x-hidden">

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
              fontSize: "clamp(44px, 9vw, 110px)",
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
          SERVICE TYPES — filmstrip horizontal scroll
      ══════════════════════════════════════════════════════════ */}
      <div ref={filmstripRef} className="relative" style={{ height: `${FILM_TYPES.length * 60}vh` }}>
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
                <div
                  key={film.title}
                  className="flex-shrink-0 w-[320px] md:w-[400px]"
                >
                  <div
                    className="rounded-lg px-7 py-8 md:px-9 md:py-10 h-full relative"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {/* Sprocket-hole decoration */}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      {[0, 1].map((d) => (
                        <div
                          key={d}
                          className="w-2 h-2 rounded-sm"
                          style={{
                            background: "rgba(255,255,255,0.06)",
                          }}
                        />
                      ))}
                    </div>
                    <div className="absolute bottom-3 right-3 flex gap-1.5">
                      {[0, 1].map((d) => (
                        <div
                          key={d}
                          className="w-2 h-2 rounded-sm"
                          style={{
                            background: "rgba(255,255,255,0.06)",
                          }}
                        />
                      ))}
                    </div>

                    {/* Frame number */}
                    <div
                      className="font-mono text-[10px] tracking-[0.2em] mb-6"
                      style={{ color: "rgba(0,255,136,0.35)" }}
                    >
                      FRAME 0{i + 1}
                    </div>

                    <h3
                      className="uppercase mb-4"
                      style={{
                        fontFamily: "var(--font-monument), sans-serif",
                        fontWeight: 800,
                        fontSize: "clamp(18px, 2.2vw, 26px)",
                        letterSpacing: "0.04em",
                        color: "#fff",
                      }}
                    >
                      {film.title}
                    </h3>
                    <p
                      className="text-sm leading-[1.75]"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      {film.text}
                    </p>
                  </div>
                </div>
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
              <motion.div
                key={p.phase}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="backdrop-blur-md rounded-xl px-6 py-7 md:px-7 md:py-8"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div
                  className="font-mono text-[10px] tracking-[0.2em] mb-4"
                  style={{ color: "rgba(0,255,136,0.4)" }}
                >
                  PHASE 0{i + 1}
                </div>

                <h3
                  className="uppercase mb-5"
                  style={{
                    fontFamily: "var(--font-monument), sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(14px, 1.6vw, 18px)",
                    letterSpacing: "0.04em",
                    color: "#fff",
                  }}
                >
                  {p.phase}
                </h3>

                <ul className="flex flex-col gap-3">
                  {p.items.map((item) => (
                    <li
                      key={item}
                      className="text-xs leading-[1.7] flex items-start gap-2"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      <span
                        className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
                        style={{ background: "rgba(0,255,136,0.35)" }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
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
