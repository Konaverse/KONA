'use client'

import { useEffect, useRef } from 'react'
import Button from '@/components/v4/Button'
import type { SheetProject } from '@/components/v4/ProjectSheets'
import { gsap } from '@/lib/motion-v4'

/**
 * §5 — THE STACK (2026-09-14, user: "the same effect as their latest
 * project showcase with the cards, apply that to the home page" —
 * studioaton.webflow.io's Latest projects). Rebuilt from MEASUREMENT:
 * the section's ScrollTrigger instances were read off the live page
 * and every number below is theirs (extract/aton-works/).
 *
 * THE HEAD sinks under the cards: from the moment its top reaches 28%
 * of the viewport until its bottom leaves the top, it drops by its own
 * height and fades to nothing — linear, scrubbed. The first card rides
 * up over it.
 *
 * THE CARDS are a column, each `position: sticky` at STICK from the
 * top. The moment a card sticks, the next one is on its way up over
 * it, and the stuck card shrinks 1 → 0.7 about its centre over the
 * next card-height-plus-STICK of scroll — linear, scrubbed at 0.8. The
 * last card never shrinks: it is the one the reader is left holding.
 *
 * Progress is a pure function of position on the shared ticker (house
 * rule); the original's scrub lag is the lerp, SCRUB. Reduced motion
 * keeps the sticky column (it is layout) and skips the scale and the
 * head's exit. No JS is the same.
 *
 * CONTENT: the head's words, the count, the button. The projects come
 * in as props — the page's FEATURED three.
 */

/* ← replace every value below with your own content */
const CONTENT = {
  /** the head: two words, one per line at the display size */
  title: ['Selected', 'work'],
  /** the small marks flanking the head — the original wears "( 26© )"
   *  on the left and a dot on the right; ours counts the projects */
  cta: { label: 'All projects', href: '/work', hover: 'See the work' },
}

/** the head's exit: from its top at this fraction of the viewport … */
const HEAD_FROM = 0.28
/** the stuck card's final scale */
const SCALE_TO = 0.7
/** the scrub's lag per frame (the original: head scrub 1, cards 0.8) */
const SCRUB = 0.12

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

export default function WorkStack({ projects }: { projects: SheetProject[] }) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const sec = ref.current
    if (!sec) return
    const head = sec.querySelector<HTMLElement>('.ws-head')
    const hold = sec.querySelector<HTMLElement>('.ws-hold')
    const cards = Array.from(sec.querySelectorAll<HTMLElement>('.ws-card'))
    if (!head || !hold || !cards.length) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let stick = 0
    let cardH = 0
    let gap = 0
    const measure = () => {
      const cs = getComputedStyle(cards[0])
      stick = parseFloat(cs.top) || 0
      cardH = cards[0].offsetHeight
      gap = parseFloat(getComputedStyle(hold).rowGap) || 0
    }
    measure()

    /* one lerped value per driven thing */
    const cur = { head: 0, cards: cards.map(() => 0) }
    let first = true
    const update = () => {
      const vh = window.innerHeight
      const r = sec.getBoundingClientRect()
      if (r.bottom < 0 || r.top > vh) return

      /* THE HEAD: 0 when its top is at HEAD_FROM of the viewport, 1 when
         its bottom has left the top */
      const h = head.getBoundingClientRect()
      const headNat = h.top - cur.head * h.height /* undo our own y */
      const tHead = clamp01((HEAD_FROM * vh - headNat) / (HEAD_FROM * vh + h.height))

      /* THE CARDS: each one's natural (unstuck) top is the column's top
         plus its index; 0 when that reaches STICK, 1 a card-height-plus-
         STICK of scroll later */
      const holdTop = hold.getBoundingClientRect().top
      const tCards = cards.map((_, i) =>
        i === cards.length - 1 ? 0 : clamp01((stick - (holdTop + i * (cardH + gap))) / (cardH + stick)),
      )

      const k = first ? 1 : SCRUB
      first = false
      cur.head += (tHead - cur.head) * k
      gsap.set(head, { yPercent: 100 * cur.head, opacity: 1 - cur.head, force3D: true })
      tCards.forEach((t, i) => {
        cur.cards[i] += (t - cur.cards[i]) * k
        gsap.set(cards[i], { scale: 1 - (1 - SCALE_TO) * cur.cards[i], force3D: true })
      })
    }

    window.addEventListener('resize', measure)
    const raf = requestAnimationFrame(() => gsap.ticker.add(update))
    return () => {
      cancelAnimationFrame(raf)
      gsap.ticker.remove(update)
      window.removeEventListener('resize', measure)
      gsap.set([head, ...cards], { clearProps: 'transform,opacity' })
    }
  }, [])

  return (
    <section ref={ref} className="ws" id="work" aria-labelledby="ws-h">
      <div className="ws-page">
        {/* the head: the count, the two-line title, the dot */}
        <div className="ws-head">
          <span className="ws-mark t-small">( {String(projects.length).padStart(2, '0')} )</span>
          <h2 className="ws-title" id="ws-h">
            {CONTENT.title.map((w) => (
              <span key={w} className="ws-tl">
                {w}
              </span>
            ))}
          </h2>
          <i className="ws-dot" aria-hidden="true" />
        </div>

        {/* the column: every card sticks, the stuck one shrinks under
            the next */}
        <ul className="ws-hold">
          {projects.map((p, i) => (
            <li key={p.href} className="ws-card" style={{ zIndex: i + 1 }}>
              <a className="ws-link" href={p.href}>
                <img src={p.image} alt="" loading={i === 0 ? 'eager' : 'lazy'} draggable={false} />
                <span className="ws-name">
                  <span className="ws-name-t">
                    {p.title}
                    <span className="ws-name-y">{p.year}</span>
                  </span>
                </span>
                <span className="sr-only">{p.line}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="ws-cta">
          <Button href={CONTENT.cta.href} hoverLabel={CONTENT.cta.hover}>
            {CONTENT.cta.label}
          </Button>
        </div>
      </div>
    </section>
  )
}
