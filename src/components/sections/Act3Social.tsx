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

import { SOCIAL_PROJECTS, PROJECT_CATEGORIES } from "@/data/projects";
import {
  ACT_3_START,
  ACT_3_STEP,
  SECTION_FADE_OUT_0,
  SECTION_FADE_OUT_1,
} from "./projects-timing";

// ── Helpers ───────────────────────────────────────────────────────────────────

function getProjectIndex(p: number): number {
  if (p <= ACT_3_START) return 0;
  for (let i = 0; i < SOCIAL_PROJECTS.length - 1; i++) {
    if (p < ACT_3_START + (i + 1) * ACT_3_STEP) return i;
  }
  return SOCIAL_PROJECTS.length - 1;
}

const PLATFORM_COLORS: Record<string, string> = {
  Instagram: "#e1306c",
  Facebook:  "#1877f2",
  LinkedIn:  "#0a66c2",
  TikTok:    "#69c9d0",
};

// Badge layout: 3 positions around the phone (within the right panel)
const BADGE_POSITIONS = [
  { top: "16%",    left:  "2%"  },  // impressions — top left
  { top: "46%",    right: "2%"  },  // reach        — middle right
  { bottom: "16%", left:  "2%"  },  // engagement   — bottom left
] as const;

// ── CSS-only phone mockup ─────────────────────────────────────────────────────

function PhoneMockup({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative" }}>
      {/* Outer shell */}
      <div
        style={{
          position: "relative",
          width: "clamp(168px, 17vw, 220px)",
          aspectRatio: "9 / 19.5",
          background:
            "linear-gradient(160deg, #1e1e20 0%, #111113 40%, #0c0c0e 100%)",
          borderRadius: 44,
          border: "1.5px solid rgba(255,255,255,0.11)",
          boxShadow:
            "0 40px 80px rgba(0,0,0,0.75), 0 0 0 0.5px rgba(255,255,255,0.04) inset, 0 2px 0 rgba(255,255,255,0.06) inset",
          overflow: "visible",
        }}
      >
        {/* Side buttons */}
        <div style={{ position: "absolute", left: -2.5, top: "17%",    width: 2.5, height: "5.5%", background: "#2c2c2e", borderRadius: "2px 0 0 2px" }} />
        <div style={{ position: "absolute", left: -2.5, top: "26.5%",  width: 2.5, height: "7%",   background: "#2c2c2e", borderRadius: "2px 0 0 2px" }} />
        <div style={{ position: "absolute", right: -2.5, top: "21.5%", width: 2.5, height: "9%",   background: "#2c2c2e", borderRadius: "0 2px 2px 0" }} />

        {/* Screen bezel */}
        <div
          style={{
            position: "absolute",
            inset: 7,
            borderRadius: 38,
            background: "#000",
            overflow: "hidden",
          }}
        >
          {/* Dynamic island */}
          <div
            style={{
              position: "absolute",
              top: 10,
              left: "50%",
              transform: "translateX(-50%)",
              width: "42%",
              height: 26,
              background: "#000",
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.05)",
              zIndex: 10,
            }}
          />
          {children}
        </div>
      </div>

      {/* Green atmospheric glow under phone */}
      <div
        style={{
          position: "absolute",
          bottom: -22,
          left: "8%",
          right: "8%",
          height: 50,
          background: "rgba(0,255,136,0.07)",
          filter: "blur(18px)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

// ── Feed content (renders inside the phone screen) ────────────────────────────

interface FeedContentProps {
  project: (typeof SOCIAL_PROJECTS)[number];
  feedY: MotionValue<string>;
}

function FeedContent({ project, feedY }: FeedContentProps) {
  const platform = project.platforms[0];
  const platformColor = PLATFORM_COLORS[platform] ?? "#00ff88";

  return (
    <div style={{ position: "absolute", inset: 0 }}>

      {/* Status bar */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: 50,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          paddingInline: 18,
          paddingBottom: 6,
          zIndex: 5,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.95) 60%, transparent)",
        }}
      >
        {/* Time */}
        <span
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 11,
            fontWeight: 600,
            color: "rgba(255,255,255,0.9)",
            letterSpacing: "0.02em",
          }}
        >
          9:41
        </span>

        {/* Signal + battery */}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          {/* Signal bars */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 1.5 }}>
            {[5, 8, 11, 14].map((h, i) => (
              <div
                key={i}
                style={{
                  width: 3,
                  height: h,
                  background:
                    i < 3 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.3)",
                  borderRadius: 1,
                }}
              />
            ))}
          </div>
          {/* Battery */}
          <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
            <div
              style={{
                width: 19,
                height: 10,
                border: "1px solid rgba(255,255,255,0.45)",
                borderRadius: 2,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 1.5,
                  width: "72%",
                  background: "rgba(255,255,255,0.75)",
                  borderRadius: 1,
                }}
              />
            </div>
            <div
              style={{
                width: 2,
                height: 5,
                background: "rgba(255,255,255,0.45)",
                borderRadius: 1,
              }}
            />
          </div>
        </div>
      </div>

      {/* Platform app bar */}
      <div
        style={{
          position: "absolute",
          top: 44,
          left: 0, right: 0,
          height: 38,
          background: "rgba(0,0,0,0.9)",
          backdropFilter: "blur(10px)",
          borderBottom: "0.5px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingInline: 14,
          zIndex: 5,
        }}
      >
        {/* Platform name */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: platformColor,
              boxShadow: `0 0 8px ${platformColor}80`,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-monument), sans-serif",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.06em",
              color: "rgba(255,255,255,0.9)",
              textTransform: "uppercase",
            }}
          >
            {platform}
          </span>
        </div>

        {/* Right icons (simplified) */}
        <div
          style={{
            display: "flex",
            gap: 10,
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 12,
            color: "rgba(255,255,255,0.45)",
          }}
        >
          <span>⊕</span>
          <span>☰</span>
        </div>
      </div>

      {/* Scrolling feed */}
      <motion.div
        style={{
          position: "absolute",
          top: 82,
          left: 0,
          right: 0,
          y: feedY,
          willChange: "transform",
        }}
      >
        {project.feedImages.map((src, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "1 / 1",
              marginBottom: i < project.feedImages.length - 1 ? 3 : 0,
            }}
          >
            <Image
              src={src}
              alt={`${project.client} post ${i + 1}`}
              fill
              style={{ objectFit: "cover" }}
              sizes="20vw"
            />
          </div>
        ))}

        {/* Feed bottom padding */}
        <div style={{ height: 20 }} />
      </motion.div>

      {/* Bottom fade to black so the feed disappears cleanly */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "18%",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.95), transparent)",
          pointerEvents: "none",
          zIndex: 6,
        }}
      />
    </div>
  );
}

// ── Floating metric badge ─────────────────────────────────────────────────────

interface MetricBadgeProps {
  value: string;
  label: string;
  position: (typeof BADGE_POSITIONS)[number];
  delay: number;
  floatDuration: number;
}

function MetricBadge({ value, label, position, delay, floatDuration }: MetricBadgeProps) {
  return (
    // Entry / exit wrapper
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: -10 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: "absolute", ...position, pointerEvents: "none" }}
    >
      {/* Continuous float */}
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{
          duration: floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay + 0.4,
        }}
      >
        <div
          style={{
            background: "rgba(3, 12, 6, 0.88)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(0,255,136,0.2)",
            borderRadius: 4,
            padding: "12px 16px",
            minWidth: 110,
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(0,255,136,0.06) inset",
          }}
        >
          {/* Green dot */}
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#00ff88",
              boxShadow: "0 0 8px rgba(0,255,136,0.7)",
              marginBottom: 8,
            }}
          />
          {/* Value */}
          <div
            style={{
              fontFamily: "var(--font-monument), sans-serif",
              fontSize: "clamp(16px, 1.6vw, 22px)",
              fontWeight: 800,
              color: "rgba(255,255,255,0.95)",
              lineHeight: 1,
              letterSpacing: "-0.01em",
              marginBottom: 5,
            }}
          >
            {value}
          </div>
          {/* Label */}
          <div
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: 8,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "rgba(0,255,136,0.55)",
            }}
          >
            {label}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Per-project info card (left panel) ───────────────────────────────────────

interface InfoCardProps {
  projectIndex: number;
  direction: 1 | -1;
}

function InfoCard({ projectIndex, direction }: InfoCardProps) {
  const project = SOCIAL_PROJECTS[projectIndex];

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
        {String(projectIndex + 1).padStart(2, "0")}&nbsp;/&nbsp;0{SOCIAL_PROJECTS.length}
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

      {/* Campaign description */}
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
          marginBottom: 20,
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

      {/* Platform chips */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 7,
          marginBottom: 32,
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 9,
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.28)",
            textTransform: "uppercase",
            marginRight: 4,
          }}
        >
          On
        </span>
        {project.platforms.map((p) => (
          <span
            key={p}
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: 9,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: PLATFORM_COLORS[p] ?? "rgba(255,255,255,0.5)",
              padding: "3px 9px",
              border: `1px solid ${(PLATFORM_COLORS[p] ?? "#fff") + "40"}`,
              background: `${(PLATFORM_COLORS[p] ?? "#fff") + "08"}`,
              borderRadius: 2,
            }}
          >
            {p}
          </span>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        whileHover={{
          borderColor: "rgba(0,255,136,0.75)",
          boxShadow: "0 0 20px rgba(0,255,136,0.1)",
        }}
        transition={{ duration: 0.16 }}
        style={{
          display: "inline-block",
          border: "1px solid rgba(0,255,136,0.25)",
          background: "rgba(3,10,5,0.6)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Link
          href={PROJECT_CATEGORIES.social.href}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "11px 20px",
            color: "#00ff88",
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          {PROJECT_CATEGORIES.social.cta}
          <span style={{ fontSize: 14 }}>→</span>
        </Link>
      </motion.div>
    </motion.div>
  );
}

// ── Main Act 3 component ──────────────────────────────────────────────────────

interface Act3SocialProps {
  progress: MotionValue<number>;
}

export default function Act3Social({ progress }: Act3SocialProps) {

  // ── Active project + direction (stale-ref pattern) ─────────────────────
  const [projectIndex, setProjectIndex] = useState(() =>
    getProjectIndex(progress.get())
  );
  const [direction, setDirection] = useState<1 | -1>(1);
  const indexRef = useRef(getProjectIndex(progress.get()));

  useMotionValueEvent(progress, "change", (val) => {
    if (val < ACT_3_START || val >= SECTION_FADE_OUT_0) return;
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
    [ACT_3_START, ACT_3_START + 0.05, SECTION_FADE_OUT_0, SECTION_FADE_OUT_1],
    [0, 1, 1, 0]
  );

  // ── Per-project feed scroll transforms ────────────────────────────────
  // Three transforms defined upfront (hooks must be unconditional).
  // Each maps its project's scroll range → feed translateY.
  const feed0Y = useTransform(
    progress,
    [ACT_3_START,              ACT_3_START + ACT_3_STEP],
    ["0px", "-260px"]
  );
  const feed1Y = useTransform(
    progress,
    [ACT_3_START + ACT_3_STEP,     ACT_3_START + 2 * ACT_3_STEP],
    ["0px", "-260px"]
  );
  const feed2Y = useTransform(
    progress,
    [ACT_3_START + 2 * ACT_3_STEP, SECTION_FADE_OUT_0],
    ["0px", "-260px"]
  );
  const feedYValues = [feed0Y, feed1Y, feed2Y] as const;

  const project = SOCIAL_PROJECTS[projectIndex];
  const metrics = [
    { value: project.metrics.impressions, label: "Impressions" },
    { value: project.metrics.reach,       label: "Reach"        },
    { value: project.metrics.engagement,  label: "Engagement"   },
  ];

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
          />
        </AnimatePresence>
      </div>

      {/* ── Right: phone + badges ── */}
      <div
        style={{
          position: "absolute",
          left: "43%",
          right: "4%",
          top: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Phone + feed */}
        <div style={{ position: "relative" }}>
          <PhoneMockup>
            <AnimatePresence mode="wait">
              <motion.div
                key={projectIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                style={{ position: "absolute", inset: 0 }}
              >
                <FeedContent
                  project={project}
                  feedY={feedYValues[projectIndex]}
                />
              </motion.div>
            </AnimatePresence>
          </PhoneMockup>

          {/* Project index dots — below phone */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 10,
              marginTop: 16,
            }}
          >
            {SOCIAL_PROJECTS.map((_, i) => (
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
        </div>

        {/* ── Floating metric badges (keyed to projectIndex) ── */}
        <AnimatePresence mode="wait">
          {metrics.map((metric, i) => (
            <MetricBadge
              key={`${projectIndex}-${metric.label}`}
              value={metric.value}
              label={metric.label}
              position={BADGE_POSITIONS[i]}
              delay={i * 0.1}
              floatDuration={2.8 + i * 0.5}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
