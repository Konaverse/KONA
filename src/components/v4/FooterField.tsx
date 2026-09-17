'use client'

import { useEffect, useRef } from 'react'
import { gsap, rem } from '@/lib/motion-v4'

/**
 * THE FOOTER'S GROUND — THE FIELD (2026-09-18, user: "the background
 * also can be improved. I would like something animated or
 * interactive").
 *
 * The void stays the void; on it, a LATTICE of fine points, drawn by one
 * fragment shader (no particles, no buffers — every pixel asks which
 * lattice point it belongs to, so the cost is a flat fill). What moves:
 *
 *   · THE HAND IS A LENS. Around the pointer the lattice is sampled
 *     nearer its centre, so the points swell, part and brighten as if
 *     pushed up from under the glass; the lens follows the hand on a
 *     glide and fades when the hand leaves.
 *   · A PRESS RINGS. pointerdown sends one ring out through the points.
 *   · IDLE, IT BREATHES. A band of light drifts across on the diagonal,
 *     a slow swell shifts the lattice a fraction of a cell, and each
 *     point keeps its own faint pulse.
 *   · THE REVEAL POWERS IT ON. The points come up from the seam down as
 *     the footer slides out from under the page (its own rect, read per
 *     frame — the same travel SiteFooter's under-reveal rides).
 *
 * References (21st.dev, read as film): "Dotted Grid", "Interactive
 * Dots", "Spider Particles" — the magnetic dot ground; ours is a shader,
 * house black and white, and it answers the reveal.
 *
 * Draws only while the footer is on screen. Reduced motion: one still
 * frame, no lens. No WebGL / no JS: the CSS lattice under the canvas
 * (tokens.css `.ft-field`) stands.
 */

const VERT = `attribute vec2 aPos; void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uT;
uniform float uCell;
uniform float uPx;
uniform vec2 uHand;
uniform float uHandOn;
uniform vec3 uRip;
uniform float uPower;
uniform float uPaper;
uniform float uQuiet;

void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);

  /* the lens */
  vec2 d = p - uHand;
  float R = uCell * 8.0;
  float k = exp(-dot(d, d) / (R * R)) * uHandOn * (1.0 - uQuiet);
  vec2 q = p - d * k * 0.46;

  /* the swell */
  float sw = sin((q.x * 0.9 + q.y * 0.6) / uCell * 0.2 - uT * 0.7);
  q += vec2(0.6, -0.4) * sw * uCell * 0.14;

  vec2 g = q / uCell;
  vec2 id = floor(g);
  float dist = length(fract(g) - 0.5) * uCell;

  /* the drifting band, the ring, the point's own pulse */
  float band = smoothstep(0.6, 1.0, sin((id.x * 0.33 - id.y * 0.52) * 0.34 + uT * 0.42) * 0.5 + 0.5);
  float rr = length(p - uRip.xy);
  float ring = exp(-pow((rr - uRip.z * 1100.0 * uPx) / (uCell * 1.5), 2.0)) * max(0.0, 1.0 - uRip.z * 0.75);
  float h = fract(sin(dot(id, vec2(127.1, 311.7))) * 43758.5453);
  float pulse = 0.78 + 0.22 * sin(uT * 1.25 + h * 6.2832);

  float rad = (0.85 + k * 2.7 + band * 0.75 + ring * 2.3) * uPx;
  float a = 1.0 - smoothstep(rad - 0.8 * uPx, rad + 0.8 * uPx, dist);
  /* quiet: no lattice at rest, no band, no lens — the points exist only
     where a ring is passing */
  float lum = (0.15 + band * 0.24) * pulse * (1.0 - uQuiet) + k * 0.8 + ring * (0.75 + 0.2 * uQuiet);

  /* the reveal powers it on, from the seam down */
  float on = smoothstep(0.0, 0.22, uPower * 1.22 - p.y / uRes.y);

  /* on the void the points are light; on paper they are ink */
  vec3 ground = mix(vec3(13.0, 16.0, 18.0), vec3(244.0, 246.0, 246.0), uPaper) / 255.0;
  float sgn = 1.0 - 2.0 * uPaper;
  vec3 col = ground + sgn * (vec3(lum * a * on) + vec3(0.045) * k * on * (1.0 - uPaper));
  gl_FragColor = vec4(col, 1.0);
}
`

/** the lattice's cell, in rem (tokens.css `.ft-field` draws the same) */
const CELL = 1.375
/** the lens's glide to the hand, and its fade (s) */
const FOLLOW = 0.1
const FADE = 0.35
/** the one frame reduced motion gets */
const STILL_T = 21

export default function FooterField({
  tone = 'void',
  quiet = false,
}: {
  /** the ground the points stand on: the footer's void, or paper (the Invitation) */
  tone?: 'void' | 'paper'
  /** nothing at rest — only a press's ring brings the points up (the
   *  Invitation, 2026-09-18: the user cut the animated ground there and
   *  kept the ring) */
  quiet?: boolean
}) {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    const host = canvas?.parentElement
    if (!canvas || !host) return
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'low-power' })
    if (!gl) return
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null
    }
    const vs = sh(gl.VERTEX_SHADER, VERT)
    const fs = sh(gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return
    const prog = gl.createProgram()!
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
    const U = (n: string) => gl.getUniformLocation(prog, n)
    const uRes = U('uRes')
    const uT = U('uT')
    const uCell = U('uCell')
    const uPx = U('uPx')
    const uHand = U('uHand')
    const uHandOn = U('uHandOn')
    const uRip = U('uRip')
    const uPower = U('uPower')
    gl.uniform1f(U('uPaper'), tone === 'paper' ? 1 : 0)
    gl.uniform1f(U('uQuiet'), quiet ? 1 : 0)

    let dpr = 1
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const w = Math.max(2, Math.round(host.offsetWidth * dpr))
      const h = Math.max(2, Math.round(host.offsetHeight * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
      gl.uniform2f(uRes, w, h)
      gl.uniform1f(uCell, CELL * 16 * rem() * dpr)
      gl.uniform1f(uPx, rem() * dpr)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(host)
    if (!quiet) canvas.classList.add('is-live')

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    /* quiet and still: there is nothing to show */
    if (reduce && quiet) return () => ro.disconnect()
    if (reduce) {
      gl.uniform1f(uT, STILL_T)
      gl.uniform2f(uHand, -9999, -9999)
      gl.uniform1f(uHandOn, 0)
      gl.uniform3f(uRip, -9999, -9999, 9)
      gl.uniform1f(uPower, 1)
      const still = () => gl.drawArrays(gl.TRIANGLES, 0, 3)
      still()
      const ro2 = new ResizeObserver(still)
      ro2.observe(host)
      return () => {
        ro.disconnect()
        ro2.disconnect()
      }
    }

    /* the hand: its last known place on the page; presence per frame */
    let px = -1
    let py = -1
    const onMove = (ev: PointerEvent) => {
      px = ev.clientX
      py = ev.clientY
    }
    const onGone = () => (px = -1)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onGone)
    const rip = { x: -9999, y: -9999, age: 9 }
    const onDown = (ev: PointerEvent) => {
      const r = host.getBoundingClientRect()
      rip.x = (ev.clientX - r.left) * dpr
      rip.y = (ev.clientY - r.top) * dpr
      rip.age = 0
    }
    /* the press is heard on the footer itself: the field lies under its content */
    const footer = host.parentElement ?? host
    footer.addEventListener('pointerdown', onDown)

    let hx = 0
    let hy = 0
    let on = 0
    const tick = (_t?: number, deltaTime?: number) => {
      const r = host.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.top > vh || r.bottom < 0) return
      const dt = Math.min(0.05, (deltaTime ?? 16.7) / 1000)
      const inside = px >= 0 && py >= r.top && py <= r.bottom
      if (inside) {
        const tx = (px - r.left) * dpr
        const ty = (py - r.top) * dpr
        if (on < 0.02) {
          hx = tx
          hy = ty
        }
        const f = 1 - Math.exp(-dt / FOLLOW)
        hx += (tx - hx) * f
        hy += (ty - hy) * f
      }
      on += ((inside ? 1 : 0) - on) * (1 - Math.exp(-dt / FADE))
      if (rip.age < 2) rip.age += dt * 0.85
      /* quiet: the canvas is on the page only while a ring is out */
      if (quiet) {
        const ringing = rip.age < 1.5
        canvas.classList.toggle('is-live', ringing)
        if (!ringing) return
      }
      /* the seam's travel: how much of the footer is out from under the page */
      const power = Math.max(0, Math.min(1, (vh - r.top) / Math.min(r.height, vh)))
      gl.uniform1f(uT, gsap.ticker.time)
      gl.uniform2f(uHand, hx, hy)
      gl.uniform1f(uHandOn, on)
      gl.uniform3f(uRip, rip.x, rip.y, rip.age)
      gl.uniform1f(uPower, power)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onGone)
      footer.removeEventListener('pointerdown', onDown)
      canvas.classList.remove('is-live')
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [tone, quiet])

  return (
    <div className={`ft-field${tone === 'paper' ? ' ft-field--paper' : ''}${quiet ? ' ft-field--quiet' : ''}`} aria-hidden="true">
      <canvas ref={ref} />
    </div>
  )
}
