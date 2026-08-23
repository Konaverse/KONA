'use client'

import { useCallback, useEffect, useState } from 'react'
import PlateShaders, { VARIANTS, type Stats } from '@/components/v4/PlateShaders'

/**
 * The benchmark's chrome: six plates laid out at §4's real proportions, the
 * controls that decide affordability, and a live readout.
 *
 * The plates are the measurement surface — PlateShaders finds them by class
 * and draws into their rects — so they are sized exactly as the section's are
 * (two columns, the same row height clamp) rather than approximately. A
 * benchmark at the wrong size answers a question nobody asked.
 */
export default function ShaderBench() {
  const [count, setCount] = useState(6)
  /* BOTH START AT 1 AND ARE RAISED IN AN EFFECT. Reading devicePixelRatio
     during render makes the server say 1 and the client say 2, and React
     throws out the whole tree over the mismatch — the button label alone was
     enough to trigger it. */
  const [scale, setScale] = useState(1)
  const [dpr, setDpr] = useState(1)
  useEffect(() => {
    const d = Math.min(window.devicePixelRatio || 1, 3)
    setDpr(d)
    setScale(d)
  }, [])
  const [stats, setStats] = useState<Stats | null>(null)
  const onStats = useCallback((s: Stats) => setStats(s), [])
  const verdict = !stats
    ? ''
    : stats.p90 <= 18
      ? 'comfortable — this is free'
      : stats.p90 <= 26
        ? 'holding 60fps, but with less headroom than the rest of the page'
        : stats.p50 <= 20
          ? 'mostly 60fps with hitches — needs the count or the scale cut'
          : 'not affordable at this setting'

  return (
    <>
      <PlateShaders count={count} scale={scale} onStats={onStats} />

      <div className="pz-hud">
        <div className="pz-nums">
          <b>{stats ? stats.fps.toFixed(0) : '–'}</b>
          <span>fps</span>
          <b>{stats ? stats.p50.toFixed(1) : '–'}</b>
          <span>p50 ms</span>
          <b>{stats ? stats.p90.toFixed(1) : '–'}</b>
          <span>p90 ms</span>
          <b>{stats ? stats.drawn : '–'}</b>
          <span>drawn</span>
        </div>
        <p className="pz-verdict">{verdict}</p>
        <div className="pz-ctl">
          <span>plates</span>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <button key={n} onClick={() => setCount(n)} aria-pressed={count === n}>
              {n}
            </button>
          ))}
        </div>
        <div className="pz-ctl">
          <span>scale</span>
          <button onClick={() => setScale(1)} aria-pressed={scale === 1}>
            1&times;
          </button>
          <button onClick={() => setScale(dpr)} aria-pressed={scale !== 1}>
            {dpr}&times; (device)
          </button>
        </div>
        <p className="pz-gpu">{stats?.gpu ?? 'reading GPU…'}</p>
        <p className="pz-ref">
          six videos measured 33.3ms p50 · one video 16.7ms · the rest of §4 16.7ms
        </p>
      </div>

      <div className="pz-grid">
        {VARIANTS.map((v, i) => (
          <div className="pz-card" key={v.key} data-off={i >= count ? '' : undefined}>
            <div className="pz-plate" />
            <div className="pz-meta">
              <h2>{v.label}</h2>
              <p>{v.note}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
