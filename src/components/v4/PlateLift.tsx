'use client'

import { useEffect } from 'react'
import { gsap, rem } from '@/lib/motion-v4'

/**
 * THE PARTING, for every picture (2026-09-18, user: "I also like the
 * exit animation of the infographic on the hero. I want all images to
 * have it like that").
 *
 * The hero's artboard does not scroll away with the page: as the hero
 * leaves, the board LIFTS against the scroll and TIPS a few degrees,
 * while the word under it sinks — the two part (RunBrief.tsx,
 * PART_BOARD / --rb-tip). This gives the same exit to any picture on
 * the page: mark it `data-lift` and it parts the same way once it is
 * past the middle of the screen.
 *
 * WHAT IT WRITES, per marked element: `--k-lift` (px, negative — the
 * rise) and `--k-tip` (deg). The CSS that reads them is in tokens.css
 * (`[data-lift]`), one transform, so a driver that owns the element's
 * own transform is never fought: mark the FRAME, never the print
 * inside it.
 *
 * THE CLOCK. One gsap.ticker for every marked element on the page, one
 * rect each per frame, and a write only when the value moves. Elements
 * are re-collected on resize (a lazy picture can arrive late). Reduced
 * motion: nothing is written at all.
 */

/** how far a picture rises on its way out (rem) and how far it tips (deg) */
const LIFT = -5.5
const TIP = 5
/** the exit starts when the picture's middle is this far up the screen */
const FROM = 0.52

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

export default function PlateLift() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(max-width: 57.5rem)').matches) return

    let plates: { el: HTMLElement; q: number }[] = []
    const collect = () => {
      plates = Array.from(document.querySelectorAll<HTMLElement>('[data-lift]')).map((el) => ({ el, q: -1 }))
    }
    collect()
    const ro = new ResizeObserver(collect)
    ro.observe(document.body)

    const tick = () => {
      const vh = window.innerHeight
      const unit = 16 * rem()
      for (const p of plates) {
        const r = p.el.getBoundingClientRect()
        if (r.bottom < -vh * 0.3 || r.top > vh) {
          /* off screen below: hold the resting frame, so it arrives flat */
          if (r.top > vh && p.q !== 0) {
            p.q = 0
            p.el.style.removeProperty('--k-lift')
            p.el.style.removeProperty('--k-tip')
          }
          continue
        }
        const mid = r.top + r.height / 2
        const q = clamp01((vh * FROM - mid) / (vh * FROM + r.height * 0.5))
        if (Math.abs(q - p.q) < 0.0008) continue
        p.q = q
        if (q <= 0) {
          p.el.style.removeProperty('--k-lift')
          p.el.style.removeProperty('--k-tip')
        } else {
          /* eased, so the parting starts gently and carries on out */
          const e = q * q * (3 - 2 * q)
          p.el.style.setProperty('--k-lift', `${(e * LIFT * unit).toFixed(1)}px`)
          p.el.style.setProperty('--k-tip', `${(e * TIP).toFixed(2)}deg`)
        }
      }
    }
    tick()
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      ro.disconnect()
      plates.forEach(({ el }) => {
        el.style.removeProperty('--k-lift')
        el.style.removeProperty('--k-tip')
      })
    }
  }, [])

  return null
}
