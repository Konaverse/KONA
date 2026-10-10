'use client'

import { useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import { createPortal, useFrame, useThree } from '@react-three/fiber'
import { useFBO } from '@react-three/drei/core/Fbo'
import { EffectComposerContext } from '@react-three/postprocessing'
import {
  Camera,
  Color,
  HalfFloatType,
  LinearFilter,
  Mesh,
  NearestFilter,
  OrthographicCamera,
  PlaneGeometry,
  RedFormat,
  RGFormat,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  Texture,
  Vector2,
  Vector3,
  type WebGLRenderer,
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

/** Like compileAsync, but cancellation stops polling before disposed materials
 * are accessed on a route interruption or resize. Use only public renderer API. */
async function compileProgram(renderer: WebGLRenderer, scene: Scene, camera: Camera, signal: AbortSignal) {
  renderer.compile(scene, camera)
  const context = renderer.getContext()
  const parallel = context.getExtension('KHR_parallel_shader_compile')
  const programs = renderer.info.programs?.slice() ?? []
  if (parallel) {
    while (!signal.aborted && !context.isContextLost() && programs.some(item => !context.getProgramParameter(item.program, parallel.COMPLETION_STATUS_KHR))) {
      await new Promise<void>(resolve => window.setTimeout(resolve, 10))
    }
  } else {
    // Older renderers retain their original synchronous path, with a task
    // boundary to give the driver a chance to finish before the first draw.
    await new Promise<void>(resolve => window.setTimeout(resolve, 10))
  }
  for (const program of programs) {
    if (signal.aborted || context.isContextLost()) return false
    // Three's diagnostics and location queries are first-use work as well.
    // Retain them, but finish them here, one program per task, before input.
    program.getUniforms()
    await new Promise<void>(resolve => window.setTimeout(resolve, 0))
  }
  return !signal.aborted && !context.isContextLost()
}

function useDoubleFBO(w: number, h: number, options: Record<string, unknown>) {
  const read = useFBO(w, h, options)
  const write = useFBO(w, h, options)
  return useMemo(() => {
    const fbo = {
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
    }
    return fbo
  }, [read, write])
}

export default function Fluid({
  palette = MONO_PALETTE,
  intensity = 55,
  fade = 0.08,
  decay,
  paused = false,
  onReady,
}: {
  palette?: FluidPalette
  intensity?: number
  fade?: number
  /** Overrides densityDissipation. A PER-FRAME multiplier, so small changes
   *  are large: at 60fps the half-life is ln(0.5)/ln(decay)/60 seconds —
   *  0.982 is 0.64s, 0.95 is 0.23s. Raise it to make the trail last longer. */
  decay?: number
  paused?: boolean
  onReady: () => void
}) {
  const size = useThree((s) => s.size)
  const gl = useThree((s) => s.gl)
  const invalidate = useThree((s) => s.invalidate)
  const { composer } = useContext(EffectComposerContext)
  const ready = useRef(false)

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 812
  const O = { ...OPTS, ...(isMobile ? mobileOpts : desktopOpts) }
  if (decay !== undefined) O.densityDissipation = decay

  const bufferScene = useRef(new Scene())
  const bufferCamera = useRef(new Camera())
  const meshRef = useRef<import('three').Mesh | null>(null)
  const splats = useRef<Splat[]>([])
  const lastPointer = useRef(new Vector2())
  const hasMoved = useRef(false)
  /* A conservative upper bound on the dye's RGB magnitude. Each splat adds
     at most its color's length; linear advection cannot increase the maximum,
     and dissipation decreases it. Sleep only below the shader's fade floor,
     with extra margin for half-float rounding. No GPU readback is needed. */
  const dyeBound = useRef(0)

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

  const clearSimulation = useCallback(() => {
    const target = gl.getRenderTarget()
    const color = gl.getClearColor(new Color()).clone()
    const alpha = gl.getClearAlpha()
    gl.setClearColor(0, 0)
    for (const buffer of [density.read, density.write, velocity.read, velocity.write, pressure.read, pressure.write, divergence, curl]) {
      gl.setRenderTarget(buffer)
      gl.clear()
    }
    gl.setRenderTarget(target)
    gl.setClearColor(color, alpha)
    splats.current.length = 0
    dyeBound.current = 0
  }, [gl, density, velocity, pressure, divergence, curl])

  useEffect(() => {
    clearSimulation()
    hasMoved.current = false
    if (!paused) invalidate()
  }, [paused, clearSimulation, invalidate])

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
    if (paused) return
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || document.hidden || !ready.current) return
      const { clientX: x, clientY: y } = e
      const dx = x - lastPointer.current.x
      const dy = y - lastPointer.current.y
      if (!hasMoved.current) {
        hasMoved.current = true
        lastPointer.current.set(x, y)
        return
      }
      lastPointer.current.set(x, y)
      if (dx === 0 && dy === 0) return
      splats.current.push({
        mouseX: x / size.width,
        mouseY: 1.0 - y / size.height,
        velocityX: dx * O.force,
        velocityY: -dy * O.force,
      })
      invalidate()
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [size, O.force, paused, invalidate])

  /* ----------------------------------------------------------------- effect */
  const effect = useMemo(
    () => new FluidEffect({ intensity: intensity * 0.0001, fade, palette }),
    [intensity, fade, palette],
  )
  useEffect(() => () => effect.dispose(), [effect])

  useEffect(() => {
    let disposed = false
    const compilation = new AbortController()
    ready.current = false
    const warm = async () => {
      const mesh = meshRef.current
      if (!mesh) return
      const scene = new Scene()
      const preview = new Mesh(mesh.geometry, materials.advection)
      scene.add(preview)
      // Retain every solver shader and its exact target configuration. Submit
      // one program per task, then poll GPU completion before
      // diagnostics/uniform queries can block a frame or the first stroke.
      for (const material of Object.values(materials)) {
        if (disposed) return
        const previous = gl.getRenderTarget()
        gl.setRenderTarget(density.read)
        preview.material = material
        const compiling = compileProgram(gl, scene, bufferCamera.current, compilation.signal)
        gl.setRenderTarget(previous)
        if (!await compiling) return
        await new Promise<void>(resolve => window.setTimeout(resolve, 0))
      }
      // The composer builds this material in its layout effect. Compile its
      // final screen pass as well; drawing black at rest must not pay a shader
      // wait in React Three Fiber's first animation frame.
      const geometry = new PlaneGeometry(2, 2)
      const screen: Mesh = new Mesh(geometry, materials.advection)
      scene.clear()
      scene.add(screen)
      try {
        for (const pass of composer.passes) {
          if (disposed) return
          const material = pass.fullscreenMaterial
          if (!material) continue
          screen.material = material
          if (!await compileProgram(gl, scene, new OrthographicCamera(), compilation.signal)) return
        }
        if (disposed) return
        ready.current = true
        onReady()
        invalidate()
      } finally {
        geometry.dispose()
      }
    }
    void warm()
    return () => { disposed = true; compilation.abort(); ready.current = false }
  }, [composer, density, gl, invalidate, materials, onReady])

  /* ------------------------------------------------------------------- loop */
  const use = useCallback((name: keyof typeof materials) => {
    if (!meshRef.current) return
    meshRef.current.material = materials[name]
  }, [materials])

  const set = useCallback((name: keyof typeof materials, k: string, v: unknown) => {
    const u = materials[name].uniforms[k]
    // Three.js uniforms are imperative GPU state, not React render state.
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
    if (!meshRef.current || paused || !ready.current) return
    if (dyeBound.current === 0 && splats.current.length === 0) {
      effect.setFluidTexture(density.read.texture)
      return
    }

    while (splats.current.length > 0) {
      const s = splats.current.pop()!
      dyeBound.current += Math.hypot(s.velocityX, s.velocityY, 10)
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

    dyeBound.current *= O.densityDissipation
    const invisible = dyeBound.current * Math.abs(intensity) * 0.0001 < fade * 0.5
    if (invisible) clearSimulation()
    else invalidate()

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
