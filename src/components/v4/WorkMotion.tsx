'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, EASE, DUR, rem } from '@/lib/motion-v4'
import { getLenis } from '@/components/v4/SmoothScroll'

/**
 * /work — THE MOTION (2026-09-11, the user's wireframe "Work Page.png":
 * "bring it to life: images, scroll motion, design elements, and work
 * really well with hover").
 *
 * THE ENTRANCE. The statement's three lines rise through their masks;
 * the window resolves from a touch larger and blurred (the house
 * reveal); the vertical service labels at the page's edges fade in.
 *
 * THE PANE (user, 2026-09-11: "when I hover over the stack of images
 * the rectangle tilts based on the cursor"). Under the hand the window
 * tilts toward the pointer — perspective on the parent, rotateX/Y on
 * the window from two custom properties the ticker LERPS toward the
 * pointer, so the pane follows the hand with weight rather than
 * snapping. The entrance clears its inline transform when it lands, or
 * GSAP's leftover would override the tilt (it did).
 *
 * THE EXPANSION — desktop only (user, same day: "the hero becomes
 * pinned; on scroll the stack expands to the full viewport; once it has,
 * 'selected work' rises at the exact centre, 'selected' then 'work';
 * not scroll-driven but scroll-ACTIVATED, at a fixed speed with a nice
 * ease; scrolling back up while it runs reverses it from where it is").
 *
 *   · The hero is a pinned stage. The window is taken out of the flow at
 *     its own rest rect and the sequence is ONE PAUSED TIMELINE: the
 *     statement, the side labels and the buttons leave; the window's
 *     box grows to the viewport (left/top/width/height, radius to 0 —
 *     layout on one element, so the reel's pixels are re-rastered
 *     crisp at every size, never a scaled bitmap); a shade rises on the
 *     reel; then "selected" rises through its crop at the viewport's
 *     centre, and "work" a beat behind it.
 *   · The first wheel notch down at the top of the pin LOCKS the scroll
 *     (Lenis stops) and plays the timeline. While it runs, a wheel down
 *     keeps it playing and a wheel up REVERSES it from its current time
 *     — GSAP walks the same eased curve backwards. When it lands at
 *     either end the scroll is released. At the far end the page then
 *     scrolls on past the expanded stage; scrolling back up to the top
 *     of the pin from there locks and reverses it, so the hero can be
 *     folded back.
 *   · Phones and reduced motion keep the in-flow hero with the cut title
 *     under the window (work.css).
 *
 * THE META ROW draws its hairlines from the labels outward as it
 * enters. THE CARDS ARRIVE AS PAPER — the homepage §4 move, verbatim: a
 * per-corner homography written as one matrix3d per cell, the INNER
 * corner of each pair grabbed first so the two cards reach for each
 * other across the gutter. Scrub, not playback. THE HAND over a card:
 * the native cursor goes and a frosted disc that says "View" glides to
 * the pointer; the plate becomes a reel; the spotlight rides the ring.
 *
 * One ticker, rect math, transform and custom properties, and the one
 * layout tween the expansion needs.
 */

/* ---- the paper's numbers, the homepage's (ServiceCards.tsx) ---- */
const LAG = 0.5
const SPAN = 0.52
const TRAVEL = 0.72
const OUT_X = 0.17
const DOWN_Y = 0.34
/** the disc's and the pane's glide toward the pointer, per frame */
const GLIDE = 0.18
const TILT_GLIDE = 0.12
/** the pane's reach, in degrees at the window's edge */
const TILT_X = 7
const TILT_Y = 9
/** the expansion's clock */
const GROW = 1.6
const GROW_EASE = 'expo.inOut'
/** the pin's scroll budget after the sequence, in viewports */
const AFTER = 0.35
/** the top region of the pin where a wheel notch arms the sequence */
const ARM_PX = 120

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a || 1e-6))
  return t * t * (3 - 2 * t)
}
const UNIT: [number, number][] = [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1],
]
/** Heckbert's square-to-quad, as the eight coefficients CSS wants */
function squareToQuad(q: number[]) {
  const [x0, y0, x1, y1, x2, y2, x3, y3] = q
  const dx1 = x1 - x2
  const dy1 = y1 - y2
  const dx2 = x3 - x2
  const dy2 = y3 - y2
  const den = dx1 * dy2 - dx2 * dy1
  if (!den) return null
  const sx = x0 - x1 + x2 - x3
  const sy = y0 - y1 + y2 - y3
  const g = (sx * dy2 - dx2 * sy) / den
  const h = (dx1 * sy - sx * dy1) / den
  return {
    a: x1 - x0 + g * x1,
    b: x3 - x0 + h * x3,
    c: x0,
    d: y1 - y0 + g * y1,
    e: y3 - y0 + h * y3,
    f: y0,
    g,
    h,
  }
}

export default function WorkMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hover = window.matchMedia('(hover: hover)').matches
    const desktop = window.matchMedia('(min-width: 57.5rem)').matches

    const hero = root.querySelector<HTMLElement>('.wk-hero')
    const stage = root.querySelector<HTMLElement>('.wk-stage')
    const host = root.querySelector<HTMLElement>('.wk-card-hero')
    const state = root.querySelector<HTMLElement>('.wk-state')
    const lines = Array.from(root.querySelectorAll<HTMLElement>('.wk-ln'))
    const win = root.querySelector<HTMLElement>('.wk-win')
    const winMedia = root.querySelector<HTMLElement>('.wk-win-media')
    const acts = root.querySelector<HTMLElement>('.wk-win-acts')
    const shade = root.querySelector<HTMLElement>('.wk-win-shade')
    const sides = Array.from(root.querySelectorAll<HTMLElement>('.wk-sides'))
    const sideItems = Array.from(root.querySelectorAll<HTMLElement>('.wk-side'))
    const title = root.querySelector<HTMLElement>('.wk-title')
    const titleWrap = root.querySelector<HTMLElement>('.wk-title-wrap')
    const bigWords = Array.from(root.querySelectorAll<HTMLElement>('.wk-big-w'))
    const meta = root.querySelector<HTMLElement>('.wk-meta')
    const grid = root.querySelector<HTMLElement>('.wk-grid')
    const cells = Array.from(root.querySelectorAll<HTMLElement>('.wk-cell'))
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.wk-card'))
    const disc = root.querySelector<HTMLElement>('.wk-view')

    let tl: gsap.core.Timeline | null = null
    let cancelled = false

    if (reduce) {
      root.classList.add('is-in')
      meta?.classList.add('is-in')
      cards.forEach((c) => c.classList.add('is-in'))
      return () => {
        root.classList.remove('is-in')
        meta?.classList.remove('is-in')
        cards.forEach((c) => c.classList.remove('is-in'))
      }
    }

    /* ---- the entrance ---- */
    const start = () => {
      if (cancelled) return
      const k = rem()
      tl = gsap.timeline({
        onStart: () => root.classList.add('is-in'),
        /* the tilt and the expansion own these from here */
        onComplete: () => {
          if (win) gsap.set(win, { clearProps: 'transform,opacity,filter' })
        },
      })
      tl.fromTo(
        lines,
        { yPercent: 110, filter: `blur(${8 * k}px)` },
        { yPercent: 0, filter: 'blur(0px)', duration: DUR.slow, ease: EASE.glass, stagger: 0.1 },
        0,
      )
      if (win) {
        tl.fromTo(
          win,
          { opacity: 0, scale: 1.05, filter: `blur(${14 * k}px)` },
          { opacity: 1, scale: 1, filter: 'blur(0px)', duration: DUR.cinema, ease: EASE.glass },
          0.3,
        )
      }
      if (sideItems.length) {
        tl.fromTo(sideItems, { opacity: 0 }, { opacity: 1, duration: DUR.slow, ease: EASE.glass, stagger: 0.1 }, 0.5)
      }
      if (title && !desktop) {
        tl.fromTo(
          title,
          { yPercent: 55, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: DUR.cinema, ease: EASE.glass },
          0.55,
        )
      }
    }
    if (typeof document.fonts?.ready?.then === 'function') document.fonts.ready.then(start)
    else start()

    /* ---- THE EXPANSION (desktop) ---- */
    let grow: gsap.core.Timeline | null = null
    let locked = false
    const lenis = getLenis()
    const lock = (at: number) => {
      if (locked) return
      locked = true
      /* park the scroll exactly at the pin's top before stopping, so no
         motion Lenis had queued plays out under the sequence */
      lenis?.scrollTo(at, { immediate: true, force: true })
      lenis?.stop()
      root.classList.add('is-locked')
    }
    const unlock = () => {
      if (!locked) return
      locked = false
      lenis?.start()
      root.classList.remove('is-locked')
    }
    const pinned = desktop && hero && stage && win && host && bigWords.length === 2
    if (pinned && hero && stage && win && host) {
      hero.classList.add('is-pin')
      hero.style.setProperty('--wk-after', `${AFTER * 100}svh`)
      /* the window leaves the flow at its own rest rect (in the stage's
         coordinates), so the box can be tweened to the viewport */
      const place = () => {
        const s = stage.getBoundingClientRect()
        const w = win.getBoundingClientRect()
        gsap.set(win, {
          position: 'absolute',
          left: w.left - s.left,
          top: w.top - s.top,
          width: w.width,
          height: w.height,
          margin: 0,
        })
      }
      /* measure in flow first: clear any previous placement */
      const rest = { left: 0, top: 0, width: 0, height: 0 }
      const measureRest = () => {
        gsap.set(win, { clearProps: 'position,left,top,width,height,margin' })
        const s = stage.getBoundingClientRect()
        const w = win.getBoundingClientRect()
        rest.left = w.left - s.left
        rest.top = w.top - s.top
        rest.width = w.width
        rest.height = w.height
        place()
      }
      measureRest()

      const build = () => {
        grow?.kill()
        const vw = stage.clientWidth
        const vh = stage.clientHeight
        grow = gsap.timeline({
          paused: true,
          onComplete: unlock,
          onReverseComplete: unlock,
        })
        /* the room leaves: the statement up and out, the labels and
           the buttons fade */
        if (state) grow.to(state, { opacity: 0, y: -24, duration: 0.5, ease: 'power2.in' }, 0)
        if (sides.length) grow.to(sides, { opacity: 0, duration: 0.4, ease: 'power2.in' }, 0)
        if (acts) grow.to(acts, { opacity: 0, scale: 0.92, duration: 0.4, ease: 'power2.in' }, 0)
        /* the window grows to the viewport — one layout tween, the
           reel re-rastered at every size */
        grow.fromTo(
          win,
          { left: rest.left, top: rest.top, width: rest.width, height: rest.height, borderRadius: '0.625rem' },
          { left: 0, top: 0, width: vw, height: vh, borderRadius: '0rem', duration: GROW, ease: GROW_EASE },
          0.1,
        )
        if (shade) grow.to(shade, { opacity: 1, duration: 0.8, ease: 'sine.out' }, 0.6)
        /* the title: "selected", then "work", rising through their crops
           at the centre. The park is GSAP's own (a CSS translateY(112%)
           would be read back as a fixed pixel offset under the animated
           percentage and hold the words down) */
        gsap.set(bigWords, { y: 0, yPercent: 112 })
        grow.fromTo(
          bigWords[0],
          { yPercent: 112 },
          { yPercent: 0, duration: 1.0, ease: 'expo.out' },
          0.1 + GROW - 0.25,
        )
        grow.fromTo(
          bigWords[1],
          { yPercent: 112 },
          { yPercent: 0, duration: 1.0, ease: 'expo.out' },
          0.1 + GROW - 0.25 + 0.16,
        )
      }
      build()

      /* the wheel is the intent: down plays, up reverses. Taken in the
         CAPTURE phase and stopped there when consumed, so Lenis — which
         listens on the window too — never sees a notch the sequence has
         taken. */
      const consume = (e: WheelEvent) => {
        e.preventDefault()
        e.stopImmediatePropagation()
      }
      const onWheel = (e: WheelEvent) => {
        if (!grow) return
        const dir = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0
        if (!dir) return
        const p = grow.progress()
        if (locked) {
          if (dir > 0) grow.play()
          else grow.reverse()
          consume(e)
          return
        }
        const top = hero.getBoundingClientRect().top + window.scrollY
        const y = window.scrollY
        /* in the top region of the pin, at rest: a notch down arms it */
        if (dir > 0 && p === 0 && y >= top - 2 && y <= top + ARM_PX) {
          lock(top)
          grow.play()
          consume(e)
          return
        }
        /* back in the top region, expanded: a notch up folds it */
        if (dir < 0 && p === 1 && y >= top - 2 && y <= top + ARM_PX) {
          lock(top)
          grow.reverse()
          consume(e)
        }
      }
      window.addEventListener('wheel', onWheel, { passive: false, capture: true })
      const onResize = () => {
        const p = grow?.progress() ?? 0
        measureRest()
        build()
        grow?.progress(p)
      }
      window.addEventListener('resize', onResize)
      /* the cleanup for this block */
      const off = () => {
        window.removeEventListener('wheel', onWheel, { capture: true })
        window.removeEventListener('resize', onResize)
        grow?.kill()
        unlock()
        gsap.set(win, { clearProps: 'position,left,top,width,height,margin,borderRadius' })
        if (state) gsap.set(state, { clearProps: 'opacity,transform' })
        if (acts) gsap.set(acts, { clearProps: 'opacity,transform' })
        sides.forEach((s) => gsap.set(s, { clearProps: 'opacity' }))
        bigWords.forEach((w) => gsap.set(w, { clearProps: 'transform' }))
        if (shade) gsap.set(shade, { clearProps: 'opacity' })
        hero.classList.remove('is-pin')
        hero.style.removeProperty('--wk-after')
      }
      ;(root as HTMLElement & { __offPin?: () => void }).__offPin = off
    }

    /* ---- the meta row's reveal; the cards' too where the paper does
       not arm (phones) ---- */
    const paper = desktop && grid && cells.length === cards.length && cells.length > 0
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          ;(e.target as HTMLElement).classList.add('is-in')
          io.unobserve(e.target)
        })
      },
      { threshold: 0.18 },
    )
    if (meta) io.observe(meta)
    if (!paper) cards.forEach((c) => io.observe(c))

    /* ---- THE PAPER (the homepage §4 entrance) ---- */
    type Box = { oy: number; w: number; h: number; col: number }
    let boxes: Box[] = []
    const last = new Array(cells.length).fill(-1)
    let ro: ResizeObserver | null = null
    if (paper && grid) {
      grid.classList.add('is-paper')
      const measure = () => {
        boxes = cells.map((el, i) => ({
          oy: el.offsetTop - grid.offsetTop,
          w: el.offsetWidth,
          h: el.offsetHeight,
          col: i % 2,
        }))
      }
      measure()
      ro = new ResizeObserver(measure)
      ro.observe(grid)
    }
    const writePaper = (i: number, p: number) => {
      const el = cells[i]
      const box = boxes[i]
      if (!el || !box) return
      const { w: W, h: H, col } = box
      if (!W || !H) return
      if (p >= 1) {
        el.style.transform = ''
        el.style.opacity = ''
        return
      }
      const gx = col === 0 ? 1 : 0
      const gy = 0
      const sx = (col === 0 ? -1 : 1) * W * OUT_X
      const sy = H * DOWN_Y
      const quad: number[] = []
      for (const [u, v] of UNIT) {
        const wgt = (Math.abs(u - gx) + Math.abs(v - gy)) / 2
        const t = smoothstep(wgt * LAG, SPAN + wgt * LAG, p)
        const rx = u * W
        const ry = v * H
        const spread = 0.45 + 0.85 * wgt
        let ax = rx + sx * spread
        let ay = ry + sy * spread
        const kk = 0.07 * (0.4 + wgt)
        ax += (W / 2 - ax) * kk
        ay += (H / 2 - ay) * kk
        quad.push(ax + (rx - ax) * t, ay + (ry - ay) * t)
      }
      const m = squareToQuad(quad)
      if (!m) return
      el.style.transform =
        `matrix3d(${m.a},${m.d},0,${m.g},${m.b},${m.e},0,${m.h},0,0,1,0,${m.c},${m.f},0,1)` +
        ` scale(${1 / W},${1 / H})`
      el.style.opacity = `${smoothstep(0, 0.32, p)}`
    }

    /* ---- the hand ---- */
    let tx = 0
    let ty = 0
    let rx = 0
    let ry = 0
    let onPane = false
    const onWin = (e: PointerEvent) => {
      if (!win) return
      const r = win.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      tx = -y * 2 * TILT_X
      ty = x * 2 * TILT_Y
      onPane = true
    }
    const offWin = () => {
      tx = 0
      ty = 0
      onPane = false
    }
    let px = 0
    let py = 0
    let dx = 0
    let dy = 0
    let over = false
    const cardHandlers = cards.map((c) => {
      const move = (e: PointerEvent) => {
        const r = c.getBoundingClientRect()
        c.style.setProperty('--wk-mx', `${(e.clientX - r.left).toFixed(1)}px`)
        c.style.setProperty('--wk-my', `${(e.clientY - r.top).toFixed(1)}px`)
        px = e.clientX
        py = e.clientY
        if (!over) {
          over = true
          dx = px
          dy = py
          root.classList.add('is-view')
        }
      }
      const leave = () => {
        over = false
        root.classList.remove('is-view')
      }
      return { move, leave }
    })
    if (hover) {
      win?.addEventListener('pointermove', onWin)
      win?.addEventListener('pointerleave', offWin)
      cards.forEach((c, i) => {
        c.addEventListener('pointermove', cardHandlers[i].move)
        c.addEventListener('pointerleave', cardHandlers[i].leave)
      })
    }

    /* ---- the clock ---- */
    const tick = () => {
      const vh = window.innerHeight
      const k = rem()
      /* the pane: the tilt glides toward the hand, and rests flat while
         the expansion has the window */
      if (win) {
        const growing = grow ? grow.progress() > 0 : false
        const gx = growing ? 0 : tx
        const gy = growing ? 0 : ty
        rx += (gx - rx) * TILT_GLIDE
        ry += (gy - ry) * TILT_GLIDE
        if (Math.abs(rx) > 0.01 || Math.abs(ry) > 0.01 || onPane) {
          win.style.setProperty('--wk-rx', `${rx.toFixed(2)}deg`)
          win.style.setProperty('--wk-ry', `${ry.toFixed(2)}deg`)
        }
      }
      /* the cut title's lag (phones and the un-pinned fallback only) */
      if (host && titleWrap && !pinned) {
        const r = host.getBoundingClientRect()
        if (r.bottom > -300 && r.top < vh + 300) {
          const c = (r.bottom - vh / 2) / vh
          titleWrap.style.transform = `translate3d(0, ${(c * 64 * k).toFixed(2)}px, 0)`
        }
      }
      /* the reel drifts against the scroll while the window is at rest */
      if (host && winMedia && !(grow && grow.progress() > 0)) {
        const r = host.getBoundingClientRect()
        const c = (r.bottom - vh / 2) / vh
        winMedia.style.transform = `translate3d(0, ${(c * -22 * k).toFixed(2)}px, 0)`
      } else if (winMedia) {
        winMedia.style.transform = ''
      }
      if (paper && grid) {
        const gridTop = grid.getBoundingClientRect().top
        const travel = vh * TRAVEL
        const ps: number[] = []
        for (let i = 0; i < boxes.length; i++) ps.push(clamp01((vh - (gridTop + boxes[i].oy)) / travel))
        for (let i = 0; i < ps.length; i++) {
          if (ps[i] === last[i] && (ps[i] === 0 || ps[i] === 1)) continue
          last[i] = ps[i]
          writePaper(i, ps[i])
        }
      }
      if (hover && disc && over) {
        dx += (px - dx) * GLIDE
        dy += (py - dy) * GLIDE
        disc.style.transform = `translate3d(${(dx - disc.offsetWidth / 2).toFixed(1)}px, ${(dy - disc.offsetHeight / 2).toFixed(1)}px, 0)`
      }
    }
    tick()
    gsap.ticker.add(tick)

    return () => {
      cancelled = true
      tl?.kill()
      io.disconnect()
      ro?.disconnect()
      gsap.ticker.remove(tick)
      ;(root as HTMLElement & { __offPin?: () => void }).__offPin?.()
      win?.removeEventListener('pointermove', onWin)
      win?.removeEventListener('pointerleave', offWin)
      cards.forEach((c, i) => {
        c.removeEventListener('pointermove', cardHandlers[i].move)
        c.removeEventListener('pointerleave', cardHandlers[i].leave)
      })
      cells.forEach((el) => {
        el.style.transform = ''
        el.style.opacity = ''
      })
      grid?.classList.remove('is-paper')
      root.classList.remove('is-in', 'is-view', 'is-locked')
      meta?.classList.remove('is-in')
      cards.forEach((c) => c.classList.remove('is-in'))
      if (titleWrap) titleWrap.style.transform = ''
      if (winMedia) winMedia.style.transform = ''
      win?.style.removeProperty('--wk-rx')
      win?.style.removeProperty('--wk-ry')
    }
  }, [])

  return (
    <main ref={ref} className="wk">
      {children}
      {/* the hand's disc over the cards — the word is the affordance */}
      <div className="wk-view" aria-hidden="true">
        <span>View</span>
      </div>
    </main>
  )
}
