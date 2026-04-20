"use client";

import { useEffect, useRef } from "react";

const ACCENT = "#6B7F62";

const projects = [
  {
    num: "01",
    cat: "Web Design",
    title: ["Meridian", "Studios"],
    titleAccent: 1,
    desc: "E-commerce platform with bespoke product configurator and immersive brand storytelling.",
    year: "2026",
    type: "web",
    reverse: false,
  },
  {
    num: "02",
    cat: "Videography",
    title: ["Onda", "Collective"],
    titleAccent: 1,
    desc: "Cinematic brand narrative — 60-second hero spot capturing the essence of coastal living.",
    year: "2025",
    type: "video",
    reverse: true,
  },
  {
    num: "03",
    cat: "Web Development",
    title: ["Noctis", "Finance"],
    titleAccent: 1,
    desc: "Full-stack fintech dashboard with real-time data visualization and secure architecture.",
    year: "2025",
    type: "web",
    reverse: false,
  },
  {
    num: "04",
    cat: "Video Editing",
    title: ["Forma", "Athletics"],
    titleAccent: 1,
    desc: "Product launch campaign — multi-format delivery across digital and broadcast channels.",
    year: "2026",
    type: "video",
    reverse: true,
  },
];

function ProjectRow({ proj, index }: { proj: typeof projects[0]; index: number }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!imgRef.current || !numRef.current || !titleRef.current) return;
      const center = window.scrollY + window.innerHeight / 2;

      const imgRect = imgRef.current.getBoundingClientRect();
      const imgCenter = window.scrollY + imgRect.top + imgRect.height / 2;
      const imgOffset = (imgCenter - center) * 0.12;
      imgRef.current.style.transform = `translateY(${-imgOffset}px)`;

      const numRect = numRef.current.getBoundingClientRect();
      const numCenter = window.scrollY + numRect.top + numRect.height / 2;
      const numOffset = (numCenter - center) * 0.15;
      numRef.current.style.transform = `translateY(${-numOffset}px)`;

      const titleRect = titleRef.current.getBoundingClientRect();
      const titleCenter = window.scrollY + titleRect.top + titleRect.height / 2;
      const titleOffset = (titleCenter - center) * 0.04;
      titleRef.current.style.transform = `translateY(${-titleOffset}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    row.style.opacity = "0";
    row.style.transform = "translateY(60px)";
    row.style.transition = "opacity 1s ease, transform 1s cubic-bezier(0.23,1,0.32,1)";
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            row.style.opacity = "1";
            row.style.transform = "translateY(0)";
            obs.unobserve(row);
          }
        });
      },
      { threshold: 0.15 }
    );
    obs.observe(row);
    return () => obs.disconnect();
  }, []);

  const isVideo = proj.type === "video";

  return (
    <div
      ref={rowRef}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "4rem",
        alignItems: "center",
        marginBottom: "14vh",
        direction: proj.reverse ? "rtl" : "ltr",
      }}
    >
      {/* Image */}
      <div
        ref={imgRef}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: isVideo ? "16/9" : "4/3",
          borderRadius: 16,
          overflow: "hidden",
          willChange: "transform",
          direction: "ltr",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: isVideo
              ? `repeating-linear-gradient(45deg, transparent, transparent 14px, rgba(107,127,98,0.05) 14px, rgba(107,127,98,0.05) 15px), rgba(255,255,255,0.03)`
              : `repeating-linear-gradient(-45deg, transparent, transparent 14px, rgba(107,127,98,0.04) 14px, rgba(107,127,98,0.04) 15px), rgba(255,255,255,0.03)`,
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16,
            display: "grid",
            placeItems: "center",
            backdropFilter: "blur(20px)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.15)" }}>
            {isVideo ? (
              <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            ) : (
              <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="14" rx="2" /><path d="M3 17h18" /></svg>
            )}
            <span>{isVideo ? "Video Project" : "Website Mockup"}</span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div style={{ position: "relative", padding: "2rem 0", direction: "ltr" }}>
        <div
          ref={numRef}
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontWeight: 100,
            fontSize: "clamp(5rem, 10vw, 9rem)",
            lineHeight: 1,
            color: "rgba(255,255,255,0.03)",
            position: "absolute",
            top: "-2rem",
            [proj.reverse ? "right" : "left"]: "-1rem",
            zIndex: 0,
            willChange: "transform",
          }}
        >
          {proj.num}
        </div>
        <p style={{ fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: ACCENT, marginBottom: "1.2rem", position: "relative", zIndex: 1, fontFamily: "var(--font-jakarta), sans-serif" }}>
          {proj.cat}
        </p>
        <h3
          ref={titleRef}
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "clamp(2.2rem, 4vw, 3.8rem)",
            fontWeight: 300,
            lineHeight: 1.1,
            color: "#f0ede8",
            position: "relative",
            zIndex: 1,
            willChange: "transform",
            marginLeft: proj.reverse ? 0 : "-4rem",
            marginRight: proj.reverse ? "-4rem" : 0,
            textAlign: proj.reverse ? "right" : "left",
          }}
        >
          {proj.title.map((line, li) => (
            <span key={li}>
              {li === proj.titleAccent ? <em style={{ fontStyle: "italic", color: ACCENT }}>{line}</em> : line}
              {li < proj.title.length - 1 && <br />}
            </span>
          ))}
        </h3>
        <p style={{
          fontSize: "0.85rem",
          fontWeight: 300,
          color: "rgba(240,237,232,0.45)",
          lineHeight: 1.7,
          marginTop: "1.5rem",
          maxWidth: 360,
          position: "relative",
          zIndex: 1,
          marginLeft: proj.reverse ? "auto" : undefined,
          textAlign: proj.reverse ? "right" : "left",
          fontFamily: "var(--font-jakarta), sans-serif",
        }}>
          {proj.desc}
        </p>
        <span style={{ display: "inline-block", fontFamily: "var(--font-inter), sans-serif", fontWeight: 200, fontSize: "0.75rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em", marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative", zIndex: 1 }}>
          {proj.year}
        </span>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  return (
    <section
      style={{
        position: "relative",
        padding: "16vh 8vw 12vh",
        background: "#0a0a0c",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "8rem", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "2rem" }}>
        <div>
          <p style={{ fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: ACCENT, marginBottom: "1rem", fontFamily: "var(--font-jakarta), sans-serif" }}>
            Selected Work
          </p>
          <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(2.5rem, 4vw, 4rem)", fontWeight: 300, color: "#f0ede8" }}>
            Projects
          </h2>
        </div>
        <span style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 100, fontSize: "0.85rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>
          04 Projects
        </span>
      </div>

      {projects.map((proj, i) => (
        <ProjectRow key={i} proj={proj} index={i} />
      ))}
    </section>
  );
}
