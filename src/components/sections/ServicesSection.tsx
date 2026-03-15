"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  AnimatePresence,
  useTransform,
  useMotionValueEvent,
  MotionValue,
} from "framer-motion";

const ServiceObject = dynamic(() => import("@/components/three/ServiceObject"), { ssr: false });

// ── Solution data ─────────────────────────────────────────────
const SOLUTIONS = [
  {
    slug: "web-development",
    num: "01",
    title: "Web Development",
    description:
      "Fast, conversion-focused websites built with intent. We design and develop digital experiences that make your brand impossible to ignore.",
    bullets: [
      "Custom design systems built to scale",
      "Performance-optimized, sub-2s load times",
      "SEO-ready architecture from day one",
      "Headless CMS and third-party integrations",
    ],
    cta: "Explore Web Development",
  },
  {
    slug: "videography",
    num: "02",
    title: "Videography",
    description:
      "Cinematic content that stops the scroll. From brand films to product showcases, we translate your vision into footage that converts.",
    bullets: [
      "Brand films and culture documentaries",
      "Product showcases and demo reels",
      "Social-ready short-form content",
      "Color grading and professional sound design",
    ],
    cta: "Explore Videography",
  },
  {
    slug: "digital-ads",
    num: "03",
    title: "Digital Ads",
    description:
      "Paid media built to earn its budget. We craft and manage campaigns that reach the right audience at precisely the right moment.",
    bullets: [
      "Google, Meta, and LinkedIn campaigns",
      "Creative strategy and ad copywriting",
      "A/B testing and funnel optimization",
      "ROI-focused monthly reporting",
    ],
    cta: "Explore Digital Ads",
  },
  {
    slug: "social-media-management",
    num: "04",
    title: "Social Media",
    description:
      "Consistent, on-brand presence across every platform. We manage your content calendar so you stay focused on what you do best.",
    bullets: [
      "Platform strategy and brand voice",
      "Content creation and scheduling",
      "Community management and engagement",
      "Analytics and growth reporting",
    ],
    cta: "Explore Social Media",
  },
  {
    slug: "web-applications",
    num: "05",
    title: "Web Applications",
    description:
      "Full-stack applications engineered for scale. From internal tools to customer-facing platforms, we build software that lasts.",
    bullets: [
      "Custom SaaS and platform development",
      "API design and third-party integrations",
      "Auth flows, dashboards, and user portals",
      "Cloud-native deployment and DevOps",
    ],
    cta: "Explore Web Applications",
  },
] as const;

type Solution = (typeof SOLUTIONS)[number];

// ── Scroll timing (must match 1000vh wrapper in home-page.tsx) ─
// Curtain clears at 0.28; 5 solutions × 0.14 each → 0.28–0.98
// Absolute distances are nearly identical to the 800vh version:
//   sweep-in: 90vh, exits: 210vh, content: 280vh, per-solution: 140vh
const CURTAIN_CLEAR = 0.28;
const PER = 0.14;

function getActiveIndex(p: number): number {
  if (p < CURTAIN_CLEAR) return -1;
  for (let i = 0; i < SOLUTIONS.length; i++) {
    if (p < CURTAIN_CLEAR + (i + 1) * PER) return i;
  }
  return SOLUTIONS.length - 1; // hold last solution at the bottom
}

// ── CTA button with hover-preview image ───────────────────────
const PREVIEW_IMAGE =
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=480&h=260&fit=crop&q=80";

function CTAButton({ solution }: { solution: Solution }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Hover preview card */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              position: "absolute",
              bottom: "calc(100% + 14px)",
              left: 0,
              width: 260,
              borderRadius: 10,
              overflow: "hidden",
              background: "#0a1a10",
              border: "1px solid rgba(0,255,136,0.18)",
              boxShadow:
                "0 20px 48px rgba(0,0,0,0.65), 0 0 32px rgba(0,255,136,0.06)",
              pointerEvents: "none",
              zIndex: 30,
            }}
          >
            <img
              src={PREVIEW_IMAGE}
              alt=""
              style={{
                width: "100%",
                height: 130,
                objectFit: "cover",
                display: "block",
              }}
            />
            <div
              style={{
                padding: "8px 12px 12px",
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: 10,
                color: "rgba(0,255,136,0.5)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              {solution.title}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.a
        href={`/solutions/${solution.slug}`}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{
          borderColor: "rgba(0,255,136,0.75)",
          boxShadow: "0 0 24px rgba(0,255,136,0.12)",
        }}
        transition={{ duration: 0.18 }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "13px 22px",
          border: "1px solid rgba(0,255,136,0.28)",
          color: "#00ff88",
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: 11,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          textDecoration: "none",
          cursor: "pointer",
        }}
      >
        {solution.cta}
        <span style={{ fontSize: 14 }}>→</span>
      </motion.a>
    </div>
  );
}

// ── Per-solution content card ─────────────────────────────────
function SolutionCard({ solution, direction }: { solution: Solution; direction: 1 | -1 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: direction * 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: direction * -18 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 10% 0 9%",
      }}
    >
      {/* Counter */}
      <div
        style={{
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: 10,
          letterSpacing: "0.35em",
          color: "#00ff88",
          marginBottom: 28,
        }}
      >
        {solution.num} / 05
      </div>

      {/* Title */}
      <div
        style={{
          fontFamily: "var(--font-monument), sans-serif",
          fontSize: "clamp(28px, 3vw, 48px)",
          fontWeight: 800,
          color: "#ffffff",
          lineHeight: 1.05,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          marginBottom: 20,
        }}
      >
        {solution.title}
      </div>

      {/* Accent rule */}
      <div
        style={{
          width: 36,
          height: 1,
          background: "rgba(0,255,136,0.45)",
          marginBottom: 20,
        }}
      />

      {/* Description */}
      <p
        style={{
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "clamp(12px, 1.1vw, 14px)",
          color: "rgba(255,255,255,0.55)",
          lineHeight: 1.8,
          marginBottom: 28,
        }}
      >
        {solution.description}
      </p>

      {/* Bullets */}
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "0 0 40px 0",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {solution.bullets.map((bullet, i) => (
          <motion.li
            key={bullet}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.18 + i * 0.07,
              duration: 0.35,
              ease: "easeOut",
            }}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "clamp(11px, 1vw, 13px)",
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.6,
            }}
          >
            <span
              style={{
                color: "#00ff88",
                flexShrink: 0,
                marginTop: 2,
                opacity: 0.65,
              }}
            >
              —
            </span>
            {bullet}
          </motion.li>
        ))}
      </ul>

      {/* CTA */}
      <CTAButton solution={solution} />
    </motion.div>
  );
}

// ── Main section ──────────────────────────────────────────────
interface ServicesSectionProps {
  progress: MotionValue<number>;
  visible: boolean;
}

export default function ServicesSection({
  progress,
  visible,
}: ServicesSectionProps) {
  // ── Active index + direction tracking ─────────────────────
  const [activeSolutionIndex, setActiveSolutionIndex] = useState(() =>
    getActiveIndex(progress.get())
  );
  const [direction, setDirection] = useState<1 | -1>(1);
  const activeIdxRef = useRef(getActiveIndex(progress.get())); // stale-closure safe

  useMotionValueEvent(progress, "change", (val) => {
    const next = getActiveIndex(val);
    if (next !== activeIdxRef.current) {
      setDirection(next > activeIdxRef.current ? 1 : -1);
      setActiveSolutionIndex(next);
      activeIdxRef.current = next;
    }
  });

  // ── "Scroll to explore" hint — fires once on first section appearance ──
  const [showHint, setShowHint] = useState(false);
  const hintTriggeredRef = useRef(false);
  useEffect(() => {
    if (!visible || hintTriggeredRef.current) return;
    hintTriggeredRef.current = true;
    setShowHint(true);
    const t = setTimeout(() => setShowHint(false), 3200);
    return () => clearTimeout(t);
  }, [visible]);

  const curtainX = useTransform(progress, [0, 0.09, 0.21], [-100, 0, 105]);
  const curtainOp = useTransform(progress, [0, 0.005, 0.19, 0.23], [0, 1, 1, 0]);
  const curtainTranslateX = useTransform(curtainX, (v) => `${v}%`);
  const sectionOpacity = useTransform(progress, [0.23, 0.28], [0, 1]);

  if (!visible) return null;

  return (
    <>
      {/* Curtain */}
      <motion.div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 20,
          pointerEvents: "none",
          opacity: curtainOp,
        }}
      >
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            background: "#00ff88",
            willChange: "transform",
            x: curtainTranslateX,
          }}
        />
      </motion.div>

      {/* Section overlay */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          opacity: sectionOpacity,
          display: "flex",
          flexDirection: "row",
        }}
      >
        {/* Left — solution content panel */}
        <div
          style={{
            width: "35%",
            height: "100%",
            position: "relative",
            background: "rgba(3, 10, 6, 0.88)",
            borderRight: "1px solid rgba(0,255,136,0.08)",
            overflow: "hidden",
          }}
        >
          <AnimatePresence mode="wait">
            {activeSolutionIndex >= 0 && (
              <SolutionCard
                key={activeSolutionIndex}
                solution={SOLUTIONS[activeSolutionIndex]}
                direction={direction}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Center — 3D service object */}
        <div style={{ width: "30%", height: "100%", pointerEvents: "none" }}>
          <ServiceObject serviceIndex={Math.max(0, activeSolutionIndex)} />
        </div>

        {/* Right — transparent, architect */}
        <div style={{ width: "35%", height: "100%", pointerEvents: "none" }} />

        {/* 5-dot vertical progress indicator */}
        {activeSolutionIndex >= 0 && (
          <div
            style={{
              position: "absolute",
              right: "3.5%",
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              pointerEvents: "none",
            }}
          >
            {SOLUTIONS.map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: i === activeSolutionIndex ? 1.5 : 1,
                  opacity: i === activeSolutionIndex ? 1 : 0.28,
                }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#00ff88",
                  boxShadow: i === activeSolutionIndex
                    ? "0 0 10px rgba(0,255,136,0.7)"
                    : "none",
                }}
              />
            ))}
          </div>
        )}

        {/* "Scroll to explore" hint */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              key="scroll-hint"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{
                position: "absolute",
                bottom: "7%",
                left: "50%",
                transform: "translateX(-50%)",
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: 10,
                letterSpacing: "0.3em",
                color: "rgba(0,255,136,0.55)",
                textTransform: "uppercase",
                pointerEvents: "none",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              scroll to explore
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              >
                ↓
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
