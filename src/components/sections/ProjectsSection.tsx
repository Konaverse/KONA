"use client";

import { useState, useRef, useEffect } from "react";
import {
  motion,
  useTransform,
  useMotionValueEvent,
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
  ACT_2_START,
  ACT_3_START,
  SECTION_FADE_OUT_0,
  SECTION_FADE_OUT_1,
} from "./projects-timing";

import Act1Websites from "./Act1Websites";
import Act2Videos from "./Act2Videos";
import Act3Social from "./Act3Social";
import VideoModal from "./VideoModal";
import ChannelSwitch from "./ChannelSwitch";
import ProjectsMobile from "./ProjectsMobile";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { VideoProject } from "@/data/projects";

// Re-export timing so callers (home-page, etc.) can import from here if needed
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

// ── Main component ────────────────────────────────────────────────────────────
export default function ProjectsSection({ progress, visible }: ProjectsSectionProps) {

  const isMobile = useMediaQuery("(max-width: 1023px)");

  // ── Video modal state ───────────────────────────────────────────────────
  const [activeVideo, setActiveVideo] = useState<VideoProject | null>(null);

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

  // ── Curtain — identical sweep to ServicesSection ─────────────────────────
  const curtainX  = useTransform(progress, [0, CURTAIN_IN, CURTAIN_OUT], [-100, 0, 105]);
  const curtainOp = useTransform(progress, [0, 0.005, 0.19, 0.23], [0, 1, 1, 0]);
  const curtainTranslateX = useTransform(curtainX, (v) => `${v}%`);

  // ── Section content visibility ──────────────────────────────────────────
  const sectionOpacity = useTransform(
    progress,
    [SECTION_FADE_IN_0, SECTION_FADE_IN_1, SECTION_FADE_OUT_0, SECTION_FADE_OUT_1],
    [0, 1, 1, 0]
  );

  // ── Intro header animations ─────────────────────────────────────────────
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

  // ── Progress indicator visibility ──────────────────────────────────────
  const indicatorOpacity = useTransform(
    progress,
    [SECTION_FADE_IN_1, SECTION_FADE_IN_1 + 0.04, SECTION_FADE_OUT_0, SECTION_FADE_OUT_1],
    [0, 1, 1, 0]
  );

  if (!visible && !isMobile) return null;

  // ── Mobile: static tabbed layout, no scroll-driven transforms ───────────
  if (isMobile) return <ProjectsMobile />;

  return (
    <>
      {/* ══ Curtain — green sweep identical to ServicesSection ══ */}
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
        {/* ── Per-act ambient tints — crossfade behind act content ── */}
        {/* Act 0/1 Websites: no tint (dot-grid provides character)    */}
        {/* Act 1   Videos:   warm amber overlay — cinema colour grade  */}
        {/* Act 2   Social:   cool blue-indigo — digital/feed world     */}
        {([
          null,
          "rgba(22,8,0,0.52)",
          "rgba(0,3,22,0.42)",
        ] as const).map((tint, i) =>
          tint ? (
            <motion.div
              key={i}
              animate={{ opacity: activeAct === i ? 1 : 0 }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
              style={{
                position: "absolute",
                inset: 0,
                background: tint,
                pointerEvents: "none",
                zIndex: 0,
              }}
            />
          ) : null
        )}

        {/* ── Intro header (fades out before Act 1 is fully visible) ── */}
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

        {/* ══ Act 1 — Websites ══ */}
        <Act1Websites progress={progress} />

        {/* ══ Act 2 — Videos ══ */}
        <Act2Videos progress={progress} onPlay={setActiveVideo} />

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

      {/* ══ Channel-switch flash — z:18, fires on act threshold crossings ══ */}
      <ChannelSwitch active={switching} />

      {/* ══ Video modal — z:60, above curtain (z:20) ══ */}
      <VideoModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
      />
    </>
  );
}
