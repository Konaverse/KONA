'use client'

import { useEffect, useRef } from 'react'
import Reveal from '@/components/v4/Reveal'
import { gsap } from '@/lib/motion-v4'

/**
 * SECTION 3 — WHAT WE SOLVE: the credit roll (user-directed 2026-08-18).
 *
 * The page's first dark passage. The blue refracted-glass portrait is the
 * whole section's background — a sticky 100svh frame inside a ~240svh
 * section — and the problems are thrown into the scene as loose text, no
 * containers: one left, one past centre, scattered, each rolling at its own
 * speed like end credits with depth.
 *
 * TWO PARALLAX SYSTEMS, ONE TICKER:
 *
 * 1. The depth reveal. The section slides UNDER §2 (margin-top −100svh in
 *    CSS; the claim is an opaque z-raised sheet), so by the claim's last
 *    screen this section already fills the viewport, invisible behind it.
 *    The claim then scrolls at hand speed while the image — sticky, plus a
 *    slow counter-drift across the sticky range — runs far slower. The
 *    claim's bottom edge uncovering a near-still image is the depth effect.
 *
 * 2. The credits. Each problem carries a speed (0.72–1.16). Per tick its
 *    layout position is recovered from the rect (minus the transform we
 *    last wrote) and the offset is (centre − vh/2) × (speed − 1): zero as
 *    it crosses the viewport's middle, so items never stray far from where
 *    layout put them, they just travel there at different rates.
 *
 * Entrances are the house Reveal per item (h2 first, body 80ms behind),
 * on top of the rolling wrapper — separate elements, no transform fights.
 *
 * SEO/fallback: all copy is server-rendered real DOM text. No JS or
 * reduced motion still get the sticky background and the static scatter —
 * the layout IS the fallback; the ticker only adds drift.
 *
 * Copy is PLACEHOLDER except where the choreography doc supplies the line —
 * the user writes the real ones (checklist 6.6). Written as the client
 * would say it, per the doc: symptoms, not categories.
 */

const PROBLEMS: { q: string; a: string; speed: number }[] = [
  {
    q: 'Your site looks like everyone else’s.',
    a: 'A template did what templates do. Nothing about it says who you are, and visitors feel that before they can name it.',
    speed: 0.82,
  },
  {
    q: 'Visitors leave before they understand what you do.',
    a: 'The work is good. The site never gets to that part — the story is buried somewhere under the interface.',
    speed: 1.16,
  },
  {
    q: 'The site hasn’t kept up with the business.',
    a: 'You outgrew it years ago. Every update fights the structure it was built on, so nothing ever quite fits.',
    speed: 0.72,
  },
  {
    q: 'You’re invisible where people actually search.',
    a: 'Customers ask search engines and AI the exact questions you answer — and your site never comes up.',
    speed: 1.08,
  },
]

export default function SolveCredits() {
  const rootRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const img = root.querySelector<HTMLElement>('.sv-img')
    const items = Array.from(root.querySelectorAll<HTMLElement>('.sv-item')).map((el) => ({
      el,
      speed: Number(el.dataset.speed) || 1,
      y: 0,
    }))
    let imgY = 0

    const tick = () => {
      const vh = window.innerHeight
      const r = root.getBoundingClientRect()
      if (r.bottom < -200 || r.top > vh + 200) return

      // The background's counter-drift: 0.45× apparent scroll speed, held
      // CONSTANT by scaling the travel with the sticky range itself (0.45 ×
      // (section − viewport), so ~±54vh today) — a fixed travel would slow
      // back down every time the section grows, which is exactly how the
      // first cut (±14vh ≈ 0.2×) earned the user's "barely moving". The
      // .sv-img CSS oversize must always exceed the travel — see home.css.
      const range = Math.max(r.height - vh, 1)
      const p = Math.min(Math.max(-r.top / range, 0), 1)
      const iy = (0.5 - p) * range * 0.45
      if (img && Math.abs(iy - imgY) > 0.05) {
        imgY = iy
        gsap.set(img, { y: iy })
      }

      for (const s of items) {
        const ir = s.el.getBoundingClientRect()
        const centre = ir.top + ir.height / 2 - s.y // layout position, transform removed
        const y = (centre - vh / 2) * (s.speed - 1)
        if (Math.abs(y - s.y) > 0.05) {
          s.y = y
          gsap.set(s.el, { y })
        }
      }
    }

    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [])

  return (
    <section ref={rootRef} className="sv">
      <div className="sv-frame" aria-hidden="true">
        {/* decorative — the content is the text riding over it. Eager on
            purpose: it sits exactly one viewport below the fold (the −100svh
            overlap), and a fast flick must never catch a lazy fetch mid-reveal
            — 91KB buys the section's whole first impression. */}
        <img className="sv-img" src="/home/portrait-glass.webp" alt="" />
        <i className="sv-shade" />
      </div>

      <div className="sv-list">
        {PROBLEMS.map((p, i) => (
          <div
            key={i}
            className={`sv-item sv-item-${i + 1} k-stagger`}
            data-speed={p.speed}
          >
            <Reveal as="h2" className="t-h2 sv-q">
              {p.q}
            </Reveal>
            <Reveal as="p" className="t-body sv-a" index={1}>
              {p.a}
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  )
}
