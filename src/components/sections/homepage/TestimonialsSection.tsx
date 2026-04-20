"use client";

import { useEffect, useRef } from "react";

const ACCENT = "#6B7F62";

const testimonials = [
  {
    quote: "Konaverse transformed our digital presence entirely. The attention to detail in both design and development was unlike anything we'd experienced.",
    name: "Amara Laurent",
    role: "CEO, Meridian Studios",
    initials: "AL",
  },
  {
    quote: "The brand film they produced captured exactly what we couldn't put into words. Cinematic quality that elevated our entire brand perception.",
    name: "Jonas Reyes",
    role: "Founder, Onda Collective",
    initials: "JR",
  },
  {
    quote: "From concept to launch in six weeks — and the result was a platform that our users genuinely love using. Performance scores through the roof.",
    name: "Sofia Kim",
    role: "CTO, Noctis Finance",
    initials: "SK",
  },
];

function TCard({ t }: { t: typeof testimonials[0] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
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
    <div
      ref={ref}
      className="group"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 20,
        padding: "2.5rem 2rem",
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.5s cubic-bezier(0.23,1,0.32,1)",
        cursor: "default",
      }}
    >
      <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, transparent 40%)", pointerEvents: "none" }} />
      <div style={{ color: ACCENT, fontSize: "0.9rem", letterSpacing: "0.15em", marginBottom: "1.5rem" }}>★ ★ ★ ★ ★</div>
      <p style={{ fontSize: "0.88rem", fontWeight: 300, color: "rgba(240,237,232,0.45)", lineHeight: 1.75, marginBottom: "2rem", fontStyle: "italic", fontFamily: "var(--font-jakarta), sans-serif" }}>
        &ldquo;{t.quote}&rdquo;
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(107,127,98,0.15)", border: "1px solid rgba(107,127,98,0.2)", display: "grid", placeItems: "center", fontFamily: "var(--font-inter), sans-serif", fontWeight: 200, fontSize: "0.8rem", color: ACCENT }}>
          {t.initials}
        </div>
        <div>
          <div style={{ fontSize: "0.8rem", fontWeight: 500, color: "#f0ede8", fontFamily: "var(--font-jakarta), sans-serif" }}>{t.name}</div>
          <div style={{ fontSize: "0.65rem", color: "rgba(240,237,232,0.45)", marginTop: "0.2rem", letterSpacing: "0.05em", fontFamily: "var(--font-jakarta), sans-serif" }}>{t.role}</div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section
      style={{
        position: "relative",
        padding: "14vh 8vw 12vh",
        background: "#0a0a0c",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "5rem" }}>
        <p style={{ fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: ACCENT, marginBottom: "1rem", fontFamily: "var(--font-jakarta), sans-serif" }}>
          Client Voices
        </p>
        <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(2.5rem, 4vw, 4rem)", fontWeight: 300, color: "#f0ede8" }}>
          What They Say
        </h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
        {testimonials.map((t, i) => <TCard key={i} t={t} />)}
      </div>
    </section>
  );
}
