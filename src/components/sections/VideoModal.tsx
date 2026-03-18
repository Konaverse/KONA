"use client";

import { useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { VideoProject } from "@/data/projects";

interface VideoModalProps {
  video: VideoProject | null;
  onClose: () => void;
}


export default function VideoModal({ video, onClose }: VideoModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // ── Keyboard: Esc to close ─────────────────────────────────────────────
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  // ── Scroll lock + key listener while modal is open ─────────────────────
  useEffect(() => {
    if (!video) return;
    document.addEventListener("keydown", handleKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prev;
    };
  }, [video, handleKey]);

  // ── Click outside: only close when the backdrop itself is clicked ──────
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <AnimatePresence>
      {video && (
        <motion.div
          ref={overlayRef}
          key="video-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={handleBackdropClick}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            background: "rgba(0,0,0,0.86)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(40px, 6vh, 80px) clamp(24px, 5vw, 80px)",
            cursor: "default",
          }}
        >
          {/* ── Modal panel ── */}
          <motion.div
            key="video-modal-panel"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "min(88vw, calc(82vh * 16 / 9))",
            }}
          >
            {/* ── Top bar: title (left) + close (right) ── */}
            <div
              style={{
                position: "absolute",
                top: -44,
                left: 0,
                right: 0,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {/* Title */}
              <div
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: 10,
                  letterSpacing: "0.26em",
                  color: "rgba(255,255,255,0.38)",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  maxWidth: "70%",
                  pointerEvents: "none",
                }}
              >
                <span style={{ color: "rgba(0,255,136,0.55)", fontSize: 11 }}>▶</span>
                {video.client}
                <span style={{ color: "rgba(255,255,255,0.18)", marginInline: 2 }}>—</span>
                {video.title}
              </div>

              {/* Close button */}
              <motion.button
                onClick={onClose}
                whileHover={{
                  borderColor: "rgba(0,255,136,0.65)",
                  color: "rgba(0,255,136,1)",
                  boxShadow: "0 0 16px rgba(0,255,136,0.1)",
                }}
                transition={{ duration: 0.15 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "5px 14px",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.45)",
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 16, lineHeight: 1, marginTop: -1 }}>×</span>
                Close
              </motion.button>
            </div>

            {/* ── 16:9 video container ── */}
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 9",
                background: "#000",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow:
                  "0 48px 120px rgba(0,0,0,0.85), 0 0 80px rgba(0,255,136,0.04)",
                overflow: "hidden",
              }}
            >
              {/* Dark bg visible while video loads */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(ellipse at 50% 50%, #050f08 0%, #010401 100%)",
                  zIndex: 0,
                }}
              />

              {/* key=videoUrl forces remount (and stop) when switching projects */}
              <video
                key={video.videoUrl}
                src={video.videoUrl}
                autoPlay
                controls
                playsInline
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 1,
                  outline: "none",
                }}
              />
            </div>

            {/* ── Bottom meta bar ── */}
            <div
              style={{
                marginTop: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* Tags */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {video.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: 9,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "rgba(0,255,136,0.4)",
                      padding: "3px 8px",
                      border: "1px solid rgba(0,255,136,0.14)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Year · Duration */}
              <div
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: 9,
                  letterSpacing: "0.22em",
                  color: "rgba(255,255,255,0.2)",
                  flexShrink: 0,
                  marginLeft: 16,
                }}
              >
                {video.year}&nbsp;·&nbsp;{video.duration}
              </div>
            </div>

            {/* ── Corner accent lines (cinema frame detail) ── */}
            {(["topLeft", "topRight", "bottomLeft", "bottomRight"] as const).map((corner) => (
              <div
                key={corner}
                style={{
                  position: "absolute",
                  width: 18,
                  height: 18,
                  ...cornerStyle(corner),
                  pointerEvents: "none",
                  zIndex: 2,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Corner bracket helper ─────────────────────────────────────────────────────

type Corner = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

function cornerStyle(corner: Corner): React.CSSProperties {
  const size = 18;
  const color = "rgba(0,255,136,0.35)";
  const base: React.CSSProperties = {
    borderColor: color,
    borderStyle: "solid",
    borderWidth: 0,
  };
  switch (corner) {
    case "topLeft":
      return { ...base, top: 0, left: 0, borderTopWidth: 1.5, borderLeftWidth: 1.5, width: size, height: size };
    case "topRight":
      return { ...base, top: 0, right: 0, borderTopWidth: 1.5, borderRightWidth: 1.5, width: size, height: size };
    case "bottomLeft":
      return { ...base, bottom: 0, left: 0, borderBottomWidth: 1.5, borderLeftWidth: 1.5, width: size, height: size };
    case "bottomRight":
      return { ...base, bottom: 0, right: 0, borderBottomWidth: 1.5, borderRightWidth: 1.5, width: size, height: size };
  }
}
