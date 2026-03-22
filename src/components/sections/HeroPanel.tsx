"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { WEBSITE_PROJECTS } from "@/data/projects";

// ─── FitText — scales font-size so text fills available width ────────────────
function FitText({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;

    const fit = () => {
      el.style.fontSize = "100px";
      const textW = el.scrollWidth;
      const availW = parent.clientWidth;
      if (textW > 0) {
        el.style.fontSize = `${(100 * availW) / textW}px`;
      }
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(parent);
    return () => ro.disconnect();
  }, []);

  return (
    <span
      ref={spanRef}
      style={{
        display: "block",
        whiteSpace: "nowrap",
        lineHeight: 1.1,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// ─── Video Card (2/3 of bottom row) ─────────────────────────────────────────
function VideoCard({ entranceComplete }: { entranceComplete?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [expanded, setExpanded] = useState(false);

  // Delay video play until entrance is complete
  useEffect(() => {
    if (!videoRef.current || !entranceComplete) return;
    videoRef.current.play().catch(() => {});
  }, [entranceComplete]);

  return (
    <>
      {/* Inline preview */}
      <motion.button
        onClick={() => setExpanded(true)}
        className="relative w-full h-full overflow-hidden rounded-xl cursor-pointer group"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <video
          ref={videoRef}
          src="/konavers_video.mp4"
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover rounded-xl"
        />
        {/* Play icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(0,255,136,0.15)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(0,255,136,0.3)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 2L16 9L4 16V2Z" fill="#00ff88" />
            </svg>
          </div>
        </div>
        {/* Label */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span
            className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/60"
          >
            Showreel
          </span>
        </div>
      </motion.button>

      {/* Expanded overlay — portaled to body to escape transform/overflow trapping */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {expanded && (
              <motion.div
                className="fixed inset-0 z-[9999] flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setExpanded(false)}
              >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                {/* Video container */}
                <motion.div
                  className="relative w-[90vw] max-w-[1100px] aspect-video rounded-2xl overflow-hidden"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
                  }}
                >
                  <video
                    src="/konavers_video.mp4"
                    autoPlay
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {/* Close button */}
                  <button
                    onClick={() => setExpanded(false)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                    style={{
                      background: "rgba(0,0,0,0.5)",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 1L13 13M13 1L1 13" stroke="white" strokeWidth="1.5" />
                    </svg>
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

// ─── Project Slideshow card ──────────────────────────────────────────────────
function ProjectSlideshow() {
  const [current, setCurrent] = useState(0);
  const projects = WEBSITE_PROJECTS;

  // Auto-rotate every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % projects.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [projects.length]);

  const project = projects[current];

  return (
    <motion.a
      href="/projects/website-projects"
      className="block relative overflow-hidden rounded-xl cursor-pointer group w-full h-full"
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Project image */}
      <AnimatePresence mode="wait">
        <motion.img
          key={project.id}
          src={project.image}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Project info */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
          >
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#00ff88]/70">
              {project.year}
            </span>
            <p className="text-white text-xs font-medium mt-0.5 leading-tight">
              {project.title}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots indicator */}
      <div className="absolute top-2.5 right-2.5 flex gap-1">
        {projects.map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
            style={{
              background: i === current ? "#00ff88" : "rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>
    </motion.a>
  );
}

// ─── Main Hero Panel ─────────────────────────────────────────────────────────
export default function HeroPanel({ entranceComplete }: { entranceComplete?: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col p-8 pointer-events-auto">
      {/* Top area: title + description + CTAs — compact, no flex-1 */}
      <div className="flex flex-col gap-3 max-w-[85%]">
        <h1 className="text-white uppercase leading-[1.05]">
          <span
            style={{
              fontFamily: "var(--font-rubik-glitch), sans-serif",
              fontSize: "clamp(22px, 2.8vw, 42px)",
              letterSpacing: "0.04em",
              display: "block",
            }}
          >
            Experience the
          </span>
          <FitText
            style={{
              fontFamily: "var(--font-rubik-glitch), sans-serif",
              color: "#00ff88",
              letterSpacing: "0.02em",
            }}
          >
            Digital Era
          </FitText>
        </h1>

        <p
          className="text-white/50 leading-relaxed max-w-[420px]"
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "clamp(11px, 0.85vw, 13px)",
          }}
        >
          From concept to launch — websites, video production, and social media
          strategies that move your brand forward. Welcome to Konaverse.
        </p>

        <div className="flex gap-3">
          <Button href="#services" variant="primary" size="md">
            <span style={{ color: "#00ff88" }}>Our Services</span>
          </Button>
          <Button href="#projects" variant="secondary" size="md">
            View Work
          </Button>
        </div>
      </div>

      {/* Cards row: video (1/2) + project slideshow (1/2) — fills remaining space */}
      <div className="flex gap-3 flex-1 mt-4 min-h-0">
        <div className="flex-1 min-w-0">
          <VideoCard entranceComplete={entranceComplete} />
        </div>
        <div className="flex-1 min-w-0">
          <ProjectSlideshow />
        </div>
      </div>
    </div>
  );
}

