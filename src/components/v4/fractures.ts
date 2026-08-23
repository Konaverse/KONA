/**
 * THE FRACTURE TABLE — how each service's object comes apart.
 *
 * The pattern (user call, 2026-08-23, after the glass screen proved it): a
 * card's object RESTS IN PIECES and assembles under the pointer. That is the
 * house move for §4 now, not a one-off for the 3D card, so the machinery
 * lives in Fractured.tsx and everything a particular object needs to know
 * lives here as data.
 *
 * ONE IMAGE, N COPIES, N CLIP-PATHS. Every piece is the same <img> at the
 * same box, cut to a different polygon — so together they are the picture,
 * exactly, and pulled apart they are its wreckage. One decode backs all of
 * them, and only `transform` and `opacity` ever animate.
 *
 * ── THE TWO WAYS A THING BREAKS ───────────────────────────────────────────
 * They needed different geometry AND different pivots, which is the whole
 * reason this file has a `pivot` field rather than one hard-coded rule:
 *
 *   SHARDS (`pivot: 'piece'`) — flat glass. A crack figure: an off-centre
 *   impact, an irregular ring around it, radial cracks out to the border.
 *   Each shard tilts about ITS OWN centroid and slides outward, the way a
 *   broken pane's pieces sit in their frame. Rotating about the picture's
 *   centre instead would swing a corner shard through a huge arc.
 *
 *   SEGMENTS (`pivot: 'picture'`) — a chrome loop. Glass logic is wrong for
 *   it: a tube does not shatter into triangles, it comes apart along its own
 *   curve. So it is cut as a ring with spokes — a core that holds and arcs
 *   that open away from it — and every arc turns about the PICTURE's centre,
 *   which, for an object that is essentially circular, slides it along the
 *   path it already lies on. The knot comes undone rather than exploding.
 *   All the rotations run the same direction on purpose: mixed signs make
 *   neighbours turn INTO each other and the overlaps read as mud.
 */

export type Piece = {
  /** the polygon, in percentages of the picture's box, before overlap */
  pts: [number, number][]
  /** how far from home it rests, in px, along its own outward ray */
  push: number
  /** its rest rotation in degrees, about whichever pivot the set declares */
  rot: number
}

export type Fracture = {
  src: string
  /** what a piece turns around — see the note above; this is not cosmetic */
  pivot: 'piece' | 'picture'
  /** `cover` fills the plate (the screen IS the plate); `contain` floats */
  fit: 'cover' | 'contain'
  pieces: Piece[]
}

/** how much neighbours overlap, so no hairline shows when assembled */
export const OVERLAP = 1.015

/** area centroid — the vertex mean drifts badly on the five-sided cells */
export function centroid(pts: [number, number][]): [number, number] {
  let a = 0
  let cx = 0
  let cy = 0
  for (let i = 0; i < pts.length; i++) {
    const [x0, y0] = pts[i]
    const [x1, y1] = pts[(i + 1) % pts.length]
    const f = x0 * y1 - x1 * y0
    a += f
    cx += (x0 + x1) * f
    cy += (y0 + y1) * f
  }
  a *= 0.5
  if (Math.abs(a) < 1e-6) {
    const n = pts.length
    return [pts.reduce((s, p) => s + p[0], 0) / n, pts.reduce((s, p) => s + p[1], 0) / n]
  }
  return [cx / (6 * a), cy / (6 * a)]
}

/* ── SHARED GEOMETRY ───────────────────────────────────────────────────────
   Cells that reach the border need to know where a ray leaves the box, and
   which corners it swallows on the way. Both are built rather than typed out:
   see the note over CORNERS. */

/** where a ray leaves a 0..100 box from its centre. Angles are degrees, y down. */
function edgePoint(deg: number): [number, number] {
  const r = (deg * Math.PI) / 180
  const dx = Math.cos(r)
  const dy = Math.sin(r)
  const tx = Math.abs(dx) < 1e-9 ? Infinity : 50 / Math.abs(dx)
  const ty = Math.abs(dy) < 1e-9 ? Infinity : 50 / Math.abs(dy)
  const t = Math.min(tx, ty)
  return [50 + dx * t, 50 + dy * t]
}

/** the box's corners, at the angles a ray would have to leave through them.
    A cell whose span crosses one has an extra vertex there and a cell that
    does not has none — exactly the thing that ends up wrong in the seventh
    entry and nowhere else, so it is folded in by code, not by hand. */
const CORNERS: [number, [number, number]][] = [
  [45, [100, 100]],
  [135, [0, 100]],
  [225, [0, 0]],
  [315, [100, 0]],
]

/* ══════════════════════════════════════════════════════════════════════════
   THE GLASS SCREEN — a browser mockup, so it breaks like a pane.
   Impact at (54, 44); ring vertices at (40,24) (62,20) (78,38) (72,62)
   (50,70) (33,55); radial cracks from each of those out to the border.
   Three inner cells fanning off the impact, six outer ones reaching the
   edges. Every cell four to six sided, all sharing edges.
   ══════════════════════════════════════════════════════════════════════════ */
export const GLASS_SCREEN: Fracture = {
  src: '/services/3d-websites/glass-screen.webp',
  pivot: 'piece',
  fit: 'cover',
  pieces: [
    { pts: [[54, 44], [40, 24], [62, 20], [78, 38]], push: 7, rot: 1.8 },
    { pts: [[54, 44], [78, 38], [72, 62], [50, 70]], push: 6, rot: -2.4 },
    { pts: [[54, 44], [50, 70], [33, 55], [40, 24]], push: 8, rot: 3.1 },
    { pts: [[40, 24], [62, 20], [69, 0], [23, 0]], push: 13, rot: -3.4 },
    { pts: [[62, 20], [78, 38], [100, 32], [100, 0], [69, 0]], push: 16, rot: 2.6 },
    { pts: [[78, 38], [72, 62], [100, 90], [100, 32]], push: 15, rot: -1.9 },
    { pts: [[72, 62], [50, 70], [45, 100], [100, 100], [100, 90]], push: 18, rot: 4.2 },
    { pts: [[50, 70], [33, 55], [0, 72], [0, 100], [45, 100]], push: 14, rot: -4.6 },
    { pts: [[33, 55], [40, 24], [23, 0], [0, 0], [0, 72]], push: 17, rot: 3.7 },
  ],
}

/* ══════════════════════════════════════════════════════════════════════════
   THE CHROME KNOT — a closed loop of tube, so it comes apart along itself.

   FIRST CUT WAS WRONG and it is worth saying why: eight wedges straight from
   the centre. It worked, but every cut converged on one point, so the object
   read as SLICED — a pizza — rather than deconstructed, and the meeting point
   opened into a black star exactly where the knot's crossings are busiest.

   This is a RING AND SPOKES instead. An irregular ring sits inside the
   tangle, and the spokes only run from the ring OUT to the border. So the
   core holds together while seven arcs open away from it, which is what a
   knot coming undone actually looks like — the loops let go, the crossing
   does not. The hub barely moves; everything else rotates the SAME WAY about
   the picture's centre, sliding each arc along the circle it already lies on.
   Mixed signs make neighbours turn INTO each other and the overlaps read as
   mud.
   ══════════════════════════════════════════════════════════════════════════ */
const RING_ANGLE = [14, 66, 111, 158, 209, 261, 313]
const RING_R = [26, 23, 28, 24, 27, 22, 25]
const KNOT_PUSH = [17, 11, 20, 13, 18, 10, 15]
const KNOT_ROT = [8, 12, 6, 13, 9, 11, 7]

const ringPt = (i: number): [number, number] => {
  const r = (RING_ANGLE[i] * Math.PI) / 180
  return [50 + Math.cos(r) * RING_R[i], 50 + Math.sin(r) * RING_R[i]]
}

export const CHROME_KNOT: Fracture = {
  src: '/services/3d-websites/knot.webp',
  pivot: 'picture',
  fit: 'contain',
  pieces: [
    /* the hub: the crossing, which holds. It still drifts a hair — a core
       that is perfectly still reads as a separate object sitting on top. */
    { pts: RING_ANGLE.map((_, i) => ringPt(i)), push: 3, rot: 2 },
    /* the arcs: ring edge, out along both spokes, round the border between */
    ...RING_ANGLE.map((ang, i) => {
      const j = (i + 1) % RING_ANGLE.length
      const end = RING_ANGLE[j] > ang ? RING_ANGLE[j] : RING_ANGLE[j] + 360
      const pts: [number, number][] = [ringPt(i), ringPt(j), edgePoint(end % 360)]
      for (const [c, p] of CORNERS) {
        for (const k of [c, c + 360]) if (k > ang && k < end) pts.push(p)
      }
      pts.push(edgePoint(ang))
      return { pts, push: KNOT_PUSH[i], rot: KNOT_ROT[i] }
    }),
  ],
}

/* ── render-ready form ─────────────────────────────────────────────────────
   Resolved once at module scope so it is identical on the server and the
   client: a random() in here would hydrate to a different break than it
   rendered. Sorted OUTERMOST FIRST, which makes DOM order the assembly
   order — that is what lets the stagger stay a plain `from: 'start'` and
   makes the arrival sweep inward. */
export type Built = {
  clip: string
  origin: string
  x: number
  y: number
  rot: number
}

export function build(f: Fracture): Built[] {
  return f.pieces
    .map((p) => {
      const c = centroid(p.pts)
      const dx = c[0] - 50
      const dy = c[1] - 50
      const len = Math.hypot(dx, dy) || 1
      return {
        clip: `polygon(${p.pts
          .map(
            ([x, y]) =>
              `${(c[0] + (x - c[0]) * OVERLAP).toFixed(3)}% ${(c[1] + (y - c[1]) * OVERLAP).toFixed(3)}%`,
          )
          .join(', ')})`,
        origin: f.pivot === 'piece' ? `${c[0].toFixed(2)}% ${c[1].toFixed(2)}%` : '50% 50%',
        x: (dx / len) * p.push,
        y: (dy / len) * p.push,
        rot: p.rot,
        dist: len,
      }
    })
    .sort((a, b) => b.dist - a.dist)
    .map(({ dist: _dist, ...rest }) => rest)
}
