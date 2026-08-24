'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'
import { createPortal, useFrame, useThree } from '@react-three/fiber'
import { useFBO } from '@react-three/drei'
import {
  Camera,
  HalfFloatType,
  LinearFilter,
  NearestFilter,
  RedFormat,
  RGFormat,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  Texture,
  Vector2,
  Vector3,
} from 'three'
import FluidEffect, { MONO_PALETTE, type FluidPalette } from './FluidEffect'
import {
  ADVECTION_FRAG,
  BASE_VERT,
  CLEAR_FRAG,
  CURL_FRAG,
  DIVERGENCE_FRAG,
  GRADIENT_SUBTRACT_FRAG,
  PRESSURE_FRAG,
  SPLAT_FRAG,
  VORTICITY_FRAG,
} from './shaders'

/**
 * Navier-Stokes fluid, ported from giats-portfolio. The solver order and the
 * dissipation/curl/pressure constants are kept as they were — that tuning is
 * what makes the trail feel right, and it is not worth relitigating.
 *
 * Ported rather than imported because that project runs React Three Fiber 8 and
 * loads its shaders through webpack; this one is on R3F 9 with Turbopack.
 */

type Splat = { mouseX: number; mouseY: number; velocityX: number; velocityY: number }

const OPTS = {
  force: 1,
  curl: 1,
  swirl: 3,
  pressure: 0.0,
  velocityDissipation: 0.93,
}
// The dye is laid down fatter than the source project's (radius), because that
// was tuned for a DARK page blended with `difference` where even a faint trail
// shows as lightening, and on white through `multiply` it read as almost
// nothing.
//
// densityDissipation was raised for the same reason and has since been pulled
// back hard. It is a PER-FRAME multiplier, so 0.982 is a 0.64s half-life — the
// dye was still readable as a 10% tint on white almost four seconds after the
// pointer stopped. 0.95 is a 0.23s half-life, and with the uFade floor the
// trail is gone in 0.70s.
//
// Peak strength is unaffected: `intensity` rose 30 -> 55 to compensate for the
// lower steady state, so a moving pointer still saturates the density curve
// exactly as it did. Modelled, not guessed — presence is identical and only
// duration moved.
const mobileOpts = { radius: 0.15, densityDissipation: 0.945, dyeRes: 128, simRes: 24 }
const desktopOpts = { radius: 0.19, densityDissipation: 0.95, dyeRes: 512, simRes: 64 }

function useDoubleFBO(w: number, h: number, options: Record<string, unknown>) {
  const read = useFBO(w, h, options)
  const write = useFBO(w, h, options)
  const fbo = useRef({
    read,
    write,
    swap() {
      const t = fbo.read
      fbo.read = fbo.write
      fbo.write = t
    },
    dispose() {
      read.dispose()
      write.dispose()
    },
  }).current
  return fbo
}

export default function Fluid({
  palette = MONO_PALETTE,
  intensity = 55,
  fade = 0.08,
  decay,
}: {
  palette?: FluidPalette
  intensity?: number
  fade?: number
  /** Overrides densityDissipation. A PER-FRAME multiplier, so small changes
   *  are large: at 60fps the half-life is ln(0.5)/ln(decay)/60 seconds —
   *  0.982 is 0.64s, 0.95 is 0.23s. Raise it to make the trail last longer. */
  decay?: number
}) {
  const size = useThree((s) => s.size)
  const gl = useThree((s) => s.gl)

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 812
  const O = { ...OPTS, ...(isMobile ? mobileOpts : desktopOpts) }
  if (decay !== undefined) O.densityDissipation = decay

  const bufferScene = useRef(new Scene())
  const bufferCamera = useRef(new Camera())
  const meshRef = useRef<import('three').Mesh | null>(null)
  const splats = useRef<Splat[]>([])
  const lastPointer = useRef(new Vector2())
  const hasMoved = useRef(false)

  /* ------------------------------------------------------------------ FBOs */
  const density = useDoubleFBO(O.dyeRes, O.dyeRes, {
    type: HalfFloatType, format: RGBAFormat, minFilter: LinearFilter, depthBuffer: false,
  })
  const velocity = useDoubleFBO(O.simRes, O.simRes, {
    type: HalfFloatType, format: RGFormat, minFilter: LinearFilter, depthBuffer: false,
  })
  const pressure = useDoubleFBO(O.simRes, O.simRes, {
    type: HalfFloatType, format: RedFormat, minFilter: NearestFilter, depthBuffer: false,
  })
  const divergence = useFBO(O.simRes, O.simRes, {
    type: HalfFloatType, format: RedFormat, minFilter: NearestFilter, depthBuffer: false,
  })
  const curl = useFBO(O.simRes, O.simRes, {
    type: HalfFloatType, format: RedFormat, minFilter: NearestFilter, depthBuffer: false,
  })

  /* -------------------------------------------------------------- materials */
  const materials = useMemo(() => {
    /* the vertex shader ships IN the constructor — it used to be patched on
       in the useEffect below, but that effect is passive (runs after paint)
       and this memo re-runs on every resize, so R3F could draw a fresh
       material one frame BEFORE the patch landed. Three then compiled it
       with its default vertex shader — no vL/vR/vT/vB — and the neighbour-
       sampling fragments failed to link ("FRAGMENT varying vL does not
       match any VERTEX varying", 2026-08-24). Constructed complete, the
       race has nothing to race. */
    const mk = (fragmentShader: string, uniforms: Record<string, { value: unknown }>) =>
      new ShaderMaterial({
        uniforms: { ...uniforms, texelSize: { value: new Vector2() } },
        vertexShader: BASE_VERT,
        fragmentShader,
        depthTest: false,
        depthWrite: false,
      })

    return {
      advection: mk(ADVECTION_FRAG, {
        uVelocity: { value: new Texture() }, uSource: { value: new Texture() },
        dt: { value: 0.016 }, uDissipation: { value: 1.0 },
      }),
      clear: mk(CLEAR_FRAG, { uTexture: { value: new Texture() }, uClearValue: { value: O.pressure } }),
      curl: mk(CURL_FRAG, { uVelocity: { value: new Texture() } }),
      divergence: mk(DIVERGENCE_FRAG, { uVelocity: { value: new Texture() } }),
      gradientSubstract: mk(GRADIENT_SUBTRACT_FRAG, {
        uPressure: { value: new Texture() }, uVelocity: { value: new Texture() },
      }),
      pressure: mk(PRESSURE_FRAG, {
        uPressure: { value: new Texture() }, uDivergence: { value: new Texture() },
      }),
      splat: mk(SPLAT_FRAG, {
        uTarget: { value: new Texture() }, aspectRatio: { value: size.width / size.height },
        uColor: { value: new Vector3() }, uPointer: { value: new Vector2() },
        uRadius: { value: O.radius / 100.0 },
      }),
      vorticity: mk(VORTICITY_FRAG, {
        uVelocity: { value: new Texture() }, uCurl: { value: new Texture() },
        uCurlValue: { value: O.curl }, dt: { value: 0.016 },
      }),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [O.curl, O.pressure, O.radius, size.width, size.height])

  useEffect(() => {
    const aspect = size.width / (size.height + 400)
    Object.values(materials).forEach((m) => {
      ;(m.uniforms.texelSize.value as Vector2).set(1 / (O.simRes * aspect), 1 / O.simRes)
    })
    return () => Object.values(materials).forEach((m) => m.dispose())
  }, [materials, size, O.simRes])

  /* ----------------------------------------------------------- pointer input */
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e
      const dx = x - lastPointer.current.x
      const dy = y - lastPointer.current.y
      if (!hasMoved.current) {
        hasMoved.current = true
        lastPointer.current.set(x, y)
        return
      }
      lastPointer.current.set(x, y)
      splats.current.push({
        mouseX: x / size.width,
        mouseY: 1.0 - y / size.height,
        velocityX: dx * O.force,
        velocityY: -dy * O.force,
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [size, O.force])

  /* ----------------------------------------------------------------- effect */
  const effect = useMemo(
    () => new FluidEffect({ intensity: intensity * 0.0001, fade, palette }),
    [intensity, fade, palette],
  )
  useEffect(() => () => effect.dispose(), [effect])

  /* ------------------------------------------------------------------- loop */
  const use = useCallback((name: keyof typeof materials) => {
    if (!meshRef.current) return
    meshRef.current.material = materials[name]
    meshRef.current.material.needsUpdate = true
  }, [materials])

  const set = useCallback((name: keyof typeof materials, k: string, v: unknown) => {
    const u = materials[name].uniforms[k]
    if (u) u.value = v
  }, [materials])

  const draw = useCallback((target: { write: import('three').WebGLRenderTarget; swap: () => void } | import('three').WebGLRenderTarget) => {
    if ('write' in target) {
      gl.setRenderTarget(target.write)
      gl.clear()
      gl.render(bufferScene.current, bufferCamera.current)
      target.swap()
    } else {
      gl.setRenderTarget(target)
      gl.clear()
      gl.render(bufferScene.current, bufferCamera.current)
    }
  }, [gl])

  useFrame(() => {
    if (!meshRef.current) return

    while (splats.current.length > 0) {
      const s = splats.current.pop()!
      use('splat')
      set('splat', 'uTarget', velocity.read.texture)
      set('splat', 'uPointer', new Vector2(s.mouseX, s.mouseY))
      set('splat', 'uColor', new Vector3(s.velocityX, s.velocityY, 10.0))
      set('splat', 'uRadius', O.radius / 100.0)
      draw(velocity)
      set('splat', 'uTarget', density.read.texture)
      draw(density)
    }

    use('curl'); set('curl', 'uVelocity', velocity.read.texture); draw(curl)
    use('vorticity')
    set('vorticity', 'uVelocity', velocity.read.texture)
    set('vorticity', 'uCurl', curl.texture)
    set('vorticity', 'uCurlValue', O.curl)
    draw(velocity)
    use('divergence'); set('divergence', 'uVelocity', velocity.read.texture); draw(divergence)
    use('clear')
    set('clear', 'uTexture', pressure.read.texture)
    set('clear', 'uClearValue', O.pressure)
    draw(pressure)

    use('pressure')
    set('pressure', 'uDivergence', divergence.texture)
    for (let i = 0; i < O.swirl; i += 1) {
      set('pressure', 'uPressure', pressure.read.texture)
      draw(pressure)
    }

    use('gradientSubstract')
    set('gradientSubstract', 'uPressure', pressure.read.texture)
    set('gradientSubstract', 'uVelocity', velocity.read.texture)
    draw(velocity)

    use('advection')
    set('advection', 'uVelocity', velocity.read.texture)
    set('advection', 'uSource', velocity.read.texture)
    set('advection', 'uDissipation', O.velocityDissipation)
    draw(velocity)

    set('advection', 'uSource', density.read.texture)
    set('advection', 'uDissipation', O.densityDissipation)
    draw(density)

    gl.setRenderTarget(null)
    gl.clear()

    effect.setFluidTexture(density.read.texture)
  }, 0)

  return (
    <>
      {createPortal(
        <mesh ref={meshRef} scale={[1, 1, 0]}>
          <planeGeometry args={[2, 2, 1, 1]} />
        </mesh>,
        bufferScene.current,
      )}
      <primitive object={effect} />
    </>
  )
}
