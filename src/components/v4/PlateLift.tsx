'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { gsap, rem } from '@/lib/motion-v4'
import { observeSharedEffectPause } from '@/lib/shared-effects'

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
 * THE CLOCK. Wake on scrolling, resize and route changes; sleep once the
 * transforms settle. Read all plate rects before writing any styles, so one
 * picture's transform cannot force a layout read for the next picture.
 */

/** how far a picture rises on its way out (rem) and how far it tips (deg) */
const LIFT = -5.5
const TIP = 5
/** the exit starts when the picture's middle is this far up the screen */
const FROM = 0.52

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

export default function PlateLift() {
  const pathname = usePathname()
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(max-width: 57.5rem)').matches) return

    let plates: { el: HTMLElement; q: number }[] = []
    let paused = false
    let listening = false
    const stop = () => {
      gsap.ticker.remove(tick)
      listening = false
    }
    const wake = () => {
      if (paused || listening || !plates.length) return
      listening = true
      gsap.ticker.add(tick)
    }
    const io = new IntersectionObserver(wake, { rootMargin: '30% 0px 0px' })
    const collect = () => {
      const previous = new Map(plates.map((p) => [p.el, p.q]))
      io.disconnect()
      plates = Array.from(document.querySelectorAll<HTMLElement>('.k-pt__view [data-lift]')).map((el) => ({ el, q: previous.get(el) ?? -1 }))
      plates.forEach(({ el }) => io.observe(el))
      wake()
    }
    const ro = new ResizeObserver(collect)

    const tick = () => {
      if (paused) return
      const vh = window.innerHeight
      const unit = 16 * rem()
      const rects = plates.map(({ el }) => el.getBoundingClientRect())
      let changed = false
      for (let i = 0; i < plates.length; i++) {
        const p = plates[i]
        const r = rects[i]
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
        changed = true
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
      if (!changed) stop()
    }
    collect()
    ro.observe(document.body)
    window.addEventListener('scroll', wake, { passive: true })
    window.addEventListener('resize', collect)
    const unpause = observeSharedEffectPause((value) => {
      paused = value
      if (paused) stop()
      else collect()
    })

    return () => {
      unpause()
      stop()
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('scroll', wake)
      window.removeEventListener('resize', collect)
      plates.forEach(({ el }) => {
        el.style.removeProperty('--k-lift')
        el.style.removeProperty('--k-tip')
      })
    }
  }, [pathname])

  return null
}
