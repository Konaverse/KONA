"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import TransitionLink from "@/components/layout/TransitionLink";

const EASE = [0.22, 1, 0.36, 1] as const;
const WORDMARK = "KONAVERSE".split("");
const YEAR = new Date().getFullYear();

const STUDIO = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

const LEGAL = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
];

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/konaverse.cy/" },
  { label: "Facebook", href: "https://www.facebook.com/konaverse" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/konaverse" },
];

/* ── shared entrance variants ─────────────────────────────── */
function useVariants() {
  const reduce = useReducedMotion();
  const item: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 26, filter: "blur(8px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: EASE } },
  };
  const group: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };
  return { item, group, reduce };
}

/* ── one navigation column ────────────────────────────────── */
function NavCol({
  heading,
  links,
  accent = false,
  item,
}: {
  heading: string;
  links: { label: string; href: string }[];
  accent?: boolean;
  item: Variants;
}) {
  return (
    <motion.div variants={item} className="flex flex-col gap-5">
      <h4 className="flex items-center gap-2 font-sans text-[10px] tracking-[0.24em] uppercase text-white/35">
        {heading}
      </h4>
      <ul className="flex flex-col gap-3">
        {links.map((link) => {
          const external = link.href.startsWith("http");
          const inner = (
            <span className="footer-link group/fl">
              <span className="footer-link-label">{link.label}</span>
              {external && (
                <svg
                  className="footer-link-arrow"
                  width="11"
                  height="11"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden
                >
                  <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              <span className={`footer-link-underline${accent ? " accent" : ""}`} />
            </span>
          );
          return (
            <li key={link.label}>
              {external ? (
                <a href={link.href} target="_blank" rel="noopener noreferrer" data-cursor="link">
                  {inner}
                </a>
              ) : (
                <TransitionLink href={link.href} data-cursor="link">
                  {inner}
                </TransitionLink>
              )}
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}

export default function FooterSection() {
  const { item, group, reduce } = useVariants();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [12, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.96, 1]);

  const letter: Variants = {
    hidden: reduce ? { opacity: 0 } : { y: "110%" },
    show: (i: number) => ({
      y: "0%",
      opacity: 1,
      transition: { duration: 1.1, ease: EASE, delay: i * 0.06 },
    }),
  };

  return (
    <motion.footer
      ref={ref}
      style={{
        rotateX,
        scale,
        transformPerspective: 1400,
        transformOrigin: "50% 0%",
        willChange: "transform",
        zIndex: 70, // Over CTASection which is 60
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        boxShadow: "0 -40px 120px -45px rgba(0,0,0,0.7)",
        backgroundColor: "#0a0a0a", // Background for tilt over opaque
      }}
      className="footer-root relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* ── background ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* ambient sage glows */}
        <div className="absolute -bottom-[18%] -left-[8%] h-[55vw] w-[55vw] rounded-full bg-[var(--color-sage)]/[0.13] blur-[150px]" />
        <div className="absolute -top-[12%] right-[-6%] h-[40vw] w-[40vw] rounded-full bg-[var(--color-sage)]/[0.07] blur-[130px]" />
        {/* center radial wash */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(107,127,98,0.05)_0%,transparent_65%)]" />

        {/* top hairline */}
        <div className="absolute top-0 left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,rgba(107,127,98,0.4)_30%,rgba(107,127,98,0.4)_70%,transparent)]" />
      </div>

      {/* ── content ── */}
      <div className="container-padding relative z-10 flex w-full flex-col pt-20 md:pt-28">
        {/* tagline + cta */}
        <motion.div
          variants={group}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12"
        >
          <motion.h2
            variants={item}
            className="lg:col-span-7"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 300,
              fontSize: "clamp(2.2rem, 5.2vw, 4.6rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              color: "var(--color-ink)",
              margin: 0,
            }}
          >
            Let&rsquo;s build something
            <br />
            <span
              style={{
                backgroundImage: "linear-gradient(120deg, var(--color-accent-from), var(--color-accent-to))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                fontWeight: 500,
              }}
            >
              worth remembering.
            </span>
          </motion.h2>

          <motion.div variants={item} className="flex flex-col items-start gap-7 lg:col-span-5 lg:pt-3">
            <p className="max-w-sm font-sans text-sm font-light leading-relaxed text-white/55">
              A web development studio crafting fast, refined, future-facing digital
              products for brands that refuse the ordinary.
            </p>
            <Button href="/contact" variant="primary">
              Start a project
            </Button>
          </motion.div>
        </motion.div>

        {/* email band */}
        <motion.div
          variants={group}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="mt-16 flex flex-col gap-4 border-t border-white/[0.08] pt-10 md:mt-20 md:pt-12"
        >
          <motion.a
            variants={item}
            href="mailto:info@kona-verse.com"
            data-cursor="link"
            className="footer-email group/em w-max"
          >
            <span className="footer-email-label">info@kona-verse.com</span>
            <span className="footer-email-underline" />
          </motion.a>
        </motion.div>

        {/* nav grid */}
        <motion.div
          variants={group}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-16 grid grid-cols-2 gap-y-12 gap-x-8 border-t border-white/[0.08] pt-12 sm:grid-cols-2 md:mt-20 lg:grid-cols-12 lg:gap-x-10"
        >
          {/* brand */}
          <motion.div variants={item} className="col-span-2 flex flex-col gap-5 lg:col-span-4">
            <div className="relative h-14 w-40">
              <Image src="/About/Logo 21.png" alt="Konaverse" fill className="object-contain object-left opacity-95" />
            </div>
            <p className="max-w-xs font-sans text-xs font-light leading-relaxed text-white/40">
              Structural code, cinematic detail. Built in Cyprus, shipped worldwide.
            </p>
          </motion.div>

          <div className="lg:col-span-3">
            <NavCol heading="Studio" links={STUDIO} item={item} />
          </div>
          <div className="lg:col-span-3">
            <NavCol heading="Connect" links={SOCIALS} accent item={item} />
          </div>
          <div className="lg:col-span-2">
            <NavCol heading="Legal" links={LEGAL} item={item} />
          </div>
        </motion.div>

        {/* bottom bar */}
        <motion.div
          variants={group}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="mt-16 flex flex-col gap-4 border-t border-white/[0.08] pt-6 font-sans text-[10px] tracking-[0.14em] uppercase text-white/30 sm:flex-row sm:items-center sm:justify-between md:mt-20"
        >
          <motion.p variants={item}>© {YEAR} Konaverse — All rights reserved.</motion.p>
          <motion.div variants={item} className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-[var(--color-sage)]/80">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-sage)] animate-pulse" />
              Available for new projects
            </span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              data-cursor="link"
              className="footer-totop group/tt flex items-center gap-2 uppercase text-white/30 transition-colors duration-300 hover:text-white/70"
            >
              Back to top
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="transition-transform duration-300 group-hover/tt:-translate-y-0.5" aria-hidden>
                <path d="M6 10V2M6 2L2.5 5.5M6 2l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* ── giant wordmark — bleeds off the bottom (mt-auto glues it down) ── */}
      <motion.div
        aria-hidden
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="relative z-10 mt-auto flex w-full flex-nowrap items-end justify-center pt-16 md:pt-24"
        style={{ lineHeight: 0.78, transform: "translateY(2.4vw)" }}
      >
        {WORDMARK.map((char, i) => (
          <span key={char + i} style={{ overflow: "hidden", display: "inline-block" }}>
            <motion.span
              custom={i}
              variants={letter}
              className="footer-wordmark-letter"
              style={{
                display: "inline-block",
                fontFamily: "var(--font-inter), sans-serif",
                fontWeight: 500,
                fontSize: "16.4vw",
                letterSpacing: "-0.02em",
                backgroundImage: "linear-gradient(to bottom, rgba(248, 250, 252, 0.95), rgba(248, 250, 252, 0))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {char}
            </motion.span>
          </span>
        ))}
      </motion.div>
    </motion.footer>
  );
}
