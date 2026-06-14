"use client";

import { useRef, useLayoutEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from '@/utils/gsap'
import { Button } from '@/components/ui/button'

const ACCENT = '#6b7f62'
const OFF = '#ededea'

const HERO_EMPTY = { name: "", email: "", message: "" };

function HeroContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [values, setValues] = useState({ ...HERO_EMPTY });

  const set = (key: keyof typeof HERO_EMPTY, v: string) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  // Progress / gating — all three fields are required.
  const required: (keyof typeof HERO_EMPTY)[] = ["name", "email", "message"];
  const filled = required.filter((k) => values[k].trim() !== "").length;
  const progress = (filled / required.length) * 100;
  const allFilled = filled === required.length;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!allFilled) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setValues({ ...HERO_EMPTY });
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      {/* Desktop — glass form matching the CTA section (3 fields) */}
      <div
        className="cta-form-inner max-md:hidden pointer-events-auto"
        style={{ width: "min(90vw, 380px)" }}
      >
        {/* vertical progress bar — fills as required fields complete */}
        <div className="cta-progress" aria-hidden>
          <div className="cta-progress-fill" style={{ height: `${progress}%` }} />
        </div>

        <div className="cta-glass">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: "flex", flexDirection: "column", gap: "1.1rem", padding: "1.5rem 0" }}
              >
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 9999,
                    border: `1px solid ${ACCENT}66`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontWeight: 300,
                    fontSize: "clamp(1.6rem, 2.4vw, 2.2rem)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.02em",
                    color: OFF,
                    margin: 0,
                  }}
                >
                  Message received.
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontWeight: 300,
                    fontSize: "0.86rem",
                    lineHeight: 1.6,
                    color: "rgba(237,237,234,0.5)",
                    margin: 0,
                    maxWidth: "34ch",
                  }}
                >
                  We&rsquo;ll be in touch within 24 hours to begin the conversation.
                </p>
                <button onClick={() => setStatus("idle")} className="cta-send-another">
                  Send another →
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: "flex", flexDirection: "column", gap: "1.05rem" }}
              >
                <div className="cta-field">
                  <label className="cta-label" htmlFor="hero-name">Full Name</label>
                  <input
                    id="hero-name"
                    className="cta-box"
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={values.name}
                    onChange={(e) => set("name", e.target.value)}
                  />
                </div>

                <div className="cta-field">
                  <label className="cta-label" htmlFor="hero-email">Email</label>
                  <input
                    id="hero-email"
                    className="cta-box"
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={values.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </div>

                <div className="cta-field">
                  <label className="cta-label" htmlFor="hero-message">Your Message</label>
                  <textarea
                    id="hero-message"
                    className="cta-box cta-textarea"
                    name="message"
                    rows={3}
                    placeholder="Tell us about your project…"
                    value={values.message}
                    onChange={(e) => set("message", e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={!allFilled || status === "loading"}
                  className="w-full justify-center mt-1"
                >
                  {status === "loading" ? "Transmitting…" : "Send Message"}
                </Button>

                {status === "error" && (
                  <span
                    style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "0.58rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "rgba(248,113,113,0.85)",
                    }}
                  >
                    Something went wrong — please try again.
                  </span>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile — keep the existing compact link (mobile layout is final) */}
      <div className="md:hidden flex pointer-events-auto">
        <Link
          href="/contact"
          className="bg-black/40 border border-white/[0.08] backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-3 text-white shadow-xl hover:bg-black/60 transition-colors"
        >
          <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[var(--color-sage)]">Start a project</span>
          <span className="font-display text-lg font-light text-[var(--color-off-white)]">Let's talk →</span>
        </Link>
      </div>
    </>
  );
}

export default function HeroSection() {
  /* ── Outer ref (gsap.context scope) ──────────────────────── */
  const outerRef = useRef<HTMLDivElement>(null)

  /* ── Beat 1 (entrance) refs ──────────────────────────────── */
  const atmosphereRef = useRef<HTMLDivElement>(null)
  const lineLeftRef = useRef<HTMLDivElement>(null)
  const lineRightRef = useRef<HTMLDivElement>(null)
  const wordmarkRef = useRef<HTMLDivElement>(null)
  const line1Ref = useRef<HTMLSpanElement>(null)
  const line2Ref = useRef<HTMLSpanElement>(null)
  const qualifyRef = useRef<HTMLParagraphElement>(null)
  const cardsInnerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768

      /* ─────────────────────────────────────────────────────────
         BEAT 1 — Existing load entrance (time-based, untouched)
         ───────────────────────────────────────────────────────── */
      const lineTargetWidth = isMobile ? '40vw' : '27.5vw'

      gsap.set([line1Ref.current, line2Ref.current], { y: '100%' })
      gsap.set([lineLeftRef.current, lineRightRef.current], { width: 0 })

      gsap.set(wordmarkRef.current, { yPercent: 100, opacity: 0 })

      const entranceTl = gsap.timeline()

      // KONAVERSE — wordmark rises up from behind the figure
      entranceTl.to(wordmarkRef.current, {
        yPercent: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power4.out',
      }, 0.15)

      // Line expands from center — now two halves growing outward
      entranceTl.to(lineLeftRef.current, {
        width: lineTargetWidth,
        duration: 0.8,
        ease: 'power2.out',
      }, 0.3)
      entranceTl.to(lineRightRef.current, {
        width: lineTargetWidth,
        duration: 0.8,
        ease: 'power2.out',
      }, 0.3)

      // Headline mask reveal
      entranceTl.to(line1Ref.current, {
        y: '0%',
        duration: 1,
        ease: 'power3.out',
      }, 0.5)
      entranceTl.to(line2Ref.current, {
        y: '0%',
        duration: 1,
        ease: 'power3.out',
      }, 0.65)

      // Qualifying statement — same timing as headline
      gsap.set(qualifyRef.current, { opacity: 0 })
      entranceTl.to(qualifyRef.current, {
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
      }, 0.5)

      // Contact form — same timing as headline
      gsap.set(cardsInnerRef.current, { opacity: 0, y: 20 })
      entranceTl.to(cardsInnerRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
      }, 0.8)

      // Breathing gradient
      gsap.to(atmosphereRef.current, {
        scale: 1.05,
        duration: 8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 0.5,
      })
    }, outerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={outerRef}>
      {/* ── Viewport (pinned by the .hero-pin sticky wrapper in page.tsx) ─── */}
      <div
        className="relative w-full overflow-hidden bg-[#0a0a0a]"
        style={{ height: '100vh' }}
      >
        {/* Z-0 — Background plate (dark atmosphere, no subject) */}
        <div
          className="absolute inset-0 gpu"
          style={{ zIndex: 0, willChange: 'transform' }}
        >
          <Image
            src="/Hero/hero_bg.png"
            alt=""
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>

        {/* Z-1 — Atmosphere (breathing gradient) */}
        <div
          ref={atmosphereRef}
          aria-hidden
          className="gpu absolute inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            background:
              'radial-gradient(ellipse 80% 60% at 50% 60%, rgba(107,127,98,0.07) 0%, transparent 70%)',
          }}
        />

        {/* Z-2 — KONAVERSE wordmark image (sits behind the figure, rises in on load) */}
        <div
          ref={wordmarkRef}
          aria-hidden
          className="absolute left-0 right-0 px-2 md:px-4 pointer-events-none select-none top-[120px] md:top-[108px]"
          style={{
            zIndex: 2,
            willChange: 'transform, opacity',
            // vertical fade: solid to 58%, dissolved by 86% (kept in CSS so it stays adjustable)
            WebkitMaskImage:
              'linear-gradient(to bottom, #000 0%, #000 58%, rgba(0,0,0,0) 86%)',
            maskImage:
              'linear-gradient(to bottom, #000 0%, #000 58%, rgba(0,0,0,0) 86%)',
          }}
        >
          <Image
            src="/Hero/big_KONAVERSE_2.png"
            alt=""
            width={6000}
            height={1660}
            className="w-full h-auto"
            priority
            sizes="100vw"
          />
        </div>

        {/* Z-3 — Figure (transparent PNG, occludes the centre of the wordmark) */}
        <div
          className="absolute inset-0 gpu pointer-events-none"
          style={{ zIndex: 3, willChange: 'transform' }}
        >
          <Image
            src="/Hero/portrait_of_a_robot_no_background.png"
            alt="Konaverse — cybernetic figure"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>

        {/* Z-4 — Bottom legibility gradient */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            zIndex: 4,
            height: '55%',
            background:
              'linear-gradient(to bottom, rgba(10,10,10,0) 0%, rgba(10,10,10,0.55) 68%, rgba(10,10,10,0.82) 100%)',
          }}
        />

        {/* Z-4 — Headline + cards mobile wrapper (md:contents = invisible on desktop) */}
        <div
          className="max-md:absolute max-md:bottom-[20%] max-md:left-4 max-md:right-4 max-md:flex max-md:flex-col md:contents"
          style={{ zIndex: 5 }}
        >

        {/* Headline + qualifying statement (bottom-left) */}
        <div
          className="gpu max-md:relative md:absolute flex flex-col max-md:left-2 max-md:right-2 md:bottom-[80px] md:left-[48px]"
          style={{
            textAlign: 'left',
            willChange: 'transform',
            zIndex: 5,
          }}
        >
          {/* Qualifying statement */}
          <p
            ref={qualifyRef}
            className="max-md:text-[14px]"
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontWeight: 300,
              fontSize: 'clamp(13px, 1.1vw, 15px)',
              color: 'rgba(250,247,242,0.6)',
              maxWidth: 420,
              marginBottom: 20,
              willChange: 'transform',
            }}
          >
            We build digital presence for brands that refuse to be ordinary.
          </p>

          <div className="mask-parent">
            <span
              ref={line1Ref}
              className="mask-child gpu max-md:text-[clamp(22px,6.5vw,28px)] md:text-[clamp(56px,7vw,100px)]"
              style={{
                fontFamily: 'var(--font-display-serif), serif',
                fontWeight: 300,
                letterSpacing: '-0.02em',
                lineHeight: 1,
                color: '#faf7f2',
              }}
            >
              Creative Studio
            </span>
          </div>

          <div className="mask-parent">
            <span
              ref={line2Ref}
              className="mask-child gpu max-md:text-[clamp(22px,6.5vw,28px)] md:text-[clamp(56px,7vw,100px)]"
              style={{
                fontFamily: 'var(--font-display-serif), serif',
                fontWeight: 300,
                letterSpacing: '-0.02em',
                lineHeight: 1,
                color: '#faf7f2',
              }}
            >
              Limitless Possibilities
            </span>
          </div>
        </div>

        {/* Contact Form — flows below headline on mobile, bottom-right on desktop */}
        <div
          className="max-md:relative max-md:mt-6 max-md:left-2 md:absolute md:bottom-[80px] md:left-auto md:right-12 flex flex-col max-md:items-start md:items-end gap-0 z-10"
        >
          <div ref={cardsInnerRef} style={{ willChange: 'opacity, transform' }}>
            <HeroContactForm />
          </div>
        </div>
        </div>{/* end mobile wrapper */}

        {/* Horizontal line — two halves meeting at center */}
        <div
          className="absolute"
          style={{
            top: '38%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 5,
            width: 0,
            height: 0,
          }}
          aria-hidden
        >
          {/* Left half */}
          <div
            ref={lineLeftRef}
            className="gpu absolute"
            style={{
              top: 0,
              right: 0,
              height: 1,
              background: '#6b7f62',
              opacity: 0.4,
            }}
          />
          {/* Right half */}
          <div
            ref={lineRightRef}
            className="gpu absolute"
            style={{
              top: 0,
              left: 0,
              height: 1,
              background: '#6b7f62',
              opacity: 0.4,
            }}
          />
        </div>
      </div>
    </div>
  )
}
