'use client'

import { createRoot, extend, useThree, type RootStore } from '@react-three/fiber'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { EffectComposer } from '@react-three/postprocessing'
import { Group, Mesh, PlaneGeometry } from 'three'
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
type Props = {
  palette?: FluidPalette
  intensity: number
  fade: number
  decay?: number
  zIndex: number
  blend: 'difference' | 'exclusion'
  paused: boolean
}

// The standard Canvas registers the entire Three namespace. This scene only
// constructs these three JSX elements; keep the same renderer without shipping
// unrelated geometry, materials, helpers and animation classes in its catalog.
extend({ Group, Mesh, PlaneGeometry })

function FluidScene({ palette, intensity, fade, decay, paused }: Props) {
  const [ready, setReady] = useState(false)
  const setFrameloop = useThree(state => state.setFrameloop)
  const invalidate = useThree(state => state.invalidate)
  const compiled = useCallback(() => setReady(true), [])
  useLayoutEffect(() => {
    setFrameloop(paused || !ready ? 'never' : 'demand')
    if (ready && !paused) invalidate()
  }, [paused, ready, setFrameloop, invalidate])
  const fluid = useMemo(() => (
    <Fluid palette={palette} intensity={intensity} fade={fade} decay={decay} paused={paused} onReady={compiled} />
  ), [palette, intensity, fade, decay, paused, compiled])
  return <EffectComposer enabled={ready}>{fluid}</EffectComposer>
}

export default function FluidCanvas({
  palette = MONO_PALETTE,
  intensity,
  fade,
  decay,
  zIndex,
  blend,
  paused,
}: Props) {
  const host = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const root = useRef<ReturnType<typeof createRoot> | null>(null)
  const store = useRef<RootStore | null>(null)
  const scene = useMemo(() => (
    <FluidScene palette={palette} intensity={intensity} fade={fade} decay={decay} zIndex={zIndex} blend={blend} paused={paused} />
  ), [palette, intensity, fade, decay, zIndex, blend, paused])
  const latest = useRef(scene)
  useEffect(() => {
    latest.current = scene
    if (store.current) root.current?.render(scene)
  }, [scene])

  useEffect(() => {
    const element = canvas.current
    const wrapper = host.current
    if (!element || !wrapper) return
    let disposed = false
    const renderer = createRoot(element)
    root.current = renderer
    const resize = () => {
      if (disposed || !store.current) return
      const bounds = wrapper.getBoundingClientRect()
      const state = store.current.getState()
      state.setSize(bounds.width, bounds.height, bounds.top, bounds.left)
      state.setDpr([0.5, 1])
    }
    void renderer.configure({
      flat: true,
      linear: true,
      dpr: [0.5, 1],
      frameloop: 'never',
      gl: { antialias: false, stencil: false, depth: false },
      size: wrapper.getBoundingClientRect(),
    }).then(() => {
      if (disposed) { renderer.unmount(); return }
      store.current = renderer.render(latest.current)
      resize()
    }).catch(() => { renderer.unmount() })
    const observer = new ResizeObserver(resize)
    observer.observe(wrapper)
    window.addEventListener('resize', resize)
    return () => {
      disposed = true
      observer.disconnect()
      window.removeEventListener('resize', resize)
      renderer.unmount()
      root.current = null
      store.current = null
    }
  }, [])

  return (
    <div ref={host}
      // The source project ran this at [0.1, 0.5] — a tenth of native, upscaled
      // ten times, which reads as atmosphere on a dark page. Raised to [0.5, 1]
      // when the trail had to survive `multiply` on white, and KEPT there under
      // difference: the core is a hard inversion now, and a hard edge upscaled
      // ten times is a visibly blocky one. Still under native, so still cheap.
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
      <div style={{ width: '100%', height: '100%' }}>
        <canvas ref={canvas} style={{ display: 'block' }} />
      </div>
    </div>
  )
}
