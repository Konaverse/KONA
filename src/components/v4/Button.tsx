'use client'

import { useEffect, useRef } from 'react'

/**
 * BUTTON — still at rest, alive on approach.
 *
 * REST. No perpetual animation, by decision rather than omission. See
 * docs/components.md for the argument; the short version is that an animated
 * border contradicts the system's "nothing moves on its own" rule, spends the
 * accent budget continuously, and is the most over-used device on the web right
 * now. Instead the button responds to PROXIMITY — it leans toward an
 * approaching cursor before it is ever hovered. Alive only when a human is
 * near, which is the register we are after.
 *
 * HOVER. One gesture: the fill grows up from the bottom rule while the label
 * rolls up letter by letter and the second label rolls up behind it.
 */

const RADIUS = 110 // px — how far away the button starts noticing the cursor
const PULL = 0.22 // fraction of the offset it travels. Small on purpose.
const MAX = 6 // px — hard ceiling, so a wide button never slides

function split(text: string, line: 'a' | 'b') {
  return [...text].map((ch, i) => (
    <span key={`${line}-${i}`} style={{ '--i': i } as React.CSSProperties}>
      {ch === ' ' ? ' ' : ch}
    </span>
  ))
}

export default function Button({
  children,
  hoverLabel,
  href,
  ghost = false,
  className = '',
  onClick,
}: {
  children: string
  /** The label that rolls up behind the first one. Defaults to the same text. */
  hoverLabel?: string
  href?: string
  ghost?: boolean
  className?: string
  onClick?: () => void
}) {
  const ref = useRef<HTMLElement | null>(null)
  const raf = useRef(0)
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 })

  const a = children
  const b = hoverLabel ?? children
  // the button must be wide enough for whichever label is longer, or it
  // would resize halfway through the roll
  const sizer = a.length >= b.length ? a : b

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(hover: hover)').matches) return

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)
      const reach = Math.max(r.width, r.height) / 2 + RADIUS
      if (dist > reach) {
        pos.current.tx = 0
        pos.current.ty = 0
      } else {
        pos.current.tx = Math.max(-MAX, Math.min(MAX, dx * PULL))
        pos.current.ty = Math.max(-MAX, Math.min(MAX, dy * PULL))
      }
    }

    // eased toward the target rather than snapped, so leaving the radius
    // glides back instead of cutting
    const tick = () => {
      const p = pos.current
      p.x += (p.tx - p.x) * 0.12
      p.y += (p.ty - p.y) * 0.12
      if (Math.abs(p.x) < 0.01 && Math.abs(p.y) < 0.01 && p.tx === 0 && p.ty === 0) {
        el.style.transform = ''
      } else {
        el.style.transform = `translate(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px)`
      }
      raf.current = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    raf.current = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  const inner = (
    <>
      <span className="k-btn__bg" aria-hidden="true" />
      <span className="k-btn__roll">
        {/* real text for a11y and search; the split copies are hidden from AT */}
        <span className="k-btn__sizer">{sizer}</span>
        <span className="k-btn__line k-btn__line--a" aria-hidden="true">{split(a, 'a')}</span>
        <span className="k-btn__line k-btn__line--b" aria-hidden="true">{split(b, 'b')}</span>
        <span className="sr-only">{a}</span>
      </span>
    </>
  )

  const cls = `k-btn${ghost ? ' k-btn-ghost' : ''}${className ? ` ${className}` : ''}`

  if (href) {
    return (
      <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={cls} onClick={onClick}>
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
