import { Effect } from 'postprocessing'
import { Color, Texture, Uniform, Vector3 } from 'three'
import { POST_FRAG } from './shaders'

const hexToRgb = (hex: string) => {
  const c = new Color(hex)
  return new Vector3(c.r, c.g, c.b)
}

/**
 * The post pass that paints the simulated density as ice.
 *
 * Only two uniforms matter: the fluid texture and the accent. The background
 * colour the original carried is gone — under `multiply` compositing the
 * "background" is always white by definition, so it was a knob that could only
 * ever be set wrong.
 */
export default class FluidEffect extends Effect {
  constructor({
    tFluid = new Texture(),
    intensity = 1.0,
    fluidColor = '#7FA8C9',
  }: { tFluid?: Texture; intensity?: number; fluidColor?: string } = {}) {
    super('FluidEffect', POST_FRAG, {
      uniforms: new Map<string, Uniform<unknown>>([
        ['tFluid', new Uniform(tFluid)],
        ['uIntensity', new Uniform(intensity)],
        ['uColor', new Uniform(hexToRgb(fluidColor))],
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

  setColor(hex: string) {
    const u = this.uniforms.get('uColor')
    if (u) u.value = hexToRgb(hex)
  }
}
