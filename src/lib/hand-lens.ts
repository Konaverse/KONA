/**
 * THE HAND'S LENS — the glass disc that follows the pointer over a thing
 * you can act on: "Drag" over the about page's toolset row (AboutTools),
 * "View" over the work hub's cards (WorkMotion). One driver, so the two
 * are the same object (2026-09-13; grew out of the toolset's disc, user:
 * "do the same thing for the view glass on the projects hub").
 *
 * What it does, per frame, given the pointer and the element under it:
 *
 * PRESENCE. The caller decides what is under the hand by hit-testing its
 * own targets against the pointer's LAST KNOWN place (a page-level
 * pointermove — see hand-lens's users), every frame, not by enter/leave
 * events: a row scrolling under a still trackpad pointer must show the
 * disc at once, and scrolling on must hide it. While anything is under
 * the hand the native cursor is hidden by a class on <html> (the
 * hovered element's own cursor rule only re-evaluates on mouse move).
 *
 * MOTION. A spring, not a glide: the disc is a mass on a lightly
 * underdamped spring toward the pointer, so it overshoots a touch and
 * settles; a constant pull downward hangs it a few pixels under the hand
 * at rest and makes the settle asymmetric. Its face STRETCHES along its
 * own velocity and rounds back at rest. Its scale is a spring too: in
 * with an overshoot, smaller while the hand holds, away when nothing is
 * under it. Born under the hand, never slid in from where it last was.
 *
 * THE GLASS refracts — Apple's glass. Chrome will not run an SVG filter
 * as a backdrop-filter (probed: the computed value comes back "none",
 * the whole list rejected), and no CSS backdrop function bends geometry.
 * So the disc carries its own picture of what is under it: a CLONE of
 * the target lives inside the face (inert, aria-hidden, ids stripped),
 * in a wrapper laid every frame on the target's live rect in the disc's
 * own frame, clipped to the circle, and run through the SVG displacement
 * filter in HandDisc.tsx with a plain `filter: url()`. The centre is left
 * alone; toward the rim the picture bends and compresses, its colour
 * channels split by three different amounts — real dispersion — then a
 * soft blur. The filtered box is wider than the circle so the bend at
 * the rim samples from beyond the edge (a box the circle's size left a
 * dark square inside the rim). The caller prepares the clone (its
 * hover state, its reveal forced in) and mirrors per-frame state onto
 * it (a dragged track's transform, a spotlight's custom properties).
 *
 * Everything here is transform and custom properties; the caller owns
 * the ticker and calls tick() from it.
 */

/** the disc's spring: stiffness per frame and velocity kept per frame.
 *  0.14 / 0.72 overshoots about a tenth and settles in ~20 frames */
const SPRING_K = 0.14
const SPRING_D = 0.72
/** the pull downward, px per frame² — hangs the disc g/k px under the
 *  hand at rest (~5px) and makes the settle asymmetric */
const GRAVITY = 0.7
/** the stretch: how much of the speed becomes elongation, and its cap */
const STRETCH = 0.005
const STRETCH_MAX = 0.32
/** the scale spring — snappier than the position's, still bouncy */
const SCALE_K = 0.2
const SCALE_D = 0.68
/** the disc while the hand holds the target */
const HOLD_SCALE = 0.84
/** the class on <html> that hides the cursor while the hand is over a
 *  target (tokens.css) */
const HAND_CLASS = 'k-hand'

export interface HandLensOptions {
  /** the disc (HandDisc.tsx's `.k-hand-disc`) */
  disc: HTMLElement
  /** prepare a fresh clone of a target: its state classes, what to
   *  switch off. Called once per target. */
  onClone?: (clone: HTMLElement, source: HTMLElement) => void
  /** mirror per-frame state from the target onto its clone */
  syncClone?: (clone: HTMLElement, source: HTMLElement) => void
}

export interface HandLens {
  /** every frame: the pointer, the element under it (null = none),
   *  whether the hand is holding it */
  tick(px: number, py: number, target: HTMLElement | null, holding: boolean): void
  destroy(): void
}

export function createHandLens({ disc, onClone, syncClone }: HandLensOptions): HandLens {
  const face = disc.querySelector<HTMLElement>('.k-hand-face')
  const fx = disc.querySelector<HTMLElement>('.k-hand-fx')
  const html = document.documentElement

  let over = false
  /* the disc: position, velocity, scale — each a spring */
  let dx = 0
  let dy = 0
  let vx = 0
  let vy = 0
  let sc = 0
  let vs = 0
  /* the lens' clone and what it is a clone of */
  let source: HTMLElement | null = null
  let wrap: HTMLElement | null = null
  let clone: HTMLElement | null = null

  const dropClone = () => {
    wrap?.remove()
    wrap = null
    clone = null
    source = null
  }
  const setClone = (target: HTMLElement) => {
    dropClone()
    if (!fx) return
    const c = target.cloneNode(true) as HTMLElement
    c.classList.add('k-hand-clone')
    c.setAttribute('aria-hidden', 'true')
    c.inert = true
    c.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'))
    c.querySelectorAll<HTMLElement>('a, button, [tabindex]').forEach((el) => el.setAttribute('tabindex', '-1'))
    /* the wrapper carries the alignment; the clone's own transform (a
       hover lift, a reveal) is the caller's to switch off in CSS */
    const w = document.createElement('div')
    w.className = 'k-hand-clone-w'
    w.appendChild(c)
    fx.appendChild(w)
    onClone?.(c, target)
    wrap = w
    clone = c
    source = target
  }
  const setOver = (on: boolean, px: number, py: number) => {
    if (on === over) return
    over = on
    html.classList.toggle(HAND_CLASS, on)
    if (on) {
      dx = px
      dy = py
      vx = 0
      vy = 0
    }
  }

  const tick = (px: number, py: number, target: HTMLElement | null, holding: boolean) => {
    setOver(target !== null, px, py)
    if (target && target !== source) setClone(target)
    if (!over && sc < 0.002) {
      /* shrunk away: the picture can go */
      if (source) dropClone()
      return
    }

    /* THE SPRING toward the hand, with the pull downward */
    vx = (vx + (px - dx) * SPRING_K) * SPRING_D
    vy = (vy + (py - dy) * SPRING_K + GRAVITY) * SPRING_D
    dx += vx
    dy += vy
    /* THE SCALE: in with an overshoot, smaller while holding, away */
    const goal = !over ? 0 : holding ? HOLD_SCALE : 1
    vs = (vs + (goal - sc) * SCALE_K) * SCALE_D
    sc += vs
    if (!over && sc < 0.002) sc = 0
    /* THE STRETCH: the face elongates along its velocity */
    const speed = Math.hypot(vx, vy)
    const s = 1 + Math.min(speed * STRETCH, STRETCH_MAX)
    const a = speed > 0.5 ? (Math.atan2(vy, vx) * 180) / Math.PI : 0

    const left = dx - disc.offsetWidth / 2
    const top = dy - disc.offsetHeight / 2
    disc.style.transform = `translate3d(${left.toFixed(1)}px, ${top.toFixed(1)}px, 0)`
    disc.style.setProperty('--k-sc', sc.toFixed(3))
    if (face) face.style.transform = `rotate(${a.toFixed(1)}deg) scale(${(sc * s).toFixed(3)}, ${(sc / s).toFixed(3)}) rotate(${(-a).toFixed(1)}deg)`

    /* THE LENS: the clone laid exactly over its source, in the disc's own
       frame — the filtered box starts outside the circle, so its own
       offset comes off, or the picture lands that far down and right */
    if (clone && wrap && source && fx) {
      const r = source.getBoundingClientRect()
      wrap.style.width = `${r.width.toFixed(1)}px`
      wrap.style.height = `${r.height.toFixed(1)}px`
      wrap.style.transform = `translate3d(${(r.left - left - fx.offsetLeft).toFixed(1)}px, ${(r.top - top - fx.offsetTop).toFixed(1)}px, 0)`
      syncClone?.(clone, source)
    }
  }

  const destroy = () => {
    dropClone()
    html.classList.remove(HAND_CLASS)
    disc.style.transform = ''
    disc.style.removeProperty('--k-sc')
    if (face) face.style.transform = ''
  }

  return { tick, destroy }
}

/** is the point inside the rect — the callers' hit test */
export const within = (r: DOMRect, x: number, y: number) => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom
