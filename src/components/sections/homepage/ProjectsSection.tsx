"use client";

import { useEffect, useRef, useState } from "react";
import ParallaxStackingProjects from "@/components/sections/parallax-stacking-projects";

const projects = [
  {
    id: "glmetalworks",
    year: "2024",
    title: "GL Metal Works",
    href: "https://glmetalworks.com",
    image: "/Projects/glmetalworks.png",
    tags: ["Web Design", "Branding"],
  },
  {
    id: "tdk",
    year: "2024",
    title: "TDK Design & Build",
    href: "https://tdkdb.com/",
    image: "/Projects/tdk_macbook.png",
    tags: ["Web Development"],
  },
  {
    id: "lossantos",
    year: "2024",
    title: "Los Santos Barbers",
    href: "https://lossantosbarbers.com",
    image: "/Projects/lossantosbarbers.png",
    tags: ["Web Design"],
  },
  {
    id: "sivory",
    year: "2024",
    title: "Sivory Design",
    href: "https://sivorydesigns.com/",
    image: "/Projects/sivory_macbook.png",
    tags: ["E-commerce", "Web Design"],
  },
];

export default function ProjectsSection() {
  const ref = useRef<HTMLElement>(null);

  // Pin the section's LAST 100vh (negative-top sticky) so the Interlude can
  // tilt and scroll over the held final project frame — same mechanic as About.
  const [stickyTop, setStickyTop] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () =>
      setStickyTop(Math.min(0, window.innerHeight - el.offsetHeight));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section
      ref={ref}
      style={{ position: "sticky", top: stickyTop, zIndex: 40, background: "#f4f3ee" }}
    >
      {/* Editorial title */}
      <div
        style={{
          padding: "clamp(4rem, 10vw, 10rem) clamp(1.5rem, 8vw, 8rem) clamp(2rem, 4vw, 4rem)",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-monument), sans-serif",
            fontWeight: 800,
            fontSize: "clamp(3rem, 10vw, 10rem)",
            lineHeight: 0.9,
            letterSpacing: "-0.02em",
            color: "#161616",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Selected
          <br />
          <span style={{ color: "rgba(22,22,22,0.18)" }}>Work</span>
        </h2>
      </div>

      <ParallaxStackingProjects projects={projects} theme="light" />
    </section>
  );
}
