"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ArchiveLabel from "@/components/ui/ArchiveLabel";
import Button from "@/components/ui/Button";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function BeatCTA() {
  const rootRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start end", "end start"],
  });

  // Enters from below, parks at natural position and stays there
  const architectY = useTransform(scrollYProgress, [0, 0.45, 1], ["22%", "0%", "0%"]);
  const architectOpacity = useTransform(scrollYProgress, [0, 0.35], [0, 1]);

  return (
    <section
      ref={rootRef}
      className="relative w-full overflow-hidden"
      style={{
        background: "var(--color-black)",
        minHeight: "100svh",
        paddingTop: "16vh",
        paddingBottom: "12vh",
      }}
    >
      <svg className="absolute inset-0 h-full w-full opacity-[0.025] pointer-events-none">
        <defs>
          <pattern id="cta-grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cta-grid)" />
      </svg>

      {/* Top hairline */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.18) 30%, rgba(0,255,136,0.18) 70%, transparent 100%)",
        }}
      />

      {/* Architect — full-section background, parallax entry */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ y: architectY, opacity: architectOpacity }}
      >
        {/* Idle float wrapping the image */}
        <motion.div
          className="absolute inset-0"
          animate={{ y: [0, -14, 0, 14, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/General/architect-no-bg.png"
            alt=""
            fill
            className="object-contain object-right-bottom select-none [transform:scaleX(-1)]"
            draggable={false}
            sizes="100vw"
            priority
          />
        </motion.div>
      </motion.div>

      {/* Gradient: solid left (text readable) → transparent right (architect shows) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, var(--color-black) 32%, rgba(10,10,10,0.82) 50%, rgba(10,10,10,0.35) 72%, transparent 100%)",
        }}
      />

      <div className="relative z-[2] mx-auto grid max-w-[1600px] grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 px-5 md:px-10 items-center min-h-[80svh]">
        {/* Text content — left half only; right half lets architect breathe */}
        <div className="md:col-span-6">
          <ArchiveLabel ref="07 / CONTACT" />

          <ScrollReveal>
            <h2
              className="mt-8 leading-[0.92]"
              style={{
                fontFamily: "var(--font-display-serif), serif",
                fontWeight: 200,
                fontSize: "clamp(44px, 7vw, 128px)",
                letterSpacing: "-0.028em",
                color: "var(--color-text-primary-dark)",
              }}
            >
              If you&rsquo;re still
              <br />
              reading,
              <br />
              <span style={{ color: "var(--color-green-neon)", fontStyle: "italic", fontWeight: 300 }}>
                we&rsquo;re listening.
              </span>
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
              Tell us what you&rsquo;re trying to put into the world. We&rsquo;ll
              tell you honestly whether we&rsquo;re the studio to build it — and
              if we are, what it looks like to work with us.
            </p>
          </ScrollReveal>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="mt-12 flex flex-col sm:flex-row sm:items-center gap-6"
          >
            <Button href="/contact" variant="primary" tone="dark">
              Start a Project
            </Button>
            <Button href="mailto:info@kona-verse.com" variant="secondary" tone="dark" external>
              info@kona-verse.com
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Bottom meta band */}
      <div
        className="relative z-[2] mt-16 md:mt-24 mx-auto max-w-[1600px] px-5 md:px-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        style={{
          borderTop: "1px solid var(--color-border-dark)",
          paddingTop: "1.5rem",
        }}
      >
        <span
          className="text-[10px] tracking-[0.3em] uppercase"
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            color: "var(--color-text-muted-dark)",
          }}
        >
          Konaverse · Cyprus · © {new Date().getFullYear()}
        </span>
        <span
          className="text-[10px] tracking-[0.3em] uppercase"
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            color: "var(--color-text-muted-dark)",
          }}
        >
          Two operators · One studio
        </span>
      </div>
    </section>
  );
}
