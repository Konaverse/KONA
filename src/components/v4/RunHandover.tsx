'use client'

import { Fragment, useEffect, useRef, type ReactNode } from 'react'
import { gsap, rem } from '@/lib/motion-v4'

/**
 * THE RUN · 5 — THE HANDOVER (service pages, 2026-09-17; the brief:
 * "the two CTAs as the story's last beat; then the quiet links out",
 * and of the grounds: "gradients should DO something… pool under the
 * active element").
 *
 * THE PICTURE (run.css `.rh`). The void — the plan's seam opened onto
 * it. The invite at display size, the two house buttons (Contact and
 * Book) and the mail under it; beside them THE RECEIPT, a small card
 * the agent sets down: the run you have just watched, line by line —
 * the three facts and the step count, every one this page's own data,
 * all ticked. Under everything, quiet, the up-link and the one line to
 * the sister page; the footer is dark already, so the page ends without
 * a seam.
 *
 * THE LIGHT DOES THE WORK. One bright core in the dark. It drifts on
 * its own slow figure; with a pointer in the section it leans to the
 * hand; and near a button it POOLS under that button — the ground
 * chooses with you. Where nothing can hover it pools under the button
 * nearer the screen's middle.
 *
 * THE ENTRANCE. Once, as the section takes the screen: the invite's
 * words rise out of their line, the buttons follow, the receipt slides
 * in under Kona's cursor and its ticks close one by one (CSS, keyed on
 * `is-in`).
 *
 * THE DRIVER. gsap.ticker + one rect per frame; the buttons' places are
 * offsets. Written per frame: two custom properties. Hidden states live
 * under `.is-live`; no JS and reduced motion get everything in place,
 * the core still drifting on its CSS clock. Every word is
 * server-rendered.
 */

export type ReceiptLine = { label: string; value: string }

/** how near a button (rem) the light lets go of the hand and pools */
const POOL = 15
/** the core's ease, in seconds */
const GLIDE = 0.35

export default function RunHandover({
  name,
  invite,
  receipt,
  actions,
  children,
}: {
  name: string
  invite: string
  receipt: readonly ReceiptLine[]
  /** the two CTAs and the mail, rendered by the page */
  actions: ReactNode
  /** the quiet links out */
  children: ReactNode
}) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const glow = root.querySelector<HTMLElement>('.rh-glow')!
    const btns = Array.from(root.querySelectorAll<HTMLElement>('.rh-act .k-btn'))
    root.classList.add('is-live')

    /* the buttons' centres in the section (px): offsets */
    let spots: { x: number; y: number }[] = []
    const measure = () => {
      spots = btns.map((b) => {
        let x = b.offsetWidth / 2
        let y = b.offsetHeight / 2
        let n: HTMLElement | null = b
        while (n && n !== root) {
          x += n.offsetLeft
          y += n.offsetTop
          n = n.offsetParent as HTMLElement | null
        }
        return { x, y }
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(root)

    let hx = -1
    let hy = -1
    const onMove = (ev: PointerEvent) => {
      const r = root.getBoundingClientRect()
      hx = ev.clientX - r.left
      hy = ev.clientY - r.top
    }
    const onLeave = () => (hx = -1)
    root.addEventListener('pointermove', onMove, { passive: true })
    root.addEventListener('pointerleave', onLeave)

    let gx = -1
    let gy = -1
    let seen = false
    let pooled = -1
    const tick = (time?: number, deltaTime?: number) => {
      const r = root.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < 0 || r.top > vh) return
      if (!seen && r.top < vh * 0.78) {
        seen = true
        root.classList.add('is-in')
      }
      const t = time ?? 0
      const reach = POOL * 16 * rem()
      /* the core's aim: its own figure, or the hand, or a button */
      let tx = r.width * (0.4 + 0.22 * Math.sin(t * 0.23))
      let ty = r.height * 0.5 + vh * 0.16 * Math.sin(t * 0.31 + 1.3)
      let pool = -1
      if (canHover && hx >= 0) {
        tx = hx
        ty = hy
        let best = reach
        spots.forEach((s, i) => {
          const d = Math.hypot(s.x - hx, s.y - hy)
          if (d < best) {
            best = d
            pool = i
          }
        })
      } else if (!canHover && spots.length) {
        const mid = vh * 0.5 - r.top
        pool = spots.reduce((b, s, i) => (Math.abs(s.y - mid) + i < Math.abs(spots[b].y - mid) + b ? i : b), 0)
        if (Math.abs(spots[pool].y - mid) > vh * 0.4) pool = -1
      }
      if (pool >= 0) {
        tx = spots[pool].x
        ty = spots[pool].y
      }
      if (pool !== pooled) {
        btns.forEach((b, i) => b.classList.toggle('is-pooled', i === pool))
        root.classList.toggle('is-pooling', pool >= 0)
        pooled = pool
      }
      const f = 1 - Math.exp(-((deltaTime ?? 16.7) / 1000) / GLIDE)
      gx = gx < 0 ? tx : gx + (tx - gx) * f
      gy = gy < 0 ? ty : gy + (ty - gy) * f
      glow.style.transform = `translate3d(${gx.toFixed(1)}px, ${gy.toFixed(1)}px, 0)`
    }
    tick()
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      ro.disconnect()
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
      root.classList.remove('is-live', 'is-in', 'is-pooling')
      btns.forEach((b) => b.classList.remove('is-pooled'))
      glow.style.transform = ''
    }
  }, [])

  return (
    <section ref={ref} id="start" className="rh k-dark" data-dark="1" aria-labelledby="rh-h">
      <span className="rh-glow" aria-hidden="true"><i /></span>

      <div className="rh-main">
        <h2 id="rh-h" className="rh-h">
          {invite.split(' ').map((w, i) => (
            <Fragment key={i}>
              {i > 0 ? ' ' : null}
              <span className="rh-m">
                <span className="rh-w" style={{ '--i': i } as React.CSSProperties}>{w}</span>
              </span>
            </Fragment>
          ))}
        </h2>
        <div className="rh-act">{actions}</div>
      </div>

      {/* THE RECEIPT: the run, in this page's own data */}
      <aside className="rh-receipt" aria-label={`${name}, at a glance`}>
        <div className="rh-receipt-in">
          <p className="rh-r-t">{name}</p>
          <ul>
            {receipt.map((l, i) => (
              <li key={l.label} style={{ '--i': i } as React.CSSProperties}>
                <i className="rn-tick" aria-hidden="true" />
                <span>{l.label}</span>
                <b>{l.value}</b>
              </li>
            ))}
          </ul>
        </div>
        <span className="rh-cursor k-agent" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M4 2.5l15.5 8.2-6.6 1.9-2.6 6.6z" />
          </svg>
          <b>Kona</b>
        </span>
      </aside>

      <nav className="rh-foot" aria-label="Related">
        {children}
      </nav>
    </section>
  )
}
