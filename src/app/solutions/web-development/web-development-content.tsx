"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import HomeFooter from "@/components/sections/HomeFooter";
import { ArrowUpRight } from "lucide-react";

/* ── Data ── */
const PROCESS = [
  {
    num: "01",
    title: "Discovery",
    text: "Deep-dive into your business goals, audience, and competitive landscape. We map the terrain before we build.",
  },
  {
    num: "02",
    title: "Architecture",
    text: "Information architecture, wireframes, and technical planning. The blueprint that makes everything else possible.",
  },
  {
    num: "03",
    title: "Development",
    text: "React, Next.js, TypeScript. Component-driven development with performance baked into every decision.",
  },
  {
    num: "04",
    title: "Launch & Iterate",
    text: "Deployment, analytics integration, and continuous optimization. Your site gets better every month.",
  },
];

const TECH = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Framer Motion",
  "Vercel",
  "Node.js",
  "PostgreSQL",
];

const STATS = [
  { value: "99+", label: "Lighthouse Score" },
  { value: "< 2s", label: "Load Time" },
  { value: "< 0.1", label: "CLS" },
];

/* ── Component ── */
export default function WebDevelopmentContent() {
  const heroRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const { scrollYProgress: processProgress } = useScroll({
    target: processRef,
    offset: ["start end", "end start"],
  });

  const layer1Y = useTransform(heroProgress, [0, 1], [0, -60]);
  const layer2Y = useTransform(heroProgress, [0, 1], [0, -200]);
  const lineHeight = useTransform(processProgress, [0.1, 0.85], ["0%", "100%"]);

  return (
    <div className="bg-black min-h-screen overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════
          HERO — 2-layer parallax
      ══════════════════════════════════════════════════════════ */}
      <div ref={heroRef} className="relative h-screen overflow-hidden">
        {/* Layer 1 — background */}
        <motion.div className="absolute inset-0" style={{ y: layer1Y, zIndex: 1 }}>
          <Image
            src="/images/solutions/web-development/layer1- dark moody desktop.png"
            alt="Dark moody desktop workspace"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </motion.div>

        {/* Layer 2 — foreground */}
        <motion.div className="absolute inset-0" style={{ y: layer2Y, zIndex: 2 }}>
          <Image
            src="/images/solutions/web-development/layer2 -wireframe fragments.png"
            alt="Wireframe fragments"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>

        {/* Gradient veil */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[60%] z-[3]"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
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
          01
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
            Solution 01
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
            Web
            <br />
            Development
          </motion.h1>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          PHILOSOPHY — offset asymmetric layout
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-44 px-[clamp(1.5rem,4vw,4rem)]">
        {/* Grid bg */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs>
            <pattern id="g-phil" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#g-phil)" />
        </svg>

        <div className="relative z-[1] max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_auto_320px] gap-12 lg:gap-8 items-start">
          {/* Left — statement */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              className="font-mono text-[10px] tracking-[0.3em] uppercase mb-8"
              style={{ color: "rgba(0,255,136,0.5)" }}
            >
              Philosophy
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
                fontSize: "clamp(28px, 4.5vw, 56px)",
                color: "#fff",
              }}
            >
              We Don&apos;t Build Websites.
              <br />
              <span style={{ color: "#00ff88" }}>We Engineer Digital Architecture.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="max-w-xl text-sm md:text-base leading-[1.8]"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Every element has a purpose. Every pixel serves the conversion.
              We approach web development the way architects approach structures
              &mdash; with precision, intent, and an obsessive attention to the
              invisible systems that make everything work.
            </motion.p>
          </div>

          {/* Vertical accent line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block origin-top"
            style={{ width: 1, height: 200, background: "rgba(0,255,136,0.15)" }}
          />

          {/* Right — stats */}
          <div className="flex flex-row lg:flex-col gap-6 lg:gap-10 lg:pt-12">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.12 }}
              >
                <div
                  className="font-mono text-2xl md:text-3xl font-bold"
                  style={{ color: "#00ff88" }}
                >
                  {s.value}
                </div>
                <div
                  className="font-mono text-[10px] tracking-[0.2em] uppercase mt-1"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          PROCESS — numbered steps + SVG connector
      ══════════════════════════════════════════════════════════ */}
      <section
        ref={processRef}
        className="relative py-32 md:py-44 px-[clamp(1.5rem,4vw,4rem)]"
      >
        <div className="relative z-[1] max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[10px] tracking-[0.3em] uppercase mb-16"
            style={{ color: "rgba(0,255,136,0.5)" }}
          >
            Process
          </motion.p>

          <div className="relative">
            {/* SVG connector line — draws on scroll */}
            <div className="absolute left-[28px] md:left-[44px] top-0 bottom-0 w-px overflow-hidden hidden md:block">
              <motion.div
                className="w-full origin-top"
                style={{
                  height: lineHeight,
                  background: "linear-gradient(to bottom, #00ff88, rgba(0,255,136,0.1))",
                }}
              />
            </div>

            {/* Steps */}
            <div className="flex flex-col gap-20 md:gap-28">
              {PROCESS.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: i * 0.08 }}
                  className="grid grid-cols-[56px_1fr] md:grid-cols-[88px_1fr] gap-6 md:gap-10 items-start"
                >
                  {/* Number */}
                  <div
                    className="relative flex items-center justify-center"
                    style={{
                      fontFamily: "var(--font-monument), sans-serif",
                      fontWeight: 800,
                      fontSize: "clamp(28px, 4vw, 48px)",
                      color: "rgba(255,255,255,0.06)",
                      lineHeight: 1,
                    }}
                  >
                    {step.num}
                    {/* Dot on the connector line */}
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full hidden md:block"
                      style={{
                        background: "#00ff88",
                        boxShadow: "0 0 12px rgba(0,255,136,0.4)",
                      }}
                    />
                  </div>

                  {/* Card */}
                  <div
                    className="backdrop-blur-md rounded-xl px-6 py-6 md:px-8 md:py-7"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <h3
                      className="uppercase mb-3"
                      style={{
                        fontFamily: "var(--font-monument), sans-serif",
                        fontWeight: 800,
                        fontSize: "clamp(16px, 2vw, 22px)",
                        letterSpacing: "0.04em",
                        color: "#fff",
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-sm leading-[1.75]"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      {step.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TECH STACK — floating badges
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-36 px-[clamp(1.5rem,4vw,4rem)]">
        <div className="relative z-[1] max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[10px] tracking-[0.3em] uppercase mb-12"
            style={{ color: "rgba(0,255,136,0.5)" }}
          >
            Tech Stack
          </motion.p>

          <div className="flex flex-wrap gap-3 md:gap-4">
            {TECH.map((t, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 20, scale: 0.92 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="backdrop-blur-md rounded-lg px-5 py-2.5 font-mono text-[11px] tracking-[0.15em] uppercase"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                {t}
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
            Your website will load in under 2 seconds, score 90+ on every
            Lighthouse metric, and be built on a codebase you actually own.
            No templates. No page builders. No compromises.
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
            href="/projects/website-projects"
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
                See Our Web Projects
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
              Explore the websites we&apos;ve built for businesses across Europe.
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
            background: "radial-gradient(ellipse at 50% 50%, rgba(0,255,136,0.04) 0%, transparent 60%)",
          }}
        />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs>
            <pattern id="cta-g-wd" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-g-wd)" />
        </svg>
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.2) 30%, rgba(0,255,136,0.2) 70%, transparent 100%)",
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
            Let&apos;s Turn Your Vision
            <br />
            <span style={{ color: "#00ff88" }}>Into Reality</span>
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
            Whether you need a marketing site, a product page, or a full digital
            presence &mdash; we&apos;re ready to architect something extraordinary.
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
