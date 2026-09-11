'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, rem } from '@/lib/motion-v4'

/**
 * WE REFUSE TO DO — THE CARD'S DRIVER (2026-09-11).
 *
 * THE REVEAL, once, as the card enters (`is-in`, about.css): the
 * heading and the intro resolve, the rows rise one after another, and
 * each refused phrase is STRUCK THROUGH a beat behind the one before.
 * The strike is the section's one idea: these are the industry's
 * habits, crossed out.
 *
 * THE DEPTH. The plate under the card travels slower than the card
 * (the picture is taller than its frame and slides within it), so the
 * type reads as a layer over a ground. Ticker + rect math, transform
 * only.
 */
export default function AboutRefuse({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduce) {
      root.classList.add('is-in')
      return () => root.classList.remove('is-in')
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          root.classList.add('is-in')
          io.unobserve(e.target)
        })
      },
      { threshold: 0.2 },
    )
    io.observe(root)

    const bg = root.querySelector<HTMLElement>('.ab-ref-bg')
    const tick = () => {
      if (!bg) return
      const r = root.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < -200 || r.top > vh + 200) return
      const c = (r.top + r.height / 2 - vh / 2) / vh
      bg.style.transform = `translate3d(0, ${(c * -72 * rem()).toFixed(2)}px, 0)`
    }
    tick()
    gsap.ticker.add(tick)

    return () => {
      io.disconnect()
      gsap.ticker.remove(tick)
      root.classList.remove('is-in')
      if (bg) bg.style.transform = ''
    }
  }, [])

  return (
    <section ref={ref} className="ab-refuse" aria-label="We refuse to do">
      {children}
    </section>
  )
}
