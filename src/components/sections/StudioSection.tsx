'use client'

import { useRef, useLayoutEffect } from 'react'
import Image from 'next/image'
import { gsap, ScrollTrigger } from '@/utils/gsap'

// ─── Team data ────────────────────────────────────────────────────────────────

const TEAM = [
  {
    image: '/About/konstantinos.jpg',
    firstName: 'Konstantinos',
    nickname: 'THE ARCHITECT',
    role: 'Developer',
    bio: 'Crafting precise, high-performance systems and interactive experiences.'
  },
  {
    image: '/About/nabil.jpg',
    firstName: 'Nabil',
    nickname: 'THE VISIONARY',
    role: 'Designer',
    bio: 'Directing cinematic brand narratives with an uncompromising eye for detail.'
  },
] as const

// ─── Component ────────────────────────────────────────────────────────────────

export default function StudioSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const statementRef = useRef<HTMLDivElement>(null)
  const paragraphRef = useRef<HTMLParagraphElement>(null)
  const portraitsRef = useRef<(HTMLDivElement | null)[]>([])
  const imageWrappersRef = useRef<(HTMLDivElement | null)[]>([])

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {

      // ── Opening statement: fade + translate up on scroll enter ───────────
      if (statementRef.current) {
        gsap.fromTo(
          statementRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: statementRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // ── Paragraph: slight delay after statement ───────────────────────────
      if (paragraphRef.current) {
        gsap.fromTo(
          paragraphRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            delay: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: paragraphRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // ── Portraits Entrance & Parallax ──────────────────────────
      portraitsRef.current.forEach((portrait, i) => {
        if (!portrait) return

        // 1. Entrance animation
        gsap.fromTo(
          portrait,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: portrait,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )

        // 2. Parallax scrub on the image inside
        const imgWrapper = imageWrappersRef.current[i]
        if (imgWrapper) {
          gsap.fromTo(
            imgWrapper,
            { yPercent: -15 },
            {
              yPercent: 15,
              ease: 'none',
              scrollTrigger: {
                trigger: portrait,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          )
        }
      })

      // ── Refresh after mount ───────────────────────────────────────────────
      const t = setTimeout(() => ScrollTrigger.refresh(), 100)
      return () => clearTimeout(t)

    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="studio"
      className="section-padding container-padding"
      style={{
        backgroundColor: '#e6e3da', // Calm beige
        overflow: 'hidden',
      }}
    >
      {/* ── Opening statement — centered ──────────────────────────────────── */}
      <div
        ref={statementRef}
        style={{
          textAlign: 'center',
          marginBottom: '32px',
          willChange: 'transform',
        }}
      >
        <h2
          className="font-display"
          style={{
            fontSize: 'clamp(44px, 6vw, 82px)',
            fontWeight: 300,
            color: '#111111',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            whiteSpace: 'pre-line',
          }}
        >
          {`Two perspectives.\nOne standard.`}
        </h2>
      </div>

      {/* ── Paragraph — centered, max-width 520px ────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '120px' }}>
        <p
          ref={paragraphRef}
          className="font-sans"
          style={{
            fontSize: 'clamp(16px, 1.2vw, 18px)',
            fontWeight: 300,
            color: '#2a2622',
            lineHeight: 1.7,
            maxWidth: '520px',
            textAlign: 'center',
            willChange: 'transform',
          }}
        >
          Konaverse is a two-person studio built on the belief that the best
          digital work comes from the intersection of technical precision and
          visual storytelling. We don't scale. We focus.
        </p>
      </div>

      {/* ── Portrait pair (Staggered Layout) ──────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: 'clamp(40px, 8vw, 120px)',
          flexWrap: 'wrap',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {TEAM.map((member, i) => {
          const isRight = i === 1
          return (
            <div
              key={member.firstName}
              ref={el => { portraitsRef.current[i] = el }}
              className="portrait-container"
              style={{
                willChange: 'transform',
                // Stagger the second member dramatically lower on desktop
                marginTop: isRight ? 'clamp(0px, 15vw, 200px)' : '0px',
              }}
            >
              {/* Image Window (Mask) */}
              <div
                className="portrait-wrap group"
                style={{
                  position: 'relative',
                  width: 'clamp(280px, 32vw, 460px)',
                  aspectRatio: '3 / 4',
                  overflow: 'hidden',
                  marginBottom: '28px',
                  cursor: 'pointer',
                  backgroundColor: '#d8d5cc',
                }}
              >
                {/* Parallax moving element */}
                <div
                  ref={el => { imageWrappersRef.current[i] = el }}
                  style={{
                    position: 'absolute',
                    top: '-20%',
                    left: 0,
                    width: '100%',
                    height: '140%',
                    willChange: 'transform',
                  }}
                >
                  <Image
                    src={member.image}
                    alt={member.firstName}
                    fill
                    sizes="(max-width: 768px) 90vw, 32vw"
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center top',
                    }}
                    className="grayscale mix-blend-normal transition-all duration-700 ease-out group-hover:grayscale-0"
                  />
                </div>

                {/* Hover Dark Overlay */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100"
                />

                {/* Hover Content */}
                <div
                  className="absolute bottom-0 left-0 w-full opacity-0 translate-y-[15px] transition-all duration-700 ease-out group-hover:opacity-100 group-hover:translate-y-0"
                  style={{ padding: '32px 28px' }}
                >
                  <p
                    className="font-sans"
                    style={{
                      color: '#faf7f2', // Perfect contrast on dark overlay
                      fontSize: 'clamp(14px, 1.1vw, 16px)',
                      fontWeight: 300,
                      lineHeight: 1.6,
                    }}
                  >
                    {member.bio}
                  </p>
                </div>
              </div>

              {/* Text Info — High Contrast */}
              <div style={{ paddingLeft: '8px' }}>
                {/* Name */}
                <p
                  className="font-display"
                  style={{
                    fontSize: 'clamp(26px, 2.5vw, 34px)',
                    fontWeight: 400,
                    color: '#111111', // Very dark, high contrast
                    lineHeight: 1.1,
                    marginBottom: '8px',
                  }}
                >
                  {member.firstName}
                </p>

                {/* Nickname */}
                <p
                  className="font-mono uppercase"
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.15em',
                    color: '#4A5443', // Darkened Sage
                    marginBottom: '6px',
                    fontWeight: 500,
                  }}
                >
                  {member.nickname}
                </p>

                {/* Role */}
                <p
                  className="font-sans"
                  style={{
                    fontSize: '14px',
                    fontWeight: 400, // Boosted weight
                    color: '#5C5449', // Darkened Warm Sand
                  }}
                >
                  {member.role}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .portrait-container {
            margin-top: 0 !important;
            margin-bottom: 60px;
          }
        }
      `}</style>
    </section>
  )
}
