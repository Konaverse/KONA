'use client'

import { Canvas } from '@react-three/fiber'
import { EffectComposer } from '@react-three/postprocessing'
import Fluid from './fluid/Fluid'
import { MONO_PALETTE, type FluidPalette } from './fluid/FluidEffect'

/**
 * THE FLUID CURSOR'S CANVAS — the heavy half (three, react-three-fiber,
 * postprocessing), split out of FluidCursor.tsx on 2026-10-03 (SEO plan v3
 * performance pass). FluidCursor imports this with next/dynamic only once it
 * has decided to run the trail, so phones, reduced motion and the first paint
 * never download or parse WebGL code. Everything about the look is still
 * documented in FluidCursor.tsx.
 */
export default function FluidCanvas({
  palette = MONO_PALETTE,
  intensity,
  fade,
  decay,
  zIndex,
  blend,
  paused,
}: {
  palette?: FluidPalette
  intensity: number
  fade: number
  decay?: number
  zIndex: number
  blend: 'difference' | 'exclusion'
  paused: boolean
}) {
  return (
    <Canvas
      flat
      linear
      // The source project ran this at [0.1, 0.5] — a tenth of native, upscaled
      // ten times, which reads as atmosphere on a dark page. Raised to [0.5, 1]
      // when the trail had to survive `multiply` on white, and KEPT there under
      // difference: the core is a hard inversion now, and a hard edge upscaled
      // ten times is a visibly blocky one. Still under native, so still cheap.
      dpr={[0.5, 1]}
      frameloop={paused ? 'never' : 'always'}
      gl={{ antialias: false, stencil: false, depth: false }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex,
        pointerEvents: 'none',
        mixBlendMode: blend,
        // BLACK, and it must be exactly black: difference with 0 is the
        // identity, so this is what makes the page show through untouched
        // everywhere the trail is not.
        background: 'black',
        opacity: paused ? 0 : 1,
        transition: 'opacity 0.25s ease',
      }}
      aria-hidden="true"
    >
      <EffectComposer>
        <Fluid palette={palette} intensity={intensity} fade={fade} decay={decay} />
      </EffectComposer>
    </Canvas>
  )
}
