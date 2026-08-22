import { Effect } from 'postprocessing'
import { Color, Texture, Uniform, Vector3 } from 'three'
import { POST_FRAG } from './shaders'

const rgb = (hex: string) => {
  const c = new Color(hex)
  return new Vector3(c.r, c.g, c.b)
}

/**
 * Three points on a VALUE ramp, not three hues (monochrome pivot, 2026-08-22).
 * The canvas composites with `mix-blend-mode: difference`, so each value here
 * is literally an amount of inversion: black leaves the page alone, white flips
 * it, and the greys between wash it toward mid.
 */
export type FluidPalette = {
  /** Thin trailing edges. Dim, so a wisp only washes the page toward grey. */
  edge: string
  /** Fast-moving parts. Between edge and core: a smear is a partial flip. */
  smoke: string
  /** The dense core. White — a full inversion of whatever is underneath. */
  core: string
}

/**
 * THE MONO PALETTE. Deliberately not tied to the ramp in tokens.css: these are
 * blend operands rather than surface colours, and the two ends have to be true
 * 0 and true 1 to be a clean no-op and a clean flip. --n-11 is not black and
 * --n-0 is not white, exactly so they read as material; a difference operand
 * has the opposite requirement.
 */
export const MONO_PALETTE: FluidPalette = {
  edge:  '#5A5A5A',
  smoke: '#B4B4B4',
  core:  '#FFFFFF',
}

/** The pre-pivot ice, kept for one-line comparison. Not used on the site. */
export const ICE_PALETTE: FluidPalette = {
  edge:  '#7FA8C9',
  smoke: '#687076',
  core:  '#2E5F8A',
}

/**
 * The post pass that paints simulated density as ice.
 *
 * Three colours rather than one: density ramps white → ice → ice-deep for
 * depth, and speed mixes graphite through it for smoke. A single-colour ramp
 * looked synthetic — the neutral is what stops it reading as a gradient.
 *
 * There is no background uniform. Under `multiply` compositing the background
 * is white by definition, so it was a knob that could only ever be set wrong.
 */
export default class FluidEffect extends Effect {
  constructor({
    tFluid = new Texture(),
    intensity = 1.0,
    fade = 0.08,
    palette = MONO_PALETTE,
  }: {
    tFluid?: Texture
    intensity?: number
    /** Density floor. Below it the trail paints nothing, so it ends. */
    fade?: number
    palette?: FluidPalette
  } = {}) {
    super('FluidEffect', POST_FRAG, {
      uniforms: new Map<string, Uniform<unknown>>([
        ['tFluid', new Uniform(tFluid)],
        ['uIntensity', new Uniform(intensity)],
        ['uFade', new Uniform(fade)],
        ['uEdge', new Uniform(rgb(palette.edge))],
        ['uSmoke', new Uniform(rgb(palette.smoke))],
        ['uCore', new Uniform(rgb(palette.core))],
      ]),
    })
  }

  setFluidTexture(t: Texture) {
    const u = this.uniforms.get('tFluid')
    if (u) u.value = t
  }

  setIntensity(v: number) {
    const u = this.uniforms.get('uIntensity')
    if (u) u.value = v
  }

  setFade(v: number) {
    const u = this.uniforms.get('uFade')
    if (u) u.value = v
  }

  setPalette(p: FluidPalette) {
    this.uniforms.get('uEdge')!.value = rgb(p.edge)
    this.uniforms.get('uSmoke')!.value = rgb(p.smoke)
    this.uniforms.get('uCore')!.value = rgb(p.core)
  }
}
