'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion-v4'
import { afterPageTransition, observeSharedEffectPause } from '@/lib/shared-effects'
import { SERVICE_RAYS, drawServiceRays } from '@/lib/service-rays'

/** One changing picture; the original SVG remains the no-JS/reduced-motion fallback. */
export default function ServiceRays() {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  useEffect(() => {
    const svg = svgRef.current, canvas = canvasRef.current
    const hero = svg?.parentElement
    if (!svg || !canvas || !hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    return afterPageTransition(() => {
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        hero.dataset.raysFallback = 'true'
        return () => { delete hero.dataset.raysFallback }
      }
      const originalClock = svg.getAnimations().find(animation => (animation as CSSAnimation).animationName === 'ro-turn')
      const clock = canvas.getAnimations().find(animation => (animation as CSSAnimation).animationName === 'ro-turn')
      if (!clock) return
      clock.currentTime = originalClock?.currentTime ?? clock.currentTime ?? 0
      let color = getComputedStyle(svg.querySelector('line')!).stroke
      let near = false, paused = false, running = false
      const draw = () => drawServiceRays(ctx, Number(clock.currentTime ?? 0), color)
      const resize = () => {
        const width = canvas.clientWidth, height = canvas.clientHeight
        const dpr = window.devicePixelRatio || 1
        canvas.width = Math.max(1, Math.round(width * dpr))
        canvas.height = Math.max(1, Math.round(height * dpr))
        ctx.setTransform(canvas.width / 200, 0, 0, canvas.height / 200, canvas.width / 2, canvas.height / 2)
        color = getComputedStyle(svg.querySelector('line')!).stroke
        draw()
      }
      const update = () => {
        const active = near && !paused
        clock.playbackRate = active ? 1 : 0
        if (active && !running) { draw(); gsap.ticker.add(draw); running = true }
        else if (!active && running) { gsap.ticker.remove(draw); running = false }
      }
      resize()
      hero.dataset.raysLive = 'true'
      const ro = new ResizeObserver(resize)
      ro.observe(canvas)
      const io = new IntersectionObserver(([entry]) => { near = entry.isIntersecting; update() })
      io.observe(hero)
      const unpause = observeSharedEffectPause(value => { paused = value; update() })
      window.addEventListener('k:page-snapshot', draw)
      return () => {
        unpause(); io.disconnect(); ro.disconnect(); gsap.ticker.remove(draw)
        window.removeEventListener('k:page-snapshot', draw)
        delete hero.dataset.raysLive
      }
    })
  }, [])
  return <>
    <svg ref={svgRef} className="ro-rays ro-rays--svg" viewBox="-100 -100 200 200" aria-hidden="true">
      {SERVICE_RAYS.map(({ x1, y1, x2, y2, lo, hi, dur, delay }, i) => <line key={i}
        x1={x1} y1={y1} x2={x2} y2={y2} pathLength={1}
        style={{ '--lo': lo, '--hi': hi, animationDuration: `${dur}s`, animationDelay: `${delay}s` } as React.CSSProperties} />)}
    </svg>
    <canvas ref={canvasRef} className="ro-rays ro-rays--canvas" aria-hidden="true" />
  </>
}
