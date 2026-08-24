'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion-v4'

/**
 * THE AURORA — hand-written WebGL northern lights, monochrome.
 *
 * PROVENANCE: this was system 2 of four inside §6's Interlude, which was
 * DELETED 2026-08-24 (user call). The shader was the part worth keeping, so
 * it was lifted out whole and repainted for the noir pivot. It is destined
 * for the FOOTER (decided dark) and is deliberately NOT MOUNTED anywhere
 * yet — the footer is not built. Nothing else imports it; that is expected.
 *
 * THE FIELD. Three wandering curtains (fbm-driven paths) with internal rays
 * and bright tips, the whole composition slanted so it reads asymmetric.
 * Raw WebGL fullscreen triangle — no three.js for one shader — on a
 * reduced-res canvas the CSS upscales, because an aurora is soft by nature
 * and the resolution is free money. The ray striations are the one detail
 * that needs grid, which is why the scale is 0.6 and not 0.5.
 *
 * THE PALETTE, and this is the pivot's rule made literal: colour survives as
 * EMITTED LIGHT ONLY. The curtains are three points on a VALUE ramp — n-5
 * grey, n-3 light grey, n-0 white at the tips — over the n-11 void. The one
 * colour left on the page, --ice-deep, is weighted to the FOOT of the
 * curtains and falls to nothing at their tips, opposite to how the value
 * ramps. Two gradients running against each other read as a temperature
 * shift in the emission rather than a tint on a surface, which is the whole
 * distinction the pivot turns on. An aurora is light, so it is allowed one.
 *
 * COST. Draws only while the canvas is near the viewport, off the shared
 * gsap ticker (never its own rAF). Fragment work is unchanged from the
 * version that shipped in §6 at 60fps.
 *
 * FALLBACK. Reduced motion gets ONE frame drawn at a fixed time — a still
 * that is complete rather than an animation someone paused. No WebGL and
 * no-JS hide the canvas entirely, so whatever ground the host paints
 * underneath is what shows; give the host a layered-gradient ground.
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
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + vec2(11.3, 7.7); a *= 0.5; }
  return v;
}

/* one curtain: glow around a noise-wandering path, with internal rays.
   The rays are the part that makes it aurora rather than nebula — high
   frequency across the curtain, elongated along it, and CONTRASTY (the
   first cut read as one soft blob on film). */
float curtain(vec2 p, float seed, float drift, float width){
  float path = (fbm(vec2(p.y * 0.9 + seed * 13.7, uT * drift + seed * 31.0)) - 0.5) * 1.7;
  float d = abs(p.x - path - (seed - 0.5) * 1.15);
  float body = exp(-d * d / (width * width));
  float rays = fbm(vec2(p.x * 11.0 + seed * 5.0, p.y * 1.1 - uT * (0.10 + 0.09 * seed)));
  rays = 0.25 + 0.75 * pow(rays, 2.2) * 2.2;
  return body * rays;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = vec2((uv.x - 0.5) * (uRes.x / uRes.y), uv.y - 0.5);
  /* the slant — the asymmetry is designed, not accidental */
  float an = -0.42;
  p = mat2(cos(an), -sin(an), sin(an), cos(an)) * p;

  /* the value ramp, straight off the token ramp: n-11 ground, then
     n-5 / n-3 / n-0. No hues here at all — see the header. */
  vec3 GROUND = vec3(0.051, 0.063, 0.071); /* --n-11, the page void  */
  vec3 GREY   = vec3(0.635, 0.667, 0.682); /* --n-5                  */
  vec3 LGREY  = vec3(0.867, 0.886, 0.890); /* --n-3                  */
  vec3 WHITE  = vec3(0.984, 0.988, 0.988); /* --n-0, the tips        */
  vec3 DEEP   = vec3(0.180, 0.373, 0.541); /* --ice-deep, THE colour */

  float c1 = curtain(p, 0.15, 0.045, 0.26);
  float c2 = curtain(p, 0.55, 0.065, 0.15);
  float c3 = curtain(p, 0.85, 0.035, 0.42);

  /* height through the field: 0 at the feet of the curtains, 1 at the tips */
  float h = smoothstep(-0.55, 0.35, p.y);

  /* the broad slow curtain is the dimmest, the tight fast one the
     brightest — the same weighting the ice version used, now read as
     value instead of hue */
  vec3 aur = GREY * c3 * 0.55
           + mix(GREY, LGREY, 0.6) * c1 * 0.85
           + LGREY * c2 * 0.95;
  float tip = pow(max(c2, c1 * 0.8), 3.0);
  aur += WHITE * tip * 0.38;

  vec3 col = GROUND + aur * (0.22 + 0.78 * h);
  /* the one colour, and it goes the OTHER WAY: strongest at the foot,
     absent at the tips. Added after the height ramp so it is not dimmed
     twice by it. */
  col += DEEP * (c1 * 0.9 + c3 * 0.6) * (1.0 - h) * 0.5;

  float vig = smoothstep(1.3, 0.35, length(uv - 0.5) * 1.65);
  col *= vig;
  /* dither so the dark field never bands */
  col += (hash(gl_FragCoord.xy + fract(uT)) - 0.5) * 0.012;
  gl_FragColor = vec4(col, 1.0);
}
`

function createAurora(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', {
    antialias: false,
    alpha: false,
    depth: false,
    powerPreference: 'low-power',
  })
  if (!gl) return null

  const mk = (type: number, src: string) => {
    const s = gl.createShader(type)
    if (!s) return null
    gl.shaderSource(s, src)
    gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('[au] shader:', gl.getShaderInfoLog(s))
      return null
    }
    return s
  }
  const vs = mk(gl.VERTEX_SHADER, VERT)
  const fs = mk(gl.FRAGMENT_SHADER, FRAG)
  if (!vs || !fs) return null
  const prog = gl.createProgram()
  if (!prog) return null
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null
  gl.useProgram(prog)

  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(prog, 'aPos')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

  const uRes = gl.getUniformLocation(prog, 'uRes')
  const uT = gl.getUniformLocation(prog, 'uT')

  const resize = () => {
    /* reduced-res, DPR capped — the aurora is soft by nature, but the
       ray striations need a little more grid than half-res gave them */
    const scale = 0.6 * Math.min(window.devicePixelRatio || 1, 1.5)
    const w = Math.max(2, Math.round(canvas.clientWidth * scale))
    const h = Math.max(2, Math.round(canvas.clientHeight * scale))
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
      gl.viewport(0, 0, w, h)
    }
  }

  const draw = (t: number) => {
    resize()
    gl.uniform2f(uRes, canvas.width, canvas.height)
    gl.uniform1f(uT, t)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  return { draw }
}

/** The one frame reduced motion gets — far enough in that the curtains
 *  have wandered into a composition rather than their flat t=0 state. */
const STILL_T = 12.0

export default function Aurora({
  className,
  speed = 0.6,
}: {
  className?: string
  speed?: number
}) {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const aurora = createAurora(canvas)
    if (!aurora) {
      /* no WebGL: get out of the host's way rather than painting black */
      canvas.style.display = 'none'
      return
    }
    canvas.dataset.gl = 'on'

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      aurora.draw(STILL_T)
      /* it still has to survive a resize, or the still stretches */
      const onResize = () => aurora.draw(STILL_T)
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    }

    const tick = () => {
      const r = canvas.getBoundingClientRect()
      if (r.bottom < -100 || r.top > window.innerHeight + 100) return
      aurora.draw(gsap.ticker.time * speed)
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [speed])

  return (
    <canvas ref={ref} className={`au${className ? ` ${className}` : ''}`} aria-hidden="true" />
  )
}
