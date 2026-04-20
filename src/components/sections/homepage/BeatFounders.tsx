"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import ArchiveLabel from "@/components/ui/ArchiveLabel";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { EASE_OUT_EXPO } from "@/lib/motion";

type Founder = {
  name: string;
  role: string;
  image: string;
  bio: string;
  ref: string;
};

const FOUNDERS: Founder[] = [
  {
    name: "Konstantinos",
    role: "Strategy · Engineering",
    image: "/About/konstantinos.jpg",
    bio: "Leads every build. Writes the code, runs the engagement, sits across from the client. Refuses handoffs.",
    ref: "06_01",
  },
  {
    name: "Nabil",
    role: "Direction · Craft",
    image: "/About/nabil.jpg",
    bio: "Owns the look. Films, designs, frames every deliverable. The one who decides when it's finished.",
    ref: "06_02",
  },
];

type Stat = {
  value: string;
  label: string;
};

const STATS: Stat[] = [
  { value: "02", label: "Operators" },
  { value: "24+", label: "Projects shipped" },
  { value: "100%", label: "Built in-house" },
  { value: "CY", label: "Based in Cyprus" },
];

function FounderCard({
  founder,
  index,
  progress,
}: {
  founder: Founder;
  index: number;
  progress: MotionValue<number>;
}) {
  const y = useTransform(progress, [0, 1], index === 0 ? ["0%", "-8%"] : ["0%", "-4%"]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.0, ease: EASE_OUT_EXPO, delay: index * 0.15 }}
      className="group flex flex-col"
      style={{ willChange: "transform" }}
    >
      <motion.div
        style={{ y }}
        className="relative overflow-hidden"
      >
        <div
          className="relative"
          style={{
            aspectRatio: "3 / 4",
            borderRadius: "var(--radius-card)",
            border: "1px solid var(--color-border-dark)",
            overflow: "hidden",
          }}
        >
          <Image
            src={founder.image}
            alt={founder.name}
            fill
            className="object-cover grayscale transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grayscale-0"
            sizes="(min-width: 768px) 45vw, 90vw"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.75) 100%)",
            }}
          />
          <div className="absolute top-5 left-5">
            <span
              className="text-[10px] tracking-[0.32em] uppercase"
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              {founder.ref}
            </span>
          </div>
          <div className="absolute bottom-5 left-5 right-5">
            <div
              className="h-px w-10 mb-3"
              style={{ background: "var(--color-green-neon)", opacity: 0.7 }}
            />
            <h3
              className="leading-[1.0]"
              style={{
                fontFamily: "var(--font-display-serif), serif",
                fontWeight: 300,
                fontSize: "clamp(34px, 3.2vw, 52px)",
                letterSpacing: "-0.02em",
                color: "var(--color-text-primary-dark)",
              }}
            >
              {founder.name}
            </h3>
            <span
              className="mt-1 block text-[10px] tracking-[0.3em] uppercase"
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                color: "rgba(255,255,255,0.55)",
              }}
            >
              {founder.role}
            </span>
          </div>
        </div>
      </motion.div>

      <p
        className="mt-5 max-w-sm text-sm leading-relaxed"
        style={{
          fontFamily: "var(--font-geist-sans), sans-serif",
          fontWeight: 300,
          color: "var(--color-text-muted-dark)",
        }}
      >
        {founder.bio}
      </p>
    </motion.div>
  );
}

export default function BeatFounders() {
  const rootRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={rootRef}
      className="relative w-full overflow-hidden"
      style={{
        background: "var(--color-black)",
        paddingTop: "16vh",
        paddingBottom: "16vh",
      }}
    >
      <div className="relative z-[2] mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-start">
          {/* Left column: heading */}
          <div className="md:col-span-5">
            <ArchiveLabel ref="06 / STUDIO" />
            <ScrollReveal>
              <h2
                className="mt-8 leading-[0.92]"
                style={{
                  fontFamily: "var(--font-display-serif), serif",
                  fontWeight: 200,
                  fontSize: "clamp(44px, 6vw, 98px)",
                  letterSpacing: "-0.025em",
                  color: "var(--color-text-primary-dark)",
                }}
              >
                Two people.
                <br />
                <span style={{ color: "var(--color-green-neon)", fontStyle: "italic", fontWeight: 300 }}>
                  One standard.
                </span>
              </h2>
            </ScrollReveal>
            <ScrollReveal>
              <p
                className="mt-8 max-w-md text-sm md:text-base leading-relaxed"
                style={{
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  fontWeight: 300,
                  color: "var(--color-text-muted-dark)",
                }}
              >
                You&rsquo;ll never be briefed by an account manager you won&rsquo;t
                see again. You&rsquo;ll work directly with the two people building
                the thing — from the first call to the final push.
              </p>
            </ScrollReveal>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 gap-6">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.1 + i * 0.08 }}
                  className="border-t"
                  style={{ borderColor: "var(--color-border-dark)", paddingTop: "0.75rem" }}
                >
                  <span
                    className="block"
                    style={{
                      fontFamily: "var(--font-monument), sans-serif",
                      fontWeight: 700,
                      fontSize: "clamp(28px, 3vw, 44px)",
                      lineHeight: 1,
                      color: "var(--color-text-primary-dark)",
                    }}
                  >
                    {s.value}
                  </span>
                  <span
                    className="mt-2 block text-[10px] tracking-[0.3em] uppercase"
                    style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      color: "var(--color-text-muted-dark)",
                    }}
                  >
                    {s.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right column: founders */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {FOUNDERS.map((f, i) => (
              <FounderCard key={f.name} founder={f} index={i} progress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
