'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion-v4'

/**
 * ONE OBJECT, ON ITS OWN — §4's third plate kind, and the plainest of them.
 *
 * It rests still, and under the pointer it OPENS out of the top of its plate
 * and, if the shape is one that should, TURNS. Nothing comes apart and
 * nothing orbits: some objects are simply themselves, and dressing a chrome
 * sphere in a mechanism it does not need would be the section performing at
 * the visitor rather than showing them something.
 *
 * WHY IT IS NOT A ONE-PIECE FRACTURE. It nearly is, and Fractured would have
 * rendered it with a single polygon covering the whole picture. But the
 * fracture spends its first 0.94s assembling, and an object with nothing to
 * assemble would spend that time doing nothing before it opened — the hover
 * would feel a second late for no reason anyone could see. The two also read
 * differently in the source: a file about pieces, holding a thing with one
 * piece, teaches the next person the wrong thing about the section.
 *
 * ── THE SHARED CONTRACT ───────────────────────────────────────────────────
 * Every plate kind keeps the same three promises, and this one is the
 * smallest statement of them:
 *   · still at rest — nothing animating in a card nobody is pointing at
 *   · alive under the pointer, and only there
 *   · climbing out of the TOP of its plate as it opens, cut off at the bottom
 *     — which is the plate's asymmetric clip-path doing the work, not this
 * And the same three wrappers, for the same reason: two tweens writing the
 * same property to one node overwrite each other every frame.
 *   .so-lift    scale     — the open
 *   .so-float   y         — the idle drift
 *   .so-spin    rotation  — the turn
 *
 * ── TURNING IS PER OBJECT ─────────────────────────────────────────────────
 * `spin: 0` means it does not turn at all, and that is a property of the
 * shape rather than of the interaction. A sphere carries a meridian, so it
 * reads as spinning the moment it moves. A cyclic arrow is a picture of
 * rotation already. A page mockup is a rectangle with an up, and no speed is
 * slow enough to stop a full revolution eventually standing it on its head —
 * so it takes 0, the same call the glass browser window took.
 *
 * On leave the turn lands FORWARD on a whole revolution rather than rewinding
 * to zero, which from 350° reads as a glitch instead of as stopping.
 */

export type SoloArt = {
  src: string
  aspect: number
  /** its height as a share of the plate's, before it opens */
  fill: number
  /** seconds for one revolution while hovered, or 0 for a shape with an up */
  spin: number
  /** how far it opens on hover */
  expand: number
}

export const SEO_SPHERE: SoloArt = {
  src: '/services/seo-art/sphere.webp',
  aspect: 900 / 906,
  fill: 0.94,
  /* the meridian is what makes this read as a sphere turning rather than as a
     circle rotating, so it can afford to be slow */
  spin: 26,
  expand: 1.18,
}

export const REDESIGN_ARROW: SoloArt = {
  src: '/services/redesign-art/arrow.webp',
  aspect: 900 / 952,
  fill: 0.92,
  /* a cyclic arrow is a drawing of rotation; turning it is the one case where
     the motion and the subject are the same thing */
  spin: 18,
  expand: 1.18,
}

export const ONE_PAGE_MOCKUP: SoloArt = {
  src: '/services/one-page-art/mockup.webp',
  aspect: 1000 / 542,
  fill: 0.86,
  /* a page has an up */
  spin: 0,
  expand: 1.14,
}

const OPEN_DUR = 0.55

export default function Solo({ art, alt = '' }: { art: SoloArt; alt?: string }) {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(hover: hover)').matches) return

    const lift = root.querySelector<HTMLElement>('.so-lift')
    const float = root.querySelector<HTMLElement>('.so-float')
    const spin = root.querySelector<HTMLElement>('.so-spin')
    const bloom = root.querySelector<HTMLElement>('.so-bloom')
    if (!lift || !float || !spin || !bloom) return

    let drift: gsap.core.Tween | null = null
    let turn: gsap.core.Tween | null = null

    const open = () => {
      gsap.to(lift, { scale: art.expand, duration: OPEN_DUR, ease: 'power2.out' })
      gsap.to(bloom, { scale: 1, opacity: 0.3, duration: OPEN_DUR, ease: 'power2.out' })
      drift?.kill()
      drift = gsap.to(float, { y: -6, duration: 4.6, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      turn?.kill()
      turn = art.spin
        ? gsap.to(spin, { rotation: '+=360', duration: art.spin, ease: 'none', repeat: -1 })
        : null
    }

    const close = () => {
      gsap.to(lift, { scale: 1, duration: OPEN_DUR, ease: 'power2.inOut' })
      gsap.to(bloom, { scale: 0.8, opacity: 0.1, duration: OPEN_DUR, ease: 'power2.inOut' })
      drift?.kill()
      drift = null
      gsap.to(float, { y: 0, duration: 0.3, ease: 'power2.out' })
      if (turn) {
        turn.kill()
        turn = null
        const now = Number(gsap.getProperty(spin, 'rotation')) || 0
        gsap.to(spin, {
          rotation: Math.ceil(now / 360) * 360,
          duration: 0.8,
          ease: 'power2.out',
        })
      }
    }

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
    }
  }, [art])

  return (
    <div
      className="so"
      ref={rootRef}
      /* TOP AND BOTTOM, NOT `inset`. The shorthand also writes `left: auto`,
         and an inline declaration beats the stylesheet — so `left: 50%` in
         home.css was silently overridden and every solo object sat jammed
         against the left edge of its plate. The fracture and the orbit set
         their inset in CSS, where source order settles it; inline it does
         not, and the failure looks like a layout mistake rather than a
         specificity one. */
      style={{
        top: `${(1 - art.fill) * 50}%`,
        bottom: `${(1 - art.fill) * 50}%`,
        aspectRatio: String(art.aspect),
      }}
    >
      <i className="so-bloom" aria-hidden="true" />
      <div className="so-lift">
        <div className="so-float">
          <div className="so-spin">
            <img src={art.src} alt={alt} aria-hidden={alt ? undefined : true} />
          </div>
        </div>
      </div>
    </div>
  )
}
