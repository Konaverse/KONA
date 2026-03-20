"use client";

import { useState, useRef, useEffect } from "react";
import {
  motion,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";

import {
  ACT_2_START,
  ACT_3_START,
  SECTION_FADE_OUT_0,
  SECTION_FADE_OUT_1,
} from "./projects-timing";

import Act1Websites from "./Act1Websites";
import Act2Videos from "./Act2Videos";
import Act3Social from "./Act3Social";
import ChannelSwitch from "./ChannelSwitch";
import ProjectsMobile from "./ProjectsMobile";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// Re-export timing so callers can import from here if needed
export * from "./projects-timing";

// ── Three acts metadata ───────────────────────────────────────────────────────
const ACTS = [
  { id: "websites", label: "Websites" },
  { id: "videos",   label: "Videos"   },
  { id: "social",   label: "Social"   },
] as const;

function getActiveAct(p: number): number {
  if (p < ACT_2_START) return 0;
  if (p < ACT_3_START) return 1;
  return 2;
}


// ── Types ─────────────────────────────────────────────────────────────────────
interface ProjectsSectionProps {
  progress: MotionValue<number>;
  visible: boolean;
}

// ── Main component (Acts 2 & 3 only — intro + Act 1 are separate) ───────────
export default function ProjectsSection({ progress, visible }: ProjectsSectionProps) {

  const isMobile = useMediaQuery("(max-width: 1023px)");

  // ── Active act tracking ─────────────────────────────────────────────────
  const [activeAct, setActiveAct] = useState(() => getActiveAct(progress.get()));
  const activeActRef = useRef(getActiveAct(progress.get()));

  // ── Channel-switch flash state ───────────────────────────────────────────
  const [switching, setSwitching] = useState(false);
  const switchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useMotionValueEvent(progress, "change", (val) => {
    const next = getActiveAct(val);
    if (next !== activeActRef.current) {
      setActiveAct(next);
      activeActRef.current = next;
      // Trigger flash — clear any in-flight timer first
      if (switchTimerRef.current) clearTimeout(switchTimerRef.current);
      setSwitching(true);
      switchTimerRef.current = setTimeout(() => setSwitching(false), 320);
    }
  });

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (switchTimerRef.current) clearTimeout(switchTimerRef.current);
    };
  }, []);

  // ── Section content visibility ──────────────────────────────────────────
  const sectionOpacity = useTransform(
    progress,
    [0, 0.04, SECTION_FADE_OUT_0, SECTION_FADE_OUT_1],
    [0, 1, 1, 0]
  );

  // ── Progress indicator visibility ──────────────────────────────────────
  const indicatorOpacity = useTransform(
    progress,
    [0, 0.06, SECTION_FADE_OUT_0, SECTION_FADE_OUT_1],
    [0, 1, 1, 0]
  );

  if (!visible && !isMobile) return null;

  // ── Mobile: static tabbed layout, no scroll-driven transforms ───────────
  if (isMobile) return <ProjectsMobile />;

  return (
    <>
      {/* ══ Section content ══ */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          opacity: sectionOpacity,
          pointerEvents: "none",
        }}
      >
        {/* ══ Act 1 — Websites ══ */}
        <Act1Websites progress={progress} />

        {/* ══ Act 2 — Videos ══ */}
        <Act2Videos progress={progress} />

        {/* ══ Act 3 — Social ══ */}
        <Act3Social progress={progress} />

        {/* ── Three-act progress indicator ── */}
        <motion.div
          style={{
            position: "absolute",
            bottom: "4.5%",
            left: "50%",
            transform: "translateX(-50%)",
            opacity: indicatorOpacity,
            display: "flex",
            alignItems: "center",
            pointerEvents: "none",
            willChange: "opacity",
            zIndex: 10,
          }}
        >
          {ACTS.map((act, i) => (
            <div
              key={act.id}
              style={{ display: "flex", alignItems: "center" }}
            >
              {i > 0 && (
                <div
                  style={{
                    width: "clamp(24px, 3vw, 40px)",
                    height: 1,
                    background: "rgba(0,255,136,0.2)",
                    marginInline: 12,
                  }}
                />
              )}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <motion.div
                  animate={{
                    scale: activeAct === i ? 1.6 : 1,
                    opacity: activeAct === i ? 1 : 0.3,
                    boxShadow:
                      activeAct === i
                        ? "0 0 12px rgba(0,255,136,0.8), 0 0 24px rgba(0,255,136,0.3)"
                        : "none",
                  }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#00ff88",
                  }}
                />
                <motion.div
                  animate={{
                    opacity: activeAct === i ? 0.85 : 0.25,
                    y: activeAct === i ? 0 : 2,
                  }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: 9,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "#00ff88",
                    whiteSpace: "nowrap",
                  }}
                >
                  {act.label}
                </motion.div>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ══ Channel-switch flash ══ */}
      <ChannelSwitch active={switching} />
    </>
  );
}
