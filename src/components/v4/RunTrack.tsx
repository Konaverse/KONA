'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion-v4'

/**
 * THE RUN · 4 — HOW IT GOES: THE TRACK (service pages, 2026-09-30;
 * replaces THE STACK, RunPlan.tsx, which is parked unimported with its
 * `.rp-*` rules).
 *
 * THE BRIEF: the user's screen recording of a "what to expect" section —
 * a pinned dark stage; the items' titles run up a vertical track on the
 * right, the one on the line lit, its text beside it, the ones above and
 * below fading; at the left a circle holding the current item's mark,
 * ringed by a dotted arc that fills; a small counter; a tiny label at
 * the far left; the heading scrolls away above the first item.
 *
 * THE PICTURE (run.css `.rq`). The void, inset as a card. Left, the
 * label; THE DIAL — the step's number in the circle (it rolls to the
 * next one), the dotted ring filling with the whole run (the n/N ring and
 * the rows' number eyebrows were cut, 2026-09-30). Right, THE TRACK: the h2 and the lead, then one row a step —
 * its name in caps, and beside it (lit on the line only) its duration
 * and the exchange: what you give, what you get.
 *
 * THE DRIVER. The section is a runway, its stage sticky (CSS). One rect
 * a frame gives the run's progress; eased (the glide), it is written as
 * ONE transform on the track, one custom property a row (its distance
 * from the line — CSS turns it into light), the ring's offset, and the
 * dial's number when the nearest row changes. Hidden states live under
 * `.is-live`, which only this driver sets: no JS, reduced motion and
 * phones read the plain list, every word in the HTML.
 */

export type RunStep = { title: string; give: string; get: string; time: string; weeks: number }

/** the run's share of the runway that the steps take (the rest is the
 *  arrival and the hold at the end) */
const RUN_FROM = 0.08
const RUN_TO = 0.9
/** the glide's time constant, in seconds */
const GLIDE = 0.14

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1).replace(/\.0$/, ''))

export default function RunTrack({ steps }: { steps: readonly RunStep[] }) {
  const ref = useRef<HTMLElement | null>(null)
  const n = steps.length
  const total = steps.reduce((a, s) => a + s.weeks, 0)
  const open = steps.some((s) => /ongoing/i.test(s.time))

  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(max-width: 57.5rem)').matches) return
    const track = root.querySelector<HTMLElement>('.rq-track')!
    const rows = Array.from(root.querySelectorAll<HTMLElement>('.rq-row'))
    const dial = root.querySelector<HTMLElement>('.rq-dial')!
    const num = root.querySelector<HTMLElement>('.rq-num')!

    root.classList.add('is-live')

    /* the row pitch and the first row's offset in the track — measured */
    let pitch = 1
    let first = 0
    let line = 0
    const measure = () => {
      pitch = rows.length > 1 ? rows[1].offsetTop - rows[0].offsetTop : rows[0].offsetHeight
      first = rows[0].offsetTop + rows[0].offsetHeight / 2
      line = track.parentElement!.clientHeight / 2
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(root)

    let p = -1
    let shown = -1
    let lastY = Infinity
    const tick = (_t?: number, deltaTime?: number) => {
      const r = root.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < -vh * 0.2 || r.top > vh * 1.2) return
      const run = clamp01((-r.top / Math.max(1, r.height - vh) - RUN_FROM) / (RUN_TO - RUN_FROM))
      const want = run * (n - 1)
      const f = 1 - Math.exp(-((deltaTime ?? 16.7) / 1000) / GLIDE)
      p = p < 0 || Math.abs(want - p) < 0.0005 ? want : p + (want - p) * f

      const y = line - first - p * pitch
      if (Math.abs(y - lastY) > 0.05) {
        lastY = y
        track.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`
        rows.forEach((row, i) => row.style.setProperty('--d', (i - p).toFixed(3)))
        dial.style.setProperty('--rq-p', (p / Math.max(1, n - 1)).toFixed(4))
      }
      const near = Math.round(p)
      if (near !== shown) {
        const up = near > shown
        shown = near
        num.textContent = String(near + 1).padStart(2, '0')
        num.classList.remove('is-up', 'is-down')
        void num.offsetWidth
        num.classList.add(up ? 'is-up' : 'is-down')
        rows.forEach((row, i) => row.classList.toggle('is-on', i === near))
      }
    }
    tick()
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      ro.disconnect()
      root.classList.remove('is-live')
      track.style.transform = ''
      rows.forEach((row) => {
        row.style.removeProperty('--d')
        row.classList.remove('is-on')
      })
      dial.style.removeProperty('--rq-p')
      num.textContent = '01'
      num.classList.remove('is-up', 'is-down')
    }
  }, [n])

  return (
    <section
      ref={ref}
      id="plan"
      className="rq k-dark"
      data-dark="1"
      aria-labelledby="rq-h"
      style={{ '--rq-n': n } as React.CSSProperties}
    >
      {/* the page's hover dots, light on the void (RunGround places it) */}
      <span className="ro-dots rq-dots" aria-hidden="true" />
      <div className="rq-stage">
        <p className="rq-label" aria-hidden="true">
          The process
        </p>

        {/* THE DIAL: decoration — the numbers are in the rows */}
        <div className="rq-dial" aria-hidden="true">
          <svg className="rq-ring" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" pathLength="1" />
          </svg>
          <svg className="rq-ring is-lit" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" pathLength="1" />
          </svg>
          <span className="rq-num-win">
            <span className="rq-num">01</span>
          </span>
        </div>

        <div className="rq-view">
          <div className="rq-track">
            <div className="rq-head">
              <h2 id="rq-h" className="rq-h">How it goes</h2>
              <p className="rq-lead">
                {n} steps, about {fmt(total)}
                {open ? '+' : ''} weeks.
              </p>
            </div>
            <ol className="rq-list">
              {steps.map((s, i) => (
                <li key={s.title} className={`rq-row${i === 0 ? ' is-on' : ''}`}>
                  <h3 className="rq-name">
                    {s.title}
                  </h3>
                  <div className="rq-body">
                    <span className="rq-time">{s.time}</span>
                    <p>
                      <span className="rq-k">You give</span> {s.give}
                    </p>
                    <p>
                      <span className="rq-k">You get</span> {s.get}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
