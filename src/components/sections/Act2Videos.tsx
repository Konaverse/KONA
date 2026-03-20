"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
  type MotionValue,
} from "framer-motion";

import { ACT_2_START, ACT_3_START } from "./projects-timing";
import { VIDEO_PROJECTS } from "@/data/projects";

// ── Video data (labels only — 3D is in ProjectScenes) ──────────────────────
const VIDEOS = VIDEO_PROJECTS.map((v) => ({
  name: v.title,
  client: v.client,
  videoUrl: "/konavers_video.mp4",
  duration: v.duration,
}));

// ── Active panel detection (mirrors ProjectScenes keyframes) ────────────────
const PANEL_COUNT = VIDEOS.length;
const HOLD_FIRST = 0.11;
const HOLD_NORMAL = 0.07;
const HOLD_LAST = 0.09;
const TRANS_DUR = 0.015;

function buildKeyframeInputs() {
  const inputs: number[] = [];
  let p = ACT_2_START;
  for (let i = 0; i < PANEL_COUNT; i++) {
    const hold =
      i === 0 ? HOLD_FIRST : i === PANEL_COUNT - 1 ? HOLD_LAST : HOLD_NORMAL;
    inputs.push(p);
    p += hold;
    inputs.push(p);
    if (i < PANEL_COUNT - 1) p += TRANS_DUR;
  }
  return inputs;
}

const KF_INPUTS = buildKeyframeInputs();

function getActivePanel(p: number): number {
  for (let i = PANEL_COUNT - 1; i > 0; i--) {
    const mid = (KF_INPUTS[i * 2 - 1] + KF_INPUTS[i * 2]) / 2;
    if (p >= mid) return i;
  }
  return 0;
}

// ── Video player overlay ────────────────────────────────────────────────────
function VideoOverlay({
  videoUrl,
  onClose,
}: {
  videoUrl: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " ") e.preventDefault();
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.92)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        pointerEvents: "auto",
      }}
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
    >
      <video
        src={videoUrl}
        autoPlay
        controls
        controlsList="nodownload"
        playsInline
        style={{
          width: "min(85vw, 1400px)",
          maxHeight: "80vh",
          borderRadius: 8,
          cursor: "default",
        }}
        onClick={(e) => e.stopPropagation()}
      />

      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 80,
          right: 32,
          background: "rgba(0,0,0,0.6)",
          border: "1px solid rgba(255,255,255,0.3)",
          color: "#fff",
          fontSize: 18,
          width: 40,
          height: 40,
          borderRadius: "50%",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(8px)",
        }}
      >
        ✕
      </button>
    </motion.div>
  );
}

// ── Main component (HTML overlay only) ──────────────────────────────────────
interface Act2VideosProps {
  progress: MotionValue<number>;
}

export default function Act2Videos({ progress }: Act2VideosProps) {
  const [activePanel, setActivePanel] = useState(0);
  const activePanelRef = useRef(0);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useMotionValueEvent(progress, "change", (p) => {
    const idx = getActivePanel(p);
    if (idx !== activePanelRef.current) {
      activePanelRef.current = idx;
      setActivePanel(idx);
    }
    const vis = p >= ACT_2_START && p < ACT_3_START;
    if (vis !== isVisible) setIsVisible(vis);
  });

  const actOpacity = useTransform(
    progress,
    [ACT_2_START, ACT_2_START + 0.04, ACT_3_START - 0.04, ACT_3_START],
    [0, 1, 1, 0]
  );

  const video = VIDEOS[activePanel];

  return (
    <>
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          opacity: actOpacity,
          willChange: "opacity",
          pointerEvents: "none",
        }}
      >
        {/* ── Clickable area over active panel + play indicator ── */}
        <div
          style={{
            position: "absolute",
            right: "calc(4vw + 14%)",
            top: "25%",
            width: "30%",
            height: "50%",
            pointerEvents: isVisible ? "auto" : "none",
            cursor: "pointer",
            zIndex: 5,
          }}
          onClick={() => setPlayingVideo(video.videoUrl)}
        >
          {/* Play button */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.5)",
              border: "2px solid rgba(0,255,136,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.2s ease, border-color 0.2s ease",
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "18px solid #00ff88",
                borderTop: "11px solid transparent",
                borderBottom: "11px solid transparent",
                marginLeft: 4,
              }}
            />
          </div>
        </div>

        {/* ── Labels — bottom right ── */}
        <div
          style={{
            position: "absolute",
            bottom: "6vh",
            right: "4vw",
            zIndex: 10,
            pointerEvents: isVisible ? "auto" : "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 14,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activePanel}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 8,
              }}
            >
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
                {video.name}
              </div>
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
                {video.client} · {video.duration}
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={() => setPlayingVideo(video.videoUrl)}
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "clamp(8px, 0.85vw, 11px)",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(0,255,136,0.7)",
              background: "none",
              border: "1px solid rgba(0,255,136,0.3)",
              padding: "7px 16px",
              borderRadius: 2,
              whiteSpace: "nowrap",
              cursor: "pointer",
            }}
          >
            ▶ Play video
          </button>
        </div>
      </motion.div>

      {/* ── Fullscreen video overlay ── */}
      <AnimatePresence>
        {playingVideo && (
          <VideoOverlay
            videoUrl={playingVideo}
            onClose={() => setPlayingVideo(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
