"use client";

import { useRef, useState } from "react";
import {
  motion,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
  type MotionValue,
} from "framer-motion";

import { ACT_3_START, SECTION_FADE_OUT_0 } from "./projects-timing";
import { SOCIAL_PROJECTS } from "@/data/projects";

// ── Social data (labels only — 3D is in ProjectScenes) ─────────────────────
const SOCIALS = SOCIAL_PROJECTS.map((s) => ({
  name: s.title,
  client: s.client,
  platforms: s.platforms,
  metrics: s.metrics,
}));

// ── Active project detection (mirrors ProjectScenes keyframes) ──────────────
const PROJECT_COUNT = SOCIALS.length;
const HOLD_FIRST = 0.11;
const HOLD_NORMAL = 0.07;
const HOLD_LAST = 0.09;
const TRANS_DUR = 0.015;

function buildKeyframeInputs() {
  const inputs: number[] = [];
  let p = ACT_3_START;
  for (let i = 0; i < PROJECT_COUNT; i++) {
    const hold =
      i === 0 ? HOLD_FIRST : i === PROJECT_COUNT - 1 ? HOLD_LAST : HOLD_NORMAL;
    inputs.push(p);
    p += hold;
    inputs.push(p);
    if (i < PROJECT_COUNT - 1) p += TRANS_DUR;
  }
  return inputs;
}

const KF_INPUTS = buildKeyframeInputs();

function getActiveProject(p: number): number {
  for (let i = PROJECT_COUNT - 1; i > 0; i--) {
    const mid = (KF_INPUTS[i * 2 - 1] + KF_INPUTS[i * 2]) / 2;
    if (p >= mid) return i;
  }
  return 0;
}

// ── Main component (HTML overlay only) ──────────────────────────────────────
interface Act3SocialProps {
  progress: MotionValue<number>;
}

export default function Act3Social({ progress }: Act3SocialProps) {
  const [activeProject, setActiveProject] = useState(0);
  const activeRef = useRef(0);

  useMotionValueEvent(progress, "change", (p) => {
    const idx = getActiveProject(p);
    if (idx !== activeRef.current) {
      activeRef.current = idx;
      setActiveProject(idx);
    }
  });

  const actOpacity = useTransform(
    progress,
    [ACT_3_START, ACT_3_START + 0.04, SECTION_FADE_OUT_0 - 0.03, SECTION_FADE_OUT_0],
    [0, 1, 1, 0]
  );

  const social = SOCIALS[activeProject];

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        opacity: actOpacity,
        willChange: "opacity",
        pointerEvents: "none",
      }}
    >
      {/* ── Labels — bottom center ── */}
      <div
        style={{
          position: "absolute",
          bottom: "14vh",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          pointerEvents: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProject}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            {/* Project name */}
            <div
              style={{
                fontFamily: "var(--font-monument), sans-serif",
                fontSize: "clamp(14px, 1.5vw, 22px)",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#ffffff",
              }}
            >
              {social.name}
            </div>

            {/* Platforms */}
            <div
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: "clamp(9px, 0.9vw, 12px)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#00ff88",
                opacity: 0.9,
              }}
            >
              {social.platforms.join(" · ")}
            </div>

            {/* Metrics row */}
            <div
              style={{
                display: "flex",
                gap: "clamp(16px, 2.5vw, 40px)",
                marginTop: 4,
              }}
            >
              {[
                { label: "Impressions", value: social.metrics.impressions },
                { label: "Reach", value: social.metrics.reach },
                { label: "Engagement", value: social.metrics.engagement },
              ].map((m) => (
                <div
                  key={m.label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-monument), sans-serif",
                      fontSize: "clamp(12px, 1.2vw, 18px)",
                      fontWeight: 700,
                      color: "#00ff88",
                    }}
                  >
                    {m.value}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "clamp(7px, 0.7vw, 9px)",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
