'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion-v4'
import type { SheetProject } from '@/components/v4/ProjectSheets'
import { createFoldGL } from '@/components/v4/fold-gl'

/**
 * §5 ON PHONES — THE FOLD DECK (2026-08-26, user-chosen over "the scan"
 * and "the film strip"; the brief: "something fascinating and different
 * and more usable … surely not one viewport each project because websites
 * are landscape and the viewport on mobile is portrait").
 *
 * The desktop page-turn (ProjectSheets) turns full-bleed portrait sheets
 * over each other, and the captures are 2880x2000 laptop frames — on a
 * phone every sheet was a landscape site cropped to a tall slot with most
 * of it lost. So under 57.5rem this section replaces it (ProjectSheets is
 * display:none there and returns early; this one is the reverse — the two
 * share the `#work` wrapper in page.tsx).
 *
 * THE MOVE IS OURS. One pinned LANDSCAPE window at the capture's own
 * aspect, so nothing is cropped; the three projects are stacked in it,
 * first on top. As you scroll, the top sheet is grabbed by its top-right
 * corner and FOLDS AWAY — the hero peel's eight-corner clock, the same w
 * field, the same reflect-past-the-hinge fold, the same ripple — and the
 * folded bundle carries off through the bottom-left corner, revealing the
 * next project underneath. Under the window the caption resolves per
 * project; a counter keeps the place. Whole window = the live site.
 *
 * MECHANICS
 * - Progress p = scroll through the section; t = p × (n − 1) is which
 *   turn (k = floor) and how far (e = frac). Sheet k folds at uShow = e;
 *   sheets before k are gone, sheets after k sit underneath in DOM order.
 * - The GL canvas sits exactly over the window (same grid cell, same
 *   width, same aspect, same radius). It draws ONLY mid-turn: at e = 0 the
 *   DOM sheet shows, at 0 < e < 1 that sheet goes visibility:hidden and the
 *   canvas draws its texture folding, at e ≥ 1 the sheet stays hidden and
 *   the canvas clears. So at rest the pixels are always DOM.
 * - Textures are the DOM <img> elements themselves (srcset-picked),
 *   uploaded once each as they finish loading; a turn whose texture is
 *   not ready yet just waits for it (retried per frame).
 * - The shader (fold-gl.ts, shared with the desktop section) is a trimmed sibling of HeroPeel's: no landing, no
 *   opening morph, no stretch — those belong to a sheet becoming another
 *   section's background. What is kept is the choreography: fold field,
 *   hinge sweep, theta, back-face grade, ripple. If the hero's fold
 *   character is ever retuned, retune here too.
 * - Scrub, not playback: every value is a pure function of scroll (Lenis
 *   smooths the scroll on wheel; touch is native), read one frame after
 *   Lenis on the ticker like every other scrubbed section.
 *
 * FALLBACKS. Without JS / with reduced motion the section is a plain
 * vertical list — window, caption, window, caption — which is what the
 * markup IS; `.is-scrub` (added by the driver) is what stacks it and pins
 * it. Without WebGL the driver still runs: the stack, the counter and the
 * captions work, and a turn is a hard cut at its end instead of a fold.
 * All copy is real DOM text (SEO D5).
 */

/** scroll length of one turn, in small-viewport heights */
const TURN_SVH = 80

const pad2 = (n: number) => String(n).padStart(2, '0')

export default function WorkFold({ projects }: { projects: SheetProject[] }) {
  const rootRef = useRef<HTMLElement | null>(null)
  const n = projects.length

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    /* desktop: ProjectSheets owns §5 and this section is display:none */
    if (getComputedStyle(root).display === 'none') return

    const items = Array.from(root.querySelectorAll<HTMLElement>('.wf-item'))
    if (items.length < 2) return
    const imgs = items.map((it) => it.querySelector<HTMLImageElement>('img'))
    const caps = items.map((it) => it.querySelector<HTMLElement>('.wf-cap'))
    const idxEl = root.querySelector<HTMLElement>('.wf-idx')
    const canvas = root.querySelector<HTMLCanvasElement>('.wf-gl')
    const win = items[0].querySelector<HTMLElement>('.wf-win')
    const count = items.length

    root.classList.add('is-scrub')
    root.style.height = `${(count - 1) * TURN_SVH + 100}svh`

    const gl = canvas ? createFoldGL(canvas, count) : null
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
    /* the window's corner, as the shader's radius — a token, read once */
    const radius = win ? parseFloat(getComputedStyle(win).borderTopLeftRadius) || 0 : 0

    let lastK = -1
    let lastE = -1
    let lastIdx = -1
    let drawn = false

    const update = () => {
      const rect = root.getBoundingClientRect()
      const vh = window.innerHeight
      const span = rect.height - vh
      if (span <= 0) return
      if (rect.bottom < -50 || rect.top > vh + 50) return
      const p = gsap.utils.clamp(0, 1, -rect.top / span)
      const t = p * (count - 1)
      const k = Math.min(count - 2, Math.floor(t))
      const e = gsap.utils.clamp(0, 1, t - k)
      if (k === lastK && e === lastE) return

      /* the stack: everything before k is gone; k is mid-fold (GL owns
         its pixels) or gone at the end of its turn; the rest wait under */
      const folding = !!gl && e > 0 && e < 1
      items.forEach((it, i) => {
        it.classList.toggle('is-gone', i < k || (i === k && e >= 1))
        it.classList.toggle('is-fold', i === k && folding)
      })

      /* captions: each one holds through the first tenth of its sheet's
         turn, is gone by 0.45, and the next is fully in by 0.55 of the
         way — they swap through a short dark beat at the crease, never
         both half-there on the same spot (they share one grid cell). It
         leaves upward, the next arrives from below. */
      caps.forEach((c, i) => {
        if (!c) return
        const d = gsap.utils.clamp(-1, 1, t - i)
        const op = 1 - gsap.utils.clamp(0, 1, (Math.abs(d) - 0.1) / 0.35)
        c.style.opacity = op.toFixed(3)
        c.style.transform = `translateY(${(-d * 14).toFixed(1)}px)`
        c.style.pointerEvents = op > 0.5 ? '' : 'none'
      })

      const cur = e < 0.5 ? k : k + 1
      if (cur !== lastIdx && idxEl) {
        lastIdx = cur
        idxEl.textContent = `${pad2(cur + 1)} / ${pad2(count)}`
      }

      if (gl) {
        if (folding && ensure(k)) {
          gl.draw(k, e, radius)
          drawn = true
        } else if (drawn) {
          gl.clear()
          drawn = false
        }
      }
      lastK = k
      lastE = e
    }
    /* one frame late on purpose — after Lenis in the ticker, so the rects
       are current-frame (the house lesson, see SolveCredits) */
    const rafId = requestAnimationFrame(() => gsap.ticker.add(update))

    return () => {
      cancelAnimationFrame(rafId)
      gsap.ticker.remove(update)
      imgs.forEach((im, i) => im?.removeEventListener('load', onLoad[i]))
      root.classList.remove('is-scrub')
      root.style.height = ''
      items.forEach((it) => it.classList.remove('is-gone', 'is-fold'))
      caps.forEach((c) => {
        if (!c) return
        c.style.opacity = ''
        c.style.transform = ''
        c.style.pointerEvents = ''
      })
    }
  }, [n])

  return (
    <section ref={rootRef} className="wf k-dark" aria-label="Selected work">
      <div className="wf-pin">
        <div className="wf-head">
          <span className="wf-label t-small">Selected work</span>
          <span className="wf-idx t-small" aria-hidden="true">
            {pad2(1)} / {pad2(n)}
          </span>
        </div>

        <div className="wf-stack">
          {projects.map((p, i) => (
            <div className="wf-item" key={p.title} style={{ zIndex: n - i }}>
              {/* the window IS the link. New tab: these are the live sites,
                  and on a phone leaving the page for one is losing it. */}
              <a
                className="wf-win"
                href={p.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${p.title} — visit the site`}
              >
                {p.image && (
                  /* eager, all of them: each is one turn away from being the
                     fold's texture, and the -1080 derivative is ~40KB */
                  <img
                    className="wf-img"
                    src={p.image}
                    srcSet={`${p.image.replace(/\.webp$/, '-1080.webp')} 1080w, ${p.image.replace(/\.webp$/, '-1600.webp')} 1600w, ${p.image} 2880w`}
                    sizes="92vw"
                    alt=""
                    decoding="async"
                  />
                )}
              </a>
              <div className="wf-cap">
                <span className="wf-name t-h2">{p.title}</span>
                <span className="wf-line t-body">{p.line}</span>
                <span className="wf-meta t-small">
                  <span>{p.year}</span>
                  <a className="wf-visit" href={p.href} target="_blank" rel="noreferrer">
                    Visit site <span aria-hidden="true">↗</span>
                  </a>
                </span>
              </div>
            </div>
          ))}

          {/* the fold, drawn over the window mid-turn; nothing at rest */}
          <canvas className="wf-gl" aria-hidden="true" style={{ zIndex: n + 1 }} />
        </div>
      </div>
    </section>
  )
}
