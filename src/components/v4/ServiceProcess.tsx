'use client'

import { useEffect, useRef } from 'react'
import RailNumeral from '@/components/v4/RailNumeral'
import type { ProcessStep } from '@/lib/service-pages'
import { gsap } from '@/lib/motion-v4'

/**
 * THE SCHEDULE — the service page's process section (2026-09-08, after
 * the user rejected the first cut's numbered rows: "too generic … each
 * section needs to have a personality … scroll driven, pinned is fine, I
 * just want the client to see everything").
 *
 * WHAT MAKES IT THIS PAGE'S, not any page's: the one fact a process has
 * that a feature list does not is TIME. So the spine is a week ruler
 * across the foot of a pinned stage, every step drawn as its own span on
 * it, and the scroll is a PLAYHEAD walking the ruler. The whole schedule
 * is on screen the entire time — that is the "see everything" — and the
 * playhead says where in it you are.
 *
 * THREE MOVERS, ONE CLOCK (x = progress × steps, the house pin: sticky
 * stage + gsap.ticker + rect math, no ScrollTrigger):
 *
 *   THE RULER runs continuously — the playhead's position is TIME, so it
 *   never dwells: within step k it crosses that step's span. The passed
 *   spans fill to ink, the live span carries the head, the future ones
 *   wait as hairlines. Step names sit on their spans.
 *
 *   THE NUMERAL is an ODOMETER (user, 2026-09-08: "the 0 will stay stuck
 *   there, only the 1,2,3,4 will roll"): the zero is one fixed
 *   RailNumeral, the units digit a masked column of single digits that
 *   STRIDES at each boundary through the same 2×FADE window Process.tsx
 *   uses. The comet laps the zero every step and the live digit with it.
 *
 *   THE CARDS flow through a focus slot with DEPTH. Every card's state is
 *   a function of dist = flow − k, where flow counts crossed boundaries
 *   fractionally through a WIDER window (CARD_FADE) than the numeral's,
 *   so the cards travel for most of each step and rest at the centre:
 *   y = −sign·PITCH·|dist|^0.72 (perspective spacing), scale falls off
 *   with |dist|, and each card drifts sideways by its own rate. A card
 *   ARRIVES FROM BEHIND THE RULER (the ruler carries paper and sits over
 *   the cards, so the next one surfaces out of the schedule) and LEAVES
 *   THROUGH THE TOP OF THE VIEWPORT (user, 2026-09-08 — the first cut's
 *   fading band at both edges was rejected). Each card is a CALENDAR
 *   LEAF: a dark plate tab carrying the step's duration big, a paper body
 *   with the title and the give/get pair — the schedule's own unit.
 *
 * FALLBACK IS THE LAYOUT: below 57.5rem, without JS, or under reduced
 * motion the stage is not sticky, the cards stack in flow with their own
 * DOM numerals, the ruler shows the finished schedule. Every word is
 * server-rendered (SEO plan D5). Only transforms, opacity and dash
 * offsets are written per frame — all of it a response to scroll, nothing
 * paints on a schedule.
 */

/** scroll length of one step, in viewport heights */
const STEP_VH = 80
/** the numeral's stride window, each side of a boundary (Process.tsx) */
const FADE = 0.13
/** the cards' travel window, each side of a boundary — wider: they move
 *  for most of a step and rest briefly in the slot */
const CARD_FADE = 0.34
/** a card's travel per unit of depth, in viewport heights */
const PITCH_VH = 58
/** sideways drift per unit of depth, in viewport widths — the parallax */
const DRIFT_VW = 2.2

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const smooth = (v: number) => {
  const t = clamp01(v)
  return t * t * (3 - 2 * t)
}

/** the cumulative week spans: [start, end] per step, and the total */
function spans(steps: ProcessStep[]) {
  let at = 0
  const out = steps.map((s) => {
    const a = at
    at += s.weeks
    return [a, at] as [number, number]
  })
  return { out, total: at }
}

/** "2 weeks" → { n: "2", u: "weeks" }; "1–2 weeks" → { "1–2", "weeks" };
 *  "Ongoing" → { "", "Ongoing" } — the tab sets the number big */
const splitTime = (t: string) => {
  const m = t.match(/^([\d.–-]+)\s*(.*)$/)
  return m ? { n: m[1], u: m[2] } : { n: '', u: t }
}

const fmtWeeks = (w: number) => {
  const r = Math.round(w * 2) / 2
  return Number.isInteger(r) ? String(r) : r.toFixed(1)
}

export default function ServiceProcess({
  steps,
  headingId,
}: {
  steps: ProcessStep[]
  headingId: string
}) {
  const rootRef = useRef<HTMLElement | null>(null)
  const { out: SPANS, total } = spans(steps)
  const N = steps.length
  const weeks = Math.ceil(total)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(min-width: 57.5rem)').matches) return

    const pin = root.querySelector<HTMLElement>('.pp-pin')
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.pp-card'))
    const rail = Array.from(root.querySelectorAll<HTMLElement>('.pp-ri'))
    const zero = root.querySelector<HTMLElement>('.pp-zero')
    const stack = root.querySelector<HTMLElement>('.pp-stack')
    const fill = root.querySelector<HTMLElement>('.pp-fill')
    const head = root.querySelector<HTMLElement>('.pp-head')
    const segs = Array.from(root.querySelectorAll<HTMLElement>('.pp-seg'))
    if (!pin || cards.length < 2 || !stack || !fill || !head) return

    root.classList.add('is-scrub')
    pin.style.height = `${N * STEP_VH + 100}svh`

    /* the comet: dash geometry once, from each contour's measured length */
    const comets = rail.map((ri) => Array.from(ri.querySelectorAll<SVGPathElement>('.pr-c')))
    const zeroComet = zero ? Array.from(zero.querySelectorAll<SVGPathElement>('.pr-c')) : []
    ;[...comets.flat(), ...zeroComet].forEach((c) => {
      const L = c.getTotalLength()
      const f = Number(c.dataset.len) / 100
      c.dataset.total = String(L)
      c.style.strokeDasharray = `${(f * L).toFixed(1)} ${((1 - f) * L).toFixed(1)}`
    })

    const spanOf = (i: number) => SPANS[i]
    let lastLive = -1

    const tick = () => {
      const r = pin.getBoundingClientRect()
      const vh = window.innerHeight
      const vw = window.innerWidth
      if (r.bottom < -100 || r.top > vh + 100) return
      const p = clamp01(-r.top / Math.max(r.height - vh, 1))
      const x = p * N

      /* THE RULER — time, continuous */
      const live = Math.min(N - 1, Math.floor(x))
      const frac = x - live
      const [a, b] = spanOf(live)
      const at = (a + (b - a) * frac) / total
      fill.style.transform = `scaleX(${at.toFixed(4)})`
      head.style.transform = `translateX(${(at * 100).toFixed(3)}cqw)`

      /* THE NUMERAL — strides at the boundary */
      if (live !== lastLive) {
        rail.forEach((el, i) => el.classList.toggle('is-on', i === live))
        segs.forEach((el, i) => {
          el.classList.toggle('is-live', i === live)
          el.classList.toggle('is-past', i < live)
        })
        cards.forEach((el, i) => el.classList.toggle('is-live', i === live))
        lastLive = live
      }
      let slid = 0
      for (let k = 0; k < N - 1; k++) slid += smooth((x - (k + 1 - FADE)) / (2 * FADE))
      stack.style.transform = `translateY(calc(${(-slid).toFixed(4)} * (var(--pp-slot) + var(--pp-gap))))`

      const headAt = frac * 100
      const lap = (c: SVGPathElement) => {
        const L = Number(c.dataset.total)
        const len = Number(c.dataset.len)
        c.style.strokeDashoffset = (((len - headAt) / 100) * L).toFixed(1)
      }
      comets[live]?.forEach(lap)
      zeroComet.forEach(lap)

      /* THE CARDS — the column flows through the slot with depth */
      let flow = 0
      for (let k = 0; k < N - 1; k++) flow += smooth((x - (k + 1 - CARD_FADE)) / (2 * CARD_FADE))
      /* the first card arrives with the pin, the last leaves with it */
      for (let i = 0; i < N; i++) {
        const dist = flow - i // <0 waiting below · 0 in the slot · >0 passed above
        const ad = Math.abs(dist)
        const sign = dist < 0 ? -1 : 1
        const y = -sign * Math.pow(ad, 0.72) * PITCH_VH * (vh / 100)
        const cx = (i % 2 ? 1 : -1) * dist * DRIFT_VW * (vw / 100)
        const s = Math.max(0.7, 1 - 0.08 * ad)
        /* no fade on arrival (the ruler hides the waiting card), a mild
           one on the way out — it leaves through the viewport's edge */
        const o = dist > 0 ? Math.max(0.55, 1 - 0.3 * ad) : 1
        const el = cards[i]
        el.style.setProperty('--cy', `${y.toFixed(2)}px`)
        el.style.setProperty('--cx', `${cx.toFixed(2)}px`)
        el.style.setProperty('--cs', s.toFixed(4))
        el.style.setProperty('--co', o.toFixed(3))
        el.style.zIndex = String(20 - Math.round(ad * 4))
      }
    }
    tick()
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      root.classList.remove('is-scrub')
      pin.style.height = ''
      stack.style.transform = ''
      fill.style.transform = ''
      head.style.transform = ''
      rail.forEach((el) => el.classList.remove('is-on'))
      segs.forEach((el) => el.classList.remove('is-live', 'is-past'))
      ;[...comets.flat(), ...zeroComet].forEach((c) => (c.style.strokeDashoffset = ''))
      cards.forEach((el) => {
        el.classList.remove('is-live')
        el.style.cssText = ''
      })
    }
  }, [N, SPANS, total])

  return (
    <section ref={rootRef} className="pp" aria-labelledby={headingId}>
      <div className="pp-pin">
        <div className="pp-stage">
          <header className="pp-top">
            <h2 id={headingId} className="pp-title">
              How it goes
            </h2>
            <p className="pp-lede">
              {N} steps, about {fmtWeeks(total)} weeks. What you give, what you get, how long each takes.
            </p>
          </header>

          {/* THE NUMERAL — the homepage rail. Decoration: the cards carry
              the numbers as text. The gradient is defined once here. */}
          <div className="pp-rail" aria-hidden="true">
            <svg className="pr-defs" aria-hidden="true" focusable="false">
              <defs>
                <linearGradient id="pr-fade" gradientUnits="userSpaceOnUse" x1="0" y1="480" x2="0" y2="2080">
                  <stop offset="0.04" stopColor="currentColor" stopOpacity="1" />
                  <stop offset="0.82" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            {/* the fixed zero, then the rolling units column */}
            <span className="pr-ri pp-zero is-on">
              <RailNumeral no="0" />
            </span>
            <div className="pp-roll">
              <div className="pp-stack">
                {steps.map((s, i) => (
                  <span className="pr-ri pp-ri" key={s.title}>
                    <RailNumeral no={String(i + 1)} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* THE CARDS */}
          <ol className="pp-cards">
            {steps.map((s, i) => (
              <li className="pp-card" key={s.title}>
                {/* the tab: the duration, big, on a dark plate */}
                <div className="pp-tab">
                  <img src={`/home/inline-${(i % 3) + 1}.webp`} alt="" aria-hidden="true" draggable={false} />
                  <span className="pp-tab-n">{splitTime(s.time).n}</span>
                  <span className="pp-tab-u">{splitTime(s.time).u}</span>
                </div>
                <div className="pp-leaf">
                  <span className="pp-leaf-i">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="pp-card-t">{s.title}</h3>
                  <dl className="pp-card-meta">
                    <div>
                      <dt>You give</dt>
                      <dd>{s.give}</dd>
                    </div>
                    <div>
                      <dt>You get</dt>
                      <dd>{s.get}</dd>
                    </div>
                  </dl>
                </div>
              </li>
            ))}
          </ol>

          {/* THE RULER — weeks across the foot; the steps as spans on it */}
          <div className="pp-ruler" aria-hidden="true">
            <div className="pp-names">
              {steps.map((s, i) => (
                <span
                  key={s.title}
                  className="pp-seg"
                  style={{ left: `${(SPANS[i][0] / total) * 100}%`, width: `${(s.weeks / total) * 100}%` }}
                >
                  <i className="pp-seg-bar" />
                  <span className="pp-seg-name">{s.title}</span>
                </span>
              ))}
            </div>
            <div className="pp-line">
              <i className="pp-fill" />
              <i className="pp-head" />
            </div>
            <div className="pp-ticks">
              {Array.from({ length: weeks + 1 }, (_, w) => (
                <span key={w} className="pp-tick" style={{ left: `${(w / total) * 100}%` }}>
                  {w === 0 ? 'Start' : w === weeks && total < weeks ? '' : `Week ${w}`}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
