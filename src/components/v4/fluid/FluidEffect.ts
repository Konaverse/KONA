import { Effect } from 'postprocessing'
import { Color, Texture, Uniform, Vector3 } from 'three'
import { POST_FRAG } from './shaders'

const rgb = (hex: string) => {
  const c = new Color(hex)
  return new Vector3(c.r, c.g, c.b)
}

export type FluidPalette = {
  /** Thin trailing edges. --ice */
  ice: string
  /** Fast-moving parts — the one neutral, read as smoke. --graphite */
  graphite: string
  /** The dense core. --ice-deep */
  iceDeep: string
}

export const ICE_PALETTE: FluidPalette = {
  ice: '#7FA8C9',
  graphite: '#687076',
  iceDeep: '#2E5F8A',
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
    palette = ICE_PALETTE,
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
        ['uIce', new Uniform(rgb(palette.ice))],
        ['uGraphite', new Uniform(rgb(palette.graphite))],
        ['uIceDeep', new Uniform(rgb(palette.iceDeep))],
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
    this.uniforms.get('uIce')!.value = rgb(p.ice)
    this.uniforms.get('uGraphite')!.value = rgb(p.graphite)
    this.uniforms.get('uIceDeep')!.value = rgb(p.iceDeep)
  }
}
