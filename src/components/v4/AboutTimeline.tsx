'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, EASE, rem } from '@/lib/motion-v4'
import { getLenis } from '@/components/v4/SmoothScroll'

/**
 * HOW IT WENT — THE ROLL (2026-09-11, the user's frame "timeline
 * section.png": "202 stays pinned and doesn't change, only the last
 * number changes, by rolling; on roll the image and the text change;
 * the scroll stays there").
 *
 * THE PIN. The section is a tall wrapper with a sticky stage one
 * viewport high. Each entry owns a stretch of the wrapper's scroll
 * (STEP viewports); the stage holds while the hand scrolls through
 * them, and the index is which stretch the hand is in. Nothing is
 * scrubbed — the change is a MOVE, run once per index change, in the
 * direction the hand went.
 *
 * THE ROLL — one instrument, four voices. When the index changes, the
 * year's last digit, the entry's label, the plate and the caption all
 * roll on the same clock: the leaving voice travels up out of its crop,
 * the arriving one rises in from below, a touch of blur in transit
 * (the hub's letter roll, widened to a picture). Scrolling back rolls
 * the other way. The plate's roll carries a slight scale so the picture
 * reads as sliding under the frame rather than a card being swapped.
 *
 * THE BADGE. The dark disc on the plate's corner says what to do and
 * shows where you are: a ring around it fills with the index, and a
 * click on it scrolls the page to the next entry (through Lenis, so the
 * hand's easing applies).
 *
 * No JS: the accessible list of entries (page.tsx, visually hidden
 * otherwise) is shown in flow and the stage is a static first frame.
 */

/** viewports of scroll each entry owns */
const STEP = 0.7
/** the hold on the last entry, in viewports, before the stage releases */
const HOLD = 0.3
/** one roll's travel */
const ROLL = 0.9

export default function AboutTimeline({ children, count }: { children: ReactNode; count: number }) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const stage = root.querySelector<HTMLElement>('.ab-tl-stage')
    if (!stage) return

    /* the voices, each a list of layers in entry order */
    const voice = (sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel))
    const digits = voice('.ab-tl-digit')
    const labels = voice('.ab-tl-label')
    const plates = voice('.ab-tl-plate')
    const caps = voice('.ab-tl-cap')
    const ring = root.querySelector<SVGCircleElement>('.ab-tl-ring')
    const badge = root.querySelector<HTMLElement>('.ab-tl-badge')
    const n = count

    /* the wrapper's height is the pin's length: the first viewport plus a
       step per change plus the hold */
    root.style.setProperty('--ab-tl-len', `${100 + (n - 1) * STEP * 100 + HOLD * 100}svh`)

    let index = 0
    let tl: gsap.core.Timeline | null = null

    const show = (i: number) => {
      ;[digits, labels, plates, caps].forEach((v) =>
        v.forEach((el, j) => {
          el.style.visibility = j === i ? 'visible' : 'hidden'
          el.style.transform = ''
          el.style.filter = ''
        }),
      )
      if (ring) ring.style.strokeDashoffset = String(1 - (n > 1 ? i / (n - 1) : 1))
    }

    const roll = (from: number, to: number) => {
      const dir = to > from ? 1 : -1
      const k = rem()
      tl?.kill()
      tl = gsap.timeline({
        onComplete: () => {
          show(to)
          tl = null
        },
      })
      const pairs: [HTMLElement[], number][] = [
        [digits, 0],
        [labels, 0.05],
        [caps, 0.08],
        [plates, 0.04],
      ]
      pairs.forEach(([v, at]) => {
        const a = v[from]
        const b = v[to]
        if (!a || !b) return
        const isPlate = v === plates
        tl!.set(b, { visibility: 'visible', yPercent: 104 * dir, filter: 'blur(0px)', scale: isPlate ? 1.06 : 1 }, at)
        tl!.to(a, { yPercent: -104 * dir, duration: ROLL, ease: EASE.arc, scale: isPlate ? 0.96 : 1 }, at)
        tl!.to(b, { yPercent: 0, duration: ROLL, ease: EASE.arc, scale: 1 }, at)
        const blur = `blur(${(isPlate ? 4 : 2.5) * k}px)`
        tl!.to([a, b], { filter: blur, duration: ROLL * 0.45, ease: 'sine.inOut' }, at)
        tl!.to([a, b], { filter: 'blur(0px)', duration: ROLL * 0.55, ease: 'sine.out' }, at + ROLL * 0.45)
      })
      if (ring) {
        tl.to(ring, { strokeDashoffset: 1 - (n > 1 ? to / (n - 1) : 1), duration: ROLL, ease: EASE.arc }, 0)
      }
    }

    show(0)
    if (reduce) {
      /* no roll: a hard cut on the same index rule */
    }

    const stepPx = () => window.innerHeight * STEP
    const tick = () => {
      const r = root.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < 0 || r.top > vh) return
      const scrolled = -r.top
      const step = stepPx()
      const next = Math.min(Math.max(Math.floor((scrolled + step * 0.5) / step), 0), n - 1)
      if (next !== index) {
        const from = index
        index = next
        if (reduce) show(next)
        else roll(from, next)
      }
    }
    tick()
    gsap.ticker.add(tick)

    /* the badge: to the next entry (or back to the first at the end) */
    const onBadge = () => {
      const r = root.getBoundingClientRect()
      const top = window.scrollY + r.top
      const to = index < n - 1 ? top + (index + 1) * stepPx() : top
      const lenis = getLenis()
      if (lenis) lenis.scrollTo(to)
      else window.scrollTo({ top: to, behavior: reduce ? 'auto' : 'smooth' })
    }
    badge?.addEventListener('click', onBadge)

    return () => {
      gsap.ticker.remove(tick)
      tl?.kill()
      badge?.removeEventListener('click', onBadge)
      ;[digits, labels, plates, caps].forEach((v) =>
        v.forEach((el) => {
          el.style.visibility = ''
          el.style.transform = ''
          el.style.filter = ''
        }),
      )
      root.style.removeProperty('--ab-tl-len')
    }
  }, [count])

  return (
    <section ref={ref} className="ab-time" aria-label="How it went">
      {children}
    </section>
  )
}
