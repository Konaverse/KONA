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
 * POST — back to the port's own compositing, for the first time since it landed.
 *
 * The original composites with `mix-blend-mode: difference` over a near-black
 * background. Whiteout could not use that: on an all-white page difference
 * turns a pale blue fluid muddy orange, so this shader was rewritten to output
 * WHITE where there is no fluid and composite with `multiply` instead.
 *
 * THE MONOCHROME PIVOT PUTS DIFFERENCE BACK (2026-08-22), and it is not
 * nostalgia — difference is the only compositing that does what the direction
 * actually asks for. The page now has both polarities, and the cursor has to
 * read on both. Difference gives that for free, because the operation is
 * |backdrop - source|:
 *
 *   · source 0 (black)  -> backdrop, untouched. The no-op.
 *   · source 1 (white)  -> 1 - backdrop. A full flip: black over paper,
 *                          white over void, and neither had to be detected.
 *   · source 0.5 (grey) -> everything under it converges toward mid grey,
 *                          which is a soft wash rather than a hard invert.
 *
 * And it costs nothing extra to make the TYPE and the PHOTOGRAPHY invert with
 * it: difference operates on whatever composited below the canvas, so a
 * headline under the trail flips, and a photograph under it goes to negative,
 * per pixel, with no per-surface handling anywhere in the code.
 *
 * So this shader outputs BLACK where there is no fluid, and ramps to white
 * through the density. Value IS the amount of inversion; the palette is three
 * points on that ramp rather than three hues.
 */
export const POST_FRAG = /* glsl */ `
uniform sampler2D tFluid;
uniform vec3 uEdge;   // thin trailing edges — a soft wash toward grey
uniform vec3 uSmoke;  // the fast-moving parts
uniform vec3 uCore;   // the dense core — white, a full inversion
uniform float uIntensity;
uniform float uFade;    // density below this paints nothing at all

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec3 fluid = texture2D(tFluid, uv).rgb;

  // The splat writes (velocityX, velocityY, 10.0), accumulated and dissipated
  // each frame — so .b carries how MUCH dye is here and .rg how FAST it was
  // moving when it was laid down. Two independent quantities, so the colour
  // can be driven by both instead of by density alone.
  float amount = abs(fluid.b);
  float speed  = length(fluid.rg);

  // THE TRAIL HAS TO END. Dye decays geometrically, so without a floor it
  // never reaches zero — and the pow(0.70) below, which exists to lift thin
  // wisps, lifts that dying remnant just as hard. The two together kept a
  // clearly readable trail on screen for about three seconds after the pointer
  // had stopped, which is what read as "lingering".
  //
  // uFade cuts the bottom off, so the tail has a defined end instead of an
  // asymptote. It also DECOUPLES presence from persistence: the gain can now be
  // raised for a stronger trail without that trail also lasting longer, which
  // is exactly the trade that was stuck before.
  float raw = length(fluid) * uIntensity;
  float a = smoothstep(uFade, 1.0, raw);

  // pow < 1 still lifts the LOW end of what survives the floor, so the thin
  // outer wisps get the gain the core does not need — a linear ramp spends all
  // its range on the middle.
  float d = clamp(pow(a, 0.70), 0.0, 1.0);

  // DEPTH — density ramps black -> edge -> core, which under difference is a
  // ramp from "leave the page alone" to "flip it completely". Thin trailing
  // edges only wash the page toward grey; the core inverts it outright.
  // Monotonically brightening, so it reads as one substance rather than a
  // gradient sticker.
  vec3 c = mix(vec3(0.0), uEdge, smoothstep(0.0, 0.26, d));
  c = mix(c, uCore, smoothstep(0.30, 0.92, d));

  // SPEED — the quick-moving parts pull toward uSmoke instead of the core, so
  // a fast smear stays a partial flip and a dwell goes all the way. That is
  // the same two-quantity idea the ice version used to get with a neutral hue,
  // expressed as value now that there are no hues left to use.
  float smoke = clamp(speed / (amount + 0.001) * 0.6, 0.0, 1.0);
  c = mix(c, uSmoke, smoke * d * 0.55);

  outputColor = vec4(c, 1.0);
}
`
