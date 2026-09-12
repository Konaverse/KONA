'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion-v4'

/**
 * THE MESH — the case study's ground (user, 2026-09-12: "an animated mesh
 * gradient, kind of like a liquid gradient; one viewport background that
 * stays there always; subtle but animated").
 *
 * ONE FIXED CANVAS behind the whole page, a hand-written fragment shader
 * on a fullscreen triangle (the aurora's construction, Aurora.tsx). The
 * field is domain-warped fbm — noise fed through noise twice — which is
 * what makes a gradient read as LIQUID rather than as blobs drifting:
 * the shapes fold into each other instead of sliding past.
 *
 * THE PALETTE is the ramp and nothing else: the void (n-11) as the
 * ground, the lift (n-9) where the field rises, the muted grey (n-7) at
 * the few peaks. Monochrome light in the dark — the pivot's one rule.
 * Peaks are small and rare on purpose; most of the frame stays within
 * two ramp steps of the void, so type sits on it anywhere.
 *
 * DITHERED: a hash per pixel adds ±1/255, which is what keeps a slow
 * gradient this dark from banding on an 8-bit panel. The root grain
 * layer rides on top and thickens over it (GrainField).
 *
 * COST. Half-resolution canvas, DPR capped at 1, upscaled by CSS — the
 * field is soft by nature. Drawn off the shared gsap ticker (which rests
 * in a hidden tab), every other frame. Reduced motion gets ONE frame at
 * a fixed time. No WebGL and no JS: the CSS ground under the canvas is a
 * still of the same idea (case.css, .cs-mesh).
 */

const VERT = `
attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uT;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.02 + vec2(11.3, 7.7); a *= 0.5; }
  return v;
}
void main(){
  /* centred, aspect-true, about ±0.5 across the short side */
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);
  p *= 0.8;
  float t = uT;

  /* THE WARP: the field bent by itself, twice, each pass on its own
     slow clock — the liquid */
  vec2 q = vec2(fbm(p + t * 0.040), fbm(p + vec2(5.2, 1.3) - t * 0.032));
  vec2 r = vec2(fbm(p + 3.4 * q + vec2(1.7, 9.2) + t * 0.026),
                fbm(p + 3.4 * q + vec2(8.3, 2.8) - t * 0.021));
  float f = fbm(p + 3.0 * r);

  /* the value: most of the field rests near the void; a shaped rise
     to a few peaks */
  float v = smoothstep(0.36, 0.88, f);
  v = pow(v, 1.7);

  /* the ramp: void, lift, the muted grey at the peaks */
  vec3 cVoid = vec3(13.0, 16.0, 18.0) / 255.0;
  vec3 cLift = vec3(37.0, 42.0, 44.0) / 255.0;
  vec3 cPeak = vec3(90.0, 97.0, 101.0) / 255.0;
  vec3 col = mix(cVoid, cLift, smoothstep(0.0, 0.62, v));
  col = mix(col, cPeak, smoothstep(0.58, 1.0, v) * 0.75);

  /* a broad slow sheet of light wandering the frame, so the mesh has a
     side it leans to */
  vec2 c = vec2(0.32 * sin(t * 0.045), 0.18 * cos(t * 0.037));
  vec2 d = (p - c) * vec2(0.55, 1.25);
  col += exp(-dot(d, d) * 2.2) * 0.045;

  /* dither */
  col += (hash(gl_FragCoord.xy + fract(t) * 7.0) - 0.5) * (2.0 / 255.0);
  gl_FragColor = vec4(col, 1.0);
}
`

/** the mesh's clock: shader seconds per real second */
const SPEED = 0.55
/** the one frame reduced motion gets */
const STILL_T = 37.0

function build(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'low-power' })
  if (!gl) return null
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!
    gl.shaderSource(s, src)
    gl.compileShader(s)
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null
  }
  const vs = sh(gl.VERTEX_SHADER, VERT)
  const fs = sh(gl.FRAGMENT_SHADER, FRAG)
  if (!vs || !fs) return null
  const prog = gl.createProgram()!
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null
  gl.useProgram(prog)
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const aPos = gl.getAttribLocation(prog, 'aPos')
  gl.enableVertexAttribArray(aPos)
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
  const uRes = gl.getUniformLocation(prog, 'uRes')
  const uT = gl.getUniformLocation(prog, 'uT')

  const resize = () => {
    const scale = 0.5 * Math.min(window.devicePixelRatio || 1, 1)
    const w = Math.max(2, Math.round(window.innerWidth * scale))
    const h = Math.max(2, Math.round(window.innerHeight * scale))
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
      gl.viewport(0, 0, w, h)
      gl.uniform2f(uRes, w, h)
    }
  }
  const draw = (t: number) => {
    gl.uniform1f(uT, t)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }
  return { resize, draw, gl }
}

export default function CaseMesh() {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const mesh = build(canvas)
    if (!mesh) {
      canvas.hidden = true
      return
    }
    canvas.classList.add('is-live')
    mesh.resize()
    const onResize = () => mesh.resize()
    window.addEventListener('resize', onResize)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      mesh.draw(STILL_T)
      return () => window.removeEventListener('resize', onResize)
    }

    let odd = false
    const tick = () => {
      odd = !odd
      if (odd) return
      mesh.draw(gsap.ticker.time * SPEED)
    }
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('resize', onResize)
      mesh.gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [])

  return <canvas ref={ref} className="cs-mesh" aria-hidden="true" />
}
