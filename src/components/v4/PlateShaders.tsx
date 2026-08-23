'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * BENCHMARK — can §4's six plates be live shaders instead of six videos?
 *
 * Six looping videos measured 33.3ms a frame with 88% of frames over budget,
 * which is exactly where §4 sat before it was rebuilt. One video is free
 * (16.7ms, nothing dropped). This asks whether shaders land nearer the one
 * than the six, and it exists because the honest answer could not be measured
 * from a headless browser: that runs a software rasteriser, which is the one
 * environment that answers "can this GPU do it" wrongly in both directions.
 * So the page reports its own numbers and its own GPU, and is meant to be
 * opened on the machine whose answer matters.
 *
 * ── ONE CANVAS, SIX SCISSORED DRAWS ───────────────────────────────────────
 * Six WebGL contexts is not an option to be measured, it is a non-starter:
 * browsers cap them near a dozen, each carries its own setup and its own
 * compositor surface, they share nothing, and this page already spends one on
 * the fluid cursor. So there is a SINGLE canvas fixed behind the grid, and
 * each frame every visible plate's rect is read and drawn into with
 * `gl.viewport` + `gl.scissor` and its own program.
 *
 * That is also the interesting part of the result. The video path's cost was
 * probably never decode — it was six surfaces being uploaded and composited
 * every frame. One canvas has ONE surface however many regions are drawn into
 * it, so if the shaders come in cheap, that is why.
 *
 * ── WHAT THE CONTROLS ARE FOR ─────────────────────────────────────────────
 * Plates and resolution are the two axes that actually decide affordability,
 * so both are adjustable and the readout updates live. Six plates at device
 * pixel ratio is the real question; anything less is a fallback worth knowing
 * the price of.
 *
 * NOTE ON `gl_FragCoord`: a viewport does not rebase it. It stays in canvas
 * pixels, so each shader is handed its region's origin and size and works out
 * its own 0..1 uv. And WebGL's y runs up from the bottom while a DOM rect
 * measures down from the top, which is the one conversion in here worth
 * getting right the first time.
 */

const VERT = `#version 300 es
void main() {
  /* the standard fullscreen triangle from the vertex id — no buffers, no
     attributes, three vertices covering clip space */
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`

const COMMON = `#version 300 es
precision highp float;
out vec4 o;
uniform float uT;
uniform vec2 uOrigin;
uniform vec2 uSize;

float h21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), u.x),
             mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p, int oct) {
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 8; i++) { if (i >= oct) break; s += a * vnoise(p); p *= 2.02; a *= 0.5; }
  return s;
}
vec2 uv0() { return (gl_FragCoord.xy - uOrigin) / uSize; }
`

/** six variants, deliberately spread across cost so the ceiling is visible */
export const VARIANTS: { key: string; label: string; note: string; frag: string }[] = [
  {
    key: 'chrome',
    label: 'Chrome',
    note: 'warped bands + hard specular · heavy',
    frag: `${COMMON}
void main() {
  vec2 uv = uv0();
  vec2 p = uv * 3.0;
  float w  = fbm(p + vec2(uT * 0.06, 0.0), 5);
  float w2 = fbm(p * 1.7 + vec2(-uT * 0.04, w), 4);
  float bands = sin((uv.x * 6.0 + w * 3.0 + w2 * 2.0) * 2.2 + uT * 0.3);
  float spec = pow(max(bands, 0.0), 12.0);
  vec3 c = vec3(0.05 + 0.10 * w2) + vec3(0.85, 0.90, 1.0) * spec * 0.55;
  o = vec4(c, 1.0);
}`,
  },
  {
    key: 'noir',
    label: 'Noir smoke',
    note: '6-octave fbm + grain · heavy',
    frag: `${COMMON}
void main() {
  vec2 uv = uv0();
  vec2 p = uv * 2.2;
  float a = fbm(p + vec2(uT * 0.03, uT * 0.02), 6);
  float b = fbm(p * 2.3 - vec2(uT * 0.05, 0.0), 4);
  float v = smoothstep(0.25, 0.85, a * 0.7 + b * 0.4);
  float g = h21(gl_FragCoord.xy + uT) * 0.05;
  o = vec4(vec3(0.03 + v * 0.22 + g), 1.0);
}`,
  },
  {
    key: 'gradient',
    label: 'Mesh gradient',
    note: 'three sines · cheap',
    frag: `${COMMON}
void main() {
  vec2 q = uv0();
  float t = uT * 0.25;
  float m = (0.5 + 0.5 * sin(q.x * 3.0 + t)
           + 0.5 + 0.5 * sin(q.y * 2.4 - t * 0.8)
           + 0.5 + 0.5 * sin((q.x + q.y) * 2.0 + t * 0.6)) / 3.0;
  o = vec4(vec3(0.04 + m * 0.22), 1.0);
}`,
  },
  {
    key: 'caustics',
    label: 'Caustics',
    note: 'five layers, fbm inside the loop · very heavy',
    frag: `${COMMON}
void main() {
  vec2 p = uv0() * 4.0;
  float acc = 0.0;
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    vec2 q = p + vec2(sin(uT * 0.3 + fi), cos(uT * 0.25 + fi * 1.7)) * 0.6;
    acc += 1.0 / (0.08 + abs(sin(q.x * 2.0 + fbm(q, 3) * 3.0) * cos(q.y * 2.0)));
  }
  acc = pow(acc * 0.02, 1.6);
  o = vec4(vec3(0.03) + vec3(0.70, 0.78, 0.90) * acc * 0.25, 1.0);
}`,
  },
  {
    key: 'liquid',
    label: 'Liquid warp',
    note: 'domain warp, fbm five times · heavy',
    frag: `${COMMON}
void main() {
  vec2 p = uv0() * 2.5;
  vec2 q = vec2(fbm(p + vec2(0.0, uT * 0.05), 4), fbm(p + vec2(5.2, 1.3), 4));
  vec2 r = vec2(fbm(p + 4.0 * q + vec2(1.7, 9.2) + uT * 0.03, 4), fbm(p + 4.0 * q + vec2(8.3, 2.8), 4));
  float v = fbm(p + 4.0 * r, 5);
  o = vec4(vec3(0.03 + v * 0.30), 1.0);
}`,
  },
  {
    key: 'rings',
    label: 'Interference',
    note: 'two sines · cheap',
    frag: `${COMMON}
void main() {
  vec2 uv = uv0();
  vec2 p = (uv - 0.5) * vec2(uSize.x / uSize.y, 1.0) * 4.0;
  float v  = 0.5 + 0.5 * sin(length(p) * 8.0 - uT * 1.2);
  float v2 = 0.5 + 0.5 * sin((p.x + p.y) * 5.0 + uT * 0.7);
  o = vec4(vec3(0.03 + v * v2 * 0.24), 1.0);
}`,
  },
]

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(s) || 'shader compile failed')
  }
  return s
}

export type Stats = { fps: number; p50: number; p90: number; gpu: string; drawn: number }

export default function PlateShaders({
  count,
  scale,
  onStats,
}: {
  /** how many plates draw this frame */
  count: number
  /** 1 = CSS pixels, or the device ratio */
  scale: number
  onStats: (s: Stats) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const live = useRef({ count, scale })
  live.current = { count, scale }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    /* ALPHA MATTERS HERE. The canvas is one surface covering the whole
       viewport, and only the plate rects are drawn into: everywhere else has
       to be see-through or it is a black sheet over the page. Which is also
       why it sits ABOVE the grid rather than behind it — a transparent plate
       cannot punch a hole through the opaque card it is sitting in, so a
       canvas behind the cards renders perfectly and is completely invisible.
       (In §4 proper the object has to sit on top of its ground, so the
       shipping arrangement is a per-plate blit out of this one canvas rather
       than this one. That is a plumbing question; this page is measuring what
       the shading costs.) */
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: true, premultipliedAlpha: true, depth: false, stencil: false })
    if (!gl) {
      setError('This browser gave no WebGL2 context.')
      return
    }

    let programs: WebGLProgram[]
    try {
      const vs = compile(gl, gl.VERTEX_SHADER, VERT)
      programs = VARIANTS.map((v) => {
        const p = gl.createProgram()!
        gl.attachShader(p, vs)
        gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, v.frag))
        gl.linkProgram(p)
        if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
          throw new Error(gl.getProgramInfoLog(p) || 'link failed')
        }
        return p
      })
    } catch (e) {
      setError(String((e as Error).message).slice(0, 400))
      return
    }

    const locs = programs.map((p) => ({
      t: gl.getUniformLocation(p, 'uT'),
      o: gl.getUniformLocation(p, 'uOrigin'),
      s: gl.getUniformLocation(p, 'uSize'),
    }))

    const dbg = gl.getExtension('WEBGL_debug_renderer_info')
    const gpu = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : 'hidden by the browser'

    let raf = 0
    const times: number[] = []
    let last = performance.now()
    let lastReport = last

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      times.push(now - last)
      last = now
      if (times.length > 240) times.shift()

      const { count: n, scale: dpr } = live.current
      const w = Math.round(window.innerWidth * dpr)
      const h = Math.round(window.innerHeight * dpr)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }

      gl.disable(gl.SCISSOR_TEST)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.enable(gl.SCISSOR_TEST)

      const plates = Array.from(document.querySelectorAll<HTMLElement>('.pz-plate'))
      let drawn = 0
      for (let i = 0; i < plates.length && i < n; i++) {
        const r = plates[i].getBoundingClientRect()
        if (r.bottom < 0 || r.top > window.innerHeight) continue
        const x = Math.round(r.left * dpr)
        /* WebGL counts y up from the bottom; a DOM rect counts down from the
           top, so the region's origin is the canvas height minus its bottom */
        const y = Math.round(h - r.bottom * dpr)
        const rw = Math.round(r.width * dpr)
        const rh = Math.round(r.height * dpr)
        if (rw <= 0 || rh <= 0) continue
        const k = i % programs.length
        gl.useProgram(programs[k])
        gl.uniform1f(locs[k].t, now * 0.001)
        gl.uniform2f(locs[k].o, x, y)
        gl.uniform2f(locs[k].s, rw, rh)
        gl.viewport(x, y, rw, rh)
        gl.scissor(x, y, rw, rh)
        gl.drawArrays(gl.TRIANGLES, 0, 3)
        drawn++
      }

      if (now - lastReport > 400 && times.length > 20) {
        lastReport = now
        const sorted = times.slice().sort((a, b) => a - b)
        const q = (f: number) => sorted[Math.floor(sorted.length * f)]
        const mean = sorted.reduce((a, b) => a + b, 0) / sorted.length
        onStats({ fps: 1000 / mean, p50: q(0.5), p90: q(0.9), gpu, drawn })
      }
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [onStats])

  if (error) return <p className="pz-error">{error}</p>
  return <canvas ref={canvasRef} className="pz-canvas" aria-hidden="true" />
}
