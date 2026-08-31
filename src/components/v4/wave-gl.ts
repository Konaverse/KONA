/**
 * THE WAVE — the jelly a project capture grows and shrinks through.
 *
 * Sibling of fold-gl.ts (2026-08-31, the rows redesign of §5): the fold is a
 * sheet LEAVING; this is a sheet CHANGING SIZE in place. The user's brief:
 * "the image mockups will not just get resized in a plain translate. They
 * will get bigger with our webgl wavy movement. Not the fold — since they
 * are not really changing positions we will not entirely fold them, but we
 * will make them wavy."
 *
 * One canvas covers the whole pinned stage; each draw paints one capture as
 * a subdivided plane at an arbitrary rect (CSS px, canvas space), cover-
 * cropped, rounded-cornered, displaced by:
 *   - the BULGE: vertices pushed out of (growing) or into (shrinking) the
 *     plane's centre under a bell envelope — the interior leads the resize,
 *     the edges lag, so the picture swells or sucks in like jelly;
 *   - the RIPPLE: two crossed travelling sines, phase driven by the scrub so
 *     the wave runs with the scroll and reverses with it.
 * Amplitudes are the driver's per frame — zero at rest, so the canvas only
 * ever shows a plane mid-move. At rest the pixels are DOM (house rule).
 *
 * Same disciplines as fold-gl: textures are the DOM <img>s uploaded once,
 * premultiplied alpha, the mask is drawn in UNdisplaced plane space so the
 * rounded corners deform WITH the jelly, DPR capped at 2.
 */

const SEG_X = 80
const SEG_Y = 50

const VERT = `
attribute vec2 aUv;
uniform vec2 uCanvas;   /* the whole canvas, CSS px */
uniform vec4 uRect;     /* x, y, w, h of the plane, CSS px */
uniform float uAmp;     /* scrub ripple amplitude, px */
uniform float uPhase;   /* scrub ripple phase, rad — the scroll's clock */
uniform float uBulge;   /* signed: + swells (growing), - sucks in (shrinking) */
uniform vec2 uPtr;      /* the hand, in plane uv */
uniform float uPtrAmp;  /* hand ripple amplitude, px — pointer ENERGY */
uniform float uPtrPhase;/* hand ripple phase, its own clock */
uniform float uPtrR;    /* the hand's reach, px — the ripple lives HERE */
varying vec2 vP;

void main() {
  vec2 p = aUv;
  vec2 pos = uRect.xy + p * uRect.zw;

  /* the bulge: a bell over the plane so the edges stay near their track
     while the interior leads — the resize reads as elastic, not rigid */
  float bell = sin(3.14159 * p.x) * sin(3.14159 * p.y);
  pos += (p - 0.5) * uRect.zw * uBulge * bell;

  /* the ripple: crossed travelling sines, the fold's diagonal family */
  pos.y += sin((p.x - 0.35 * p.y) * 6.9 - uPhase) * uAmp;
  pos.x += sin((p.y + 0.2 * p.x) * 5.2 - uPhase * 1.35) * uAmp * 0.7;

  /* THE HAND: radial rings leaving the pointer, alive for as long as the
     hand is IN the capture (2026-08-31, user: cursor-focused — the wave
     stays around the cursor, not across the whole image). A gaussian
     confines the ripple to uPtrR around the pointer; the wavelength is
     short enough to read a ring or two inside that reach. */
  vec2 dp = (p - uPtr) * uRect.zw;
  float dist = length(dp);
  float fall = exp(-(dist * dist) / max(uPtrR * uPtrR, 1.0));
  pos += (dp / max(dist, 1.0)) * sin(dist * 0.085 - uPtrPhase) * uPtrAmp * fall;

  gl_Position = vec4(pos.x / uCanvas.x * 2.0 - 1.0, 1.0 - pos.y / uCanvas.y * 2.0, 0.0, 1.0);
  vP = p;
}
`

/* NOTE: a template literal. No backticks in GLSL comments (the HeroPeel
   lesson: the parse error lands nowhere near the cause). */
const FRAG = `
precision highp float;
uniform sampler2D uTex;
uniform vec4 uRect;
uniform float uR;    /* corner radius, px */
uniform vec2 uUv0;   /* cover crop: origin ... */
uniform vec2 uUvS;   /* ... and scale of the sampled window */
varying vec2 vP;

float sdRoundRect(vec2 p, vec2 c, vec2 half_, float r) {
  vec2 q = abs(p - c) - (half_ - vec2(r));
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  /* mask in plane space, before displacement — the rounded rect is part of
     the jelly and deforms with it */
  vec2 px = vP * uRect.zw;
  float d = sdRoundRect(px, uRect.zw * 0.5, uRect.zw * 0.5, uR);
  float mask = 1.0 - smoothstep(-1.0, 1.0, d);

  vec3 col = texture2D(uTex, uUv0 + vP * uUvS).rgb;
  gl_FragColor = vec4(col * mask, mask); /* premultiplied */
}
`

export type WaveDraw = {
  rect: { x: number; y: number; w: number; h: number }
  radius: number
  uv0: [number, number]
  uvS: [number, number]
  /** the scrub's jelly — zero at rest */
  amp: number
  phase: number
  bulge: number
  /** the hand's rings — zero when untouched */
  ptr: [number, number]
  ptrAmp: number
  ptrPhase: number
  /** the rings' reach around the pointer, px */
  ptrR: number
}

export type WaveGL = {
  upload: (i: number, img: HTMLImageElement) => boolean
  /** once per frame, before any draw: fits the buffer, clears the canvas */
  begin: () => void
  draw: (i: number, d: WaveDraw) => void
  clear: () => void
}

export function createWaveGL(canvas: HTMLCanvasElement, count: number): WaveGL | null {
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
      console.warn('[wave-gl] shader:', gl.getShaderInfoLog(s))
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
  const uCanvas = U('uCanvas')
  const uRect = U('uRect')
  const uAmp = U('uAmp')
  const uPhase = U('uPhase')
  const uBulge = U('uBulge')
  const uPtr = U('uPtr')
  const uPtrAmp = U('uPtrAmp')
  const uPtrPhase = U('uPtrPhase')
  const uPtrR = U('uPtrR')
  const uR = U('uR')
  const uUv0 = U('uUv0')
  const uUvS = U('uUvS')
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
    begin() {
      resize()
      gl.uniform2f(uCanvas, canvas.clientWidth, canvas.clientHeight)
      gl.clear(gl.COLOR_BUFFER_BIT)
    },
    draw(i, d) {
      gl.bindTexture(gl.TEXTURE_2D, texs[i])
      gl.uniform4f(uRect, d.rect.x, d.rect.y, d.rect.w, d.rect.h)
      gl.uniform1f(uAmp, d.amp)
      gl.uniform1f(uPhase, d.phase)
      gl.uniform1f(uBulge, d.bulge)
      gl.uniform2f(uPtr, d.ptr[0], d.ptr[1])
      gl.uniform1f(uPtrAmp, d.ptrAmp)
      gl.uniform1f(uPtrPhase, d.ptrPhase)
      gl.uniform1f(uPtrR, d.ptrR)
      gl.uniform1f(uR, d.radius)
      gl.uniform2f(uUv0, d.uv0[0], d.uv0[1])
      gl.uniform2f(uUvS, d.uvS[0], d.uvS[1])
      gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0)
    },
    clear() {
      gl.clear(gl.COLOR_BUFFER_BIT)
    },
  }
}
