'use client'

import { useEffect, useRef } from 'react'
import { SERVICES } from '@/components/v4/services-data'
import Fractured from '@/components/v4/Fractured'
import PlateLoop from '@/components/v4/PlateLoop'
import { gsap } from '@/lib/motion-v4'

/**
 * SECTION 4 — WHAT WE DO: SIX CARDS (user-directed 2026-08-20, replacing the
 * bento of the same day).
 *
 * TWO COLUMNS, THREE ROWS, SIX IDENTICAL CARDS. The bento's unequal spans are
 * gone on purpose: the cards are the point now, so nothing about the grid is
 * allowed to make one service look more important than another. Every card is
 * the same size, the same shape and the same five layers; the only thing that
 * differs between them is the light it carries and the drawing it holds.
 *
 *   ┌──────────────────┐ ┌──────────────────┐
 *   │  ┌────────────┐  │ │  ┌────────────┐  │   the media plate — big enough
 *   │  │   plate    │  │ │  │   plate    │  │   for a photograph, holding the
 *   │  └────────────┘  │ │  └────────────┘  │   drawing until one is supplied
 *   │  NAME       (→)  │ │  NAME       (→)  │
 *   │  description     │ │  description     │
 *   └──────────────────┘ └──────────────────┘   × 3
 *
 * THE MEDIA PLATE takes either. `media: 'glyph'` (the default, and what all
 * six ship as) centres the service's hairline drawing on a tinted panel;
 * `media: 'photo'` in services-data.tsx fills the same panel with the
 * service's photograph instead. One word per card, no layout change either
 * way — the plate is sized for the photograph and the drawing sits inside it.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE PAPER ENTRANCE (the user's ask, and the answer to "can we do what the
 * hero does?").
 *
 * The hero peel textures an <img> onto a 140x90 WebGL mesh. A card here is
 * LIVE DOM — an animated aura, a conic ring, an SVG drawing and real text —
 * and WebGL cannot texture a live subtree. So the same idea is built the one
 * way that keeps the content live: a PER-CORNER HOMOGRAPHY written as a
 * single `matrix3d`.
 *
 * A matrix3d can map the unit square onto any convex quadrilateral, which
 * means all four corners are independently placeable. Give each corner its
 * own easing window over the row's scroll progress — the hero shader's
 * corner-weighted stagger, exactly — and mid-flight some corners have arrived
 * while others have not. That stretch IS the paper.
 *
 *   · the LEFT card is grabbed by its TOP-RIGHT corner
 *   · the RIGHT card is grabbed by its TOP-LEFT corner
 *
 * so the two INNER corners lead. They reach for each other across the gutter,
 * meet first, and the outer bodies swing in behind them until both cards
 * settle flat and aligned. Each card also starts displaced outward and below,
 * so the pair converges on the centre rather than dropping in.
 *
 * SCRUB, NOT PLAYBACK (house rule). Progress is a pure function of the row's
 * position, so scrolling back up re-stretches the corners. One gsap.ticker
 * subscription for the whole section, reads batched before writes.
 *
 * WHAT THIS CANNOT DO, and it is worth being straight about: a homography is
 * a PLANAR map. It grabs corners and foreshortens, but it cannot ripple the
 * middle of the sheet the way a subdivided mesh can — a real curl needs
 * non-planar geometry. Corner stretch, perspective and stagger: yes. Fabric
 * wobble: no. If the wobble is wanted, the route is the hero's: put a
 * photograph in the plate and peel THAT in GL while the card frame does this.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * THE FIVE LAYERS, unchanged from the bento, bottom to top: the aura (two
 * blurred radials in the service's own colours, drifting off-phase), the pane
 * (translucent white, heaviest where the type sits), the cursor lens, the
 * travelling border (a conic gradient masked to a 1px ring, its angle spun
 * through a registered @property), then the plate and the type.
 *
 * HOVER, unchanged: the card lifts on a shadow tinted to its own colour, the
 * aura swells through the pane, the ring goes to full, the drawing REDRAWS
 * ITSELF, the name inks over letter by letter, the plate pushes in, and the
 * corner chip resolves from a line into an east arrow.
 *
 * Descriptions no longer hide. Six big cards have the room, and a card whose
 * copy only exists under the pointer is not the same card as the one beside
 * it — which is the whole ask here.
 *
 * ROUTING. Every card links to /services#slug. Architecture §8 holds: all six
 * land on the hub, the fragment only says which service you came for.
 *
 * FALLBACK. No JS, reduced motion, or narrower than two columns: the paper
 * never arms and the cards do the house reveal instead. Every word is
 * server-rendered either way.
 */

/* the corner stagger, in units of row progress. A corner's window opens at
   w*LAG and closes SPAN later, so the grabbed corner (w=0) runs 0..SPAN and
   the far corner (w=1) runs LAG..1. LAG is the whole effect: at 0 the card
   is a rigid rectangle sliding in. */
const LAG = 0.5
const SPAN = 0.52

/** how much of a viewport the row spends arriving */
const TRAVEL = 0.72

/** the start displacement, as a share of the card's own box */
const OUT_X = 0.17
const DOWN_Y = 0.34

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a || 1e-6))
  return t * t * (3 - 2 * t)
}

/** the four corners of the unit square, in the order the homography wants:
 *  top-left, top-right, bottom-right, bottom-left */
const UNIT: [number, number][] = [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1],
]

/**
 * The projective map taking the unit square onto the quadrilateral p0..p3
 * (Heckbert's square-to-quad), returned as the eight coefficients CSS wants.
 * Null if the quad has collapsed — a degenerate matrix would blank the card.
 */
function squareToQuad(q: number[]) {
  const [x0, y0, x1, y1, x2, y2, x3, y3] = q
  const dx1 = x1 - x2
  const dy1 = y1 - y2
  const dx2 = x3 - x2
  const dy2 = y3 - y2
  const den = dx1 * dy2 - dx2 * dy1
  if (!den) return null
  const sx = x0 - x1 + x2 - x3
  const sy = y0 - y1 + y2 - y3
  const g = (sx * dy2 - dx2 * sy) / den
  const h = (dx1 * sy - sx * dy1) / den
  return {
    a: x1 - x0 + g * x1,
    b: x3 - x0 + h * x3,
    c: x0,
    d: y1 - y0 + g * y1,
    e: y3 - y0 + h * y3,
    f: y0,
    g,
    h,
  }
}

export default function ServiceCards() {
  const rootRef = useRef<HTMLElement | null>(null)

  /* ---- the house reveal, and the flag that hands over to the paper ---- */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const grid = root.querySelector<HTMLElement>('.sc-grid')
    if (!grid) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      grid.classList.add('is-in', 'is-done')
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          grid.classList.add('is-in')
          io.disconnect()
          window.setTimeout(() => grid.classList.add('is-done'), 1600)
        })
      },
      { threshold: 0.1 },
    )
    io.observe(grid)
    return () => io.disconnect()
  }, [])

  /* ---- THE PAPER ---- */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const grid = root.querySelector<HTMLElement>('.sc-grid')
    if (!grid) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    /* two columns or it is not a pair, and without a pair there is nothing
       for the inner corners to reach across */
    if (!window.matchMedia('(min-width: 57.5rem)').matches) return

    const cells = Array.from(grid.querySelectorAll<HTMLElement>('.sc-cell'))
    if (cells.length !== SERVICES.length) return

    grid.classList.add('is-paper')

    /* LAYOUT values, not rects: every frame we write a transform to these
       elements, and getBoundingClientRect would then read our own output
       back in. offsetTop/offsetWidth are the untransformed box, so the
       measurement stays a fixed point. */
    type Box = { oy: number; w: number; h: number; col: number }
    let boxes: Box[] = []
    const measure = () => {
      boxes = cells.map((el, i) => ({
        oy: el.offsetTop - grid.offsetTop,
        w: el.offsetWidth,
        h: el.offsetHeight,
        col: i % 2,
      }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(grid)

    /* one number per cell, so a settled card can be skipped without
       re-writing the same identity transform every frame */
    const last = new Array(cells.length).fill(-1)

    const write = (i: number, p: number) => {
      const el = cells[i]
      const { w: W, h: H, col } = boxes[i]
      if (!W || !H) return

      if (p >= 1) {
        el.style.transform = ''
        el.style.opacity = ''
        return
      }

      /* the grabbed corner: the INNER one of the pair, so the two cards
         reach for each other across the gutter and meet in the middle */
      const gx = col === 0 ? 1 : 0
      const gy = 0
      /* which way this card comes in from — outward, so the pair converges */
      const sx = (col === 0 ? -1 : 1) * W * OUT_X
      const sy = H * DOWN_Y

      const quad: number[] = []
      for (const [u, v] of UNIT) {
        /* the scalar field that orders the corners: 0 at the grabbed
           corner, 1 at the one diagonally opposite. The hero's w, in two
           dimensions instead of eight. */
        const wgt = (Math.abs(u - gx) + Math.abs(v - gy)) / 2
        const t = smoothstep(wgt * LAG, SPAN + wgt * LAG, p)

        const rx = u * W
        const ry = v * H
        /* the corner's start: displaced along the card's entry vector, and
           further the later it is due — that spread is the stretch */
        const spread = 0.45 + 0.85 * wgt
        let ax = rx + sx * spread
        let ay = ry + sy * spread
        /* a little contraction toward the centre, so the sheet arrives
           opening out rather than sliding flat */
        const k = 0.07 * (0.4 + wgt)
        ax += (W / 2 - ax) * k
        ay += (H / 2 - ay) * k

        quad.push(ax + (rx - ax) * t, ay + (ry - ay) * t)
      }

      const m = squareToQuad(quad)
      if (!m) return
      /* scale first (right-to-left), so the matrix maps a unit square */
      el.style.transform =
        `matrix3d(${m.a},${m.d},0,${m.g},${m.b},${m.e},0,${m.h},0,0,1,0,${m.c},${m.f},0,1)` +
        ` scale(${1 / W},${1 / H})`
      el.style.opacity = `${smoothstep(0, 0.32, p)}`
    }

    const tick = () => {
      const vh = window.innerHeight
      const gridTop = grid.getBoundingClientRect().top // never transformed
      const travel = vh * TRAVEL

      /* read every row first, write after — interleaving would thrash */
      const ps: number[] = []
      for (let i = 0; i < boxes.length; i++) {
        ps.push(clamp01((vh - (gridTop + boxes[i].oy)) / travel))
      }
      for (let i = 0; i < ps.length; i++) {
        // settled cards cost nothing; a moving one is written every frame
        if (ps[i] === last[i] && (ps[i] === 0 || ps[i] === 1)) continue
        last[i] = ps[i]
        write(i, ps[i])
      }
    }

    tick()
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      ro.disconnect()
      grid.classList.remove('is-paper')
      cells.forEach((el) => {
        el.style.transform = ''
        el.style.opacity = ''
      })
    }
  }, [])

  /* ---- the cursor lens: one listener for six cards ---- */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const grid = root.querySelector<HTMLElement>('.sc-grid')
    if (!grid) return
    if (!window.matchMedia('(hover: hover)').matches) return

    let raf = 0
    let pending: { el: HTMLElement; x: number; y: number } | null = null
    const flush = () => {
      raf = 0
      if (!pending) return
      pending.el.style.setProperty('--mx', `${pending.x}%`)
      pending.el.style.setProperty('--my', `${pending.y}%`)
      pending = null
    }
    const onMove = (e: PointerEvent) => {
      const card = (e.target as HTMLElement | null)?.closest<HTMLElement>('.sc-card')
      if (!card) return
      const r = card.getBoundingClientRect()
      pending = {
        el: card,
        x: ((e.clientX - r.left) / r.width) * 100,
        y: ((e.clientY - r.top) / r.height) * 100,
      }
      if (!raf) raf = requestAnimationFrame(flush)
    }
    grid.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      grid.removeEventListener('pointermove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section className="sc k-dark" ref={rootRef} aria-labelledby="sc-h">
      <div className="sc-page">
        <header className="sc-head">
          <h2 className="t-h2 sc-title" id="sc-h">
            What we do
          </h2>
          <p className="t-body sc-lede">
            Six services, one process. Each one is a different way into the same team.
          </p>
        </header>

        <ul className="sc-grid">
          {SERVICES.map((s, i) => (
            <li
              key={s.slug}
              className="sc-cell"
              style={
                {
                  '--i': i,
                  /* the service's own key light — what replaced the tints */
                  '--lx': s.light[0],
                  '--ly': s.light[1],
                } as React.CSSProperties
              }
            >
              {/* data-fx-host: Fractured takes its hover from the nearest one
                  of these, so the WHOLE card assembles the object, not just
                  the plate the object happens to sit in. */}
              <a className="sc-card" href={`/services#${s.slug}`} data-fx-host>
                <span className="sc-glass" aria-hidden="true" />
                <span className="sc-spot" aria-hidden="true" />

                {/* THE PLATE IS A SLOT. A service names its object in
                    services-data.tsx or names none at all; with none it
                    stays a lit black surface, which is what the four cards
                    whose objects are still being made look like. */}
                <span className="sc-media" aria-hidden="true">
                  {s.loop ? <PlateLoop src={s.loop.src} poster={s.loop.poster} /> : null}
                  {s.object ? <Fractured art={s.object} /> : null}
                </span>

                <span className="sc-body">
                  <h3 className="sc-name">{s.name}</h3>

                  <span className="sc-chip" aria-hidden="true">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
                      <path d="M2 8 L13 8" />
                      <path className="sc-chip-head" d="M9 4.5 L13 8 L9 11.5" />
                    </svg>
                  </span>

                  <p className="sc-para t-body">{s.para}</p>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
