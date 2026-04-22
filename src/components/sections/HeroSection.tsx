'use client'

import { useRef, useLayoutEffect } from 'react'
import Image from 'next/image'
import { gsap, ScrollTrigger } from '@/utils/gsap'

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
  const cardARef = useRef<HTMLDivElement>(null)
  const cardBRef = useRef<HTMLDivElement>(null)
  const cardCRef = useRef<HTMLDivElement>(null)
  const cardsWrapperRef = useRef<HTMLDivElement>(null)

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

      // Info cards — same timing as headline
      const cards = [cardARef.current, cardBRef.current, cardCRef.current]
      gsap.set(cards, { opacity: 0, y: 20 })
      entranceTl.to(cards, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.1,
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
        transformOrigin: 'bottom right',
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
            src="/General/hero image.png"
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

        {/* Z-4 — Headline + qualifying statement (bottom-left) */}
        <div
          ref={headlineRef}
          className="gpu absolute flex flex-col max-md:top-[17vh] max-md:left-6 max-md:right-6 md:bottom-[80px] md:left-[48px]"
          style={{
            zIndex: 4,
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

        {/* Z-4 — Beat 1: Info cards (bottom-right) */}
        <div
          ref={cardsWrapperRef}
          className="absolute md:inset-0 max-md:bottom-6 max-md:left-4 max-md:right-4 max-md:top-auto max-md:flex max-md:flex-row max-md:gap-2 pointer-events-none"
          style={{ zIndex: 4, willChange: 'transform, opacity' }}
        >
          {/* Card A — bottom-right corner */}
          <div
            ref={cardARef}
            className="absolute md:block gpu max-md:relative max-md:flex-1 max-md:min-w-0 max-md:flex max-md:flex-col justify-center md:bottom-[48px] md:right-[48px]"
            style={{
              background: 'rgba(10,10,10,0.55)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(107,127,98,0.25)',
              padding: 'clamp(10px,2.5vw,16px) clamp(12px,3vw,20px)',
              willChange: 'transform, opacity',
            }}
          >
            <span style={{ display: 'block', fontFamily: 'var(--font-geist-mono), monospace', fontSize: 11, color: 'var(--color-sage)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>04</span>
            <span style={{ display: 'block', fontFamily: 'var(--font-cormorant), serif', fontWeight: 300, fontSize: 'clamp(16px,4vw,22px)', color: '#ffffff', marginBottom: 4 }}>Projects</span>
            <span className="max-md:hidden" style={{ display: 'block', fontFamily: 'var(--font-dm-sans), sans-serif', fontWeight: 300, fontSize: 11, color: 'rgba(250,247,242,0.5)' }}>Delivered</span>
          </div>

          {/* Card B — above Card A */}
          <div
            ref={cardBRef}
            className="absolute md:block gpu max-md:relative max-md:flex-1 max-md:min-w-0 max-md:flex max-md:flex-col justify-center md:bottom-[168px] md:right-[48px]"
            style={{
              background: 'rgba(10,10,10,0.55)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(107,127,98,0.25)',
              padding: 'clamp(10px,2.5vw,16px) clamp(12px,3vw,20px)',
              willChange: 'transform, opacity',
            }}
          >
            <span style={{ display: 'block', fontFamily: 'var(--font-geist-mono), monospace', fontSize: 11, color: 'var(--color-sage)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>Since</span>
            <span style={{ display: 'block', fontFamily: 'var(--font-cormorant), serif', fontWeight: 300, fontSize: 'clamp(16px,4vw,22px)', color: '#ffffff', marginBottom: 4 }}>2023</span>
            <span className="max-md:hidden" style={{ display: 'block', fontFamily: 'var(--font-dm-sans), sans-serif', fontWeight: 300, fontSize: 11, color: 'rgba(250,247,242,0.5)' }}>Cyprus · Greece · Europe</span>
          </div>

          {/* Card C — left of Card A */}
          <div
            ref={cardCRef}
            className="absolute md:block gpu max-md:relative max-md:flex-1 max-md:min-w-0 max-md:flex max-md:flex-col justify-center md:bottom-[48px] md:right-[220px]"
            style={{
              background: 'rgba(10,10,10,0.55)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(107,127,98,0.25)',
              padding: 'clamp(10px,2.5vw,16px) clamp(12px,3vw,20px)',
              willChange: 'transform, opacity',
            }}
          >
            <span style={{ display: 'block', fontFamily: 'var(--font-geist-mono), monospace', fontSize: 11, color: 'var(--color-sage)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>Now Accepting</span>
            <span style={{ display: 'block', fontFamily: 'var(--font-cormorant), serif', fontWeight: 300, fontSize: 'clamp(16px,4vw,22px)', color: '#ffffff', marginBottom: 4 }}>New Clients</span>
            <span className="max-md:hidden" style={{ display: 'block', fontFamily: 'var(--font-dm-sans), sans-serif', fontWeight: 300, fontSize: 11, color: 'rgba(250,247,242,0.5)' }}>Limited availability</span>
          </div>
        </div>

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
