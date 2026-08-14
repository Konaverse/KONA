'use client'

import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer } from '@react-three/postprocessing'
import Fluid from './fluid/Fluid'

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
 * MOUNTED ONLY WHERE IT EARNS ITS COST: skipped entirely on touch (no pointer
 * to push the fluid) and under reduced motion. Mounting is deferred to an
 * effect so the WebGL context is never created during SSR or on a machine that
 * will not use it.
 */
export default function FluidCursor({
  color = '#7FA8C9',
  zIndex = 55,
}: {
  color?: string
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
      // low dpr on purpose — the simulation runs at 50px resolution and is
      // upscaled, so pixel density buys nothing here and costs a lot
      dpr={[0.1, 0.5]}
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
        <Fluid color={color} />
      </EffectComposer>
    </Canvas>
  )
}
