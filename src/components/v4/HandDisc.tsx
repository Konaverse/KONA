/**
 * THE HAND'S DISC — the markup the lens driver (src/lib/hand-lens.ts)
 * moves: the SVG refraction filter, then the fixed disc with its glass
 * face, the circle-clipped filtered box the clone is laid into, and the
 * word. One per page (the filter's id is shared); styled in tokens.css
 * (.k-hand-*). No hooks: it renders the same on the server.
 *
 * THE MAP is an SVG drawn to a data URI: red 0→255 left to right, green
 * 0→255 top to bottom (a shift vector per pixel), under a radial plate of
 * neutral grey (128,128 = no shift) that is solid to ~55% of the circle's
 * radius and fades to nothing at its rim. feImage stretches it over the
 * FILTERED BOX, which is 1.6x the circle (tokens.css, .k-hand-fx): the
 * bend samples the picture from beyond the circle's edge, and a box the
 * circle's own size left those samples empty — a dark square inside the
 * rim. The map's stops are written for that 1.6x box.
 *
 * THE FILTER displaces the picture by the map three times — red, green
 * and blue at three amounts, the spread between them the dispersion —
 * keeps one channel of each, screens them back together and softens.
 */

const LENS_MAP =
  'data:image/svg+xml,' +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'>" +
      '<defs>' +
      "<linearGradient id='r' x1='0' y1='0' x2='1' y2='0'><stop offset='0' stop-color='rgb(0,0,0)'/><stop offset='1' stop-color='rgb(255,0,0)'/></linearGradient>" +
      "<linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='rgb(0,0,0)'/><stop offset='1' stop-color='rgb(0,255,0)'/></linearGradient>" +
      "<radialGradient id='n' cx='0.5' cy='0.5' r='0.5'><stop offset='0' stop-color='rgb(128,128,128)' stop-opacity='1'/><stop offset='0.34' stop-color='rgb(128,128,128)' stop-opacity='1'/><stop offset='0.5' stop-color='rgb(128,128,128)' stop-opacity='0.45'/><stop offset='0.625' stop-color='rgb(128,128,128)' stop-opacity='0'/><stop offset='1' stop-color='rgb(128,128,128)' stop-opacity='0'/></radialGradient>" +
      '</defs>' +
      "<rect width='120' height='120' fill='url(%23r)'/>" +
      "<rect width='120' height='120' fill='url(%23g)' style='mix-blend-mode:screen'/>" +
      "<rect width='120' height='120' fill='url(%23n)'/>" +
      '</svg>',
  ).replace(/%2523/g, '%23')

/** the bend at the rim, in px of the filter region, per channel — the
 *  spread between them is the dispersion */
const LENS_R = 30
const LENS_G = 38
const LENS_B = 46
/** the softening after the bend, in px */
const LENS_BLUR = 1.4

export default function HandDisc({ word }: { word: string }) {
  return (
    <>
      <svg className="k-hand-def" aria-hidden="true" focusable="false" width="0" height="0">
        <filter id="k-lens" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feImage href={LENS_MAP} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
          <feDisplacementMap in="SourceGraphic" in2="map" scale={LENS_R} xChannelSelector="R" yChannelSelector="G" result="dr" />
          <feDisplacementMap in="SourceGraphic" in2="map" scale={LENS_G} xChannelSelector="R" yChannelSelector="G" result="dg" />
          <feDisplacementMap in="SourceGraphic" in2="map" scale={LENS_B} xChannelSelector="R" yChannelSelector="G" result="db" />
          <feComponentTransfer in="dr" result="r">
            <feFuncG type="discrete" tableValues="0" />
            <feFuncB type="discrete" tableValues="0" />
          </feComponentTransfer>
          <feComponentTransfer in="dg" result="g">
            <feFuncR type="discrete" tableValues="0" />
            <feFuncB type="discrete" tableValues="0" />
          </feComponentTransfer>
          <feComponentTransfer in="db" result="b">
            <feFuncR type="discrete" tableValues="0" />
            <feFuncG type="discrete" tableValues="0" />
          </feComponentTransfer>
          <feBlend in="r" in2="g" mode="screen" result="rg" />
          <feBlend in="rg" in2="b" mode="screen" result="rgb" />
          <feGaussianBlur in="rgb" stdDeviation={LENS_BLUR} />
        </filter>
      </svg>
      {/* the disc — the glass face (the driver stretches it), the lens
          inside it, and the word, the affordance */}
      <div className="k-hand-disc" aria-hidden="true">
        <i className="k-hand-face">
          <span className="k-hand-lens">
            <span className="k-hand-fx" />
          </span>
        </i>
        <span className="k-hand-word">{word}</span>
      </div>
    </>
  )
}
