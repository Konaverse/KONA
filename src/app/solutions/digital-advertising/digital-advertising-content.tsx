"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import HomeFooter from "@/components/sections/HomeFooter";

/* ── Counter hook ── */
function CountUp({ target, suffix = "", prefix = "", duration = 2000 }: { target: number; suffix?: string; prefix?: string; duration?: number }) {
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

  return <span ref={ref}>{prefix}{display % 1 === 0 ? display : display.toFixed(1)}{suffix}</span>;
}

/* ── Data ── */
const METRICS = [
  { value: 3.2, suffix: "x", label: "Average ROAS" },
  { value: 42, prefix: "-", suffix: "%", label: "Cost Per Acquisition" },
  { value: 156, suffix: "%", label: "Conversion Rate Lift" },
  { value: 28, suffix: " Days", label: "Avg. Time to Results" },
];

const FUNNEL = [
  {
    stage: "Awareness",
    width: "100%",
    text: "Impressions, reach, brand visibility. Casting a wide net with precision targeting.",
  },
  {
    stage: "Consideration",
    width: "75%",
    text: "Clicks, engagement, site visits. Nurturing interest into genuine intent.",
  },
  {
    stage: "Conversion",
    width: "50%",
    text: "Leads, purchases, sign-ups. Turning attention into measurable action.",
  },
  {
    stage: "Retain",
    width: "35%",
    text: "Retargeting, lookalikes, LTV. Maximizing the value of every customer acquired.",
  },
];

const PLATFORMS = [
  "Google Search Ads",
  "Google Display Network",
  "Google Shopping",
  "Meta (Facebook & Instagram)",
  "LinkedIn Ads",
  "YouTube Ads",
];

const SERVICES = [
  "Campaign architecture & setup",
  "Audience research & segmentation",
  "Ad creative & copywriting",
  "A/B testing & optimization",
  "Conversion tracking & attribution",
  "Monthly reporting & strategy calls",
];

/* ── Component ── */
export default function DigitalAdvertisingContent() {
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const titleY = useTransform(heroProgress, [0, 1], [0, -80]);

  return (
    <div className="bg-black min-h-screen overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════
          HERO — single image, title parallax
      ══════════════════════════════════════════════════════════ */}
      <div ref={heroRef} className="relative h-screen overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-[1]">
          <Image
            src="/images/solutions/digital-advertising/layer2 - analytics.png"
            alt="Analytics dashboard"
            fill
            className="object-cover opacity-20"
            sizes="100vw"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.8) 100%)",
            }}
          />
        </div>

        {/* Title — scroll-driven parallax movement */}
        <motion.div
          className="absolute bottom-16 left-[clamp(1.5rem,4vw,4rem)] z-[2]"
          style={{ y: titleY }}
        >
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-mono text-[10px] tracking-[0.35em] uppercase mb-5"
            style={{ color: "#00ff88" }}
          >
            Solution 05
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="uppercase leading-[0.88]"
            style={{
              fontFamily: "var(--font-monument), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(40px, 11vw, 130px)",
              color: "#fff",
            }}
          >
            Digital
            <br />
            Advertising
          </motion.h1>

          {/* Animated green line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="origin-left mt-6"
            style={{
              width: "clamp(100px, 20vw, 280px)",
              height: 2,
              background: "#00ff88",
              boxShadow: "0 0 20px rgba(0,255,136,0.3)",
            }}
          />
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          ROI METRICS — dashboard-style counters
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-40 px-[clamp(1.5rem,4vw,4rem)]">
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs>
            <pattern id="g-met" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#g-met)" />
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
            Results That Speak
          </motion.p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {METRICS.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="rounded-xl px-6 py-8 md:py-10"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  borderTop: "2px solid #00ff88",
                  border: "1px solid rgba(255,255,255,0.04)",
                  borderTopColor: "#00ff88",
                }}
              >
                <div
                  className="mb-3"
                  style={{
                    fontFamily: "var(--font-monument), sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(28px, 4vw, 44px)",
                    color: "#00ff88",
                  }}
                >
                  <CountUp target={m.value} suffix={m.suffix} prefix={m.prefix || ""} />
                </div>
                <div
                  className="font-mono text-[10px] tracking-[0.2em] uppercase"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {m.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FUNNEL VISUALIZATION
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-44 px-[clamp(1.5rem,4vw,4rem)]">
        <div className="relative z-[1] max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[10px] tracking-[0.3em] uppercase mb-16"
            style={{ color: "rgba(0,255,136,0.5)" }}
          >
            The Funnel
          </motion.p>

          <div className="flex flex-col items-center gap-5">
            {FUNNEL.map((f, i) => (
              <motion.div
                key={f.stage}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="rounded-xl px-6 py-6 md:px-8 md:py-7 backdrop-blur-md"
                style={{
                  width: f.width,
                  maxWidth: "100%",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-8">
                  <h3
                    className="uppercase whitespace-nowrap"
                    style={{
                      fontFamily: "var(--font-monument), sans-serif",
                      fontWeight: 800,
                      fontSize: "clamp(14px, 2vw, 20px)",
                      color: "#fff",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {f.stage}
                  </h3>
                  <p
                    className="text-sm leading-[1.6]"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    {f.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          PLATFORM & SERVICES — two columns
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-40 px-[clamp(1.5rem,4vw,4rem)]">
        <div className="relative z-[1] max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-16">
          {/* Left — platforms */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="font-mono text-[10px] tracking-[0.3em] uppercase mb-10"
              style={{ color: "rgba(0,255,136,0.5)" }}
            >
              Where We Advertise
            </motion.p>
            <ul className="flex flex-col gap-5">
              {PLATFORMS.map((p, i) => (
                <motion.li
                  key={p}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="flex items-center gap-3 font-mono text-[13px] tracking-[0.06em]"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  <span
                    className="inline-block w-3 h-px flex-shrink-0"
                    style={{ background: "#00ff88" }}
                  />
                  {p}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Right — services */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="font-mono text-[10px] tracking-[0.3em] uppercase mb-10"
              style={{ color: "rgba(0,255,136,0.5)" }}
            >
              What We Do
            </motion.p>
            <ul className="flex flex-col gap-5">
              {SERVICES.map((s, i) => (
                <motion.li
                  key={s}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="flex items-center gap-3 font-mono text-[13px] tracking-[0.06em]"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  <span
                    className="inline-block w-3 h-px flex-shrink-0"
                    style={{ background: "#00ff88" }}
                  />
                  {s}
                </motion.li>
              ))}
            </ul>
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
            Full Transparency
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
            You&apos;ll know exactly where every dollar goes and what it returned.
            No vanity metrics. No black-box reporting. We optimize for revenue,
            not impressions &mdash; and you&apos;ll have the dashboards to prove it.
          </motion.p>
        </div>
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
            Ready to Scale?
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
            Let&apos;s Grow
            <br />
            <span style={{ color: "#00ff88" }}>Your Revenue</span>
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
            Every dollar you spend on ads should come back multiplied.
            Let&apos;s build campaigns that prove it.
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
