'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, rem } from '@/lib/motion-v4'

/**
 * WHO WE ARE — THE PICTURE'S DRIVER (2026-09-11).
 *
 * THE REVEALS. The title's three words rise through their masks as the
 * title enters; each person's block reveals once as it enters (`is-in`,
 * about.css): the plate draws from the page edge it bleeds off, the
 * figure rises onto it, the bio, the name and the portrait resolve a
 * beat apart. IntersectionObserver, 15% in, unobserved once landed.
 *
 * THE TITLE'S PARALLAX (user, 2026-09-11: "WHO moves slow, WE faster,
 * ARE even faster, so that they eventually align"). The three words
 * start stepped down the page and travel up at three rates as the
 * title climbs, and the rates are chosen so the three tops MEET: at the
 * end of the travel "WHO WE ARE" sits on one line. The travel runs
 * while the title climbs from 92% to 38% of the viewport; past that
 * the line holds. The move is on each word's MASK, so the rise inside
 * it (a CSS transition on the word) is untouched.
 *
 * THE PORTRAIT'S PARALLAX (user, same day: "scrolls faster and
 * eventually covers the description, when the description is about to
 * exit"). Each portrait climbs faster than the page — by exactly the
 * distance from its own top to the bio's top — over the bio's travel
 * from entering the viewport to nearly leaving it, so it slides up
 * OVER the description as the description is about to go. Layout tops
 * are read once (offsetTop inside the block), the transform is the
 * portrait's alone (its reveal is opacity and blur only, about.css).
 *
 * THE LAG. The watermark behind everything travels a little slower
 * than the page; the word inside each plate drifts sideways a touch
 * against its tilt. Rect math on the shared ticker, transform only,
 * aria-hidden layers.
 */

/** the travel of the title's collapse, as fractions of the viewport
 *  the title's top climbs through */
const TITLE_FROM = 0.92
const TITLE_TO = 0.38
/** a slight lift for the first word, so it moves too — the other two
 *  add their own step to it and all three meet */
const WHO_LIFT_REM = 1.5

const smooth = (t: number) => t * t * (3 - 2 * t)
const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1)

export default function AboutWho({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const phone = window.matchMedia('(max-width: 57.5rem)').matches
    const targets = Array.from(root.querySelectorAll<HTMLElement>('.ab-who-t, .ab-person'))

    if (reduce) {
      targets.forEach((el) => el.classList.add('is-in'))
      /* no climbing portraits: rest them where the section holds them */
      root.classList.add('is-static')
      return () => {
        targets.forEach((el) => el.classList.remove('is-in'))
        root.classList.remove('is-static')
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          ;(e.target as HTMLElement).classList.add('is-in')
          io.unobserve(e.target)
        })
      },
      { threshold: 0.15 },
    )
    targets.forEach((el) => io.observe(el))

    /* the layers that move */
    const title = root.querySelector<HTMLElement>('.ab-who-t')
    const masks = Array.from(root.querySelectorAll<HTMLElement>('.ab-who-m'))
    const mark = root.querySelector<HTMLElement>('.ab-mark')
    const words = Array.from(root.querySelectorAll<HTMLElement>('.ab-plate-w'))
    const persons = Array.from(root.querySelectorAll<HTMLElement>('.ab-person'))
    /* the portraits' geometry: each with its bio, and the distance the
       portrait must climb to cover it — read from layout (rem-based, so
       it holds through a resize as a ratio of the root) */
    const ports = persons
      .map((p) => {
        const bio = p.querySelector<HTMLElement>('.ab-bio')
        const port = p.querySelector<HTMLElement>('.ab-port')
        return bio && port ? { bio, port } : null
      })
      .filter((x): x is { bio: HTMLElement; port: HTMLElement } => x !== null)
    /* the words' steps: the gap between each word's top and the first's,
       in px at the current root, so the meeting line is exact */
    const steps = masks.map((m) => m.offsetTop - (masks[0]?.offsetTop ?? 0))

    const tick = () => {
      const r = root.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < -200 || r.top > vh + 200) return
      const k = rem()

      /* THE LAG: the section's centre relative to the viewport's, in
         viewport heights — 0 when centred, ±~1 at the edges */
      const c = (r.top + r.height / 2 - vh / 2) / vh
      if (mark) mark.style.transform = `translate3d(0, ${(c * 56 * k).toFixed(2)}px, 0)`
      words.forEach((w, i) => {
        const wr = w.getBoundingClientRect()
        const wc = (wr.top + wr.height / 2 - vh / 2) / vh
        const dir = i === 0 ? 1 : -1
        w.style.setProperty('--ab-dx', `${(wc * dir * 22 * k).toFixed(2)}px`)
      })

      if (phone) return

      /* THE TITLE: the three words collapse onto one line */
      if (title) {
        const top = r.top + title.offsetTop
        const p = smooth(clamp01((vh * TITLE_FROM - top) / (vh * (TITLE_FROM - TITLE_TO))))
        masks.forEach((m, i) => {
          const dy = -(WHO_LIFT_REM * k + steps[i]) * p
          m.style.transform = `translate3d(0, ${dy.toFixed(2)}px, 0)`
        })
      }

      /* THE PORTRAITS: each climbs over its bio as the bio is leaving */
      ports.forEach(({ bio, port }) => {
        const bioTop = r.top + bio.offsetTop
        /* 0 as the bio enters at the bottom, 1 as its top nears the top */
        const p = clamp01((vh - bioTop) / (vh * 0.94))
        const travel = port.offsetTop - bio.offsetTop
        port.style.transform = `translate3d(0, ${(-travel * p).toFixed(2)}px, 0)`
      })
    }
    tick()
    gsap.ticker.add(tick)

    return () => {
      io.disconnect()
      gsap.ticker.remove(tick)
      targets.forEach((el) => el.classList.remove('is-in'))
      if (mark) mark.style.transform = ''
      words.forEach((w) => w.style.removeProperty('--ab-dx'))
      masks.forEach((m) => (m.style.transform = ''))
      ports.forEach(({ port }) => (port.style.transform = ''))
    }
  }, [])

  return (
    <section ref={ref} className="ab-who" aria-label="Who we are">
      {children}
    </section>
  )
}
