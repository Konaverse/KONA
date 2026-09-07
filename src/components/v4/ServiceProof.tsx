'use client'

import { useEffect, useRef } from 'react'
import Button from '@/components/v4/Button'
import Reveal from '@/components/v4/Reveal'
import type { Proof } from '@/lib/service-pages'
import { gsap } from '@/lib/motion-v4'

/**
 * THE DOLLY — the service page's proof section (2026-09-08, after the
 * user rejected the first cut's single capture as generic: "the proof
 * needs a different motion and design direction, and more content …
 * like these websites that feel out of a movie").
 *
 * WHAT MAKES IT THIS SECTION'S: proof is one real site, seen properly.
 * So the section is a TRACKING SHOT through it. The schedule's paper
 * ends, the lights go down (the dark sheet rises over the finished
 * schedule the way the paper rose over the plate) and the shot opens on
 * a TITLE CARD: the project's name in display type, the credits under it
 * (who, when, what we did). Then the camera dollies right through a set
 * built IN DEPTH, the way a multiplane camera shoots — three planes, one
 * scroll, three speeds:
 *
 *   THE BACK WALL (×0.35) carries the client's brief as one sentence in
 *   very large, very faint type. It moves slowest, so it stays under the
 *   whole shot and can be read across it.
 *   THE SET (×1) is four stills of the live site, hung at different
 *   heights and sizes, each with one line under it saying what it shows.
 *   THE FOREGROUND (×1.45) carries three figures — big editorial
 *   numerals — that cross in front of the frames as the camera passes.
 *
 * The shot ends on the CLOSE: the name, the line, and the one button
 * that opens the site. A timecode in the corner runs with the scroll.
 * Then the price's paper rises over the dark, the same gesture again.
 *
 * ONE CLOCK: the sticky stage + gsap.ticker + rect math, the house pin
 * (no ScrollTrigger). Per frame five transforms and one text node are
 * written; nothing paints on a schedule. The pin is exactly the set's
 * width less the viewport (a wheel-pixel is a dolly-pixel) plus one
 * viewport for the paper to land on.
 *
 * FALLBACK IS THE LAYOUT: below 57.5rem, without JS, or under reduced
 * motion the planes are plain blocks in reading order — title, brief,
 * the four stills in a grid, the figures, the close. Every word is
 * server-rendered (SEO plan D5).
 */

/** the planes' speeds relative to the scroll */
const RATE_BACK = 0.35
const RATE_FRONT = 1.45
/** the shot's running time, for the timecode (seconds at 24fps) */
const SHOT_SECONDS = 24
/** the burial pad — one viewport for the price's paper to rise over */
const PAD_VH = 100

/* THE COMPOSITION — where the set's pieces hang, in rem (x, w) and vh
   (y), so the picture scales with the viewport like everything else.
   Four frames: wide, tall, wide, wide. The title card holds 0–96rem. */
const FRAMES = [
  { x: 88, y: 15, w: 46 },
  { x: 142, y: 22, w: 13 },
  { x: 163, y: 25, w: 40 },
  { x: 211, y: 12, w: 34 },
]
const CLOSE = { x: 262, y: 34, w: 40 }
/* the foreground figures sit in the front plane's own coordinates —
   a piece at xf is on screen while 1.45·s ∈ [xf − 96, xf] */
const FACTS = [
  { x: 131, y: 64 },
  { x: 238, y: 6 },
  { x: 305, y: 66 },
]
/** the set's width — the close card's right edge plus the page's pad */
const SET_REM = CLOSE.x + CLOSE.w + 4

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v)
const pad2 = (n: number) => String(n).padStart(2, '0')
const timecode = (p: number) => {
  const f = Math.round(p * SHOT_SECONDS * 24)
  const s = Math.floor(f / 24)
  return `00:${pad2(Math.floor(s / 60))}:${pad2(s % 60)}:${pad2(f % 24)}`
}
const host = (href: string) => href.replace(/^https?:\/\//, '').replace(/\/$/, '')

export default function ServiceProof({ proof, headingId }: { proof: Proof; headingId: string }) {
  const rootRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(min-width: 57.5rem)').matches) return

    const pin = root.querySelector<HTMLElement>('.pv-pin')
    const planes = {
      back: root.querySelector<HTMLElement>('.pv-back'),
      title: root.querySelector<HTMLElement>('.pv-title'),
      mid: root.querySelector<HTMLElement>('.pv-mid'),
      front: root.querySelector<HTMLElement>('.pv-front'),
      close: root.querySelector<HTMLElement>('.pv-close'),
    }
    const tc = root.querySelector<HTMLElement>('.pv-tc-n')
    if (!pin || !planes.back || !planes.title || !planes.mid || !planes.front || !planes.close) return

    root.classList.add('is-scrub')
    /* the lights go down over the finished schedule: this sheet rises
       over the process's burial pad, so it must start one viewport early */
    if (root.previousElementSibling?.matches('.pp.is-scrub')) root.classList.add('is-over')

    let travel = 0
    let lastVw = 0
    const measure = () => {
      const vw = window.innerWidth
      if (vw === lastVw) return
      lastVw = vw
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
      travel = Math.max(1, SET_REM * rem - vw)
      pin.style.height = `calc(${100 + PAD_VH}svh + ${travel.toFixed(0)}px)`
    }
    measure()

    let lastTc = ''
    const tick = () => {
      measure()
      const r = pin.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < -100 || r.top > vh + 100) return
      const s = clamp(-r.top, 0, travel)
      const p = s / travel

      planes.back!.style.transform = `translate3d(${(-s * RATE_BACK).toFixed(2)}px,0,0)`
      const one = `translate3d(${(-s).toFixed(2)}px,0,0)`
      planes.title!.style.transform = one
      planes.mid!.style.transform = one
      planes.close!.style.transform = one
      planes.front!.style.transform = `translate3d(${(-s * RATE_FRONT).toFixed(2)}px,0,0)`

      if (tc) {
        const t = timecode(p)
        if (t !== lastTc) {
          tc.textContent = t
          lastTc = t
        }
      }
    }
    tick()
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      root.classList.remove('is-scrub', 'is-over')
      pin.style.height = ''
      Object.values(planes).forEach((el) => el && (el.style.transform = ''))
      if (tc) tc.textContent = '00:00:00:00'
    }
  }, [])

  return (
    <section ref={rootRef} className="pv k-dark" aria-labelledby={headingId}>
      <div className="pv-pin">
        <div className="pv-stage">
          {/* THE TITLE CARD — the shot opens on the name and the credits */}
          <div className="pv-title">
            <div className="pv-head">
              <h2 id={headingId} className="pv-h">
                Proof
              </h2>
              <p className="pv-lede">One project, at length, is worth more than twelve as thumbnails.</p>
            </div>
            <div className="pv-card">
              <Reveal masked as="h3" className="pv-name">
                {proof.name}
              </Reveal>
              <Reveal as="div" className="pv-credits-w" index={1}>
                <dl className="pv-credits">
                  <div>
                    <dt>Client</dt>
                    <dd>{proof.client}</dd>
                  </div>
                  <div>
                    <dt>Year</dt>
                    <dd>{proof.year}</dd>
                  </div>
                  <div>
                    <dt>Scope</dt>
                    <dd>{proof.scope}</dd>
                  </div>
                </dl>
              </Reveal>
            </div>
          </div>

          {/* THE BACK WALL — the brief, read slowly across the whole shot */}
          <div className="pv-back">
            <p className="pv-brief">{proof.brief}</p>
          </div>

          {/* THE SET — four stills of the live site */}
          <ul className="pv-mid">
            {proof.frames.map((f, i) => {
              const c = FRAMES[i] ?? FRAMES[FRAMES.length - 1]
              return (
                <li
                  key={f.image}
                  className={`pv-frame pv-frame-${f.kind}`}
                  style={{ '--fx': `${c.x}rem`, '--fy': `${c.y}vh`, '--fw': `${c.w}rem` } as React.CSSProperties}
                >
                  <figure>
                    <a
                      className="pv-media"
                      href={proof.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${proof.name} — open the site`}
                      tabIndex={-1}
                    >
                      <img src={f.image} alt={f.alt} loading="lazy" decoding="async" draggable={false} />
                    </a>
                    <figcaption>{f.caption}</figcaption>
                  </figure>
                </li>
              )
            })}
          </ul>

          {/* THE FOREGROUND — three figures crossing in front of the set */}
          <ul className="pv-front">
            {proof.facts.map((f, i) => {
              const c = FACTS[i]
              return (
                <li
                  key={f.unit}
                  className="pv-fact"
                  style={{ '--fx': `${c.x}rem`, '--fy': `${c.y}vh` } as React.CSSProperties}
                >
                  <strong className="pv-fact-n">{f.value}</strong>
                  <span className="pv-fact-u">{f.unit}</span>
                </li>
              )
            })}
          </ul>

          {/* THE CLOSE — the shot ends on the door to the site */}
          <div
            className="pv-close"
            style={{ '--fx': `${CLOSE.x}rem`, '--fy': `${CLOSE.y}vh`, '--fw': `${CLOSE.w}rem` } as React.CSSProperties}
          >
            <div className="pv-close-in">
              <p className="pv-close-name">{proof.name}</p>
              <p className="pv-close-line">{proof.line}</p>
              <div className="pv-close-act">
                <Button href={proof.href} external hoverLabel="Opens in a new tab">
                  See it live
                </Button>
                <span className="pv-close-host">{host(proof.href)}</span>
              </div>
            </div>
          </div>

          {/* THE TIMECODE — runs with the scroll; decoration */}
          <div className="pv-tc" aria-hidden="true">
            <span className="pv-tc-l">TC</span>
            <span className="pv-tc-n">00:00:00:00</span>
          </div>
        </div>
      </div>
    </section>
  )
}
