'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion-v4'

/**
 * THE HERO PEEL (2026-08-19) — our own move, built on the Lusion mechanic.
 *
 * Lusion/upsunday fly a rectangle into a rectangle. OURS is the staircase,
 * choreographed corner by corner (the user's EIGHT-CORNER CLOCK — see the
 * vertex shader): on the first scrolled pixel corner 1 (top right) is
 * grabbed and folded FORWARD over the pinned sheet, back side showing
 * mirrored; the unstick front sweeps 2,8 → 3,7 → 4,6 → 5 while an unfold
 * wave chases it in the same order; then the sheet lands and expands into
 * the full-bleed BACKGROUND of §2 — the claim's text arrives sitting on it.
 *
 * MECHANICS
 * - The portrait is a texture on a 140x90-segment plane (raw WebGL — the
 *   aurora idiom). One scalar field w orders all eight corners; a moving
 *   hinge W(uShow) sweeps it, and vertices behind the hinge REFLECT past
 *   it (a true mirror — the back side is the image mirrored for free).
 * - ONE WORLD: uFrom is the LIVE rect, so stuck corners ride up with the
 *   page like every other hero element; unstuck vertices progressively
 *   anchor to the card's at-rest spot (uDy = scrolled px), so the scroll
 *   itself stretches the sheet between the leaving hero and the arriving
 *   claim. A 70svh runway (.hm-heropin.is-run, NOT sticky) gives the
 *   stretch its room. uTo stays the LIVE rect of §2; the scrub is
 *   reversible by construction.
 * - The staircase lives in the FRAGMENT shader as an SDF: the union of the
 *   two rounded rects the SVG path was authored from (tall 520,0,295,190 ·
 *   wide 0,155,545,220 · r28, viewBox 815x375), joined with a polynomial
 *   smin whose k IS the concave fillet. The morph to a rectangle is a mix()
 *   of both rects toward the full rect while k -> 0: the notch fills itself,
 *   continuously, mid-flight.
 * - CONTINUITY: at rest (uShow ~ 0) the DOM staircase stays visible and the
 *   GL draws nothing — so the page-transition clone (which cannot clone
 *   canvas pixels) always carries a real image. At the first scrolled pixel
 *   the driver flips `hm-glhero` on and draws the sheet in the DOM image's
 *   exact place: same rect (getBoundingClientRect carries the entrance
 *   transform), same opacity (mirrored from computed style), same ken-burns
 *   (read live off the CSS animation's computed matrix) and same parallax
 *   (read live via gsap.getProperty off .hw-pan) — the swap is invisible.
 *   Ken-burns and parallax damp away as the sheet becomes a background.
 *
 * LAYERING: canvas fixed, z-index 2, mounted BETWEEN the hero and §2 in the
 * DOM. Hero (z2, earlier) paints under it — the sheet covers the DOM image's
 * spot; §2 (z2, later) paints over it — the claim's text sits on the sheet,
 * and with `hm-glhero` its background goes transparent so the sheet IS the
 * background. §3 (unraised) stays under the canvas, so the landed sheet
 * still covers it when it slides under §2. Nav (50) and the fluid (40, root
 * stacking context) stay above.
 *
 * Fallbacks: no JS / reduced motion / mobile (the staircase is display:none
 * under 57.5rem) / no WebGL / texture failure -> the DOM hero and the plain
 * white §2, untouched.
 */

const SEG_X = 140
const SEG_Y = 90

const VERT = `
attribute vec2 aUv;
uniform vec4 uFrom;   /* x,y,w,h — CSS px, top-left origin, y down */
uniform vec4 uTo;
uniform float uShow;  /* 0..1 */
uniform float uDy;    /* px scrolled since rest — the stretch */
uniform vec2 uVp;
varying vec2 vUv;
varying vec2 vRectWH;

varying float vBack;

void main() {
  vec2 p = aUv;
  /* THE EIGHT-CORNER CLOCK (user choreography v4, 2026-08-19). Corner
     numbering, agreed: 1 = top right, then clockwise — 2 bottom-right of
     the upper block · 3 the inner step corner · 4 bottom-right of the
     lower block · 5 bottom left · 6 top-left of the lower block · 7 the
     other inner step corner · 8 top-left of the upper block.
     The directed unstick order 1 · 2,8 · 3,7 · 4,6 · 5 is exactly a
     wavefront sweeping diagonally from corner 1, so ONE scalar field
     orders all eight: */
  float w = (1.4 * (1.0 - p.x) + p.y) / 2.4;

  /* ONE WORLD: uFrom is the LIVE rect — stuck vertices ride up with the
     page exactly like every other hero element */
  vec2 pos = uFrom.xy + p * uFrom.zw;

  /* the unstick front: a hinge sweeping the w field across the first 65%
     of the scrub, eased hot so the grab begins on the FIRST scrolled
     pixel. Vertices behind the hinge fold FORWARD over the sheet —
     REFLECTED past it, so the back side really is the image mirrored.
     The 0.5 folds it less than flat: fabric, not creased paper. */
  float W = pow(clamp(uShow / 0.65, 0.0, 1.0), 0.75);
  float dw = max(W - w, 0.0);
  /* the unfold chases in the same corner order — 1 shows its front first
     ("starts folding upwards"), the tail is still folding as it runs */
  float unf = smoothstep(0.42 + w * 0.28, 0.64 + w * 0.28, uShow);
  float theta = 2.827 * smoothstep(0.0, 0.16, dw) * (1.0 - unf);
  vec2 nfold = normalize(vec2(-1.4 / uFrom.z, 1.0 / uFrom.w)); /* down-left */
  float wpx = 2.4 / length(vec2(1.4 / uFrom.z, 1.0 / uFrom.w)); /* px per unit w */
  vec2 sp = pos + nfold * (dw * wpx * 0.5) * (1.0 - cos(theta));
  vBack = clamp(-cos(theta), 0.0, 1.0);

  /* fluidity: the ripple lives ONLY on the unstuck part — stuck corners
     do not tremble */
  sp.y += sin((p.x - p.y) * 7.0 - uShow * 12.0)
        * smoothstep(0.0, 0.12, dw) * (1.0 - unf * 0.5)
        * 0.045 * uFrom.w;

  /* THE STRETCH (user, round 6): unstuck vertices progressively anchor
     to where the card stood at rest — uDy is how far the page has
     scrolled — so the scroll itself stretches the sheet between the
     leaving hero (stuck corners riding up) and the arriving claim.
     One world: the stretch IS the scroll. Damped ×0.7 (user: too
     violent), and once the sweep finishes the WHOLE sheet anchors
     (.5→.68) — with nothing left riding the hero, the released end must
     not follow it out of the top of the viewport; the landing then
     starts from inside the frame instead of dropping in from above. */
  float anch = max(smoothstep(0.0, 0.5, dw), smoothstep(0.5, 0.68, uShow));
  sp.y += uDy * 0.7 * anch;

  /* the landing: corner 1 finds its place first (~70%), the others
     follow, and the expansion into §2's full rect happens HERE — the
     sheet keeps its original size and shape until then */
  float ex = smoothstep(0.68 + w * 0.06, 0.92 + w * 0.06, uShow);
  sp = mix(sp, uTo.xy + p * uTo.zw, ex);

  gl_Position = vec4(sp.x / uVp.x * 2.0 - 1.0, 1.0 - sp.y / uVp.y * 2.0, 0.0, 1.0);
  vUv = p;
  vRectWH = mix(uFrom.zw, uTo.zw, ex);
}
`

const FRAG = `
precision highp float;
uniform sampler2D uTex;
uniform float uShow;
uniform float uAlpha;
uniform vec2 uTexA;      /* authored SVG framing as an affine map: */
uniform vec2 uTexB;      /*   uv = vUv * uTexA + uTexB (kb+parallax baked) */
uniform float uImgAspect;
varying vec2 vUv;
varying vec2 vRectWH;
varying float vBack;

/* the staircase, in viewBox fractions (815x375): the two rounded rects the
   SVG path was authored from */
const vec4 RA = vec4(520.0 / 815.0, 0.0, 295.0 / 815.0, 190.0 / 375.0);
const vec4 RB = vec4(0.0, 155.0 / 375.0, 545.0 / 815.0, 220.0 / 375.0);

float sdRoundRect(vec2 p, vec2 c, vec2 half_, float r) {
  vec2 q = abs(p - c) - (half_ - vec2(r));
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}
/* polynomial smooth min — the k IS the concave fillet at the union seam */
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

void main() {
  /* the shape morph: the STAIRCASE is the sheet's original shape and holds
     through the whole flight (user: "in the beginning it should keep its
     original shape"); it irons out into one rectangle only as the landing
     expansion runs. Safe now: the bounded drag keeps the sheet coherent —
     the early iron-out existed to stop the old unbounded stagger from
     stretching the notch into a tear (wave take 2 filmed that). */
  float m = smoothstep(0.68, 0.9, uShow);
  float exG = smoothstep(0.7, 0.94, uShow); /* the landing expansion, uniform */
  vec4 full_ = vec4(0.0, 0.0, 1.0, 1.0);
  vec4 ra = mix(RA, full_, m);
  vec4 rb = mix(RB, full_, m);

  vec2 px = vUv * vRectWH;
  /* corners stay rounded for the whole flight, and the LANDED form keeps
     a container radius too — it is an inset card now, not a full-bleed
     cover (landing redesign, 2026-08-19) */
  float r = mix((28.0 / 815.0) * vRectWH.x, 24.0, exG);
  float k = max((30.0 / 815.0) * vRectWH.x * (1.0 - m), 0.001);
  float dA = sdRoundRect(px, (ra.xy + ra.zw * 0.5) * vRectWH, ra.zw * 0.5 * vRectWH, r);
  float dB = sdRoundRect(px, (rb.xy + rb.zw * 0.5) * vRectWH, rb.zw * 0.5 * vRectWH, r);
  float d = smin(dA, dB, k);
  float mask = (1.0 - smoothstep(-1.0, 1.0, d)) * uAlpha;

  /* framing: the authored SVG crop (kb + parallax baked into the affine)
     eases into a cover-fit of the current rect as the sheet widens */
  vec2 uvA = vUv * uTexA + uTexB;
  float planeAspect = vRectWH.x / max(vRectWH.y, 1.0);
  vec2 cf = planeAspect > uImgAspect
    ? vec2(1.0, uImgAspect / planeAspect)
    : vec2(planeAspect / uImgAspect, 1.0);
  vec2 uvB = (vUv - 0.5) * cf + 0.5;
  vec2 uv = mix(uvA, uvB, smoothstep(0.68, 0.9, uShow));

  vec3 col = texture2D(uTex, uv).rgb;
  /* the folded-over part shows its back: dimmed and cooled a touch, so
     the mirror reads as the reverse of the sheet, not a second front */
  col = mix(col, col * vec3(0.88, 0.93, 1.0) * 0.8, vBack);
  /* the landing grade: as the sheet becomes a BACKGROUND it recedes —
     darkened enough that §2's light type always reads, even over the
     figure's bright passages */
  col *= mix(1.0, 0.58, smoothstep(0.7, 1.0, uShow));
  gl_FragColor = vec4(col * mask, mask); /* premultiplied */
}
`

type PeelGL = {
  draw: (
    from: DOMRect,
    to: DOMRect,
    show: number,
    alpha: number,
    dy: number,
    texA: [number, number],
    texB: [number, number],
  ) => void
  clear: () => void
}

function createGL(canvas: HTMLCanvasElement, img: HTMLImageElement): PeelGL | null {
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
      console.warn('[hp] shader:', gl.getShaderInfoLog(s))
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
  /* paint order IS the depth cue in this flat pipeline. Cells are emitted
     far-corner-first along the same w field the choreography sweeps
     (corner 5 first, corner 1 last), so wherever the sheet self-overlaps,
     the folded-forward part paints OVER the still-pinned body — the fold
     comes TOWARD the viewer. Row-major order painted the body over the
     lead and the corner read as folding away behind. */
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

  const tex = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img)

  gl.enable(gl.BLEND)
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
  gl.clearColor(0, 0, 0, 0)

  const U = (n: string) => gl.getUniformLocation(prog, n)
  const uFrom = U('uFrom')
  const uTo = U('uTo')
  const uShow = U('uShow')
  const uVp = U('uVp')
  const uAlpha = U('uAlpha')
  const uDy = U('uDy')
  const uTexA = U('uTexA')
  const uTexB = U('uTexB')
  gl.uniform1i(U('uTex'), 0)
  gl.uniform1f(U('uImgAspect'), img.naturalWidth / img.naturalHeight)

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
    draw(from, to, show, alpha, dy, texA, texB) {
      resize()
      gl.uniform4f(uFrom, from.left, from.top, Math.max(1, from.width), Math.max(1, from.height))
      gl.uniform4f(uTo, to.left, to.top, Math.max(1, to.width), Math.max(1, to.height))
      gl.uniform1f(uShow, show)
      gl.uniform1f(uAlpha, alpha)
      gl.uniform1f(uDy, dy)
      gl.uniform2f(uVp, canvas.clientWidth, canvas.clientHeight)
      gl.uniform2f(uTexA, texA[0], texA[1])
      gl.uniform2f(uTexB, texB[0], texB[1])
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0)
    },
    clear() {
      gl.clear(gl.COLOR_BUFFER_BIT)
    },
  }
}

/* the SVG's authored image placement, from HeroPortrait.tsx: <image
   x=-213 y=-6 width=1208 height=680> in viewBox 815x375, ken-burns
   transform-origin 50% 40% of the image's own box (fill-box) */
const VB = { w: 815, h: 375 }
const IMG = { x: -213, y: -6, w: 1208, h: 680 }
const KB_ORIGIN = { x: IMG.x + IMG.w * 0.5, y: IMG.y + IMG.h * 0.4 }

export default function HeroPeel() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const main = canvas.closest<HTMLElement>('main.hm')
    const heropin = document.querySelector<HTMLElement>('.hm-heropin')
    const shape = document.querySelector<SVGSVGElement>('.hw-hero .hw-shape')
    const pan = document.querySelector<SVGGElement>('.hw-hero .hw-pan')
    const kbImg = document.querySelector<SVGImageElement>('.hw-hero .hw-img')
    const claim = document.querySelector<HTMLElement>('.hm-claim')
    const land = document.querySelector<HTMLElement>('.hm-claim-land')
    if (!main || !heropin || !shape || !pan || !kbImg || !claim || !land) return
    /* mobile swaps the staircase out entirely — nothing to peel */
    if (getComputedStyle(shape).display === 'none') return

    let gl: PeelGL | null = null
    let dead = false
    const img = new Image()
    img.src = '/home/portrait-distorted.webp'
    img.decode().then(
      () => {
        if (dead) return
        gl = createGL(canvas, img)
        /* the runway engages only when GL actually runs — and stays for
           the page's life (see the CSS note: toggling it would shift
           everything below by 70svh mid-page) */
        if (gl) heropin.classList.add('is-run')
      },
      () => {},
    )

    let show = 0
    let live = false // hm-glhero: DOM image hidden, GL owns the pixels
    const setLive = (v: boolean) => {
      if (live === v) return
      live = v
      main.classList.toggle('hm-glhero', v)
      if (!v) gl?.clear()
    }

    const tick = () => {
      if (!gl) return
      const vh = window.innerHeight
      const rTo = claim.getBoundingClientRect()
      /* §2 fully scrolled past (plus slack): nothing of the sheet is on
         screen — its trailing edge tracks §2's rect */
      if (rTo.bottom < -80) {
        setLive(false)
        return
      }

      /* the scrub, in two joined stretches: the first 65% of the timeline
         (the whole unstick sweep, corners 1 → 5) rides the runway pin —
         the hero stands still on screen while it plays — and the pin
         releases exactly as the hinge completes; the last 35% (unfold
         tail, landing, expansion) rides §2's approach as the page starts
         moving again. Continuous and monotone at the joint. */
      const rPin = heropin.getBoundingClientRect()
      const pp = gsap.utils.clamp(0, 1, -rPin.top / Math.max(rPin.height - vh, 1))
      const ap = gsap.utils.clamp(0, 1, (vh - rTo.top) / (vh * 0.85))
      const target = 0.65 * pp + 0.35 * ap
      show += (target - show) * 0.16
      if (Math.abs(target - show) < 0.0005) show = target

      /* at true rest the DOM staircase owns the pixels (so route-transition
         clones never carry a blank canvas); GL takes over at the first
         scrolled pixel, in the DOM's exact place */
      if (show < 0.01 && target < 0.01) {
        setLive(false)
        return
      }
      setLive(true)

      /* ONE WORLD: the live rect scrolls with the page, so stuck corners
         ride up with the hero like everything else; the shader anchors
         unstuck vertices by uDy, and the scroll itself stretches the
         sheet between the two. */
      const rFrom = shape.getBoundingClientRect() // carries the entrance transform
      const dy = Math.max(0, window.scrollY)
      const alpha = parseFloat(getComputedStyle(shape).opacity) || 1

      /* mirror ken-burns (CSS animation, computed matrix) + parallax (gsap
         channels on .hw-pan), damped away as the sheet leaves the hero —
         both exact at handoff, gone by mid-flight */
      const damp = 1 - gsap.utils.clamp(0, 1, (show - 0.05) / 0.45)
      let kb = 1
      const t = getComputedStyle(kbImg).transform
      if (t && t !== 'none') kb = new DOMMatrix(t).a
      kb = 1 + (kb - 1) * damp
      const panX = ((gsap.getProperty(pan, 'x') as number) || 0) * damp
      const panY = ((gsap.getProperty(pan, 'y') as number) || 0) * damp

      /* authored framing as an affine map vUv -> texture uv, all in viewBox
         units: image box scaled about the kb origin, then panned */
      const iw = IMG.w * kb
      const ih = IMG.h * kb
      const ix = KB_ORIGIN.x + (IMG.x - KB_ORIGIN.x) * kb + panX
      const iy = KB_ORIGIN.y + (IMG.y - KB_ORIGIN.y) * kb + panY
      const texA: [number, number] = [VB.w / iw, VB.h / ih]
      const texB: [number, number] = [-ix / iw, -iy / ih]

      /* timing rides the SECTION's rect (rTo, above — the choreography is
         untouched); the sheet lands on the inset PAD's rect — a contained
         card with margin all around, not a full-bleed cover */
      gl.draw(rFrom, land.getBoundingClientRect(), show, alpha, dy, texA, texB)
    }
    /* one frame late ON PURPOSE — after Lenis's ticker callback, so the
       rects are current-frame (the MediaPeel lesson: adding here directly
       makes the sheet trail the scroll by one frame) */
    const rafId = requestAnimationFrame(() => gsap.ticker.add(tick))

    return () => {
      dead = true
      cancelAnimationFrame(rafId)
      gsap.ticker.remove(tick)
      main.classList.remove('hm-glhero')
      heropin.classList.remove('is-run')
    }
  }, [])

  return <canvas ref={canvasRef} className="hp-canvas" aria-hidden="true" />
}
