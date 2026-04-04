"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import HomeFooter from "@/components/sections/HomeFooter";
import ParallaxStackingProjects from "@/components/sections/parallax-stacking-projects";
import { VIDEO_PROJECTS } from "@/data/projects";
import type { StackProject } from "@/components/sections/parallax-stacking-projects";

/* ── Map data ── */
const stackProjects: StackProject[] = VIDEO_PROJECTS.map((p) => ({
  id: p.id,
  title: p.title,
  year: p.year,
  description: p.description,
  tags: p.tags,
  image: p.thumbnail,
  href: p.videoUrl,
  linkLabel: "Watch Film",
  isVideo: true,
  duration: p.duration,
}));

/* ── Timecode counter hook ── */
function useTimecode() {
  const [tc, setTc] = useState("00:00:00:00");
  useEffect(() => {
    const start = performance.now();
    let raf: number;
    function tick() {
      const elapsed = (performance.now() - start) / 1000;
      const h = Math.floor(elapsed / 3600)
        .toString()
        .padStart(2, "0");
      const m = Math.floor((elapsed % 3600) / 60)
        .toString()
        .padStart(2, "0");
      const s = Math.floor(elapsed % 60)
        .toString()
        .padStart(2, "0");
      const f = Math.floor((elapsed % 1) * 24)
        .toString()
        .padStart(2, "0");
      setTc(`${h}:${m}:${s}:${f}`);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return tc;
}

/* ── Film strip sprocket holes ── */
const SPROCKET_COUNT = 12;

export default function VideographyProjectsContent() {
  const heroRef = useRef<HTMLDivElement>(null);
  const timecode = useTimecode();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const flareY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="bg-black min-h-screen">
      {/* ══════════════════════════════════════════════════════════════════
          HERO — "THE DIRECTOR'S FRAME"
          Full viewport. Cinema letterbox bars. Layered lens flares.
          Film grain noise. Timecode counter. Film strip accent.
          ══════════════════════════════════════════════════════════════════ */}
      <motion.section
        ref={heroRef}
        className="relative h-screen overflow-hidden"
        style={{ opacity: overlayOpacity }}
      >
        {/* ── Background image — slow parallax ── */}
        <motion.div className="absolute inset-0" style={{ y: bgY }}>
          <Image
            src="/images/projects/videography/videography.png"
            alt="Videography atmosphere"
            fill
            className="object-cover"
            style={{ opacity: 0.2 }}
            sizes="100vw"
            priority
          />
        </motion.div>

        {/* ── Lens flare layer — faster parallax ── */}
        <motion.div className="absolute inset-0" style={{ y: flareY }}>
          <Image
            src="/images/solutions/videography/layer1-lens flares.png"
            alt="Lens flares"
            fill
            className="object-cover"
            style={{ opacity: 0.12, mixBlendMode: "screen" }}
            sizes="100vw"
          />
        </motion.div>

        {/* ── Film grain noise overlay (CSS-generated) ── */}
        <div
          className="absolute inset-0 pointer-events-none z-[2]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
            opacity: 0.5,
          }}
        />

        {/* ── Cinematic letterbox bars ── */}
        <motion.div
          className="absolute top-0 left-0 right-0 z-[4]"
          style={{ background: "#000000" }}
          initial={{ height: "50vh" }}
          animate={{ height: "clamp(40px, 8vh, 80px)" }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-[4]"
          style={{ background: "#000000" }}
          initial={{ height: "50vh" }}
          animate={{ height: "clamp(40px, 8vh, 80px)" }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        {/* ── Inner letterbox border accent (green hairline) ── */}
        <motion.div
          className="absolute left-0 right-0 h-px z-[5]"
          style={{
            top: "clamp(40px, 8vh, 80px)",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.2) 20%, rgba(0,255,136,0.2) 80%, transparent 100%)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        />
        <motion.div
          className="absolute left-0 right-0 h-px z-[5]"
          style={{
            bottom: "clamp(40px, 8vh, 80px)",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.2) 20%, rgba(0,255,136,0.2) 80%, transparent 100%)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        />

        {/* ── Horizontal film strip accent — left edge ── */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 z-[3] hidden lg:flex flex-col items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          style={{ width: 28 }}
        >
          {Array.from({ length: SPROCKET_COUNT }).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className="rounded-sm"
                style={{
                  width: 8,
                  height: 5,
                  background: "rgba(255,255,255,0.06)",
                  margin: "6px 0",
                }}
              />
            </div>
          ))}
          {/* Film strip border */}
          <div
            className="absolute top-0 bottom-0 right-0 w-px"
            style={{ background: "rgba(255,255,255,0.06)" }}
          />
        </motion.div>

        {/* ── Center crosshair / focus mark ── */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[3] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          <svg width="80" height="80" viewBox="0 0 80 80">
            {/* Horizontal crosshair */}
            <line
              x1="0"
              y1="40"
              x2="30"
              y2="40"
              stroke="rgba(0,255,136,0.15)"
              strokeWidth="0.5"
            />
            <line
              x1="50"
              y1="40"
              x2="80"
              y2="40"
              stroke="rgba(0,255,136,0.15)"
              strokeWidth="0.5"
            />
            {/* Vertical crosshair */}
            <line
              x1="40"
              y1="0"
              x2="40"
              y2="30"
              stroke="rgba(0,255,136,0.15)"
              strokeWidth="0.5"
            />
            <line
              x1="40"
              y1="50"
              x2="40"
              y2="80"
              stroke="rgba(0,255,136,0.15)"
              strokeWidth="0.5"
            />
            {/* Center circle */}
            <circle
              cx="40"
              cy="40"
              r="12"
              fill="none"
              stroke="rgba(0,255,136,0.1)"
              strokeWidth="0.5"
            />
          </svg>
        </motion.div>

        {/* ── Bottom-left: Main title ── */}
        <div className="absolute bottom-0 left-0 z-[6] pb-[calc(clamp(40px,8vh,80px)+24px)] md:pb-[calc(clamp(40px,8vh,80px)+40px)] pl-[clamp(2rem,5vw,5rem)]">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="text-[11px] tracking-[0.3em] uppercase mb-4"
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              color: "rgba(0,255,136,0.5)",
            }}
          >
            Portfolio / 02
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 1.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="leading-[0.85] uppercase"
            style={{
              fontFamily: "var(--font-monument), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(26px, 10vw, 120px)",
              color: "#ffffff",
            }}
          >
            Videography
            <br />
            <span style={{ color: "#00ff88" }}>Projects</span>
          </motion.h1>
        </div>

        {/* ── Top-right: Timecode & vertical info ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.0 }}
          className="absolute top-[calc(clamp(40px,8vh,80px)+16px)] right-[clamp(2rem,5vw,5rem)] z-[6] hidden md:flex flex-col items-end gap-4"
        >
          {/* Live timecode */}
          <p
            className="text-[11px] tabular-nums"
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              color: "rgba(0,255,136,0.4)",
              letterSpacing: "0.15em",
            }}
          >
            TC {timecode}
          </p>
          <div
            className="w-px h-12"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,255,136,0.3), transparent)",
            }}
          />
          <p
            className="text-[10px] tracking-[0.3em] uppercase"
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              color: "rgba(255,255,255,0.2)",
              writingMode: "vertical-rl",
            }}
          >
            REC &bull; 24FPS &bull; 4K
          </p>
        </motion.div>

        {/* ── Recording indicator — top-left ── */}
        <motion.div
          className="absolute z-[6] flex items-center gap-2"
          style={{
            top: "calc(clamp(40px, 8vh, 80px) + 16px)",
            left: "clamp(2rem, 5vw, 5rem)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.4 }}
        >
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: "#ff3333" }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span
            className="text-[10px] tracking-[0.2em] uppercase"
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            REC
          </span>
        </motion.div>
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
              id="cta-grid-vp"
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
          <rect width="100%" height="100%" fill="url(#cta-grid-vp)" />
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
            From cinematic brand films to scroll-stopping social content &mdash;
            we produce video that captures attention and tells your story with
            intention.
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
