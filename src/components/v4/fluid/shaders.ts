/**
 * Fluid simulation shaders — ported from giats-portfolio.
 *
 * Inlined as template strings rather than kept as .frag files: that repo loads
 * shaders through a webpack rule (raw-loader + glslify-loader), and this project
 * builds with Turbopack, where that rule does not apply. Inlining removes the
 * build-tool dependency entirely.
 *
 * The simulation shaders below are a faithful port — a standard Navier-Stokes
 * solver (advect → curl → vorticity → divergence → pressure → subtract). Only
 * POST is rewritten; see the note there.
 */

export const BASE_VERT = /* glsl */ `
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform vec2 texelSize;

void main() {
  vUv = uv;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(position, 1.0);
}
`

export const SPLAT_FRAG = /* glsl */ `
varying vec2 vUv;
uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 uColor;
uniform vec2 uPointer;
uniform float uRadius;

void main() {
  vec2 p = vUv - uPointer.xy;
  p.x *= aspectRatio;
  vec3 splat = exp(-dot(p, p) / uRadius) * uColor;
  vec3 base = texture2D(uTarget, vUv).xyz;
  gl_FragColor = vec4(base + splat, 1.0);
}
`

export const ADVECTION_FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float uDissipation;

void main() {
  vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
  gl_FragColor = uDissipation * texture2D(uSource, coord);
  gl_FragColor.a = 1.0;
}
`

export const DIVERGENCE_FRAG = /* glsl */ `
precision highp float;
varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uVelocity;

void main() {
  float L = texture2D(uVelocity, vL).x;
  float R = texture2D(uVelocity, vR).x;
  float T = texture2D(uVelocity, vT).y;
  float B = texture2D(uVelocity, vB).y;
  vec2 C = texture2D(uVelocity, vUv).xy;
  if (vL.x < 0.0) { L = -C.x; }
  if (vR.x > 1.0) { R = -C.x; }
  if (vT.y > 1.0) { T = -C.y; }
  if (vB.y < 0.0) { B = -C.y; }
  float div = 0.5 * (R - L + T - B);
  gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
}
`

export const CURL_FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uVelocity;

void main() {
  float L = texture2D(uVelocity, vL).y;
  float R = texture2D(uVelocity, vR).y;
  float T = texture2D(uVelocity, vT).x;
  float B = texture2D(uVelocity, vB).x;
  float vorticity = R - L - T + B;
  gl_FragColor = vec4(vorticity, 0.0, 0.0, 1.0);
}
`

export const VORTICITY_FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float uCurlValue;
uniform float dt;

void main() {
  float L = texture2D(uCurl, vL).x;
  float R = texture2D(uCurl, vR).x;
  float T = texture2D(uCurl, vT).x;
  float B = texture2D(uCurl, vB).x;
  float C = texture2D(uCurl, vUv).x;
  vec2 force = vec2(abs(T) - abs(B), abs(R) - abs(L)) * 0.5;
  force /= length(force) + 1.0;
  force *= uCurlValue * C;
  force.y *= -1.0;
  vec2 vel = texture2D(uVelocity, vUv).xy;
  gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
}
`

export const PRESSURE_FRAG = /* glsl */ `
precision highp float;
varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;

void main() {
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  float divergence = texture2D(uDivergence, vUv).x;
  float pressure = (L + R + B + T - divergence) * 0.25;
  gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
}
`

export const GRADIENT_SUBTRACT_FRAG = /* glsl */ `
precision highp float;
varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;

void main() {
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  vec2 velocity = texture2D(uVelocity, vUv).xy;
  velocity.xy -= vec2(R - L, T - B);
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}
`

export const CLEAR_FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTexture;
uniform float uClearValue;

void main() { gl_FragColor = uClearValue * texture2D(uTexture, vUv); }
`

/**
 * POST — rewritten, and this is the one part that is NOT a faithful port.
 *
 * The original composites for a DARK page: it renders a near-black background
 * with a light fluid and the canvas sits over the page with
 * `mix-blend-mode: difference`. On a dark page difference-with-black is a no-op
 * and the fluid lightens. On WHITE that same setup inverts — a pale blue fluid
 * would come out muddy orange, the exact opposite of "icey".
 *
 * So Whiteout composites with `multiply` instead, and this shader outputs WHITE
 * where there is no fluid (multiply by white leaves the page untouched) and ice
 * where there is. Density drives a single lerp between the two rather than
 * scaling the colour itself, which is what kept the original's low-density
 * regions from going dark.
 */
export const POST_FRAG = /* glsl */ `
uniform sampler2D tFluid;
uniform vec3 uIce;      // --ice       #7FA8C9  the thin edges
uniform vec3 uGraphite; // --graphite  #687076  the fast, smoky parts
uniform vec3 uIceDeep;  // --ice-deep  #2E5F8A  the dense core
uniform float uIntensity;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec3 fluid = texture2D(tFluid, uv).rgb;

  // The splat writes (velocityX, velocityY, 10.0), accumulated and dissipated
  // each frame — so .b carries how MUCH dye is here and .rg how FAST it was
  // moving when it was laid down. Two independent quantities, so the colour
  // can be driven by both instead of by density alone.
  float amount = abs(fluid.b);
  float speed  = length(fluid.rg);

  // pow < 1 lifts the LOW end of the curve. Under multiply a faint trail is
  // nearly invisible on white, so the thin outer wisps need the gain far more
  // than the core does — a linear ramp spends all its range on the middle.
  float d = clamp(pow(length(fluid) * uIntensity, 0.70), 0.0, 1.0);

  // DEPTH — density ramps white -> ice -> ice-deep. Thin trailing edges stay
  // pale and airy, the core goes deep. Monotonically darkening, which is what
  // keeps it reading as one substance rather than a gradient sticker.
  vec3 c = mix(vec3(1.0), uIce, smoothstep(0.0, 0.26, d));
  c = mix(c, uIceDeep, smoothstep(0.30, 0.92, d));

  // SPEED — graphite mixes into the quick-moving parts. It is the one neutral
  // in the palette, so it reads as smoke pulled through the blue rather than
  // as a third colour competing with it. Without this the whole thing is a
  // single blue ramp and looks synthetic.
  float smoke = clamp(speed / (amount + 0.001) * 0.6, 0.0, 1.0);
  c = mix(c, uGraphite, smoke * d * 0.55);

  outputColor = vec4(c, 1.0);
}
`
