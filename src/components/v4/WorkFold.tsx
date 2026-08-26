'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion-v4'
import type { SheetProject } from '@/components/v4/ProjectSheets'

/**
 * §5 ON PHONES — THE FOLD DECK (2026-08-26, user-chosen over "the scan"
 * and "the film strip"; the brief: "something fascinating and different
 * and more usable … surely not one viewport each project because websites
 * are landscape and the viewport on mobile is portrait").
 *
 * The desktop page-turn (ProjectSheets) turns full-bleed portrait sheets
 * over each other, and the captures are 2880x2000 laptop frames — on a
 * phone every sheet was a landscape site cropped to a tall slot with most
 * of it lost. So under 57.5rem this section replaces it (ProjectSheets is
 * display:none there and returns early; this one is the reverse — the two
 * share the `#work` wrapper in page.tsx).
 *
 * THE MOVE IS OURS. One pinned LANDSCAPE window at the capture's own
 * aspect, so nothing is cropped; the three projects are stacked in it,
 * first on top. As you scroll, the top sheet is grabbed by its top-right
 * corner and FOLDS AWAY — the hero peel's eight-corner clock, the same w
 * field, the same reflect-past-the-hinge fold, the same ripple — and the
 * folded bundle carries off through the bottom-left corner, revealing the
 * next project underneath. Under the window the caption resolves per
 * project; a counter keeps the place. Whole window = the live site.
 *
 * MECHANICS
 * - Progress p = scroll through the section; t = p × (n − 1) is which
 *   turn (k = floor) and how far (e = frac). Sheet k folds at uShow = e;
 *   sheets before k are gone, sheets after k sit underneath in DOM order.
 * - The GL canvas sits exactly over the window (same grid cell, same
 *   width, same aspect, same radius). It draws ONLY mid-turn: at e = 0 the
 *   DOM sheet shows, at 0 < e < 1 that sheet goes visibility:hidden and the
 *   canvas draws its texture folding, at e ≥ 1 the sheet stays hidden and
 *   the canvas clears. So at rest the pixels are always DOM.
 * - Textures are the DOM <img> elements themselves (srcset-picked),
 *   uploaded once each as they finish loading; a turn whose texture is
 *   not ready yet just waits for it (retried per frame).
 * - The shader is a trimmed sibling of HeroPeel's: no landing, no
 *   opening morph, no stretch — those belong to a sheet becoming another
 *   section's background. What is kept is the choreography: fold field,
 *   hinge sweep, theta, back-face grade, ripple. If the hero's fold
 *   character is ever retuned, retune here too.
 * - Scrub, not playback: every value is a pure function of scroll (Lenis
 *   smooths the scroll on wheel; touch is native), read one frame after
 *   Lenis on the ticker like every other scrubbed section.
 *
 * FALLBACKS. Without JS / with reduced motion the section is a plain
 * vertical list — window, caption, window, caption — which is what the
 * markup IS; `.is-scrub` (added by the driver) is what stacks it and pins
 * it. Without WebGL the driver still runs: the stack, the counter and the
 * captions work, and a turn is a hard cut at its end instead of a fold.
 * All copy is real DOM text (SEO D5).
 */

/* the fold mesh — same density class as the hero's, a phone draws it free */
const SEG_X = 120
const SEG_Y = 80
/** scroll length of one turn, in small-viewport heights */
const TURN_SVH = 80

const VERT = `
attribute vec2 aUv;
uniform vec2 uSize;   /* the window, CSS px */
uniform float uShow;  /* 0..1, the turn */
varying vec2 vUv;
varying float vBack;

void main() {
  vec2 p = aUv;
  /* the eight-corner clock, verbatim from HeroPeel: one scalar field
     orders the corners 1 (top right) -> 2,8 -> 3,7 -> 4,6 -> 5 */
  float w = (1.4 * (1.0 - p.x) + p.y) / 2.4;
  vec2 pos = p * uSize;

  /* the hinge sweeps the field across the first ~62% of the turn, eased
     hot so the grab is on the first pixel; it overshoots to 1.3 so the
     last corner (w = 1) is fully released, not merely reached */
  float W = 1.3 * pow(clamp(uShow / 0.62, 0.0, 1.0), 0.75);
  float dw = max(W - w, 0.0);
  float theta = 2.827 * smoothstep(0.0, 0.16, dw);
  vec2 nfold = normalize(vec2(-1.4 / uSize.x, 1.0 / uSize.y)); /* down-left */
  float wpx = 2.4 / length(vec2(1.4 / uSize.x, 1.0 / uSize.y)); /* px per unit w */
  vec2 sp = pos + nfold * (dw * wpx * 0.5) * (1.0 - cos(theta));
  vBack = clamp(-cos(theta), 0.0, 1.0);

  /* the ripple lives only on the released part */
  sp.y += sin((p.x - p.y) * 7.0 - uShow * 12.0)
        * smoothstep(0.0, 0.12, dw) * 0.045 * uSize.y;

  /* THE CARRY: the hero's sheet unfolds into a landing; this one leaves.
     Released vertices are carried off along the fold normal, out through
     the bottom-left corner, and by the end of the turn the whole bundle
     is past the window's diagonal — gone. Stuck vertices never carry. */
  float carry = smoothstep(0.3, 1.0, uShow) * smoothstep(0.0, 0.16, dw);
  sp += nfold * carry * length(uSize) * 1.15;

  gl_Position = vec4(sp.x / uSize.x * 2.0 - 1.0, 1.0 - sp.y / uSize.y * 2.0, 0.0, 1.0);
  vUv = p;
}
`

/* NOTE: a template literal. No backticks in GLSL comments (the HeroPeel
   lesson: the parse error lands nowhere near the cause). */
const FRAG = `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uSize;
uniform float uR;  /* the window's corner radius, px */
varying vec2 vUv;
varying float vBack;

float sdRoundRect(vec2 p, vec2 c, vec2 half_, float r) {
  vec2 q = abs(p - c) - (half_ - vec2(r));
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  /* the sheet keeps its rounded corners wherever the fold takes it */
  vec2 px = vUv * uSize;
  float d = sdRoundRect(px, uSize * 0.5, uSize * 0.5, uR);
  float mask = 1.0 - smoothstep(-1.0, 1.0, d);

  vec3 col = texture2D(uTex, vUv).rgb;
  /* the back of the sheet: dimmed and pulled toward its own luminance,
     unlit stock rather than a second front (HeroPeel's grade) */
  float back = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(col, mix(col, vec3(back), 0.6) * 0.74, vBack);

  gl_FragColor = vec4(col * mask, mask); /* premultiplied */
}
`

type DeckGL = {
  upload: (i: number, img: HTMLImageElement) => boolean
  draw: (i: number, show: number, radius: number) => void
  clear: () => void
}

function createGL(canvas: HTMLCanvasElement, count: number): DeckGL | null {
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
      console.warn('[wf] shader:', gl.getShaderInfoLog(s))
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

  const verts = new Float32Array((SEG_X + 1) * (SEG_Y + 1) * 2)
  let vi = 0
  for (let y = 0; y <= SEG_Y; y++) {
    for (let x = 0; x <= SEG_X; x++) {
      verts[vi++] = x / SEG_X
      verts[vi++] = y / SEG_Y
    }
  }
  /* paint order is the depth cue: far corner first, so the folded-forward
     part paints OVER the still-stuck body — the fold comes toward you */
  const cells: { x: number; y: number; d: number }[] = []
  for (let y = 0; y < SEG_Y; y++) {
    for (let x = 0; x < SEG_X; x++) {
      const cx = (x + 0.5) / SEG_X
      const cy = (y + 0.5) / SEG_Y
      cells.push({ x, y, d: (1.4 * (1 - cx) + cy) / 2.4 })
    }
  }
  cells.sort((a, b) => b.d - a.d)
  const idx = new Uint16Array(SEG_X * SEG_Y * 6)
  let ii = 0
  for (const cell of cells) {
    const i0 = cell.y * (SEG_X + 1) + cell.x
    const i2 = i0 + SEG_X + 1
    idx[ii++] = i0
    idx[ii++] = i2
    idx[ii++] = i0 + 1
    idx[ii++] = i0 + 1
    idx[ii++] = i2
    idx[ii++] = i2 + 1
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

  /* one texture per project, filled as its image lands */
  const texs: (WebGLTexture | null)[] = []
  for (let i = 0; i < count; i++) {
    const t = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, t)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    texs.push(t)
  }

  gl.enable(gl.BLEND)
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
  gl.clearColor(0, 0, 0, 0)

  const U = (n: string) => gl.getUniformLocation(prog, n)
  const uSize = U('uSize')
  const uShow = U('uShow')
  const uR = U('uR')
  gl.uniform1i(U('uTex'), 0)

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

  return {
    upload(i, img) {
      const t = texs[i]
      if (!t) return false
      try {
        gl.bindTexture(gl.TEXTURE_2D, t)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img)
        return true
      } catch {
        return false
      }
    },
    draw(i, show, radius) {
      resize()
      gl.bindTexture(gl.TEXTURE_2D, texs[i])
      gl.uniform2f(uSize, canvas.clientWidth, canvas.clientHeight)
      gl.uniform1f(uShow, show)
      gl.uniform1f(uR, radius)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0)
    },
    clear() {
      gl.clear(gl.COLOR_BUFFER_BIT)
    },
  }
}

const pad2 = (n: number) => String(n).padStart(2, '0')

export default function WorkFold({ projects }: { projects: SheetProject[] }) {
  const rootRef = useRef<HTMLElement | null>(null)
  const n = projects.length

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    /* desktop: ProjectSheets owns §5 and this section is display:none */
    if (getComputedStyle(root).display === 'none') return

    const items = Array.from(root.querySelectorAll<HTMLElement>('.wf-item'))
    if (items.length < 2) return
    const imgs = items.map((it) => it.querySelector<HTMLImageElement>('img'))
    const caps = items.map((it) => it.querySelector<HTMLElement>('.wf-cap'))
    const idxEl = root.querySelector<HTMLElement>('.wf-idx')
    const canvas = root.querySelector<HTMLCanvasElement>('.wf-gl')
    const win = items[0].querySelector<HTMLElement>('.wf-win')
    const count = items.length

    root.classList.add('is-scrub')
    root.style.height = `${(count - 1) * TURN_SVH + 100}svh`

    const gl = canvas ? createGL(canvas, count) : null
    const ready: boolean[] = []
    const ensure = (i: number) => {
      if (!gl || ready[i]) return !!ready[i]
      const im = imgs[i]
      if (im && im.complete && im.naturalWidth > 0) ready[i] = gl.upload(i, im)
      return !!ready[i]
    }
    const onLoad = imgs.map((im, i) => {
      const fn = () => ensure(i)
      im?.addEventListener('load', fn, { once: true })
      return fn
    })
    /* the window's corner, as the shader's radius — a token, read once */
    const radius = win ? parseFloat(getComputedStyle(win).borderTopLeftRadius) || 0 : 0

    let lastK = -1
    let lastE = -1
    let lastIdx = -1
    let drawn = false

    const update = () => {
      const rect = root.getBoundingClientRect()
      const vh = window.innerHeight
      const span = rect.height - vh
      if (span <= 0) return
      if (rect.bottom < -50 || rect.top > vh + 50) return
      const p = gsap.utils.clamp(0, 1, -rect.top / span)
      const t = p * (count - 1)
      const k = Math.min(count - 2, Math.floor(t))
      const e = gsap.utils.clamp(0, 1, t - k)
      if (k === lastK && e === lastE) return

      /* the stack: everything before k is gone; k is mid-fold (GL owns
         its pixels) or gone at the end of its turn; the rest wait under */
      const folding = !!gl && e > 0 && e < 1
      items.forEach((it, i) => {
        it.classList.toggle('is-gone', i < k || (i === k && e >= 1))
        it.classList.toggle('is-fold', i === k && folding)
      })

      /* captions: each one holds through the first tenth of its sheet's
         turn, is gone by 0.45, and the next is fully in by 0.55 of the
         way — they swap through a short dark beat at the crease, never
         both half-there on the same spot (they share one grid cell). It
         leaves upward, the next arrives from below. */
      caps.forEach((c, i) => {
        if (!c) return
        const d = gsap.utils.clamp(-1, 1, t - i)
        const op = 1 - gsap.utils.clamp(0, 1, (Math.abs(d) - 0.1) / 0.35)
        c.style.opacity = op.toFixed(3)
        c.style.transform = `translateY(${(-d * 14).toFixed(1)}px)`
        c.style.pointerEvents = op > 0.5 ? '' : 'none'
      })

      const cur = e < 0.5 ? k : k + 1
      if (cur !== lastIdx && idxEl) {
        lastIdx = cur
        idxEl.textContent = `${pad2(cur + 1)} / ${pad2(count)}`
      }

      if (gl) {
        if (folding && ensure(k)) {
          gl.draw(k, e, radius)
          drawn = true
        } else if (drawn) {
          gl.clear()
          drawn = false
        }
      }
      lastK = k
      lastE = e
    }
    /* one frame late on purpose — after Lenis in the ticker, so the rects
       are current-frame (the house lesson, see SolveCredits) */
    const rafId = requestAnimationFrame(() => gsap.ticker.add(update))

    return () => {
      cancelAnimationFrame(rafId)
      gsap.ticker.remove(update)
      imgs.forEach((im, i) => im?.removeEventListener('load', onLoad[i]))
      root.classList.remove('is-scrub')
      root.style.height = ''
      items.forEach((it) => it.classList.remove('is-gone', 'is-fold'))
      caps.forEach((c) => {
        if (!c) return
        c.style.opacity = ''
        c.style.transform = ''
        c.style.pointerEvents = ''
      })
    }
  }, [n])

  return (
    <section ref={rootRef} className="wf k-dark" aria-label="Selected work">
      <div className="wf-pin">
        <div className="wf-head">
          <span className="wf-label t-small">Selected work</span>
          <span className="wf-idx t-small" aria-hidden="true">
            {pad2(1)} / {pad2(n)}
          </span>
        </div>

        <div className="wf-stack">
          {projects.map((p, i) => (
            <div className="wf-item" key={p.title} style={{ zIndex: n - i }}>
              {/* the window IS the link. New tab: these are the live sites,
                  and on a phone leaving the page for one is losing it. */}
              <a
                className="wf-win"
                href={p.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${p.title} — visit the site`}
              >
                {p.image && (
                  /* eager, all of them: each is one turn away from being the
                     fold's texture, and the -1080 derivative is ~40KB */
                  <img
                    className="wf-img"
                    src={p.image}
                    srcSet={`${p.image.replace(/\.webp$/, '-1080.webp')} 1080w, ${p.image.replace(/\.webp$/, '-1600.webp')} 1600w, ${p.image} 2880w`}
                    sizes="92vw"
                    alt=""
                    decoding="async"
                  />
                )}
              </a>
              <div className="wf-cap">
                <span className="wf-name t-h2">{p.title}</span>
                <span className="wf-line t-body">{p.line}</span>
                <span className="wf-meta t-small">
                  <span>{p.year}</span>
                  <a className="wf-visit" href={p.href} target="_blank" rel="noreferrer">
                    Visit site <span aria-hidden="true">↗</span>
                  </a>
                </span>
              </div>
            </div>
          ))}

          {/* the fold, drawn over the window mid-turn; nothing at rest */}
          <canvas className="wf-gl" aria-hidden="true" style={{ zIndex: n + 1 }} />
        </div>
      </div>
    </section>
  )
}
