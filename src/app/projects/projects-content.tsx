"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import HomeFooter from "@/components/sections/HomeFooter";

/* ── Category data ── */
const CATEGORIES = [
  {
    id: "websites",
    number: "01",
    title: "WEBSITE\nPROJECTS",
    description:
      "Fast, scalable, and beautifully crafted websites built with React, Next.js & TypeScript. Performance-driven development that ranks and converts.",
    href: "/projects/website-projects",
    image: "/images/projects/website-projects/web-dev.png",
    count: "7 Projects",
  },
  {
    id: "videography",
    number: "02",
    title: "VIDEOGRAPHY\nPROJECTS",
    description:
      "Cinematic video production that captures your brand story. From concept to final cut — content that stops the scroll and holds attention.",
    href: "/projects/videography",
    image: "/images/projects/videography/videography.png",
    count: "3 Projects",
  },
  {
    id: "social-media",
    number: "03",
    title: "SOCIAL MEDIA\nPROJECTS",
    description:
      "Strategic social media management that grows communities. Content planning, brand narrative, and audience engagement across every platform.",
    href: "/projects/social-media",
    image: "/images/projects/social-media/social-media.png",
    count: "4 Clients",
  },
];

const SLIDE_COUNT = CATEGORIES.length;

/* ─────────────────────────────────────────────────────────────────
   MOBILE: Vertical sticky stack with parallax-exit per card
   Each section = 250vh (100vh card + 150vh parallax zone).
   Cards 2-N use margin-top: -100vh so the next card slides over
   the previous one seamlessly — no gap between sticky phases.
───────────────────────────────────────────────────────────────── */
const EXTRA_VH = 1.5;

function MobileProjectCard({
  cat,
  index,
}: {
  cat: (typeof CATEGORIES)[0];
  index: number;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);

  /* Progress through the sticky zone (0 = just stuck, 1 = about to be covered) */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* Entrance: 0 = card bottom at viewport bottom, 1 = card top at viewport top */
  const { scrollYProgress: entranceProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });

  /* ── Exit parallax transforms ── */
  const eyebrowX   = useTransform(scrollYProgress, [0, 1],           ["0px", "-90px"]);
  const eyebrowOp  = useTransform(scrollYProgress, [0, 0.45, 0.8],   [1, 0.4, 0]);

  const titleScale = useTransform(scrollYProgress, [0, 1],           [1, 0.68]);
  const titleY     = useTransform(scrollYProgress, [0, 1],           ["0px", "-32px"]);
  const titleOp    = useTransform(scrollYProgress, [0, 0.4, 0.85],   [1, 0.75, 0]);

  const lineScaleX = useTransform(scrollYProgress, [0, 0.5],         [1, 0]);
  const lineOp     = useTransform(scrollYProgress, [0, 0.35],        [1, 0]);

  const descX      = useTransform(scrollYProgress, [0, 1],           ["0px", "95px"]);
  const descOp     = useTransform(scrollYProgress, [0, 0.38, 0.78],  [1, 0.5, 0]);

  const countX     = useTransform(scrollYProgress, [0, 1],           ["0px", "70px"]);
  const countOp    = useTransform(scrollYProgress, [0, 0.35, 0.72],  [1, 0.4, 0]);

  const btnX       = useTransform(scrollYProgress, [0, 1],           ["0px", "-70px"]);
  const btnOp      = useTransform(scrollYProgress, [0, 0.42, 0.78],  [1, 0.3, 0]);

  /* Background zooms IN while content zooms out */
  const bgScale    = useTransform(scrollYProgress, [0, 1],           [1.0, 1.32]);
  const bgOp       = useTransform(scrollYProgress, [0, 0.7, 1],      [0.62, 0.35, 0.15]);

  /* Darkening vignette grows as card exits */
  const vignOp     = useTransform(scrollYProgress, [0.1, 1],         [0, 0.9]);

  /* Large watermark number zooms OUT */
  const numScale   = useTransform(scrollYProgress, [0, 1],           [1, 1.8]);
  const numOp      = useTransform(scrollYProgress, [0, 0.12, 0.7],   [0.06, 0.03, 0]);

  /* Entrance: card slides in from below with slight scale-up */
  const entScale   = useTransform(entranceProgress, [0, 1],          [0.96, 1.0]);

  /* Subtle horizontal scan-line that sweeps down as the card exits */
  const scanY      = useTransform(scrollYProgress, [0, 1],           ["-5%", "110%"]);
  const scanOp     = useTransform(scrollYProgress, [0, 0.05, 0.85, 1], [0, 0.15, 0.15, 0]);

  const progressBar = scrollYProgress;

  return (
    <div
      ref={sectionRef}
      style={{
        height: `${100 + EXTRA_VH * 100}vh`,
        position: "relative",
        zIndex: index + 1,
        marginTop: index === 0 ? 0 : "-100vh",
      }}
    >
      {/* ── Sticky card ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Entrance-scale wrapper */}
        <motion.div
          className="absolute inset-0"
          style={{ scale: entScale, transformOrigin: "center bottom" }}
        >
          {/* ── Background image — zooms in ── */}
          <div className="absolute inset-0 bg-[#080808]">
            <motion.div
              className="absolute inset-0"
              style={{ scale: bgScale, transformOrigin: "center" }}
            >
              <motion.div className="absolute inset-0" style={{ opacity: bgOp }}>
                <Image
                  src={cat.image}
                  alt={cat.title.replace("\n", " ")}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </motion.div>
            </motion.div>
          </div>

          {/* ── Gradient overlay ── */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(155deg, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.72) 45%, rgba(0,0,0,0.48) 100%)",
            }}
          />

          {/* ── Subtle grid ── */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: 0.045 }}
          >
            <defs>
              <pattern
                id={`mgrid-${cat.id}`}
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
            <rect width="100%" height="100%" fill={`url(#mgrid-${cat.id})`} />
          </svg>

          {/* ── Top-edge shadow ── */}
          <div
            className="absolute top-0 left-0 right-0 h-20 pointer-events-none z-[4]"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)",
            }}
          />

          {/* ── Sweeping horizontal scan line ── */}
          <motion.div
            className="absolute left-0 right-0 h-px pointer-events-none z-[4]"
            style={{
              top: scanY,
              opacity: scanOp,
              background:
                "linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.6) 20%, rgba(0,255,136,0.6) 80%, transparent 100%)",
            }}
          />

          {/* ── Exit darkening vignette ── */}
          <motion.div
            className="absolute inset-0 bg-black pointer-events-none z-[3]"
            style={{ opacity: vignOp }}
          />

          {/* ── Watermark number — zooms OUT ── */}
          <motion.p
            className="absolute font-mono font-bold text-white select-none pointer-events-none z-[2]"
            style={{
              bottom: "12vh",
              right: "-2vw",
              fontSize: "42vw",
              lineHeight: 0.88,
              scale: numScale,
              opacity: numOp,
              transformOrigin: "right bottom",
            }}
          >
            {cat.number}
          </motion.p>

          {/* ── Content ── */}
          <div className="relative z-[5] flex flex-col justify-end h-full px-6 pt-20 pb-10 min-h-0">
            {/* Eyebrow */}
            <motion.p
              className="font-mono tracking-[0.3em] uppercase shrink-0"
              style={{
                x: eyebrowX,
                opacity: eyebrowOp,
                color: "#00ff88",
                fontSize: "10px",
                marginBottom: "clamp(8px, 2.5vw, 16px)",
              }}
            >
              Category {cat.number}
            </motion.p>

            {/* Title — zooms out */}
            <motion.h2
              className="uppercase leading-[0.88] shrink-0"
              style={{
                fontFamily: "var(--font-monument), sans-serif",
                fontWeight: 800,
                fontSize: "clamp(30px, 9.5vw, 62px)",
                color: "#ffffff",
                scale: titleScale,
                y: titleY,
                opacity: titleOp,
                transformOrigin: "left bottom",
                whiteSpace: "pre-line",
                marginBottom: "clamp(10px, 2.5vw, 20px)",
              }}
            >
              {cat.title}
            </motion.h2>

            {/* Green divider — shrinks left-to-right */}
            <motion.div
              className="shrink-0"
              style={{
                width: 64,
                height: 2,
                background: "#00ff88",
                boxShadow: "0 0 12px rgba(0,255,136,0.45)",
                scaleX: lineScaleX,
                opacity: lineOp,
                transformOrigin: "left",
                marginBottom: "clamp(10px, 2.5vw, 20px)",
              }}
            />

            {/* Description — slides right */}
            <motion.p
              className="leading-relaxed shrink-0"
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: "clamp(11px, 3.5vw, 14px)",
                color: "rgba(255,255,255,0.62)",
                x: descX,
                opacity: descOp,
                maxWidth: "min(310px, 85vw)",
                marginBottom: "clamp(6px, 1.5vw, 10px)",
              }}
            >
              {cat.description}
            </motion.p>

            {/* Project count badge — slides right (slightly slower than desc) */}
            <motion.p
              className="font-mono tracking-[0.2em] uppercase shrink-0"
              style={{
                x: countX,
                opacity: countOp,
                color: "rgba(0,255,136,0.55)",
                fontSize: "10px",
                marginBottom: "clamp(14px, 3.5vw, 28px)",
              }}
            >
              {cat.count}
            </motion.p>

            {/* Button — slides left */}
            <motion.div
              style={{ x: btnX, opacity: btnOp }}
              className="w-fit shrink-0"
            >
              <Button href={cat.href} variant="primary" size="md">
                <span style={{ color: "#00ff88" }}>Explore</span>
              </Button>
            </motion.div>
          </div>

          {/* ── Green progress bar at bottom ── */}
          <motion.div
            className="absolute bottom-0 left-0 w-full h-[2px] origin-left z-[6]"
            style={{
              scaleX: progressBar,
              background:
                "linear-gradient(90deg, #00ff88 0%, rgba(0,255,136,0.35) 100%)",
              boxShadow: "0 0 10px rgba(0,255,136,0.55)",
            }}
          />

          {/* ── Card position dots — top right ── */}
          <div className="absolute top-20 right-5 z-[6] flex flex-col items-end gap-[7px]">
            {CATEGORIES.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === index ? 18 : 4,
                  height: 4,
                  background:
                    i === index ? "#00ff88" : "rgba(255,255,255,0.18)",
                  boxShadow:
                    i === index ? "0 0 8px rgba(0,255,136,0.7)" : "none",
                }}
              />
            ))}
          </div>

          {/* ── Corner bracket watermark ── */}
          <div className="absolute bottom-5 right-5 opacity-[0.07] z-[2]">
            <div className="relative w-10 h-10">
              <div className="absolute bottom-0 right-0 w-full h-px bg-white" />
              <div className="absolute bottom-0 right-0 w-px h-full bg-white" />
            </div>
          </div>

          {/* ── Green glow at bottom-left corner ── */}
          <div
            className="absolute bottom-0 left-0 w-32 h-32 pointer-events-none z-[1]"
            style={{
              background:
                "radial-gradient(ellipse at bottom left, rgba(0,255,136,0.06) 0%, transparent 70%)",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAIN PAGE COMPONENT
───────────────────────────────────────────────────────────────── */
export default function ProjectsContent() {
  const heroRef = useRef<HTMLDivElement>(null);
  const carouselWrapperRef = useRef<HTMLDivElement>(null);
  const isSnapping = useRef(false);
  const [activeSlide, setActiveSlide] = useState(0);

  /* ── Carousel scroll-jacking (desktop only) ── */
  const { scrollYProgress: carouselProgress } = useScroll({
    target: carouselWrapperRef,
    offset: ["start start", "end end"],
  });

  const carouselX = useTransform(carouselProgress, (v) => {
    const slideIndex = v * (SLIDE_COUNT - 1);
    return `${-(slideIndex / SLIDE_COUNT) * 100}%`;
  });

  useMotionValueEvent(carouselProgress, "change", (val) => {
    const idx = Math.round(val * (SLIDE_COUNT - 1));
    const clamped = Math.max(0, Math.min(SLIDE_COUNT - 1, idx));
    if (clamped !== activeSlide) setActiveSlide(clamped);
  });

  const snapTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const snapToNearest = useCallback(() => {
    if (isSnapping.current) return;
    const wrapper = carouselWrapperRef.current;
    if (!wrapper) return;

    const wrapperScrollHeight = wrapper.offsetHeight - window.innerHeight;
    if (wrapperScrollHeight <= 0) return; // hidden on mobile — bail

    const rect = wrapper.getBoundingClientRect();
    const wrapperTop = window.scrollY + rect.top;
    const currentProgress =
      (window.scrollY - wrapperTop) / wrapperScrollHeight;

    if (currentProgress < -0.02 || currentProgress > 1.02) return;

    const nearestSlide = Math.round(currentProgress * (SLIDE_COUNT - 1));
    const clamped = Math.max(0, Math.min(SLIDE_COUNT - 1, nearestSlide));
    const targetProgress = clamped / (SLIDE_COUNT - 1);
    const targetScroll = wrapperTop + targetProgress * wrapperScrollHeight;

    if (Math.abs(window.scrollY - targetScroll) < 5) return;

    isSnapping.current = true;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
    setTimeout(() => { isSnapping.current = false; }, 600);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (isSnapping.current) return;
      if (snapTimeout.current) clearTimeout(snapTimeout.current);
      snapTimeout.current = setTimeout(snapToNearest, 120);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (snapTimeout.current) clearTimeout(snapTimeout.current);
    };
  }, [snapToNearest]);

  const scrollToSlide = (index: number) => {
    const clamped = Math.max(0, Math.min(SLIDE_COUNT - 1, index));
    const wrapper = carouselWrapperRef.current;
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const wrapperTop = window.scrollY + rect.top;
    const wrapperScrollHeight = wrapper.offsetHeight - window.innerHeight;
    const targetScroll =
      wrapperTop + (clamped / (SLIDE_COUNT - 1)) * wrapperScrollHeight;

    isSnapping.current = true;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
    setTimeout(() => { isSnapping.current = false; }, 600);
  };

  return (
    <div className="bg-black min-h-screen">
      {/* ══════ Hero — 100vh ══════ */}
      <div ref={heroRef} className="relative h-screen overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs>
            <pattern
              id="hero-grid-proj"
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
          <rect width="100%" height="100%" fill="url(#hero-grid-proj)" />
        </svg>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 25% 80%, rgba(0,255,136,0.05) 0%, transparent 60%)",
          }}
        />

        <div
          className="absolute top-[15%] right-[clamp(1rem,3vw,3rem)] select-none pointer-events-none"
          style={{
            fontFamily: "var(--font-monument), sans-serif",
            fontWeight: 800,
            fontSize: "clamp(140px, 22vw, 360px)",
            lineHeight: 1,
            color: "rgba(255,255,255,0.02)",
          }}
        >
          K
        </div>

        <div className="absolute bottom-12 left-[clamp(1.5rem,4vw,4rem)] z-[5]">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[11px] tracking-[0.3em] uppercase mb-4"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Portfolio
          </motion.p>
          <motion.h1
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="leading-[0.9] uppercase"
            style={{
              fontFamily: "var(--font-monument), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(32px, 10vw, 120px)",
              color: "#ffffff",
            }}
          >
            Selected
            <br />
            <span style={{ color: "#00ff88" }}>Work</span>
          </motion.h1>
        </div>
      </div>

      {/* ══════ Desktop: Horizontal carousel (hidden on mobile) ══════ */}
      <div className="hidden md:block">
        <div
          ref={carouselWrapperRef}
          style={{ height: `${SLIDE_COUNT * 100}vh`, position: "relative" }}
        >
          <div className="sticky top-0 h-screen w-full overflow-hidden">
            <motion.div
              className="flex h-full"
              style={{ x: carouselX, width: `${SLIDE_COUNT * 100}%` }}
            >
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="relative h-full flex items-center"
                  style={{ width: `${100 / SLIDE_COUNT}%` }}
                >
                  <div className="absolute inset-0 bg-black">
                    <Image
                      src={cat.image}
                      alt={cat.title.replace("\n", " ")}
                      fill
                      className="object-cover opacity-30"
                      sizes="100vw"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%)",
                      }}
                    />
                  </div>

                  <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
                    <defs>
                      <pattern
                        id={`grid-${cat.id}`}
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
                    <rect
                      width="100%"
                      height="100%"
                      fill={`url(#grid-${cat.id})`}
                    />
                  </svg>

                  <div className="absolute bottom-8 right-8 opacity-[0.08] z-[1]">
                    <div className="relative w-16 h-16">
                      <div className="absolute bottom-0 right-0 w-full h-px bg-white" />
                      <div className="absolute bottom-0 right-0 w-px h-full bg-white" />
                    </div>
                    <p
                      className="font-mono text-[9px] tracking-[0.4em] uppercase mt-2 text-right"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      KONA
                    </p>
                  </div>

                  <div className="relative z-[2] px-[clamp(1.5rem,4vw,4rem)] pb-32 pt-24 flex flex-col justify-end h-full max-w-3xl">
                    <p
                      className="font-mono text-[11px] tracking-[0.3em] uppercase mb-6"
                      style={{ color: "#00ff88" }}
                    >
                      Category {cat.number}
                    </p>

                    <h2
                      className="uppercase whitespace-pre-line leading-[0.9] mb-6"
                      style={{
                        fontFamily: "var(--font-monument), sans-serif",
                        fontWeight: 800,
                        fontSize: "clamp(36px, 7vw, 88px)",
                        color: "#ffffff",
                      }}
                    >
                      {cat.title}
                    </h2>

                    <div
                      className="mb-6"
                      style={{
                        width: "clamp(60px, 8vw, 120px)",
                        height: 2,
                        background: "#00ff88",
                        boxShadow: "0 0 12px rgba(0,255,136,0.3)",
                      }}
                    />

                    <p
                      className="text-sm md:text-base leading-relaxed mb-4 max-w-lg"
                      style={{
                        fontFamily: "var(--font-geist-sans), sans-serif",
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      {cat.description}
                    </p>

                    <p
                      className="text-[11px] tracking-[0.2em] uppercase mb-8"
                      style={{
                        fontFamily: "var(--font-geist-mono), monospace",
                        color: "rgba(0,255,136,0.5)",
                      }}
                    >
                      {cat.count}
                    </p>

                    <div className="w-fit">
                      <Button href={cat.href} variant="primary" size="md">
                        <span style={{ color: "#00ff88" }}>Explore</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Navigation arrows */}
            <button
              onClick={() => scrollToSlide(activeSlide - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-[10] w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                opacity: activeSlide === 0 ? 0.2 : 1,
                pointerEvents: activeSlide === 0 ? "none" : "auto",
              }}
              aria-label="Previous category"
            >
              <ChevronLeft className="w-5 h-5 text-white/70" />
            </button>
            <button
              onClick={() => scrollToSlide(activeSlide + 1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-[10] w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                opacity: activeSlide === SLIDE_COUNT - 1 ? 0.2 : 1,
                pointerEvents:
                  activeSlide === SLIDE_COUNT - 1 ? "none" : "auto",
              }}
              aria-label="Next category"
            >
              <ChevronRight className="w-5 h-5 text-white/70" />
            </button>

            {/* Progress dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[10] flex items-center gap-2">
              {CATEGORIES.map((cat, i) => (
                <button
                  key={cat.id}
                  onClick={() => scrollToSlide(i)}
                  className="relative h-1 rounded-full overflow-hidden transition-all duration-300"
                  style={{
                    width: activeSlide === i ? 32 : 12,
                    background: "rgba(255,255,255,0.1)",
                  }}
                  aria-label={`Go to ${cat.title.replace("\n", " ")}`}
                >
                  <div
                    className="absolute inset-0 rounded-full transition-all duration-300"
                    style={{
                      background:
                        activeSlide === i ? "#00ff88" : "transparent",
                      boxShadow:
                        activeSlide === i
                          ? "0 0 8px rgba(0,255,136,0.4)"
                          : "none",
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════ Mobile: Vertical sticky stack (hidden on desktop) ══════ */}
      <div className="md:hidden">
        {CATEGORIES.map((cat, i) => (
          <MobileProjectCard key={cat.id} cat={cat} index={i} />
        ))}
      </div>

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
              id="cta-grid-proj"
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
          <rect width="100%" height="100%" fill="url(#cta-grid-proj)" />
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
            Like What You See?
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
            Let&apos;s Create Something
            <br />
            <span style={{ color: "#00ff88" }}>Extraordinary</span>
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
            Whether you need a website, video content, or a full social media
            strategy &mdash; we&apos;re ready to make it happen.
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
