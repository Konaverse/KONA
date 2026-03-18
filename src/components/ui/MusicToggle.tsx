"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, MotionValue, useMotionValueEvent } from "framer-motion";

export default function MusicToggle({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>;
}) {
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Show after scrolling past hero
  useMotionValueEvent(scrollProgress, "change", (val) => {
    setVisible(val > 0.15);
  });

  const toggle = useCallback(() => {
    const iframe = document.getElementById("kona-music-player") as HTMLIFrameElement | null;
    if (!iframe?.contentWindow) return;

    if (playing) {
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: "pauseVideo", args: [] }),
        "*"
      );
    } else {
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: "playVideo", args: [] }),
        "*"
      );
    }
    setPlaying(!playing);
  }, [playing]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={toggle}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 z-[90] w-12 h-12 rounded-full flex items-center justify-center cursor-pointer"
          style={{
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
          }}
          aria-label={playing ? "Pause music" : "Play music"}
        >
          {playing ? (
            // Pause icon
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="3" y="2" width="3.5" height="12" rx="1" fill="#00ff88" />
              <rect x="9.5" y="2" width="3.5" height="12" rx="1" fill="#00ff88" />
            </svg>
          ) : (
            // Music note icon
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 2v9.5M6 2l7-1v9M6 11.5a2.5 2 0 1 1-3-1.7M13 10a2.5 2 0 1 1-3-1.7"
                stroke="#00ff88"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          )}

          {/* Pulsing ring when playing */}
          {playing && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                border: "1px solid rgba(0,255,136,0.3)",
              }}
              animate={{
                scale: [1, 1.4, 1.4],
                opacity: [0.6, 0, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
