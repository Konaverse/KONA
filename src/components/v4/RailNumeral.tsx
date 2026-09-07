import { DIGITS, UPEM } from '@/components/v4/digit-paths'

/**
 * THE RAIL NUMERAL — a giant step number drawn as Manrope ExtraLight's own
 * digit outlines (digit-paths.ts), filled with the shared fade-out
 * gradient (`#pr-fade`, defined once by whoever mounts a rail) and
 * overlaid with the COMET: three dash strokes sharing one travelling
 * head, driven by the mounting section's scrub (one lap per step).
 *
 * EXTRACTED 2026-09-08 from Process.tsx (the homepage's parked §7) so the
 * service template's schedule can carry the same numerals. The CSS
 * (.pr-rsvg / .pr-glyph / .pr-c*) lives in tokens.css for the same reason.
 */

/* the comet's three layers: segment length (of a pathLength-100 lap) and
   weight. All three END on the same travelling head; the union reads as a
   dark head with a fading tail. */
export const COMET = [
  { len: 8, cls: 'pr-c pr-c1' },
  { len: 18, cls: 'pr-c pr-c2' },
  { len: 30, cls: 'pr-c pr-c3' },
]

/** tracking between the two digits, in em — the DOM numerals' -0.06em */
const TRACK = -0.06

/**
 * One rail numeral: Manrope's own digit outlines, filled with the shared
 * fade gradient and overlaid with the comet strokes. The viewBox brackets
 * the digits' real ink (y 480–2080 in font units, baseline 2000) so the
 * glyphs fill the box edge to edge.
 */
export default function RailNumeral({ no }: { no: string }) {
  const chars = no.split('')
  let x = 0
  const placed = chars.map((ch) => {
    const g = DIGITS[ch]
    const at = x
    x += (g.advance + TRACK) * UPEM
    return { ch, g, at }
  })
  const w = x - TRACK * UPEM // no tracking after the last digit
  return (
    <svg className="pr-rsvg" viewBox={`0 480 ${Math.round(w)} 1600`} aria-hidden="true" focusable="false">
      {placed.map(({ ch, g, at }, i) => (
        <g key={i} transform={`translate(${Math.round(at)} 0)`}>
          <path className="pr-glyph" d={g.d} />
          {/* dash geometry is set by the driver in MEASURED units —
              pathLength normalisation is off the table because Chromium
              ignores it under non-scaling-stroke, and screen-space dashes
              turn the comet into confetti. data-len is the segment's share
              of one lap, in % of the contour. */}
          {COMET.map((c) => (
            <path key={c.cls} className={c.cls} d={g.d} data-len={c.len} />
          ))}
        </g>
      ))}
    </svg>
  )
}

