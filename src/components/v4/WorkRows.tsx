'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion-v4'
import type { SheetProject } from '@/components/v4/ProjectSheets'
import { createWaveGL } from '@/components/v4/wave-gl'
import Button from '@/components/v4/Button'

/**
 * §5 ON DESKTOP — THE ROWS (2026-08-31, the user's mockups, final:
 * "Projects section/MacBook Pro 16_ - 8..11.png").
 *
 * THE HEAD. "IMMERSIVENESS / THROUGH — WORK", display size, in flow — it
 * enters word by word (the house masked rise, staggered) as the section
 * arrives past the services, and rises away with the scroll like any
 * paragraph would.
 *
 * THE PIN. Three rows under hairlines, one viewport, pinned. Each row is a
 * project: capture on the left, "Visit site" + the line beside it, the name
 * on the right. ONE row is expanded at a time — its capture large, its
 * text block pushed out to the right column under the name; the others are
 * collapsed to a thumb-height strip. Scroll is the clock: as one project's
 * row gives up its height the next row takes it, IN THE SAME FRAME, in the
 * same viewport — the first capture gets smaller as the second gets bigger.
 *
 * THE WAVE. The captures do not resize rigidly. Mid-move their pixels are
 * handed to wave-gl.ts — the fold's sibling: a bulge (the interior leads
 * the resize, the edges lag) plus crossed travelling sines whose phase is
 * the scrub itself, so the jelly runs with the wheel and reverses with it.
 * The growing capture swells, the shrinking one sucks in. At rest the
 * canvas is clear and the pixels are DOM (house rule) — unless THE HAND
 * is in a capture: rings run around the pointer, confined to a reach
 * near it (a gaussian pool, not the whole image), for as long as the
 * hover lasts; movement swells them, and leaving drains them out.
 *
 * THE INK FOLLOWS THE SCREEN. The expanded row's name, year and text sit
 * at full ink; the collapsed rows' recede — on the same clock as the
 * geometry, so ownership is legible in the type as well as the space.
 *
 * ONE CLOCK. t = which turn and how far. Each turn carries a DWELL at both
 * ends — a flat margin where the geometry is exactly at rest — so every
 * project holds its full-size beat before giving the screen up; LEAD and
 * TAIL rest the first and last. Row heights, hairlines, names, text blocks
 * and capture rects are all one function of t — lockstep, nothing staggers
 * mid-scrub (the FLIP rule: what keeps its line moves as one).
 *
 * DISCIPLINE. One gsap.ticker subscription, added a frame after mount so it
 * runs after Lenis. The movers are absolutely positioned and driven by CSS
 * variables (transform/opacity); the only layout writes are the two moving
 * captures' width/height, and those paint only at the moves' ends — mid-move
 * the DOM capture is hidden and the canvas owns the pixels.
 *
 * FALLBACKS. The markup is a plain layout: the head, then three rows —
 * thumb, text, name — every word real DOM text (SEO D5). `.is-scrub` (the
 * driver) is what pins and choreographs. Reduced motion, no JS, and phones
 * (WorkDeck owns §5 under 57.5rem; this is display:none there and returns
 * early) get the plain layout.
 */

/** viewport-heights of rest before the first turn and after the last */
const LEAD = 0.35
const TAIL = 0.4
/** THE CHASE (user, 2026-08-31: "no matter how quick you scroll in there,
 *  the wave animations won't happen too quick"). The displayed clock never
 *  equals the scroll — it chases it: an exponential approach (CHASE, per
 *  second) under a hard speed limit (MAX_V, turns per second). A flick
 *  through the whole pin still plays every turn at a watchable pace and
 *  settles on the expo tail; the cap is the floor under the premium. */
const CHASE = 4.0
const MAX_V = 0.75
/** each turn's flat margins: the fraction of a turn a project HOLDS at rest
 *  before/after its move — the beat that lets the big capture be seen */
const DWELL = 0.18
/** the arrival: rows resolve in while the pin's top climbs this much of the
 *  viewport */
const APPROACH = 0.8
/** the expanded row's share of the stage; the others split the rest */
const ROW_BIG = 0.56
/** the capture frames' aspect — the mockups' wide window; the 2880×2000
 *  captures are cover-cropped to it, anchored to their top (the site's nav
 *  and hero are the identity) */
const ASPECT = 16 / 9
/** the house reveal numbers (the arrival only — never mid-scrub) */
const BLUR = 14
const SHIFT = 18
/** the wave, at the envelope's peak: ripple amplitude as a share of the
 *  plane's height; the bulge as a share of the plane's size */
const AMP = 0.045
const BULGE = 0.13
/** the hand's rings at full energy, as a share of the capture's height
 *  (raised 2026-08-31, user: "more visible" — the house rule: build for
 *  presence and dial back) */
const PTR_AMP = 0.09
/** the energy a resting hover HOLDS — the rings never stop while the
 *  pointer is in the capture (user, 2026-08-31); movement kicks above it */
const SUSTAIN = 0.5

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const lerp = (a: number, b: number, u: number) => a + (b - a) * u

export default function WorkRows({ projects }: { projects: SheetProject[] }) {
  const rootRef = useRef<HTMLElement | null>(null)
  const n = projects.length

  /* THE HEAD'S ARRIVAL — its own observer, later than <Reveal>'s: the words
     rise only once the title has climbed 22% off the viewport's bottom, so
     the move plays where it can be watched (user, 2026-08-31). Watches the
     TITLE, never the masked words — a masked word intersects at exactly 0
     for as long as it is hidden (the legal-pages lesson in Reveal.tsx). */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const title = root.querySelector<HTMLElement>('.wr-title')
    const words = Array.from(root.querySelectorAll<HTMLElement>('.wr-title .k-reveal'))
    if (!title || !words.length) return
    const land = (w: HTMLElement) => w.classList.add('is-done')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      words.forEach((w) => w.classList.add('is-in', 'is-done'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          words.forEach((w) => {
            w.classList.add('is-in')
            w.addEventListener('transitionend', () => land(w), { once: true })
          })
          io.disconnect()
        })
      },
      { rootMargin: '0px 0px -22% 0px', threshold: 0 },
    )
    io.observe(title)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    /* phones: WorkDeck owns §5 and this section is display:none */
    if (getComputedStyle(root).display === 'none') return
    if (n < 2) return

    const pin = root.querySelector<HTMLElement>('.wr-pin')
    const stage = root.querySelector<HTMLElement>('.wr-stage')
    const rows = root.querySelector<HTMLElement>('.wr-rows')
    const hairs = Array.from(root.querySelectorAll<HTMLElement>('.wr-hair'))
    const thumbs = Array.from(root.querySelectorAll<HTMLElement>('.wr-thumb'))
    const imgs = thumbs.map((t) => t.querySelector<HTMLImageElement>('img'))
    const bodies = Array.from(root.querySelectorAll<HTMLElement>('.wr-body'))
    const sides = Array.from(root.querySelectorAll<HTMLElement>('.wr-side'))
    const canvas = root.querySelector<HTMLCanvasElement>('.wr-gl')
    if (!pin || !stage || !rows || thumbs.length !== n || sides.length !== n) return

    const T = LEAD + (n - 1) + TAIL
    root.classList.add('is-scrub')
    pin.style.height = `${(1 + T) * 100}vh`

    /* ---- the wave */
    const gl = canvas ? createWaveGL(canvas, n) : null
    const ready: boolean[] = []
    /* each capture's cover crop into the frame aspect, from its own pixels */
    const crops: { uv0: [number, number]; uvS: [number, number] }[] = projects.map(() => ({
      uv0: [0, 0],
      uvS: [1, 1],
    }))
    const ensure = (i: number) => {
      if (!gl || ready[i]) return !!ready[i]
      const im = imgs[i]
      if (im && im.complete && im.naturalWidth > 0) {
        ready[i] = gl.upload(i, im)
        const texA = im.naturalWidth / im.naturalHeight
        if (texA > ASPECT) {
          const sx = ASPECT / texA
          crops[i] = { uv0: [(1 - sx) / 2, 0], uvS: [sx, 1] }
        } else {
          /* top-anchored, like the DOM img's object-position 50% 0 */
          crops[i] = { uv0: [0, 0], uvS: [1, texA / ASPECT] }
        }
      }
      return !!ready[i]
    }
    const onLoad = imgs.map((im, i) => {
      const fn = () => ensure(i)
      im?.addEventListener('load', fn, { once: true })
      return fn
    })

    /* ---- geometry, cached until resize. All in stage CSS px; the canvas
       covers the whole stage, the rows' content box starts at (ox, oy). */
    const rem = () => parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    const geo = {
      W: 0, // content width
      H: 0, // content height
      ox: 0, // content offset inside the canvas
      oy: 0,
      padY: 16, // capture inset within its row
      gap: 40, // capture -> text block
      namePad: 8, // name's top inset within its row
      rSmall: 10, // corner radius, collapsed...
      rBig: 24, // ...and expanded
      maxW: 0, // width cap on the expanded capture
    }
    const measure = () => {
      const r = rem()
      const cs = getComputedStyle(stage)
      const padL = parseFloat(cs.paddingLeft) || 0
      const padT = parseFloat(cs.paddingTop) || 0
      const padR = parseFloat(cs.paddingRight) || 0
      const padB = parseFloat(cs.paddingBottom) || 0
      const box = stage.getBoundingClientRect()
      /* the rows box, not the stage: the head row of the stage is padding */
      const rb = rows.getBoundingClientRect()
      geo.W = box.width - padL - padR
      geo.H = box.height - padT - padB
      geo.ox = rb.left - box.left
      geo.oy = rb.top - box.top
      geo.padY = 1 * r
      geo.gap = 2.5 * r
      geo.namePad = 0.25 * r
      geo.rSmall = 0.625 * r
      geo.rBig = 1.5 * r
      geo.maxW = 0.62 * geo.W
    }

    /* ---- per-frame state */
    let lastU = -1
    let lastA = -1
    let cur = -1 /* the chased clock; -1 = snap to the scroll on first sight */
    let drawn = false
    let wasHot = false
    const glOn: boolean[] = projects.map(() => false)
    /* the last geometry pass, kept for frames where only the hand moves */
    let rects: { x: number; y: number; w: number; h: number; r: number }[] = []

    /* ---- THE HAND (recut 2026-08-31, user: cursor-focused, and "the wave
       never stops around the area of the cursor"). While the pointer is IN
       a capture its energy rises fast to a HELD level and stays there — the
       rings run for as long as you hover; movement kicks the energy above
       the hold, and leaving lets it drain to nothing. The ripple itself is
       confined to a reach around the pointer (wave-gl's gaussian), and the
       ring centre GLIDES to the hand rather than snapping with each event. */
    const energy: number[] = projects.map(() => 0)
    const hovering: boolean[] = projects.map(() => false)
    const ptrTgt: [number, number][] = projects.map(() => [0.5, 0.5])
    const ptrCur: [number, number][] = projects.map(() => [0.5, 0.5])
    let ptrPhase = 0
    const feel = (i: number, ev: PointerEvent, kick: number) => {
      const r = thumbs[i].getBoundingClientRect()
      if (r.width < 1 || r.height < 1) return
      ptrTgt[i] = [clamp01((ev.clientX - r.left) / r.width), clamp01((ev.clientY - r.top) / r.height)]
      energy[i] = Math.min(1, energy[i] + kick)
    }
    const onEnter = thumbs.map((_, i) => (ev: PointerEvent) => {
      hovering[i] = true
      feel(i, ev, 0.15)
      /* the rings begin under the hand, not gliding in from the middle */
      ptrCur[i] = [ptrTgt[i][0], ptrTgt[i][1]]
    })
    const onMove = thumbs.map(
      (_, i) => (ev: PointerEvent) =>
        feel(i, ev, Math.min(0.35, Math.hypot(ev.movementX, ev.movementY) * 0.02)),
    )
    const onLeave = thumbs.map((_, i) => () => {
      hovering[i] = false
    })
    thumbs.forEach((th, i) => {
      th.addEventListener('pointerenter', onEnter[i])
      th.addEventListener('pointermove', onMove[i])
      th.addEventListener('pointerleave', onLeave[i])
    })

    const setGlHidden = (i: number, on: boolean) => {
      if (glOn[i] === on) return
      glOn[i] = on
      thumbs[i].classList.toggle('is-gl', on)
    }

    /** the rect of capture i at row top y, row height h, activeness s */
    const rectFor = (y: number, h: number, s: number) => {
      let th = h - 2 * geo.padY
      let tw = th * ASPECT
      if (tw > geo.maxW) {
        tw = geo.maxW
        th = tw / ASPECT
      }
      return { x: 0, y: y + (h - th) / 2, w: tw, h: th, r: lerp(geo.rSmall, geo.rBig, s) }
    }

    const setEntrance = (a: number) => {
      if (a === lastA) return
      lastA = a
      const resolve = (el: HTMLElement, from: number, span: number, blur: boolean) => {
        const u = clamp01((a - from) / span)
        const eased = 1 - Math.pow(1 - u, 3)
        el.style.setProperty('--eo', eased.toFixed(3))
        el.style.setProperty('--ey', `${((1 - eased) * SHIFT * 1.6).toFixed(1)}px`)
        if (blur) el.style.filter = u >= 1 ? '' : `blur(${((1 - eased) * BLUR).toFixed(1)}px)`
      }
      for (let i = 0; i < n; i++) {
        const from = 0.06 + i * 0.12
        resolve(hairs[i], from, 0.5, false)
        resolve(thumbs[i], from + 0.04, 0.6, false)
        resolve(bodies[i], from + 0.12, 0.55, true)
        resolve(sides[i], from + 0.08, 0.55, true)
      }
    }

    const update = (_time?: number, deltaMs = 16.7) => {
      const rect = pin.getBoundingClientRect()
      const vh = window.innerHeight
      const span = rect.height - vh
      if (span <= 0) return
      const target = clamp01(-rect.top / span) * T
      /* first sight (a reload mid-page, a deep link): no catch-up theatre */
      if (cur < 0) cur = target
      const away = rect.bottom < -50 || rect.top > vh + 50
      if (away && cur === target) {
        /* parked out of sight: hand the pixels back to the DOM and idle.
           NOTE: parked, not snapped — a flick that carries the viewport
           past the pin no longer skips its turns; the chase below keeps
           playing until the clock has genuinely arrived. */
        if (drawn) {
          gl?.clear()
          drawn = false
          for (let i = 0; i < n; i++) setGlHidden(i, false)
        }
        for (let i = 0; i < n; i++) energy[i] = 0
        return
      }
      const dt = Math.min(deltaMs, 100) / 1000
      /* the chase: expo approach under a hard speed limit — and it ALWAYS
         finishes (user, 2026-08-31: intense scrolling skipped projects) */
      if (cur !== target) {
        const step = (target - cur) * (1 - Math.exp(-CHASE * dt))
        const cap = MAX_V * dt
        cur += Math.max(-cap, Math.min(cap, step))
        if (Math.abs(target - cur) < 0.0005) cur = target
      }
      /* the hand: energy holds at SUSTAIN while the pointer is in, drains
         when it leaves; the ring centre glides toward the hand. The clock
         runs whenever any energy is live — hovering still never stops it. */
      let hot = 0
      for (let i = 0; i < n; i++) {
        const tgt = hovering[i] ? SUSTAIN : 0
        if (energy[i] > tgt) {
          energy[i] = tgt + (energy[i] - tgt) * Math.exp(-2.6 * dt)
          if (tgt === 0 && energy[i] < 0.005) energy[i] = 0
        } else if (energy[i] < tgt) {
          energy[i] = tgt - (tgt - energy[i]) * Math.exp(-9 * dt)
        }
        const glide = 1 - Math.exp(-14 * dt)
        ptrCur[i][0] += (ptrTgt[i][0] - ptrCur[i][0]) * glide
        ptrCur[i][1] += (ptrTgt[i][1] - ptrCur[i][1]) * glide
        if (energy[i] > hot) hot = energy[i]
      }
      if (hot > 0) ptrPhase += dt * (4.5 + 7 * hot)

      const u = cur
      const a = rect.top <= 0 ? 1 : clamp01((vh - rect.top) / (vh * APPROACH))
      if (u === lastU && a === lastA && hot === 0 && !wasHot) return
      wasHot = hot > 0

      const t = gsap.utils.clamp(0, n - 1, u - LEAD)
      const k = Math.min(n - 2, Math.floor(t))
      const f = t - k
      /* the dwell: flat margins on each turn, geometry exactly at rest */
      const e = clamp01((f - DWELL) / (1 - 2 * DWELL))
      const ss = e * e * (3 - 2 * e)
      const moving = e > 0 && e < 1

      if (u !== lastU || a !== lastA) {
        lastU = u
        setEntrance(a)
        /* every mover is one function of t — lockstep */
        const small = (1 - ROW_BIG) / 2
        let y = 0
        rects = []
        for (let i = 0; i < n; i++) {
          const s = i === k ? 1 - ss : i === k + 1 ? ss : 0
          const h = (small + (ROW_BIG - small) * s) * geo.H
          const rc = rectFor(y, h, s)
          rects.push(rc)

          hairs[i].style.setProperty('--y', `${y.toFixed(2)}px`)
          sides[i].style.setProperty('--y', `${(y + geo.namePad).toFixed(2)}px`)
          /* the text block rides the capture: pushed by its right edge, and
             sinking from thumb-top to mid-image as the row expands */
          bodies[i].style.setProperty('--x', `${(rc.w + geo.gap).toFixed(2)}px`)
          bodies[i].style.setProperty('--y', `${(rc.y + s * 0.52 * rc.h).toFixed(2)}px`)
          /* THE INK FOLLOWS THE SCREEN: the row that owns the viewport at
             full ink, the others receded — same clock as the geometry */
          sides[i].style.setProperty('--wo', (0.4 + 0.6 * s).toFixed(3))
          bodies[i].style.setProperty('--wo', (0.55 + 0.45 * s).toFixed(3))

          const th = thumbs[i]
          th.style.setProperty('--y', `${rc.y.toFixed(2)}px`)
          th.style.width = `${rc.w.toFixed(2)}px`
          th.style.height = `${rc.h.toFixed(2)}px`
          th.style.borderRadius = `${rc.r.toFixed(2)}px`
          th.style.clipPath = `inset(0 round ${rc.r.toFixed(2)}px)`

          y += h
        }
      }

      /* the wave: a capture leaves the DOM while the scrub is resizing it
         or the hand is in it — shrinking drawn first, growing on top */
      if (gl && rects.length === n) {
        const env = Math.sin(Math.PI * e)
        const phase = (k + e) * 7
        let any = false
        for (let i = 0; i < n; i++) {
          const inTurn = moving && (i === k || i === k + 1)
          const need = (inTurn || energy[i] > 0) && ensure(i)
          setGlHidden(i, need)
          if (!need) continue
          if (!any) {
            gl.begin()
            any = true
          }
          const rc = rects[i]
          gl.draw(i, {
            rect: { x: rc.x + geo.ox, y: rc.y + geo.oy, w: rc.w, h: rc.h },
            radius: rc.r,
            uv0: crops[i].uv0,
            uvS: crops[i].uvS,
            amp: inTurn ? env * AMP * rc.h : 0,
            phase: i === k ? phase : phase + 2.1,
            bulge: inTurn ? (i === k ? -BULGE : BULGE) * env : 0,
            ptr: [ptrCur[i][0], ptrCur[i][1]],
            ptrAmp: energy[i] * PTR_AMP * rc.h,
            ptrPhase,
            /* the reach: a hand-sized pool, scaled to the capture but never
               swallowing a small thumb whole */
            ptrR: Math.min(140, Math.max(48, 0.32 * rc.h)),
          })
        }
        if (any) drawn = true
        else if (drawn) {
          gl.clear()
          drawn = false
        }
      }
    }

    const onResize = () => {
      measure()
      lastU = -1
      update()
    }
    measure()
    update() /* seed the choreography before the first painted frame */
    window.addEventListener('resize', onResize)
    /* one frame late on purpose — after Lenis in the ticker */
    const rafId = requestAnimationFrame(() => gsap.ticker.add(update))

    return () => {
      cancelAnimationFrame(rafId)
      gsap.ticker.remove(update)
      window.removeEventListener('resize', onResize)
      imgs.forEach((im, i) => im?.removeEventListener('load', onLoad[i]))
      thumbs.forEach((th, i) => {
        th.removeEventListener('pointerenter', onEnter[i])
        th.removeEventListener('pointermove', onMove[i])
        th.removeEventListener('pointerleave', onLeave[i])
      })
      root.classList.remove('is-scrub')
      pin.style.height = ''
      ;[...hairs, ...thumbs, ...bodies, ...sides].forEach((el) => {
        el.style.removeProperty('--x')
        el.style.removeProperty('--y')
        el.style.removeProperty('--ey')
        el.style.removeProperty('--eo')
        el.style.removeProperty('--wo')
        el.style.filter = ''
      })
      thumbs.forEach((th) => {
        th.classList.remove('is-gl')
        th.style.width = ''
        th.style.height = ''
        th.style.borderRadius = ''
        th.style.clipPath = ''
      })
    }
  }, [n, projects])

  return (
    <section ref={rootRef} className="wr k-dark" aria-label="Selected work">
      {/* THE HEAD — in flow, so it rises away with the scroll; the words
          arrive one by one through the house mask. Driven by this file's
          own observer, not <Reveal>: its 15% threshold is instant on a
          one-line word, and the user wants the rise SEEN — so it waits
          until the title is well clear of the viewport's bottom edge. */}
      <div className="wr-head">
        <h2 className="wr-title" aria-label="Immersiveness through work">
          <span className="wr-l1" aria-hidden="true">
            <span className="k-mask">
              <span className="k-reveal wr-w" style={{ '--i': 0 } as React.CSSProperties}>
                Immersiveness
              </span>
            </span>
          </span>
          <span className="wr-l2" aria-hidden="true">
            <span className="k-mask">
              <span className="k-reveal wr-w" style={{ '--i': 1 } as React.CSSProperties}>
                through
              </span>
            </span>
            <span className="k-mask">
              <span className="k-reveal wr-w" style={{ '--i': 2 } as React.CSSProperties}>
                work
              </span>
            </span>
          </span>
        </h2>
      </div>

      {/* THE PIN — three rows, one viewport. The markup is the fallback:
          plain rows in flow; `.is-scrub` flattens each row (display:
          contents) and the driver places every mover. */}
      <div className="wr-pin">
        <div className="wr-stage">
          <div className="wr-rows">
            {projects.map((p, i) => (
              <article className="wr-row" key={p.title}>
                <i className="wr-hair" aria-hidden="true" />
                <div className="wr-side">
                  <h3 className="wr-name t-h1">{p.title}</h3>
                  <span className="wr-year t-small">{p.year}</span>
                </div>
                <a
                  className="wr-thumb"
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${p.title} — visit the site`}
                >
                  {p.image && (
                    /* eager: each is one turn from being the wave's texture */
                    <img
                      src={p.image}
                      srcSet={`${p.image.replace(/\.webp$/, '-1600.webp')} 1600w, ${p.image} 2880w`}
                      sizes="62vw"
                      alt={`${p.title} — website by Konaverse`}
                      decoding="async"
                    />
                  )}
                </a>
                <div className="wr-body">
                  <Button href={p.href} external>
                    Visit site
                  </Button>
                  <p className="wr-line t-body">{p.line}</p>
                </div>
              </article>
            ))}
          </div>
          <canvas className="wr-gl" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
