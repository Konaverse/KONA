'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion-v4'
import type { SheetProject } from '@/components/v4/ProjectSheets'
import { createFoldGL } from '@/components/v4/fold-gl'
import { getLenis } from '@/components/v4/SmoothScroll'

/**
 * §5 ON DESKTOP — THE WHEEL (2026-08-26, the user's wireframe, image.png:
 * "one pinned viewport section with the pinned names of the project on
 * kind of a circular smooth scroll movement. The website image will change
 * by folding with the fold functionality we have on the hero. Below we'll
 * have the description. Also on the title we have some inline images."
 * Brief: premium, coordinated, elevate it.)
 *
 * ONE PINNED VIEWPORT. Title "Selected [three tiles] work" — the hero's
 * inline pill, carrying the three captures as tiles, the lit tile being the
 * project on screen. LEFT: the names on a WHEEL — a rolodex seen side-on,
 * axis to the right, the active name at the wheel's leftmost point, full
 * ink; the others sit above and below it, HORIZONTAL, indented right the
 * further they are (a shallow arc, not a tilt — the user's second pair of
 * wireframes), receding in ink; a hairline dash is STUCK beside the active
 * slot. RIGHT: one window at the captures' own 2880×2000 aspect. It
 * changes by FOLDING — the hero peel's own fold (fold-gl.ts, shared with
 * the phone deck): the top sheet is grabbed by its top-right corner, folds
 * away and carries off through the bottom-left, the next project already
 * underneath. Under the window: the counter, "Visit site", and the
 * description, which does not fade — it RESOLVES, the house reveal: the
 * outgoing line lifts and blurs out, the incoming one arrives displaced
 * and blurred and settles to ink, through a short dark beat at the crease.
 *
 * THE VEIL. At rest the capture sits under a treatment — pulled to mono,
 * film grain, a faint scanline, a vignette — a screen that is off. Hover
 * the window and the veil lifts: colour returns, the grain clears, the
 * site is lit. (The fold shader takes the same mono pull so a sheet
 * folding mid-hover matches whatever the veil is doing.) Click visits.
 *
 * ONE CLOCK. Scroll through the pin is time; t = which project and how far
 * into its turn. The wheel turns continuously with t, the fold runs across
 * each turn, the description swaps at the crease, the counter, the visit
 * link, the tiles and the window's href follow the project that owns the
 * screen. The ARRIVAL is the approach: title, names, window and foot
 * resolve in (blur + shift, the house signature) while the section's top
 * climbs the viewport, whole by the time it pins; a short LEAD holds the
 * first project before its turn and a TAIL rests the last before release.
 * Clicking a name scrolls the page to that project's rest (Lenis).
 *
 * DISCIPLINE. One gsap.ticker subscription, one frame after mount so it
 * runs after Lenis. Writes: transform/opacity, the descriptions' blur
 * (small text, a few frames per swap), the entrance's blur on the title
 * (once). The GL canvas draws ONLY mid-turn; at rest the pixels are DOM.
 * Textures are the DOM <img>s, uploaded once each as they load.
 *
 * FALLBACKS. The markup is a plain layout: title, a list of names, the
 * first capture in the window, all three descriptions in flow — every word
 * real DOM text (SEO D5). `.is-scrub` (the driver) is what pins and stacks.
 * Reduced motion, no JS, and phones (WorkDeck owns §5 under 57.5rem; this
 * is display:none there and returns early) get the plain layout.
 */

/** viewport-heights of hold before the first turn, and of rest after the last */
const LEAD = 0.3
const TAIL = 0.35
/** the arrival: the section resolves in while its top climbs this much of the viewport */
const APPROACH = 0.8
/** the wheel (2026-08-26, second cut off the user's two wireframes): the
 *  names stay HORIZONTAL and stack in a column that scrolls through a fixed
 *  active slot — the active name leftmost, the others indented right the
 *  further they are, on a shallow arc. Row pitch in em of the name's own
 *  size; indent in rem per step; the arc's curvature. */
const ROW_EM = 1.75
const INDENT_REM = 2.4
const CURVE = 0.18
/** the house reveal numbers */
const BLUR = 14
const SHIFT = 18
/** where in a turn the screen changes owner — the fold's visual midpoint
 *  (its hinge sweep is front-loaded: every corner is released by ~0.44) */
const CREASE = 0.45

const pad2 = (i: number) => String(i).padStart(2, '0')
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

export default function WorkWheel({ projects }: { projects: SheetProject[] }) {
  const rootRef = useRef<HTMLElement | null>(null)
  const n = projects.length

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    /* phones: WorkDeck owns §5 and this section is display:none */
    if (getComputedStyle(root).display === 'none') return
    if (n < 2) return

    const stage = root.querySelector<HTMLElement>('.ww-stage')
    const title = root.querySelector<HTMLElement>('.ww-title')
    const names = Array.from(root.querySelectorAll<HTMLElement>('.ww-name'))
    const dash = root.querySelector<HTMLElement>('.ww-dash')
    const win = root.querySelector<HTMLAnchorElement>('.ww-win')
    const sheets = Array.from(root.querySelectorAll<HTMLElement>('.ww-sheet'))
    const imgs = sheets.map((s) => s.querySelector<HTMLImageElement>('img'))
    const canvas = root.querySelector<HTMLCanvasElement>('.ww-gl')
    const foot = root.querySelector<HTMLElement>('.ww-foot')
    const descs = Array.from(root.querySelectorAll<HTMLElement>('.ww-desc'))
    const visit = root.querySelector<HTMLAnchorElement>('.ww-visit')
    const idxEl = root.querySelector<HTMLElement>('.ww-idx')
    const tiles = Array.from(root.querySelectorAll<HTMLElement>('.ww-tile'))
    if (!stage || !win || names.length !== n || sheets.length !== n) return

    const T = LEAD + (n - 1) + TAIL
    root.classList.add('is-scrub')
    root.style.height = `${(1 + T) * 100}vh`

    /* ---- the fold */
    const gl = canvas ? createFoldGL(canvas, n) : null
    const ready: boolean[] = []
    const ensure = (i: number) => {
      if (!gl || ready[i]) return !!ready[i]
      const im = imgs[i]
      if (im && im.complete && im.naturalWidth > 0) ready[i] = gl.upload(i, im)
      return !!ready[i]
    }
    const onLoad = imgs.map((im, i) => {
      const fn = () => ensure(i)
      im?.addEventListener('load', fn, { once: true })
      return fn
    })
    const radius = parseFloat(getComputedStyle(win).borderTopLeftRadius) || 0

    /* ---- the veil: hot is lerped on the ticker so the fold shader can
       take the same mono pull the CSS transition is giving the DOM */
    let hotTarget = 0
    let hot = 0
    const onEnter = () => {
      hotTarget = 1
      win.classList.add('is-hot')
    }
    const onLeave = () => {
      hotTarget = 0
      win.classList.remove('is-hot')
    }
    win.addEventListener('pointerenter', onEnter)
    win.addEventListener('pointerleave', onLeave)

    /* ---- names scroll to their project's rest */
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    /* the wheel's geometry, from the names themselves: the row pitch off
       their font size, the dash parked past the widest of them */
    const nameFs = parseFloat(getComputedStyle(names[0]).fontSize) || 40
    const ROW = ROW_EM * nameFs
    const INDENT = INDENT_REM * rem
    if (dash) {
      const widest = Math.max(...names.map((el) => el.getBoundingClientRect().width))
      dash.style.left = `${(widest + 0.55 * nameFs).toFixed(1)}px`
    }
    const goTo = (i: number) => {
      const top = root.getBoundingClientRect().top + window.scrollY
      const y = top + (LEAD + i) * window.innerHeight
      const lenis = getLenis()
      if (lenis) lenis.scrollTo(y, { duration: 1.4 })
      else window.scrollTo({ top: y, behavior: 'smooth' })
    }
    const clicks = names.map((el, i) => {
      const fn = () => goTo(i)
      el.addEventListener('click', fn)
      return fn
    })

    /* ---- per-frame state */
    let lastA = -1
    let lastT = -1
    let lastK = -1
    let lastE = -1
    let lastCur = -1
    let lastHot = -1
    let drawn = false

    const setEntrance = (a: number) => {
      if (a === lastA) return
      lastA = a
      const resolve = (el: HTMLElement | null, from: number, span: number, blur = true) => {
        if (!el) return
        const u = clamp01((a - from) / span)
        const eased = 1 - Math.pow(1 - u, 3)
        el.style.opacity = eased.toFixed(3)
        el.style.transform = u >= 1 ? '' : `translate3d(0, ${((1 - eased) * SHIFT).toFixed(1)}px, 0)`
        if (blur) el.style.filter = u >= 1 ? '' : `blur(${((1 - eased) * BLUR).toFixed(1)}px)`
      }
      resolve(title, 0.0, 0.5)
      /* the names carry the wheel's transform, so the arrival rides in two
         variables the CSS composes with it rather than an inline transform */
      names.forEach((el, i) => {
        const u = clamp01((a - (0.12 + i * 0.1)) / 0.5)
        const eased = 1 - Math.pow(1 - u, 3)
        el.style.setProperty('--eo', eased.toFixed(3))
        el.style.setProperty('--ey', `${((1 - eased) * SHIFT * 1.6).toFixed(1)}px`)
      })
      /* the window: no blur on a picture this size — it rises and lights */
      resolve(win, 0.08, 0.7, false)
      resolve(foot, 0.4, 0.55)
    }

    const setWheel = (t: number) => {
      if (t === lastT) return
      lastT = t
      names.forEach((el, i) => {
        const d = i - t
        const ad = Math.abs(d)
        /* the column scrolls through the slot; the indent grows with the
           distance on a shallow arc — never a tilt */
        const x = INDENT * (ad + CURVE * ad * ad)
        const y = d * ROW
        el.style.setProperty('--wx', `${x.toFixed(2)}px`)
        el.style.setProperty('--wy', `${y.toFixed(2)}px`)
        el.style.setProperty('--wo', (1 - 0.7 * Math.min(1, ad)).toFixed(3))
        el.classList.toggle('is-on', ad < 0.5)
      })
    }

    const setFold = (k: number, e: number) => {
      if (k === lastK && e === lastE && hot === lastHot) return
      const folding = !!gl && e > 0 && e < 1
      if (k !== lastK || e !== lastE) {
        sheets.forEach((sh, i) => {
          sh.classList.toggle('is-gone', i < k || (i === k && e >= 1))
          sh.classList.toggle('is-fold', i === k && folding)
        })
      }
      if (gl) {
        if (folding && ensure(k)) {
          gl.draw(k, e, radius, 1 - hot)
          drawn = true
        } else if (drawn) {
          gl.clear()
          drawn = false
        }
      }
      lastK = k
      lastE = e
      lastHot = hot
    }

    let lastDescT = -1
    const setDescs = (t: number) => {
      if (t === lastDescT) return
      lastDescT = t
      descs.forEach((d, i) => {
        const dd = t - i
        const ad = Math.abs(dd)
        /* holds through the first tenth of its turn, gone by 0.45, the next
           fully in by 0.55 — a dark beat at the crease, never two halves */
        const op = 1 - clamp01((ad - 0.1) / 0.35)
        const eased = op * op * (3 - 2 * op)
        d.style.opacity = eased.toFixed(3)
        d.style.transform = `translate3d(0, ${(-dd * SHIFT).toFixed(1)}px, 0)`
        d.style.filter = op >= 1 ? '' : `blur(${((1 - eased) * BLUR).toFixed(1)}px)`
        d.style.visibility = op <= 0 ? 'hidden' : ''
      })
    }

    const setCurrent = (cur: number) => {
      if (cur === lastCur) return
      lastCur = cur
      const p = projects[cur]
      if (idxEl) idxEl.textContent = `${pad2(cur + 1)} / ${pad2(n)}`
      if (visit) visit.href = p.href
      win.href = p.href
      win.setAttribute('aria-label', `${p.title} — visit the site`)
      tiles.forEach((tile, i) => tile.classList.toggle('is-lit', i === cur))
    }

    const update = () => {
      const rect = root.getBoundingClientRect()
      const vh = window.innerHeight
      const span = rect.height - vh
      if (span <= 0) return
      if (rect.bottom < -50 || rect.top > vh + 50) return
      const u = clamp01(-rect.top / span) * T

      /* the veil's lerp, before anything reads it */
      if (Math.abs(hotTarget - hot) > 0.001) hot += (hotTarget - hot) * 0.1
      else hot = hotTarget

      /* the arrival is the approach: everything resolves in while the
         section's top climbs the viewport, and is whole by the pin */
      setEntrance(rect.top <= 0 ? 1 : clamp01((vh - rect.top) / (vh * APPROACH)))
      const t = gsap.utils.clamp(0, n - 1, u - LEAD)
      const k = Math.min(n - 2, Math.floor(t))
      const e = clamp01(t - k)
      setWheel(t)
      setFold(k, e)
      setDescs(t)
      setCurrent(e < CREASE ? k : k + 1)
    }
    /* one frame late on purpose — after Lenis in the ticker */
    const rafId = requestAnimationFrame(() => gsap.ticker.add(update))

    return () => {
      cancelAnimationFrame(rafId)
      gsap.ticker.remove(update)
      imgs.forEach((im, i) => im?.removeEventListener('load', onLoad[i]))
      names.forEach((el, i) => el.removeEventListener('click', clicks[i]))
      win.removeEventListener('pointerenter', onEnter)
      win.removeEventListener('pointerleave', onLeave)
      root.classList.remove('is-scrub')
      root.style.height = ''
      ;[title, win, foot, ...names, ...descs].forEach((el) => {
        if (!el) return
        el.style.opacity = ''
        el.style.transform = ''
        el.style.filter = ''
        el.style.visibility = ''
      })
      names.forEach((el) => el.classList.remove('is-on'))
      sheets.forEach((sh) => sh.classList.remove('is-gone', 'is-fold'))
      win.classList.remove('is-hot')
    }
  }, [n, projects])

  return (
    <section ref={rootRef} className="ww k-dark" aria-label="Selected work">
      <div className="ww-stage">
        <h2 className="ww-title t-h1">
          <span className="ww-t">Selected</span>
          {/* the hero's inline pill, carrying the three captures as tiles;
              the lit one is the project on screen */}
          <span className="ww-pill" aria-hidden="true">
            {projects.map((p, i) => (
              <span className={`ww-tile${i === 0 ? ' is-lit' : ''}`} key={p.title}>
                {p.image && (
                  <img src={p.image.replace(/\.webp$/, '-1080.webp')} alt="" decoding="async" />
                )}
              </span>
            ))}
          </span>
          <span className="ww-t">
            <em>work</em>
          </span>
        </h2>

        <div className="ww-grid">
          {/* THE WHEEL — the names. Buttons: each scrolls the page to its
              project's rest; the window is the link out. */}
          <div className="ww-wheel">
            {projects.map((p, i) => (
              <button
                key={p.title}
                type="button"
                className={`ww-name t-h2${i === 0 ? ' is-on' : ''}`}
                aria-label={`Show ${p.title}`}
              >
                {p.title}
              </button>
            ))}
            {/* the dash: stuck beside the active slot, never moves */}
            <i className="ww-dash" aria-hidden="true" />
          </div>

          <div className="ww-right">
            {/* THE WINDOW — the live site, in a new tab. The sheets stack
                inside it, first on top; the canvas draws the fold over
                them mid-turn; the veil rests over everything and lifts on
                hover. */}
            <a
              className="ww-win"
              href={projects[0].href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${projects[0].title} — visit the site`}
            >
              {projects.map((p, i) => (
                <span className="ww-sheet" key={p.title} style={{ zIndex: n - i }}>
                  {p.image && (
                    /* eager: each is one turn from being the fold's texture */
                    <img
                      src={p.image}
                      srcSet={`${p.image.replace(/\.webp$/, '-1600.webp')} 1600w, ${p.image} 2880w`}
                      sizes="60vw"
                      alt=""
                      decoding="async"
                    />
                  )}
                </span>
              ))}
              <canvas className="ww-gl" aria-hidden="true" style={{ zIndex: n + 1 }} />
              <span className="ww-veil" aria-hidden="true" style={{ zIndex: n + 2 }} />
            </a>

            <div className="ww-foot">
              <div className="ww-meta t-small">
                <span className="ww-idx" aria-hidden="true">
                  {pad2(1)} / {pad2(n)}
                </span>
                <a className="ww-visit" href={projects[0].href} target="_blank" rel="noreferrer">
                  Visit site <span aria-hidden="true">↗</span>
                </a>
              </div>
              <div className="ww-descs">
                {projects.map((p) => (
                  <p className="ww-desc t-body" key={p.title}>
                    {p.line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
