"use client";

import { useRef, useState, useEffect, useLayoutEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useLenis } from "@/components/SmoothScroll";
import CircuitBoard from "./CircuitBoard";
import { gsap, ScrollTrigger } from "@/utils/gsap";

// ── Constants ──────────────────────────────────────────────
const NEON = "#00ff88";
const NEON_DIM = "rgba(0, 255, 136, 0.4)";
const TOTAL_FRAMES = 353;
const FRAME_PATH = "/homepage/beat2-hero-scrub/frames/frame-";

// ── Typewriter Cycle ──────────────────────────────────────
function TypewriterCycle({
  words,
  started,
  className = "",
}: {
  words: string[];
  started: boolean;
  className?: string;
}) {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!started) return;

    const word = words[wordIndex];

    if (!isDeleting && displayed.length < word.length) {
      // Typing
      const timeout = setTimeout(() => {
        setDisplayed(word.slice(0, displayed.length + 1));
      }, 80);
      return () => clearTimeout(timeout);
    }

    if (!isDeleting && displayed.length === word.length) {
      // Pause before deleting
      const timeout = setTimeout(() => setIsDeleting(true), 2500);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayed.length > 0) {
      // Deleting
      const timeout = setTimeout(() => {
        setDisplayed(displayed.slice(0, -1));
      }, 50);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayed.length === 0) {
      // Move to next word
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    }
  }, [started, displayed, isDeleting, wordIndex, words]);

  return (
    <span
      className={className}
      style={{
        color: "rgba(0,255,136,0.5)",
        fontFamily: "var(--font-comfortaa)",
        minWidth: "8em",
        display: "inline-block",
      }}
    >
      {displayed}
      <span
        style={{
          borderRight: "1.5px solid rgba(0,255,136,0.6)",
          marginLeft: 1,
          animation: "blink-caret 0.75s step-end infinite",
        }}
      />
      <style>{`@keyframes blink-caret { 50% { border-color: transparent } }`}</style>
    </span>
  );
}

// ── Bubble Text — proximity-based glow ─────────────────────
function BubbleNeonText({
  text,
  className = "",
  baseColor = NEON,
  hoverColor = "#fff",
  nearColor = "#66ffaa",
}: {
  text: string;
  className?: string;
  baseColor?: string;
  hoverColor?: string;
  nearColor?: string;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <span
      onMouseLeave={() => setHoveredIndex(null)}
      className={className}
      style={{ display: "inline-block" }}
    >
      {text.split("").map((char, idx) => {
        const distance =
          hoveredIndex !== null ? Math.abs(hoveredIndex - idx) : null;

        let style: React.CSSProperties = {
          display: "inline-block",
          transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          color: baseColor,
        };

        if (distance === 0) {
          style = {
            ...style,
            fontWeight: 700,
            textShadow: `0 0 30px ${NEON}, 0 0 60px ${NEON_DIM}, 0 0 100px rgba(0,255,136,0.15)`,
            transform: "translateY(-3px) scale(1.08)",
            color: hoverColor,
          };
        } else if (distance === 1) {
          style = {
            ...style,
            fontWeight: 600,
            textShadow: `0 0 20px ${NEON_DIM}, 0 0 40px rgba(0,255,136,0.1)`,
            transform: "translateY(-1px) scale(1.03)",
            color: nearColor,
          };
        } else if (distance === 2) {
          style = {
            ...style,
            fontWeight: 500,
            textShadow: `0 0 10px rgba(0,255,136,0.15)`,
          };
        }

        return (
          <span
            key={idx}
            onMouseEnter={() => setHoveredIndex(idx)}
            style={style}
            className="cursor-default"
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </span>
  );
}

// ── Pad frame number to 4 digits ───────────────────────────
function frameSrc(index: number) {
  return `${FRAME_PATH}${String(index).padStart(4, "0")}.jpg`;
}

// ── Component ──────────────────────────────────────────────
export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const scrubActiveRef = useRef(false);
  const { stop, start } = useLenis();

  const [videoEnded, setVideoEnded] = useState(false);
  const [titleRevealed, setTitleRevealed] = useState(false);
  const [scrubProgress, setScrubProgress] = useState(0);

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const titleX = useTransform(smoothX, [-1, 1], [-12, 12]);
  const titleY = useTransform(smoothY, [-1, 1], [-8, 8]);
  const watermarkX = useTransform(smoothX, [-1, 1], [6, -6]);
  const watermarkY = useTransform(smoothY, [-1, 1], [4, -4]);
  const descX = useTransform(smoothX, [-1, 1], [-8, 8]);
  const descY = useTransform(smoothY, [-1, 1], [-5, 5]);
  const gridX = useTransform(smoothX, [-1, 1], [8, -8]);
  const gridY = useTransform(smoothY, [-1, 1], [5, -5]);

  // ── Preload all scrub frames ──
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = frameSrc(i);
      images.push(img);
    }
    imagesRef.current = images;
  }, []);

  // ── Draw a frame on canvas ──
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imagesRef.current[index];
    if (!canvas || !ctx || !img) return;

    if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    // Cover-fit the image (same as object-cover)
    const cW = canvas.width;
    const cH = canvas.height;
    const iW = img.naturalWidth || img.width;
    const iH = img.naturalHeight || img.height;
    const scale = Math.max(cW / iW, cH / iH);
    const w = iW * scale;
    const h = iH * scale;
    const x = (cW - w) / 2;
    const y = (cH - h) / 2;

    ctx.clearRect(0, 0, cW, cH);
    ctx.drawImage(img, x, y, w, h);
  }, []);

  // ── Play entry video exactly once ──
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.loop = false;
    video.play().catch(() => {
      setVideoEnded(true);
      setTitleRevealed(true);
    });
  }, []);

  // ── Scroll lock while entry video plays (via Lenis) ──
  useLayoutEffect(() => {
    if (!videoEnded) {
      stop();
    } else {
      start();
    }
    return () => {
      start();
    };
  }, [videoEnded, stop, start]);

  // ── Entry video end → show first scrub frame on canvas ──
  const handleVideoEnd = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
    }
    // Show canvas with frame 1 (matches entry video last frame)
    const firstImg = imagesRef.current[0];
    if (firstImg) {
      const tryDraw = () => {
        if (firstImg.complete && firstImg.naturalWidth > 0) {
          drawFrame(0);
          scrubActiveRef.current = true;
        } else {
          firstImg.onload = () => {
            drawFrame(0);
            scrubActiveRef.current = true;
          };
        }
      };
      tryDraw();
    }

    setVideoEnded(true);
    setTimeout(() => setTitleRevealed(true), 200);
  }, [drawFrame]);

  // ── GSAP ScrollTrigger: pin section + scrub frames ──
  useLayoutEffect(() => {
    if (!videoEnded) return;

    const section = sectionRef.current;
    if (!section) return;

    // Small delay to let Lenis start and layout settle
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        const obj = { frame: 0 };

        gsap.to(obj, {
          frame: TOTAL_FRAMES - 1,
          ease: "none",
          snap: "frame",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=100%",
            scrub: 1.5,
            pin: true,
            pinSpacing: true,
            onUpdate: (self) => {
              const frameIndex = Math.round(obj.frame);
              const img = imagesRef.current[frameIndex];
              if (img && img.complete && img.naturalWidth > 0) {
                drawFrame(frameIndex);
              }
              setScrubProgress(self.progress);
            },
          },
        });
      }, section);

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timer);
  }, [videoEnded, drawFrame]);

  // ── Progress-driven values for scrub text layer ──
  const clamp = gsap.utils.clamp;
  const mapRange = gsap.utils.mapRange;
  const headlineOpacity = clamp(0, 1, mapRange(0, 0.1, 0, 1, scrubProgress));
  const subtitleOpacity = clamp(0, 1, mapRange(0.15, 0.25, 0, 1, scrubProgress));
  const accentLineHeight = clamp(0, 60, mapRange(0, 0.2, 0, 60, scrubProgress));
  const gridOpacity = 0.04 + scrubProgress * 0.03;

  // Beat 2 — staggered reveals
  const stat1Opacity = clamp(0, 1, mapRange(0.3, 0.4, 0, 1, scrubProgress));
  const stat2Opacity = clamp(0, 1, mapRange(0.4, 0.5, 0, 1, scrubProgress));
  const stat3Opacity = clamp(0, 1, mapRange(0.5, 0.6, 0, 1, scrubProgress));
  const dividerWidth = clamp(0, 100, mapRange(0.2, 0.35, 0, 100, scrubProgress));
  const bottomTagOpacity = clamp(0, 1, mapRange(0.6, 0.75, 0, 1, scrubProgress));
  const dotGridOpacity = clamp(0, 0.15, mapRange(0.05, 0.2, 0, 0.15, scrubProgress));

  // Beat 2 — right side HUD (appears when laptop opens, ~frame 280+)
  const hudOpacity = clamp(0, 1, mapRange(0.7, 0.78, 0, 1, scrubProgress));
  const circuitDraw = clamp(0, 1, mapRange(0.7, 0.85, 0, 1, scrubProgress));
  const card1Op = clamp(0, 1, mapRange(0.76, 0.82, 0, 1, scrubProgress));
  const card2Op = clamp(0, 1, mapRange(0.80, 0.86, 0, 1, scrubProgress));
  const card3Op = clamp(0, 1, mapRange(0.84, 0.90, 0, 1, scrubProgress));
  const terminalOp = clamp(0, 1, mapRange(0.88, 0.94, 0, 1, scrubProgress));
  const orbitalOp = clamp(0, 1, mapRange(0.74, 0.82, 0, 1, scrubProgress));

  // ── Mouse move handler ──
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    },
    [mouseX, mouseY]
  );

  // Beat 1 text fades out as scrub begins
  const beat1TextOpacity = videoEnded
    ? clamp(0, 1, mapRange(0, 0.08, 1, 0, scrubProgress))
    : 1;

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen overflow-hidden bg-[#111111]"
      style={{ fontFamily: "var(--font-comfortaa)" }}
    >
      {/* ── Entry Video (z-0) — hidden once scrub starts ── */}
      <video
        ref={videoRef}
        src="/homepage/beat1-hero-entry/entry.mp4"
        muted
        playsInline
        preload="auto"
        onEnded={handleVideoEnd}
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{
          pointerEvents: "none",
          opacity: scrubActiveRef.current && scrubProgress > 0 ? 0 : 1,
        }}
      />

      {/* ── Scrub Canvas (z-0) — frame sequence drawn here ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0"
        style={{ pointerEvents: "none" }}
      />

      {/* ── Dark vignette (z-1) ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 40%, transparent 30%, rgba(17,17,17,0.5) 100%),
            linear-gradient(to top, rgba(17,17,17,0.85) 0%, transparent 40%)
          `,
        }}
      />

      {/* ── Ambient grid (z-2) — opacity evolves during scrub ── */}
      <motion.div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{ x: gridX, y: gridY }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path
                d="M 80 0 L 0 0 0 80"
                fill="none"
                stroke={NEON}
                strokeWidth="0.3"
                opacity={videoEnded ? String(gridOpacity) : "0.04"}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </motion.div>

      {/* ── Scanlines (z-4) ── */}
      <div
        className="absolute inset-0 z-[4] pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg, transparent, transparent 2px,
            rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px
          )`,
        }}
      />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BEAT 1 — Text overlays (fade out as scrub begins)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      <div
        className="absolute inset-0 z-[7] pointer-events-none"
        style={{
          opacity: beat1TextOpacity,
          transition: "opacity 0.15s ease-out",
        }}
      >
        {/* KONAVERSE sentence — top left */}
        <motion.div
          className="absolute top-10 left-8 md:top-14 md:left-16 pointer-events-auto"
          style={{ x: watermarkX, y: watermarkY }}
          initial={{ opacity: 0, y: -15 }}
          animate={titleRevealed ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span
            className="text-[11px] md:text-xs tracking-[0.2em] uppercase"
            style={{
              color: "rgba(255,255,255,0.25)",
              fontFamily: "var(--font-comfortaa)",
            }}
          >
            Crafted in the{" "}
          </span>
          <BubbleNeonText
            text="KONAVERSE"
            baseColor="rgba(255,255,255,0.35)"
            hoverColor={NEON}
            nearColor="rgba(0,255,136,0.5)"
            className="text-[11px] md:text-xs tracking-[0.2em] uppercase"
          />
        </motion.div>

        {/* Crosshair accent */}
        <motion.div
          className="absolute top-[38%] right-[12%] pointer-events-none hidden md:block"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={titleRevealed ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 1.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="6" stroke={NEON} strokeWidth="0.5" opacity="0.25" />
            <line x1="16" y1="0" x2="16" y2="10" stroke={NEON} strokeWidth="0.5" opacity="0.15" />
            <line x1="16" y1="22" x2="16" y2="32" stroke={NEON} strokeWidth="0.5" opacity="0.15" />
            <line x1="0" y1="16" x2="10" y2="16" stroke={NEON} strokeWidth="0.5" opacity="0.15" />
            <line x1="22" y1="16" x2="32" y2="16" stroke={NEON} strokeWidth="0.5" opacity="0.15" />
          </svg>
        </motion.div>

        {/* Corner brackets */}
        <motion.div
          className="absolute top-8 left-8 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={titleRevealed ? { opacity: 1 } : {}}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M0 12 L0 0 L12 0" fill="none" stroke={NEON} strokeWidth="0.75" opacity="0.3" />
          </svg>
        </motion.div>
        <motion.div
          className="absolute bottom-8 right-8 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={titleRevealed ? { opacity: 1 } : {}}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M24 12 L24 24 L12 24" fill="none" stroke={NEON} strokeWidth="0.75" opacity="0.3" />
          </svg>
        </motion.div>

        {/* Title — bottom left */}
        <motion.div
          className="absolute bottom-20 left-8 md:bottom-28 md:left-16 pointer-events-auto"
          style={{ x: titleX, y: titleY }}
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={titleRevealed ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.span
              className="block text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight"
              style={{ fontFamily: "var(--font-comfortaa)" }}
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              animate={
                titleRevealed ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}
              }
              transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <BubbleNeonText
                text="Enter the"
                baseColor="#ffffff"
                hoverColor={NEON}
                nearColor="rgba(0,255,136,0.5)"
                className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight"
              />
            </motion.span>

            <motion.span
              className="block text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight mt-1"
              initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
              animate={
                titleRevealed ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}
              }
              transition={{ delay: 0.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <BubbleNeonText
                text="digital era"
                baseColor={NEON}
                hoverColor="#ffffff"
                nearColor="rgba(255,255,255,0.7)"
                className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight"
              />
            </motion.span>
          </motion.h1>
        </motion.div>

        {/* Description — bottom right */}
        <motion.div
          className="absolute right-8 bottom-20 md:right-16 md:bottom-28 max-w-[200px] md:max-w-[240px] pointer-events-auto"
          style={{ x: descX, y: descY }}
        >
          <motion.div
            className="flex flex-col items-end gap-[6px] mb-5"
            initial={{ opacity: 0 }}
            animate={titleRevealed ? { opacity: 1 } : {}}
            transition={{ delay: 1.0, duration: 0.8 }}
          >
            <TypewriterCycle
              words={["Design", "Marketing", "Strategy"]}
              started={titleRevealed}
              className="text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-right"
            />
          </motion.div>

          <motion.span
            className="block w-[1px] h-0 ml-auto mb-4"
            style={{ background: `linear-gradient(to bottom, ${NEON_DIM}, transparent)` }}
            animate={titleRevealed ? { height: 28 } : {}}
            transition={{ delay: 1.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />

          <motion.p
            className="text-[11px] md:text-xs leading-[1.7] text-right"
            style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-comfortaa)" }}
            initial={{ opacity: 0, x: 20 }}
            animate={titleRevealed ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 1.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Digital experiences
            <br />
            that convert visitors
            <br />
            into customers
          </motion.p>
        </motion.div>

        {/* Edition marker — bottom center */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={titleRevealed ? { opacity: 1 } : {}}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          <span
            className="text-[8px] md:text-[9px] tracking-[0.5em] uppercase"
            style={{ color: "rgba(255,255,255,0.12)", fontFamily: "var(--font-geist-mono, monospace)" }}
          >
            EST. 2024
          </span>
        </motion.div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BEAT 2 — Scrub text layer (fades in as scroll begins)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      {videoEnded && (
        <div className="absolute inset-0 z-[8] pointer-events-none flex items-start">
          <div className="pl-8 md:pl-16 pt-[15vh] md:pt-[12vh] max-w-[42%] md:max-w-[38%] flex flex-col h-full">

            {/* ── Dot grid decoration ── */}
            <div
              className="absolute top-[10vh] left-6 md:left-12 will-change-transform"
              style={{ opacity: dotGridOpacity }}
            >
              <svg width="60" height="80" viewBox="0 0 60 80">
                {Array.from({ length: 20 }).map((_, i) => (
                  <circle
                    key={i}
                    cx={(i % 4) * 16 + 8}
                    cy={Math.floor(i / 4) * 16 + 8}
                    r="1"
                    fill={NEON}
                  />
                ))}
              </svg>
            </div>

            {/* ── Status tag ── */}
            <div
              className="flex items-center gap-2 mb-6 will-change-transform"
              style={{
                opacity: headlineOpacity,
                transform: `translateY(${(1 - headlineOpacity) * 12}px)`,
              }}
            >
              <span
                className="w-[6px] h-[6px] rounded-full"
                style={{
                  background: NEON,
                  boxShadow: `0 0 8px ${NEON}, 0 0 16px ${NEON_DIM}`,
                }}
              />
              <span
                className="text-[9px] md:text-[10px] tracking-[0.35em] uppercase"
                style={{ color: NEON_DIM, fontFamily: "var(--font-comfortaa)" }}
              >
                Now exploring
              </span>
            </div>

            {/* ── Vertical accent line ── */}
            <div
              className="w-[1.5px] mb-5 will-change-transform"
              style={{
                height: accentLineHeight,
                background: `linear-gradient(to bottom, ${NEON}, transparent)`,
                opacity: headlineOpacity * 0.6,
              }}
            />

            {/* ── Headline ── */}
            <h2
              className="text-2xl md:text-3xl lg:text-5xl font-bold leading-[1.1] tracking-tight will-change-transform"
              style={{
                fontFamily: "var(--font-comfortaa)",
                color: "rgba(255,255,255,0.9)",
                opacity: headlineOpacity,
                transform: `translateY(${(1 - headlineOpacity) * 20}px)`,
              }}
            >
              See what
              <br />
              others{" "}
              <span style={{ color: NEON }}>miss</span>.
            </h2>

            {/* ── Subtitle ── */}
            <p
              className="mt-4 text-[11px] md:text-sm leading-[1.8] will-change-transform"
              style={{
                fontFamily: "var(--font-comfortaa)",
                color: "rgba(255,255,255,0.4)",
                opacity: subtitleOpacity,
                transform: `translateY(${(1 - subtitleOpacity) * 15}px)`,
              }}
            >
              We look beneath the surface of every
              <br />
              digital experience — uncovering insights
              <br />
              that fuel growth.
            </p>

            {/* ── Horizontal divider ── */}
            <div
              className="mt-8 h-[1px] will-change-transform"
              style={{
                width: `${dividerWidth}%`,
                background: `linear-gradient(90deg, ${NEON_DIM}, transparent)`,
              }}
            />

            {/* ── Stats row ── */}
            <div className="flex gap-6 md:gap-10 mt-8">
              {[
                { value: "150+", label: "Projects", opacity: stat1Opacity },
                { value: "98%", label: "Retention", opacity: stat2Opacity },
                { value: "3x", label: "Avg. ROI", opacity: stat3Opacity },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="will-change-transform"
                  style={{
                    opacity: stat.opacity,
                    transform: `translateY(${(1 - stat.opacity) * 20}px)`,
                  }}
                >
                  <span
                    className="block text-lg md:text-2xl lg:text-3xl font-bold"
                    style={{ color: NEON, fontFamily: "var(--font-comfortaa)" }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="block text-[8px] md:text-[9px] tracking-[0.3em] uppercase mt-1"
                    style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-comfortaa)" }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* ── Bottom tagline ── */}
            <div
              className="mt-auto pb-[15vh] md:pb-[12vh] will-change-transform"
              style={{
                opacity: bottomTagOpacity,
                transform: `translateY(${(1 - bottomTagOpacity) * 10}px)`,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="h-[1px] w-8"
                  style={{ background: NEON_DIM }}
                />
                <span
                  className="text-[9px] md:text-[10px] tracking-[0.4em] uppercase"
                  style={{ color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-comfortaa)" }}
                >
                  Our philosophy
                </span>
              </div>
              <p
                className="text-xs md:text-sm leading-[1.8]"
                style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-comfortaa)" }}
              >
                Every pixel serves a purpose.
                <br />
                Every interaction tells a story.
              </p>
            </div>

          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              RIGHT SIDE — Interactive circuit board (appears as laptop opens)
              ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div className="absolute right-4 md:right-12 top-[10%] bottom-[10%] w-[38%] md:w-[32%] hidden md:block">
            <CircuitBoard
              opacity={hudOpacity}
              circuitDraw={circuitDraw}
              cardOpacities={[card1Op, card2Op, card3Op]}
              terminalOp={terminalOp}
            />
          </div>
        </div>
      )}
    </section>
  );
}
