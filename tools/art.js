/* FLATTEN A CARD'S ART FOR §4.
 *
 *   node tools/art.js <in.svg> <out.webp> [width] [saturation]
 *
 * Every §4 object has arrived as an SVG that is not one: they are generative
 * exports wrapping embedded base64 PNGs, several megabytes each. Used
 * directly they are several megabytes each on the wire and a fresh document
 * parse per <img> — and the fracture renders NINE <img> of the same source,
 * so that is nine parses of a 4MB file. Flattened, the same art is tens of
 * kilobytes and one decode.
 *
 * TRIMMED, ALWAYS. The renders sit in a big transparent frame with the object
 * somewhere inside it. Left in, that margin is part of the box, and a box is
 * what the layout positions: the knot sat small in its plate because two
 * thirds of its box was empty, and an orbiting prop with a margin orbits at
 * the wrong radius. After trimming, the box IS the object and every number in
 * the layout means what it says.
 *
 * DESATURATED BY DEFAULT, which is a direction call and not a technical one.
 * §4 deleted six per-service colour tints for contradicting a monochrome
 * page; art that arrives carrying a brand blue is the same contradiction
 * wearing different clothes. `0.15` rather than `0` on purpose — the chrome
 * knot keeps a faint cool glint in its highlights and reads better for it, so
 * the house look is not grey, it is near-grey with a trace of cold in the
 * speculars. Pass 1 to ship the colour untouched.
 */
const sharp = require('sharp')
const fs = require('fs')

const IN = process.argv[2]
const OUT = process.argv[3]
const WIDTH = Number(process.argv[4] || 1200)
const SAT = process.argv[5] === undefined ? 0.15 : Number(process.argv[5])
if (!IN || !OUT) {
  console.error('usage: node tools/art.js <in.svg> <out.webp> [width] [saturation]')
  process.exit(1)
}

;(async () => {
  /* density, not scale: an SVG wrapping a bitmap rasterises at whatever DPI it
     is given, and too low a one throws away the resolution the art has */
  const raw = await sharp(IN, { density: 220 }).png().toBuffer()
  const trimmed = await sharp(raw).trim({ threshold: 5 }).toBuffer({ resolveWithObject: true })
  let pipe = sharp(trimmed.data).resize({ width: WIDTH })
  if (SAT !== 1) pipe = pipe.modulate({ saturation: SAT })
  await pipe.webp({ quality: 90, alphaQuality: 95 }).toFile(OUT)

  const m = await sharp(OUT).metadata()
  const before = (fs.statSync(IN).size / 1024).toFixed(0)
  const after = (fs.statSync(OUT).size / 1024).toFixed(0)
  console.log(
    `${OUT.split(/[\\/]/).pop().padEnd(14)} ${m.width}x${m.height}  aspect ${(m.width / m.height).toFixed(4)}  ` +
    `sat ${SAT}  ${before}KB → ${after}KB`,
  )
})()
