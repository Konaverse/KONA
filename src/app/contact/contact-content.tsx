"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import HomeFooter from "@/components/sections/HomeFooter";
import { ArrowUpRight, Check, Instagram, Linkedin } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ════════════════════════════════════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════════════════════════════════════ */

const SERVICES = [
  { id: "web-development", label: "Web Development", href: "/solutions/web-development" },
  { id: "web-applications", label: "Web Applications", href: "/solutions/web-applications" },
  { id: "videography", label: "Videography", href: "/solutions/videography" },
  { id: "digital-advertising", label: "Digital Advertising", href: "/solutions/digital-advertising" },
  { id: "social-media", label: "Social Media", href: "/solutions/social-media" },
];

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Discovery Call",
    duration: "30 min",
    description: "We listen. You share your vision, goals, and timeline. No pitch decks — just a real conversation about what you need.",
  },
  {
    number: "02",
    title: "Strategy & Proposal",
    duration: "3–5 days",
    description: "We design a tailored approach — scope, timeline, and investment. Clear deliverables. No ambiguity. No bloated packages.",
  },
  {
    number: "03",
    title: "Build & Iterate",
    duration: "Ongoing",
    description: "Work begins. You see progress weekly. We iterate together until every detail is right. Your feedback drives the process.",
  },
  {
    number: "04",
    title: "Launch & Support",
    duration: "Continuous",
    description: "We launch when it's ready, not when it's due. Post-launch support, optimization, and growth strategy included.",
  },
];

const SOCIAL_LINKS = [
  { icon: Instagram, href: "https://instagram.com/konaverse", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com/company/konaverse", label: "LinkedIn" },
  { icon: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M7.443 5.35c.639 0 1.23.05 1.77.198a5.07 5.07 0 011.377.544c.394.247.689.544.886.94.197.395.296.84.296 1.385 0 .594-.148 1.09-.444 1.534-.296.395-.738.79-1.328 1.089.839.247 1.478.693 1.874 1.287.444.594.64 1.336.64 2.127 0 .594-.148 1.138-.394 1.583a3.65 3.65 0 01-1.083 1.188 5.03 5.03 0 01-1.622.742 6.86 6.86 0 01-1.97.297H1V5.35h6.443zm-.394 5.54c.541 0 .985-.148 1.328-.494.345-.297.493-.693.493-1.188 0-.297-.05-.544-.148-.742a1.42 1.42 0 00-.394-.494 1.41 1.41 0 00-.591-.297 2.85 2.85 0 00-.738-.099H4.71v3.315h2.339zm.197 5.788c.296 0 .541-.05.787-.099a1.74 1.74 0 00.64-.346c.197-.148.345-.346.444-.594.099-.247.197-.544.197-.89 0-.742-.197-1.287-.64-1.583-.394-.346-.935-.494-1.574-.494H4.71v4.006h2.536zM15.69 14.054c.345.395.886.593 1.574.593.493 0 .935-.148 1.279-.395.394-.296.64-.593.738-.89h2.437c-.394 1.236-.984 2.077-1.77 2.572-.788.445-1.723.693-2.832.693a5.93 5.93 0 01-2.043-.346 4.45 4.45 0 01-1.574-1.04 4.66 4.66 0 01-1.033-1.583 5.79 5.79 0 01-.345-2.027c0-.693.099-1.385.345-1.978a4.89 4.89 0 011.033-1.632 4.86 4.86 0 011.574-1.09 4.86 4.86 0 012.043-.395c.837 0 1.574.148 2.215.494a4.35 4.35 0 011.525 1.336c.394.544.689 1.188.886 1.929.099.742.148 1.534.05 2.424h-7.29c.05.89.345 1.534.69 1.88zm2.733-4.749c-.296-.346-.787-.544-1.377-.544-.394 0-.69.05-.984.198-.247.099-.493.247-.64.445-.197.148-.296.346-.394.544-.05.198-.099.346-.099.494h4.168c-.099-.544-.345-1.04-.69-1.138z" />
    </svg>
  ), href: "https://behance.net/konaverse", label: "Behance" },
];

/* ════════════════════════════════════════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════════════════════════════════════════ */

function GridOverlay({ id }: { id: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none">
      <defs>
        <pattern id={id} width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   ANIMATED INPUT — premium form field with glow focus
   ════════════════════════════════════════════════════════════════════════════ */

function AnimatedField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  index,
  isTextarea,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  index: number;
  isTextarea?: boolean;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  const fieldRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(fieldRef, { once: true, margin: "-60px" });

  const sharedProps = {
    name,
    value,
    onChange,
    required,
    placeholder: isFocused ? placeholder : "",
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    className:
      "w-full bg-transparent text-white/90 text-sm md:text-base outline-none placeholder:text-white/15 caret-[#00ff88]",
    style: {
      fontFamily: "var(--font-geist-sans), sans-serif",
    } as React.CSSProperties,
  };

  return (
    <motion.div
      ref={fieldRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Label */}
      <motion.label
        htmlFor={name}
        className="block font-mono text-[10px] tracking-[0.3em] uppercase mb-3"
        animate={{
          color: isFocused ? "#00ff88" : hasValue ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.3)",
        }}
        transition={{ duration: 0.3 }}
      >
        {label}
      </motion.label>

      {/* Field container */}
      <div
        className="relative"
        style={{
          borderBottom: `1px solid ${isFocused ? "rgba(0,255,136,0.5)" : hasValue ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)"}`,
          transition: "border-color 0.3s ease",
        }}
      >
        {isTextarea ? (
          <textarea id={name} rows={4} {...sharedProps} />
        ) : (
          <input id={name} type={type} {...sharedProps} />
        )}

        {/* Focus glow line */}
        <motion.div
          className="absolute bottom-[-1px] left-0 right-0 h-px origin-left"
          style={{ background: "#00ff88", boxShadow: "0 0 12px rgba(0,255,136,0.4)" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        {/* Padding below field */}
        <div className="h-4" />
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SERVICE SELECTOR — interactive pill selection with glow
   ════════════════════════════════════════════════════════════════════════════ */

function ServiceSelector({
  selected,
  onToggle,
  index,
}: {
  selected: string[];
  onToggle: (id: string) => void;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <label className="block font-mono text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
        Services of Interest
      </label>
      <div className="flex flex-wrap gap-3">
        {SERVICES.map((service) => {
          const isSelected = selected.includes(service.id);
          return (
            <motion.button
              key={service.id}
              type="button"
              onClick={() => onToggle(service.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative font-mono text-[10px] md:text-[11px] tracking-[0.15em] uppercase px-4 py-2.5 rounded-sm transition-all duration-300 cursor-pointer"
              style={{
                background: isSelected ? "rgba(0,255,136,0.08)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${isSelected ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.08)"}`,
                color: isSelected ? "#00ff88" : "rgba(255,255,255,0.4)",
                boxShadow: isSelected ? "0 0 20px rgba(0,255,136,0.06)" : "none",
              }}
            >
              {isSelected && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-block mr-1.5"
                >
                  <Check className="w-3 h-3 inline" />
                </motion.span>
              )}
              {service.label}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════════════════════ */

export default function ContactContent() {
  /* ── Refs ── */
  const heroRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);

  /* ── Hero scroll ── */
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroBgY = useTransform(heroProgress, [0, 1], [0, -80]);
  const heroContentOpacity = useTransform(heroProgress, [0, 0.6], [1, 0]);

  /* ── Form state ── */
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    []
  );

  const toggleService = useCallback((id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSubmitProgress(0);

      const progressInterval = setInterval(() => {
        setSubmitProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + Math.random() * 15 + 5;
        });
      }, 200);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      clearInterval(progressInterval);
      setSubmitProgress(100);
      setIsSubmitting(false);
      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);
        setFormState({ name: "", email: "", message: "" });
        setSelectedServices([]);
        setSubmitProgress(0);
      }, 5000);
    },
    []
  );

  /* ── GSAP: Process steps stagger ── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const section = processRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const cards = section.querySelectorAll("[data-process-card]");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50, rotateX: -8 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            delay: i * 0.08,
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-black min-h-screen">
      {/* ══════════════════════════════════════════════════════════════════
          SECTION 1: HERO — "The Arrival"
          Minimal, bold. A statement that this is a destination, not a form page.
          ══════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        {/* Parallax background layer */}
        <motion.div className="absolute inset-0" style={{ y: heroBgY }}>
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse at 70% 40%, rgba(0,255,136,0.06) 0%, transparent 50%),
                radial-gradient(ellipse at 20% 80%, rgba(0,255,136,0.03) 0%, transparent 50%)
              `,
            }}
          />
        </motion.div>

        <GridOverlay id="hero-contact-grid" />

        {/* Vertical accent lines */}
        <div className="absolute left-[15%] top-0 w-px h-full hidden md:block" style={{ background: "rgba(255,255,255,0.03)" }} />
        <div className="absolute right-[30%] top-0 w-px h-full hidden md:block" style={{ background: "rgba(255,255,255,0.03)" }} />

        {/* Content */}
        <motion.div
          className="absolute inset-0 z-10 flex flex-col justify-end pb-16 md:pb-24 px-[clamp(1.5rem,4vw,4rem)]"
          style={{ opacity: heroContentOpacity }}
        >
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[11px] tracking-[0.3em] uppercase mb-4"
            style={{ fontFamily: "var(--font-geist-mono), monospace", color: "rgba(0,255,136,0.5)" }}
          >
            Let&apos;s Talk
          </motion.p>

          <motion.h1
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="leading-[0.85] uppercase"
            style={{
              fontFamily: "var(--font-monument), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(40px, 8vw, 100px)",
              color: "#ffffff",
            }}
          >
            Start a
            <br />
            <span style={{ color: "#00ff88" }}>Conversation</span>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-6 origin-left"
            style={{
              width: "clamp(60px, 10vw, 140px)",
              height: 2,
              background: "#00ff88",
              boxShadow: "0 0 20px rgba(0,255,136,0.3)",
            }}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-6 max-w-md"
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              color: "rgba(255,255,255,0.5)",
              fontSize: "clamp(13px, 1.2vw, 16px)",
              lineHeight: 1.7,
            }}
          >
            Every project starts here. No forms from a template. No
            auto-responders. A real conversation between people who build things.
          </motion.p>

          {/* Right side — floating location badge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="absolute bottom-16 md:bottom-24 right-[clamp(1.5rem,4vw,4rem)] hidden md:flex flex-col items-end gap-3"
          >
            <p
              className="text-[10px] tracking-[0.3em] uppercase"
              style={{ fontFamily: "var(--font-geist-mono), monospace", color: "rgba(255,255,255,0.2)" }}
            >
              Nicosia, Cyprus
            </p>
            <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, rgba(0,255,136,0.3), transparent)" }} />
            <p
              className="text-[10px] tracking-[0.15em]"
              style={{ fontFamily: "var(--font-geist-mono), monospace", color: "rgba(0,255,136,0.4)" }}
            >
              35.1856&deg; N, 33.3823&deg; E
            </p>
          </motion.div>
        </motion.div>

        {/* Bottom border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="absolute bottom-0 left-0 right-0 h-px origin-left z-[6]"
          style={{
            background: "linear-gradient(90deg, rgba(0,255,136,0.4) 0%, rgba(0,255,136,0.1) 50%, transparent 100%)",
          }}
        />
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 2: THE FORM — "The Brief"
          Split layout. Left: contact details + social proof.
          Right: premium animated form.
          ══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-36 overflow-hidden">
        <GridOverlay id="form-grid" />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 70% 30%, rgba(0,255,136,0.03), transparent 60%)" }}
        />

        {/* Watermark */}
        <div
          className="absolute top-[5%] left-[3%] select-none pointer-events-none hidden md:block"
          style={{
            fontFamily: "var(--font-monument), sans-serif",
            fontWeight: 800,
            fontSize: "clamp(200px, 25vw, 400px)",
            color: "rgba(255,255,255,0.015)",
            lineHeight: 0.85,
          }}
        >
          K
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-[clamp(1.5rem,4vw,4rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-16 lg:gap-24">
            {/* ── Left column: contact details ── */}
            <div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
                className="font-mono text-[11px] tracking-[0.3em] uppercase mb-4"
                style={{ color: "rgba(0,255,136,0.5)" }}
              >
                Get in Touch
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="leading-[0.95] uppercase mb-8"
                style={{
                  fontFamily: "var(--font-monument), sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(28px, 4vw, 48px)",
                  color: "#ffffff",
                }}
              >
                The <span style={{ color: "#00ff88" }}>Brief</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "clamp(13px, 1.1vw, 15px)",
                  lineHeight: 1.8,
                }}
                className="mb-12 max-w-md"
              >
                Tell us what you&apos;re building. We&apos;ll respond within 24 hours
                with honest thoughts on whether we&apos;re the right fit — and if
                we are, how we&apos;d approach it.
              </motion.p>

              {/* Contact info cards */}
              <div className="flex flex-col gap-6 mb-12">
                {/* Email */}
                <motion.a
                  href="mailto:hello@konaverse.com"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="group flex items-start gap-4 p-4 bg-white/[0.02] border border-white/[0.05] rounded-sm transition-all duration-400 hover:border-[rgba(0,255,136,0.2)] hover:bg-white/[0.04]"
                >
                  <div className="shrink-0 mt-0.5">
                    <div
                      className="w-8 h-8 rounded-sm flex items-center justify-center"
                      style={{ background: "rgba(0,255,136,0.06)", border: "1px solid rgba(0,255,136,0.15)" }}
                    >
                      <span className="font-mono text-[10px]" style={{ color: "#00ff88" }}>@</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.3em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                      Email
                    </p>
                    <p
                      className="text-sm transition-colors duration-300 group-hover:text-[#00ff88]"
                      style={{ fontFamily: "var(--font-geist-sans), sans-serif", color: "rgba(255,255,255,0.7)" }}
                    >
                      hello@konaverse.com
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 ml-auto mt-1 opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: "#00ff88" }} />
                </motion.a>

                {/* Location */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex items-start gap-4 p-4 bg-white/[0.02] border border-white/[0.05] rounded-sm"
                >
                  <div className="shrink-0 mt-0.5">
                    <div
                      className="w-8 h-8 rounded-sm flex items-center justify-center"
                      style={{ background: "rgba(0,255,136,0.06)", border: "1px solid rgba(0,255,136,0.15)" }}
                    >
                      <span className="font-mono text-[10px]" style={{ color: "#00ff88" }}>&gt;</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.3em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                      Location
                    </p>
                    <p
                      className="text-sm"
                      style={{ fontFamily: "var(--font-geist-sans), sans-serif", color: "rgba(255,255,255,0.7)" }}
                    >
                      Nicosia, Cyprus
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Social links */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <p className="font-mono text-[9px] tracking-[0.3em] uppercase mb-4" style={{ color: "rgba(255,255,255,0.2)" }}>
                  Follow
                </p>
                <div className="flex gap-3">
                  {SOCIAL_LINKS.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="w-10 h-10 rounded-sm flex items-center justify-center bg-white/[0.02] border border-white/[0.05] transition-all duration-300 hover:border-[rgba(0,255,136,0.3)] hover:bg-[rgba(0,255,136,0.06)]"
                      >
                        <span className="text-white/40 transition-colors duration-300 hover:text-[#00ff88]">
                          <Icon className="w-4 h-4" />
                        </span>
                      </a>
                    );
                  })}
                </div>
              </motion.div>

              {/* Response time badge */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-12 inline-flex items-center gap-2 px-4 py-2 rounded-sm"
                style={{
                  background: "rgba(0,255,136,0.04)",
                  border: "1px solid rgba(0,255,136,0.1)",
                }}
              >
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#00ff88" }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="font-mono text-[10px] tracking-[0.15em] uppercase" style={{ color: "rgba(0,255,136,0.6)" }}>
                  Avg. response: &lt; 24h
                </span>
              </motion.div>
            </div>

            {/* ── Right column: the form ── */}
            <div>
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  /* ── Success state ── */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center py-24 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-8"
                      style={{
                        background: "rgba(0,255,136,0.1)",
                        border: "1px solid rgba(0,255,136,0.3)",
                        boxShadow: "0 0 40px rgba(0,255,136,0.1)",
                      }}
                    >
                      <Check className="w-8 h-8" style={{ color: "#00ff88" }} />
                    </motion.div>

                    <h3
                      className="uppercase mb-4"
                      style={{
                        fontFamily: "var(--font-monument), sans-serif",
                        fontWeight: 800,
                        fontSize: "clamp(24px, 3vw, 40px)",
                        color: "#ffffff",
                      }}
                    >
                      Message <span style={{ color: "#00ff88" }}>Sent</span>
                    </h3>

                    <p
                      style={{
                        fontFamily: "var(--font-geist-sans), sans-serif",
                        color: "rgba(255,255,255,0.5)",
                        fontSize: 14,
                        lineHeight: 1.7,
                      }}
                    >
                      We&apos;ll get back to you within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  /* ── Form ── */
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-8"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <AnimatedField
                      label="Your Name"
                      name="name"
                      placeholder="Full name"
                      value={formState.name}
                      onChange={handleInputChange}
                      required
                      index={0}
                    />

                    <AnimatedField
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="you@company.com"
                      value={formState.email}
                      onChange={handleInputChange}
                      required
                      index={1}
                    />

                    <ServiceSelector
                      selected={selectedServices}
                      onToggle={toggleService}
                      index={2}
                    />

                    <AnimatedField
                      label="Project Description"
                      name="message"
                      placeholder="Tell us about your project — goals, timeline, budget range, whatever feels relevant."
                      value={formState.message}
                      onChange={handleInputChange}
                      required
                      index={3}
                      isTextarea
                    />

                    {/* Submit button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="pt-4"
                    >
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="relative group w-full md:w-auto overflow-hidden"
                      >
                        <div
                          className="relative px-10 py-4 font-mono text-[11px] tracking-[0.3em] uppercase transition-all duration-400"
                          style={{
                            border: `1px solid ${isSubmitting ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.15)"}`,
                            color: isSubmitting ? "#00ff88" : "rgba(255,255,255,0.8)",
                            background: isSubmitting ? "rgba(0,255,136,0.04)" : "transparent",
                          }}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center justify-center gap-3">
                              <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="inline-block w-3 h-3 border border-[#00ff88] border-t-transparent rounded-full"
                              />
                              Sending...
                            </span>
                          ) : (
                            "Send Message"
                          )}

                          {/* Progress bar during submit */}
                          {isSubmitting && (
                            <motion.div
                              className="absolute bottom-0 left-0 h-px"
                              style={{ background: "#00ff88", boxShadow: "0 0 8px rgba(0,255,136,0.4)" }}
                              initial={{ width: "0%" }}
                              animate={{ width: `${Math.min(submitProgress, 100)}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                        </div>

                        {/* Hover fill */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                          style={{ background: "rgba(0,255,136,0.03)" }}
                        />
                      </button>
                    </motion.div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 3: "THE PROCESS" — What Happens Next
          Interactive timeline showing 4 steps. Each card reveals on scroll
          with a perspective tilt. Gives the visitor clarity and confidence.
          ══════════════════════════════════════════════════════════════════ */}
      <section ref={processRef} className="relative py-32 md:py-44" style={{ overflowX: "clip" }}>
        <GridOverlay id="process-grid" />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 30% 60%, rgba(0,255,136,0.04), transparent 60%)" }}
        />

        {/* Background watermark */}
        <div
          className="absolute top-[15%] right-[2%] select-none pointer-events-none hidden md:block"
          style={{
            fontFamily: "var(--font-monument), sans-serif",
            fontWeight: 800,
            fontSize: "clamp(150px, 20vw, 350px)",
            color: "rgba(255,255,255,0.015)",
            lineHeight: 0.85,
          }}
        >
          HOW
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-[clamp(1.5rem,4vw,4rem)]">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[11px] tracking-[0.3em] uppercase mb-4"
            style={{ color: "rgba(0,255,136,0.5)" }}
          >
            What Happens Next
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="leading-[0.95] uppercase mb-16 md:mb-24"
            style={{
              fontFamily: "var(--font-monument), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(28px, 4.5vw, 56px)",
              color: "#ffffff",
            }}
          >
            The <span style={{ color: "#00ff88" }}>Process</span>
          </motion.h2>

          {/* Process cards — staggered horizontal layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {PROCESS_STEPS.map((step, i) => (
              <div
                key={step.number}
                data-process-card
                className={`relative group ${i === 1 ? "md:mt-16" : i === 3 ? "md:mt-16" : ""}`}
                style={{ perspective: "800px" }}
              >
                <div
                  className="bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm rounded-sm p-6 md:p-8 relative overflow-hidden transition-all duration-500 hover:border-[rgba(0,255,136,0.2)] hover:bg-white/[0.04]"
                  style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 0 40px rgba(0,255,136,0.06), 0 20px 40px rgba(0,0,0,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
                  }}
                >
                  {/* Step number + duration */}
                  <div className="flex items-center justify-between mb-5">
                    <p className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: "#00ff88" }}>
                      Step {step.number}
                    </p>
                    <p className="font-mono text-[9px] tracking-[0.15em] uppercase" style={{ color: "rgba(255,255,255,0.2)" }}>
                      {step.duration}
                    </p>
                  </div>

                  <h3
                    className="uppercase mb-3"
                    style={{
                      fontFamily: "var(--font-monument), sans-serif",
                      fontWeight: 800,
                      fontSize: "clamp(18px, 2vw, 28px)",
                      color: "rgba(255,255,255,0.9)",
                    }}
                  >
                    {step.title}
                  </h3>

                  <div className="mb-4" style={{ width: 30, height: 2, background: "#00ff88", boxShadow: "0 0 8px rgba(0,255,136,0.2)" }} />

                  <p
                    style={{
                      fontFamily: "var(--font-geist-sans), sans-serif",
                      color: "rgba(255,255,255,0.45)",
                      fontSize: 13,
                      lineHeight: 1.7,
                    }}
                  >
                    {step.description}
                  </p>

                  {/* Connecting line to next step — right side */}
                  {i < PROCESS_STEPS.length - 1 && (
                    <div
                      className="absolute -right-4 lg:-right-4 top-1/2 w-8 h-px hidden md:block"
                      style={{ background: "rgba(0,255,136,0.1)" }}
                    />
                  )}

                  {/* Corner accents on hover */}
                  <div className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute top-0 right-0 w-full h-px" style={{ background: "rgba(0,255,136,0.3)" }} />
                    <div className="absolute top-0 right-0 w-px h-full" style={{ background: "rgba(0,255,136,0.3)" }} />
                  </div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute bottom-0 left-0 w-full h-px" style={{ background: "rgba(0,255,136,0.3)" }} />
                    <div className="absolute bottom-0 left-0 w-px h-full" style={{ background: "rgba(0,255,136,0.3)" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 4: "THE COST OF WAITING" — Urgency & Value
          A bold, scroll-triggered kinetic section. Counter-style stats
          that animate in, paired with a provocative manifesto.
          Makes visitors feel the cost of inaction.
          ══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-44 overflow-hidden">
        <GridOverlay id="urgency-grid" />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,255,136,0.05), transparent 50%)" }}
        />

        {/* Top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.15) 50%, transparent 100%)" }}
        />

        <div className="relative z-10 max-w-[1200px] mx-auto px-[clamp(1.5rem,4vw,4rem)]">
          {/* Provocative headline — full width */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[11px] tracking-[0.3em] uppercase mb-6"
            style={{ color: "rgba(0,255,136,0.5)" }}
          >
            A Question Worth Asking
          </motion.p>

          <div className="mb-20 md:mb-28">
            {[
              "Your competitors",
              "are building right now.",
              "What are you waiting for?",
            ].map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -40, clipPath: "inset(0 100% 0 0)" }}
                whileInView={{ opacity: 1, x: 0, clipPath: "inset(0 0% 0 0)" }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-monument), sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(24px, 4.5vw, 64px)",
                    textTransform: "uppercase",
                    lineHeight: 1.15,
                    color: i === 2 ? "#00ff88" : "rgba(255,255,255,0.9)",
                  }}
                >
                  {line}
                </h2>
              </motion.div>
            ))}
          </div>

          {/* Value propositions — staggered asymmetric cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                stat: "48h",
                label: "From brief to strategy",
                detail: "We move fast. Your first strategy document lands in your inbox within 48 hours of our discovery call.",
              },
              {
                stat: "100%",
                label: "Founder-led delivery",
                detail: "No account managers. No junior handoffs. The people who plan it are the people who build it.",
              },
              {
                stat: "0",
                label: "Lock-in contracts",
                detail: "No retainers you can't exit. No 12-month traps. We earn your business every month, or we don't deserve it.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.stat}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className={`${i === 1 ? "md:mt-12" : ""}`}
              >
                <div className="bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm rounded-sm p-6 md:p-8 transition-all duration-500 hover:border-[rgba(0,255,136,0.2)] hover:bg-white/[0.04]">
                  {/* Stat number */}
                  <p
                    className="mb-2"
                    style={{
                      fontFamily: "var(--font-monument), sans-serif",
                      fontWeight: 800,
                      fontSize: "clamp(36px, 5vw, 56px)",
                      color: "#00ff88",
                      lineHeight: 1,
                    }}
                  >
                    {item.stat}
                  </p>

                  {/* Label */}
                  <p
                    className="font-mono text-[10px] tracking-[0.2em] uppercase mb-4"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {item.label}
                  </p>

                  <div className="mb-4" style={{ width: 24, height: 2, background: "#00ff88", boxShadow: "0 0 8px rgba(0,255,136,0.2)" }} />

                  <p
                    style={{
                      fontFamily: "var(--font-geist-sans), sans-serif",
                      color: "rgba(255,255,255,0.4)",
                      fontSize: 13,
                      lineHeight: 1.7,
                    }}
                  >
                    {item.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA nudge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 flex items-center gap-4"
          >
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.05)" }} />
            <a
              href="#form-grid"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("form")?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className="font-mono text-[10px] tracking-[0.3em] uppercase transition-colors duration-300 hover:text-[#00ff88] cursor-pointer"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Back to the form &uarr;
            </a>
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.05)" }} />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FOOTER — No redundant CTA. This IS the contact page.
          Flow directly into footer.
          ══════════════════════════════════════════════════════════════════ */}
      <HomeFooter />
    </div>
  );
}
