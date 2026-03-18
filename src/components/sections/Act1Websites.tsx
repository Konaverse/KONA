"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";

import { WEBSITE_PROJECTS, PROJECT_CATEGORIES } from "@/data/projects";
import {
  ACT_1_START,
  ACT_1_STEP,
  ACT_2_START,
} from "./projects-timing";

// ── Helpers ───────────────────────────────────────────────────────────────────

function getProjectIndex(p: number): number {
  if (p <= ACT_1_START) return 0;
  for (let i = 0; i < WEBSITE_PROJECTS.length - 1; i++) {
    if (p < ACT_1_START + (i + 1) * ACT_1_STEP) return i;
  }
  return WEBSITE_PROJECTS.length - 1;
}

// ── Browser chrome ────────────────────────────────────────────────────────────

function LockIcon() {
  return (
    <svg width="9" height="11" viewBox="0 0 9 11" fill="none" style={{ flexShrink: 0 }}>
      <rect x="0.5" y="4.5" width="8" height="6" rx="1"
        stroke="rgba(0,255,136,0.5)" strokeWidth="0.9" />
      <path d="M2.5 4.5V3C2.5 1.9 3.4 1 4.5 1C5.6 1 6.5 1.9 6.5 3V4.5"
        stroke="rgba(0,255,136,0.5)" strokeWidth="0.9" />
    </svg>
  );
}

interface BrowserChromeProps {
  url: string;
  title: string;
  children: React.ReactNode;
}

function BrowserChrome({ url, title, children }: BrowserChromeProps) {
  return (
    <div
      style={{
        width: "100%",
        borderRadius: 10,
        overflow: "hidden",
        background: "#061009",
        border: "1px solid rgba(0,255,136,0.14)",
        boxShadow:
          "0 24px 72px rgba(0,0,0,0.65), 0 0 0 1px rgba(0,255,136,0.04), 0 0 40px rgba(0,255,136,0.03)",
      }}
    >
      {/* ── Title bar: traffic lights + tab ── */}
      <div
        style={{
          height: 36,
          background: "#040d07",
          display: "flex",
          alignItems: "center",
          gap: 8,
          paddingInline: 14,
          borderBottom: "1px solid rgba(0,255,136,0.07)",
          userSelect: "none",
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          {(["#ff5f57", "#febc2e", "#28c840"] as const).map((c) => (
            <div
              key={c}
              style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.9 }}
            />
          ))}
        </div>

        {/* Tab */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: 26,
            paddingInline: 12,
            background: "#061009",
            borderRadius: "5px 5px 0 0",
            border: "1px solid rgba(0,255,136,0.13)",
            borderBottom: "1px solid #061009",
            marginLeft: 10,
            gap: 8,
            flexShrink: 0,
            maxWidth: 180,
          }}
        >
          {/* Favicon dot */}
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "rgba(0,255,136,0.6)",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: 10,
              color: "rgba(255,255,255,0.65)",
              letterSpacing: "0.02em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </span>
          {/* Close button */}
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              flexShrink: 0,
            }}
          />
        </div>
      </div>

      {/* ── Address bar ── */}
      <div
        style={{
          height: 32,
          background: "#040d07",
          display: "flex",
          alignItems: "center",
          gap: 10,
          paddingInline: 14,
          borderBottom: "1px solid rgba(0,255,136,0.07)",
          userSelect: "none",
        }}
      >
        {/* Nav controls */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexShrink: 0,
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 11,
            color: "rgba(255,255,255,0.2)",
          }}
        >
          <span>←</span>
          <span>→</span>
          <span>↻</span>
        </div>

        {/* URL pill */}
        <div
          style={{
            flex: 1,
            height: 20,
            background: "rgba(0,255,136,0.03)",
            border: "1px solid rgba(0,255,136,0.1)",
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            gap: 6,
            paddingInline: 8,
            overflow: "hidden",
          }}
        >
          <LockIcon />
          <span
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: 10,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.01em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {url}
          </span>
        </div>
      </div>

      {/* ── Viewport (16:9) ── */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          background: "#030a05",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ── Info panel card (per-project) ─────────────────────────────────────────────

interface InfoCardProps {
  projectIndex: number;
  direction: 1 | -1;
}

function InfoCard({ projectIndex, direction }: InfoCardProps) {
  const project = WEBSITE_PROJECTS[projectIndex];

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
        {String(projectIndex + 1).padStart(2, "0")}&nbsp;/&nbsp;0{WEBSITE_PROJECTS.length}
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

      {/* Tech tags */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 7,
          marginBottom: 32,
        }}
      >
        {project.tech.map((tag) => (
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

      {/* Live site link */}
      <motion.a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{
          borderColor: "rgba(0,255,136,0.7)",
          boxShadow: "0 0 20px rgba(0,255,136,0.1)",
        }}
        transition={{ duration: 0.16 }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 9,
          padding: "10px 18px",
          border: "1px solid rgba(0,255,136,0.25)",
          color: "rgba(0,255,136,0.85)",
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: 10,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          textDecoration: "none",
          cursor: "pointer",
          background: "transparent",
        }}
      >
        View Live Site
        <span style={{ fontSize: 13 }}>↗</span>
      </motion.a>
    </motion.div>
  );
}

// ── Main Act 1 component ──────────────────────────────────────────────────────

interface Act1WebsitesProps {
  progress: MotionValue<number>;
}

export default function Act1Websites({ progress }: Act1WebsitesProps) {
  // ── Active project + direction ─────────────────────────────────────────
  const [projectIndex, setProjectIndex] = useState(() =>
    getProjectIndex(progress.get())
  );
  const [direction, setDirection] = useState<1 | -1>(1);
  const indexRef = useRef(getProjectIndex(progress.get()));

  useMotionValueEvent(progress, "change", (val) => {
    if (val < ACT_1_START || val >= ACT_2_START) return;
    const next = getProjectIndex(val);
    if (next !== indexRef.current) {
      setDirection(next > indexRef.current ? 1 : -1);
      setProjectIndex(next);
      indexRef.current = next;
    }
  });

  // ── Act opacity envelope ───────────────────────────────────────────────
  // Fades in alongside the header fade-out (0.38–0.44), full until 0.60,
  // then fades out as Act 2 approaches (0.60–0.64).
  const actOpacity = useTransform(
    progress,
    [ACT_1_START, ACT_1_START + 0.06, ACT_2_START - 0.04, ACT_2_START],
    [0, 1, 1, 0]
  );

  const project = WEBSITE_PROJECTS[projectIndex];
  const displayUrl = project.href.replace(/^https?:\/\//, "");

  return (
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
      {/* ── Dot-grid background ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(0,255,136,0.11) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Left: Info panel ── */}
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
          />
        </AnimatePresence>
      </div>

      {/* ── Right: Browser mockup ── */}
      <div
        style={{
          width: "53%",
          position: "relative",
          zIndex: 2,
          paddingRight: "4%",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <BrowserChrome url={displayUrl} title={project.client}>
          <AnimatePresence mode="wait">
            <motion.div
              key={projectIndex}
              initial={{ x: `${direction * 8}%`, opacity: 0 }}
              animate={{ x: "0%", opacity: 1 }}
              exit={{ x: `${direction * -8}%`, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: "absolute", inset: 0 }}
            >
              {/* Screenshot */}
              <Image
                src={project.image}
                alt={project.title}
                fill
                style={{ objectFit: "contain" }}
                sizes="55vw"
                priority={projectIndex === 0}
              />

              {/* ── Scanline reveal: dark overlay + green line sweep top→bottom ── */}
              {/* The overlay slides downward, revealing the image from the top.     */}
              {/* The green scanline sits at the overlay's bottom edge, moves with it. */}
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: "100%" }}
                transition={{
                  duration: 1.1,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.25,
                }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#030a05",
                  zIndex: 2,
                }}
              >
                {/* Scanline — green glow at the bottom edge of the overlay */}
                <div
                  style={{
                    position: "absolute",
                    bottom: -2,
                    left: 0,
                    right: 0,
                    height: 3,
                    background:
                      "linear-gradient(to right, transparent 0%, #00ff88 25%, #00ff88 75%, transparent 100%)",
                    boxShadow:
                      "0 0 14px rgba(0,255,136,0.85), 0 0 28px rgba(0,255,136,0.35)",
                    pointerEvents: "none",
                  }}
                />
              </motion.div>

              {/* Subtle screen glare */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(135deg, rgba(0,255,136,0.025) 0%, transparent 55%)",
                  pointerEvents: "none",
                  zIndex: 3,
                }}
              />
            </motion.div>
          </AnimatePresence>
        </BrowserChrome>

        {/* Project index dots */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
          }}
        >
          {WEBSITE_PROJECTS.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: i === projectIndex ? 1.5 : 1,
                opacity: i === projectIndex ? 1 : 0.25,
                boxShadow:
                  i === projectIndex
                    ? "0 0 8px rgba(0,255,136,0.75)"
                    : "none",
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#00ff88",
              }}
            />
          ))}
        </div>

        {/* Category CTA */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <motion.div
            whileHover={{
              borderColor: "rgba(0,255,136,0.75)",
              boxShadow: "0 0 24px rgba(0,255,136,0.1)",
            }}
            transition={{ duration: 0.16 }}
            style={{
              display: "inline-block",
              border: "1px solid rgba(0,255,136,0.28)",
              background: "rgba(3,10,5,0.6)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Link
              href={PROJECT_CATEGORIES.websites.href}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "11px 22px",
                color: "#00ff88",
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: 10,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              {PROJECT_CATEGORIES.websites.cta}
              <span style={{ fontSize: 14 }}>→</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
