'use client'

import { useEffect, useRef } from 'react'
import { watchInView } from '@/lib/in-view'
import { gsap } from '@/lib/motion-v4'
import { build, type Fracture, type Built } from '@/components/v4/fractures'

/**
 * THE HOUSE MOVE FOR §4's CARDS — an object that RESTS IN PIECES, assembles
 * under the pointer, then lifts out of its plate and turns for as long as you
 * stay.
 *
 * Generalised from the glass screen (2026-08-23) on the user's call: the
 * fracture is not the 3D card's trick, it is what almost every card does, so
 * this component knows nothing about any particular object. What breaks, how
 * it breaks, what it pivots around, how fast it turns and how far it opens is
 * data in fractures.ts; the timeline, the triggers and the performance
 * discipline are here.
 *
 * ── WHAT IT RENDERS ───────────────────────────────────────────────────────
 * N copies of ONE image, same box, each cut to a different polygon by
 * `clip-path`. Together they are the picture exactly; pulled apart they are
 * its wreckage, and the plate's dark ground shows through the cuts.
 *
 * ── THE SEQUENCE ──────────────────────────────────────────────────────────
 * ASSEMBLE (~0.9s). Pieces fly home on `power3.inOut` over 0.7s, staggered
 * 0.03 in DOM order — which fractures.ts has already sorted outermost-first,
 * so the arrival sweeps INWARD and the object closes last at the point it
 * broke.
 *
 * THEN, and only once it is whole: it OPENS (a scale, `art.expand`) and, if
 * the object is one that should turn, begins to TURN (`art.spin` seconds a
 * revolution, linear, forever — or 0 for objects that only open). Opening is
 * what pushes it past the top of its plate; see ESCAPING THE FRAME. Turning
 * is the reward for staying, and it is not for everything: a shape with an up
 * ends up on its head eventually, however slowly it goes.
 *
 * ON LEAVE it unwinds to square FORWARD — to the next whole revolution, never
 * backwards to zero, which would rewind however far it had got in half a
 * second and read as a glitch — closes back into its plate, and comes apart
 * again at 1.4×.
 *
 * THERE IS NO FLASH. A white bloom used to fire as the pieces met, to sell
 * the click of assembly; the user cut it (2026-08-23) and they were right —
 * the object arriving whole IS the event, and a flash on top of it only
 * announces that something has been done to you.
 *
 * ── ESCAPING THE FRAME ────────────────────────────────────────────────────
 * Opened, the object stands PROUD OF ITS PLATE AT THE TOP and is CUT BY IT AT
 * THE BOTTOM — it climbs out of the well toward you rather than merely
 * getting bigger. That asymmetry is not done here: it belongs to the plate's
 * `clip-path` (`inset(-X% 0 <hair> 0)` in home.css), which opens upward and
 * stays shut everywhere else. `overflow: hidden` cannot express it — it is
 * all four sides or none, which is why the plate no longer uses it.
 *
 * ── WHY THERE ARE THREE WRAPPERS ──────────────────────────────────────────
 * Each owns exactly one property, because two tweens writing the same
 * property to the same node overwrite each other every frame:
 *   .fx-lift    scale     — the hover open
 *   .fx-float   y         — the idle drift, while it is whole
 *   .fx-spin    rotation  — the hover turn
 * Merging any two buys a bug that only appears when both run at once.
 *
 * ── PERFORMANCE, WHICH IS WHY THE SHAPE IS THIS SHAPE ─────────────────────
 * §4's measured problem was two layers that painted every frame forever — a
 * conic gradient spun through an @property angle, and a blurred aura on a
 * transform loop. Median frame time through the section was 33.4ms with 70%
 * of frames over budget; both are deleted and it now runs 16.7ms / 4%. So:
 *   · only `transform` and `opacity` animate — compositor work, never paint
 *   · ONE decoded image backs every piece (same src, same box)
 *   · `will-change` goes on when the pieces start moving and comes OFF when
 *     they settle. Leaving N promoted layers on the GPU at rest is not a
 *     rounding error: it was enough to wedge a software renderer outright.
 *   · the turn and the drift exist only WHILE HOVERED. Nothing in a card at
 *     rest is animating, which is what makes N textures a card affordable —
 *     one card is hovered at a time.
 *
 * ── TRIGGERS ──────────────────────────────────────────────────────────────
 * Pointer devices play on enter and reverse on leave. TOUCH (revised
 * 2026-08-26, user: the hover motion must happen on scroll): the card's
 * presence on screen is the hover — at 55% in view the object assembles,
 * opens and turns exactly as it does under a pointer; when the card leaves
 * it closes and lands its turn, but it never comes apart again (an
 * assembly is a first meeting; the second time it is simply there). The
 * old touch rule — assemble once, never open or turn — was the forever-cost
 * worry, and it is answered by the leave: a card off screen runs nothing,
 * and a phone column has one card mostly on screen at a time. Reduced
 * motion gets the assembled object as flat markup: the effect never arms,
 * so the CSS fallback has to be the FINAL pose, not the rest one.
 */

const SHARD_DUR = 0.7
const SHARD_STAGGER = 0.03
/** how long the object takes to open once whole, and to close again */
const OPEN_DUR = 0.55

/* cache the resolved geometry per fracture: the polygons are pure functions
   of the data, and two cards on the same art should not recompute them */
const CACHE = new WeakMap<Fracture, Built[]>()
function piecesOf(f: Fracture): Built[] {
  let p = CACHE.get(f)
  if (!p) {
    p = build(f)
    CACHE.set(f, p)
  }
  return p
}

export default function Fractured({
  art,
  className = '',
  alt = '',
  showCuts = false,
}: {
  art: Fracture
  /** extra classes on the picture's box; CSS owns where it sits */
  className?: string
  alt?: string
  /** PROTOTYPE ONLY — draw the cut lines over the whole picture. The art is
      segmented, so a cut has to land on a seam the render already has, and
      eyeballing that against dark chrome is hopeless. */
  showCuts?: boolean
}) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const pieces = piecesOf(art)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const bits = Array.from(root.querySelectorAll<HTMLElement>('.fx-piece'))
    const bloom = root.querySelector<HTMLElement>('.fx-bloom')
    const lift = root.querySelector<HTMLElement>('.fx-lift')
    const float = root.querySelector<HTMLElement>('.fx-float')
    const spin = root.querySelector<HTMLElement>('.fx-spin')
    if (!bits.length || !bloom || !lift || !float || !spin) return

    const arm = () => bits.forEach((el) => (el.style.willChange = 'transform'))
    const disarm = () => bits.forEach((el) => (el.style.willChange = ''))

    let drift: gsap.core.Tween | null = null
    let turn: gsap.core.Tween | null = null
    /* touch only: whether the card is still on screen when the assembly
       lands — if it left mid-assembly, the object finishes whole but does
       not open or turn to an empty viewport */
    let live = true

    /** it is whole: let it breathe, open it out of the plate, start it turning */
    const settle = () => {
      disarm()
      if (!live) return
      drift?.kill()
      drift = gsap.to(float, { y: -6, duration: 4.6, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.to(lift, { scale: art.expand, duration: OPEN_DUR, ease: 'power2.out' })
      turn?.kill()
      /* `spin: 0` means this object does not turn — see fractures.ts. It
         still opens; it just has an up worth respecting. */
      turn = art.spin
        ? gsap.to(spin, { rotation: '+=360', duration: art.spin, ease: 'none', repeat: -1 })
        : null
    }

    /** it is coming apart: stop everything, and land the turn square */
    const unsettle = () => {
      drift?.kill()
      drift = null
      gsap.to(float, { y: 0, duration: 0.3, ease: 'power2.out' })
      gsap.to(lift, { scale: 1, duration: OPEN_DUR, ease: 'power2.inOut' })
      if (turn) {
        turn.kill()
        turn = null
        /* FORWARD to the next whole revolution, never back to zero: tweening
           to 0 from 350° rewinds almost a full turn in half a second, which
           reads as a glitch rather than as stopping. */
        const now = Number(gsap.getProperty(spin, 'rotation')) || 0
        gsap.to(spin, {
          rotation: Math.ceil(now / 360) * 360,
          duration: OPEN_DUR,
          ease: 'power2.inOut',
        })
      }
    }

    const tl = gsap.timeline({
      paused: true,
      onStart: arm,
      onComplete: settle,
      onReverseComplete: disarm,
    })

    tl.to(
      bits,
      {
        x: 0,
        y: 0,
        rotation: 0,
        duration: SHARD_DUR,
        ease: 'power3.inOut',
        stagger: { each: SHARD_STAGGER, from: 'start' },
      },
      0,
    )
    const end = SHARD_DUR + SHARD_STAGGER * (bits.length - 1)
    tl.to(bloom, { scale: 1, opacity: 0.3, duration: 0.5, ease: 'power2.out' }, end * 0.6)

    /* the prototype's scrubber reaches in through this; §4 ignores it */
    ;(root as unknown as { __tl?: gsap.core.Timeline }).__tl = tl

    if (window.matchMedia('(hover: hover)').matches) {
      const open = () => tl.timeScale(1).play()
      const close = () => {
        unsettle()
        tl.timeScale(1.4).reverse()
      }
      /* the listeners go on the CARD when there is one, so the whole card is
         the target rather than just the picture; falling back to our own root
         keeps the component usable on its own */
      const host = root.closest<HTMLElement>('[data-fx-host]') ?? root
      host.addEventListener('mouseenter', open)
      host.addEventListener('mouseleave', close)
      host.addEventListener('focusin', open)
      host.addEventListener('focusout', close)
      return () => {
        host.removeEventListener('mouseenter', open)
        host.removeEventListener('mouseleave', close)
        host.removeEventListener('focusin', open)
        host.removeEventListener('focusout', close)
        drift?.kill()
        turn?.kill()
        tl.kill()
      }
    }

    /* touch: in view is the hover (see TRIGGERS) */
    const host = root.closest<HTMLElement>('[data-fx-host]') ?? root
    const off = watchInView(
      host,
      () => {
        live = true
        if (tl.progress() >= 1) settle()
        else tl.timeScale(1).play()
      },
      () => {
        live = false
        if (tl.progress() >= 1) unsettle()
      },
    )
    return () => {
      off()
      drift?.kill()
      turn?.kill()
      tl.kill()
    }
  }, [art])

  return (
    <div
      className={`fx fx-${art.fit} ${className}`}
      ref={rootRef}
      /* the box's shape is the ART's, not a rule in the stylesheet, so a new
         contained object needs no new CSS. GSAP never touches this element. */
      style={art.fit === 'contain' ? { aspectRatio: String(art.aspect) } : undefined}
    >
      <i className="fx-bloom" aria-hidden="true" />
      <div className="fx-lift">
        <div className="fx-float">
          <div className="fx-spin">
            {pieces.map((p, i) => (
              <img
                key={i}
                className="fx-piece"
                src={art.src}
                /* the picture is one thing; N identical alts would be N
                   repetitions to a screen reader, so only the first speaks */
                alt={i === 0 ? alt : ''}
                aria-hidden={i === 0 && alt ? undefined : true}
                style={{
                  clipPath: p.clip,
                  transformOrigin: p.origin,
                  /* THE REST POSE IS THE BROKEN ONE, written as real style so
                     it is right before JS runs and if JS never runs at all */
                  transform: `translate(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px) rotate(${p.rot}deg)`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
      {showCuts && (
        <div className="fx-cuts" aria-hidden="true">
          {pieces.map((p, i) => (
            <i key={i} style={{ clipPath: p.clip }} />
          ))}
        </div>
      )}
    </div>
  )
}
