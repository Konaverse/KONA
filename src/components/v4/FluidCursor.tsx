'use client'

import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer } from '@react-three/postprocessing'
import Fluid from './fluid/Fluid'
import { ICE_PALETTE, type FluidPalette } from './fluid/FluidEffect'

/**
 * FLUID CURSOR — the ice trail.
 *
 * A full-viewport WebGL canvas sitting over the page, running a Navier-Stokes
 * simulation that the pointer pushes around. Ported from giats-portfolio.
 *
 * COMPOSITING is the part that had to change, and it is not a detail. The
 * original blends with `mix-blend-mode: difference` over a black canvas, which
 * is correct for a dark page: difference-with-black is a no-op, so the page
 * shows through and the fluid lightens it. On Whiteout that inverts — a pale
 * blue fluid over white would render muddy orange.
 *
 * So this composites with `multiply` over a white canvas instead. Multiply by
 * white is the no-op, so the page is untouched at rest, and where the fluid has
 * density it tints toward ice. Same idea, opposite polarity.
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
  palette = ICE_PALETTE,
  /** Density-to-colour gain. Raise to make the trail read STRONGER. */
  intensity = 55,
  /** Density floor. Raise to make the trail END SOONER — below it nothing is
   *  painted at all, so the tail stops rather than fading forever. */
  fade = 0.08,
  /** Per-frame dye decay. Raise to make the trail LAST LONGER; it is
   *  exponential, so 0.982 is a 0.64s half-life and 0.95 is 0.23s. */
  decay,
  zIndex = 55,
}: {
  palette?: FluidPalette
  intensity?: number
  fade?: number
  decay?: number
  zIndex?: number
}) {
  const [on, setOn] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(hover: hover)').matches) return
    setOn(true)
  }, [])

  if (!on) return null

  return (
    <Canvas
      flat
      linear
      // The source project ran this at [0.1, 0.5] — a tenth of native, upscaled
      // ten times. On a dark page blended with `difference` that softness reads
      // as atmosphere; on white through `multiply` it just smears the dye thin
      // and washes the colour out, which was the single biggest reason the
      // trail looked faint. Still well under native, so still cheap.
      dpr={[0.5, 1]}
      gl={{ antialias: false, stencil: false, depth: false }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex,
        pointerEvents: 'none',
        mixBlendMode: 'multiply',
        background: 'white',
      }}
      aria-hidden="true"
    >
      <EffectComposer>
        <Fluid palette={palette} intensity={intensity} fade={fade} decay={decay} />
      </EffectComposer>
    </Canvas>
  )
}
