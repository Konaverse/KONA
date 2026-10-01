'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { gsap, EASE } from '@/lib/motion-v4'

/**
 * BUTTON — still at rest; the flood answers where you arrived.
 *
 * REST. A pill and a label, and one small mark on the label's RIGHT that says
 * what kind of place this goes to: an east arrow for the site's own pages, a
 * north-east one for anything that leaves it, the same grammar as ArrowLink.
 * Nothing tracks the cursor and nothing loops.
 *
 * HOVER, two moves off one crossing point:
 *
 *   THE FLOOD. Where the pointer crossed the edge, a disc of the other
 *   polarity grows and inverts the button, each letter flipping as the disc's
 *   edge passes under it. The primary floods to the page and takes the
 *   ghost's hairline as it goes; the ghost floods to ink. The two variants
 *   trade places. On leave the disc drains toward the point where the
 *   pointer LEFT, not where it came in — the flood follows you out.
 *
 *   THE SWAP. The label rolls up to its second line, letter by letter; the
 *   arrow on the right rolls up and out with it; the label slides over; and
 *   a second mark rolls up into the room it left on the LEFT. Two icons, one
 *   per state, one side each — the rest icon names the destination, the
 *   hover one is the house MARK, which draws itself in as a line.
 *
 * There is no drawn ring outside the button any more (user call,
 * 2026-09-13): its distance from the fill never read as one thing across
 * variants and grounds, and the flood plus the swap already answer the
 * crossing. The flood is a full copy of the label row, clipped to the disc,
 * so the two rows must stay identical — the hover selectors in tokens.css
 * match both.
 *
 * CONSTANT SPEED: the flood's duration is derived from the button's size, so
 * a wide CTA does not fill faster than a narrow one. Keyboard focus has no
 * entry point, so it floods from bottom centre.
 */

/** px per ms the disc's edge travels, and the clamp around it */
const SPEED = 0.55
const MIN_D = 320
const MAX_D = 640

/** the drain gets less time than the flood: a disc collapsing to a point
 *  must not linger as a dot, and it runs on the symmetric curve */
const DRAIN = 0.7

/* ---------- the two marks ----------
   Drawn in the label's own colour, hairline strokes that match
   ArrowLink's. The arrow is the destination mark; the hover mark is the
   Konaverse logo, DRAWN IN as a line on hover (2026-10-01, user: "I just
   want it to be animated as a line drawing when I hover over a button";
   it replaced the house sparkle). */

function Arrow({ external }: { external: boolean }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <g transform={external ? 'rotate(-45 8 8)' : undefined}>
        <path d="M2.5 8 H13" />
        <path d="M9 3.75 L13.25 8 L9 12.25" />
      </g>
    </svg>
  )
}

/** THE MARK: the logo rebuilt as its three continuous strokes — measured
 *  off public/brand/mark.png (552 x 512, strokes 22.5 wide, all straight,
 *  at 45° and 60°), so each is one path the hover can draw end to end.
 *  `pathLength` 1 makes the dash maths the same for all three
 *  (.k-btn__mark in tokens.css). The stroke is heavier than the PNG's so
 *  it still reads as a hairline at label size. */
function Mark() {
  return (
    <svg className="k-btn__mark" viewBox="0 0 552 512" fill="none" stroke="currentColor"
      strokeWidth="30" strokeLinejoin="miter" strokeLinecap="butt" aria-hidden="true">
      {/* the C and the long diagonal, one stroke: hook, top, down, tip, up, bar */}
      <path pathLength={1} d="M96.5 175 V103 H22 V474 L476 22 H356" />
      {/* the P: foot, stem, bowl, inner stem */}
      <path pathLength={1} d="M257 400 H165 V22 H300.5 V103.5 L196 208 V298" />
      {/* the open V on the right */}
      <path pathLength={1} d="M319.5 225 L419 400 H522 L378 151" />
    </svg>
  )
}

export default function Button({
  children,
  hoverLabel,
  href,
  external = false,
  ghost = false,
  icon,
  hoverIcon,
  className = '',
  onClick,
}: {
  children: string
  /** The label that rolls up behind the first one. Defaults to the same text. */
  hoverLabel?: string
  href?: string
  /** Opens in a new tab (Calendly, the live project sites). Also swings the
      rest arrow to north-east, the way ArrowLink marks an exit. */
  external?: boolean
  ghost?: boolean
  /** The rest mark, on the right. Defaults to the destination arrow. */
  icon?: ReactNode
  /** The hover mark, on the left. Defaults to the drawn logo. */
  hoverIcon?: ReactNode
  className?: string
  onClick?: () => void
}) {
  const ref = useRef<HTMLElement | null>(null)
  const floodTween = useRef<ReturnType<typeof gsap.to> | null>(null)
  /* flood state, in border-box coordinates. fr is the current radius, FR
     the full one — the distance from the disc's centre to the farthest
     corner, so the disc always finishes covering the fill. */
  const geo = useRef({ w: 0, h: 0, D: 440, fx: 0, fy: 0, fr: 0, FR: 0 })
  const [box, setBox] = useState({ w: 0, h: 0 })

  const a = children
  const b = hoverLabel ?? children

  /* measure the border box. The 0.5px guard stops a sub-pixel wobble
     looping the observer. */
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

  useEffect(() => {
    const el = ref.current
    if (!el || box.w === 0) return
    // the longest run the disc can have is the diagonal; speed off that
    const diag = Math.hypot(box.w, box.h)
    const D = Math.min(MAX_D, Math.max(MIN_D, diag / SPEED))
    geo.current = { ...geo.current, w: box.w, h: box.h, D, fr: 0 }
    el.style.setProperty('--k-btn-fr', '0px')
  }, [box.w, box.h])

  /**
   * THE FLOOD. Anchored only from a standing start (re-centring a half-grown
   * disc would jump); duration proportional to the radius left to cover, so
   * an interrupted flood keeps its speed. On the way OUT, a fully flooded
   * disc is re-centred on the exit point first — invisible, because a full
   * disc covers the box from any centre — so the drain follows the pointer
   * out. A disc caught mid-flood drains back toward where it started.
   * Takes BORDER-BOX pointer coordinates.
   */
  const runFlood = useCallback((forward: boolean, bx?: number, by?: number) => {
    const el = ref.current
    const g = geo.current
    if (!el || g.w <= 0) return
    const anchor = (x: number, y: number) => {
      g.fx = Math.min(Math.max(x, 0), g.w)
      g.fy = Math.min(Math.max(y, 0), g.h)
      g.FR = Math.hypot(Math.max(g.fx, g.w - g.fx), Math.max(g.fy, g.h - g.fy))
      el.style.setProperty('--k-btn-fx', `${g.fx}px`)
      el.style.setProperty('--k-btn-fy', `${g.fy}px`)
    }
    if (forward && bx !== undefined && by !== undefined && g.fr < 1) anchor(bx, by)
    if (!forward && bx !== undefined && by !== undefined && g.FR > 0 && g.fr >= g.FR - 0.5) {
      anchor(bx, by)
      g.fr = g.FR
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
      duration: ((span / g.FR) * g.D * (forward ? 1 : DRAIN)) / 1000,
      ease: forward ? EASE.settle : EASE.drift,
      onUpdate: apply,
    })
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // reduced motion shows the flood without growing it (handled in CSS);
    // touch never floods, since there is no approach to answer
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(hover: hover)').matches) return

    const local = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      return { bx: e.clientX - r.left, by: e.clientY - r.top }
    }
    const enter = (e: PointerEvent) => {
      const { bx, by } = local(e)
      runFlood(true, bx, by)
    }
    const leave = (e: PointerEvent) => {
      if (el.matches(':focus-visible')) return
      const { bx, by } = local(e)
      runFlood(false, bx, by)
    }
    const focus = () => {
      // no entry point for a keyboard — bottom centre
      if (el.matches(':focus-visible')) runFlood(true, box.w / 2, box.h)
    }
    const blur = () => {
      if (!el.matches(':hover')) runFlood(false)
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
  }, [box.w, box.h, runFlood])

  useEffect(() => () => { floodTween.current?.kill() }, [])

  const restIcon = icon ?? <Arrow external={external} />
  const hotIcon = hoverIcon ?? <Mark />

  /* the label row, written once and rendered twice — the second copy sits
     on the flooded ground in the flood's ink, clipped to the disc. The
     sizer lays BOTH labels out invisibly in one grid cell, so the roll is
     as wide as the wider one as rendered: character count lied ("Write to
     us" has more letters than "Contact us" and fewer pixels). */
  const row = (hidden: boolean) => (
    <span className="k-btn__row">
      <span className="k-btn__ico k-btn__ico--l">
        <span className="k-btn__ico-in">{hotIcon}</span>
      </span>
      <span className="k-btn__roll">
        <span className="k-btn__sizer"><span>{a}</span><span>{b}</span></span>
        <span className="k-btn__line k-btn__line--a" aria-hidden="true">{split(a, 'a')}</span>
        <span className="k-btn__line k-btn__line--b" aria-hidden="true">{split(b, 'b')}</span>
        {!hidden && <span className="sr-only">{a}</span>}
      </span>
      <span className="k-btn__ico k-btn__ico--r">
        <span className="k-btn__ico-in">{restIcon}</span>
      </span>
    </span>
  )

  const inner = (
    <>
      {row(false)}
      {/* the flood: the inverted copy, clipped to the growing disc */}
      <span className="k-btn__flood" aria-hidden="true">
        {row(true)}
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
      {/* NBSP, not a plain space: each letter is its own inline-block, and a
          span holding only a normal space collapses to zero width */}
      {ch === ' ' ? '\u00A0' : ch}
    </span>
  ))
}
