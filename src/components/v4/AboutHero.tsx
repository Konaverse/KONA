'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, EASE, DUR, rem } from '@/lib/motion-v4'

/**
 * THE ABOUT HERO — THE SENTENCE (2026-09-11, the user's frame: "designing
 * with / ideas [plate] that / connect", the third line on a dark band).
 *
 * THE ENTRANCE. The three lines rise through their masks in reading
 * order (the house masked rise, blur resolving as each clears its
 * edge). The band's ink wipes in from the LEFT under the third line as
 * the word rises — the flip to dark is carried by a seam, never a cut.
 *
 * THE APERTURE. Once the second line has landed, the plate opens AFTER
 * "ideas": from nothing to its resting width, the picture unveiled by
 * the opening rather than un-squashed (the plate inside is pinned and
 * wider than the pill — the homepage pills' own move), and "that" is
 * carried right by it. A glint runs the plate's length as it settles.
 *
 * The final state is CSS (`is-in`, `is-open` + --ab-pill-rest), so it
 * survives a resize and reduced motion lands on it directly. No JS =
 * the final frame (the noscript rule in page.tsx lifts the parked
 * opacity and holds the pill at rest).
 */
export default function AboutHero({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const hero = ref.current
    if (!hero) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const lines = Array.from(hero.querySelectorAll<HTMLElement>('.ab-ln'))
    const pill = hero.querySelector<HTMLElement>('.ab-pill')
    const glint = hero.querySelector<HTMLElement>('.ab-glint')
    let tl: gsap.core.Timeline | null = null
    let cancelled = false

    if (reduce) {
      hero.classList.add('is-in', 'is-band', 'is-open')
      return () => hero.classList.remove('is-in', 'is-band', 'is-open')
    }

    const start = () => {
      if (cancelled || !pill) return
      const k = rem()
      tl = gsap.timeline()
      /* the lines: parked below their masks, rising in reading order */
      tl.fromTo(
        lines,
        { yPercent: 110, opacity: 1, filter: `blur(${8 * k}px)` },
        { yPercent: 0, filter: 'blur(0px)', duration: DUR.slow, ease: EASE.glass, stagger: 0.11 },
        0,
      )
      /* the band's ink arrives under the third line as it rises */
      tl.call(() => hero.classList.add('is-band'), undefined, 0.14)
      /* THE APERTURE: the pill opens to its resting width (read from the
         CSS so the composition lives in one place) and carries "that" */
      const rest = getComputedStyle(pill).getPropertyValue('--ab-pill-rest').trim() || '2.1em'
      tl.to(
        pill,
        {
          width: rest,
          marginLeft: '0.22em',
          duration: 1.05,
          ease: EASE.arc,
          onComplete: () => {
            hero.classList.add('is-open')
            gsap.set(pill, { clearProps: 'width,marginLeft' })
          },
        },
        0.72,
      )
      /* the glint: light catching the plate as the aperture settles */
      if (glint) {
        tl.fromTo(
          glint,
          { xPercent: -70, opacity: 0.85 },
          { xPercent: 70, opacity: 0, duration: 0.8, ease: EASE.settle },
          1.55,
        )
      }
    }

    /* the pill's rest is in em of the line, so the fonts must be in */
    if (typeof document.fonts?.ready?.then === 'function') document.fonts.ready.then(start)
    else start()

    return () => {
      cancelled = true
      tl?.kill()
      hero.classList.remove('is-in', 'is-band', 'is-open')
    }
  }, [])

  return (
    <header ref={ref} className="ab-hero">
      {children}
    </header>
  )
}
