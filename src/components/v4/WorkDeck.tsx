'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion-v4'
import type { SheetProject } from '@/components/v4/ProjectSheets'

/**
 * §5 ON PHONES — THE DECK (2026-08-26, user: "the title just like the
 * desktop one … making each project into a card, and building a project
 * stacking on scroll … like the pitch deck section in magnificent_sections").
 *
 * THE MECHANIC IS THE PITCH DECK'S (magnificent_sections →
 * services/agency/pitch-deck), ported onto the house driver. Every card
 * lives in the SAME slot under the title; the stage pins; scroll moves the
 * cards between depths. The card in front climbs AND shrinks as the next
 * one arrives from below the fold — both at once, because a thing moving
 * away climbs the frame as it gets smaller, and doing only one of those
 * reads as a slide rather than a recede. The rises DIMINISH (28 → 20 → 14):
 * equal steps make a fan, compressing steps make a stack. Origin 50% 0% is
 * load-bearing: anchored at the top, the shrink pulls the card's BOTTOM up,
 * where the front card covers it anyway, and the visible top strip is
 * exactly the authored rise. A receded card also goes under a shade, so the
 * stack has a lightness cue as well as a geometric one (the pitch deck
 * interpolates its card greys for the same reason). By the end the three
 * projects are one stacked object.
 *
 * WHAT IS OURS ON TOP OF IT. The title is the desktop wheel's — "Selected
 * [tile-pill] work", the lit tile following the front card. Each card is
 * the project: its capture whole at the captures' own aspect, index, name,
 * line, year, "Visit site"; the whole card is the link (new tab — leaving
 * the page for a site on a phone is losing it). Captions resolve with the
 * house reveal (blur + shift), scrubbed inside the card's arrival so
 * scrolling back un-resolves them exactly. The section arrives on the
 * approach: title resolves, the first card rises into the slot.
 *
 * ONE CLOCK. t = scroll through the pin in card-steps (STEP_SVH each): card
 * i's state is a function of s = t − i alone — waiting below the fold for
 * s < −1, arriving over −1..0, at depth s once passed. A TAIL rests the
 * last card before the pin releases.
 *
 * DISCIPLINE. One gsap.ticker subscription, one frame late. Writes are
 * transform / opacity per slot and the captions' blur for a few frames per
 * arrival. Touch scroll is native on phones (Lenis has no syncTouch) and
 * the deck is pure DOM, so nothing lags the page.
 *
 * FALLBACKS. The markup is a plain list of cards in flow — every word real
 * DOM text (SEO D5). `.is-scrub` (the driver) is what pins and stacks.
 * Reduced motion, no JS, and desktop (WorkWheel owns §5 above 57.5rem;
 * this is display:none there and returns early) get the list.
 */

/** px the front card climbs as it is replaced; later rises derive and diminish */
const RISE = 28
const RISE_DECAY = 0.7
/** scale lost per card of depth — small, but on an image card it is visible */
const RECEDE = 0.035
/** the shade a receded card takes per depth, and its cap */
const SHADE_STEP = 0.26
const SHADE_MAX = 0.5
/** svh of scroll each transition takes; svh of rest after the last */
const STEP_SVH = 90
const TAIL = 0.3
/** the arrival: the section resolves in while its top climbs this much of the viewport */
const APPROACH = 0.8
/** the house reveal numbers */
const BLUR = 14
const SHIFT = 18

const pad2 = (i: number) => String(i).padStart(2, '0')
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

type Depth = { y: number; scale: number }
const depthTable = (count: number): Depth[] => {
  const table: Depth[] = [{ y: 0, scale: 1 }]
  let step = RISE
  let y = 0
  for (let d = 1; d < count; d++) {
    y -= step
    step *= RISE_DECAY
    table.push({ y, scale: 1 - RECEDE * d })
  }
  return table
}
/** the table, read at a fractional depth */
const depthAt = (table: Depth[], d: number): Depth => {
  const max = table.length - 1
  if (d <= 0) return table[0]
  if (d >= max) return table[max]
  const i = Math.floor(d)
  const f = d - i
  const a = table[i]
  const b = table[i + 1]
  return { y: a.y + (b.y - a.y) * f, scale: a.scale + (b.scale - a.scale) * f }
}

export default function WorkDeck({ projects }: { projects: SheetProject[] }) {
  const rootRef = useRef<HTMLElement | null>(null)
  const n = projects.length

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    /* desktop: WorkWheel owns §5 and this section is display:none */
    if (getComputedStyle(root).display === 'none') return
    if (n < 2) return

    const title = root.querySelector<HTMLElement>('.wd-title')
    const deck = root.querySelector<HTMLElement>('.wd-deck')
    const slots = Array.from(root.querySelectorAll<HTMLElement>('.wd-slot'))
    const caps = slots.map((s) => s.querySelector<HTMLElement>('.wd-cap'))
    const shades = slots.map((s) => s.querySelector<HTMLElement>('.wd-shade'))
    const tiles = Array.from(root.querySelectorAll<HTMLElement>('.ww-tile'))
    if (!deck || slots.length !== n) return

    const T = n - 1 + TAIL
    root.classList.add('is-scrub')
    root.style.height = `calc(100svh + ${T * STEP_SVH}svh)`
    const table = depthTable(n)

    /* where a card waits — fully below the fold with air to spare, derived
       from the slot's real position rather than a fixed percentage (the
       pitch deck's lesson: a fixed 112% leaves a strip of the next card
       showing at some sizes) */
    let waitPct = 130
    const measure = () => {
      const r = slots[0].getBoundingClientRect()
      /* the slot's top RELATIVE TO THE SECTION is where the card sits once
         the stage is pinned at the viewport's top (measured against the
         viewport instead, at mount the section is still far below the fold
         and the number comes out negative — the cards then arrive from
         above); from there it needs (viewport − slotTop) / cardHeight to
         clear the bottom edge, plus air */
      const slotTop = r.top - root.getBoundingClientRect().top
      waitPct = ((window.innerHeight - slotTop) / Math.max(r.height, 1)) * 100 + 8
    }
    measure()
    window.addEventListener('resize', measure)

    let lastA = -1
    let lastT = -1
    let lastLit = -1

    const update = () => {
      const rect = root.getBoundingClientRect()
      const vh = window.innerHeight
      const span = rect.height - vh
      if (span <= 0) return
      if (rect.bottom < -50 || rect.top > vh + 50) return

      /* the arrival: the title and the first card resolve while the
         section's top climbs the viewport; whole by the pin */
      const a = rect.top <= 0 ? 1 : clamp01((vh - rect.top) / (vh * APPROACH))
      if (a !== lastA) {
        lastA = a
        if (title) {
          const e = 1 - Math.pow(1 - a, 3)
          title.style.opacity = e.toFixed(3)
          title.style.transform = a >= 1 ? '' : `translate3d(0, ${((1 - e) * SHIFT).toFixed(1)}px, 0)`
          title.style.filter = a >= 1 ? '' : `blur(${((1 - e) * BLUR).toFixed(1)}px)`
        }
      }

      const u = clamp01(-rect.top / span) * T
      const t = gsap.utils.clamp(0, n - 1, u)
      if (t === lastT && a === 1 && lastA === 1) return
      lastT = t

      slots.forEach((slot, i) => {
        const s = t - i
        let yPct = 0
        let y = 0
        let scale = 1
        let shade = 0
        let reveal = 1
        if (s <= -1) {
          yPct = waitPct
          reveal = 0
        } else if (s < 0) {
          /* arriving: from the wait to the slot, linear — the hand eases */
          yPct = waitPct * -s
          reveal = clamp01((s + 0.75) / 0.75)
        } else {
          const d = depthAt(table, s)
          y = d.y
          scale = d.scale
          shade = Math.min(SHADE_MAX, SHADE_STEP * s)
        }
        /* the first card arrives with the section, not found already there */
        if (i === 0 && a < 1) {
          const e = 1 - Math.pow(1 - a, 3)
          yPct += (1 - e) * 22
          slot.style.opacity = e.toFixed(3)
        } else if (i === 0) {
          slot.style.opacity = ''
        }
        slot.style.transform = `translate3d(0, ${yPct.toFixed(3)}%, 0) translate3d(0, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`
        const sh = shades[i]
        if (sh) sh.style.opacity = shade.toFixed(3)
        const cap = caps[i]
        if (cap) {
          const e = reveal * reveal * (3 - 2 * reveal)
          cap.style.opacity = e.toFixed(3)
          cap.style.transform = reveal >= 1 ? '' : `translate3d(0, ${((1 - e) * SHIFT).toFixed(1)}px, 0)`
          cap.style.filter = reveal >= 1 ? '' : `blur(${((1 - e) * BLUR).toFixed(1)}px)`
        }
      })

      const lit = Math.min(n - 1, Math.round(t))
      if (lit !== lastLit) {
        lastLit = lit
        tiles.forEach((tile, i) => tile.classList.toggle('is-lit', i === lit))
      }
    }
    /* one frame late on purpose — after Lenis in the ticker */
    const rafId = requestAnimationFrame(() => gsap.ticker.add(update))

    return () => {
      cancelAnimationFrame(rafId)
      gsap.ticker.remove(update)
      window.removeEventListener('resize', measure)
      root.classList.remove('is-scrub')
      root.style.height = ''
      if (title) {
        title.style.opacity = ''
        title.style.transform = ''
        title.style.filter = ''
      }
      slots.forEach((s) => {
        s.style.transform = ''
        s.style.opacity = ''
      })
      shades.forEach((s) => s && (s.style.opacity = ''))
      caps.forEach((c) => {
        if (!c) return
        c.style.opacity = ''
        c.style.transform = ''
        c.style.filter = ''
      })
      tiles.forEach((tile, i) => tile.classList.toggle('is-lit', i === 0))
    }
  }, [n])

  return (
    <section ref={rootRef} className="wd k-dark" aria-label="Selected work">
      <div className="wd-stage">
        {/* the desktop wheel's title, verbatim: the hero's inline pill
            carrying the three captures as tiles, the lit one the front card */}
        <h2 className="ww-title wd-title t-h1">
          <span className="ww-t">Selected</span>
          <span className="ww-pill" aria-hidden="true">
            {projects.map((p, i) => (
              <span className={`ww-tile${i === 0 ? ' is-lit' : ''}`} key={p.title}>
                {p.image && (
                  <img src={p.image.replace(/\.webp$/, '-1080.webp')} alt="" decoding="async" />
                )}
              </span>
            ))}
          </span>
          <span className="ww-t">
            <em>work</em>
          </span>
        </h2>

        {/* THE DECK — a list in flow; one slot, stacked, once the driver
            pins it. Each slot owns the deck's transform; the card inside
            owns nothing that moves. */}
        <div className="wd-deck">
          {projects.map((p, i) => (
            <div className="wd-slot" key={p.title} style={{ zIndex: i + 1 }}>
              <a
                className="wd-card"
                href={p.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${p.title} — visit the site`}
              >
                <span className="wd-win">
                  {p.image && (
                    <img
                      src={p.image}
                      srcSet={`${p.image.replace(/\.webp$/, '-1080.webp')} 1080w, ${p.image.replace(/\.webp$/, '-1600.webp')} 1600w, ${p.image} 2880w`}
                      sizes="92vw"
                      alt={`${p.title} — website by Konaverse`}
                      decoding="async"
                      loading={i === 0 ? 'eager' : 'lazy'}
                    />
                  )}
                </span>
                <span className="wd-cap">
                  <span className="wd-row">
                    <span className="wd-num t-small">{pad2(i + 1)}</span>
                    <span className="wd-year t-small">{p.year}</span>
                  </span>
                  <span className="wd-name t-h2">{p.title}</span>
                  <span className="wd-line t-body">{p.line}</span>
                  <span className="wd-visit t-small">
                    Visit site <span aria-hidden="true">↗</span>
                  </span>
                </span>
                {/* the shade a receded card goes under */}
                <span className="wd-shade" aria-hidden="true" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
