"use client";

import { useEffect, useRef } from "react";

const ACCENT = "#6B7F62";

export default function PhilosophySection() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(40px)";
    el.style.transition = "opacity 0.9s ease, transform 0.9s cubic-bezier(0.23,1,0.32,1)";
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      style={{
        position: "relative",
        padding: "16vh 8vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        overflow: "hidden",
        background: "#0a0a0c",
      }}
    >
      {/* Grid background */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(107,127,98,0.03) 60px, rgba(107,127,98,0.03) 61px), repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(107,127,98,0.03) 60px, rgba(107,127,98,0.03) 61px)`,
          pointerEvents: "none",
        }}
      />
      {/* Green orb */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(107,127,98,0.2)",
          filter: "blur(140px)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />

      <div ref={contentRef} style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 800 }}>
        <blockquote
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "clamp(2rem, 4.5vw, 4rem)",
            fontWeight: 300,
            lineHeight: 1.25,
            color: "#f0ede8",
          }}
        >
          Every pixel we place, every frame we capture — exists to tell{" "}
          <em style={{ fontStyle: "italic", color: ACCENT }}>your story</em> in a way that only{" "}
          <em style={{ fontStyle: "italic", color: ACCENT }}>you</em> can own.
        </blockquote>
        <div style={{ width: 60, height: 1, background: ACCENT, margin: "2.5rem auto", opacity: 0.5 }} />
        <p style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(240,237,232,0.45)", fontFamily: "var(--font-jakarta), sans-serif" }}>
          The Konaverse Philosophy
        </p>
      </div>
    </section>
  );
}
