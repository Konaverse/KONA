'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion-v4'

/**
 * OUR TOOLSET — THE BENTO (2026-09-17, the user's frame "image.png": a
 * dark bento of six cards with white gradient sheens, each with a
 * rendered object; "we will do a white theme bento grid with black
 * gradients… objects that exceed the margins of their card to create a
 * nice deep effect"). It replaces the drag track of 09-11 ("this very
 * heavy drag section"), which is parked with its hand lens (AboutTools.tsx,
 * unimported).
 *
 * THE GRID, on desktop, is the frame's: three columns, three rows —
 * a tall card down the left, a wide card across the top right, two
 * squares under it, a wide card across the bottom left, a square at
 * the bottom right (grid-template-areas in about.css). Each card is
 * raised paper with a soft black wash from one corner, a name and one
 * line. Each OBJECT sits inside its card, in the corner the text
 * leaves free, floating on a drop shadow (the first cut hung them past
 * the edges — user: "terrible and confusing"; the card clips now).
 *
 * THE MOTION. Three light touches, no library beyond the shared
 * ticker: the cards and the objects rise in once as the grid enters
 * (IntersectionObserver, staggered by --i); the objects ride the
 * scroll a little slower than the page (`--sy` on the section, one
 * rect per frame); and on hover devices the objects lean away from
 * the pointer by their own depth (`--px`/`--py` on the section, each
 * object's `--d`). Hover on a card lifts its object and deepens the
 * wash — CSS.
 *
 * SERVER-RENDERED: the names as h3, the lines as p. The pictures are
 * the homepage's service objects FOR NOW (user: "images we will
 * generate later"); `art` in page.tsx is where they are swapped.
 * Reduced motion: no entrance, no lean, no ride (CSS + the early
 * return). No JS: page.tsx's noscript lifts the entrance.
 */

export type Tool = {
  name: string
  line: string
  /** the object: a picture with alpha, set past the card's edge */
  art: { src: string; width: number; height: number }
}

/** how much of the page's scroll the objects give back */
const RIDE = 0.04
/** the lean, in px at the reference frame, at full depth */
const LEAN = 8

export default function AboutBento({ tools }: { tools: readonly Tool[] }) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const sec = ref.current
    if (!sec) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hover = window.matchMedia('(hover: hover)').matches

    /* the entrance, once */
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          ;(e.target as HTMLElement).classList.add('is-in')
          io.unobserve(e.target)
        })
      },
      { threshold: 0.12 },
    )
    const title = sec.querySelector<HTMLElement>('.ab-tools-t')
    const grid = sec.querySelector<HTMLElement>('.ab-bento-grid')
    if (title) io.observe(title)
    if (grid) io.observe(grid)

    if (reduce) return () => io.disconnect()

    /* the ride: the objects lag the page a little */
    const tick = () => {
      const r = sec.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < 0 || r.top > vh) return
      sec.style.setProperty('--sy', `${((vh / 2 - (r.top + r.height / 2)) * RIDE).toFixed(2)}px`)
    }
    tick()
    gsap.ticker.add(tick)

    /* the lean: the pointer's place across the section, -1..1 */
    const onMove = (e: PointerEvent) => {
      const r = sec.getBoundingClientRect()
      const px = ((e.clientX - r.left) / r.width) * 2 - 1
      const py = ((e.clientY - r.top) / r.height) * 2 - 1
      sec.style.setProperty('--px', `${(-px * LEAN).toFixed(2)}px`)
      sec.style.setProperty('--py', `${(-py * LEAN).toFixed(2)}px`)
    }
    const onLeave = () => {
      sec.style.setProperty('--px', '0px')
      sec.style.setProperty('--py', '0px')
    }
    if (hover) {
      sec.addEventListener('pointermove', onMove)
      sec.addEventListener('pointerleave', onLeave)
    }

    return () => {
      io.disconnect()
      gsap.ticker.remove(tick)
      sec.removeEventListener('pointermove', onMove)
      sec.removeEventListener('pointerleave', onLeave)
      sec.style.removeProperty('--sy')
      sec.style.removeProperty('--px')
      sec.style.removeProperty('--py')
    }
  }, [])

  return (
    <section ref={ref} className="ab-tools ab-bento" aria-label="Our toolset">
      <h2 className="ab-tools-t">
        <span className="ab-tools-m">
          <span className="ab-tools-w"><em>Our</em> toolset</span>
        </span>
      </h2>
      <ul className="ab-bento-grid">
        {tools.map((t, i) => (
          <li key={t.name} className="ab-bento-card" style={{ '--i': i } as React.CSSProperties}>
            <div className="ab-bento-text">
              <h3 className="ab-bento-name">{t.name}</h3>
              <p className="ab-bento-line">{t.line}</p>
            </div>
            <img
              className="ab-bento-obj"
              src={t.art.src}
              alt=""
              width={t.art.width}
              height={t.art.height}
              loading="lazy"
              decoding="async"
              draggable={false}
              aria-hidden="true"
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
