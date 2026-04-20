"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ParallaxStackingProjects, {
  type StackProject,
} from "@/components/sections/parallax-stacking-projects";
import ArchiveLabel from "@/components/ui/ArchiveLabel";
import ScrollReveal from "@/components/ui/ScrollReveal";

const PROJECTS: StackProject[] = [
  {
    id: "glmetalworks",
    title: "GL Metal Works",
    year: "2024",
    description:
      "A sales-focused marketing site for a Cyprus-based industrial fabricator. Repositioned the brand from contractor to specialist.",
    tags: ["Marketing Site", "Industrial", "Brand"],
    tech: ["Next.js", "Framer Motion", "Sanity"],
    image: "/Projects/glmetalworks.png",
    href: "https://glmetalworks.com",
    linkLabel: "Visit Site",
  },
  {
    id: "lossantosbarbers",
    title: "Los Santos Barbers",
    year: "2024",
    description:
      "A barbershop site with a voice — one that sounds like the room, not a template. Booking flow tuned for mobile-first walk-ins.",
    tags: ["Marketing Site", "Hospitality", "Motion"],
    tech: ["Next.js", "GSAP"],
    image: "/Projects/lossantosbarbers.png",
    href: "https://lossantosbarbers.com",
    linkLabel: "Visit Site",
  },
  {
    id: "velricon",
    title: "Velricon",
    year: "2024",
    description:
      "A product launch page that had to carry the weight of a new category. Built around a single scroll narrative.",
    tags: ["Product", "Launch", "Narrative"],
    tech: ["Next.js", "Three.js"],
    image: "/Projects/velricon.png",
    href: "https://velricon.com",
    linkLabel: "Visit Site",
  },
  {
    id: "sivory",
    title: "Sivory",
    year: "2024",
    description:
      "Hospitality brand refresh translated into a site that guides guests the way the property does — confidently, quietly.",
    tags: ["Hospitality", "Brand", "Bookings"],
    tech: ["Next.js", "CMS"],
    image: "/Projects/sivory_macbook.png",
    href: "#",
    linkLabel: "Visit Site",
  },
  {
    id: "tdk",
    title: "TDK",
    year: "2024",
    description:
      "A technical brand site that treats engineering detail as the story, not the footnote.",
    tags: ["Technical", "Brand", "Catalog"],
    tech: ["Next.js", "Headless CMS"],
    image: "/Projects/tdk_macbook.png",
    href: "#",
    linkLabel: "Visit Site",
  },
  {
    id: "apt",
    title: "APT",
    year: "2024",
    description:
      "A real-estate destination for a development group that needed to feel more like a magazine than a listings page.",
    tags: ["Real Estate", "Editorial", "Lead-Gen"],
    tech: ["Next.js", "MDX"],
    image: "/Projects/apt_macbook.png",
    href: "#",
    linkLabel: "Visit Site",
  },
];

function ProjectsIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{
        background: "var(--color-black)",
        paddingTop: "20vh",
        paddingBottom: "16vh",
      }}
    >
      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        <motion.div style={{ y, opacity }}>
          <ArchiveLabel ref="05 / SELECTED WORK" />
          <ScrollReveal>
            <h2
              className="mt-8 leading-[0.92] max-w-[18ch]"
              style={{
                fontFamily: "var(--font-display-serif), serif",
                fontWeight: 200,
                fontSize: "clamp(48px, 7vw, 112px)",
                letterSpacing: "-0.028em",
                color: "var(--color-text-primary-dark)",
              }}
            >
              The work that proves <span style={{ color: "var(--color-green-neon)", fontStyle: "italic", fontWeight: 300 }}>it.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal>
            <p
              className="mt-8 max-w-lg text-sm md:text-base leading-relaxed"
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontWeight: 300,
                color: "var(--color-text-muted-dark)",
              }}
            >
              Six pieces. Each built for a different audience, but all passing
              through the same studio — and the same standard.
            </p>
          </ScrollReveal>
        </motion.div>
      </div>
    </section>
  );
}

export default function BeatProjects() {
  return (
    <>
      <ProjectsIntro />
      <ParallaxStackingProjects projects={PROJECTS} />
    </>
  );
}
