'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion-v4'

/**
 * HOW IT WENT — THE CANVAS (2026-10-01, backlog 7c; the owner: "more
 * attractive and AGENTIC… no numbering except years, no eyebrows, no
 * hairlines"; THE THREAD of 09-17 — the drawn route with the pictures
 * entering beside it — is retired). Chosen from three directions after
 * a survey of Skiper / Watermelon / 21st.dev (read as film, nothing
 * installed): Aceternity's sticky-scroll-reveal for the split, the
 * agent-UI grammar (reasoning line, tool step, done) for the window's
 * status pill.
 *
 * THE PICTURE (about.css). Paper, the title at the gutter, then a split:
 * on the left the four years in plain flow, a viewport apart — a huge
 * year, the label, the sentence; on the right ONE window that stays in
 * place (sticky), a design tool's canvas of faint dots. Each year's
 * plate is CARRIED IN (owner, same day: "remove the cursor and make all
 * the image transitions like the first one"): it peeks in from a bottom
 * corner — turned, small — and is brought up square to fill the window,
 * then develops from mono to colour. The corners alternate (right,
 * left, right, left) so four arrivals don't read as one. Every act
 * reads THINK (a shimmering "Thinking about 2022…"), WORK ("Placing
 * 2022"), DONE (the label, ticked) in a pill in the window's corner —
 * the agent is heard, not seen.
 *
 * THE CLOCK. Scroll, not time: each act runs while its year's block
 * crosses from START to END of the viewport, so it reads the same
 * backwards; each act's progress eases after its target (GLIDE, frame
 * rate independent), the house's butter. Later plates lie over earlier
 * ones, so a finished act is the next act's ground.
 *
 * THE DRIVER. gsap.ticker + one rect a frame (the blocks' offsets are
 * measured on resize). Written per frame: transforms and opacities, and
 * the pill's text only when its phase changes. The hidden states live
 * under `.is-live`, which only this driver sets: no JS and reduced
 * motion get the four years in flow and the window holding the last
 * plate, in colour. Every word is server-rendered; the pill is
 * decoration (aria-hidden).
 */

export type Era = {
  year: string
  label: string
  plate: string
  text: string
}

/** an act runs while its block's top travels START → END (share of the
 *  viewport's height); phones read lower, under the window */
const START = 0.55
const END = -0.2
const START_PHONE = 0.95
const END_PHONE = 0.4
/** the act's phases */
const THINK = 0.16
const WORK = 0.76
/** progress eases after its target: the time constant, in seconds */
const GLIDE = 0.22
/** the carry: where a plate starts (shares of the window, from its
 *  centre), its turn and its size; x and the turn flip on the left */
const CARRY = { x: 0.55, y: 0.62, r: 12, s: 0.55 }

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const ease = (v: number) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2)
const easeOut = (v: number) => 1 - (1 - v) * (1 - v) * (1 - v)
const pct = (v: number) => `${(v * 100).toFixed(2)}%`

export default function AboutTimeline({ eras }: { eras: readonly Era[] }) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const pill = root.querySelector<HTMLElement>('.ab-tl-pill')
    const say = root.querySelector<HTMLElement>('.ab-tl-say')
    const blocks = Array.from(root.querySelectorAll<HTMLElement>('.ab-tl-entry'))
    const plates = Array.from(root.querySelectorAll<HTMLElement>('.ab-tl-plate'))
    if (!pill || !say || blocks.length === 0 || plates.length !== blocks.length) return

    const acts = plates.map((plate, i) => ({
      plate,
      colour: plate.querySelector<HTMLElement>('.ab-tl-colour')!,
      block: blocks[i],
      /* right corner, left corner, … */
      side: i % 2 ? -1 : 1,
      top: 0,
      t: -1,
      on: false,
      past: false,
    }))

    const phone = window.matchMedia('(max-width: 57.5rem)')
    const measure = () => {
      acts.forEach((a) => {
        a.top = a.block.offsetTop
        a.t = -1
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(root)
    root.classList.add('is-live')

    let phase = ''
    const tell = (key: string, text: string, thinking: boolean) => {
      if (key === phase) return
      phase = key
      say.textContent = text
      pill.classList.toggle('is-thinking', thinking)
    }

    let first = true
    const tick = (_time?: number, deltaTime?: number) => {
      const r = root.getBoundingClientRect()
      const vh = window.innerHeight
      /* unseen, everything lands at once and the frame is skipped
         once it has */
      const seen = r.bottom > -vh * 0.25 && r.top < vh * 1.25
      const s0 = (phone.matches ? START_PHONE : START) * vh
      const s1 = (phone.matches ? END_PHONE : END) * vh
      const k = seen ? 1 - Math.exp(-((deltaTime ?? 16.7) / 1000) / GLIDE) : 1

      /* each act's progress, eased after the hand */
      let live = -1
      let moved = false
      acts.forEach((a, i) => {
        const target = clamp01((s0 - (r.top + a.top)) / (s0 - s1))
        const next = a.t < 0 || Math.abs(target - a.t) < 0.0004 ? target : a.t + (target - a.t) * k
        if (next !== a.t) moved = true
        a.t = next
        if (a.t > 0) live = i
      })
      if (!moved && !first) return
      first = false

      acts.forEach((a, i) => {
        const t = a.t
        const work = ease(clamp01((t - THINK) / (WORK - THINK)))
        const done = easeOut(clamp01((t - WORK) / (1 - WORK)))
        const p = a.plate.style

        /* the words: on once the act starts, dimmed once the next one is working */
        const on = t > 0.02
        const past = i < acts.length - 1 && acts[i + 1].t > 0.3
        if (on !== a.on) a.block.classList.toggle('is-on', (a.on = on))
        if (past !== a.past) a.block.classList.toggle('is-past', (a.past = past))

        if (t <= 0) {
          p.visibility = 'hidden'
          return
        }
        /* THE CARRY: peeks in at its corner while the agent thinks,
           brought up square as it works, develops as it is done */
        const u = 1 - work
        p.visibility = 'visible'
        p.opacity = clamp01(t / THINK).toFixed(3)
        p.transform = `translate3d(${pct(a.side * CARRY.x * u)}, ${pct(CARRY.y * u)}, 0) rotate(${(a.side * CARRY.r * u).toFixed(2)}deg) scale(${lerp(CARRY.s, 1, work).toFixed(4)})`
        a.colour.style.opacity = done.toFixed(3)
      })

      /* THE PILL: the live act's status */
      if (live < 0) {
        pill.style.opacity = '0'
        phase = ''
        return
      }
      const t = acts[live].t
      const era = eras[live]
      pill.style.opacity = '1'
      if (t < THINK) tell(`${live}t`, `Thinking about ${era.year}…`, true)
      else if (t < WORK) tell(`${live}w`, `Placing ${era.year}`, false)
      else tell(`${live}d`, `✓ ${era.label}`, false)
    }
    tick()
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      ro.disconnect()
      root.classList.remove('is-live')
      pill.style.opacity = ''
      acts.forEach((a) => {
        a.block.classList.remove('is-on', 'is-past')
        a.plate.style.cssText = ''
        a.colour.style.opacity = ''
      })
    }
  }, [eras])

  return (
    <section ref={ref} className="ab-time" aria-label="How it went">
      <h2 className="ab-tl-t">How it <em>went</em></h2>

      <div className="ab-tl-split">
        <ol className="ab-tl-list">
          {eras.map((y) => (
            <li key={y.year} className="ab-tl-entry">
              <h3 className="ab-tl-name">
                {/* the year for readers, whole; the digits for the eye */}
                <span className="ab-tl-when">
                  <span className="sr-only">{y.year}</span>
                  <span aria-hidden="true">
                    {Array.from(y.year).map((ch, j) => (
                      <span key={j} className="ab-tl-d" style={{ '--j': j } as React.CSSProperties}>
                        <span>{ch}</span>
                      </span>
                    ))}
                  </span>
                </span>
                <span className="ab-tl-label">{y.label}</span>
              </h3>
              <p className="ab-tl-text">{y.text}</p>
            </li>
          ))}
        </ol>

        {/* THE WINDOW: the agent's canvas, held in place */}
        <div className="ab-tl-side">
          <div className="ab-tl-win">
            {eras.map((y, i) => (
              <figure key={y.year} className="ab-tl-plate" style={{ '--i': i } as React.CSSProperties}>
                <img
                  className="ab-tl-img ab-tl-mono"
                  src={y.plate}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  aria-hidden="true"
                />
                <img
                  className="ab-tl-img ab-tl-colour"
                  src={y.plate}
                  alt={`${y.year}: ${y.label}`}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </figure>
            ))}

            <span className="ab-tl-pill" aria-hidden="true">
              <i className="ab-tl-dot" />
              <b>Kona</b>
              <span className="ab-tl-say" />
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
