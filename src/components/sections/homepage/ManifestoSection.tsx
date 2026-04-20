"use client";

import { useEffect, useRef, useState } from "react";

const ACCENT = "#6B7F62";

const words: { text: string; italic?: boolean; accent?: boolean }[] = [
  { text: "We" },
  { text: "don\u2019t" },
  { text: "just" },
  { text: "build" },
  { text: "websites" },
  { text: "or" },
  { text: "shoot" },
  { text: "videos" },
  { text: "\u2014" },
  { text: "we" },
  { text: "craft", italic: true },
  { text: "digital", accent: true },
  { text: "experiences", accent: true },
  { text: "that" },
  { text: "breathe", italic: true },
  { text: "life", accent: true },
  { text: "into" },
  { text: "every" },
  { text: "brand" },
  { text: "we" },
  { text: "touch." },
];

export default function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = (vh - rect.top) / (vh + rect.height);
      const clamped = Math.min(1, Math.max(0, raw));
      const reveal = Math.min(1, Math.max(0, (clamped - 0.2) / 0.6));
      setProgress(reveal);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const wordsToShow = Math.floor(progress * words.length);
  const progressPct = progress * 100;

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "10vh 8vw",
        overflow: "hidden",
        background: "#0a0a0c",
      }}
    >
      {/* Vertical progress line */}
      <div
        style={{
          position: "absolute",
          left: "6vw",
          top: "10%",
          bottom: "10%",
          width: 2,
          background: "rgba(255,255,255,0.06)",
          borderRadius: 1,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: `${progressPct}%`,
            background: ACCENT,
            borderRadius: 1,
            boxShadow: `0 0 20px rgba(107,127,98,0.6), 0 0 60px rgba(107,127,98,0.2)`,
            transition: "height 0.05s linear",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -4,
            top: `${progressPct}%`,
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: ACCENT,
            boxShadow: `0 0 16px rgba(107,127,98,0.8), 0 0 40px rgba(107,127,98,0.3)`,
            transition: "top 0.05s linear",
          }}
        />
      </div>

      {/* Manifesto text */}
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "clamp(2.8rem, 5.5vw, 5.5rem)",
          fontWeight: 300,
          lineHeight: 1.3,
          maxWidth: 900,
          marginLeft: "6vw",
        }}
      >
        {words.map((w, i) => (
          <span
            key={i}
            style={{
              display: "inline",
              color: i < wordsToShow
                ? w.accent
                  ? ACCENT
                  : "#f0ede8"
                : "rgba(240,237,232,0.08)",
              fontStyle: w.italic ? "italic" : "normal",
              textShadow: i < wordsToShow && w.accent
                ? "0 0 40px rgba(107,127,98,0.3)"
                : "none",
              transition: "color 0.6s cubic-bezier(0.23,1,0.32,1), text-shadow 0.6s cubic-bezier(0.23,1,0.32,1)",
            }}
          >
            {w.text}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </p>
    </section>
  );
}
