"use client";

import { useState, useRef, useEffect } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  type MotionValue,
} from "framer-motion";

import {
  CURTAIN_IN,
  CURTAIN_OUT,
  SECTION_FADE_IN_0,
  SECTION_FADE_IN_1,
  HEADER_FADE_OUT_0,
  HEADER_FADE_OUT_1,
} from "./projects-timing";

interface ProjectsIntroProps {
  progress: MotionValue<number>;
  visible: boolean;
}

export default function ProjectsIntro({ progress, visible }: ProjectsIntroProps) {
  // ── "Scroll to explore" hint — fires once on first appearance ───────────
  const [showHint, setShowHint] = useState(false);
  const hintTriggeredRef = useRef(false);
  useEffect(() => {
    if (!visible || hintTriggeredRef.current) return;
    hintTriggeredRef.current = true;
    setShowHint(true);
    const t = setTimeout(() => setShowHint(false), 3200);
    return () => clearTimeout(t);
  }, [visible]);

  // ── Curtain — green sweep ─────────────────────────────────────────────
  const curtainX = useTransform(progress, [0, CURTAIN_IN, CURTAIN_OUT], [-100, 0, 105]);
  const curtainOp = useTransform(progress, [0, 0.01, CURTAIN_OUT - 0.05, CURTAIN_OUT + 0.05], [0, 1, 1, 0]);
  const curtainTranslateX = useTransform(curtainX, (v) => `${v}%`);

  // ── Section content visibility ────────────────────────────────────────
  const sectionOpacity = useTransform(
    progress,
    [SECTION_FADE_IN_0, SECTION_FADE_IN_1, HEADER_FADE_OUT_0, HEADER_FADE_OUT_1],
    [0, 1, 1, 0]
  );

  // ── Intro header animations ───────────────────────────────────────────
  const labelOpacity = useTransform(
    progress,
    [SECTION_FADE_IN_0, SECTION_FADE_IN_1, HEADER_FADE_OUT_0, HEADER_FADE_OUT_1],
    [0, 1, 1, 0]
  );
  const labelY = useTransform(progress, [SECTION_FADE_IN_0, SECTION_FADE_IN_1], [12, 0]);

  const titleOpacity = useTransform(
    progress,
    [SECTION_FADE_IN_1, SECTION_FADE_IN_1 + 0.05, HEADER_FADE_OUT_0, HEADER_FADE_OUT_1],
    [0, 1, 1, 0]
  );
  const titleY = useTransform(progress, [SECTION_FADE_IN_1, SECTION_FADE_IN_1 + 0.05], [28, 0]);

  const ruleScaleX = useTransform(
    progress,
    [SECTION_FADE_IN_1 - 0.02, SECTION_FADE_IN_1 + 0.03],
    [0, 1]
  );
  const ruleOpacity = useTransform(
    progress,
    [SECTION_FADE_IN_1 - 0.02, SECTION_FADE_IN_1, HEADER_FADE_OUT_0, HEADER_FADE_OUT_1],
    [0, 1, 1, 0]
  );

  const tagOpacity = useTransform(
    progress,
    [SECTION_FADE_IN_1 + 0.04, SECTION_FADE_IN_1 + 0.08, HEADER_FADE_OUT_0, HEADER_FADE_OUT_1],
    [0, 1, 1, 0]
  );
  const tagY = useTransform(progress, [SECTION_FADE_IN_1 + 0.04, SECTION_FADE_IN_1 + 0.08], [14, 0]);

  if (!visible) return null;

  return (
    <>
      {/* ══ Curtain — green sweep ══ */}
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

      {/* ══ Section content ══ */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          opacity: sectionOpacity,
        }}
      >
        {/* ── Intro header ── */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "9%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <motion.div
            style={{
              opacity: labelOpacity,
              y: labelY,
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#00ff88",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 10,
              willChange: "transform, opacity",
            }}
          >
            <span style={{ opacity: 0.5 }}>◆</span>
            04 — Projects
          </motion.div>

          <motion.div
            style={{
              width: "clamp(180px, 22vw, 320px)",
              height: 1,
              background: "#00ff88",
              scaleX: ruleScaleX,
              opacity: ruleOpacity,
              transformOrigin: "left center",
              boxShadow: "0 0 16px rgba(0,255,136,0.35)",
              marginBottom: 20,
              willChange: "transform, opacity",
            }}
          />

          <motion.div
            style={{
              opacity: titleOpacity,
              y: titleY,
              fontFamily: "var(--font-monument), sans-serif",
              fontSize: "clamp(36px, 6.5vw, 88px)",
              fontWeight: 800,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.95)",
              lineHeight: 1,
              marginBottom: 24,
              willChange: "transform, opacity",
            }}
          >
            Selected
            <br />
            <span style={{ color: "#00ff88" }}>Work.</span>
          </motion.div>

          <motion.div
            style={{
              opacity: tagOpacity,
              y: tagY,
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "clamp(10px, 1.1vw, 13px)",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              willChange: "transform, opacity",
            }}
          >
            Websites&nbsp;&nbsp;·&nbsp;&nbsp;Videos&nbsp;&nbsp;·&nbsp;&nbsp;Social
          </motion.div>
        </div>

        {/* ── "Scroll to explore" hint ── */}
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
                bottom: "12%",
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
                zIndex: 10,
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
