'use client'

import { useRef, useLayoutEffect } from 'react'
import Image from 'next/image'
import { gsap, ScrollTrigger } from '@/utils/gsap'

/* ── Project data ──────────────────────────────────────────── */
const PROJECTS = [
  {
    num: '01',
    client: 'GL Metal Works',
    img: '/Projects/glmetalworks.png',
    desc: 'Industrial metalwork fabrication studio',
    tag: 'WEB DEVELOPMENT · 2024',
    year: '2024',
  },
  {
    num: '02',
    client: 'Los Santos Barbershop',
    img: '/Projects/lossantosbarbers.png',
    desc: 'Premium grooming experience, Limassol',
    tag: 'WEB DEVELOPMENT · 2024',
    year: '2024',
  },
  {
    num: '03',
    client: 'S Ivory Design',
    img: '/Projects/sivory_macbook.png',
    desc: 'Luxury interior design studio',
    tag: 'WEB DEVELOPMENT · 2024',
    year: '2024',
  },
  {
    num: '04',
    client: 'Velricon',
    img: '/Projects/velricon.png',
    desc: 'Engineering & construction solutions',
    tag: 'WEB DEVELOPMENT · 2025',
    year: '2025',
  },
]

export default function ProjectsSection() {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRefs = useRef<(HTMLDivElement | null)[]>([])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Match original: always use window.innerHeight (no mobile distinction)
      canvasRefs.current.slice(0, -1).forEach((canvasEl, index) => {
        if (!canvasEl) return

        gsap.set(canvasEl, { yPercent: 0 })

        gsap
          .timeline({
            scrollTrigger: {
              id: `canvas-${index}`,
              trigger: rootRef.current,
              start: () => `top+=${window.innerHeight * index} top`,
              end: () => `+=${(PROJECTS.length - 1) * window.innerHeight}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
          .to(canvasEl, { yPercent: 100 })
      })

      setTimeout(() => ScrollTrigger.refresh(), 100)
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="section-padding" style={{ background: '#111111' }}>
      {/* ── Section header (not part of stack) ──────────── */}
      <div className="container-padding" style={{ paddingBottom: 60 }}>
        <h2
          className="text-[clamp(48px,6vw,80px)]"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 300,
            color: '#faf7f2',
            letterSpacing: '-0.02em',
            lineHeight: 1.0,
          }}
        >
          Selected Work
        </h2>
      </div>

      {/* ── Stacking cards root ─────────────────────────── */}
      {/*
       * max-md:!flex + max-md:flex-col: on mobile, stack cards vertically
       * (original innerContainer: display:flex; flex-direction:column on mobile)
       */}
      <div
        ref={rootRef}
        className="container-padding max-md:px-4 max-md:!flex max-md:flex-col"
        style={{
          position: 'relative',
          display: 'block',
          contain: 'paint',
          borderRadius: 'clamp(12px, 1.5vw, 24px)',
        }}
      >
        {PROJECTS.map((project, index) => {
          const isLast = index === PROJECTS.length - 1

          return (
            /* ── Card container ───────────────────────── */
            /* Desktop: 100svh | Mobile: 50svh (original .card mobile height) */
            <div
              key={project.num}
              className="w-full max-md:h-[50svh] md:h-svh"
              style={{
                display: 'block',
                position: 'relative',
                contain: 'paint',
                cursor: 'pointer',
                borderRadius: 'clamp(12px, 1.5vw, 24px)',
              }}
              onMouseEnter={(e) => {
                const canvas = e.currentTarget.querySelector<HTMLDivElement>('[data-canvas]')
                if (canvas) canvas.style.opacity = '0.85'
              }}
              onMouseLeave={(e) => {
                const canvas = e.currentTarget.querySelector<HTMLDivElement>('[data-canvas]')
                if (canvas) canvas.style.opacity = '0.4'
              }}
            >
              {/*
               * LAYER 1 — projectsWrap
               * Desktop: top = 0 (first) or -100svh (rest), height = 200svh (last) or ${200+100*i}svh
               * Mobile:  top = 0 (first) or -50svh  (rest), height = 100svh (last) or ${200+100*i}svh
               * (matches original isMobile conditional inline styles exactly)
               */}
              <div
                className={[
                  index > 0 ? 'max-md:!top-[-50svh]' : '',
                  isLast ? 'max-md:!h-[100svh]' : '',
                ].filter(Boolean).join(' ')}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  width: '100%',
                  zIndex: 1,
                  pointerEvents: 'none',
                  willChange: 'transform',
                  height: isLast
                    ? '200svh'
                    : `${200 + 100 * index}svh`,
                  top: index === 0 ? 0 : '-100svh',
                }}
              >
                {/*
                 * Sticky child — pins to viewport top
                 * Desktop: height 100svh | Mobile: height 50svh (original .container mobile)
                 */}
                <div
                  className="max-md:!h-[50svh] max-md:!top-[25svh]"
                  style={{
                    position: 'sticky',
                    top: 0,
                    height: '100svh',
                    width: '100%',
                    transform: 'translateZ(0)',
                    willChange: 'transform',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'clamp(24px, 4vw, 64px)',
                    paddingLeft: 'clamp(24px, 4vw, 64px)',
                    paddingRight: 'clamp(24px, 4vw, 64px)',
                  }}
                >
                  {/* ── Left half: text + View Project (hidden on mobile) ── */}
                  <div
                    className="w-full md:w-1/2 max-md:hidden"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      pointerEvents: 'auto',
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 400,
                        fontSize: 11,
                        color: 'var(--color-sage)',
                        marginBottom: 16,
                      }}
                    >
                      {project.num}
                    </span>
                    <h3
                      className="text-[clamp(32px,8vw,72px)]"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 300,
                        color: '#ffffff',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.0,
                        marginBottom: 16,
                      }}
                    >
                      {project.client}
                    </h3>
                    <p
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontWeight: 300,
                        fontSize: 'clamp(13px, 1.2vw, 16px)',
                        color: '#ededea',
                        opacity: 0.7,
                        marginBottom: 20,
                      }}
                    >
                      {project.desc}
                    </p>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 400,
                        fontSize: 11,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'var(--color-sage)',
                        marginBottom: 32,
                      }}
                    >
                      {project.tag}
                    </span>

                    {/* View Project link */}
                    <a
                      href="#"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 400,
                        fontSize: 11,
                        color: '#ffffff',
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                        position: 'relative',
                        paddingBottom: 4,
                        transition: 'color 300ms ease',
                        alignSelf: 'flex-start',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--color-sage)'
                        const u = e.currentTarget.querySelector<HTMLSpanElement>('[data-line]')
                        if (u) u.style.transform = 'scaleX(1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#ffffff'
                        const u = e.currentTarget.querySelector<HTMLSpanElement>('[data-line]')
                        if (u) u.style.transform = 'scaleX(0)'
                      }}
                    >
                      View Project →
                      <span
                        data-line=""
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: 1,
                          background: 'var(--color-sage)',
                          transform: 'scaleX(0)',
                          transformOrigin: 'left center',
                          transition: 'transform 300ms ease',
                        }}
                      />
                    </a>
                  </div>

                  {/*
                   * ── Right half: mockup card ────────────────────────────
                   * Desktop: flex, half-width, centered
                   * Mobile:  position:absolute, 83% wide, centered via translate
                   * (matches original .imageContainer mobile styles exactly)
                   */}
                  <div
                    className="flex w-full md:w-1/2 max-md:!absolute max-md:!w-[83%] max-md:!top-1/2 max-md:!left-1/2 max-md:!-translate-x-1/2 max-md:!-translate-y-1/2"
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'auto',
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '1920 / 1080',
                        boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
                      }}
                    >
                      <Image
                        src={project.img}
                        alt={project.client}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 83vw, 50vw"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/*
               * LAYER 2 — canvas (background image + gradient)
               * Fills card via top/right/bottom/left:0 — clipped by contain:paint on card.
               * No mobile overrides needed: card height controls the clip.
               * GSAP animates yPercent: 0 → 100 (slides DOWN revealing next card).
               */}
              <div
                data-canvas
                ref={(el) => {
                  canvasRefs.current[index] = el
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  willChange: 'transform',
                  opacity: 0.4,
                  transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.1, 1)',
                }}
              >
                <Image
                  src={project.img}
                  alt={project.client}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={index === 0}
                />
                {/* Dark gradient — moves WITH the canvas */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.2) 50%, rgba(10,10,10,0) 100%)',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
