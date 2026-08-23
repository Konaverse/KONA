'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion-v4'

/**
 * THE 3D WEBSITES CARD'S MEDIA — a glass screen that rests SHATTERED and
 * assembles under the pointer, with the chrome knot surfacing as it closes.
 * User-specified 2026-08-23; built standalone at /proto-shatter before it is
 * allowed near §4.
 *
 * WHY THIS IS A COMPONENT AND NOT PART OF ServiceCards. §4's plate currently
 * takes `media: 'glyph' | 'photo'` — a string. This is neither, and the next
 * five services will each want their own thing, so the plate has to stop
 * caring what is inside it. Everything specific to this card lives here.
 *
 * ── THE SHARDS ────────────────────────────────────────────────────────────
 * Nine copies of ONE image, all `inset: 0` and `object-fit: cover`, each cut
 * to a different polygon by `clip-path`. Same box, same source, different
 * window — so together they tile the picture exactly, and pulled apart they
 * read as broken glass over the dark ground behind.
 *
 * The polygons are not a grid and not random. They are a real crack figure:
 * an impact at (54, 44), an irregular six-sided concentric ring around it,
 * and radial cracks running from each ring vertex out to the border. That
 * gives THREE inner cells fanning off the impact and SIX outer ones reaching
 * the edges — nine, every one four to six sided, all sharing edges. Glass
 * breaks radially from a point and again along a ring; a Voronoi scatter
 * would have looked like paving, not damage.
 *
 * NEIGHBOURS OVERLAP BY 1.5%, applied in `bloat()` rather than baked into
 * the numbers, so the crack figure above stays editable. Without it the
 * shared edges land on subpixel boundaries when assembled and you get
 * hairline seams across the picture. The overlap band draws the same pixels
 * from the same image twice, so it is invisible.
 *
 * TRANSFORM-ORIGIN IS PER SHARD, and this is the one that is easy to get
 * wrong: every shard is the same full-plate box, so the default origin is
 * the PLATE's centre for all nine. Rotating a corner shard 5° about the
 * middle of the picture swings it through a huge arc. Each shard's origin is
 * its own polygon centroid, so the rotation reads as a tilted piece of glass.
 *
 * ── PERFORMANCE, WHICH IS THE WHOLE REASON THIS SHAPE WAS CHOSEN ──────────
 * §4's measured problem (2026-08-23) was two layers that painted every frame
 * forever: a conic gradient spun through an @property angle, and a blurred
 * aura on a transform loop. Median frame time through the section was 33ms
 * with 70% of frames over budget; disabling both took it to a steady 16.7ms.
 *
 * So nothing here paints on a schedule:
 *   · every animated property is `transform` or `opacity` — compositor work
 *   · ONE decoded image backs all nine shards (same src, same box), which is
 *     also why the SVGs the art arrived as are NOT used directly: they are
 *     4.1MB and 1.9MB wrappers around embedded PNGs, and nine <img> of that
 *     is nine base64 decodes. Flattened, the pair is 61KB.
 *   · `will-change` is added when the timeline starts and REMOVED when it
 *     settles, so nine promoted layers do not sit on the GPU at rest
 *   · the idle float is the only thing that runs unattended, it is one
 *     element, and it exists only while the screen is assembled
 *
 * Nine full-plate textures is a per-CARD budget. It is affordable because
 * exactly one card does this; it would not survive being the house pattern.
 *
 * ── STATES ────────────────────────────────────────────────────────────────
 * REST is broken: shards displaced 6–18px outward from the picture's centre
 * with a small tilt, knot low, small, dim, its bloom tight and faint.
 * ASSEMBLED is whole: every shard at zero, knot up at full scale, the bloom
 * open behind it. (The spec asked for a drop SHADOW under the knot; on art
 * whose ground is pure black there is nothing darker to cast onto, so it is
 * a bloom instead — see .gs-bloom.)
 *
 * ── TRIGGERS ──────────────────────────────────────────────────────────────
 * Pointer devices play on enter and reverse on leave at 1.4×. Touch devices
 * have no hover to give, so the assembly plays ONCE at 40% in view and never
 * reverses. Reduced motion gets the assembled state as flat markup — no
 * shards, no timeline, no observer.
 */

/* the crack figure, in percentages of the plate. Impact at (54, 44). */
type Shard = {
  /** polygon in %, before the overlap is applied */
  pts: [number, number][]
  /** how far it sits from home at rest, in px, along its own outward ray */
  mag: number
  /** its tilt at rest, in degrees */
  rot: number
}

const SHARDS: Shard[] = [
  /* ---- the three inner cells, fanning off the impact ---- */
  { pts: [[54, 44], [40, 24], [62, 20], [78, 38]], mag: 7, rot: 1.8 },
  { pts: [[54, 44], [78, 38], [72, 62], [50, 70]], mag: 6, rot: -2.4 },
  { pts: [[54, 44], [50, 70], [33, 55], [40, 24]], mag: 8, rot: 3.1 },

  /* ---- the six outer cells, ring edge to border ---- */
  { pts: [[40, 24], [62, 20], [69, 0], [23, 0]], mag: 13, rot: -3.4 },
  { pts: [[62, 20], [78, 38], [100, 32], [100, 0], [69, 0]], mag: 16, rot: 2.6 },
  { pts: [[78, 38], [72, 62], [100, 90], [100, 32]], mag: 15, rot: -1.9 },
  { pts: [[72, 62], [50, 70], [45, 100], [100, 100], [100, 90]], mag: 18, rot: 4.2 },
  { pts: [[50, 70], [33, 55], [0, 72], [0, 100], [45, 100]], mag: 14, rot: -4.6 },
  { pts: [[33, 55], [40, 24], [23, 0], [0, 0], [0, 72]], mag: 17, rot: 3.7 },
]

/** how much neighbours overlap, so no hairline shows when assembled */
const OVERLAP = 1.015

/** area centroid — the vertex mean drifts on the five-sided cells */
function centroid(pts: [number, number][]): [number, number] {
  let a = 0
  let cx = 0
  let cy = 0
  for (let i = 0; i < pts.length; i++) {
    const [x0, y0] = pts[i]
    const [x1, y1] = pts[(i + 1) % pts.length]
    const f = x0 * y1 - x1 * y0
    a += f
    cx += (x0 + x1) * f
    cy += (y0 + y1) * f
  }
  a *= 0.5
  /* a degenerate polygon would divide by zero — fall back to the mean */
  if (Math.abs(a) < 1e-6) {
    const n = pts.length
    return [pts.reduce((s, p) => s + p[0], 0) / n, pts.reduce((s, p) => s + p[1], 0) / n]
  }
  return [cx / (6 * a), cy / (6 * a)]
}

/** grow a polygon about its own centroid, so neighbours overlap slightly */
function bloat(pts: [number, number][], c: [number, number]): string {
  return pts
    .map(([x, y]) =>
      `${(c[0] + (x - c[0]) * OVERLAP).toFixed(3)}% ${(c[1] + (y - c[1]) * OVERLAP).toFixed(3)}%`,
    )
    .join(', ')
}

/* Everything the render and the timeline need, computed once at module scope
   so it is identical on the server and the client — a random() here would
   hydrate to a different crack figure than it rendered. Sorted OUTERMOST
   FIRST: DOM order is assembly order, which is what lets the stagger be a
   plain `from: 'start'` and makes the arrival sweep inward. */
const PIECES = SHARDS.map((s) => {
  const c = centroid(s.pts)
  const dx = c[0] - 50
  const dy = c[1] - 50
  const len = Math.hypot(dx, dy) || 1
  return {
    clip: `polygon(${bloat(s.pts, c)})`,
    origin: `${c[0].toFixed(2)}% ${c[1].toFixed(2)}%`,
    /* the rest offset: along this shard's own ray out of the centre */
    x: (dx / len) * s.mag,
    y: (dy / len) * s.mag,
    rot: s.rot,
    dist: len,
  }
}).sort((a, b) => b.dist - a.dist)

const GLASS = '/services/3d-websites/glass-screen.webp'
const KNOT = '/services/3d-websites/knot.webp'

/* the shard flight, and the stagger that walks it inward */
const SHARD_DUR = 0.7
const SHARD_STAGGER = 0.03
/** the knot surfaces once the screen is most of the way home */
const KNOT_AT = 0.6

export default function GlassShatter({ label }: { label?: string }) {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const shards = Array.from(root.querySelectorAll<HTMLElement>('.gs-shard'))
    const knot = root.querySelector<HTMLElement>('.gs-knot')
    const float = root.querySelector<HTMLElement>('.gs-float')
    const bloom = root.querySelector<HTMLElement>('.gs-bloom')
    const flash = root.querySelector<HTMLElement>('.gs-flash')
    if (!shards.length || !knot || !float || !bloom || !flash) return

    /* THE IDLE FLOAT LIVES ON ITS OWN ELEMENT. The timeline owns .gs-knot's
       y and scale; if the float wrote y to the same node the two would
       overwrite each other every frame and the reverse would fight it. */
    let floating: gsap.core.Tween | null = null
    const startFloat = () => {
      floating?.kill()
      floating = gsap.to(float, {
        y: -6,
        duration: 4.6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
    }
    const stopFloat = () => {
      floating?.kill()
      floating = null
      gsap.set(float, { y: 0 })
    }

    const armLayers = () => shards.forEach((el) => (el.style.willChange = 'transform'))
    /* nine promoted layers must not sit on the GPU while nothing moves */
    const dropLayers = () => shards.forEach((el) => (el.style.willChange = ''))

    const tl = gsap.timeline({
      paused: true,
      onStart: armLayers,
      onComplete: () => {
        dropLayers()
        startFloat()
      },
      onReverseComplete: dropLayers,
    })

    tl.to(
      shards,
      {
        x: 0,
        y: 0,
        rotation: 0,
        duration: SHARD_DUR,
        ease: 'power3.inOut',
        stagger: { each: SHARD_STAGGER, from: 'start' },
      },
      0,
    )

    const shardsEnd = SHARD_DUR + SHARD_STAGGER * (shards.length - 1)

    tl.to(knot, { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' }, shardsEnd * KNOT_AT)
    tl.to(bloom, { scale: 1, opacity: 0.3, duration: 0.5, ease: 'power2.out' }, shardsEnd * KNOT_AT)

    /* the click of assembly — a breath of light as the last pieces land */
    tl.to(flash, { opacity: 0.08, duration: 0.1, ease: 'power2.out' }, shardsEnd - 0.16)
    tl.to(flash, { opacity: 0, duration: 0.15, ease: 'power2.in' }, shardsEnd - 0.06)

    const open = () => {
      stopFloat()
      tl.timeScale(1).play()
    }
    const close = () => {
      stopFloat()
      tl.timeScale(1.4).reverse()
    }

    /* expose the timeline for the prototype's scrubber; harmless in §4 */
    ;(root as unknown as { __tl?: gsap.core.Timeline }).__tl = tl

    if (window.matchMedia('(hover: hover)').matches) {
      root.addEventListener('mouseenter', open)
      root.addEventListener('mouseleave', close)
      /* keyboard users get the same thing — the card is a link in §4 */
      root.addEventListener('focusin', open)
      root.addEventListener('focusout', close)
      return () => {
        root.removeEventListener('mouseenter', open)
        root.removeEventListener('mouseleave', close)
        root.removeEventListener('focusin', open)
        root.removeEventListener('focusout', close)
        stopFloat()
        tl.kill()
      }
    }

    /* touch has no hover to give: assemble once on approach, never undo */
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          tl.play()
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(root)
    return () => {
      io.disconnect()
      stopFloat()
      tl.kill()
    }
  }, [])

  return (
    <div className="gs" ref={rootRef}>
      {/* The picture, nine times over. Decorative: the card's name and copy
          carry the meaning, and nine identical alts would be nine repetitions
          to a screen reader. */}
      <div className="gs-glass" aria-hidden="true">
        {PIECES.map((p, i) => (
          <img
            key={i}
            className="gs-shard"
            src={GLASS}
            alt=""
            /* every shard is the same box and the same source — one decode */
            style={{
              clipPath: p.clip,
              transformOrigin: p.origin,
              /* the REST state is the broken one, written as real style so
                 it is correct before JS runs and if JS never runs */
              transform: `translate(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px) rotate(${p.rot}deg)`,
            }}
          />
        ))}
      </div>

      <i className="gs-bloom" aria-hidden="true" />

      <div className="gs-float">
        <img className="gs-knot" src={KNOT} alt={label ?? ''} />
      </div>

      {/* the assembly's flash of light */}
      <i className="gs-flash" aria-hidden="true" />
    </div>
  )
}
