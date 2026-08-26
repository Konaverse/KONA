'use client'

import { useEffect, useRef } from 'react'
import { gsap, EASE, DUR, rem } from '@/lib/motion-v4'

/**
 * THE HERO PEEL (2026-08-19) — our own move, built on the Lusion mechanic.
 *
 * Lusion/upsunday fly a rectangle into a rectangle. OURS is the staircase,
 * choreographed corner by corner (the user's EIGHT-CORNER CLOCK — see the
 * vertex shader): on the first scrolled pixel corner 1 (top right) is
 * grabbed and folded FORWARD over the pinned sheet, back side showing
 * mirrored; the unstick front sweeps 2,8 → 3,7 → 4,6 → 5 while an unfold
 * wave chases it in the same order — and the unfold IS the landing
 * (2026-08-20): each vertex glides down into §2's card as it unfolds, so
 * the sheet folds up out of the hero and unfolds down into the BACKGROUND
 * of §2 — the claim's text arrives sitting on it.
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
 *   claim. A 35svh runway (.hm-heropin.is-run, NOT sticky) gives the
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
 *   the driver flips `hm-glhero` on and draws the sheet in the DOM video's
 *   exact place: same rect (getBoundingClientRect carries the entrance
 *   transform), same opacity (mirrored from computed style), the SAME VIDEO
 *   ELEMENT as the texture (2026-08-24 — its current frame re-uploaded every
 *   draw, so the loop keeps playing inside the fold and can never drift from
 *   the DOM), and same parallax (read live via gsap.getProperty off .hw-pan)
 *   — the swap is invisible. Parallax damps away as the sheet becomes a
 *   background; the old ken-burns left when the footage arrived.
 *
 * LAYERING: canvas fixed, z-index 2, mounted BETWEEN the hero and §2 in the
 * DOM. Hero (z2, earlier) paints under it — the sheet covers the DOM image's
 * spot; §2 (z2, later) paints over it — the claim's text sits on the sheet,
 * and with `hm-glhero` its background goes transparent so the sheet IS the
 * background. §3 (unraised) stays under the canvas, so the landed sheet
 * still covers it when it slides under §2. Nav (50) and the fluid (40, root
 * stacking context) stay above.
 *
 * MOBILE (2026-08-26, user: "the fold transition happens on mobile too").
 * Under 57.5rem the staircase is display:none and the picture is the plain
 * rounded crop under the headline (.hw-mimg, the same loop). The peel
 * sources from whichever is displayed, and the choreography is IDENTICAL:
 * stuck corners ride up with the page, the released part anchors and
 * stretches, the unfold lands it as §2's background. Only the SHAPE
 * differs, under `uRect`: the source is a rounded rectangle, so the SDF
 * morph is pinned at the full rect (m = 1) with the crop's own CSS radius
 * (uR0, grows to R_LG on landing like the staircase's), and the framing is
 * the cover-fit branch — anchored at the crop's object-position (uCover),
 * so the GL sheet shows the exact pixels the DOM crop did at handoff.
 *
 * THE LANDED HANDOFF (phones, 2026-08-26, user: the video "shakes on
 * scroll after it lands on the claim"). Lenis leaves touch scrolling
 * native (no syncTouch), so on a phone the compositor moves the claim's
 * text every frame while this canvas is redrawn from JS a frame behind
 * it — in flight that is invisible, but a landed sheet is supposed to be
 * a STATIC background under that text, and a one-frame lag there reads
 * as trembling. So once the sheet has fully landed (uShow at 1, opening
 * done) the DOM takes the pixels: `hm-landed` on main shows
 * .hm-claim-bg — the same loop in the pad, same crop, same grade, same
 * catch (home.css) — which scrolls natively with the text, and the GL
 * clears. Scrolling back below the landing hands it straight back to GL
 * at the same rect. The bg video is synced to the hero loop's clock at
 * each handoff. Desktop is untouched: Lenis drives its scroll, so GL and
 * DOM never disagree there.
 *
 * Fallbacks: no JS / reduced motion / no WebGL / texture failure -> the
 * DOM hero and the plain white §2, untouched.
 */

/** how long the full-bleed cover holds before it carves (s) — the
 *  "arrive, then open" beat; the headline's entrance waits behind it */
const OPEN_HOLD = 0.7

/** THE FOLD'S SECOND STRETCH: how much of the claim's approach (in
 *  viewport heights) the scrub runs across — the fold lands when the
 *  claim's top is (1 − APPROACH)·vh from the top edge. Desktop went
 *  0.85 → 1.0 on 2026-08-26 with the runway 35 → 55svh (home.css: the
 *  fold was "too abrupt"), so the landing now completes as the claim
 *  reaches the top. Phones keep 0.85, as signed off on the user's phone. */
const APPROACH = 1.0
const APPROACH_MOBILE = 0.85

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

  /* THE LANDING RIDES THE UNFOLD (2026-08-20, user): the unfold and the
     landing used to be two separate beats — unfolded vertices anchored
     back near the hero's rest spot, then a late window (0.68..0.92)
     pulled them up into §2's card, so the released corner visibly
     stretched back UP mid-flight before coming down. Now each vertex
     glides to its landing spot AS it unfolds — same wave, corner 1
     first — so the sheet folds up out of the hero and unfolds DOWN
     into the arriving card, and nothing unfolded travels back up. */
  float ex = unf;
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
uniform float uMorph; /* the OPENING: 1 = full container, 0 = the staircase */
uniform float uAlpha;
uniform vec2 uTexA;      /* authored SVG framing as an affine map: */
uniform vec2 uTexB;      /*   uv = vUv * uTexA + uTexB (kb+parallax baked) */
uniform float uImgAspect;
uniform float uRem;   /* root font-size / 16 — the picture's scale (tokens.css) */
uniform float uRect;  /* 1 = the source is a rounded rectangle (mobile crop) */
uniform float uR0;    /* that rectangle's CSS corner radius, px */
uniform vec2 uCover;  /* cover-fit anchor = the crop's object-position (0..1) */
varying vec2 vUv;
varying vec2 vRectWH;
varying float vBack;

/* the staircase, in viewBox fractions (815x375): the two rounded rects the
   SVG path was authored from */
const vec4 RA = vec4(520.0 / 815.0, 0.0, 295.0 / 815.0, 190.0 / 375.0);
const vec4 RB = vec4(0.0, 155.0 / 375.0, 545.0 / 815.0, 220.0 / 375.0);

/* --r-lg, the token the landed card's corner comes from. It cannot be read
   from CSS in here, so it is named rather than left as a bare 24.0 sitting in
   the middle of a mix() -- the radius scale is closed and this is on it. */
const float R_LG = 24.0;

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
     stretching the notch into a tear (wave take 2 filmed that).
     uMorph is THE OPENING (2026-08-24, user): the same morph, run at page
     load in the other direction — the sheet is born the FULL container
     (m=1) and carves itself down to the staircase, uncovering the text
     that was laid out beneath it all along. One shape system, both doors. */
  float m = max(max(smoothstep(0.68, 0.9, uShow), uMorph), uRect);
  float exG = smoothstep(0.7, 0.94, uShow); /* the landing expansion, uniform */
  /* WIDTH ONLY (2026-08-26, user: "it expands from both height and width
     — it should only expand on width"). The two blocks keep their
     HEIGHTS and only widen — the top block slides out to the left edge,
     the bottom block out to the right — and because their y-ranges
     overlap (RA ends at 190/375, RB starts at 155/375) two full-width
     bands ARE the rectangle: the notches close sideways, never from
     above or below. Both doors: the opening carves them in the same way. */
  vec4 ra = vec4(mix(RA.x, 0.0, m), RA.y, mix(RA.z, 1.0, m), RA.w);
  vec4 rb = vec4(RB.x, RB.y, mix(RB.z, 1.0, m), RB.w);

  vec2 px = vUv * vRectWH;
  /* corners stay rounded for the whole flight, and the LANDED form keeps
     a container radius too — it is an inset card now, not a full-bleed
     cover (landing redesign, 2026-08-19). During the OPENING the radius
     scales away with uMorph: a full-page sheet has no corners to round,
     and they grow in as it becomes a container. */
  float r0 = mix((28.0 / 815.0) * vRectWH.x, uR0, uRect);
  float r = mix(r0, R_LG * uRem, exG) * (1.0 - uMorph);
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
  /* object-fit: cover at object-position uCover — (0.5, 0.5) is the
     centred crop the staircase always used; the mobile crop sits the face
     at 35% and the sheet must show the same pixels the DOM did */
  vec2 uvB = vUv * cf + (1.0 - cf) * uCover;
  /* m, not the raw uShow window: the OPENING's full-page state needs the
     cover-fit too — the video fills the viewport honestly, and eases into
     the authored staircase crop as the container closes down */
  vec2 uv = mix(uvA, uvB, m);

  vec3 col = texture2D(uTex, uv).rgb;
  /* the folded-over part shows its back: dimmed, and pulled most of the way
     to its own luminance, so the reverse reads as unlit stock rather than a
     second front. It was tinted COOL here before the monochrome pivot -- a
     hue on the back of a sheet is precisely the kind of colour the direction
     took out, and it was the last one left in the peel. */
  float back = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(col, mix(col, vec3(back), 0.6) * 0.74, vBack);
  /* the landing grade: as the sheet becomes a BACKGROUND it recedes —
     darkened enough that §2's light type always reads, even over the
     figure's bright passages */
  col *= mix(1.0, 0.58, smoothstep(0.7, 1.0, uShow));

  /* THE CATCH, drawn here because this pane is drawn here.
     Every glass surface in the DOM carries a lit top edge -- .k-glass's
     inset 0 1px 0, the staircase's gradient stroke. The landed card is the
     one pane on this page rendered in GL rather than CSS, and without this it
     would be the one pane without the signature, which is how a WebGL element
     starts reading as a foreign object dropped into the layout.

     It is nearly free: d is already the signed distance to the sheet's
     outline, computed for the mask, so the edge band is one smoothstep on a
     value we have. Weighted toward the top (up) so it reads as light landing
     ON the pane rather than as an outline drawn AROUND it, gated on the
     landing (exG) so it never appears mid-fold, and off the reverse side
     (vBack) because the back of a sheet does not catch the key.

     NOTE FOR ANYONE EDITING THIS SHADER: it is a template literal. A backtick
     in a GLSL comment closes the string, and the parse error lands nowhere
     near the comment that caused it. This block cost one build to learn.

     Added AFTER the landing grade: this is light, not a lit part of the
     photograph, so the grade must not darken it. */
  float edge = 1.0 - smoothstep(0.0, 1.6, abs(d));
  float up = smoothstep(0.62, 0.0, vUv.y);
  col += vec3(1.0) * edge * up * exG * (1.0 - vBack) * 0.5;

  gl_FragColor = vec4(col * mask, mask); /* premultiplied */
}
`

type Rect = { left: number; top: number; width: number; height: number }

type PeelGL = {
  /** mark the video as having a new frame to upload (rVFC / time change) */
  dirty: () => void
  draw: (
    from: Rect,
    to: Rect,
    show: number,
    alpha: number,
    dy: number,
    texA: [number, number],
    texB: [number, number],
    morph: number,
  ) => void
  clear: () => void
}

function createGL(
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  /* the mobile crop (see header): a rounded rect at r0, cover-fit at cover */
  rect: { r0: number; cover: [number, number] } | null,
): PeelGL | null {
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

  /* the texture is the LIVE hero video (2026-08-24): this upload is only
     the first frame — draw() re-uploads the element's current frame every
     tick, so the loop keeps playing inside the folding sheet, in perfect
     sync with the DOM element it took over from. The texture stays bound
     on unit 0 for the program's whole life, which is what makes the
     per-frame texImage2D a one-liner. */
  const tex = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video)

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
  const uMorph = U('uMorph')
  const uRem = U('uRem')
  gl.uniform1i(U('uTex'), 0)
  gl.uniform1f(U('uImgAspect'), video.videoWidth / video.videoHeight)
  gl.uniform1f(U('uRect'), rect ? 1 : 0)
  gl.uniform1f(U('uR0'), rect ? rect.r0 : 0)
  gl.uniform2f(U('uCover'), rect ? rect.cover[0] : 0.5, rect ? rect.cover[1] : 0.5)

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

  /* UPLOAD ONLY NEW FRAMES. The loop is 25fps and the ticker 60+: most
     draws used to re-upload a frame the GPU already had — on a phone the
     single most expensive thing in this tick. requestVideoFrameCallback
     flags a fresh frame where it exists; elsewhere the clock does. */
  let fresh = true
  let lastT = -1
  return {
    dirty() {
      fresh = true
    },
    draw(from, to, show, alpha, dy, texA, texB, morph) {
      resize()
      if (video.readyState >= 2 && (fresh || video.currentTime !== lastT)) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video)
        fresh = false
        lastT = video.currentTime
      }
      gl.uniform1f(uMorph, morph)
      gl.uniform4f(uFrom, from.left, from.top, Math.max(1, from.width), Math.max(1, from.height))
      gl.uniform4f(uTo, to.left, to.top, Math.max(1, to.width), Math.max(1, to.height))
      gl.uniform1f(uShow, show)
      gl.uniform1f(uAlpha, alpha)
      gl.uniform1f(uDy, dy)
      gl.uniform2f(uVp, canvas.clientWidth, canvas.clientHeight)
      gl.uniform1f(uRem, rem())
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

/* the SVG's authored plate placement, from HeroPortrait.tsx: the
   <foreignObject x=-213 y=-6 width=1208 height=680> carrying the looping
   video, in viewBox 815x375. (The ken-burns origin that lived here left
   with the ken-burns, 2026-08-24 — the footage moves on its own.) */
const VB = { w: 815, h: 375 }
const IMG = { x: -213, y: -6, w: 1208, h: 680 }

export default function HeroPeel() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const main = canvas.closest<HTMLElement>('main.hm')
    const heropin = document.querySelector<HTMLElement>('.hm-heropin')
    const stair = document.querySelector<SVGSVGElement>('.hw-hero .hw-shape')
    const crop = document.querySelector<HTMLVideoElement>('.hw-hero .hw-mimg')
    const claim = document.querySelector<HTMLElement>('.hm-claim')
    const land = document.querySelector<HTMLElement>('.hm-claim-land')
    if (!main || !heropin || !claim || !land) return
    /* THE SOURCE is whichever picture this width displays: the staircase on
       desktop, the rounded crop on mobile — exactly one of them is ever
       displayed (home.css). Its rect, its opacity and its video frame are
       what the sheet takes over, so the handoff stays exact either way. */
    const isOn = (el: Element | null) => !!el && getComputedStyle(el).display !== 'none'
    const mobile = !isOn(stair) && isOn(crop)
    const shape: Element | null = mobile ? crop : isOn(stair) ? stair : null
    if (!shape) return
    const pan = mobile ? null : document.querySelector<SVGGElement>('.hw-hero .hw-pan')
    const vid = mobile ? crop : document.querySelector<HTMLVideoElement>('.hw-hero .hw-vid')
    if (!vid || (!mobile && !pan)) return
    /* the crop's shape, read once off its computed style — both are tokens
       (--r-lg, and the face height in the cover crop) and must never be
       duplicated here as numbers */
    const cs = getComputedStyle(shape)
    const pct = (v: string, i: number) => {
      const n = parseFloat((v.split(' ')[i] ?? '50%').replace('%', ''))
      return Number.isFinite(n) ? n / 100 : 0.5
    }
    const rectShape = mobile
      ? {
          r0: parseFloat(cs.borderTopLeftRadius) || 0,
          cover: [pct(cs.objectPosition, 0), pct(cs.objectPosition, 1)] as [number, number],
        }
      : null
    /* the landed handoff's DOM sheet (phones only — see the header) */
    const bgVid = mobile ? land.querySelector<HTMLVideoElement>('.hm-claim-bg video') : null

    let gl: PeelGL | null = null
    let dead = false

    /* THE OPENING (2026-08-24, user; full-page rev the same day): the
       sheet is born as THE WHOLE PAGE — a full-viewport, cover-fit frame
       of the video, headline and copy laid out invisibly beneath — and
       shrinks-and-carves down to the resting staircase in one eased move,
       uncovering them. It is the landing's shape morph run backwards
       through the same uniform (uMorph 1 -> 0), with the draw rect lerped
       viewport -> staircase box on the same value, so the opening and the
       landing can never drift apart in shape language. The short delay
       lets the full-bleed frame (fading in with the DOM entrance's
       mirrored alpha) read first: arrive, then open. */
    const intro = { m: 1 }
    let introTween: gsap.core.Tween | null = null
    let introStarted = false
    let introHurried = false
    let opened = false
    let openDelay: ReturnType<typeof setTimeout> | null = null

    /* THE OPENING LEADS (2026-08-26, user: "the video will be there, it
       will form to its shape, and THEN we will have an entrance animation
       for the heading"). Until today the carve launched on HeroTitle's
       sew — the pills' push was the cause of the shape. Now the shape
       comes first: the cover reads full-bleed for OPEN_HOLD, carves down
       to the staircase (settle, cinema), and the moment it is in shape
       `k-hero-open` fires — HeroTitle's stacked reveal waits on exactly
       that, and the pills follow the headline. One clock still, but the
       container now sets it. A scroll that hurries the carve announces
       the open too, so the headline can never be left waiting. */
    const announceOpen = () => {
      if (opened || dead) return
      opened = true
      window.dispatchEvent(new Event('k-hero-open'))
    }
    const startIntro = () => {
      if (dead || introStarted || !gl) return
      introStarted = true
      introTween = gsap.to(intro, {
        m: 0,
        duration: DUR.cinema,
        ease: EASE.settle,
        onComplete: announceOpen,
      })
    }

    /* the texture source is the DOM's OWN looping video element — one
       decode, one clock, so the sheet and the staircase can never show
       different frames. GL arms once the first frame is decodable. */
    const arm = () => {
      if (dead || gl) return
      gl = createGL(canvas, vid, rectShape)
      /* fresh-frame flag straight from the decoder where the API exists */
      const rvfc = (vid as HTMLVideoElement & {
        requestVideoFrameCallback?: (cb: () => void) => number
      }).requestVideoFrameCallback
      if (gl && rvfc) {
        const onFrame = () => {
          if (dead || !gl) return
          gl.dirty()
          rvfc.call(vid, onFrame)
        }
        rvfc.call(vid, onFrame)
      }
      /* the DOM sheet for the landing: fetch it now so it is decodable by
         the time the sheet lands (same URL as the hero loop — cached) */
      if (gl && bgVid) {
        bgVid.preload = 'auto'
        bgVid.load()
      }
      /* the runway engages only when GL actually runs — and stays for
         the page's life (see the CSS note: toggling it would shift
         everything below mid-page) */
      if (gl) {
        heropin.classList.add('is-run')
        /* the page's cue: the full-page cover can draw from this moment,
           so the hero's held entrances (HeroPortrait, HeroTitle) may
           begin — they wait on this so the resting hero can never flash
           behind a cover whose video is still loading */
        window.dispatchEvent(new Event('k-peel-armed'))
        /* arrive, then open: the full-bleed frame reads first */
        openDelay = setTimeout(startIntro, OPEN_HOLD * 1000)
      }
    }
    if (vid.readyState >= 2) arm()
    else vid.addEventListener('loadeddata', arm, { once: true })

    let show = 0
    let landed = false // hm-landed: the DOM sheet in the pad owns the pixels
    const setLanded = (v: boolean) => {
      if (landed === v) return
      landed = v
      main.classList.toggle('hm-landed', v)
      if (!bgVid) return
      if (v) {
        /* the same instant of the loop as the sheet it replaces */
        try {
          bgVid.currentTime = vid.currentTime
        } catch {}
        bgVid.play().catch(() => {})
      } else {
        bgVid.pause()
      }
    }
    let live = false // hm-glhero: DOM image hidden, GL owns the pixels
    const setLive = (v: boolean) => {
      if (live === v) return
      live = v
      main.classList.toggle('hm-glhero', v)
      /* the card's GROUND changes the instant GL takes the sheet -- the
         portrait is dark where the page was paper -- so its polarity changes
         with it. One class, and the type, the muted type and every role
         inside §2 follow; GrainField reads the same class and thickens the
         grain over it. Without GL there is no dark ground and no k-dark:
         the fallback screen stays paper with ink type, which is correct. */
      land?.classList.toggle('k-dark', v)
      if (!v) gl?.clear()
    }

    const tick = () => {
      if (!gl) return
      const vh = window.innerHeight
      const rTo = claim.getBoundingClientRect()
      /* §2 fully scrolled past (plus slack): nothing of the sheet is on
         screen — its trailing edge tracks §2's rect */
      if (rTo.bottom < -80) {
        setLanded(false)
        setLive(false)
        return
      }

      /* the scrub, proportional to SCROLL DISTANCE (2026-08-20, user: "I
         need to be with the folding process when I scroll" — the old split
         put the whole 65% sweep on the runway alone, so halving the runway
         doubled the fold's speed). The two stretches — the runway and §2's
         approach — are weighted by their own pixel lengths, so the timeline
         advances at ONE even rate per scrolled pixel across the whole
         journey, however long the runway is. Continuous and monotone. */
      const rPin = heropin.getBoundingClientRect()
      const wPin = Math.max(rPin.height - vh, 1)
      const wAp = vh * (mobile ? APPROACH_MOBILE : APPROACH)
      const pp = gsap.utils.clamp(0, 1, -rPin.top / wPin)
      const ap = gsap.utils.clamp(0, 1, (vh - rTo.top) / wAp)
      const target = (pp * wPin + ap * wAp) / (wPin + wAp)
      show += (target - show) * 0.16
      if (Math.abs(target - show) < 0.0005) show = target

      /* a scroll interrupts the opening: the fold must play on the
         staircase, so a still-open morph is hurried shut rather than
         letting the sheet fold as a full slab — including when the carve
         has not even launched yet (scroll before the sew fires) */
      if (target > 0.02 && intro.m > 0 && !introHurried) {
        introHurried = true
        introStarted = true
        if (openDelay) clearTimeout(openDelay)
        introTween?.kill()
        introTween = null
        gsap.to(intro, { m: 0, duration: 0.25, ease: 'none', onComplete: announceOpen })
      }

      /* at true rest the DOM staircase owns the pixels (so route-transition
         clones never carry a blank canvas); GL takes over at the first
         scrolled pixel, in the DOM's exact place — but not while the
         opening still holds the full container */
      if (show < 0.01 && target < 0.01 && intro.m < 0.001) {
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

      /* mirror the pointer parallax (gsap channels on .hw-pan), damped away
         as the sheet leaves the hero — exact at handoff, gone by mid-flight.
         (Ken-burns mirroring left with the ken-burns: the video is the
         motion now, and it rides along in the texture itself.) */
      const damp = 1 - gsap.utils.clamp(0, 1, (show - 0.05) / 0.45)
      const panX = pan ? ((gsap.getProperty(pan, 'x') as number) || 0) * damp : 0
      const panY = pan ? ((gsap.getProperty(pan, 'y') as number) || 0) * damp : 0

      /* authored framing as an affine map vUv -> texture uv, all in viewBox
         units: the video plate's box, panned */
      const iw = IMG.w
      const ih = IMG.h
      const ix = IMG.x + panX
      const iy = IMG.y + panY
      const texA: [number, number] = [VB.w / iw, VB.h / ih]
      const texB: [number, number] = [-ix / iw, -iy / ih]

      /* timing rides the SECTION's rect (rTo, above — the choreography is
         untouched); the sheet lands on the inset PAD's rect — a contained
         card with margin all around, not a full-bleed cover */
      /* THE OPENING RECT: at m=1 the sheet IS the page. The rect lerps
         from the full viewport down to the staircase's own box on the
         same eased value that drives the carve — one gesture, two
         dimensions of it. (intro.m is 0 for the page's whole life after
         the opening, so this is rFrom verbatim from then on.) */
      /* THE HANDOFF (phones): fully landed → the DOM sheet owns the pixels
         and the canvas clears; anything less → GL, at the same rect */
      if (bgVid) {
        const isLanded = show >= 0.995 && target >= 0.995 && intro.m < 0.001
        setLanded(isLanded)
        if (isLanded) {
          gl.clear()
          return
        }
      }

      const im = intro.m
      const rectFrom: Rect =
        im > 0
          ? {
              left: rFrom.left * (1 - im),
              top: rFrom.top * (1 - im),
              width: rFrom.width + (window.innerWidth - rFrom.width) * im,
              height: rFrom.height + (vh - rFrom.height) * im,
            }
          : rFrom
      gl.draw(rectFrom, land.getBoundingClientRect(), show, alpha, dy, texA, texB, im)
    }
    /* one frame late ON PURPOSE — after Lenis's ticker callback, so the
       rects are current-frame (the MediaPeel lesson: adding here directly
       makes the sheet trail the scroll by one frame) */
    const rafId = requestAnimationFrame(() => gsap.ticker.add(tick))

    return () => {
      dead = true
      vid.removeEventListener('loadeddata', arm)
      if (openDelay) clearTimeout(openDelay)
      introTween?.kill()
      gsap.killTweensOf(intro)
      cancelAnimationFrame(rafId)
      gsap.ticker.remove(tick)
      main.classList.remove('hm-glhero')
      main.classList.remove('hm-landed')
      bgVid?.pause()
      land?.classList.remove('k-dark')
      heropin.classList.remove('is-run')
    }
  }, [])

  return <canvas ref={canvasRef} className="hp-canvas" aria-hidden="true" />
}
