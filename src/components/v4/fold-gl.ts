/**
 * THE FOLD, SHARED — the corner fold a project sheet leaves by.
 *
 * Extracted from WorkFold.tsx (2026-08-26) the day the desktop §5 wanted the
 * same fold (WorkFold itself — the phone fold deck — was replaced by the
 * card deck the same day and deleted; git 8f46d2b has it): HeroPeel's eight-corner clock, hinge sweep, reflect-past-the-
 * hinge fold, back-face grade and ripple, trimmed of the landing/opening/
 * stretch that belong to a sheet becoming another section's ground, plus
 * the CARRY that takes the released bundle off through the bottom-left
 * corner. If the hero's fold character is ever retuned, retune here.
 *
 * `uMono` pulls the sheet to its luminance so a folding sheet matches the
 * mono veil the desktop window rests under (0 = the picture as it is).
 * The canvas draws ONLY mid-turn — at rest the pixels are always DOM.
 */

/* the fold mesh — same density class as the hero's, a phone draws it free */
const SEG_X = 120
const SEG_Y = 80

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
uniform float uMono; /* 0..1: how far the sheet is pulled to its luminance (the desktop veil) */
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
  col = mix(col, vec3(dot(col, vec3(0.2126, 0.7152, 0.0722))), uMono);
  /* the back of the sheet: dimmed and pulled toward its own luminance,
     unlit stock rather than a second front (HeroPeel's grade) */
  float back = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(col, mix(col, vec3(back), 0.6) * 0.74, vBack);

  gl_FragColor = vec4(col * mask, mask); /* premultiplied */
}
`

export type DeckGL = {
  upload: (i: number, img: HTMLImageElement) => boolean
  draw: (i: number, show: number, radius: number, mono?: number) => void
  clear: () => void
}

export function createFoldGL(canvas: HTMLCanvasElement, count: number): DeckGL | null {
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
      console.warn('[fold-gl] shader:', gl.getShaderInfoLog(s))
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
  const uMono = U('uMono')
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
    draw(i, show, radius, mono = 0) {
      resize()
      gl.bindTexture(gl.TEXTURE_2D, texs[i])
      gl.uniform2f(uSize, canvas.clientWidth, canvas.clientHeight)
      gl.uniform1f(uShow, show)
      gl.uniform1f(uR, radius)
      gl.uniform1f(uMono, mono)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0)
    },
    clear() {
      gl.clear(gl.COLOR_BUFFER_BIT)
    },
  }
}

