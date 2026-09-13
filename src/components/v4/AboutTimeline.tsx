'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, EASE } from '@/lib/motion-v4'
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
 * THE DIGIT — AN ODOMETER (2026-09-13, user: "the number changing needs
 * optimizing"). The year's last digit is no longer a stack of layers
 * swapped by visibility: it is one strip of the ten digits, and the
 * strip slides one em per digit to the year's digit. 2 → 5 passes 3 and
 * 4 on the way,
 * like a counter; scrolling back runs it down. One transform on one
 * element, so a fast scroll that lands mid-roll simply retargets the
 * tween (overwrite) — nothing is left half-visible, and there is no
 * blur filter re-rasterising an 11rem glyph every frame.
 *
 * THE OTHER VOICES. The label, the plate and the caption still roll as
 * layers: the leaving one travels up out of its crop, the arriving one
 * rises in from below, on the same clock as the digit. Interrupt-safe:
 * a new roll hides every layer that is neither leaving nor arriving,
 * and an arriving layer caught mid-transit continues from where it is.
 * No blur in transit — the plate's roll carries a slight scale instead,
 * so the picture reads as sliding under the frame (and under the
 * frame's grain, which is on the frame, not the plate — about.css).
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

export default function AboutTimeline({
  children,
  count,
  digits: yearDigits,
}: {
  children: ReactNode
  count: number
  /** the last digit of each year, in entry order */
  digits: number[]
}) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const stage = root.querySelector<HTMLElement>('.ab-tl-stage')
    if (!stage) return

    /* the voices, each a list of layers in entry order */
    const voice = (sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel))
    const strip = root.querySelector<HTMLElement>('.ab-tl-strip')
    const labels = voice('.ab-tl-label')
    const plates = voice('.ab-tl-plate')
    const caps = voice('.ab-tl-cap')
    const ring = root.querySelector<SVGCircleElement>('.ab-tl-ring')
    const badge = root.querySelector<HTMLElement>('.ab-tl-badge')
    const n = count
    const layers: HTMLElement[][] = [labels, plates, caps]

    /* the wrapper's height is the pin's length: the first viewport plus a
       step per change plus the hold */
    root.style.setProperty('--ab-tl-len', `${100 + (n - 1) * STEP * 100 + HOLD * 100}svh`)

    let index = 0
    let tl: gsap.core.Timeline | null = null

    const progress = (i: number) => 1 - (n > 1 ? i / (n - 1) : 1)

    /* the resting frame for entry i: one layer per voice, the strip on
       the digit, the ring at the index */
    const show = (i: number) => {
      layers.forEach((v) =>
        v.forEach((el, j) => {
          el.style.visibility = j === i ? 'visible' : 'hidden'
          gsap.set(el, { clearProps: 'transform' })
        }),
      )
      if (strip) gsap.set(strip, { y: `${-(yearDigits[i] ?? 0)}em` })
      if (ring) gsap.set(ring, { strokeDashoffset: progress(i) })
    }

    const roll = (from: number, to: number) => {
      const dir = to > from ? 1 : -1
      tl?.kill()
      tl = gsap.timeline({
        defaults: { overwrite: 'auto' },
        onComplete: () => {
          show(to)
          tl = null
        },
      })

      /* the digit: the strip slides to the year's digit, through the
         ones between — the counter's own direction, not the hand's */
      if (strip) {
        tl.to(strip, { y: `${-(yearDigits[to] ?? 0)}em`, duration: ROLL, ease: EASE.arc }, 0)
      }

      const pairs: [HTMLElement[], number][] = [
        [labels, 0.05],
        [plates, 0.04],
        [caps, 0.08],
      ]
      pairs.forEach(([v, at]) => {
        const a = v[from]
        const b = v[to]
        if (!a || !b) return
        const isPlate = v === plates
        /* anything that is neither leaving nor arriving is parked — this
           is what a killed roll would otherwise leave half-way up */
        v.forEach((el) => {
          if (el !== a && el !== b) {
            el.style.visibility = 'hidden'
            gsap.set(el, { clearProps: 'transform' })
          }
        })
        /* the arriving layer starts below the crop unless it is already
           in transit from an interrupted roll — then it continues */
        if (b.style.visibility !== 'visible') {
          gsap.set(b, { visibility: 'visible', yPercent: 104 * dir, scale: isPlate ? 1.06 : 1 })
        }
        tl!.to(a, { yPercent: -104 * dir, duration: ROLL, ease: EASE.arc, scale: isPlate ? 0.96 : 1 }, at)
        tl!.to(b, { yPercent: 0, duration: ROLL, ease: EASE.arc, scale: 1 }, at)
      })
      if (ring) {
        tl.to(ring, { strokeDashoffset: progress(to), duration: ROLL, ease: EASE.arc }, 0)
      }
    }

    show(0)

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
      layers.forEach((v) =>
        v.forEach((el) => {
          el.style.visibility = ''
          gsap.set(el, { clearProps: 'transform' })
        }),
      )
      if (strip) gsap.set(strip, { clearProps: 'transform' })
      if (ring) gsap.set(ring, { clearProps: 'strokeDashoffset' })
      root.style.removeProperty('--ab-tl-len')
    }
  }, [count, yearDigits])

  return (
    <section ref={ref} className="ab-time" aria-label="How it went">
      {children}
    </section>
  )
}
