"use client";

import { useEffect, useRef } from "react";

const ACCENT = "#6B7F62";

function ElCard({ children, title }: { children: React.ReactNode; title: string }) {
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
    <div ref={ref} style={{ minHeight: "50vh", borderRadius: 24, position: "relative" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 24,
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          padding: "3rem 2rem 2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          transition: "all 0.5s cubic-bezier(0.23,1,0.32,1)",
        }}
      >
        {/* Sheen */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 24, background: "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, transparent 40%)", pointerEvents: "none" }} />
        {children}
        <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.6rem", fontWeight: 300, color: "#f0ede8", marginTop: "1.5rem", letterSpacing: "0.02em" }}>
          {title}
        </h3>
      </div>
    </div>
  );
}

export default function KeyElements() {
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
          What Sets Us Apart
        </p>
        <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(2.5rem, 4vw, 4rem)", fontWeight: 300, color: "#f0ede8" }}>
          Key Elements
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* Laptop Card */}
        <ElCard title="Web Development">
          <svg viewBox="0 0 600 500" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 480, height: "auto", flexGrow: 1 }}>
            <rect x="140" y="120" width="320" height="210" rx="12" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="rgba(255,255,255,0.03)" />
            <rect x="155" y="135" width="290" height="180" rx="4" stroke={`${ACCENT}4d`} strokeWidth="0.8" fill={`${ACCENT}0a`} />
            <line x1="175" y1="165" x2="260" y2="165" stroke={`${ACCENT}40`} strokeWidth="2" strokeLinecap="round" />
            <line x1="175" y1="180" x2="310" y2="180" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeLinecap="round" />
            <line x1="190" y1="195" x2="280" y2="195" stroke="rgba(255,255,255,0.06)" strokeWidth="2" strokeLinecap="round" />
            <line x1="190" y1="210" x2="340" y2="210" stroke={`${ACCENT}26`} strokeWidth="2" strokeLinecap="round" />
            <line x1="175" y1="235" x2="250" y2="235" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeLinecap="round" />
            <line x1="175" y1="250" x2="320" y2="250" stroke="rgba(255,255,255,0.06)" strokeWidth="2" strokeLinecap="round" />
            <line x1="190" y1="265" x2="270" y2="265" stroke={`${ACCENT}33`} strokeWidth="2" strokeLinecap="round" />
            <line x1="175" y1="285" x2="230" y2="285" stroke="rgba(255,255,255,0.06)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="300" cy="128" r="2" fill="rgba(255,255,255,0.15)" />
            <path d="M100 330 L500 330 L480 355 Q460 365 300 365 Q140 365 120 355 Z" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="rgba(255,255,255,0.02)" />
            <rect x="260" y="338" width="80" height="8" rx="4" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" fill="none" />
            {/* Annotations */}
            <path d="M155 170 L110 170 L100 160 L80 160" stroke={`${ACCENT}80`} strokeWidth="1" fill="none" />
            <circle cx="155" cy="170" r="3" fill={`${ACCENT}99`} />
            <path d="M445 225 L475 225 L485 215 L530 215" stroke={`${ACCENT}80`} strokeWidth="1" fill="none" />
            <circle cx="445" cy="225" r="3" fill={`${ACCENT}99`} />
            <path d="M300 120 L300 85 L310 75 L340 75" stroke={`${ACCENT}80`} strokeWidth="1" fill="none" />
            <circle cx="300" cy="120" r="3" fill={`${ACCENT}99`} />
            <path d="M300 365 L300 400 L310 410 L350 410" stroke={`${ACCENT}80`} strokeWidth="1" fill="none" />
            <circle cx="300" cy="365" r="3" fill={`${ACCENT}99`} />
            <path d="M140 260 L100 260 L90 270 L50 270" stroke={`${ACCENT}80`} strokeWidth="1" fill="none" />
            <circle cx="140" cy="260" r="3" fill={`${ACCENT}99`} />
            <path d="M460 160 L490 160 L500 150 L540 150" stroke={`${ACCENT}80`} strokeWidth="1" fill="none" />
            <circle cx="460" cy="160" r="3" fill={`${ACCENT}99`} />
            {/* Labels */}
            <text x="78" y="164" textAnchor="end" fill="rgba(240,237,232,0.7)" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="11" fontWeight="400" letterSpacing="0.05em">Clean Code</text>
            <text x="532" y="219" fill="rgba(240,237,232,0.7)" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="11" fontWeight="400" letterSpacing="0.05em">Responsive UI</text>
            <text x="342" y="79" fill="rgba(240,237,232,0.7)" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="11" fontWeight="400" letterSpacing="0.05em">Retina Display</text>
            <text x="352" y="414" fill="rgba(240,237,232,0.7)" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="11" fontWeight="400" letterSpacing="0.05em">Secure Backend</text>
            <text x="48" y="274" textAnchor="end" fill="rgba(240,237,232,0.7)" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="11" fontWeight="400" letterSpacing="0.05em">Fast Loading</text>
            <text x="542" y="154" fill="rgba(240,237,232,0.7)" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="11" fontWeight="400" letterSpacing="0.05em">SEO Optimized</text>
          </svg>
        </ElCard>

        {/* Camera Card */}
        <ElCard title="Videography">
          <svg viewBox="0 0 600 500" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 480, height: "auto", flexGrow: 1 }}>
            <rect x="160" y="170" width="280" height="180" rx="14" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="rgba(255,255,255,0.03)" />
            <circle cx="300" cy="260" r="65" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="rgba(255,255,255,0.02)" />
            <circle cx="300" cy="260" r="48" stroke={`${ACCENT}59`} strokeWidth="1" fill={`${ACCENT}0a`} />
            <circle cx="300" cy="260" r="28" stroke={`${ACCENT}40`} strokeWidth="0.8" fill={`${ACCENT}0f`} />
            <circle cx="300" cy="260" r="10" fill={`${ACCENT}26`} />
            <rect x="280" y="150" width="80" height="20" rx="4" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="rgba(255,255,255,0.02)" />
            <rect x="340" y="153" width="16" height="14" rx="3" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" fill="rgba(255,255,255,0.03)" />
            <rect x="220" y="148" width="50" height="6" rx="1" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" fill="none" />
            <rect x="160" y="175" width="28" height="100" rx="4" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" fill="rgba(255,255,255,0.02)" />
            <line x1="168" y1="190" x2="168" y2="260" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1="175" y1="190" x2="175" y2="260" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            <circle cx="200" cy="165" r="8" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="rgba(255,255,255,0.03)" />
            <rect x="410" y="162" width="24" height="12" rx="3" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" fill="rgba(255,255,255,0.02)" />
            <rect x="200" y="355" width="200" height="10" rx="3" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" fill="rgba(255,255,255,0.02)" />
            {/* Annotations */}
            <path d="M235 260 L190 260 L180 250 L130 250" stroke={`${ACCENT}80`} strokeWidth="1" fill="none" />
            <circle cx="235" cy="260" r="3" fill={`${ACCENT}99`} />
            <path d="M360 155 L400 155 L410 145 L460 145" stroke={`${ACCENT}80`} strokeWidth="1" fill="none" />
            <circle cx="360" cy="155" r="3" fill={`${ACCENT}99`} />
            <path d="M200 157 L200 120 L210 110 L260 110" stroke={`${ACCENT}80`} strokeWidth="1" fill="none" />
            <circle cx="200" cy="157" r="3" fill={`${ACCENT}99`} />
            <path d="M300 213 L300 100 L310 90 L360 90" stroke={`${ACCENT}80`} strokeWidth="1" fill="none" />
            <circle cx="300" cy="213" r="3" fill={`${ACCENT}99`} />
            <path d="M440 260 L480 260 L490 270 L540 270" stroke={`${ACCENT}80`} strokeWidth="1" fill="none" />
            <circle cx="440" cy="260" r="3" fill={`${ACCENT}99`} />
            <path d="M300 350 L300 395 L310 405 L370 405" stroke={`${ACCENT}80`} strokeWidth="1" fill="none" />
            <circle cx="300" cy="350" r="3" fill={`${ACCENT}99`} />
            {/* Labels */}
            <text x="128" y="254" textAnchor="end" fill="rgba(240,237,232,0.7)" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="11" fontWeight="400" letterSpacing="0.05em">Cinema Lens</text>
            <text x="462" y="149" fill="rgba(240,237,232,0.7)" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="11" fontWeight="400" letterSpacing="0.05em">4K Viewfinder</text>
            <text x="262" y="114" fill="rgba(240,237,232,0.7)" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="11" fontWeight="400" letterSpacing="0.05em">Precision Shutter</text>
            <text x="362" y="94" fill="rgba(240,237,232,0.7)" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="11" fontWeight="400" letterSpacing="0.05em">Full Frame</text>
            <text x="542" y="274" fill="rgba(240,237,232,0.7)" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="11" fontWeight="400" letterSpacing="0.05em">Image Stability</text>
            <text x="372" y="409" fill="rgba(240,237,232,0.7)" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="11" fontWeight="400" letterSpacing="0.05em">Color Science</text>
          </svg>
        </ElCard>
      </div>
    </section>
  );
}
