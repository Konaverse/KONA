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
 * THE MOTION. Light touches, no library beyond the shared ticker: the
 * cards and the logos rise in once as the grid enters
 * (IntersectionObserver, staggered by --i); the logos ride the scroll
 * a little slower than the page (`--sy` on the section, one rect per
 * frame, each logo's `--d`). Hover on a card zooms its logo and
 * deepens the wash — CSS.
 *
 * THE LOGOS (2026-10-02, owner: "I no longer want objects… just the
 * logo, black and white, with no background, placed inside the card and
 * clipped by the corner"): each tool's mark, black with grain, set big
 * in the card's free corner so the card's edge cuts it. NO LEAN (owner,
 * 10-02: "the logos shouldn't move on hover, just zoom in"): hover only
 * scales the hovered card's logo (CSS), nothing follows the pointer.
 * THE RUN OF LIGHT: on hover a short line runs round the card's edge,
 * clockwise and without end — opaque at its head, gone at its tail
 * (a rotating conic gradient masked to the border; about.css).
 *
 * SERVER-RENDERED: the names as h3, the lines as p; the logos are
 * decoration (the name says it). `art` in page.tsx is where they live.
 * Reduced motion: no entrance, no lean, no ride (CSS + the early
 * return). No JS: page.tsx's noscript lifts the entrance.
 */

export type Tool = {
  name: string
  line: string
  /** the logo: a picture with alpha, cut by the card's corner */
  art: { src: string; width: number; height: number }
}

/** how much of the page's scroll the objects give back */
const RIDE = 0.04

export default function AboutBento({ tools }: { tools: readonly Tool[] }) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const sec = ref.current
    if (!sec) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

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


    return () => {
      io.disconnect()
      gsap.ticker.remove(tick)
      sec.style.removeProperty('--sy')
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
