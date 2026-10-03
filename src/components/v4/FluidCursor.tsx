'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
/* TYPE ONLY: FluidEffect.ts imports three and postprocessing, so a value
   import here would pull them back into every page */
import type { FluidPalette } from './fluid/FluidEffect'

/* the WebGL half arrives only when the trail will actually run (see
   FluidCanvas.tsx) — never on touch, never under reduced motion, never
   before the page has painted */
const FluidCanvas = dynamic(() => import('./FluidCanvas'), { ssr: false })

/**
 * FLUID CURSOR — the trail that inverts what it touches.
 *
 * A full-viewport WebGL canvas sitting over the page, running a Navier-Stokes
 * simulation that the pointer pushes around. Ported from giats-portfolio.
 *
 * COMPOSITING, and it is the whole design. This shipped as `multiply` over a
 * white canvas because Whiteout was all white and difference would have turned
 * a pale blue trail muddy orange. THE MONOCHROME PIVOT PUTS DIFFERENCE BACK
 * (2026-08-22, user direction), which is what the port always used.
 *
 * Difference is |backdrop - source|, and that single operation covers every
 * behaviour the direction asks for, with no per-surface code anywhere:
 *
 *   · black where there is no fluid is a NO-OP, so the page is untouched at rest
 *   · a white core FLIPS whatever is under it — dark on paper, light on void,
 *     and nothing had to detect which one it was over
 *   · TEXT under the trail inverts with the ground it sits on, because
 *     difference sees the composited result, not the section
 *   · PHOTOGRAPHY and VIDEO go to negative per pixel, which is why the trail
 *     reads differently over an image than over a flat ground for free
 *
 * WHAT THIS DEPENDS ON, and it is the fragile part: `mix-blend-mode` blends
 * against the backdrop inside the nearest ancestor stacking context. The canvas
 * is a direct child of `.k-root`, which is deliberately NOT a stacking context
 * (no opacity, transform, filter or isolation on it), so the trail blends
 * against the whole page beneath it. Put `isolation: isolate` — or an opacity,
 * transform or filter — on `.k-root` or on any wrapper between it and this
 * canvas, and the effect silently becomes a black rectangle doing nothing.
 *
 * PERSISTENCE is the other thing that had to change. Presence and duration were
 * COUPLED: the only levers for a stronger trail were more dye and slower decay,
 * and both of them also made it last longer. The result was a trail still
 * reading as a 10% tint on white almost four seconds after the pointer stopped.
 *
 * The `fade` floor breaks the coupling. It gives the tail a defined end instead
 * of an asymptote, so gain can be raised without buying time along with it.
 * Decay then drops 0.982 -> 0.95 and gain rises 30 -> 55 to hold the peak: the
 * trail now saturates exactly as hard as before and is gone in 0.70s.
 *
 * MOUNTED ONLY WHERE IT EARNS ITS COST: skipped entirely on touch (no pointer
 * to push the fluid) and under reduced motion. Mounting is deferred to an
 * effect so the WebGL context is never created during SSR or on a machine that
 * will not use it.
 */
export default function FluidCursor({
  palette,
  /** Density-to-colour gain. Raise to make the trail read STRONGER. */
  intensity = 55,
  /** Density floor. Raise to make the trail END SOONER — below it nothing is
   *  painted at all, so the tail stops rather than fading forever. */
  fade = 0.08,
  /** Per-frame dye decay. Raise to make the trail LAST LONGER; it is
   *  exponential, so 0.982 is a 0.64s half-life and 0.95 is 0.23s. */
  decay,
  zIndex = 55,
  /** `difference` is the house setting. `exclusion` is the same idea with the
   *  mid-tones pulled toward grey instead of flipping hard, kept as a one-word
   *  comparison rather than a second design. */
  blend = 'difference',
}: {
  palette?: FluidPalette
  intensity?: number
  fade?: number
  decay?: number
  zIndex?: number
  blend?: 'difference' | 'exclusion'
}) {
  const [on, setOn] = useState(false)
  /* THE MENU'S FREEZE (UnderlayMenu, 2026-09-30): while the page is frozen
     under the menu the trail has nothing to do, and traced, this loop was
     the largest cost left in the menu's open. It stops (frameloop 'never')
     and the canvas fades, so no trail is left standing over the panel. */
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(hover: hover)').matches) return
    /* after the page has painted and gone quiet, so the WebGL download and
       shader compile never compete with the first paint (performance pass,
       2026-10-03) */
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback
    if (ric) {
      const id = ric(() => setOn(true), { timeout: 2500 })
      return () => (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(id)
    }
    const t = window.setTimeout(() => setOn(true), 1200)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    const onFreeze = (e: Event) => setPaused(Boolean((e as CustomEvent<boolean>).detail))
    window.addEventListener('k:freeze', onFreeze)
    return () => window.removeEventListener('k:freeze', onFreeze)
  }, [])

  if (!on) return null

  return (
    <FluidCanvas
      palette={palette}
      intensity={intensity}
      fade={fade}
      decay={decay}
      zIndex={zIndex}
      blend={blend}
      paused={paused}
    />
  )
}
