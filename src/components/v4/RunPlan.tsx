'use client'

import { useEffect, useRef } from 'react'
import { gsap, rem } from '@/lib/motion-v4'
import { aimLight } from '@/lib/run-store'

/**
 * THE RUN · 4 — THE PLAN (service pages, 2026-09-17).
 *
 * THIRD CUT, the same day — THE STACK. The first was a pinned stage (a
 * horizontal rail under a week ruler, a black sweep at its end); the
 * second an in-flow vertical timeline (a rail with nodes, a sticky
 * counter, a schedule of bars, packets crossing the cards). The user on
 * the second: "I don't like it… let's do something different, only card
 * related. Find cool card designs on the reference libraries and create
 * something scroll driven, maybe stack… there are too many things
 * happening, let's make it a bit quieter." So: CARDS, and nothing else
 * that moves. No counter, no chart, no rail, no ticks, no packets.
 *
 * THE REFERENCES (read as film, none installed): 21st.dev "Stacking
 * Cards" and "Cards Stack" (each card sticks, the next slides over it,
 * the covered ones scale back) and Skiper 16 (the same, with depth). The
 * hub's own sticky STAIR of 09-13 is parked, so the device is free.
 *
 * THE PICTURE (run.css `.rp`). On the light, two columns. Left, a quiet
 * head that sticks beside the cards (CSS sticky): the heading and one
 * true line — how many steps, about how many weeks. Right, THE STACK:
 * one large paper card a step — its number, its name, its duration, and
 * under a hairline the exchange in two columns: "You give", "You get".
 *
 * THE MOVE. Every card sticks at the same line (CSS — equal tops and
 * equal heights, so the stack lets go as ONE at the section's end, never
 * closing up strip by strip). As the next card comes up over it, a
 * covered card STEPS BACK: it lifts one strip, sets back a little and
 * sinks a shade into the paper — so the strip that stays in view is its
 * number, name and duration, and the stack becomes its own index. That
 * is the driver's whole job: each card's DEPTH (how far the cards after
 * it have covered it, 0…n), eased, written as one transform and one
 * custom property.
 *
 * THE DRIVER. gsap.ticker + one rect per frame; the cards' flow places
 * are arithmetic (equal heights, equal gaps — a sticky card's own offset
 * lies once it is stuck). Hidden states: none — the base IS the section,
 * the cards sticking as a plain stair by CSS alone; the driver only adds
 * the stepping back (`.is-live` swaps the stair for equal tops). Reduced
 * motion and phones: the cards in flow, no sticking. Every word is
 * server-rendered.
 */

export type RunStep = { title: string; give: string; get: string; time: string; weeks: number }

/** the strip a covered card keeps in view, in rem (run.css --rp-strip) */
const STRIP = 3.8
/** how far a covered card sets back, and how far it sinks, per depth */
const BACK = 0.035
const SINK = 0.3
/** the glide's time constant, in seconds */
const GLIDE = 0.14

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const ease = (v: number) => v * v * (3 - 2 * v)

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1))

export default function RunPlan({ steps }: { steps: readonly RunStep[] }) {
  const ref = useRef<HTMLElement | null>(null)
  const total = steps.reduce((s, x) => s + x.weeks, 0)
  const open = steps.some((s) => /ongoing/i.test(s.time))

  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(max-width: 57.5rem)').matches) return
    const list = root.querySelector<HTMLElement>('.rp-list')!
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.rp-card'))
    const n = cards.length
    root.classList.add('is-live')

    /* the list in the section; a card's height and its pitch in the flow;
       the line the cards stick at — all offsets and arithmetic */
    let listTop = 0
    let h = 1
    let pitch = 1
    let stick = 0
    let unit = 16
    const measure = () => {
      unit = 16 * rem()
      let y = 0
      let el: HTMLElement | null = list
      while (el && el !== root) {
        y += el.offsetTop
        el = el.offsetParent as HTMLElement | null
      }
      listTop = y
      h = cards[0].offsetHeight || 1
      const cs = getComputedStyle(cards[0])
      pitch = h + (parseFloat(cs.marginBottom) || 0)
      stick = parseFloat(cs.top) || 0
      depth.fill(-1)
    }
    const depth = cards.map(() => -1)
    const shown = cards.map(() => 0)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(root)

    const tick = (_t?: number, deltaTime?: number) => {
      const r = root.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < -vh * 0.3 || r.top > vh * 1.3) return
      const k = 1 - Math.exp(-((deltaTime ?? 16.7) / 1000) / GLIDE)
      /* how far each card has come up over the stack: 0 as its top meets
         the stuck card's foot, 1 as it reaches the line itself */
      const cover = cards.map((_, j) => ease(clamp01((stick + h - (r.top + listTop + j * pitch)) / h)))
      cards.forEach((c, i) => {
        let want = 0
        for (let j = i + 1; j < n; j++) want += cover[j]
        const d = depth[i] < 0 || Math.abs(want - shown[i]) < 0.0006 ? want : shown[i] + (want - shown[i]) * k
        if (Math.abs(d - depth[i]) < 0.0004) return
        depth[i] = shown[i] = d
        c.style.transform = d <= 0.0005 ? '' : `translate3d(0, ${(-d * STRIP * unit).toFixed(1)}px, 0) scale(${(1 - d * BACK).toFixed(4)})`
        c.style.setProperty('--sink', Math.min(0.62, d * SINK).toFixed(3))
      })
      if (r.top < vh * 0.5 && r.bottom > vh * 0.5) aimLight(0.66, 0.42)
    }
    tick()
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      ro.disconnect()
      root.classList.remove('is-live')
      cards.forEach((c) => {
        c.style.transform = ''
        c.style.removeProperty('--sink')
      })
    }
  }, [steps])

  return (
    <section ref={ref} id="plan" className="rp" aria-labelledby="rp-h" style={{ '--rp-n': steps.length } as React.CSSProperties}>
      {/* the head: it sticks beside the stack (CSS) */}
      <div className="rp-side">
        <h2 id="rp-h" className="rp-h">How it goes</h2>
        <p className="rp-lead">
          {steps.length} steps, about {fmt(total)}
          {open ? '+' : ''} weeks.
        </p>
      </div>

      {/* THE STACK */}
      <ol className="rp-list">
        {steps.map((s, i) => (
          <li key={s.title} className="rp-card" style={{ '--i': i } as React.CSSProperties}>
            <div className="rp-card-top">
              <span className="rp-no" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="rp-name">{s.title}</h3>
              <span className="rp-time">{s.time}</span>
            </div>
            <div className="rp-xs">
              <div className="rp-x">
                <span className="rp-x-k">You give</span>
                <p>{s.give}</p>
              </div>
              <div className="rp-x">
                <span className="rp-x-k">You get</span>
                <p>{s.get}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
