"use client";

import { useRef, useLayoutEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap, ScrollTrigger } from '@/utils/gsap'

function HeroContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const data = new FormData(formRef.current!);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      formRef.current?.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <>
        <div className="hidden md:flex flex-col justify-center h-full p-6 bg-black/40 border border-white/[0.08] backdrop-blur-md rounded-2xl w-[320px] pointer-events-auto">
          <div className="w-10 h-10 rounded-full border border-[var(--color-sage)] flex items-center justify-center mb-4">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-sage)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-display text-3xl font-light text-[var(--color-off-white)] mb-2">Received.</h3>
          <p className="font-sans font-light text-sm text-white/50 mb-6">We'll be in touch shortly.</p>
          <button onClick={() => setStatus("idle")} className="font-mono text-[9px] tracking-[0.3em] uppercase text-[var(--color-sage)] text-left hover:text-white transition-colors">
            Send Another →
          </button>
        </div>
        <div className="md:hidden flex pointer-events-auto">
          <Link 
            href="/contact"
            className="bg-black/40 border border-white/[0.08] backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-3 text-white shadow-xl"
          >
            <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[var(--color-sage)]">Start a project</span>
            <span className="font-display text-lg font-light text-[var(--color-off-white)]">Let's talk →</span>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="hidden md:flex flex-col gap-4 p-6 bg-black/40 border border-white/[0.08] backdrop-blur-md rounded-2xl w-[320px] pointer-events-auto"
      >
      <div className="mb-2">
        <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[var(--color-sage)] mb-2 block">
          Start a project
        </span>
        <h3 className="font-display text-2xl font-light text-[var(--color-off-white)] leading-tight">
          Let's talk.
        </h3>
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-mono text-[9px] tracking-[0.28em] uppercase text-white/50">Name</label>
        <div className="relative group">
          <input 
            name="name" 
            required 
            className="peer w-full bg-transparent py-2 text-base font-display font-light text-[var(--color-off-white)] placeholder:text-white/30 outline-none transition-colors"
            placeholder="Your name"
          />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20 group-focus-within:bg-white/30" />
          <div className="absolute bottom-0 left-0 h-px w-0 peer-focus:w-full bg-[var(--color-sage)] transition-all duration-300" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-mono text-[9px] tracking-[0.28em] uppercase text-white/50">Email</label>
        <div className="relative group">
          <input 
            type="email"
            name="email" 
            required 
            className="peer w-full bg-transparent py-2 text-base font-display font-light text-[var(--color-off-white)] placeholder:text-white/30 outline-none transition-colors"
            placeholder="your@email.com"
          />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20 group-focus-within:bg-white/30" />
          <div className="absolute bottom-0 left-0 h-px w-0 peer-focus:w-full bg-[var(--color-sage)] transition-all duration-300" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-mono text-[9px] tracking-[0.28em] uppercase text-white/50">Message</label>
        <div className="relative group">
          <textarea 
            name="message" 
            required 
            rows={2}
            className="peer w-full bg-transparent py-2 text-base font-display font-light text-[var(--color-off-white)] placeholder:text-white/30 outline-none resize-none transition-colors"
            placeholder="Tell us about your vision..."
          />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20 group-focus-within:bg-white/30" />
          <div className="absolute bottom-0 left-0 h-px w-0 peer-focus:w-full bg-[var(--color-sage)] transition-all duration-300" />
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <button 
          type="submit" 
          disabled={status === "loading"}
          className="text-white text-[10px] font-mono tracking-[0.25em] uppercase hover:text-[var(--color-sage)] transition-colors disabled:opacity-50"
        >
          {status === "loading" ? "Transmitting..." : "Send Message →"}
        </button>
      </div>
      {status === "error" && <p className="text-red-400/80 text-[10px] font-mono tracking-widest uppercase mt-1">Error.</p>}
      </form>
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
  /* ── Outer / sticky refs ─────────────────────────────────── */
  const outerRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)

  /* ── Beat 1 (existing entrance) refs ─────────────────────── */
  const atmosphereRef = useRef<HTMLDivElement>(null)
  const lineLeftRef = useRef<HTMLDivElement>(null)
  const lineRightRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const line1Ref = useRef<HTMLSpanElement>(null)
  const line2Ref = useRef<HTMLSpanElement>(null)

  /* ── Beat 1 additions ────────────────────────────────────── */
  const heroBgRef = useRef<HTMLDivElement>(null)
  const heroBgOverlayRef = useRef<HTMLDivElement>(null)
  const qualifyRef = useRef<HTMLParagraphElement>(null)
  const cardsWrapperRef = useRef<HTMLDivElement>(null)
  const cardsInnerRef = useRef<HTMLDivElement>(null)

  /* ── Beat 2 refs ─────────────────────────────────────────── */
  const coordLeftRef = useRef<HTMLSpanElement>(null)
  const coordRightRef = useRef<HTMLSpanElement>(null)

  /* ── Beat 3 refs ─────────────────────────────────────────── */
  const statementRef = useRef<HTMLDivElement>(null)
  const stmtLine1Ref = useRef<HTMLSpanElement>(null)
  const stmtLine2Ref = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768

      /* ─────────────────────────────────────────────────────────
         BEAT 1 — Existing load entrance (time-based, untouched)
         ───────────────────────────────────────────────────────── */
      const lineTargetWidth = isMobile ? '40vw' : '27.5vw'

      gsap.set([line1Ref.current, line2Ref.current], { y: '100%' })
      gsap.set([lineLeftRef.current, lineRightRef.current], { width: 0 })

      const entranceTl = gsap.timeline()

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

      /* ─────────────────────────────────────────────────────────
         MASTER SCROLL-TRIGGER — single timeline
         Position values = scroll progress (0.3 = 30% scrolled)
         ───────────────────────────────────────────────────────── */
      const maxImgOpacity = isMobile ? 0.25 : 0.35
      const startScale = isMobile ? 1.06 : 1.1

      // Initial states for scroll-driven elements
      gsap.set([stmtLine1Ref.current, stmtLine2Ref.current], {
        y: '100%',
        opacity: 1,
      })

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: stickyRef.current,
          pin: true,
          pinSpacing: true,
          start: 'top top',
          end: '+=250%', // Shorter track means animations happen faster per scroll inch
          scrub: 0.2, // Reduced from 1 (heavy smoothing) to 0.2 (snappy, barely smoothed scrub)
        },
      })

      /* ── Beat 1 exit — background image + cards fade out ──── */

      // Hero background image fades out
      master.to(heroBgRef.current, {
        opacity: 0,
        ease: 'none',
        duration: 0.25,
      }, 0)
      master.to(heroBgOverlayRef.current, {
        opacity: 0,
        ease: 'none',
        duration: 0.25,
      }, 0)

      // The qualifying statement is already inside headlineRef, so it naturally fades and scales with it.
      
      // Info cards fade out + scale up exactly like the headline
      master.to(cardsWrapperRef.current, {
        opacity: 0,
        scale: 1.08,
        transformOrigin: isMobile ? 'center center' : 'bottom right',
        ease: 'none',
        duration: 0.25,
      }, 0)

      /* ── Beat 2 — The Expansion (progress 0 → 0.25) ──────── */

      // Headline scale up + fade out
      master.to(headlineRef.current, {
        scale: 1.08,
        opacity: 0,
        transformOrigin: 'center center',
        ease: 'none',
        duration: 0.25,
      }, 0)

      // Left line slides left + fades
      master.to(lineLeftRef.current, {
        x: '-15vw',
        opacity: 0,
        ease: 'none',
        duration: 0.25,
      }, 0)

      // Right line slides right + fades
      master.to(lineRightRef.current, {
        x: '15vw',
        opacity: 0,
        ease: 'none',
        duration: 0.25,
      }, 0)

      // Coordinate metadata — fade in (0 → 0.1), then out (0.1 → 0.25)
      master.fromTo(coordLeftRef.current,
        { opacity: 0 },
        { opacity: 0.5, ease: 'none', duration: 0.1 },
        0,
      )
      master.to(coordLeftRef.current, {
        opacity: 0,
        ease: 'none',
        duration: 0.15,
      }, 0.1)

      master.fromTo(coordRightRef.current,
        { opacity: 0 },
        { opacity: 0.5, ease: 'none', duration: 0.1 },
        0,
      )
      master.to(coordRightRef.current, {
        opacity: 0,
        ease: 'none',
        duration: 0.15,
      }, 0.1)

      /* ── Beat 3 — The Statement (progress 0.3 → 0.65) ─────── */

      // Lines reveal upward from mask (staggered)
      master.to(stmtLine1Ref.current, {
        y: '0%',
        ease: 'none',
        duration: 0.12,
      }, 0.3)
      master.to(stmtLine2Ref.current, {
        y: '0%',
        ease: 'none',
        duration: 0.12,
      }, 0.34)

      // Lines fade out + drift up (Beat 3 exit)
      master.to(stmtLine1Ref.current, {
        opacity: 0,
        y: '-20px',
        ease: 'none',
        duration: 0.1,
      }, 0.46)
      master.to(stmtLine2Ref.current, {
        opacity: 0,
        y: '-20px',
        ease: 'none',
        duration: 0.1,
      }, 0.46)

      /* ── Refresh after Lenis init ─────────────────────────── */
      setTimeout(() => ScrollTrigger.refresh(), 100)
    }, outerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={outerRef}>
      {/* ── Pinned viewport (ScrollTrigger pins this) ─────── */}
      <div
        ref={stickyRef}
        className="relative w-full overflow-hidden bg-[#0a0a0a]"
        style={{ height: '100vh' }}
      >
        {/* Z-neg — Beat 1: Hero background image */}
        <div
          ref={heroBgRef}
          className="absolute inset-0 gpu"
          style={{ zIndex: 0, willChange: 'transform' }}
        >
          <Image
            src="/Hero/A_cinematic_portrait_of_the_robot(hero).jpeg"
            alt=""
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>
        <div
          ref={heroBgOverlayRef}
          className="absolute inset-0"
          style={{
            zIndex: 0,
            background: 'linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.6) 100%)',
          }}
        />

        {/* Z-2 — Atmosphere (breathing gradient) */}
        <div
          ref={atmosphereRef}
          aria-hidden
          className="gpu absolute inset-0 pointer-events-none"
          style={{
            zIndex: 2,
            background:
              'radial-gradient(ellipse 80% 60% at 50% 60%, rgba(107,127,98,0.07) 0%, transparent 70%)',
          }}
        />

        {/* Z-3 — Beat 3: Statement text */}
        <div
          ref={statementRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 3 }}
        >
          <div className="text-center">
            <div className="mask-parent">
              <span
                ref={stmtLine1Ref}
                className="mask-child gpu"
                style={{
                  fontFamily: 'var(--font-cormorant), serif',
                  fontWeight: 300,
                  fontSize: 'clamp(28px, 5vw, 72px)',
                  color: '#faf7f2',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                }}
              >
                We don&rsquo;t make websites.
              </span>
            </div>
            <div className="mask-parent">
              <span
                ref={stmtLine2Ref}
                className="mask-child gpu"
                style={{
                  fontFamily: 'var(--font-cormorant), serif',
                  fontWeight: 300,
                  fontSize: 'clamp(28px, 5vw, 72px)',
                  color: '#faf7f2',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                }}
              >
                We build presence.
              </span>
            </div>
          </div>
        </div>

        {/* Z-4 — Headline + cards mobile wrapper (md:contents = invisible on desktop) */}
        <div
          className="max-md:absolute max-md:bottom-[20%] max-md:left-4 max-md:right-4 max-md:flex max-md:flex-col md:contents"
          style={{ zIndex: 4 }}
        >

        {/* Headline + qualifying statement (bottom-left) */}
        <div
          ref={headlineRef}
          className="gpu max-md:relative md:absolute flex flex-col max-md:left-2 max-md:right-2 md:bottom-[80px] md:left-[48px]"
          style={{
            textAlign: 'left',
            willChange: 'transform',
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
                fontFamily: 'var(--font-cormorant), serif',
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
                fontFamily: 'var(--font-cormorant), serif',
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

        {/* Beat 1: Contact Form — flows below headline on mobile, bottom-right on desktop */}
        <div
          ref={cardsWrapperRef}
          className="max-md:relative max-md:mt-6 max-md:left-2 md:absolute md:bottom-[80px] md:left-auto md:right-12 flex flex-col max-md:items-start md:items-end gap-0 z-10"
          style={{ willChange: 'transform, opacity' }}
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
            zIndex: 4,
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

        {/* Z-5 — Coordinate metadata (Beat 2) */}
        <span
          ref={coordLeftRef}
          className="absolute hidden md:block gpu"
          style={{
            left: 48,
            bottom: 48,
            zIndex: 5,
            opacity: 0,
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: 11,
            letterSpacing: '0.15em',
            color: '#ededea',
            textTransform: 'uppercase',
          }}
        >
          Cyprus · Greece · Europe
        </span>
        <span
          ref={coordRightRef}
          className="absolute hidden md:block gpu"
          style={{
            right: 48,
            bottom: 48,
            zIndex: 5,
            opacity: 0,
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: 11,
            letterSpacing: '0.15em',
            color: '#ededea',
            textTransform: 'uppercase',
          }}
        >
          Est. 2023
        </span>
      </div>
    </div>
  )
}
