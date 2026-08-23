'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion-v4'
import { build, type Fracture, type Built } from '@/components/v4/fractures'

/**
 * THE HOUSE MOVE FOR §4's CARDS — an object that RESTS IN PIECES and
 * assembles under the pointer.
 *
 * Generalised from the glass screen (2026-08-23) on the user's call: the
 * shatter is not the 3D card's trick, it is what almost every card does, so
 * this component knows nothing about any particular object. What breaks, how
 * it breaks and what it pivots around is data in fractures.ts; the timeline,
 * the triggers and the performance discipline are here.
 *
 * ── WHAT IT RENDERS ───────────────────────────────────────────────────────
 * N copies of ONE image, same box, each cut to a different polygon by
 * `clip-path`. Together they are the picture exactly; pulled apart they are
 * its wreckage, and the plate's dark ground shows through the cuts.
 *
 * ── THE TIMELINE (~0.9s) ──────────────────────────────────────────────────
 * Pieces fly home on `power3.inOut` over 0.7s, staggered 0.03 in DOM order —
 * which fractures.ts has already sorted outermost-first, so the arrival
 * sweeps INWARD and the object closes last at the point it broke. A breath
 * of light lands as the last pieces meet. Reverses at 1.4× on leave.
 *
 * ── PERFORMANCE, WHICH IS WHY THE SHAPE IS THIS SHAPE ─────────────────────
 * §4's measured problem (2026-08-23) was two layers that painted every frame
 * forever — a conic gradient spun through an @property angle, and a blurred
 * aura on a transform loop. Median frame time through the section was 33.4ms
 * with 70% of frames over budget; killing both took it to a steady 16.7ms.
 * So, here:
 *   · only `transform` and `opacity` animate — compositor work, never paint
 *   · ONE decoded image backs every piece (same src, same box)
 *   · `will-change` goes on when the timeline starts and comes OFF when it
 *     settles. Leaving N promoted layers on the GPU at rest is not a
 *     rounding error: it was enough to wedge a software renderer outright.
 *   · the idle float is the only unattended thing, it is one element, and it
 *     exists only while the object is whole
 * Measured on the prototype: 16.7ms median, ZERO frames over 33ms at rest
 * and while the float runs, six dropped across the assembly itself.
 *
 * N full-plate textures is a PER-CARD budget. It works because one card is
 * hovered at a time and a card at rest holds no promoted layers at all.
 *
 * ── TRIGGERS ──────────────────────────────────────────────────────────────
 * Pointer devices play on enter and reverse on leave. Touch has no hover to
 * give, so the assembly runs ONCE at 40% in view and never comes apart.
 * Reduced motion gets the assembled object as flat markup: the effect never
 * arms, so the CSS fallback has to be the FINAL pose, not the rest one.
 */

const SHARD_DUR = 0.7
const SHARD_STAGGER = 0.03

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
}: {
  art: Fracture
  /** sizes and places the picture's box inside the plate; CSS owns geometry */
  className?: string
  alt?: string
}) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const pieces = piecesOf(art)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const bits = Array.from(root.querySelectorAll<HTMLElement>('.fx-piece'))
    const bloom = root.querySelector<HTMLElement>('.fx-bloom')
    const flash = root.querySelector<HTMLElement>('.fx-flash')
    const float = root.querySelector<HTMLElement>('.fx-float')
    if (!bits.length || !bloom || !flash || !float) return

    /* THE IDLE FLOAT HAS ITS OWN ELEMENT. The timeline owns the pieces'
       transforms; if the drift wrote to the same nodes the two would
       overwrite each other every frame and the reverse would fight it. */
    let floating: gsap.core.Tween | null = null
    const startFloat = () => {
      floating?.kill()
      floating = gsap.to(float, { y: -6, duration: 4.6, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    }
    const stopFloat = () => {
      floating?.kill()
      floating = null
      gsap.set(float, { y: 0 })
    }

    const arm = () => bits.forEach((el) => (el.style.willChange = 'transform'))
    const disarm = () => bits.forEach((el) => (el.style.willChange = ''))

    const tl = gsap.timeline({
      paused: true,
      onStart: arm,
      onComplete: () => {
        disarm()
        startFloat()
      },
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
    /* the click of assembly — light, as the last pieces land */
    tl.to(flash, { opacity: 0.08, duration: 0.1, ease: 'power2.out' }, end - 0.16)
    tl.to(flash, { opacity: 0, duration: 0.15, ease: 'power2.in' }, end - 0.06)

    const open = () => {
      stopFloat()
      tl.timeScale(1).play()
    }
    const close = () => {
      stopFloat()
      tl.timeScale(1.4).reverse()
    }

    /* the prototype's scrubber reaches in through this; §4 ignores it */
    ;(root as unknown as { __tl?: gsap.core.Timeline }).__tl = tl

    if (window.matchMedia('(hover: hover)').matches) {
      /* the listeners go on the CARD when there is one, so the whole card is
         the target rather than just the picture — falling back to our own
         root keeps the component usable on its own */
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
        stopFloat()
        tl.kill()
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          tl.play()
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(root)
    return () => {
      io.disconnect()
      stopFloat()
      tl.kill()
    }
  }, [art])

  return (
    <div className={`fx fx-${art.fit} ${className}`} ref={rootRef}>
      <i className="fx-bloom" aria-hidden="true" />
      <div className="fx-float">
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
              /* THE REST POSE IS THE BROKEN ONE, written as real style so it
                 is right before JS runs and if JS never runs at all */
              transform: `translate(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px) rotate(${p.rot}deg)`,
            }}
          />
        ))}
      </div>
      <i className="fx-flash" aria-hidden="true" />
    </div>
  )
}
