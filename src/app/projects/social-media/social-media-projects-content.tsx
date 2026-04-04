"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import HomeFooter from "@/components/sections/HomeFooter";
import SocialMediaShowcase from "@/components/sections/social-media-showcase";
import { SOCIAL_PROJECTS } from "@/data/projects";
import type { SocialShowcaseProject } from "@/components/sections/social-media-showcase";

/* ── Map data ── */
const showcaseProjects: SocialShowcaseProject[] = SOCIAL_PROJECTS.map((p) => ({
  id: p.id,
  title: p.title,
  year: p.year,
  description: p.description,
  tags: p.tags,
  platforms: p.platforms,
  images: p.feedImages,
  metrics: p.metrics,
}));

/* ── Floating feed cards — real client work scattered at depth ── */
const FLOATING_CARDS = [
  {
    src: "/GLMetalWorksSocialMedia/1.png",
    alt: "GL Metal Works post",
    style: { top: "8%", right: "12%", width: "clamp(100px, 12vw, 170px)" },
    rotate: -6,
    delay: 0.5,
    parallaxRange: [-25, 25] as [number, number],
  },
  {
    src: "/LeanthiaSocialMedia/2.png",
    alt: "Leanthia Bakery post",
    style: { top: "22%", right: "34%", width: "clamp(90px, 10vw, 150px)" },
    rotate: 4,
    delay: 0.7,
    parallaxRange: [-40, 40] as [number, number],
  },
  {
    src: "/TdkDBSocialMedia/3.png",
    alt: "TDK post",
    style: { top: "48%", right: "8%", width: "clamp(110px, 13vw, 180px)" },
    rotate: -3,
    delay: 0.9,
    parallaxRange: [-20, 20] as [number, number],
  },
  {
    src: "/VelriconSocialMedia/1.png",
    alt: "Velricon post",
    style: { top: "35%", right: "52%", width: "clamp(80px, 9vw, 130px)" },
    rotate: 8,
    delay: 1.1,
    parallaxRange: [-50, 50] as [number, number],
  },
  {
    src: "/GLMetalWorksSocialMedia/3.png",
    alt: "GL Metal Works post 3",
    style: { bottom: "15%", right: "25%", width: "clamp(95px, 11vw, 155px)" },
    rotate: -5,
    delay: 1.3,
    parallaxRange: [-30, 30] as [number, number],
  },
];

/* ── Connection line node positions (percent-based for SVG) ── */
const NODES = [
  { x: 88, y: 14 },
  { x: 66, y: 28 },
  { x: 92, y: 54 },
  { x: 48, y: 41 },
  { x: 75, y: 85 },
];

export default function SocialMediaProjectsContent() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="bg-black min-h-screen">
      {/* ══════════════════════════════════════════════════════════════════
          HERO — "THE NETWORK"
          Full viewport. Floating social feed cards at various depths
          and rotations. Animated SVG connection lines pulse between
          nodes. Phone mockup parallax layer. Notification pulse dots.
          ══════════════════════════════════════════════════════════════════ */}
      <motion.section
        ref={heroRef}
        className="relative h-screen overflow-hidden"
        style={{ opacity: overlayOpacity }}
      >
        {/* ── Background image with parallax ── */}
        <motion.div className="absolute inset-0" style={{ y: bgY }}>
          <Image
            src="/images/projects/social-media/social-media.png"
            alt="Social media atmosphere"
            fill
            className="object-cover"
            style={{ opacity: 0.12 }}
            sizes="100vw"
            priority
          />
        </motion.div>

        {/* ── Radial glow accents ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 80% 30%, rgba(0,255,136,0.05) 0%, transparent 50%),
              radial-gradient(ellipse at 20% 80%, rgba(0,255,136,0.04) 0%, transparent 50%)
            `,
          }}
        />

        {/* ── Animated SVG connection lines between floating cards ── */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-[1] hidden md:block">
          {/* Connection lines between nodes */}
          {[
            [0, 1],
            [1, 3],
            [0, 2],
            [2, 4],
            [3, 4],
            [1, 2],
          ].map(([a, b], i) => (
            <motion.line
              key={`line-${i}`}
              x1={`${NODES[a].x}%`}
              y1={`${NODES[a].y}%`}
              x2={`${NODES[b].x}%`}
              y2={`${NODES[b].y}%`}
              stroke="rgba(0,255,136,0.06)"
              strokeWidth="1"
              strokeDasharray="4 8"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: { duration: 1.2, delay: 0.8 + i * 0.15 },
                opacity: { duration: 0.4, delay: 0.8 + i * 0.15 },
              }}
            />
          ))}

          {/* Pulse dots at nodes */}
          {NODES.map((node, i) => (
            <g key={`node-${i}`}>
              <motion.circle
                cx={`${node.x}%`}
                cy={`${node.y}%`}
                r="3"
                fill="#00ff88"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.5, scale: 1 }}
                transition={{ duration: 0.4, delay: 1.4 + i * 0.1 }}
              />
              {/* Pulse ring */}
              <motion.circle
                cx={`${node.x}%`}
                cy={`${node.y}%`}
                r="3"
                fill="none"
                stroke="#00ff88"
                strokeWidth="1"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0.4, 0],
                  r: [3, 14],
                }}
                transition={{
                  duration: 2,
                  delay: 2 + i * 0.3,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              />
            </g>
          ))}
        </svg>

        {/* ── Floating feed cards at different depths ── */}
        <div className="absolute inset-0 z-[2] hidden md:block">
          {FLOATING_CARDS.map((card, i) => {
            const y = useTransform(
              scrollYProgress,
              [0, 1],
              card.parallaxRange
            );
            return (
              <motion.div
                key={i}
                className="absolute"
                style={{ ...card.style, y }}
                initial={{
                  opacity: 0,
                  scale: 0.8,
                  rotate: 0,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: card.rotate,
                }}
                transition={{
                  duration: 0.7,
                  delay: card.delay,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <div
                  className="relative w-full overflow-hidden"
                  style={{
                    aspectRatio: "1 / 1",
                    borderRadius: "0.5rem",
                    boxShadow:
                      "0 15px 40px rgba(0,0,0,0.5), 0 0 20px rgba(0,255,136,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <Image
                    src={card.src}
                    alt={card.alt}
                    fill
                    className="object-cover"
                    sizes="20vw"
                  />
                  {/* Subtle glass reflection */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 40%)",
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Phone mockup — center-right, slower parallax ── */}
        <motion.div
          className="absolute z-[3] hidden lg:block"
          style={{
            top: "50%",
            right: "18%",
            transform: "translateY(-50%)",
            width: "clamp(180px, 16vw, 260px)",
            y: useTransform(scrollYProgress, [0, 1], [-10, 10]),
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <Image
            src="/images/solutions/social-media/layer1 - phone mockup.png"
            alt="Phone mockup"
            width={260}
            height={520}
            className="object-contain"
            style={{
              filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.6))",
              opacity: 0.35,
            }}
          />
        </motion.div>

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
            Portfolio / 03
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
              fontSize: "clamp(22px, 9vw, 110px)",
              color: "#ffffff",
            }}
          >
            Social Media
            <br />
            <span style={{ color: "#00ff88" }}>Projects</span>
          </motion.h1>

          {/* Accent line */}
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

        {/* ── Top-right: Vertical description ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.6 }}
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
            4 Clients &mdash; 2024
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
            Strategic content that grows communities and captures attention
            across every platform.
          </p>
        </motion.div>

        {/* ── Notification badge — floating ── */}
        <motion.div
          className="absolute z-[4] hidden md:flex items-center gap-2"
          style={{ top: "18%", left: "clamp(2rem, 5vw, 5rem)" }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.0, duration: 0.6 }}
        >
          <div
            className="px-3 py-1.5 rounded-full flex items-center gap-2"
            style={{
              backdropFilter: "blur(12px)",
              background: "rgba(0,255,136,0.06)",
              border: "1px solid rgba(0,255,136,0.15)",
            }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#00ff88" }}
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span
              className="text-[10px] tracking-[0.15em] uppercase"
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                color: "rgba(0,255,136,0.6)",
              }}
            >
              2.5M+ Reach
            </span>
          </div>
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

      {/* ══════ Social Media Showcase ══════ */}
      <SocialMediaShowcase projects={showcaseProjects} />

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
              id="cta-grid-sm"
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
          <rect width="100%" height="100%" fill="url(#cta-grid-sm)" />
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
            Ready to Grow?
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
            Let&apos;s Build
            <br />
            <span style={{ color: "#00ff88" }}>Your Audience</span>
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
            Strategic social media management that grows communities and
            captures attention &mdash; content planning, brand narrative, and
            audience engagement across every platform.
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
