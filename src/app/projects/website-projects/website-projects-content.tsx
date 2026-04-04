"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import HomeFooter from "@/components/sections/HomeFooter";
import ParallaxStackingProjects from "@/components/sections/parallax-stacking-projects";
import { WEBSITE_PROJECTS } from "@/data/projects";
import type { StackProject } from "@/components/sections/parallax-stacking-projects";

/* ── Map data ── */
const stackProjects: StackProject[] = WEBSITE_PROJECTS.map((p) => ({
  id: p.id,
  title: p.title,
  year: p.year,
  description: p.description,
  tags: p.tags,
  tech: p.tech,
  image: p.image,
  href: p.href,
  linkLabel: "Visit Site",
}));

/* ── Animated wireframe lines for "The Blueprint" hero ── */
const WIRE_LINES = [
  // Horizontal architectural lines
  { x1: "0%", y1: "30%", x2: "65%", y2: "30%", delay: 0.3, duration: 1.2 },
  { x1: "35%", y1: "55%", x2: "100%", y2: "55%", delay: 0.5, duration: 1.0 },
  { x1: "0%", y1: "75%", x2: "45%", y2: "75%", delay: 0.7, duration: 0.9 },
  // Vertical structural lines
  { x1: "25%", y1: "0%", x2: "25%", y2: "60%", delay: 0.4, duration: 1.1 },
  { x1: "65%", y1: "20%", x2: "65%", y2: "100%", delay: 0.6, duration: 1.0 },
  // Diagonal accent
  { x1: "70%", y1: "0%", x2: "100%", y2: "40%", delay: 0.8, duration: 0.8 },
  { x1: "0%", y1: "85%", x2: "30%", y2: "55%", delay: 1.0, duration: 0.9 },
];

/* ── Floating mockup data ── */
const FLOATING_MOCKUPS = [
  {
    src: "/kona websites screenshots/apt_macbook.png",
    alt: "APT",
    style: { top: "12%", right: "8%", width: "clamp(180px, 22vw, 340px)" },
    delay: 0.6,
    parallaxRange: [-20, 20] as [number, number],
  },
  {
    src: "/kona websites screenshots/tdk_macbook.png",
    alt: "TDK Design & Build",
    style: { top: "38%", right: "28%", width: "clamp(140px, 16vw, 260px)" },
    delay: 0.9,
    parallaxRange: [-35, 35] as [number, number],
  },
  {
    src: "/kona websites screenshots/sivory_macbook.png",
    alt: "Sivory",
    style: { bottom: "18%", right: "5%", width: "clamp(120px, 14vw, 220px)" },
    delay: 1.2,
    parallaxRange: [-15, 15] as [number, number],
  },
];

export default function WebsiteProjectsContent() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="bg-black min-h-screen">
      {/* ══════════════════════════════════════════════════════════════════
          HERO — "THE BLUEPRINT"
          Full viewport. Architectural wireframe lines construct themselves.
          Floating mockup fragments at different parallax depths.
          ══════════════════════════════════════════════════════════════════ */}
      <motion.section
        ref={heroRef}
        className="relative h-screen overflow-hidden"
        style={{ opacity: overlayOpacity }}
      >
        {/* ── Background image with parallax ── */}
        <motion.div className="absolute inset-0" style={{ y: bgY }}>
          <Image
            src="/images/projects/website-projects/web-dev.png"
            alt="Web development atmosphere"
            fill
            className="object-cover"
            style={{ opacity: 0.15 }}
            sizes="100vw"
            priority
          />
        </motion.div>

        {/* ── Dark vignette overlay ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.6) 100%)",
          }}
        />

        {/* ── Animated wireframe SVG — the blueprint constructs itself ── */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-[1]">
          {WIRE_LINES.map((line, i) => (
            <motion.line
              key={i}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="rgba(0,255,136,0.08)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: {
                  duration: line.duration,
                  delay: line.delay,
                  ease: [0.25, 0.46, 0.45, 0.94],
                },
                opacity: { duration: 0.3, delay: line.delay },
              }}
            />
          ))}

          {/* ── Node dots at intersections ── */}
          {[
            { cx: "25%", cy: "30%", delay: 1.0 },
            { cx: "65%", cy: "55%", delay: 1.2 },
            { cx: "25%", cy: "55%", delay: 1.1 },
            { cx: "65%", cy: "30%", delay: 1.3 },
          ].map((dot, i) => (
            <motion.circle
              key={`dot-${i}`}
              cx={dot.cx}
              cy={dot.cy}
              r="3"
              fill="#00ff88"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.4, scale: 1 }}
              transition={{ duration: 0.4, delay: dot.delay }}
            />
          ))}
        </svg>

        {/* ── Animated diagonal scan line ── */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-[2]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="absolute h-px w-[200%]"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.3) 30%, rgba(0,255,136,0.05) 70%, transparent 100%)",
              top: "50%",
              left: "-50%",
              transformOrigin: "center",
              rotate: "-15deg",
            }}
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 3,
              delay: 0.8,
              ease: "linear",
              repeat: Infinity,
              repeatDelay: 8,
            }}
          />
        </motion.div>

        {/* ── Floating mockup fragments at different depths ── */}
        <div className="absolute inset-0 z-[3] hidden md:block">
          {FLOATING_MOCKUPS.map((mockup, i) => {
            const y = useTransform(
              scrollYProgress,
              [0, 1],
              mockup.parallaxRange
            );
            return (
              <motion.div
                key={i}
                className="absolute"
                style={{ ...mockup.style, y }}
                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: mockup.delay,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <div
                  className="relative w-full"
                  style={{ aspectRatio: "16 / 10" }}
                >
                  <Image
                    src={mockup.src}
                    alt={mockup.alt}
                    fill
                    className="object-contain rounded-lg"
                    style={{
                      boxShadow:
                        "0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(0,255,136,0.04)",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                    sizes="30vw"
                  />
                  {/* Glassmorphism overlay shimmer */}
                  <div
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%, rgba(0,255,136,0.02) 100%)",
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Bottom-left: Main title ── */}
        <div className="absolute bottom-0 left-0 z-[5] pb-12 md:pb-16 pl-[clamp(1.5rem,4vw,4rem)]">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[11px] tracking-[0.3em] uppercase mb-4"
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              color: "rgba(0,255,136,0.5)",
            }}
          >
            Portfolio / 01
          </motion.p>
          <motion.h1
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{
              duration: 1,
              delay: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="leading-[0.85] uppercase"
            style={{
              fontFamily: "var(--font-monument), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(28px, 10vw, 120px)",
              color: "#ffffff",
            }}
          >
            Website
            <br />
            <span style={{ color: "#00ff88" }}>Projects</span>
          </motion.h1>

          {/* Green accent line below title */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-6 origin-left"
            style={{
              width: "clamp(60px, 10vw, 140px)",
              height: 2,
              background: "#00ff88",
              boxShadow: "0 0 20px rgba(0,255,136,0.3)",
            }}
          />
        </div>

        {/* ── Top-right: Vertical description (desktop) ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="absolute top-12 right-[clamp(1.5rem,4vw,4rem)] z-[5] hidden md:flex flex-col items-end gap-4"
        >
          <p
            className="text-[10px] tracking-[0.3em] uppercase"
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              color: "rgba(255,255,255,0.3)",
              writingMode: "vertical-rl",
            }}
          >
            7 Projects &mdash; 2024
          </p>
          <div
            className="w-px h-16"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,255,136,0.3), transparent)",
            }}
          />
          <p
            className="text-[10px] tracking-[0.15em] max-w-[140px] text-right leading-relaxed"
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            High-performance websites engineered for speed, conversion, and
            visual authority.
          </p>
        </motion.div>

        {/* ── Bottom border ── */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="absolute bottom-0 left-0 right-0 h-px origin-left z-[6]"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,255,136,0.4) 0%, rgba(0,255,136,0.1) 50%, transparent 100%)",
          }}
        />
      </motion.section>

      {/* ══════ Parallax Stacking Projects ══════ */}
      <ParallaxStackingProjects projects={stackProjects} />

      {/* ══════ CTA Section ══════ */}
      <section className="relative bg-black overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(0,255,136,0.04) 0%, transparent 60%)",
          }}
        />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs>
            <pattern
              id="cta-grid-wp"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 80 0 L 0 0 0 80"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-grid-wp)" />
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
            Ready to Build?
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
            Let&apos;s Build Your
            <br />
            <span style={{ color: "#00ff88" }}>Digital Presence</span>
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
            Whether you need a marketing site, a product platform, or a full
            digital presence &mdash; we&apos;re ready to architect something
            extraordinary.
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

      <HomeFooter />
    </div>
  );
}
