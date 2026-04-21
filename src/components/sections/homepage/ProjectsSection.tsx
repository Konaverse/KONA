"use client";

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
  return (
    <section style={{ background: "#000" }}>
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
            color: "#ffffff",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Selected
          <br />
          <span style={{ color: "rgba(255,255,255,0.15)" }}>Work</span>
        </h2>
      </div>

      <ParallaxStackingProjects projects={projects} />
    </section>
  );
}
