'use client'

import { useEffect, type ReactNode } from 'react'
import Lenis from '@studio-freight/lenis'
import { gsap } from '@/lib/motion-v4'

/**
 * Lenis, driving NATIVE window scroll — no transform wrapper, so position:
 * sticky and IntersectionObserver both keep working. That was a hard-won
 * detail on the previous build and it is worth not relearning.
 *
 * Driven off gsap.ticker rather than its own rAF loop so there is exactly one
 * animation frame source on the page; two loops fighting is how scroll-linked
 * motion ends up a frame behind the scroll position.
 *
 * Disabled outright under prefers-reduced-motion — smoothing IS motion, and
 * hijacked scrolling is a common vestibular trigger.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
