'use client'

import { useEffect, useRef } from 'react'

/**
 * CURSOR LENS — the signature interaction.
 *
 * A disc of glass that follows the pointer and genuinely REFRACTS the page
 * beneath it. Not a faked highlight: an SVG displacement map is fed to
 * `backdrop-filter`, so real pixels bend. That is the literal reading of the
 * system's own line — type "resolves as though coming into focus through
 * moving glass".
 *
 * HOW. A 256×256 displacement map is generated once on a canvas: R encodes
 * horizontal sample offset, G vertical, both zero at the centre and tapering
 * back to zero at the rim so there is no hard seam. `feDisplacementMap` then
 * samples the backdrop through it. Chrome accepts `backdrop-filter: url(#id)`;
 * Safari does not, so support is feature-detected and falls back to a plain
 * glass blur, which still reads correctly — it just does not bend.
 *
 * STRENGTH. Per the choreography: strong over the hero and project tiles, weak
 * over body copy where refraction would hurt reading. Elements opt in with
 * `data-lens="strong" | "weak" | "off"`. Strength is lerped, never switched, so
 * crossing a boundary is a dissolve rather than a step.
 *
 * ABSENT on touch (nothing to follow) and under reduced motion (a moving
 * object that cannot be escaped). The native cursor is NEVER hidden — this
 * augments it. Hiding it costs text-selection affordance and is a real
 * accessibility regression for a purely decorative gain.
 */

const SIZE = 230 // must match --lens-size
const STRENGTH = { off: 0, weak: 0.012, base: 0.03, strong: 0.052 } as const
const FOLLOW = 0.14 // position lerp — smooth, with a little lag so it feels heavy
const FADE = 0.09 // strength lerp

function buildDisplacementMap(): string {
  const N = 256
  const r = N / 2
  const c = document.createElement('canvas')
  c.width = c.height = N
  const ctx = c.getContext('2d')
  if (!ctx) return ''
  const img = ctx.createImageData(N, N)
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const i = (y * N + x) * 4
      const dx = (x - r) / r
      const dy = (y - r) / r
      const d = Math.hypot(dx, dy)
      let R = 128
      let G = 128
      if (d <= 1) {
        // zero at the centre, zero again at the rim, peaking between — a bead
        // of glass rather than a flat magnifier, and no seam at the edge
        const fall = Math.sqrt(1 - Math.min(d, 1) ** 2)
        R = 128 - dx * 127 * fall
        G = 128 - dy * 127 * fall
      }
      img.data[i] = R
      img.data[i + 1] = G
      img.data[i + 2] = 128
      img.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return c.toDataURL()
}

export default function CursorLens() {
  const lensRef = useRef<HTMLDivElement | null>(null)
  const dispRef = useRef<SVGFEDisplacementMapElement | null>(null)
  const raf = useRef(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(hover: hover)').matches) return

    const lens = lensRef.current
    const disp = dispRef.current
    if (!lens) return

    // Does this engine actually run an SVG filter on a backdrop? Chrome yes,
    // Safari no — and CSS.supports lies about it, so trust the class instead.
    const refracts = CSS.supports('backdrop-filter', 'url(#k-lens-filter)')
    if (refracts) {
      const map = document.getElementById('k-lens-map')
      map?.setAttribute('href', buildDisplacementMap())
      lens.classList.add('is-refracting')
    }

    const state = { x: -9999, y: -9999, tx: -9999, ty: -9999, s: 0, ts: 0, seen: false }

    const strengthAt = (el: Element | null): number => {
      const hit = el?.closest('[data-lens]') as HTMLElement | null
      const v = hit?.dataset.lens
      if (v === 'off') return STRENGTH.off
      if (v === 'weak') return STRENGTH.weak
      if (v === 'strong') return STRENGTH.strong
      return STRENGTH.base
    }

    const onMove = (e: PointerEvent) => {
      state.tx = e.clientX
      state.ty = e.clientY
      state.ts = strengthAt(document.elementFromPoint(e.clientX, e.clientY))
      if (!state.seen) {
        // first sighting: drop it exactly under the pointer rather than flying
        // in from the corner
        state.seen = true
        state.x = e.clientX
        state.y = e.clientY
        lens.classList.add('is-on')
      }
    }
    const onLeave = () => {
      state.ts = 0
      lens.classList.remove('is-on')
    }
    const onEnter = () => {
      if (state.seen) lens.classList.add('is-on')
    }

    const tick = () => {
      state.x += (state.tx - state.x) * FOLLOW
      state.y += (state.ty - state.y) * FOLLOW
      state.s += (state.ts - state.s) * FADE
      lens.style.transform = `translate3d(${(state.x - SIZE / 2).toFixed(1)}px, ${(state.y - SIZE / 2).toFixed(1)}px, 0)`
      if (disp) disp.setAttribute('scale', state.s.toFixed(4))
      raf.current = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerenter', onEnter)
    raf.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerenter', onEnter)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
        <filter
          id="k-lens-filter"
          x="0"
          y="0"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
          primitiveUnits="objectBoundingBox"
        >
          {/* href is filled in on mount — the map is generated, not shipped */}
          <feImage id="k-lens-map" x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="map" />
          <feDisplacementMap
            ref={dispRef}
            in="SourceGraphic"
            in2="map"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      <div ref={lensRef} className="k-lens" aria-hidden="true" />
    </>
  )
}
