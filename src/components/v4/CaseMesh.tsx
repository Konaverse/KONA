'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion-v4'

/**
 * THE MESH — the case study's ground (user, 2026-09-12: "an animated mesh
 * gradient, kind of like a liquid gradient; one viewport background that
 * stays there always; subtle but animated").
 *
 * ONE FIXED CANVAS behind the whole page, a hand-written fragment shader
 * on a fullscreen triangle (the aurora's construction, Aurora.tsx).
 *
 * A MESH GRADIENT, the classic kind (user, 2026-09-12, after the
 * noise-warped field was rejected: "it reads as smoke — let's do fluid
 * mesh gradients"): six wide gaussian points on the ramp, each drifting
 * on its own pair of slow sines, blended as a weighted average over the
 * void. No noise at all — the only distortion is one low-frequency bend
 * of the plane, which bows the points' edges into each other and is what
 * makes it fluid rather than a set of discs.
 *
 * THE PALETTE is the ramp and nothing else: the void (n-11) as the
 * ground, the points in n-9, n-8 and n-7. Monochrome light in the dark —
 * the pivot's one rule. The void keeps a base weight in the blend so the
 * points read as light on it, and type sits on it anywhere.
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

/* one mesh point: a wide gaussian around a centre that drifts on its own
   pair of slow sines. The weight is what the blend uses. */
float pt(vec2 p, vec2 base, vec2 amp, vec2 w, float ph, float r, float t){
  vec2 c = base + amp * vec2(sin(t * w.x + ph), cos(t * w.y + ph * 1.7));
  vec2 d = (p - c) / r;
  return exp(-dot(d, d));
}

void main(){
  /* aspect-true, spanning the whole frame: about ±1.9 across, ±0.9 up */
  vec2 p = (gl_FragCoord.xy / uRes - 0.5) * vec2(uRes.x / uRes.y, 1.0) * 1.8;
  float t = uT;

  /* THE FLUID: one low-frequency bend of the plane, so the points'
     edges bow into each other instead of staying round. One sine per
     axis — no noise, no wisps. */
  p += 0.16 * vec2(sin(p.y * 1.4 + t * 0.09), cos(p.x * 1.1 - t * 0.07));

  /* THE MESH: six points on the ramp — the lift, the border step, the
     muted grey — blended as a weighted average over the void */
  vec3 cVoid = vec3(13.0, 16.0, 18.0) / 255.0;
  vec3 c9 = vec3(37.0, 42.0, 44.0) / 255.0;
  vec3 c8 = vec3(58.0, 65.0, 68.0) / 255.0;
  vec3 c7 = vec3(90.0, 97.0, 101.0) / 255.0;

  float w0 = pt(p, vec2(-1.30,  0.55), vec2(0.30, 0.22), vec2(0.11, 0.08), 0.0, 0.72, t);
  float w1 = pt(p, vec2( 1.35,  0.40), vec2(0.28, 0.26), vec2(0.08, 0.12), 1.9, 0.80, t);
  float w2 = pt(p, vec2( 0.10, -0.70), vec2(0.40, 0.20), vec2(0.10, 0.07), 3.1, 0.78, t);
  float w3 = pt(p, vec2(-0.55, -0.15), vec2(0.26, 0.24), vec2(0.07, 0.10), 4.4, 0.60, t);
  float w4 = pt(p, vec2( 0.95, -0.05), vec2(0.32, 0.20), vec2(0.12, 0.09), 5.6, 0.66, t);
  float w5 = pt(p, vec2( 0.20,  0.85), vec2(0.36, 0.18), vec2(0.09, 0.11), 0.9, 0.70, t);

  /* ADDITIVE: each point adds its tone's lift over the void, so the
     ground stays the void between points and rises at each one — the
     mesh reads as light on the dark, not as a grey wash */
  vec3 col = cVoid
           + (c8 - cVoid) * w0 * 0.80
           + (c7 - cVoid) * w1 * 0.68
           + (c9 - cVoid) * w2 * 0.95
           + (c7 - cVoid) * w3 * 0.60
           + (c8 - cVoid) * w4 * 0.76
           + (c9 - cVoid) * w5 * 0.90;
  /* the ceiling: nothing brighter than the muted grey */
  col = min(col, c7);

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
