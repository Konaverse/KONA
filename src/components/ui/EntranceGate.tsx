"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface EntranceGateProps {
  sceneReady: boolean;
  onIntroComplete: () => void;
  onRevealComplete: () => void;
}

// ── Grid layout ──────────────────────────────────────────────
const CELL = 36;
const GAP = 4;
const PAD = 8;
const COLS = 3;
const ROWS = 2;
const RECT_W = COLS * CELL + (COLS - 1) * GAP + PAD * 2; // 132
const RECT_H = ROWS * CELL + (ROWS - 1) * GAP + PAD * 2; // 92

// 6 grid positions in clockwise order
const CYCLE = [
  { x: PAD, y: PAD },                                  // 0: top-left
  { x: PAD + CELL + GAP, y: PAD },                     // 1: top-middle
  { x: PAD + (CELL + GAP) * 2, y: PAD },               // 2: top-right
  { x: PAD + (CELL + GAP) * 2, y: PAD + CELL + GAP },  // 3: bottom-right
  { x: PAD + CELL + GAP, y: PAD + CELL + GAP },         // 4: bottom-middle
  { x: PAD, y: PAD + CELL + GAP },                      // 5: bottom-left
];

// ── Pre-computed CSS keyframes for the sliding puzzle ────────
// 5 squares cycling clockwise through 6 positions.
// Full cycle: 30 steps × 650ms = 19500ms.
// Each slide: 350ms. Runs on the compositor thread — immune to main thread blocking.

const TOTAL_STEPS = 30;
const STEP_MS = 650;
const SLIDE_MS = 350;
const TOTAL_MS = TOTAL_STEPS * STEP_MS;

const SEQUENCES: { start: number; moves: [number, number][] }[] = [
  { start: 0, moves: [[2, 1], [7, 2], [12, 3], [17, 4], [22, 5], [27, 0]] },
  { start: 1, moves: [[1, 2], [6, 3], [11, 4], [16, 5], [21, 0], [26, 1]] },
  { start: 3, moves: [[5, 4], [10, 5], [15, 0], [20, 1], [25, 2], [30, 3]] },
  { start: 4, moves: [[4, 5], [9, 0], [14, 1], [19, 2], [24, 3], [29, 4]] },
  { start: 5, moves: [[3, 0], [8, 1], [13, 2], [18, 3], [23, 4], [28, 5]] },
];

function buildKeyframes(): string {
  const stepPct = (STEP_MS / TOTAL_MS) * 100;
  const slidePct = (SLIDE_MS / TOTAL_MS) * 100;

  return SEQUENCES.map((seq, idx) => {
    const entries: { arrive: number; hold: number; pos: number }[] = [];
    let pos = seq.start;

    // First entry: hold at start until first move
    entries.push({ arrive: 0, hold: seq.moves[0][0] * stepPct, pos });

    for (let m = 0; m < seq.moves.length; m++) {
      const [step, target] = seq.moves[m];
      let slideStart = step * stepPct;
      let slideEnd = slideStart + slidePct;

      // Clamp the last move to fit within 100%
      if (slideEnd > 100) {
        slideStart = 100 - slidePct;
        slideEnd = 100;
      }

      const nextHold =
        m < seq.moves.length - 1
          ? Math.min(seq.moves[m + 1][0] * stepPct, 100 - slidePct)
          : 100;

      entries.push({ arrive: slideEnd, hold: nextHold, pos: target });
      pos = target;
    }

    const frames = entries
      .map((e) => {
        const a = e.arrive.toFixed(2);
        const h = e.hold.toFixed(2);
        const t = `translate(${CYCLE[e.pos].x}px,${CYCLE[e.pos].y}px)`;
        return a === h
          ? `${a}%{transform:${t}}`
          : `${a}%,${h}%{transform:${t}}`;
      })
      .join("");

    return `@keyframes sq${idx}{${frames}}`;
  }).join("\n");
}

const KEYFRAMES_CSS = buildKeyframes();

// ── Sliding puzzle grid (pure CSS animation) ─────────────────
function SlidingGrid({ visible }: { visible: boolean }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES_CSS }} />
      <motion.div
        style={{ position: "absolute", inset: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ opacity: { duration: 0.4, delay: visible ? 1.2 : 0 } }}
      >
        {SEQUENCES.map((seq, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: CELL,
              height: CELL,
              willChange: "transform",
              transform: `translate(${CYCLE[seq.start].x}px,${CYCLE[seq.start].y}px)`,
              animation: `sq${i} ${TOTAL_MS}ms cubic-bezier(0.22,1,0.36,1) infinite`,
              border: "1px solid rgba(0,255,136,0.3)",
              background: "rgba(0,255,136,0.15)",
            }}
          />
        ))}
      </motion.div>
    </>
  );
}

// ── Full-screen visual content (rendered once per door half) ──
function GateContent({
  phase,
}: {
  phase: "intro" | "holding" | "exiting" | "opening";
}) {
  const shapesVisible = phase === "intro" || phase === "holding";

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
      }}
    >
      {/* ── Vertical line — sits BEHIND the rectangle ── */}
      <motion.div
        style={{
          position: "absolute",
          left: "calc(50vw - 1px)",
          top: 0,
          width: 2,
          height: "100%",
          background: "#00ff88",
          transformOrigin: "center center",
          zIndex: 0,
        }}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{
          scaleY: { duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 },
          opacity: { duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 },
        }}
      />
      {/* Glow layer for the line */}
      <motion.div
        style={{
          position: "absolute",
          left: "calc(50vw - 10px)",
          top: 0,
          width: 20,
          height: "100%",
          background:
            "radial-gradient(ellipse at center, rgba(0,255,136,0.2) 0%, transparent 70%)",
          transformOrigin: "center center",
          zIndex: 0,
          pointerEvents: "none",
        }}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{
          scaleY: { duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 },
          opacity: { duration: 2.0, ease: [0.16, 1, 0.3, 1], delay: 0.6 },
        }}
      />

      {/* ── Centered rectangle — masks the line behind it ── */}
      <div
        style={{
          position: "absolute",
          left: `calc(50vw - ${RECT_W / 2}px)`,
          top: `calc(50vh - ${RECT_H / 2}px)`,
          width: RECT_W,
          height: RECT_H,
          zIndex: 1,
        }}
      >
        {/* Black fill — hides line through the center */}
        <div style={{ position: "absolute", inset: 0, background: "#000" }} />

        {/* SVG border — draws itself in */}
        <motion.svg
          viewBox={`0 0 ${RECT_W} ${RECT_H}`}
          fill="none"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <motion.rect
            x="1.5"
            y="1.5"
            width={RECT_W - 3}
            height={RECT_H - 3}
            stroke="#00ff88"
            strokeWidth="1"
            strokeLinecap="round"
            pathLength={1}
            initial={{ strokeDasharray: 1, strokeDashoffset: 1, opacity: 0 }}
            animate={{ strokeDashoffset: 0, opacity: 1 }}
            transition={{
              strokeDashoffset: {
                duration: 1.4,
                ease: [0.65, 0, 0.35, 1],
                delay: 0.1,
              },
              opacity: { duration: 0.15, delay: 0.1 },
            }}
          />
        </motion.svg>

        {/* Sliding grid puzzle */}
        <SlidingGrid visible={shapesVisible} />
      </div>
    </div>
  );
}

// ── Main component ──
export default function EntranceGate({
  sceneReady,
  onIntroComplete,
  onRevealComplete,
}: EntranceGateProps) {
  const [phase, setPhase] = useState<
    "intro" | "holding" | "exiting" | "opening"
  >("intro");
  const [gone, setGone] = useState(false);
  const minTimeRef = useRef(false);
  const onRevealRef = useRef(onRevealComplete);
  onRevealRef.current = onRevealComplete;
  const onIntroRef = useRef(onIntroComplete);
  onIntroRef.current = onIntroComplete;

  // After 1.5s the main intro animations (line + rect draw) are done —
  // tell the parent it's safe to start mounting the 3D scene.
  useEffect(() => {
    const t = setTimeout(() => onIntroRef.current(), 1500);
    return () => clearTimeout(t);
  }, []);

  // Minimum total animation time before doors can open
  useEffect(() => {
    const t = setTimeout(() => {
      minTimeRef.current = true;
    }, 2800);
    return () => clearTimeout(t);
  }, []);

  // Intro phase lasts ~2.8s, then switch to holding
  useEffect(() => {
    const t = setTimeout(() => setPhase("holding"), 2800);
    return () => clearTimeout(t);
  }, []);

  // When scene ready + min time elapsed → exit shapes → open doors
  useEffect(() => {
    if (!sceneReady) return;

    const tryOpen = () => {
      if (minTimeRef.current) {
        setPhase("exiting");
        setTimeout(() => setPhase("opening"), 350);
      } else {
        setTimeout(tryOpen, 80);
      }
    };
    tryOpen();
  }, [sceneReady]);

  // After doors finish sliding → unmount
  useEffect(() => {
    if (phase !== "opening") return;
    const t = setTimeout(() => {
      setGone(true);
      onRevealRef.current();
    }, 1500);
    return () => clearTimeout(t);
  }, [phase]);

  if (gone) return null;

  const doorsOpen = phase === "opening";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        pointerEvents: doorsOpen ? "none" : "all",
      }}
    >
      {/* ── Left door ── */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "50vw",
          height: "100vh",
          overflow: "hidden",
          background: "#000",
        }}
        animate={{ x: doorsOpen ? "-100%" : "0%" }}
        transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <GateContent phase={phase} />
      </motion.div>

      {/* ── Right door ── */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "50vw",
          height: "100vh",
          overflow: "hidden",
          background: "#000",
        }}
        animate={{ x: doorsOpen ? "100%" : "0%" }}
        transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <div style={{ position: "relative", left: "-50vw" }}>
          <GateContent phase={phase} />
        </div>
      </motion.div>
    </div>
  );
}
