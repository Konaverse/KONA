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
/**
 * The live instance, module-scoped.
 *
 * Lenis owns scrolling, so anything that needs to *move* the scroll position
 * has to go through it rather than window.scrollTo — notably the page
 * transition, which must land the incoming route at the top instead of
 * inheriting the outgoing route's offset (checklist §5.3). Null under reduced
 * motion, where Lenis is never constructed and native scroll applies; callers
 * must handle that.
 */
let lenis: Lenis | null = null
export const getLenis = () => lenis

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const instance = new Lenis({ lerp: 0.1, smoothWheel: true })
    lenis = instance

    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      if (lenis === instance) lenis = null
    }
  }, [])

  return <>{children}</>
}
