'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion-v4'

/**
 * THE MEDIA PEEL — prototype (2026-08-19).
 *
 * Reverse-engineered from upsunday.co's production bundle, whose own shader
 * comments credit "the original Lusion curl" (lusion.co's signature media
 * transition). The mechanic, in one sentence: the video is a texture on a
 * densely subdivided WebGL plane, and EVERY VERTEX travels from the small
 * card rect to the full-bleed rect on its own slightly offset schedule — a
 * corner-weighted stagger. No cloth sim, no physics: the "fluid page" look
 * is nothing but per-vertex easing offsets.
 *
 * How it is wired here, in the v4 idiom:
 *
 * - Raw WebGL (like the Interlude aurora — no three.js for one shader). A
 *   140x90-segment grid, indexed triangles, one program.
 * - Two DOM rects read live every tick: the in-flow card (`uFrom`) and the
 *   pinned 100svh frame (`uTo`). Reading them live means the plane tracks
 *   the card while the section approaches, and rides the frame off-screen
 *   after the pin releases — the fullscreen video scrolls away naturally.
 * - The scrub: pin the section (is-scrub + JS height, sticky frame, the
 *   Interlude pattern), progress = pin progress, `uShow` lerped toward it.
 *   Reversible by construction — scrolling back re-folds the sheet.
 * - The canvas is fixed, full-viewport, pointer-events none, z-index 30:
 *   over the page, under the fluid cursor (40) and the nav (50) — so the
 *   liquid trail plays on top of the fullscreen video, which is exactly
 *   where upsunday put theirs (they warp the video BY their fluid field).
 *
 * Fallbacks: no JS / reduced motion / no WebGL → the plain DOM card with
 * the playing (or poster'd) video, in flow, no pin. The GL only ever
 * REPLACES a working default.
 */

const SEG_X = 140
const SEG_Y = 90
const RADIUS = 18 // card corner radius, CSS px — constant at any size (SDF mask)
const SCRUB_VH = 170 // pin runway beyond the frame's own viewport

const VERT = `
attribute vec2 aUv;
uniform vec4 uFrom;   /* x,y,w,h — CSS px, top-left origin, y down */
uniform vec4 uTo;
uniform float uShow;  /* 0..1 */
uniform vec2 uVp;     /* viewport CSS px */
varying vec2 vUv;
varying vec2 vRectWH;

void main() {
  vec2 p = aUv;
  /* corner-weighted stagger — THE trick. Each vertex gets its own
     smoothstep window over the shared uShow: bottom-right leads (pw 0,
     window 0..0.55), top-left trails (pw 1, window 0.45..1). Mid-scrub,
     some vertices have arrived while others haven't left — that stretch
     IS the peel. */
  float pw = 1.0 - (pow(p.x * p.x, 0.75) + pow(p.y, 1.5)) * 0.5;
  float sr = smoothstep(pw * 0.45, 0.55 + pw * 0.45, uShow);

  vec4 rect = mix(uFrom, uTo, sr);
  /* transient horizontal wobble — zero at both ends */
  rect.x += mix(rect.z, 0.0, cos(sr * 6.2831853) * 0.5 + 0.5) * 0.06;

  vec2 sp = rect.xy + p * rect.zw;
  /* transient tilt about the rect centre — a bump that peaks mid-flight */
  float rot = (smoothstep(0.0, 1.0, sr) - sr) * -1.05;
  vec2 ctr = rect.xy + rect.zw * 0.5;
  vec2 rel = sp - ctr;
  float s = sin(rot), c = cos(rot);
  sp = ctr + mat2(c, -s, s, c) * rel;

  gl_Position = vec4(sp.x / uVp.x * 2.0 - 1.0, 1.0 - sp.y / uVp.y * 2.0, 0.0, 1.0);
  vUv = p;
  vRectWH = rect.zw;
}
`

const FRAG = `
precision highp float;
uniform sampler2D uTex;
uniform float uVideoAspect;
uniform float uRadius;
varying vec2 vUv;
varying vec2 vRectWH;

void main() {
  /* object-fit: cover, in shader — the video never distorts while the
     rect changes aspect mid-peel */
  float planeAspect = vRectWH.x / max(vRectWH.y, 1.0);
  vec2 s = planeAspect > uVideoAspect
    ? vec2(1.0, uVideoAspect / planeAspect)
    : vec2(planeAspect / uVideoAspect, 1.0);
  vec2 uv = (vUv - 0.5) * s + 0.5;
  vec3 col = texture2D(uTex, uv).rgb;

  /* rounded-rect SDF mask with a CONSTANT px radius — CSS border-radius
     cannot survive this morph; the 2px smoothstep is also the edge AA */
  vec2 px = vUv * vRectWH;
  vec2 halfR = vRectWH * 0.5;
  float r = min(uRadius, min(halfR.x, halfR.y));
  vec2 q = abs(px - halfR) - (halfR - vec2(r));
  float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  float alpha = 1.0 - smoothstep(-1.0, 1.0, d);
  gl_FragColor = vec4(col * alpha, alpha); /* premultiplied */
}
`

type Rect = { left: number; top: number; width: number; height: number }

function createPeel(canvas: HTMLCanvasElement, video: HTMLVideoElement) {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    depth: false,
    premultipliedAlpha: true,
  })
  if (!gl) return null

  const mk = (type: number, src: string) => {
    const s = gl.createShader(type)
    if (!s) return null
    gl.shaderSource(s, src)
    gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('[mp] shader:', gl.getShaderInfoLog(s))
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

  /* the grid — (SEG_X+1)*(SEG_Y+1) = 12,831 verts, still under the Uint16
     index ceiling. Density is what lets the sheet bend smoothly. */
  const verts = new Float32Array((SEG_X + 1) * (SEG_Y + 1) * 2)
  let vi = 0
  for (let y = 0; y <= SEG_Y; y++) {
    for (let x = 0; x <= SEG_X; x++) {
      verts[vi++] = x / SEG_X
      verts[vi++] = y / SEG_Y
    }
  }
  const idx = new Uint16Array(SEG_X * SEG_Y * 6)
  let ii = 0
  for (let y = 0; y < SEG_Y; y++) {
    for (let x = 0; x < SEG_X; x++) {
      const i0 = y * (SEG_X + 1) + x
      const i2 = i0 + SEG_X + 1
      idx[ii++] = i0
      idx[ii++] = i2
      idx[ii++] = i0 + 1
      idx[ii++] = i0 + 1
      idx[ii++] = i2
      idx[ii++] = i2 + 1
    }
  }
  const vbuf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vbuf)
  gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(prog, 'aUv')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
  const ibuf = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuf)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW)

  const tex = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  /* ink-coloured texel until the first video frame lands — the pre-ready
     card reads as an intentional dark slab, not a glitch */
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([21, 23, 26]))

  gl.enable(gl.BLEND)
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
  gl.clearColor(0, 0, 0, 0)

  const uFrom = gl.getUniformLocation(prog, 'uFrom')
  const uTo = gl.getUniformLocation(prog, 'uTo')
  const uShow = gl.getUniformLocation(prog, 'uShow')
  const uVp = gl.getUniformLocation(prog, 'uVp')
  const uTexL = gl.getUniformLocation(prog, 'uTex')
  const uAspect = gl.getUniformLocation(prog, 'uVideoAspect')
  const uRadius = gl.getUniformLocation(prog, 'uRadius')
  gl.uniform1i(uTexL, 0)
  gl.uniform1f(uAspect, 16 / 9)
  gl.uniform1f(uRadius, RADIUS)

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = Math.max(2, Math.round(canvas.clientWidth * dpr))
    const h = Math.max(2, Math.round(canvas.clientHeight * dpr))
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
      gl.viewport(0, 0, w, h)
    }
  }

  let lastT = -1
  const draw = (from: Rect, to: Rect, show: number) => {
    resize()
    if (video.readyState >= 2 && video.currentTime !== lastT) {
      lastT = video.currentTime
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video)
      if (video.videoWidth) gl.uniform1f(uAspect, video.videoWidth / video.videoHeight)
    }
    gl.uniform4f(uFrom, from.left, from.top, Math.max(1, from.width), Math.max(1, from.height))
    gl.uniform4f(uTo, to.left, to.top, Math.max(1, to.width), Math.max(1, to.height))
    gl.uniform1f(uShow, show)
    gl.uniform2f(uVp, canvas.clientWidth, canvas.clientHeight)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0)
  }
  const clear = () => {
    gl.clear(gl.COLOR_BUFFER_BIT)
  }

  return { draw, clear }
}

export default function MediaPeel({ src, ariaLabel }: { src: string; ariaLabel: string }) {
  const rootRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const frame = root.querySelector<HTMLElement>('.mp-frame')
    const card = root.querySelector<HTMLElement>('.mp-card')
    const video = root.querySelector<HTMLVideoElement>('.mp-video')
    const canvas = root.querySelector<HTMLCanvasElement>('.mp-canvas')
    if (!frame || !card || !video || !canvas) return

    const peel = createPeel(canvas, video)
    if (!peel) return // no WebGL → the DOM card stands as-is

    root.classList.add('is-scrub', 'is-gl')
    root.style.height = `${SCRUB_VH + 100}svh`

    let show = 0
    let off = false
    const tick = () => {
      const r = root.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < -80 || r.top > vh + 80) {
        if (!off) {
          off = true
          peel.clear()
          video.pause()
        }
        return
      }
      if (off) {
        off = false
        video.play().catch(() => {})
      }
      /* pin progress → uShow target: dwell on the card for the first 10%,
         land fullscreen with 12% still in hand. The lerp on top of Lenis is
         the same double-smoothing upsunday runs — the stagger reads best
         when uShow itself never steps. */
      const p = gsap.utils.clamp(0, 1, -r.top / Math.max(r.height - vh, 1))
      const target = gsap.utils.clamp(0, 1, (p - 0.1) / 0.78)
      show += (target - show) * 0.16
      if (Math.abs(target - show) < 0.0005) show = target
      peel.draw(card.getBoundingClientRect(), frame.getBoundingClientRect(), show)
    }
    /* one frame late ON PURPOSE: gsap.ticker runs callbacks in add order, and
       React mounts this (child) effect before SmoothScroll's (parent) — adding
       here directly would read the rects BEFORE Lenis moves the page each
       frame, and the plane trails the scroll by one frame (~15px at speed;
       take 1 filmed exactly that). Deferring the add puts this tick after
       Lenis's, so the rects are current-frame. */
    const rafId = requestAnimationFrame(() => gsap.ticker.add(tick))

    return () => {
      cancelAnimationFrame(rafId)
      gsap.ticker.remove(tick)
      root.classList.remove('is-scrub', 'is-gl')
      root.style.height = ''
    }
  }, [])

  return (
    <section ref={rootRef} className="mp">
      <div className="mp-frame">
        <div className="mp-card" role="img" aria-label={ariaLabel}>
          <video className="mp-video" src={src} autoPlay muted loop playsInline preload="auto" />
        </div>
      </div>
      <canvas className="mp-canvas" aria-hidden="true" />
    </section>
  )
}
