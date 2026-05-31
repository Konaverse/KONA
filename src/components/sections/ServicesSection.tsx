'use client'

import { useRef, useLayoutEffect } from 'react'
import Image from 'next/image'
import { gsap } from '@/utils/gsap'

export default function ServicesSection() {
  const containerRef = useRef<HTMLElement>(null)
  const img1Ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Vertical scrubbed parallax for the inner images
      if (img1Ref.current && img1Ref.current.parentElement) {
        gsap.fromTo(
          img1Ref.current,
          { yPercent: -15 },
          {
            yPercent: 15,
            ease: 'none',
            scrollTrigger: {
              trigger: img1Ref.current.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        )
      }



      // 2. Text entrance reveals
      // We select elements that have the 'reveal-target' class.
      const reveals = gsap.utils.toArray<HTMLElement>('.reveal-target')
      reveals.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="section-padding"
      style={{
        background: '#0a0a0a',
        color: '#faf7f2',
      }}
    >
      {/* ── Header Introduction ──────────────────────────────── */}
      <div
        className="px-6 md:px-12"
        style={{
          marginLeft: 'clamp(24px, 5vw, 80px)',
          marginRight: 'clamp(24px, 5vw, 80px)',
          marginBottom: 'clamp(100px, 15vw, 200px)',
        }}
      >
        <h2
          className="reveal-target max-md:text-6xl max-md:text-[var(--color-sage)]"
          style={{
            fontFamily: 'var(--font-cormorant), serif',
            fontWeight: 300,
            fontSize: 'clamp(48px, 8vw, 96px)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            marginBottom: 40,
            willChange: 'transform, opacity',
          }}
        >
          Core Expertise
        </h2>
        <p
          className="reveal-target"
          style={{
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontWeight: 300,
            fontSize: 'clamp(16px, 1.5vw, 20px)',
            color: 'rgba(250,247,242,0.7)',
            maxWidth: 640,
            lineHeight: 1.7,
            willChange: 'transform, opacity',
          }}
        >
          We engineer high-end digital experiences using modern, scalable architectures 
          that load instantly and interact seamlessly. No agency bloat. Just direct 
          partnership and uncompromising quality.
        </p>
      </div>

      {/* ── Service 01: Web Development ──────────────────────── */}
      <div
        className="flex flex-col md:flex-row md:items-center max-md:mb-20 max-md:gap-10"
        style={{
          gap: 'clamp(40px, 8vw, 120px)',
          marginLeft: 'clamp(24px, 5vw, 80px)',
          marginRight: 'clamp(24px, 5vw, 80px)',
          marginBottom: 'clamp(120px, 20vw, 240px)',
        }}
      >
        {/* Text Column (Left on Desktop, Top on Mobile) */}
        <div style={{ flex: 1 }} className="order-2 md:order-1">

          <h3
            className="reveal-target"
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontWeight: 300,
              fontSize: 'clamp(32px, 5vw, 64px)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              marginBottom: 32,
              willChange: 'transform, opacity',
            }}
          >
            Web Development
          </h3>
          <p
            className="reveal-target"
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontWeight: 300,
              fontSize: 'clamp(15px, 1.2vw, 18px)',
              color: 'rgba(250,247,242,0.6)',
              lineHeight: 1.7,
              maxWidth: 500,
              willChange: 'transform, opacity',
            }}
          >
            Digital experiences engineered for performance. We build modern,
            scalable architectures that load instantly and interact seamlessly.
            From headless commerce to bespoke marketing platforms, every line of
            code is intentional.
          </p>
        </div>

        {/* Image Column (Right on Desktop, Bottom on Mobile) */}
        <div
          className="order-1 md:order-2 md:flex-1 relative w-full h-[300px] md:h-[clamp(400px,60vh,800px)] overflow-hidden"
        >
          {/* Inner Parallax Wrap */}
          <div
            ref={img1Ref}
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
              src="/homepage/A_futuristic_workspace_featuring_holographic(web_dev).jpeg"
              fill
              alt="Web development"
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>


    </section>
  )
}
