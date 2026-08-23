'use client'

import { useRef, useState } from 'react'
import Fractured from '@/components/v4/Fractured'
import type { Fracture } from '@/components/v4/fractures'
import type { gsap } from '@/lib/motion-v4'

/**
 * The prototype's harness: one stand-in card around a Fractured object, plus
 * a scrubber onto its timeline. Throwaway — none of this graduates to §4,
 * and the component under test knows nothing about it beyond the `__tl`
 * handle it already exposes and the `data-fx-host` attribute that tells it
 * which element to take hover from.
 */
export default function FractureStage({
  art,
  name,
  copy,
}: {
  art: Fracture
  name: string
  copy: string
}) {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const [p, setP] = useState(0)
  const [cuts, setCuts] = useState(false)

  const scrub = (v: number) => {
    setP(v)
    const root = cardRef.current?.querySelector('.fx') as
      | (HTMLElement & { __tl?: gsap.core.Timeline })
      | null
    // pause first, or a hover already in flight keeps writing over us
    root?.__tl?.pause().progress(v)
  }

  return (
    <div>
      <div className="ps-card k-glass" ref={cardRef} data-fx-host>
        <div className="ps-plate">
          <Fractured art={art} alt="" showCuts={cuts} />
        </div>
        <div className="ps-meta">
          <h2>{name}</h2>
          <p>{copy}</p>
        </div>
      </div>
      <label className="ps-scrub">
        <input type="checkbox" checked={cuts} onChange={(e) => setCuts(e.target.checked)} />
        <span>cuts</span>
      </label>
      <label className="ps-scrub">
        <span>timeline</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.005}
          value={p}
          onChange={(e) => scrub(Number(e.target.value))}
        />
        <output>{p.toFixed(2)}</output>
      </label>
    </div>
  )
}
