'use client'

import { useEffect, useRef } from 'react'
import ArrowLink from '@/components/v4/ArrowLink'
import Reveal from '@/components/v4/Reveal'
import { gsap } from '@/lib/motion-v4'

/**
 * SECTION 7 — HOW WE WORK. Second design (user-directed 2026-08-24:
 * "pinned, agentic and premium, big letters or numbers with a fade out
 * gradient"); the thread-and-nodes design it replaces is in git.
 *
 * THE ARRIVAL IS ONE MORE PAGE-TURN. This section rises over §5's LAST
 * project sheet as an untilted opaque light sheet carrying the page-turn's
 * own seam shadow — same 140px, same 0.13 black — while the buried sheet
 * drifts up at 0.45× underneath (`buried` on <ProjectSheets>). It is the
 * §4-over-§3 burial pair again, but because what it buries is the page-turn
 * itself, it reads as the turn after the work: the process chapter turns in
 * over the projects. The pair: `buried` sets §5's tail viewport and the
 * drift; `is-over` here sets the −100svh overlap. Set together, or neither.
 * The "All projects" link rides the TOP of this sheet, so the work
 * chapter's exit is the first thing the turn reveals — DOM-wise it now
 * lives here, but it is §5's hub link (choreography: four links out).
 *
 * THE PIN. Six steps, one pinned viewport, scroll owns the playhead
 * (gsap.ticker + rect math — the house pattern, no scroll listeners, no
 * ScrollTrigger). Each step is a full stacked panel: a giant numeral at
 * ~34vh in the fade-out gradient (ink dissolving to nothing — the one
 * gradient-text on the page, user-directed), name, two lines of body, and
 * the deliverables under a hairline that DRAWS as the step arrives. Panels
 * crossfade with a short drift; the numeral moves at 0.4× the copy's
 * drift, which is what makes the swap read as depth rather than a slide.
 * Everything is a RESPONSE to scroll — nothing paints on a schedule (§4's
 * rule) — and everything written per-frame is transform/opacity.
 *
 * THE HOVER is the house reading-focus move, scoped to the deliverables:
 * hovering one brings it to full ink and recedes its siblings. These rows
 * navigate nowhere, so nothing may read as a link — contrast alone.
 *
 * FALLBACKS. The scrub is gated on 57.5rem + motion allowed, same as §4's
 * paper entrance. Below the gate, no-JS, and reduced motion all get the
 * server-rendered form: the six panels stacked in flow, numerals smaller,
 * everything readable. SEO: every name, body and deliverable is real DOM
 * text. Copy is PLACEHOLDER — the user writes the real lines (6.6).
 */

type Step = { no: string; name: string; body: string; gets: string[] }

const STEPS: Step[] = [
  {
    no: '01',
    name: 'Understand',
    body: 'Every project starts with your business, not a moodboard: what the site has to do, who it has to convince, and what winning looks like.',
    gets: ['A written brief', 'Goals we can measure'],
  },
  {
    no: '02',
    name: 'Scope',
    body: 'The brief becomes a concrete plan: pages, features, content, timeline. The price becomes a number, not a conversation.',
    gets: ['A sitemap', 'A fixed quote and timeline'],
  },
  {
    no: '03',
    name: 'References',
    body: 'We collect references together and agree the direction before anything is drawn. Taste gets settled early, on purpose.',
    gets: ['A reference board', 'An agreed direction'],
  },
  {
    no: '04',
    name: 'System',
    body: 'Type, colour, space and motion designed as one system, so every screen that follows already has its rules.',
    gets: ['A design system', 'Rules every page inherits'],
  },
  {
    no: '05',
    name: 'Homepage',
    body: 'The homepage is designed first to set the tone for everything else, and revised with you until it is right.',
    gets: ['The homepage, in full', 'Revisions until it lands'],
  },
  {
    no: '06',
    name: 'Launch',
    body: 'Engineered server-first and measured before it ships: real HTML, real speed, redirects mapped, analytics wired.',
    gets: ['The site, live', 'A measured report'],
  },
]

/** Scroll length of one step, in viewport-heights. */
const STEP_VH = 70
/** Fraction of a step's segment spent crossfading at each end. */
const FADE = 0.13
/** The crossfade drift, px. The numeral moves at NUM_DRIFT of this. */
const DRIFT = 40
const NUM_DRIFT = 0.4

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
/* the hand supplies the pacing through Lenis; this only rounds the ends
   of each fade window so a panel never pops */
const smooth = (v: number) => {
  const t = clamp01(v)
  return t * t * (3 - 2 * t)
}

export default function Process() {
  const rootRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    /* the burial — paired with `buried` on <ProjectSheets> in page.tsx.
       Armed whenever §5's scrub is (reduced motion is the only gate there). */
    root.classList.add('is-over')

    const steps = root.querySelector<HTMLElement>('.pr-steps')
    const view = root.querySelector<HTMLElement>('.pr-view')
    const panels = Array.from(root.querySelectorAll<HTMLElement>('.pr-panel'))
    if (!steps || !view || panels.length < 2) return

    /* same gate as §4's paper entrance: the pin is a desktop composition */
    if (!window.matchMedia('(min-width: 57.5rem)').matches) {
      return () => root.classList.remove('is-over')
    }

    const N = panels.length
    steps.classList.add('is-scrub')
    steps.style.height = `${N * STEP_VH + 100}svh`

    const nums = panels.map((p) => p.querySelector<HTMLElement>('.pr-num'))
    const copies = panels.map((p) => p.querySelector<HTMLElement>('.pr-copy'))
    const rules = panels.map((p) => p.querySelector<HTMLElement>('.pr-rule'))
    const gets = panels.map((p) => Array.from(p.querySelectorAll<HTMLElement>('.pr-get')))

    let lastLive = -1

    const tick = () => {
      const r = steps.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < -100 || r.top > vh + 100) return
      const p = clamp01(-r.top / Math.max(r.height - vh, 1))
      const x = p * N

      for (let i = 0; i < N; i++) {
        const t = x - i // <0 waiting · 0..1 its segment · >1 buried
        /* the first panel is already on screen when the pin starts and the
           last holds to the end — neither fades at its outer edge */
        const inO = i === 0 ? 1 : smooth(t / FADE)
        const outO = i === N - 1 ? 1 : 1 - smooth((t - (1 - FADE)) / FADE)
        const o = Math.min(inO, outO)
        const el = panels[i]
        if (o <= 0) {
          if (el.style.visibility !== 'hidden') {
            el.style.visibility = 'hidden'
            el.style.opacity = '0'
          }
          continue
        }
        el.style.visibility = ''
        el.style.opacity = o.toFixed(3)
        /* incoming rises, outgoing keeps rising — one direction of travel,
           so the swap reads as the next step pushing up through */
        const y = (1 - inO) * DRIFT - (1 - outO) * DRIFT
        const copy = copies[i]
        const num = nums[i]
        if (copy) copy.style.transform = `translateY(${y.toFixed(2)}px)`
        if (num) num.style.transform = `translateY(${(y * NUM_DRIFT).toFixed(2)}px)`

        /* inner choreography, off the step's own clock: the hairline draws,
           then the deliverables resolve under it, staggered */
        const rule = rules[i]
        if (rule) rule.style.transform = `scaleX(${smooth((t - 0.04) / 0.22).toFixed(3)})`
        gets[i].forEach((g, j) => {
          const gg = smooth((t - 0.1 - j * 0.07) / 0.2)
          g.style.opacity = (0.3 + 0.7 * gg).toFixed(3)
          g.style.transform = `translateY(${((1 - gg) * 14).toFixed(2)}px)`
        })
      }

      /* only the live panel takes the pointer, so the hover move can never
         land on an invisible stack above it */
      const live = Math.min(N - 1, Math.floor(x))
      if (live !== lastLive) {
        panels.forEach((el, i) => el.classList.toggle('is-live', i === live))
        lastLive = live
      }
    }
    tick()
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      root.classList.remove('is-over')
      steps.classList.remove('is-scrub')
      steps.style.height = ''
      panels.forEach((el) => {
        el.style.opacity = ''
        el.style.visibility = ''
        el.classList.remove('is-live')
      })
      ;[...nums, ...copies, ...rules, ...gets.flat()].forEach((el) => {
        if (el) {
          el.style.transform = ''
          el.style.opacity = ''
        }
      })
    }
  }, [])

  return (
    <section ref={rootRef} className="pr" aria-label="How we work">
      {/* §5's hub link, riding the top of the rising sheet — the work
          chapter's exit is the first thing the turn reveals */}
      <div className="pr-workline k-page">
        <ArrowLink href="/work">All projects</ArrowLink>
      </div>

      <header className="pr-head k-page">
        <Reveal as="h2" className="t-h1 pr-title">
          How we <em>work.</em>
        </Reveal>
        <Reveal as="p" className="t-body pr-lede" index={1}>
          Six steps, no black box. You always know where the project stands,
          what we need from you, and what lands next.
        </Reveal>
      </header>

      <div className="pr-steps">
        <div className="pr-view">
          {STEPS.map((s) => (
            <article className="pr-panel" key={s.name}>
              <p className="pr-num" aria-hidden="true">
                {s.no}
              </p>
              <div className="pr-copy">
                <h3 className="pr-name t-h2">{s.name}</h3>
                <p className="pr-text t-body">{s.body}</p>
                <div className="pr-gets">
                  <i className="pr-rule" aria-hidden="true" />
                  {s.gets.map((g) => (
                    <p className="pr-get t-body" key={g}>
                      {g}
                    </p>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
