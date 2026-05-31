'use client'

import { useRef, useLayoutEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { gsap, ScrollTrigger } from '@/utils/gsap'

export default function HomeCTA() {
  const ctaSectionRef = useRef<HTMLElement>(null)
  const ctaWrapperRef = useRef<HTMLDivElement>(null)
  const ctaImageRef = useRef<HTMLDivElement>(null)
  const ctaTextRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (ctaSectionRef.current) {
        const isMobile = window.innerWidth < 768
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ctaSectionRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          }
        })

        // Expand clip-path
        tl.fromTo(ctaWrapperRef.current,
          { clipPath: isMobile ? "inset(15% 5% 15% 5% round 2rem)" : "inset(20% 15% 20% 15% round 3rem)" },
          { clipPath: "inset(0% 0% 0% 0% round 0rem)", ease: "power2.inOut" }
        )

        // Zoom out image
        tl.fromTo(ctaImageRef.current,
          { scale: 1.2 },
          { scale: 1, ease: "power2.inOut" },
          "<"
        )

        // Reveal Text
        gsap.to(ctaTextRef.current, {
           opacity: 1,
           y: 0,
           duration: 1,
           ease: "power3.out",
           scrollTrigger: {
             trigger: ctaSectionRef.current,
             start: "center 70%",
             toggleActions: "play none none reverse",
           }
        })
      }
    })
    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={ctaSectionRef}
      className="relative flex items-center justify-center h-screen w-full overflow-hidden bg-[var(--color-obsidian)]"
    >
       <div 
         ref={ctaWrapperRef}
         className="absolute inset-0 w-full h-full will-change-transform"
       >
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full will-change-transform" ref={ctaImageRef}>
            <Image 
              src="/homepage/cta_background.jpeg"
              alt="Build your digital presence"
              fill
              className="object-cover"
              sizes="100vw"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
          </div>

          {/* Text Content */}
          <div 
            ref={ctaTextRef}
            className="absolute inset-0 flex flex-col items-center justify-end text-center p-8 pb-32 md:p-20 md:pb-40 opacity-0 translate-y-12 will-change-transform"
          >
             <span className="font-mono text-[10px] md:text-[12px] tracking-[0.4em] uppercase text-[var(--color-sage)] mb-6 md:mb-8 font-semibold">
               Next Steps
             </span>
             <h2 className="font-display text-4xl md:text-7xl lg:text-8xl mb-12 leading-[1.05] tracking-tight max-w-4xl text-white drop-shadow-2xl">
               Engineering <br/><em className="italic font-light">Authority.</em>
             </h2>
             <Button href="/contact" variant="primary" className="scale-110 md:scale-125 hover:scale-125 transition-transform duration-300">
               Request a Quote
             </Button>
          </div>
       </div>
    </section>
  )
}
