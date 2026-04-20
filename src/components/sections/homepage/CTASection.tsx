"use client";

import { useEffect, useRef } from "react";

const ACCENT = "#6B7F62";

export default function CTASection() {
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
        textAlign: "center",
        overflow: "hidden",
        background: "#0a0a0c",
      }}
    >
      {/* Orbs */}
      <div aria-hidden style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: "rgba(107,127,98,0.3)", filter: "blur(120px)", top: "20%", left: "10%", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "rgba(107,127,98,0.2)", filter: "blur(120px)", bottom: "10%", right: "15%", pointerEvents: "none" }} />

      <div ref={contentRef} style={{ position: "relative", zIndex: 2 }}>
        <p style={{ fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: ACCENT, marginBottom: "1.5rem", fontFamily: "var(--font-jakarta), sans-serif" }}>
          Start a Project
        </p>
        <h2
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "clamp(3rem, 6vw, 5.5rem)",
            fontWeight: 300,
            lineHeight: 1.1,
            color: "#f0ede8",
            marginBottom: "1.5rem",
          }}
        >
          Let&apos;s build something<br />
          <em style={{ fontStyle: "italic", color: ACCENT }}>remarkable</em>
        </h2>
        <p style={{ fontSize: "1rem", fontWeight: 300, color: "rgba(240,237,232,0.45)", maxWidth: 480, margin: "0 auto 3rem", lineHeight: 1.7, fontFamily: "var(--font-jakarta), sans-serif" }}>
          Whether it&apos;s a website that converts or a film that moves — we&apos;re ready when you are.
        </p>
        <button
          className="group"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.8rem",
            fontFamily: "var(--font-jakarta), sans-serif",
            fontSize: "0.8rem",
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#0a0a0c",
            background: "#f0ede8",
            border: "none",
            borderRadius: 40,
            padding: "1rem 2.8rem",
            cursor: "pointer",
            transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 50px -8px rgba(240,237,232,0.2)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
          }}
        >
          Get in Touch <span style={{ transition: "transform 0.3s" }}>→</span>
        </button>
      </div>
    </section>
  );
}
