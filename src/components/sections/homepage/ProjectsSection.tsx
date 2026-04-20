"use client";

import ParallaxStackingProjects, {
  StackProject,
} from "@/components/sections/parallax-stacking-projects";

const projects: StackProject[] = [
  {
    id: "sivory",
    title: "Sivory",
    year: "2025",
    description:
      "Premium lifestyle brand — full digital identity, bespoke e-commerce experience, and product photography direction.",
    tags: ["Web Design", "E-commerce"],
    tech: ["Next.js", "Shopify"],
    image: "/Projects/sivory_macbook.png",
    href: "#",
    linkLabel: "View Project",
  },
  {
    id: "leanthia",
    title: "Leanthia Bakery",
    year: "2025",
    description:
      "Artisan bakery brand and online ordering platform — warm visual identity paired with seamless customer experience.",
    tags: ["Branding", "Web Design"],
    tech: ["Next.js", "Stripe"],
    image: "/Projects/LeanthiaBakery.png",
    href: "#",
    linkLabel: "View Project",
  },
  {
    id: "lossantos",
    title: "Los Santos Barbers",
    year: "2026",
    description:
      "Bold barbershop brand with booking integration — street-culture aesthetics translated into a sharp digital presence.",
    tags: ["Web Design", "Booking"],
    image: "/Projects/lossantosbarbers.png",
    href: "#",
    linkLabel: "View Project",
  },
  {
    id: "tdk",
    title: "TDK",
    year: "2026",
    description:
      "Corporate web platform with data-rich dashboards, advanced filtering, and a design system built for scale.",
    tags: ["Web Development", "UI/UX"],
    tech: ["React", "TypeScript"],
    image: "/Projects/tdk_macbook.png",
    href: "#",
    linkLabel: "View Project",
  },
  {
    id: "glmetalworks",
    title: "GL Metal Works",
    year: "2025",
    description:
      "Industrial brand identity and website — heavy-duty aesthetic meets clean digital craftsmanship.",
    tags: ["Branding", "Web Design"],
    image: "/Projects/glmetalworks.png",
    href: "#",
    linkLabel: "View Project",
  },
];

export default function ProjectsSection() {
  return (
    <section style={{ background: "#000000", position: "relative" }}>
      {/* Editorial title */}
      <div
        style={{
          padding: "clamp(4rem,10vw,10rem) clamp(1.5rem,8vw,8rem) clamp(2rem,4vw,4rem)",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-monument), sans-serif",
            fontWeight: 800,
            fontSize: "clamp(3rem,10vw,10rem)",
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
