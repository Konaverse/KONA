"use client";

import { useRef, useEffect, useState } from "react";
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

/* ── Counter hook ── */
function CountUp({
  target,
  suffix = "",
  prefix = "",
  duration = 2000,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target * 10) / 10);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {display % 1 === 0 ? display : display.toFixed(1)}
      {suffix}
    </span>
  );
}

/* ── Data ── */
const FLOW_STEPS = [
  {
    title: "Strategy",
    text: "Audience research, competitive analysis, and a content roadmap tailored to your brand voice and business goals.",
  },
  {
    title: "Create",
    text: "Scroll-stopping visuals, videos, and copy. Every piece designed to perform, not just to exist.",
  },
  {
    title: "Publish",
    text: "Optimal timing, platform-native formats, and strategic hashtag architecture for maximum reach.",
  },
  {
    title: "Engage",
    text: "Community management, comment responses, and DM workflows that build genuine relationships.",
  },
  {
    title: "Analyze",
    text: "Monthly performance reports with actionable insights. We optimize what works and cut what doesn't.",
  },
];

const PLATFORMS = [
  { name: "Instagram", services: "Reels, Stories, Carousels, Grid Curation" },
  { name: "TikTok", services: "Short-Form Video, Trends, Duets, Hooks" },
  { name: "Facebook", services: "Page Management, Groups, Events, Ads" },
  { name: "LinkedIn", services: "Thought Leadership, Articles, Company Page" },
  { name: "YouTube", services: "Shorts, Long-Form, Thumbnails, SEO" },
  { name: "X", services: "Threads, Engagement, Real-Time Content" },
];

const STATS_DATA = [
  { value: 300, suffix: "+", label: "Posts Monthly" },
  { value: 2.5, suffix: "M+", label: "Total Reach" },
  { value: 40, suffix: "%", label: "Avg. Engagement Increase" },
];

/* ── Component ── */
export default function SocialMediaContent() {
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const layer1Y = useTransform(heroProgress, [0, 1], [0, -50]);
  const layer2Y = useTransform(heroProgress, [0, 1], [0, -180]);

  return (
    <div className="bg-black min-h-screen overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════
          HERO — 2-layer parallax
      ══════════════════════════════════════════════════════════ */}
      <div ref={heroRef} className="relative h-screen overflow-hidden">
        {/* Layer 1 — background */}
        <motion.div className="absolute inset-0" style={{ y: layer1Y, zIndex: 1 }}>
          <Image
            src="/images/solutions/social-media/layer1 - phone mockup.png"
            alt="Phone mockup with social media"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </motion.div>

        {/* Layer 2 — foreground */}
        <motion.div className="absolute inset-0" style={{ y: layer2Y, zIndex: 2 }}>
          <Image
            src="/images/solutions/social-media/layer2- social meida.png"
            alt="Social media elements"
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
          04
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
            Solution 04
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
            Social
            <br />
            Media
          </motion.h1>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          CONTENT STRATEGY FLOW — alternating cards with dotted path
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-44 px-[clamp(1.5rem,4vw,4rem)]">
        {/* Grid bg */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs>
            <pattern id="g-flow" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#g-flow)" />
        </svg>

        <div className="relative z-[1] max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="font-mono text-[10px] tracking-[0.3em] uppercase mb-8"
            style={{ color: "rgba(0,255,136,0.5)" }}
          >
            Our Process
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="uppercase leading-[0.95] mb-20"
            style={{
              fontFamily: "var(--font-monument), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(28px, 4.5vw, 56px)",
              color: "#fff",
            }}
          >
            From Strategy
            <br />
            <span style={{ color: "#00ff88" }}>To Growth</span>
          </motion.h2>

          {/* Dotted SVG connector */}
          <div className="absolute left-1/2 top-[280px] bottom-[80px] w-px hidden md:block -translate-x-1/2">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="w-full h-full origin-top"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, rgba(0,255,136,0.2) 0px, rgba(0,255,136,0.2) 4px, transparent 4px, transparent 12px)",
              }}
            />
          </div>

          {/* Flow cards */}
          <div className="flex flex-col gap-12 md:gap-16">
            {FLOW_STEPS.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className={`flex ${isLeft ? "md:justify-start" : "md:justify-end"}`}
                >
                  <div
                    className="backdrop-blur-md rounded-xl px-6 py-6 md:px-8 md:py-7 max-w-md relative"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    {/* Step number */}
                    <div
                      className="absolute -top-3 font-mono text-[10px] tracking-[0.2em]"
                      style={{ color: "rgba(0,255,136,0.4)" }}
                    >
                      0{i + 1}
                    </div>

                    <h3
                      className="uppercase mb-3 mt-2"
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
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          PLATFORM COVERAGE — 2x3 grid
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-44 px-[clamp(1.5rem,4vw,4rem)]">
        <div className="relative z-[1] max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[10px] tracking-[0.3em] uppercase mb-16"
            style={{ color: "rgba(0,255,136,0.5)" }}
          >
            Platforms
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {PLATFORMS.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="backdrop-blur-md rounded-xl px-6 py-6 md:px-7 md:py-7"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <h3
                  className="uppercase mb-2"
                  style={{
                    fontFamily: "var(--font-monument), sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(14px, 1.6vw, 18px)",
                    letterSpacing: "0.04em",
                    color: "#fff",
                  }}
                >
                  {p.name}
                </h3>
                <p
                  className="text-xs leading-[1.7]"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  {p.services}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          STATS — animated counters
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-36 px-[clamp(1.5rem,4vw,4rem)]">
        <div className="relative z-[1] max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[10px] tracking-[0.3em] uppercase mb-16"
            style={{ color: "rgba(0,255,136,0.5)" }}
          >
            Results
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {STATS_DATA.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="text-center"
              >
                <div
                  className="font-mono font-bold mb-3"
                  style={{
                    fontSize: "clamp(40px, 6vw, 64px)",
                    color: "#00ff88",
                    lineHeight: 1,
                  }}
                >
                  <CountUp
                    target={m.value}
                    suffix={m.suffix}
                    duration={2200}
                  />
                </div>
                <div
                  className="font-mono text-[10px] tracking-[0.25em] uppercase"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {m.label}
                </div>
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
            Your brand will show up consistently, authentically, and
            strategically across every platform that matters. No generic
            templates. No recycled captions.
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
            href="/projects/social-media"
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
                See Our Social Work
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
              Explore the social media campaigns we&apos;ve managed for brands across Europe.
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
            <pattern id="cta-g-sm" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-g-sm)" />
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
            Whether you need a full social media strategy or just a team
            to execute &mdash; we&apos;re ready to grow your brand.
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
