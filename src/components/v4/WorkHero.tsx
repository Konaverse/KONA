'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { getLenis } from '@/components/v4/SmoothScroll'
import { gsap, EASE, DUR, rem } from '@/lib/motion-v4'

/**
 * /work — THE HERO THAT BECOMES THE WORK (2026-09-17).
 *
 * SECOND BUILD, morning (user: "elevate the concept of the hero by
 * redesigning it. I like the current hero, but it's poorly designed and
 * implemented… No eyebrows, no numbering, and no hairlines"): a
 * statement; under it a WINDOW that cuts relentlessly through the
 * projects' captures (THE REEL) and leans to the hand; on scroll the
 * window grows to the whole viewport and "selected", then "work", rise.
 *
 * THIRD BUILD, evening (user, with a recording — "projects section
 * vide.mp4": "after the container opens to full viewport it stays to full
 * viewport and becomes this section… connected to the footer"). The
 * homepage's hover list on a paper cover did not tie with the hero, and
 * is gone with the cover. The full bleed now STAYS and turns into THE
 * SLIDER of the recording:
 *   · the picture fills the screen and DISSOLVES from project to project
 *   · one track of names runs across the middle: the project on show
 *     centred, its neighbours dim and cut by the screen's edges
 *   · a small window at the foot, cut by the fold, is a filmstrip of the
 *     projects' captures that pushes sideways with the names
 *   · two arrows stand at the foot, right
 * The recording's counter is left out (the brief above: no numbering).
 * After the last project the stage lets go and the footer — the house
 * void — comes up under it: dark into dark.
 *
 * HOW IT IS OURS. The ground is the hero's own reel, still mono under
 * its shade (the names read on any capture); the slider LOCKS the reel
 * to one project — it keeps cutting, slower, through that site alone,
 * and a change of project is the one DISSOLVE. The filmstrip is the
 * colour on the page. The names are set in the statement's type.
 *
 * SCROLL walks the slider: a band of the runway per project, the track
 * gliding to the band's project (it rests centred; it is not a raw
 * scrub). HOVER: the picture drifts against the hand and the filmstrip
 * with it; a neighbour's name lights and a click brings it to the
 * centre; the centred name's line rolls to "View case study"; the
 * filmstrip lifts clear of the fold; the arrows flood. Names, filmstrip
 * and arrows move the SCROLL (Lenis), so hand and wheel never disagree.
 *
 * THE GROW, as before. The window is ONE clip-path on a full-bleed
 * layer, insets snapped to whole pixels; the reel is sized once as the
 * screen's cover box and takes one transform. The scroll is read in
 * SCREENS (S), on the glide with a top speed.
 *
 * THE DRIVER. gsap.ticker + one rect per frame. Per frame: one
 * clip-path, a handful of transforms and opacities, the reel's classes.
 * Phones, reduced motion and no JS get the hero in flow — statement,
 * buttons, the window as a plain frame, the title, then the projects as
 * a list of plates with their names (the same links).
 */

export interface HeroProject {
  slug: string
  name: string
  service: string
  year: string
  /** where the project goes: its case study, else the live site */
  href: string
  /** the capture in the filmstrip (colour) */
  image: string
  /** the captures the reel cuts through, mono */
  shots: readonly string[]
}

/** the scene's beats, in SCREENS of scroll */
const LEAVE = [0.05, 0.38]
const GROW = [0.05, 1.06]
/* the shade is DOWN before the title rises: some captures are paper-light */
const SHADE = [0.34, 0.96]
const BIG = [0.96, 1.39]
const BIG_OUT = [1.7, 2.0]
const SLIDE_IN = [1.9, 2.32]
/** the slider: where the first project's band starts, a band's length */
const FIRST = 2.1
const BAND = 0.7
/** the glide's time constant (s) and the scroll's top speed (screens/s) */
const GLIDE = 0.2
const TOP_SPEED = 2.05
/** the track's glide to its project (s) */
const SLIDE = 0.26
/** the window at rest, in rem: its width, its top; its ratio; its radius */
const WIN_W = 60
const WIN_TOP = 27.5
const WIN_RATIO = 1.9
const WIN_R = 1.8
/** the print's extra zoom in the window, eased out by the grow; and the
 *  slider's, which gives the picture room to drift against the hand */
const ZOOM = 1.06
const ZOOM_SLIDE = 1.035
/** the drift against the hand, in rem: the picture, the filmstrip */
const DRIFT = 0.9
const DRIFT_STRIP = 0.5
/** the reel's cut, seconds a frame: in the window, at full bleed, locked */
const CUT = [0.24, 0.9, 1.5]
/** the lean under the hand, in degrees */
const LEAN = 5
/** the names' spacing, in viewport widths; a neighbour's presence */
const SPACING = 0.5
const DIM = 0.36

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
/* the grow's curve: a soft start, a quick middle, a long settle (a plain
   cubic in-out left a small window alone on bare paper for too long) */
const drift = (v: number) => {
  const s = v * v * (3 - 2 * v)
  return 1 - Math.pow(1 - s, 1.6)
}
const easeOut = (v: number) => 1 - (1 - v) * (1 - v) * (1 - v)
const easeIn = (v: number) => v * v * v
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const span = (s: number, r: number[]) => clamp01((s - r[0]) / (r[1] - r[0]))

export default function WorkHero({
  lines,
  projects,
  children,
}: {
  /** the statement, line by line; the last is set in ink */
  lines: readonly string[]
  /** the roster, in slider order */
  projects: readonly HeroProject[]
  /** the two CTAs, rendered by the page */
  children: ReactNode
}) {
  const ref = useRef<HTMLElement | null>(null)

  /* THE REEL: each project's captures dealt round the table — so a cut in
     the window is always to ANOTHER site, never to the same one */
  const reel: { src: string; p: number }[] = []
  const deep = Math.max(0, ...projects.map((p) => p.shots.length))
  for (let k = 0; k < deep; k++) projects.forEach((p, i) => p.shots[k] && reel.push({ src: p.shots[k], p: i }))

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const q = <T extends Element = HTMLElement>(s: string) => root.querySelector<T>(s)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const phone = window.matchMedia('(max-width: 57.5rem)').matches
    const stage = q('.wh-stage')!
    const win = q('.wh-win')!
    const reelEl = q('.wh-reel')!
    const shade = q('.wh-shade')!
    const shadow = q('.wh-shadow')!
    const acts = q('.wh-acts')!
    const track = q('.wh-track')!
    const strip = q('.wh-strip')!
    const stripRow = q('.wh-strip-row')!
    const arrows = q('.wh-arrows')!
    const prevBtn = q<HTMLButtonElement>('.wh-arrow-prev')!
    const nextBtn = q<HTMLButtonElement>('.wh-arrow-next')!
    const lns = Array.from(root.querySelectorAll<HTMLElement>('.wh-ln'))
    const bigs = Array.from(root.querySelectorAll<HTMLElement>('.wh-big-w'))
    const imgs = Array.from(root.querySelectorAll<HTMLElement>('.wh-f'))
    const items = Array.from(root.querySelectorAll<HTMLElement>('.wh-item'))
    const of = imgs.map((im) => Number(im.dataset.p ?? 0))
    const N = items.length

    /* THE REEL's clock — everywhere but reduced motion. `lock` holds it
       to one project's captures (the slider); −1 lets it run free */
    let at = 0
    let since = 0
    let cut = CUT[0]
    let lock = -1
    const advance = (fade: boolean) => {
      if (imgs.length < 2) return
      let next = at
      for (let k = 0; k < imgs.length; k++) {
        next = (next + 1) % imgs.length
        if (lock < 0 || of[next] === lock) break
      }
      if (next === at) return
      const prev = at
      at = next
      since = 0
      imgs.forEach((im, i) => {
        im.classList.toggle('is-on', i === at)
        im.classList.toggle('is-prev', i === prev)
        im.classList.toggle('is-fade', fade && i === at)
      })
    }
    const step = (dt: number) => {
      since += dt
      if (since >= cut) advance(false)
    }

    if (reduce) {
      root.classList.add('is-in')
      return () => root.classList.remove('is-in')
    }
    if (phone) {
      root.classList.add('is-in')
      const t = (_t?: number, deltaTime?: number) => {
        const r = win.getBoundingClientRect()
        if (r.bottom > 0 && r.top < window.innerHeight) step((deltaTime ?? 16.7) / 1000)
      }
      gsap.ticker.add(t)
      return () => {
        gsap.ticker.remove(t)
        root.classList.remove('is-in')
        imgs.forEach((im) => im.classList.remove('is-on', 'is-prev', 'is-fade'))
      }
    }

    root.classList.add('is-live')

    /* the stage, the window at rest, the print's cover box — px */
    let W = 1
    let H = 1
    let w0 = { x: 0, y: 0, w: 1, h: 1, r: 0 }
    let cover = { w: 1, h: 1 }
    let unit = 16
    let stripW = 1
    let wrote = ''
    const measure = () => {
      unit = 16 * rem()
      W = stage.offsetWidth || 1
      H = stage.offsetHeight || 1
      const w = Math.min(WIN_W * unit, W - 4 * unit)
      w0 = { x: (W - w) / 2, y: WIN_TOP * unit, w, h: w / WIN_RATIO, r: WIN_R * unit }
      const cw = Math.max(W, H * WIN_RATIO)
      cover = { w: cw, h: cw / WIN_RATIO }
      /* the reel is laid out ONCE as the screen's cover box, centred */
      reelEl.style.width = `${cover.w.toFixed(1)}px`
      reelEl.style.height = `${cover.h.toFixed(1)}px`
      reelEl.style.left = `${((W - cover.w) / 2).toFixed(1)}px`
      reelEl.style.top = `${((H - cover.h) / 2).toFixed(1)}px`
      stripW = strip.offsetWidth || 1
      wrote = ''
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(stage)

    /* THE ENTRANCE: the lines rise, the buttons come, the window comes up */
    const ent = { v: 0 }
    gsap.set(lns, { yPercent: 112 })
    gsap.set(acts, { opacity: 0, y: 14 * rem() })
    const tl = gsap.timeline({
      onUpdate: () => {
        wrote = ''
      },
    })
    tl.call(() => root.classList.add('is-in'), undefined, 0)
    tl.to(lns, { yPercent: 0, duration: 1.1, ease: EASE.glass, stagger: 0.09 }, 0.1)
    tl.to(acts, { opacity: 1, y: 0, duration: DUR.slow, ease: EASE.glass }, 0.55)
    tl.to(ent, { v: 1, duration: 1.5, ease: EASE.glass }, 0.25)

    /* the hand, for the lean and the drift */
    let px = -1
    let py = -1
    let rx = 0
    let ry = 0
    let mx = 0
    let my = 0
    const onMove = (ev: PointerEvent) => {
      px = ev.clientX
      py = ev.clientY
    }
    const onGone = () => (px = -1)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onGone)

    /* THE SLIDER's hands: a name, the filmstrip and the arrows all move
       the SCROLL to a project's band — the wheel and the hand agree */
    let idx = 0
    const goto = (i: number) => {
      const k = Math.max(0, Math.min(N - 1, i))
      const top = root.getBoundingClientRect().top + window.scrollY
      const y = top + (FIRST + (k + 0.5) * BAND) * window.innerHeight
      const lenis = getLenis()
      if (lenis) lenis.scrollTo(y, { duration: 1.1 })
      else window.scrollTo({ top: y, behavior: 'smooth' })
    }
    const onPrev = () => goto(idx - 1)
    const onNext = () => goto(idx + 1)
    prevBtn.addEventListener('click', onPrev)
    nextBtn.addEventListener('click', onNext)
    const onName = (ev: MouseEvent) => {
      const li = (ev.target as HTMLElement).closest<HTMLElement>('.wh-item')
      const i = li ? items.indexOf(li) : -1
      /* the centred name is a link; a neighbour comes to the centre */
      if (i < 0 || i === idx || ev.metaKey || ev.ctrlKey || ev.shiftKey) return
      ev.preventDefault()
      goto(i)
    }
    track.addEventListener('click', onName)
    /* the keyboard: a focused name comes to the centre (and the stage
       must not side-scroll to show it) */
    const onFocus = (ev: FocusEvent) => {
      const li = (ev.target as HTMLElement).closest<HTMLElement>('.wh-item')
      const i = li ? items.indexOf(li) : -1
      stage.scrollLeft = 0
      if (i >= 0 && i !== idx && root.classList.contains('is-slide')) goto(i)
    }
    track.addEventListener('focusin', onFocus)

    let S = -1
    let pos = 0
    let shown = -1
    let sliding = false
    const tick = (_t?: number, deltaTime?: number) => {
      const r = root.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < -vh * 0.2) return
      const dt = Math.min(0.05, (deltaTime ?? 16.7) / 1000)
      /* the scroll in screens, on the glide, with a top speed */
      const want = Math.max(0, Math.min((r.height - vh) / vh, -r.top / vh))
      if (S < 0) S = want
      else {
        const stepTo = (want - S) * (1 - Math.exp(-dt / GLIDE))
        const cap = TOP_SPEED * dt
        S += Math.max(-cap, Math.min(cap, stepTo))
      }

      const g = drift(span(S, GROW))
      const ks = easeOut(span(S, SLIDE_IN))

      /* THE SLIDER: the band's project; the track glides to it */
      const on = S > SLIDE_IN[0]
      idx = Math.max(0, Math.min(N - 1, Math.floor((S - FIRST) / BAND)))
      pos += (idx - pos) * (1 - Math.exp(-dt / SLIDE))
      if (Math.abs(idx - pos) < 0.0004) pos = idx
      if (on !== sliding) {
        sliding = on
        root.classList.toggle('is-slide', on)
      }
      const hold = on ? idx : -1
      if (hold !== lock) {
        lock = hold
        /* the one dissolve: the reel goes to the new project's capture */
        if (lock >= 0 && of[at] !== lock) advance(true)
      }
      if (idx !== shown) {
        shown = idx
        items.forEach((it, i) => it.classList.toggle('is-on', i === idx))
        prevBtn.disabled = idx === 0
        nextBtn.disabled = idx === N - 1
      }
      cut = lock >= 0 ? CUT[2] : lerp(CUT[0], CUT[1], g)
      step(dt)

      /* the lean: toward the hand while the window is a window */
      const e = ent.v
      const y0 = w0.y + (1 - e) * 9 * unit
      let tx = 0
      let ty = 0
      if (px >= 0 && g < 0.04 && px > w0.x && px < w0.x + w0.w && py > r.top + y0 && py < r.top + y0 + w0.h) {
        tx = ((px - w0.x) / w0.w - 0.5) * 2
        ty = ((py - r.top - y0) / w0.h - 0.5) * 2
      }
      const f = 1 - Math.exp(-dt / 0.18)
      rx += (tx - rx) * f
      ry += (ty - ry) * f
      const leaning = Math.abs(rx) > 0.002 || Math.abs(ry) > 0.002
      /* the drift: against the hand while the slider is on */
      const dxTo = on && px >= 0 ? (px / W - 0.5) * 2 : 0
      const dyTo = on && px >= 0 ? (py / H - 0.5) * 2 : 0
      const fd = 1 - Math.exp(-dt / 0.32)
      mx += (dxTo - mx) * fd
      my += (dyTo - my) * fd

      const key = `${S.toFixed(4)}|${pos.toFixed(4)}|${mx.toFixed(3)}|${my.toFixed(3)}`
      if (key === wrote && !leaning && e >= 1) return
      wrote = key

      /* THE GROW: the frame, snapped to whole pixels */
      const x = Math.round(lerp(w0.x, 0, g))
      const y = Math.round(lerp(y0, 0, g))
      const w = Math.round(lerp(w0.w, W, g))
      const h = Math.round(lerp(w0.h, H, g))
      win.style.clipPath = g >= 1 ? 'none' : `inset(${y}px ${W - x - w}px ${Math.max(0, H - y - h)}px ${x}px round ${(w0.r * (1 - g)).toFixed(1)}px)`
      win.style.opacity = clamp01(e * 1.6).toFixed(3)
      win.style.transformOrigin = `${(x + w / 2).toFixed(0)}px ${(y + h / 2).toFixed(0)}px`
      win.style.transform = leaning ? `perspective(${(90 * unit).toFixed(0)}px) rotateY(${(rx * LEAN).toFixed(3)}deg) rotateX(${(-ry * LEAN).toFixed(3)}deg)` : ''
      shadow.style.left = `${x}px`
      shadow.style.top = `${y}px`
      shadow.style.width = `${w}px`
      shadow.style.height = `${h}px`
      shadow.style.opacity = (clamp01(e * 1.6) * (1 - clamp01(g * 2.5))).toFixed(3)
      /* the print grows with its frame; under the slider it drifts */
      const s = Math.max(w / cover.w, h / cover.h) * lerp(ZOOM, 1, g) * lerp(1, ZOOM_SLIDE, ks)
      const ox = x + w / 2 - W / 2 - mx * DRIFT * unit
      const oy = y + h / 2 - H / 2 - my * DRIFT * unit
      reelEl.style.transform = `translate3d(${ox.toFixed(1)}px, ${oy.toFixed(1)}px, 0) scale(${s.toFixed(5)})`
      shade.style.opacity = (span(S, SHADE) * 0.68).toFixed(3)

      /* the statement leaves up through its masks; the buttons go */
      if (e >= 1) {
        lns.forEach((ln, i) => {
          const k = easeOut(clamp01((S - LEAVE[0] - i * 0.048) / (LEAVE[1] - LEAVE[0])))
          ln.style.transform = k <= 0 ? '' : `translate3d(0, ${(-k * 112).toFixed(2)}%, 0)`
        })
        const a = 1 - clamp01((S - LEAVE[0]) / 0.19)
        acts.style.opacity = a.toFixed(3)
        acts.style.pointerEvents = a < 0.5 ? 'none' : ''
      }
      /* "selected", then "work" — up into place, then up and away */
      bigs.forEach((b, i) => {
        const k = easeOut(clamp01((S - BIG[0] - i * 0.12) / (BIG[1] - BIG[0] - 0.12)))
        const out = easeIn(clamp01((S - BIG_OUT[0] - i * 0.07) / (BIG_OUT[1] - BIG_OUT[0] - 0.07)))
        b.style.transform = `translate3d(0, ${((1 - k) * 108 - out * 108).toFixed(2)}%, 0)`
      })

      /* THE SLIDER comes: the names up through their mask, the filmstrip
         up over the fold, the arrows */
      track.style.transform = `translate3d(0, ${((1 - ks) * 118).toFixed(2)}%, 0)`
      items.forEach((it, i) => {
        const d = i - pos
        it.style.transform = `translate3d(${(d * SPACING * W).toFixed(1)}px, 0, 0) translate(-50%, 0)`
        it.style.setProperty('--wh-o', (DIM + (1 - DIM) * clamp01(1 - Math.abs(d))).toFixed(3))
      })
      strip.style.transform = `translate3d(${(-mx * DRIFT_STRIP * unit).toFixed(1)}px, ${((1 - ks) * 110).toFixed(2)}%, 0) translate(-50%, 0)`
      stripRow.style.transform = `translate3d(${(-pos * stripW).toFixed(1)}px, 0, 0)`
      arrows.style.opacity = ks.toFixed(3)
    }
    tick()
    gsap.ticker.add(tick)

    return () => {
      tl.kill()
      gsap.ticker.remove(tick)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onGone)
      prevBtn.removeEventListener('click', onPrev)
      nextBtn.removeEventListener('click', onNext)
      track.removeEventListener('click', onName)
      track.removeEventListener('focusin', onFocus)
      root.classList.remove('is-live', 'is-in', 'is-slide')
      ;[stage, win, reelEl, shade, shadow, acts, track, strip, stripRow, arrows, ...lns, ...bigs, ...items].forEach((el) => el.removeAttribute('style'))
      imgs.forEach((im) => im.classList.remove('is-on', 'is-prev', 'is-fade'))
      items.forEach((it) => it.classList.remove('is-on'))
    }
  }, [])

  return (
    <header ref={ref} className="wh" style={{ '--wh-n': projects.length } as React.CSSProperties}>
      <div className="wh-stage">
        <h1 className="wh-state">
          {lines.map((ln, i) => (
            <span key={i} className="wh-mask">
              <span className={`wh-ln wh-ent${i === lines.length - 1 ? ' wh-ln-ink' : ''}`}>
                {ln}
                {i < lines.length - 1 ? ' ' : ''}
              </span>
            </span>
          ))}
        </h1>

        <div className="wh-acts wh-ent">{children}</div>

        {/* THE WINDOW: the reel — decoration (the names below name the
            work); its shadow is a box of its own (a clip-path cuts
            shadows off) */}
        <i className="wh-shadow" aria-hidden="true" />
        <div className="wh-win k-dark" aria-hidden="true">
          <div className="wh-reel">
            {reel.map((f, i) => (
              <img
                key={f.src}
                className={`wh-f${i === 0 ? ' is-on' : ''}`}
                data-p={f.p}
                src={f.src}
                alt=""
                width={1900}
                height={1000}
                loading={i < 2 ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
              />
            ))}
          </div>
          <i className="wh-shade" />
        </div>

        {/* the title: decoration — the slider carries the real heading */}
        <p className="wh-big" aria-hidden="true">
          <span className="wh-big-m"><span className="wh-big-w">selected</span></span>
          <span className="wh-big-m"><span className="wh-big-w">work</span></span>
        </p>

        {/* THE SLIDER: the names (the page's links to the work), the
            filmstrip, the arrows */}
        <section className="wh-slide" id="work" aria-labelledby="wh-h">
          <h2 className="sr-only" id="wh-h">
            Selected work
          </h2>
          <div className="wh-track-m">
            <ul className="wh-track">
              {projects.map((p) => (
                <li key={p.slug} className="wh-item">
                  <a className="wh-name" href={p.href}>
                    <img className="wh-item-pic" src={p.image} alt="" width={1900} height={1000} loading="lazy" decoding="async" draggable={false} />
                    <span className="wh-name-t">{p.name}</span>
                    <span className="wh-meta">
                      <span className="wh-meta-a">
                        {p.service}, {p.year}
                      </span>
                      <span className="wh-meta-b" aria-hidden="true">
                        View case study
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
                          <path d="M2 8 L13 8" />
                          <path d="M9 4.5 L13 8 L9 11.5" />
                        </svg>
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* the filmstrip: a second way in to the project on show */}
          <div className="wh-strip" aria-hidden="true">
            <div className="wh-strip-in">
              <div className="wh-strip-row">
                {projects.map((p) => (
                  <a key={p.slug} className="wh-strip-f" href={p.href} tabIndex={-1}>
                    <img src={p.image} alt="" width={1900} height={1000} loading="lazy" decoding="async" draggable={false} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="wh-arrows">
            <button type="button" className="wh-arrow wh-arrow-prev" aria-label="Previous project">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                <path d="M14 8 L3 8" />
                <path d="M7 4.5 L3 8 L7 11.5" />
              </svg>
            </button>
            <button type="button" className="wh-arrow wh-arrow-next" aria-label="Next project">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                <path d="M2 8 L13 8" />
                <path d="M9 4.5 L13 8 L9 11.5" />
              </svg>
            </button>
          </div>
        </section>
      </div>
    </header>
  )
}
