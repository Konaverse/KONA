'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion-v4'

/**
 * THE WEB DESIGN CARD'S OBJECT — a mockup with four props in orbit around it.
 *
 * The second thing a §4 plate can hold, after the fracture. Same contract:
 * still at rest, alive under the pointer, climbing out of the top of its plate
 * as it opens. Everything else is different, because a mockup with things
 * circling it is not a thing that comes apart.
 *
 * ── THE DEPTH IS REAL ─────────────────────────────────────────────────────
 * The whole point is that a prop passing BEHIND the mockup is hidden by it and
 * one passing in front is not, so the orbit reads as a circle in space rather
 * than as four things sliding around on glass.
 *
 * That is an actual 3D scene, not a z-index trick. The stage carries
 * `perspective`; the ring, the arms and the faces carry
 * `transform-style: preserve-3d`; and the mockup and the four props all live
 * in that one space, so the browser depth-sorts them every frame for free. A
 * prop at negative z is behind the mockup's plane and the compositor occludes
 * it — which works only because the mockup is OPAQUE art. Against a
 * transparent wireframe the props would show straight through and there would
 * be no illusion to have.
 *
 * ── FOUR THINGS THIS NEEDED, EVERY ONE OF WHICH IS EASY TO LOSE ───────────
 *
 * 1. AN ARM ELEMENT, BECAUSE OF TRANSFORM ORDER. An orbit is
 *    `rotateY(angle) translateZ(radius)` — turn to face down the spoke, then
 *    walk out along it. GSAP composes transforms in a fixed order with
 *    TRANSLATION FIRST, so asking one element for both gives
 *    `translateZ(r) rotateY(a)`: every prop parked at the same depth, rotating
 *    on the spot, no orbit at all. It renders, it animates, and it is simply
 *    wrong. So the rotation is static CSS on the slot and the push-out is
 *    GSAP on a child arm — two elements, correct order, no argument.
 *
 * 2. THE PROPS COUNTER-ROTATE. Carried round by the ring, a prop would turn
 *    with it and go edge-on twice a revolution, and a flat image seen edge-on
 *    is a line. Each face therefore spins backwards at exactly the ring's
 *    rate. Both tweens are linear and the same length, which is what keeps
 *    them locked with no per-frame callback holding them together. The face
 *    must also cancel its own slot's static angle, so its base is `-angle`.
 *    The ring's `rotateX` tilt is deliberately NOT cancelled: leaning with the
 *    ring is what makes the ring read as a plane rather than a hoop.
 *
 * 3. THE MOCKUP IS THE RING'S SIBLING, NOT ITS CHILD. Inside the ring it
 *    would be carried round by the very rotation it is meant to be the still
 *    centre of. They stay in one 3D space because preserve-3d chains.
 *
 * 4. NOTHING IN THE CHAIN MAY FLATTEN. `overflow` other than visible, a
 *    filter, an opacity below 1 or a clip-path on the stage, the ring, an arm
 *    or a face collapses the 3D context and the sort silently degrades to
 *    paint order — props stop hiding behind the mockup, with no error
 *    anywhere. The plate's clip-path is outside all of this and is fine.
 *
 * ── WHAT MOVES, AND WHEN ──────────────────────────────────────────────────
 * At rest the composition is simply there, parked at four angles chosen to
 * read as a still. On hover the mockup opens — which is what carries it past
 * the top of the plate, the plate's clip being open upward — and the ring
 * starts turning. On leave everything eases back and the ring lands FORWARD
 * on a whole revolution, never rewinding.
 *
 * ── COST ──────────────────────────────────────────────────────────────────
 * Five transforms a frame while hovered, all compositor work, nothing at all
 * at rest. No per-frame JavaScript: GSAP owns five linear tweens and they keep
 * step by themselves.
 */

export type OrbitArt = {
  main: { src: string; aspect: number }
  /** the props, each parked at `angle` degrees around the ring */
  props: {
    src: string
    angle: number
    /** its width, as a share of the picture's width */
    width: number
    /** how far off the ring's equator it sits, as a share of the height */
    lift: number
  }[]
  /** the ring's radius, as a share of the picture's width */
  radius: number
  /** how strong the perspective is: bigger divides less, so flatter */
  depth: number
  /** how far the ring tilts out of the screen plane, in degrees */
  tilt: number
  /** seconds for one revolution while hovered */
  spin: number
  /** how far the whole thing opens on hover */
  expand: number
}

export const WEB_DESIGN: OrbitArt = {
  main: { src: '/services/web-design/main.webp', aspect: 1200 / 877 },
  /* Angles picked so the still reads before anything moves: one prop in front
     and low, one leaving right, one behind the mockup, one arriving left.
     `lift` keeps all four off the ring's exact equator, which also stops any
     two being coplanar with the mockup at once — the one case a depth sort
     has no answer for. */
  props: [
    { src: '/services/web-design/orb-1.webp', angle: 24, width: 0.22, lift: -0.26 },
    { src: '/services/web-design/orb-2.webp', angle: 116, width: 0.2, lift: 0.28 },
    { src: '/services/web-design/orb-3.webp', angle: 208, width: 0.24, lift: -0.12 },
    { src: '/services/web-design/orb-4.webp', angle: 302, width: 0.14, lift: 0.2 },
  ],
  radius: 0.54,
  /* 3 rather than the 1.7 this started on: at a strong perspective a prop at
     the near point is magnified past half again its size and swamps the
     mockup it is supposed to be circling. */
  depth: 3,
  tilt: 14,
  spin: 22,
  expand: 1.16,
}

const OPEN_DUR = 0.55

export default function Orbit({ art, alt = '' }: { art: OrbitArt; alt?: string }) {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const ring = root.querySelector<HTMLElement>('.ob-ring')
    const lift = root.querySelector<HTMLElement>('.ob-lift')
    const arms = Array.from(root.querySelectorAll<HTMLElement>('.ob-arm'))
    const faces = Array.from(root.querySelectorAll<HTMLElement>('.ob-face'))
    if (!ring || !lift || !arms.length) return

    /* MEASURED, NOT DECLARED. translateZ takes pixels and a face's box has a
       zero-width parent, so both the radius and the prop sizes are recomputed
       from the box whenever it changes — otherwise the orbit is only the right
       size at exactly one viewport width. */
    const place = () => {
      const w = root.clientWidth
      if (!w) return
      root.style.setProperty('--ob-persp', `${Math.round(w * art.depth)}px`)
      arms.forEach((a, i) => gsap.set(a, { z: w * art.radius }))
      faces.forEach((f, i) => {
        const px = w * art.props[i].width
        f.style.width = `${px}px`
        /* centred on the arm's point by margin, never by `translate`: GSAP
           owns this element's transform and clears the independent transform
           properties the moment it takes it over */
        f.style.marginLeft = `${-px / 2}px`
      })
    }
    place()
    const ro = new ResizeObserver(place)
    ro.observe(root)

    gsap.set(ring, { rotationX: -art.tilt })
    /* yPercent for the vertical centring, for the same reason as the margin:
       GSAP keeps it while the turn tween writes only rotationY */
    faces.forEach((f, i) => gsap.set(f, { rotationY: -art.props[i].angle, yPercent: -50 }))

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !window.matchMedia('(hover: hover)').matches) {
      return () => ro.disconnect()
    }

    let turns: gsap.core.Tween[] = []

    const start = () => {
      turns.forEach((t) => t.kill())
      turns = [
        gsap.to(ring, { rotationY: '+=360', duration: art.spin, ease: 'none', repeat: -1 }),
        ...faces.map((f) =>
          gsap.to(f, { rotationY: '-=360', duration: art.spin, ease: 'none', repeat: -1 }),
        ),
      ]
      gsap.to(lift, { scale: art.expand, duration: OPEN_DUR, ease: 'power2.out' })
    }

    const stop = () => {
      if (turns.length) {
        turns.forEach((t) => t.kill())
        turns = []
        /* land FORWARD on a whole turn — rewinding to zero from 350° reads as
           a glitch rather than as stopping, the same rule the fracture follows */
        const settle = (el: HTMLElement, dir: 1 | -1) => {
          const now = Number(gsap.getProperty(el, 'rotationY')) || 0
          const to = dir > 0 ? Math.ceil(now / 360) * 360 : Math.floor(now / 360) * 360
          gsap.to(el, { rotationY: to, duration: 0.8, ease: 'power2.out' })
        }
        settle(ring, 1)
        faces.forEach((f) => settle(f, -1))
      }
      gsap.to(lift, { scale: 1, duration: OPEN_DUR, ease: 'power2.inOut' })
    }

    const host = root.closest<HTMLElement>('[data-fx-host]') ?? root
    host.addEventListener('mouseenter', start)
    host.addEventListener('mouseleave', stop)
    host.addEventListener('focusin', start)
    host.addEventListener('focusout', stop)
    return () => {
      host.removeEventListener('mouseenter', start)
      host.removeEventListener('mouseleave', stop)
      host.removeEventListener('focusin', start)
      host.removeEventListener('focusout', stop)
      turns.forEach((t) => t.kill())
      ro.disconnect()
    }
  }, [art])

  return (
    <div className="ob" ref={rootRef} style={{ aspectRatio: String(art.main.aspect) }}>
      <div className="ob-lift">
        <div className="ob-stage">
          <div className="ob-ring">
            {art.props.map((p, i) => (
              /* slot turns to face down its spoke (static CSS, so GSAP cannot
                 reorder it), arm walks out along it, face turns back to us */
              <div
                key={i}
                className="ob-slot"
                style={{ top: `${50 + p.lift * 100}%`, transform: `rotateY(${p.angle}deg)` }}
              >
                <div className="ob-arm">
                  <div className="ob-face">
                    <img src={p.src} alt="" aria-hidden="true" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* the still centre: the ring's SIBLING, sharing its 3D space */}
          <img
            className="ob-main"
            src={art.main.src}
            alt={alt}
            aria-hidden={alt ? undefined : true}
          />
        </div>
      </div>
    </div>
  )
}
