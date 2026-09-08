'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from '@/lib/motion-v4'

/**
 * THE HUB'S LIST — the services section (rebuilt 2026-09-09 to the user's
 * reference, image.png at the repo root: "a long, maybe 300vh section
 * that's not pinned. Simple yet elegant").
 *
 * THE PAGE. A lead paragraph with a small label at its left, then one row
 * per service split by hairlines — the number, the title, a short text —
 * in flow, unpinned, on paper. THE STACK (user, same day): the rows are
 * sticky CARDS that never leave (hub.css) — each sticks a title-and-a-half
 * below the one before, covering the card above and leaving the top half
 * of its title showing. The markup is the page (page.tsx); this wrapper
 * adds two things and nothing else:
 *
 * THE COVER. The hero before this section is sticky (hub.css); the
 * section, opaque and above it, scrolls up over it as any section would,
 * and the hero drifts up a little and takes a shade beneath (--sh-cover,
 * written per frame from this section's top), so the cover reads as
 * depth.
 *
 * THE ROW REVEAL. As a row enters (15% in, the house threshold) its
 * hairline draws from the left, its title rises through a crop edge and
 * its number and text resolve after it — the house reveal, once, CSS
 * transitions on `is-in`.
 *
 * No JS: the rows are visible (the noscript rule in page.tsx). Reduced
 * motion: everything is in at once.
 */

const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1)

export default function HubList({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const rows = Array.from(root.querySelectorAll<HTMLElement>('.sh-row'))
    const prev = root.previousElementSibling
    const hero = prev instanceof HTMLElement && prev.classList.contains('sh-hero') ? prev : null

    /* THE ROW REVEAL */
    let io: IntersectionObserver | null = null
    if (reduce) {
      rows.forEach((r) => r.classList.add('is-in'))
    } else {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return
            e.target.classList.add('is-in')
            io?.unobserve(e.target)
          })
        },
        { threshold: 0.15 },
      )
      rows.forEach((r) => io?.observe(r))
    }

    /* THE COVER, one ticker subscription */
    let lastC = -1
    const tick = () => {
      if (!hero) return
      const r = root.getBoundingClientRect()
      const c = clamp01(1 - r.top / window.innerHeight)
      if (c !== lastC) {
        lastC = c
        hero.style.setProperty('--sh-cover', c.toFixed(4))
      }
    }
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      io?.disconnect()
      hero?.style.removeProperty('--sh-cover')
      rows.forEach((r) => r.classList.remove('is-in'))
    }
  }, [])

  return (
    <section ref={ref} className="sh-index" aria-label="Our services">
      {children}
    </section>
  )
}
