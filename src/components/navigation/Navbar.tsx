'use client'

import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from '@/utils/gsap'
import MenuOverlay from './MenuOverlay'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const line1 = useRef<HTMLSpanElement>(null)
  const line2 = useRef<HTMLSpanElement>(null)
  const line3 = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Hamburger → X animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (isOpen) {
        gsap.to(line1.current, { rotation: 45, y: 7, duration: 0.3, ease: 'power2.inOut' })
        gsap.to(line2.current, { opacity: 0, duration: 0.15 })
        gsap.to(line3.current, { rotation: -45, y: -7, duration: 0.3, ease: 'power2.inOut' })
      } else {
        gsap.to(line1.current, { rotation: 0, y: 0, duration: 0.3, ease: 'power2.inOut' })
        gsap.to(line2.current, { opacity: 1, duration: 0.3 })
        gsap.to(line3.current, { rotation: 0, y: 0, duration: 0.3, ease: 'power2.inOut' })
      }
    })
    return () => ctx.revert()
  }, [isOpen])

  return (
    <>
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50',
          'flex items-center justify-between',
          'h-[60px] md:h-[72px]',
          'px-[24px] md:px-[48px]',
          scrolled ? 'bg-[rgba(10,10,10,0.75)] backdrop-blur-[8px]' : 'bg-transparent',
        ].join(' ')}
        style={{ transition: 'background-color 400ms ease, backdrop-filter 400ms ease' }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image
            src="/About/KonaLogoNoBg.png"
            alt="Konaverse"
            width={80}
            height={32}
            style={{ height: 32, width: 'auto' }}
            priority
          />
        </Link>

        {/* Right — CTA + Hamburger */}
        <div className="flex items-center gap-8">
          {/* CTA button */}
          <Link
            href="/contact"
            className="font-mono text-[11px] tracking-[0.15em] uppercase text-[#faf7f2] bg-transparent border border-[#6b7f62] rounded-none px-[28px] py-[12px] cursor-pointer hover:bg-[#6b7f62] hover:text-[#0a0a0a] transition-colors duration-300"
          >
            <span className="hidden xs:inline">Start a Project</span>
            <span className="xs:hidden">Talk</span>
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Toggle menu"
            className="group flex flex-col items-center justify-center gap-[6px] w-10 h-10 flex-shrink-0 cursor-pointer"
          >
            <span
              ref={line1}
              className={`block w-6 h-px transition-colors duration-300 bg-[#ededea] ${!isOpen ? 'group-hover:bg-[#6b7f62]' : ''}`}
            />
            <span
              ref={line2}
              className={`block w-6 h-px transition-colors duration-300 bg-[#ededea] ${!isOpen ? 'group-hover:bg-[#6b7f62]' : ''}`}
            />
            <span
              ref={line3}
              className={`block w-6 h-px transition-colors duration-300 bg-[#ededea] ${!isOpen ? 'group-hover:bg-[#6b7f62]' : ''}`}
            />
          </button>
        </div>
      </header>

      <MenuOverlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
