'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, EASE } from '@/lib/motion-v4'

/**
 * THE SERVICE PAGE'S STAGE — the hero, the window, and the plate under one
 * scroll (2026-09-05, the user's two frames "Service Template Page.png" and
 * "Service Template Page (1).png").
 *
 * WHAT IT DOES. The hero holds a rounded picture in its right column. On
 * scroll that picture does not leave with the copy: it swells until it IS
 * the viewport, and the page's second movement — the display line and two
 * text beats — scrolls over the full-bleed plate for the next ~200svh. Then
 * the paper body rises over it (the §4-over-§3 burial, see service.css).
 *
 * HOW. The stage is `.sv`'s frame pattern extended: ONE sticky 100svh frame
 * (`.sp-frame`, margin-bottom −100svh, so it takes no flow height) holds
 * the plate image, and everything else — the hero content, the plate beats —
 * flows over it. The frame is CLIPPED by a `clip-path: inset(... round ...)`
 * that at rest equals the hero slot's rectangle exactly, so the frame IS the
 * picture in the slot; as the stage scrolls the insets lerp to zero and the
 * corner radii with them. The slot itself is a placeholder box holding the
 * real <img> (the LCP, in raw HTML, with the alt) — once the frame has drawn
 * its first clip the slot's copy goes visibility:hidden underneath.
 *
 * THE WINDOW SITS ABOVE THE HERO COPY (z 2 over 1). At rest the clip is the
 * slot so nothing is covered; as it grows the picture takes the copy the
 * way the peel's landed sheet takes §1 — nothing fades, nothing is
 * choreographed off-screen, the picture simply becomes the page. The plate
 * beats sit above the frame (z 3) so they read on it.
 *
 * THE CLOCK. p = stage scrolled / EXPAND, where EXPAND = the slot's offset
 * in the stage + 0.55vh: on desktop (slot ~22% down a 100svh hero) that is
 * ~0.8 of a viewport, on a phone (slot below the tagline and CTAs, hero
 * taller than the screen) it is whatever puts full-bleed just before the
 * first beat arrives. e = drift(p) — the scrubbed-scroll curve, the same as
 * every pin on the homepage. The rest rect is read LIVE from the slot each
 * tick (it scrolls with the hero), so the window's origin moves with the
 * page for the first pixels and the lerp takes over — there is no moment
 * where the picture is pinned while the text beside it scrolls, which is
 * where a hold would read as a hitch.
 *
 * THE PICTURE BREATHES: scale 1.12 → 1 over the expansion (the crop opens
 * as the frame does), then a slow 14vh drift down the plate's travel. The
 * scrim (`.sp-frame::after`) fades in with e, so the slot is bright and the
 * plate is graded — one image, two readings.
 *
 * FALLBACK IS THE LAYOUT. Without JS or under reduced motion the frame is
 * display:none, the slot shows its own <img>, and the plate section paints
 * the same picture as a CSS background (`--sp-plate` on the stage). Every
 * word is real DOM either way (SEO plan D5).
 *
 * MEASUREMENT: getBoundingClientRect on the SLOT is safe — nothing ever
 * transforms it. The frame is only ever written to, never measured.
 */

/** the expansion's runway beyond the slot's own offset, in viewport heights */
const EXPAND_VH = 0.55
/** the picture's rest scale — the crop it opens from */
const SCALE_REST = 1.12
/** the drift down the plate, in viewport heights; .sp-frame img is
 *  oversized by twice this so the edge never shows */
const DRIFT_VH = 7

export default function ServiceStage({
  children,
  plate,
}: {
  children: ReactNode
  /** the plate image — painted by CSS as the plate section's background
   *  when the frame is not running (no JS, reduced motion) */
  plate: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const stage = ref.current
    if (!stage) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const frame = stage.querySelector<HTMLElement>('.sp-frame')
    const img = frame?.querySelector<HTMLElement>('img')
    const slot = stage.querySelector<HTMLElement>('.sp-slot')
    if (!frame || !img || !slot) return

    stage.classList.add('is-scrub')
    if (img instanceof HTMLImageElement) img.decode().catch(() => {})

    /* the slot's corner radii, as the clip's rest state. Read once per
       measure from the computed style so the CSS owns the shape (desktop
       is a half-pill bleeding right, phones a smaller one). */
    let radii = [0, 0, 0, 0]
    let expand = 1
    const measure = () => {
      const cs = getComputedStyle(slot)
      radii = [
        parseFloat(cs.borderTopLeftRadius) || 0,
        parseFloat(cs.borderTopRightRadius) || 0,
        parseFloat(cs.borderBottomRightRadius) || 0,
        parseFloat(cs.borderBottomLeftRadius) || 0,
      ]
      // the slot's offset in the STAGE, transform-free: walk offsetParents
      let top = 0
      let el: HTMLElement | null = slot
      while (el && el !== stage) {
        top += el.offsetTop
        el = el.offsetParent as HTMLElement | null
      }
      expand = Math.max(top + window.innerHeight * EXPAND_VH, 1)
    }
    measure()
    window.addEventListener('resize', measure)

    let lastClip = ''
    let lastE = -1
    let live = false
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const tick = () => {
      const vh = window.innerHeight
      const vw = window.innerWidth
      const st = stage.getBoundingClientRect()
      if (st.bottom < -8) return
      const scrolled = Math.max(-st.top, 0)
      const p = Math.min(scrolled / expand, 1)
      const e = EASE.drift(p)

      // THE WINDOW. Rest = the slot's live rect; end = the viewport.
      let clip: string
      if (e >= 1) {
        clip = 'inset(0 0 0 0 round 0)'
      } else {
        const s = slot.getBoundingClientRect()
        const t = lerp(s.top, 0, e)
        const l = lerp(s.left, 0, e)
        const r = lerp(vw - s.right, 0, e)
        const b = lerp(vh - s.bottom, 0, e)
        const rad = radii.map((x) => (x * (1 - e)).toFixed(2) + 'px').join(' ')
        clip = `inset(${t.toFixed(2)}px ${Math.max(r, 0).toFixed(2)}px ${b.toFixed(2)}px ${l.toFixed(2)}px round ${rad})`
      }
      if (clip !== lastClip) {
        lastClip = clip
        frame.style.clipPath = clip
      }

      // THE PICTURE: opens as the frame does, then drifts down the plate
      const q = Math.min(Math.max((scrolled - expand) / Math.max(st.height - expand - vh, 1), 0), 1)
      const scale = lerp(SCALE_REST, 1, e)
      const y = (DRIFT_VH - 2 * DRIFT_VH * q) * (vh / 100)
      gsap.set(img, { scale, y })

      if (Math.abs(e - lastE) > 0.002) {
        lastE = e
        frame.style.setProperty('--sp-e', e.toFixed(3))
      }
      if (!live) {
        live = true
        stage.classList.add('is-live')
      }
    }

    // a frame after mount, so layout has settled and the first clip is
    // measured off the real slot rect, not a mid-hydration one
    const start = requestAnimationFrame(() => gsap.ticker.add(tick))
    return () => {
      cancelAnimationFrame(start)
      gsap.ticker.remove(tick)
      window.removeEventListener('resize', measure)
      stage.classList.remove('is-scrub', 'is-live')
    }
  }, [])

  return (
    <div
      ref={ref}
      className="sp-stage"
      style={{ '--sp-plate': `url(${plate})` } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
