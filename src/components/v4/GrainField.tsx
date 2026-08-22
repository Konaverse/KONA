'use client'

import { useEffect } from 'react'
import { gsap } from '@/lib/motion-v4'

/**
 * THE GRAIN'S DEPTH — one fixed layer, two grounds.
 *
 * The pivot gave the dark polarity its own grain value, because noise carries
 * further on a near-black ground than on paper and tech noir wants it to. But
 * `.k-grain` is ONE fixed, pointer-events-none layer at the root, deliberately
 * outside every section — that is the rule that keeps it cheap, and it is
 * exactly why a section-scoped `--grain-opacity` cannot reach it. A section
 * says "I am dark" and the layer that would answer is not listening.
 *
 * This is the ear. It asks, every frame, HOW MUCH OF THE VIEWPORT IS CURRENTLY
 * DARK GROUND, and lerps the root's grain between the two values by that
 * fraction. Consequences worth stating:
 *
 *  - It is a SCRUB, not a toggle. A class flipped at a threshold would pop the
 *    grain a full step mid-scroll; coverage is continuous, so the texture
 *    thickens as the dark ground arrives and thins as it leaves. Nobody should
 *    ever be able to name the moment it changed.
 *  - The SIGNAL IS `.k-dark` ITSELF. No second annotation to keep in sync: a
 *    section that declares its polarity has already declared its grain, and
 *    anything that becomes dark later is picked up for free.
 *  - BOTH VALUES ARE READ FROM CSS, not duplicated here. tokens.css stays the
 *    only place the numbers live — the light one off `.k-root`, the dark one
 *    off a throwaway `.k-dark` probe measured once at mount.
 *
 * Cost: a handful of getBoundingClientRect reads on one ticker, and one custom
 * property write only when the value actually moves. The element list is
 * re-queried on a slow cadence rather than every frame, because `.k-dark` is
 * added at runtime in at least one place (HeroPeel marks the claim's card when
 * the GL sheet lands on it).
 *
 * Reduced motion: this still runs. Grain depth is not motion — it is the page
 * matching its own texture to its own ground — and freezing it would leave the
 * dark sections wearing the paper value.
 * No JS: the CSS default stands, which is the light value. Correct by default.
 */
export default function GrainField() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.k-root')
    if (!root) return

    /* read the light value BEFORE anything is written inline, or we would be
       reading our own output back a frame later */
    const LIGHT = parseFloat(getComputedStyle(root).getPropertyValue('--grain-opacity')) || 0.14

    /* the dark value, measured off the real class rather than copied out of
       tokens.css by hand */
    const probe = document.createElement('div')
    probe.className = 'k-dark'
    probe.style.cssText = 'position:absolute;left:-9999px;width:0;height:0;visibility:hidden'
    root.appendChild(probe)
    const DARK = parseFloat(getComputedStyle(probe).getPropertyValue('--grain-opacity')) || LIGHT
    probe.remove()

    if (DARK === LIGHT) return

    let els: HTMLElement[] = []
    const refresh = () => {
      els = Array.from(document.querySelectorAll<HTMLElement>('.k-dark'))
    }
    refresh()

    let frame = 0
    let last = -1

    const tick = () => {
      if (frame++ % 20 === 0) refresh()
      if (!els.length) {
        if (last !== LIGHT) {
          last = LIGHT
          root.style.setProperty('--grain-opacity', String(LIGHT))
        }
        return
      }

      const vh = window.innerHeight
      const vw = window.innerWidth
      let cover = 0

      for (let i = 0; i < els.length; i++) {
        const r = els[i].getBoundingClientRect()
        if (r.bottom <= 0 || r.top >= vh || r.width < 1 || r.height < 1) continue
        /* area of the viewport this ground actually occupies, both axes: a
           narrow dark card should not claim the grain of a full-bleed one */
        const v = (Math.min(r.bottom, vh) - Math.max(r.top, 0)) / vh
        const h = (Math.min(r.right, vw) - Math.max(r.left, 0)) / vw
        cover += v * h
      }

      cover = cover > 1 ? 1 : cover
      const next = LIGHT + (DARK - LIGHT) * cover
      /* only write when it moves enough to see — a custom property write
         invalidates paint on the grain layer */
      if (Math.abs(next - last) < 0.002) return
      last = next
      root.style.setProperty('--grain-opacity', next.toFixed(3))
    }

    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      root.style.removeProperty('--grain-opacity')
    }
  }, [])

  return null
}
