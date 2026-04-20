"use client";

import { motion } from "framer-motion";
import ArchiveLabel from "@/components/ui/ArchiveLabel";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { EASE_OUT_EXPO } from "@/lib/motion";


type Archetype = {
  id: string;
  title: string;
  descriptor: string;
  note: string;
};

const ARCHETYPES: Archetype[] = [
  {
    id: "builders",
    title: "Builders",
    descriptor:
      "Founders and operators with real work to sell. You don't need a website; you need a room that convinces.",
    note: "03_01",
  },
  {
    id: "brands",
    title: "Brands",
    descriptor:
      "Labels with a point of view that has outgrown the asset library they started with. Time to consolidate.",
    note: "03_02",
  },
  {
    id: "visionaries",
    title: "Visionaries",
    descriptor:
      "Leaders who see the whole board. We translate the long view into something a first-time visitor can feel.",
    note: "03_03",
  },
];

function ArchetypeCard({ archetype, index }: { archetype: Archetype; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: index * 0.12 }}
      className="group relative flex flex-col p-8 md:p-10"
      style={{
        border: "1px solid var(--color-border-dark)",
        borderRadius: "var(--radius-card)",
        background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%)",
      }}
    >
      {/* Corner bracket decorators — light up green on hover */}
      <span className="absolute left-0 top-0 block h-4 w-4 border-l border-t border-transparent transition-colors duration-500 group-hover:border-[rgba(0,255,136,0.5)]" aria-hidden />
      <span className="absolute right-0 top-0 block h-4 w-4 border-r border-t border-transparent transition-colors duration-500 group-hover:border-[rgba(0,255,136,0.5)]" aria-hidden />
      <span className="absolute bottom-0 left-0 block h-4 w-4 border-b border-l border-transparent transition-colors duration-500 group-hover:border-[rgba(0,255,136,0.5)]" aria-hidden />
      <span className="absolute bottom-0 right-0 block h-4 w-4 border-b border-r border-transparent transition-colors duration-500 group-hover:border-[rgba(0,255,136,0.5)]" aria-hidden />

      {/* Subtle hover glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          borderRadius: "var(--radius-card)",
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0,255,136,0.07) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      {/* Reference number */}
      <span
        className="mb-10 block text-[10px] tracking-[0.32em] uppercase"
        style={{
          fontFamily: "var(--font-geist-mono), monospace",
          color: "var(--color-text-muted-dark)",
        }}
      >
        {archetype.note}
      </span>

      {/* Title */}
      <h3
        className="leading-[0.95]"
        style={{
          fontFamily: "var(--font-display-serif), serif",
          fontWeight: 200,
          fontSize: "clamp(42px, 4.5vw, 72px)",
          letterSpacing: "-0.025em",
          color: "var(--color-text-primary-dark)",
        }}
      >
        {archetype.title}
      </h3>

      {/* Neon divider */}
      <div
        className="my-6 h-px w-10 transition-all duration-500 group-hover:w-16"
        style={{ background: "var(--color-green-neon)", opacity: 0.5 }}
        aria-hidden
      />

      {/* Descriptor */}
      <p
        className="text-sm leading-relaxed"
        style={{
          fontFamily: "var(--font-geist-sans), sans-serif",
          fontWeight: 300,
          color: "var(--color-text-muted-dark)",
        }}
      >
        {archetype.descriptor}
      </p>

    </motion.article>
  );
}

export default function BeatArchetypes() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background: "var(--color-black)",
        paddingTop: "14vh",
        paddingBottom: "14vh",
      }}
    >
      <div className="relative z-[2] mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-24">
          <div>
            <ArchiveLabel ref="03 / WHO" />
            <ScrollReveal>
              <h2
                className="mt-6 leading-[0.95]"
                style={{
                  fontFamily: "var(--font-display-serif), serif",
                  fontWeight: 200,
                  fontSize: "clamp(40px, 5.6vw, 92px)",
                  letterSpacing: "-0.025em",
                  color: "var(--color-text-primary-dark)",
                }}
              >
                Who we&rsquo;re for.
              </h2>
            </ScrollReveal>
          </div>
          <ScrollReveal>
            <p
              className="max-w-md text-sm md:text-base leading-relaxed"
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontWeight: 300,
                color: "var(--color-text-muted-dark)",
              }}
            >
              We take on three kinds of work. If you see yourself in one of these,
              we&rsquo;re already halfway into the brief.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {ARCHETYPES.map((a, i) => (
            <ArchetypeCard key={a.id} archetype={a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
