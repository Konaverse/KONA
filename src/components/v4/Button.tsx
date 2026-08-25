'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap, EASE } from '@/lib/motion-v4'

/**
 * BUTTON — still at rest; the edge answers where you arrived.
 *
 * REST. An ice-deep pill inside a white border. Nothing tracks the cursor and
 * nothing loops. The proximity lean that used to live here is gone: it moved
 * because you were near, which you already knew, so it carried no information —
 * and it competed with the fluid cursor for the same pointer movement.
 *
 * HOVER. Where the pointer crosses the edge, two heads leave that exact point
 * in opposite directions, travel the perimeter and meet at the far side.
 *
 * The line is drawn OUTSIDE the border box, not on it. The white border is not
 * decoration — it is the gap. On a white page it reads as page, so at rest you
 * see a plain ice-deep pill; on hover the line traces beyond it and that band
 * of white is what holds the line off the fill and keeps both readable. Which
 * is why the SVG is larger than the button and hangs outside it: covering the
 * white border with the line, as the previous pass did, is the thing being
 * avoided.
 *
 * THE FLOOD (user-directed, 2026-08-17). Inside the border, a disc of page
 * colour grows from that same entry point and inverts the button: the fill
 * floods to white and the letters flip to ice-deep exactly as the disc's edge
 * passes under them. One crossing, two expressions, one origin — the line
 * traces outside the border while the colour floods inside it. The label
 * rolls on --d-base and lands first, the flood lands second, and the line
 * closing last is what seals the state.
 *
 * The flip is a full copy of the roll sitting on the flooded ground, clipped
 * to the disc (clip-path: circle() driven by three CSS variables this file
 * tweens). Ghost buttons flood the other way — ice-deep ground, white text —
 * via the same two custom properties.
 *
 * CONSTANT SPEED, not constant duration: the duration is derived from the
 * perimeter, so a wide CTA's line does not travel faster than a narrow one's.
 * Nobody notices this consciously; everybody feels it.
 *
 * Keyboard focus has no entry point, so it draws from bottom centre.
 */

/** px per ms the heads travel. ~440px perimeter on a typical CTA => ~710ms,
 *  so each head covers ~220px in that time. Deliberately slow: this is the
 *  considered part of the gesture and the roll no longer waits for it. */
const SPEED = 0.62
const MIN_D = 480
const MAX_D = 1000

/** perimeter samples used to project the pointer onto the path. 240 across a
 *  ~440px perimeter is ~1.8px of resolution — below the threshold of noticing. */
const SAMPLES = 240

/** transparent room the SVG keeps outside the button so the line is not
 *  clipped by its own canvas. The CSS centres the SVG rather than offsetting
 *  by this, so the two do not have to agree on a number. */
const PAD = 8
/** stroke width. A little heavier than a hairline: at rest there is still no
 *  colour behind it, and mid-flood it has to hold against a changing fill. */
const LINE_W = 2

/** the flood's share of the draw's duration. Same origin, own clock: it
 *  should land after the roll (--d-base) and just before the line closes —
 *  label, fill, line, in that order. */
const FLOOD = 0.8

type Pt = { x: number; y: number; l: number }

function mod(n: number, m: number) {
  return ((n % m) + m) % m
}

/** A rounded rect as an explicit path, in SVG-local coordinates. Generated
 *  rather than using <rect rx> so getTotalLength/getPointAtLength measure
 *  geometry we control. With r = h/2 the vertical straights collapse to zero
 *  and it is exactly a pill. */
function pillPath(x: number, y: number, w: number, h: number) {
  const r = Math.min(w, h) / 2
  return [
    `M${x + r},${y}`,
    `H${x + w - r}`,
    `A${r},${r} 0 0 1 ${x + w},${y + r}`,
    `V${y + h - r}`,
    `A${r},${r} 0 0 1 ${x + w - r},${y + h}`,
    `H${x + r}`,
    `A${r},${r} 0 0 1 ${x},${y + h - r}`,
    `V${y + r}`,
    `A${r},${r} 0 0 1 ${x + r},${y}`,
    'Z',
  ].join(' ')
}

/**
 * The two heads, from one number.
 *
 * The drawn arc is always centred on the entry offset `t` with half-width L/2,
 * so growing L from 0 to P grows it symmetrically in both directions — the two
 * lines and their meeting fall out of a single tween, with no second path and
 * no drift between the halves.
 *
 * The dash pattern always totals exactly P so it tiles the closed path with no
 * seam. The naive `L, P` with a negative offset looks simpler but silently
 * clips the dash wherever it would wrap past the path's start point.
 */
function dash(t: number, L: number, P: number) {
  if (P <= 0) return '0 1'
  if (L >= P) return `${P} 0`
  if (L <= 0.001) return `0 ${P}`
  const a = mod(t - L / 2, P)
  const b = mod(t + L / 2, P)
  // a < b: one dash, [a, b]. Otherwise it wraps, so it is two: [0, b] and [a, P].
  return a < b ? `0 ${a} ${b - a} ${P - b}` : `${b} ${a - b} ${P - a} 0`
}

export default function Button({
  children,
  hoverLabel,
  href,
  external = false,
  ghost = false,
  className = '',
  onClick,
}: {
  children: string
  /** The label that rolls up behind the first one. Defaults to the same text. */
  hoverLabel?: string
  href?: string
  /** Opens in a new tab (Calendly, the live project sites). The page
      transition already ignores `target` links, so nothing else changes. */
  external?: boolean
  ghost?: boolean
  className?: string
  onClick?: () => void
}) {
  const ref = useRef<HTMLElement | null>(null)
  const pathRef = useRef<SVGPathElement | null>(null)
  const tween = useRef<ReturnType<typeof gsap.to> | null>(null)
  const floodTween = useRef<ReturnType<typeof gsap.to> | null>(null)
  const geo = useRef({
    P: 0, D: 440, t: 0, L: 0, pts: [] as Pt[],
    /* flood state. The circle lives in PADDING-BOX coordinates (the flood
       layer spans the padding box, inside the white border), so pointer
       coords have to be shifted by the border width bw. fr is the current
       radius, FR the full one — the distance from the entry point to the
       farthest corner, so the disc always finishes covering the fill. */
    bw: 0, pw: 0, ph: 0, fx: 0, fy: 0, fr: 0, FR: 0,
  })
  const [box, setBox] = useState({ w: 0, h: 0 })

  const a = children
  const b = hoverLabel ?? children
  // the button must be wide enough for whichever label is longer, or it
  // would resize halfway through the roll
  const sizer = a.length >= b.length ? a : b

  /* measure the border box — the line is drawn just outside it.
     Kept FRACTIONAL on purpose. Rounding here used to cost up to a pixel of
     height, and because the SVG was pinned by its top-left the whole error
     landed at the bottom — the white band came out visibly thinner there than
     at the top. The CSS now centres the SVG instead of pinning it, so any
     residual error splits evenly, and this keeps the error near zero anyway.
     The 0.5px guard is what stops a sub-pixel wobble looping the observer. */
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect()
      setBox((prev) =>
        Math.abs(prev.w - r.width) < 0.5 && Math.abs(prev.h - r.height) < 0.5
          ? prev
          : { w: r.width, h: r.height },
      )
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  /* rebuild the path measurements, and publish the timing the CSS reads */
  useEffect(() => {
    const el = ref.current
    const p = pathRef.current
    if (!el || !p || box.w === 0) return

    const P = p.getTotalLength()
    const D = Math.min(MAX_D, Math.max(MIN_D, P / SPEED))
    const pts: Pt[] = []
    for (let i = 0; i <= SAMPLES; i++) {
      const l = (i / SAMPLES) * P
      const { x, y } = p.getPointAtLength(l)
      pts.push({ x, y, l })
    }
    // measured, not assumed: the ghost variant's border is a hairline, not 3px
    const bw = parseFloat(getComputedStyle(el).borderTopWidth) || 0
    geo.current = {
      ...geo.current, P, D, pts, L: 0, fr: 0,
      bw, pw: box.w - 2 * bw, ph: box.h - 2 * bw,
    }
    p.style.strokeDasharray = dash(0, 0, P)
    el.style.setProperty('--k-btn-fr', '0px')
  }, [box.w, box.h])

  /** nearest point on the perimeter. Takes BORDER-BOX coordinates and shifts
   *  them into the SVG's own space, which extends PAD beyond on every side. */
  const offsetFor = useCallback((bx: number, by: number) => {
    const { pts } = geo.current
    const x = bx + PAD
    const y = by + PAD
    let best = 0
    let bd = Infinity
    for (let i = 0; i < pts.length; i++) {
      const dx = pts[i].x - x
      const dy = pts[i].y - y
      const d = dx * dx + dy * dy
      if (d < bd) {
        bd = d
        best = i
      }
    }
    return pts.length ? pts[best].l : 0
  }, [])

  /**
   * Duration is proportional to the distance left to travel, so an interrupted
   * draw keeps the same speed instead of racing or crawling to catch up. The
   * entry point is only re-anchored from a standing start — re-anchoring a
   * partly drawn line would make it jump.
   */
  const run = useCallback((forward: boolean, t?: number) => {
    const g = geo.current
    if (!g.P) return
    if (forward && t !== undefined && g.L < 1) g.t = t

    tween.current?.kill()
    const to = forward ? g.P : 0
    const span = Math.abs(to - g.L)
    const apply = () => {
      if (pathRef.current) pathRef.current.style.strokeDasharray = dash(g.t, g.L, g.P)
    }
    if (span < 0.5) {
      g.L = to
      apply()
      return
    }
    tween.current = gsap.to(g, {
      L: to,
      duration: ((span / g.P) * g.D) / 1000,
      ease: EASE.settle,
      onUpdate: apply,
    })
  }, [])

  /**
   * The flood, same discipline as the draw: anchored only from a standing
   * start (re-centring a half-grown disc would jump), duration proportional
   * to the radius left to cover, so an interrupted flood keeps its speed.
   * Retreat collapses back toward the entry point, the same place the line
   * retreats to. Takes BORDER-BOX pointer coordinates.
   */
  const runFlood = useCallback((forward: boolean, bx?: number, by?: number) => {
    const el = ref.current
    const g = geo.current
    if (!el || g.pw <= 0) return
    if (forward && bx !== undefined && by !== undefined && g.fr < 1) {
      const x = Math.min(Math.max(bx - g.bw, 0), g.pw)
      const y = Math.min(Math.max(by - g.bw, 0), g.ph)
      g.fx = x
      g.fy = y
      g.FR = Math.hypot(Math.max(x, g.pw - x), Math.max(y, g.ph - y))
      el.style.setProperty('--k-btn-fx', `${x}px`)
      el.style.setProperty('--k-btn-fy', `${y}px`)
    }
    if (g.FR <= 0) return
    floodTween.current?.kill()
    const to = forward ? g.FR : 0
    const span = Math.abs(to - g.fr)
    const apply = () => el.style.setProperty('--k-btn-fr', `${g.fr}px`)
    if (span < 0.5) {
      g.fr = to
      apply()
      return
    }
    floodTween.current = gsap.to(g, {
      fr: to,
      duration: ((span / g.FR) * g.D * FLOOD) / 1000,
      ease: EASE.settle,
      onUpdate: apply,
    })
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // reduced motion shows the line without drawing it (handled in CSS);
    // touch never draws, since there is no approach to answer
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(hover: hover)').matches) return

    const enter = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const bx = e.clientX - r.left
      const by = e.clientY - r.top
      run(true, offsetFor(bx, by))
      runFlood(true, bx, by)
    }
    const leave = () => {
      if (!el.matches(':focus-visible')) {
        run(false)
        runFlood(false)
      }
    }
    const focus = () => {
      // no entry point for a keyboard — bottom centre
      if (el.matches(':focus-visible')) {
        run(true, offsetFor(box.w / 2, box.h))
        runFlood(true, box.w / 2, box.h)
      }
    }
    const blur = () => {
      if (!el.matches(':hover')) {
        run(false)
        runFlood(false)
      }
    }

    el.addEventListener('pointerenter', enter)
    el.addEventListener('pointerleave', leave)
    el.addEventListener('focus', focus)
    el.addEventListener('blur', blur)
    return () => {
      el.removeEventListener('pointerenter', enter)
      el.removeEventListener('pointerleave', leave)
      el.removeEventListener('focus', focus)
      el.removeEventListener('blur', blur)
    }
  }, [box.w, box.h, run, runFlood, offsetFor])

  useEffect(
    () => () => {
      tween.current?.kill()
      floodTween.current?.kill()
    },
    [],
  )

  const inner = (
    <>
      {box.w > 0 && (
        <svg
          className="k-btn__edge"
          width={box.w + PAD * 2}
          height={box.h + PAD * 2}
          viewBox={`0 0 ${box.w + PAD * 2} ${box.h + PAD * 2}`}
          aria-hidden="true"
          focusable="false"
        >
          {/* the border box sits at (PAD, PAD); the path is grown by half a
              stroke so the line's INNER edge lands on it and the white border
              stays clear underneath. The initial dasharray hides the line
              before JS runs, so a hydration failure leaves a plain pill. */}
          <path
            ref={pathRef}
            d={pillPath(PAD - LINE_W / 2, PAD - LINE_W / 2, box.w + LINE_W, box.h + LINE_W)}
            style={{ strokeDasharray: '0 99999' }}
          />
        </svg>
      )}
      <span className="k-btn__roll">
        {/* real text for a11y and search; the split copies are hidden from AT */}
        <span className="k-btn__sizer">{sizer}</span>
        <span className="k-btn__line k-btn__line--a" aria-hidden="true">{split(a, 'a')}</span>
        <span className="k-btn__line k-btn__line--b" aria-hidden="true">{split(b, 'b')}</span>
        <span className="sr-only">{a}</span>
      </span>
      {/* the flood: the inverted copy, clipped to the growing disc. Its CSS
          mirrors the button's own padding and flex so this roll lands exactly
          over the one above; the hover selectors match both, so the two copies
          roll in lockstep and only the colour differs across the disc's edge. */}
      <span className="k-btn__flood" aria-hidden="true">
        <span className="k-btn__roll">
          <span className="k-btn__sizer">{sizer}</span>
          <span className="k-btn__line k-btn__line--a">{split(a, 'a')}</span>
          <span className="k-btn__line k-btn__line--b">{split(b, 'b')}</span>
        </span>
      </span>
    </>
  )

  const cls = `k-btn${ghost ? ' k-btn-ghost' : ''}${className ? ` ${className}` : ''}`

  if (href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={cls}
        onClick={onClick}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {inner}
      </a>
    )
  }
  return (
    <button ref={ref as React.Ref<HTMLButtonElement>} type="button" className={cls} onClick={onClick}>
      {inner}
    </button>
  )
}

function split(text: string, line: 'a' | 'b') {
  return [...text].map((ch, i) => (
    <span key={`${line}-${i}`} style={{ '--i': i } as React.CSSProperties}>
      {/* NBSP, not a plain space. Each letter is its own inline-block, so a
          span holding only a normal space has that space as both the leading
          and the trailing white space of its own line box — which CSS removes.
          It collapses to zero width and the words run together. */}
      {ch === ' ' ? ' ' : ch}
    </span>
  ))
}
