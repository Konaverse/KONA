'use client'

import { useRef, useState } from 'react'
import GlassShatter from '@/components/v4/GlassShatter'
import type { gsap } from '@/lib/motion-v4'

/**
 * The prototype's harness: a stand-in card around GlassShatter, plus a
 * scrubber onto its timeline. Throwaway — none of this graduates to §4, and
 * the component under test knows nothing about it beyond the `__tl` handle
 * it already exposes.
 */
export default function ShatterStage() {
  const stageRef = useRef<HTMLDivElement | null>(null)
  const [p, setP] = useState(0)

  const scrub = (v: number) => {
    setP(v)
    const root = stageRef.current?.querySelector('.gs') as
      | (HTMLElement & { __tl?: gsap.core.Timeline })
      | null
    const tl = root?.__tl
    if (!tl) return
    /* pause first, or a hover already in flight keeps writing over us */
    tl.pause()
    tl.progress(v)
  }

  return (
    <>
      <div className="ps-stage" ref={stageRef}>
        <div className="ps-card k-glass">
          <div className="ps-plate">
            <GlassShatter label="" />
          </div>
          <div className="ps-meta">
            <h2>3D Websites</h2>
            <p>Real dimension for brands that need presence felt rather than described.</p>
          </div>
        </div>
      </div>

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
    </>
  )
}
