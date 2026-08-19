'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion-v4'

/**
 * SECTION 6 — THE INTERLUDE (user-directed 2026-08-18 evening; reference
 * public/interlude_website.png). The section where "we play with motion and
 * hover interactions smartly" is proven rather than claimed.
 *
 * FOUR SYSTEMS:
 *
 * 1. THE DOOR — the turn-on, SCRUBBED (amended same evening, user: no
 *    glitch, "smoothly", and the open/close is part of the choreography).
 *    The section pins and the scroll drives everything: the hairline draws
 *    from the centre across the first stretch of the scrub, the dark stage
 *    expands vertically out of it, the word / card / rings resolve, and the
 *    rest of the pin is dwell inside the world. Every tween is ease:'none'
 *    — the hand supplies the easing, Lenis the smoothing, exactly like the
 *    page-turn. Being a scrub makes it REVERSIBLE by construction:
 *    scrolling back up closes the world through the same door. Pre-states
 *    and the pin (is-scrub + JS-set height) exist only under JS — the
 *    no-JS / reduced-motion page gets a static, open, 100svh stage in flow.
 *
 * 2. THE AURORA. Ink ground under hand-written WebGL northern lights: three
 *    wandering curtains (fbm-driven paths) with internal rays and white
 *    tips, the whole field slanted so the composition reads asymmetric.
 *    Palette is the system's: ice, ice-deep, white over ink. Raw WebGL
 *    fullscreen triangle — no three.js for one shader — on a HALF-RES
 *    canvas the CSS upscales (aurora is soft; the res is free money).
 *    Driven by the shared ticker, only while the stage is near the
 *    viewport. Fallback for no-JS / reduced motion / context failure: the
 *    stage's layered CSS gradients underneath the canvas.
 *
 * 3. THE WORD. One giant uppercase word, JS-fitted edge to edge, low-alpha,
 *    BEHIND the card. Whichever side of the stage the pointer is on, that
 *    side of the word fades fully out — a mask gradient whose end-stop
 *    alphas lerp on the ticker; back to symmetric on leave.
 *
 * 4. THE ULTRA CARD. Chrome/glass (NO backdrop-filter — it re-rasterises
 *    the fluid, the nav learned this), faded neon SVG grid, statements on
 *    top, four PageSpeed-style rings (Performance / Accessibility / Best
 *    Practices / SEO) drawing to their scores while the numbers count up.
 *    Tilts toward the cursor about its own centre (parent perspective +
 *    lerped rotateX/rotateY, fed from anywhere on the stage) and carries a
 *    specular sheen that follows the pointer across the face.
 *
 * SEO: the word, statements, labels and scores are server-rendered DOM
 * text; the rings' final dashoffsets are inline styles, so the no-JS page
 * shows the true scores. All copy PLACEHOLDER (checklist 6.6).
 */

const RINGS: { label: string; value: number }[] = [
  { label: 'Performance', value: 99 },
  { label: 'Accessibility', value: 100 },
  { label: 'Best practices', value: 100 },
  { label: 'SEO', value: 100 },
]

const WORD = 'Remembered'

/* ---------------- the aurora ---------------- */

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

  vec3 ink  = vec3(0.024, 0.034, 0.050);
  vec3 ice  = vec3(0.498, 0.659, 0.788);
  vec3 deep = vec3(0.180, 0.373, 0.541);

  float c1 = curtain(p, 0.15, 0.045, 0.26);
  float c2 = curtain(p, 0.55, 0.065, 0.15);
  float c3 = curtain(p, 0.85, 0.035, 0.42);

  float h = smoothstep(-0.55, 0.35, p.y);
  vec3 aur = deep * c3 * 0.55 + mix(deep, ice, 0.6) * c1 * 0.85 + ice * c2 * 0.95;
  float tip = pow(max(c2, c1 * 0.8), 3.0);
  aur += vec3(0.92, 0.96, 1.0) * tip * 0.38;

  vec3 col = ink + aur * (0.22 + 0.78 * h);
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
      console.warn('[iv] shader:', gl.getShaderInfoLog(s))
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

/* ---------------- the section ---------------- */

/**
 * `buried` — §7 rises over this section as an opaque sheet and buries it
 * (see Process.tsx). It costs the pin ONE extra viewport of runway at the
 * end, which the scrub deliberately does not consume: the world finishes
 * opening exactly as the burial begins, then holds while it is covered. The
 * frame drifts up at 0.45× through that beat, so the interlude is neither
 * frozen nor travelling with the page — it is moving slower, which is what
 * reads as depth. Set together with §7's own overlap in page.tsx.
 */
export default function Interlude({ buried = false }: { buried?: boolean }) {
  const rootRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const q = <T extends HTMLElement>(sel: string) => root.querySelector<T>(sel)
    const frame = q('.iv-frame')
    const stage = q('.iv-stage')
    const line = q('.iv-line')
    const bloom = q('.iv-bloom')
    const word = q('.iv-word')
    const wordInner = q('.iv-word span')
    const card = q('.iv-card')
    const canvas = root.querySelector<HTMLCanvasElement>('.iv-aurora')
    const ringArcs = Array.from(root.querySelectorAll<SVGCircleElement>('.iv-ring-val'))
    const ringNums = Array.from(root.querySelectorAll<HTMLElement>('.iv-ring-num'))
    if (!frame || !stage || !line || !bloom || !word || !wordInner || !card || !canvas) return

    const aurora = createAurora(canvas)

    /* fit the word edge to edge — re-measured once fonts land and on resize */
    const fit = () => {
      wordInner.style.fontSize = '100px'
      const w = wordInner.scrollWidth
      if (w > 0) {
        wordInner.style.fontSize = `${(100 * (stage.clientWidth * 0.99)) / w}px`
      }
    }
    fit()
    document.fonts?.ready.then(fit).catch(() => {})
    window.addEventListener('resize', fit)

    if (reduced) {
      /* stage open, scores true, one aurora frame — a still that is
         complete rather than a paused animation */
      aurora?.draw(12.0)
      return () => window.removeEventListener('resize', fit)
    }

    /* ---- pre-states (JS-only, so no-JS never sees them) ---- */
    gsap.set(stage, { scaleY: 0.004, opacity: 0 })
    gsap.set(line, { scaleX: 0, opacity: 1 })
    gsap.set([word, card], { opacity: 0 })
    gsap.set(ringArcs, { strokeDashoffset: 100 })
    ringNums.forEach((el) => (el.textContent = '0'))

    /* ---- the door: pin the section, let the scroll drive the timeline.
       Segment map over the scrub (0..1): line 0→.14 · stage .15→.45 ·
       word .45 / card .50 / rings .56→.76 · dwell .78→1. Everything
       ease:'none' and fromTo'd with immediateRender:false so the scrub is
       exact in BOTH directions — scrolling up closes the world. ---- */
    const SCRUB_VH = 170
    /* the burial runway: one viewport the scrub does NOT spend, so §7 has
       something to climb over while the open world holds */
    const TAIL_VH = buried ? 100 : 0
    root.classList.add('is-scrub')
    root.style.height = `${SCRUB_VH + 100 + TAIL_VH}svh`

    const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } })
    tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.14 }, 0)
    tl.set(stage, { opacity: 1 }, 0.15)
    tl.fromTo(
      stage,
      { scaleY: 0.004 },
      { scaleY: 1, duration: 0.3, immediateRender: false },
      0.15,
    )
    tl.to(line, { opacity: 0, duration: 0.06 }, 0.38)
    /* the phosphor bloom — the one theatrical note that survived the
       glitch cut; it is smooth */
    tl.fromTo(
      bloom,
      { opacity: 0.32 },
      { opacity: 0, duration: 0.14, immediateRender: false },
      0.4,
    )
    tl.fromTo(
      word,
      { opacity: 0, filter: 'blur(16px)' },
      { opacity: 1, filter: 'blur(0px)', duration: 0.16, immediateRender: false },
      0.45,
    )
    tl.fromTo(
      card,
      { opacity: 0, y: 30, filter: 'blur(14px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.17, immediateRender: false },
      0.5,
    )
    tl.fromTo(
      ringArcs,
      { strokeDashoffset: 100 },
      {
        strokeDashoffset: (i: number) => 100 - RINGS[i].value,
        duration: 0.18,
        stagger: 0.02,
        immediateRender: false,
      },
      0.56,
    )
    ringNums.forEach((el, i) => {
      const o = { v: 0 }
      tl.fromTo(
        o,
        { v: 0 },
        {
          v: RINGS[i].value,
          duration: 0.18,
          immediateRender: false,
          onUpdate: () => {
            el.textContent = String(Math.round(o.v))
          },
        },
        0.56 + i * 0.02,
      )
    })

    /* ---- the pointer systems: word split, tilt, sheen ---- */
    let mT = 0 // word-split target, -1 left … 1 right
    let m = 0
    let rxT = 0
    let ryT = 0
    let rx = 0
    let ry = 0
    let sxT = 50
    let syT = 50
    let sx = 50
    let sy = 50

    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect()
      const nx = (e.clientX - r.left) / r.width
      mT = gsap.utils.clamp(-1, 1, (nx - 0.5) * 2.6)
      const c = card.getBoundingClientRect()
      const cx = (e.clientX - (c.left + c.width / 2)) / (c.width / 2)
      const cy = (e.clientY - (c.top + c.height / 2)) / (c.height / 2)
      ryT = gsap.utils.clamp(-1.6, 1.6, cx) * 7
      rxT = gsap.utils.clamp(-1.6, 1.6, cy) * -6
      sxT = gsap.utils.clamp(0, 100, ((e.clientX - c.left) / c.width) * 100)
      syT = gsap.utils.clamp(0, 100, ((e.clientY - c.top) / c.height) * 100)
    }
    const onLeave = () => {
      mT = 0
      rxT = 0
      ryT = 0
    }
    stage.addEventListener('pointermove', onMove)
    stage.addEventListener('pointerleave', onLeave)

    const tick = () => {
      const r = root.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < -100 || r.top > vh + 100) return
      const tail = buried ? vh : 0
      /* the scrub: playhead = pin progress, in both directions. The tail is
         excluded from the denominator, so the pacing is identical whether or
         not §7 is there to bury it. */
      const p = gsap.utils.clamp(0, 1, -r.top / Math.max(r.height - vh - tail, 1))
      tl.progress(p)
      /* THE BURIAL. §7 sits at margin-top −100svh, so its top edge is at
         r.bottom − vh: it enters the viewport bottom when r.bottom = 2vh and
         covers this frame completely at r.bottom = vh. Across exactly that
         window the frame drifts up at 0.45×, half the speed of the sheet
         climbing over it. 0.45 always beats §7's 1.0, so the sheet's top
         edge never falls behind the frame's bottom and no bare ground can
         open between them. */
      if (buried) {
        const d = gsap.utils.clamp(0, vh, 2 * vh - r.bottom)
        gsap.set(frame, { y: -0.45 * d })
      }
      if (p > 0.1 && aurora) aurora.draw(gsap.ticker.time * 0.6)
      m += (mT - m) * 0.07
      rx += (rxT - rx) * 0.08
      ry += (ryT - ry) * 0.08
      sx += (sxT - sx) * 0.1
      sy += (syT - sy) * 0.1
      /* the side the pointer is on goes transparent */
      const wl = gsap.utils.clamp(0, 1, 1 + m)
      const wr = gsap.utils.clamp(0, 1, 1 - m)
      word.style.setProperty('--wl', wl.toFixed(3))
      word.style.setProperty('--wr', wr.toFixed(3))
      gsap.set(card, { rotateX: rx, rotateY: ry })
      card.style.setProperty('--sx', `${sx.toFixed(2)}%`)
      card.style.setProperty('--sy', `${sy.toFixed(2)}%`)
    }
    gsap.ticker.add(tick)

    return () => {
      window.removeEventListener('resize', fit)
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerleave', onLeave)
      gsap.ticker.remove(tick)
      tl.kill()
      root.classList.remove('is-scrub')
      root.style.height = ''
      gsap.set(frame, { clearProps: 'transform' })
    }
  }, [buried])

  return (
    <section ref={rootRef} className="iv">
      {/* the CRT line the stage expands out of */}
      <div className="iv-frame">
        <i className="iv-line" aria-hidden="true" />
        <div className="iv-stage">
          <canvas className="iv-aurora" aria-hidden="true" />
          <div className="iv-bloom" aria-hidden="true" />

          <p className="iv-word" aria-hidden="true">
            <span>{WORD}</span>
          </p>

          <div className="iv-cardpos">
            <div className="iv-card">
              {/* the faded neon grid */}
              <svg className="iv-grid" aria-hidden="true" focusable="false">
                <defs>
                  <pattern id="iv-gridp" width="28" height="28" patternUnits="userSpaceOnUse">
                    <path d="M28 0 H0 V28" fill="none" stroke="currentColor" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#iv-gridp)" />
              </svg>
              <i className="iv-sheen" aria-hidden="true" />

              <div className="iv-card-head">
                <p className="iv-card-kicker t-small">Every build ships measured</p>
                <p className="iv-card-line">
                  Speed, access and search aren’t features. They’re the floor.
                </p>
              </div>

              <div className="iv-rings">
                {RINGS.map((r) => (
                  <div
                    className="iv-ring"
                    key={r.label}
                    role="img"
                    aria-label={`${r.label}: ${r.value} of 100`}
                  >
                    <div className="iv-ring-dial">
                      <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
                        <circle className="iv-ring-track" cx="32" cy="32" r="27" />
                        <circle
                          className="iv-ring-val"
                          cx="32"
                          cy="32"
                          r="27"
                          pathLength={100}
                          /* true score server-side — no-JS reads the real ring */
                          style={{ strokeDashoffset: 100 - r.value }}
                        />
                      </svg>
                      <span className="iv-ring-num">{r.value}</span>
                    </div>
                    <span className="iv-ring-label t-small">{r.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <noscript>
            <style>{`.iv-aurora{display:none}`}</style>
          </noscript>
        </div>
      </div>
    </section>
  )
}
