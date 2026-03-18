"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";

import { VIDEO_PROJECTS, PROJECT_CATEGORIES, type VideoProject } from "@/data/projects";
import {
  ACT_2_START,
  ACT_2_STEP,
  ACT_3_START,
} from "./projects-timing";

// ── Helpers ───────────────────────────────────────────────────────────────────

function getProjectIndex(p: number): number {
  if (p <= ACT_2_START) return 0;
  for (let i = 0; i < VIDEO_PROJECTS.length - 1; i++) {
    if (p < ACT_2_START + (i + 1) * ACT_2_STEP) return i;
  }
  return VIDEO_PROJECTS.length - 1;
}

// One fake timecode per project — gives the cinema reel aesthetic
const TIMECODES = ["01:24:08:12", "00:47:32:03", "02:11:55:21"] as const;

// ── Filmstrip sprocket holes ──────────────────────────────────────────────────

function SprocketHoles({ count = 11 }: { count?: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        paddingInline: 10,
        height: "100%",
        flex: 1,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 7,
            height: 9,
            borderRadius: 1.5,
            border: "1px solid rgba(255,255,255,0.11)",
            background: "rgba(0,0,0,0.55)",
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

// ── Info panel card (per-project) ─────────────────────────────────────────────

interface InfoCardProps {
  projectIndex: number;
  direction: 1 | -1;
  onPlay: () => void;
}

function InfoCard({ projectIndex, direction, onPlay }: InfoCardProps) {
  const project = VIDEO_PROJECTS[projectIndex];

  return (
    <motion.div
      initial={{ opacity: 0, x: direction * 32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction * -24 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{ width: "100%" }}
    >
      {/* Counter */}
      <div
        style={{
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: 10,
          letterSpacing: "0.35em",
          color: "#00ff88",
          marginBottom: 22,
        }}
      >
        {String(projectIndex + 1).padStart(2, "0")}&nbsp;/&nbsp;0{VIDEO_PROJECTS.length}
      </div>

      {/* Client name */}
      <div
        style={{
          fontFamily: "var(--font-monument), sans-serif",
          fontSize: "clamp(20px, 2.4vw, 38px)",
          fontWeight: 800,
          color: "#ffffff",
          lineHeight: 1.05,
          letterSpacing: "0.03em",
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        {project.client}
      </div>

      {/* Year */}
      <div
        style={{
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: 10,
          letterSpacing: "0.28em",
          color: "rgba(0,255,136,0.55)",
          marginBottom: 18,
        }}
      >
        {project.year}
      </div>

      {/* Accent rule */}
      <div
        style={{
          width: 28,
          height: 1,
          background: "rgba(0,255,136,0.38)",
          marginBottom: 16,
        }}
      />

      {/* Description */}
      <p
        style={{
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "clamp(11px, 0.95vw, 13px)",
          color: "rgba(255,255,255,0.48)",
          lineHeight: 1.85,
          marginBottom: 22,
        }}
      >
        {project.description}
      </p>

      {/* Service tags */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 7,
          marginBottom: 22,
        }}
      >
        {project.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: 9,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(0,255,136,0.65)",
              padding: "4px 10px",
              border: "1px solid rgba(0,255,136,0.18)",
              background: "rgba(0,255,136,0.04)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Duration detail */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 28,
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: 10,
          color: "rgba(255,255,255,0.3)",
          letterSpacing: "0.18em",
        }}
      >
        <span style={{ color: "rgba(0,255,136,0.4)", fontSize: 11 }}>▶</span>
        {project.duration}
        &nbsp;·&nbsp;
        {project.title}
      </div>

      {/* Watch Film button */}
      <motion.button
        onClick={onPlay}
        whileHover={{
          borderColor: "rgba(0,255,136,0.7)",
          boxShadow: "0 0 24px rgba(0,255,136,0.12)",
        }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.16 }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 18px",
          border: "1px solid rgba(0,255,136,0.28)",
          color: "rgba(0,255,136,0.9)",
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: 10,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          cursor: "pointer",
          background: "transparent",
        }}
      >
        <span style={{ fontSize: 10 }}>▶</span>
        Watch Film
      </motion.button>
    </motion.div>
  );
}

// ── Main Act 2 component ──────────────────────────────────────────────────────

interface Act2VideosProps {
  progress: MotionValue<number>;
  /** Wired in Step 7 — receives the active project when the play button is clicked */
  onPlay?: (project: VideoProject) => void;
}

export default function Act2Videos({ progress, onPlay }: Act2VideosProps) {

  // ── Active project + direction ─────────────────────────────────────────
  const [projectIndex, setProjectIndex] = useState(() =>
    getProjectIndex(progress.get())
  );
  const [direction, setDirection] = useState<1 | -1>(1);
  const indexRef = useRef(getProjectIndex(progress.get()));

  useMotionValueEvent(progress, "change", (val) => {
    if (val < ACT_2_START || val >= ACT_3_START) return;
    const next = getProjectIndex(val);
    if (next !== indexRef.current) {
      setDirection(next > indexRef.current ? 1 : -1);
      setProjectIndex(next);
      indexRef.current = next;
    }
  });

  // ── Act opacity envelope ───────────────────────────────────────────────
  const actOpacity = useTransform(
    progress,
    [ACT_2_START, ACT_2_START + 0.04, ACT_3_START - 0.04, ACT_3_START],
    [0, 1, 1, 0]
  );

  const project = VIDEO_PROJECTS[projectIndex];
  const handlePlay = () => onPlay?.(project);

  return (
    <>
      {/* Film grain keyframes — self-contained */}
      <style>{`
        @keyframes filmGrain {
          0%,100% { transform: translate(0,0) }
          10% { transform: translate(-1%,-2%) }
          20% { transform: translate(2%,1%) }
          30% { transform: translate(-1%,2%) }
          40% { transform: translate(1%,-1%) }
          50% { transform: translate(-2%,1%) }
          60% { transform: translate(2%,-2%) }
          70% { transform: translate(-1%,1%) }
          80% { transform: translate(1%,2%) }
          90% { transform: translate(-2%,-1%) }
        }
      `}</style>

      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          opacity: actOpacity,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          willChange: "opacity",
        }}
      >
        {/* ── Cinema vignette background ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 65% 50%, rgba(0,8,3,0) 0%, rgba(0,0,0,0.6) 100%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* ── Left: info panel ── */}
        <div
          style={{
            width: "40%",
            height: "100%",
            position: "relative",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            paddingLeft: "9%",
            paddingRight: "3%",
            overflow: "hidden",
          }}
        >
          <AnimatePresence mode="wait">
            <InfoCard
              key={projectIndex}
              projectIndex={projectIndex}
              direction={direction}
              onPlay={handlePlay}
            />
          </AnimatePresence>
        </div>

        {/* ── Right: cinema card + filmstrip + CTA ── */}
        <div
          style={{
            width: "56%",
            position: "relative",
            zIndex: 2,
            paddingRight: "4%",
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          {/* ═══ 16:9 video card ═══ */}
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16 / 9",
              background: "#000",
              boxShadow:
                "0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)",
              overflow: "hidden",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={projectIndex}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                style={{ position: "absolute", inset: 0 }}
              >
                {/* Thumbnail */}
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="55vw"
                  priority={projectIndex === 0}
                />

                {/* Base dark overlay — gives the cinematic colour grade feel */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.38)",
                    zIndex: 1,
                    pointerEvents: "none",
                  }}
                />

                {/* ── Film grain overlay ── */}
                <div
                  style={{
                    position: "absolute",
                    inset: "-10%",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "repeat",
                    backgroundSize: "220px 220px",
                    opacity: 0.055,
                    zIndex: 2,
                    pointerEvents: "none",
                    animation: "filmGrain 0.35s steps(1) infinite",
                    mixBlendMode: "overlay",
                  }}
                />

                {/* ── Letterbox bars ── */}
                {/* Top bar */}
                <div
                  style={{
                    position: "absolute",
                    top: 0, left: 0, right: 0,
                    height: "13%",
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0.95) 40%, rgba(0,0,0,0.5) 100%)",
                    zIndex: 3,
                    pointerEvents: "none",
                  }}
                />
                {/* Bottom bar */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0, left: 0, right: 0,
                    height: "13%",
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.95) 40%, rgba(0,0,0,0.5) 100%)",
                    zIndex: 3,
                    pointerEvents: "none",
                  }}
                />

                {/* ── Timecode — bottom-left, inside letterbox ── */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "3.5%",
                    left: "2.5%",
                    zIndex: 4,
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: "clamp(8px, 0.72vw, 10px)",
                    letterSpacing: "0.16em",
                    color: "rgba(0,255,136,0.5)",
                    pointerEvents: "none",
                  }}
                >
                  TC&nbsp;&nbsp;{TIMECODES[projectIndex]}
                </div>

                {/* ── Duration badge — top-right, inside letterbox ── */}
                <div
                  style={{
                    position: "absolute",
                    top: "3%",
                    right: "2.5%",
                    zIndex: 4,
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: "clamp(8px, 0.72vw, 10px)",
                    letterSpacing: "0.18em",
                    color: "rgba(255,255,255,0.4)",
                    pointerEvents: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <span style={{ color: "rgba(0,255,136,0.45)" }}>◆</span>
                  {project.duration}
                </div>

                {/* ── Centered play button ── */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                  }}
                >
                  <motion.button
                    onClick={handlePlay}
                    whileHover={{
                      scale: 1.1,
                      borderColor: "rgba(0,255,136,0.95)",
                      boxShadow:
                        "0 0 48px rgba(0,255,136,0.35), 0 0 80px rgba(0,255,136,0.1)",
                    }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ duration: 0.18 }}
                    style={{
                      pointerEvents: "auto",
                      width: "clamp(52px, 6vw, 72px)",
                      height: "clamp(52px, 6vw, 72px)",
                      borderRadius: "50%",
                      background: "rgba(0,0,0,0.5)",
                      border: "2px solid rgba(0,255,136,0.55)",
                      backdropFilter: "blur(10px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 0 28px rgba(0,255,136,0.15)",
                    }}
                  >
                    {/* Play triangle */}
                    <div
                      style={{
                        width: 0,
                        height: 0,
                        borderTop: "clamp(9px, 1.1vw, 13px) solid transparent",
                        borderBottom: "clamp(9px, 1.1vw, 13px) solid transparent",
                        borderLeft: "clamp(16px, 1.9vw, 22px) solid #00ff88",
                        marginLeft: "15%",
                        filter: "drop-shadow(0 0 8px rgba(0,255,136,0.7))",
                      }}
                    />
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ═══ Filmstrip ticker ═══ */}
          <div
            style={{
              marginTop: 10,
              background: "#080808",
              border: "1px solid rgba(255,255,255,0.06)",
              overflow: "hidden",
            }}
          >
            {/* Top sprocket row */}
            <div
              style={{
                height: 14,
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                alignItems: "center",
                background: "#050505",
              }}
            >
              <SprocketHoles count={13} />
            </div>

            {/* Thumbnail strip */}
            <div
              style={{
                display: "flex",
                alignItems: "stretch",
                gap: 3,
                padding: "4px 8px",
                background: "#0a0a0a",
              }}
            >
              {VIDEO_PROJECTS.map((vid, i) => (
                <div
                  key={vid.id}
                  style={{
                    flex: 1,
                    position: "relative",
                    aspectRatio: "16 / 9",
                    overflow: "hidden",
                    outline:
                      i === projectIndex
                        ? "1.5px solid rgba(0,255,136,0.85)"
                        : "1.5px solid rgba(255,255,255,0.06)",
                    filter:
                      i === projectIndex ? "brightness(1)" : "brightness(0.38)",
                    transition: "filter 0.3s ease, outline 0.3s ease",
                    boxShadow:
                      i === projectIndex
                        ? "0 0 12px rgba(0,255,136,0.3)"
                        : "none",
                  }}
                >
                  <Image
                    src={vid.thumbnail}
                    alt={vid.title}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="15vw"
                  />

                  {/* Active green underline */}
                  {i === projectIndex && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        background: "#00ff88",
                        zIndex: 2,
                        boxShadow: "0 0 8px rgba(0,255,136,0.9)",
                      }}
                    />
                  )}

                  {/* Subtle grain on strip thumbs */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.18)",
                      zIndex: 1,
                      pointerEvents: "none",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Bottom sprocket row */}
            <div
              style={{
                height: 14,
                borderTop: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                alignItems: "center",
                background: "#050505",
              }}
            >
              <SprocketHoles count={13} />
            </div>
          </div>

          {/* ═══ CTA — disabled, page coming soon ═══ */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 14,
            }}
          >
            <div
              title="Videography page coming soon"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 22px",
                border: "1px solid rgba(255,255,255,0.09)",
                background: "rgba(255,255,255,0.015)",
                cursor: "not-allowed",
                userSelect: "none",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: 10,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.2)",
                }}
              >
                {PROJECT_CATEGORIES.videos.cta}
                <span style={{ fontSize: 14, marginLeft: 8 }}>→</span>
              </span>
              <span
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: 8,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(0,255,136,0.45)",
                  border: "1px solid rgba(0,255,136,0.2)",
                  padding: "2px 8px",
                  flexShrink: 0,
                }}
              >
                Coming Soon
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
