'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion-v4'
import { runLight } from '@/lib/run-store'

/**
 * THE RUN — THE LIGHT and THE RUN BAR (service pages, 2026-09-17; the
 * brief: "a background is never one flat colour, and it never stops
 * moving… gradients should DO something: mark the chapter you are in,
 * pool under the active element"; and "agentic… states tick from
 * pending to done").
 *
 * THE LIGHT (run.css `.rl`). One fixed layer behind the page, made from
 * the neutral ramp only: a bright core, a soft shade opposite it and a
 * black wash low in the frame — three large radial fields, each moved
 * by TRANSFORM alone (nothing repaints but the dot mask). They never
 * stop: each drifts on its own slow CSS clock. And the core is AIMED:
 * whichever chapter holds the viewport writes where its working element
 * is (run-store `runLight`), and this driver eases the core after it, so
 * the light goes to the word being rendered, the fact computing, the
 * step running. The hub's dot field comes along stilled, seen ONLY where
 * the core is — the light reveals the grid. The opaque chapters (the
 * fit, the handover) cover this layer and carry their own glow.
 *
 * THE RUN BAR (`.rn`). The hub's plan chips, grown into the page's
 * progress: five anchors (real links, in the HTML) that tick pending →
 * running → done as the chapters are read. It flips polarity over the
 * void (a chapter says so with `data-dark="1"`, live for the two that
 * change ground mid-scene), arrives once the brief's pass is through,
 * and leaves for the footer. Phones get a hairline of progress at the
 * top instead.
 *
 * THE DRIVER. gsap.ticker + ONE rect per frame (the article's); the
 * chapters' places are offsets, measured on resize. Reduced motion: the
 * light holds still where it stands (run.css stops the clocks, this
 * driver does not aim it); the bar still ticks.
 */

export type RunChapter = { id: string; label: string }

/** the core's ease after its aim: the time constant, in seconds */
const GLIDE = 0.55
/** the bar waits for the brief's pass, in seconds */
const BAR_AFTER = 2.9

export default function RunLight({ chapters }: { chapters: readonly RunChapter[] }) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const host = ref.current
    const article = host?.closest<HTMLElement>('.sr')
    if (!host || !article) return
    const light = host.querySelector<HTMLElement>('.rl')!
    const bar = host.querySelector<HTMLElement>('.rn')!
    const chips = Array.from(bar.querySelectorAll<HTMLElement>('.rn-chip'))
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const secs = chapters.map((c) => article.querySelector<HTMLElement>(`#${c.id}`))

    let tops: number[] = []
    let ends: number[] = []
    let H = 0
    const measure = () => {
      H = article.offsetHeight
      tops = secs.map((s) => (s ? s.offsetTop : 0))
      ends = secs.map((s, i) => (s ? s.offsetTop + s.offsetHeight : tops[i]))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(article)

    let lx = runLight.x
    let ly = runLight.y
    let wx = -1
    let wy = -1
    const state: string[] = chips.map(() => '')
    let dark = false
    let shown = false
    let lastP = -1
    const born = performance.now()

    const tick = (_t?: number, deltaTime?: number) => {
      const r = article.getBoundingClientRect()
      const vh = window.innerHeight
      const vw = window.innerWidth
      const scroll = -r.top
      const dt = (deltaTime ?? 16.7) / 1000

      /* THE LIGHT: eased after the aim */
      if (!reduce) {
        const f = 1 - Math.exp(-dt / GLIDE)
        lx += (runLight.x - lx) * f
        ly += (runLight.y - ly) * f
      }
      if (Math.abs(lx - wx) > 0.0004 || Math.abs(ly - wy) > 0.0004) {
        wx = lx
        wy = ly
        light.style.setProperty('--rl-x', `${(lx * vw).toFixed(1)}px`)
        light.style.setProperty('--rl-y', `${(ly * vh).toFixed(1)}px`)
      }

      /* THE BAR: which chapter holds the middle, which lies under the bar */
      const mid = scroll + vh * 0.5
      const foot = scroll + vh - 40
      let under = -1
      secs.forEach((s, i) => {
        if (!s) return
        const st = mid >= ends[i] ? 'is-done' : mid >= tops[i] ? 'is-run' : ''
        if (st !== state[i]) {
          if (state[i]) chips[i].classList.remove(state[i])
          if (st) chips[i].classList.add(st)
          state[i] = st
        }
        if (foot >= tops[i] && foot < ends[i]) under = i
      })
      const d = under >= 0 && secs[under]!.dataset.dark === '1'
      if (d !== dark) bar.classList.toggle('is-dark', (dark = d))
      const show = (scroll > 8 || performance.now() - born > BAR_AFTER * 1000) && r.bottom > vh * 0.92
      if (show !== shown) bar.classList.toggle('is-shown', (shown = show))
      const p = Math.max(0, Math.min(1, scroll / Math.max(1, H - vh)))
      if (Math.abs(p - lastP) > 0.001) {
        lastP = p
        bar.style.setProperty('--rn-p', p.toFixed(4))
      }
    }
    tick()
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      ro.disconnect()
      light.style.removeProperty('--rl-x')
      light.style.removeProperty('--rl-y')
      bar.classList.remove('is-dark', 'is-shown')
      bar.style.removeProperty('--rn-p')
      chips.forEach((c) => c.classList.remove('is-run', 'is-done'))
    }
  }, [chapters])

  return (
    <div ref={ref} className="rl-host">
      {/* the ground: decoration */}
      <div className="rl" aria-hidden="true">
        <span className="rl-shade"><i /></span>
        <span className="rl-wash"><i /></span>
        <span className="rl-core"><i /></span>
        <span className="rl-dots" />
      </div>

      {/* the run: real anchors; SmoothScroll eases every same-page link */}
      <nav className="rn" aria-label="On this page">
        {chapters.map((c) => (
          <a key={c.id} className="rn-chip" href={`#${c.id}`}>
            <i className="rn-tick" aria-hidden="true" />
            {c.label}
          </a>
        ))}
      </nav>
    </div>
  )
}
