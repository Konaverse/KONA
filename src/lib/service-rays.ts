/** The authored SVG's rounded values, shared by its fallback and raster. */
export const SERVICE_RAYS = Array.from({ length: 132 }, (_, i) => {
  const a = (i / 132) * Math.PI * 2
  const rnd = (k: number) => {
    const n = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453
    return n - Math.floor(n)
  }
  const reach = 0.42 + rnd(0) * 0.58
  return {
    x1: Number((Math.cos(a) * 34).toFixed(2)), y1: Number((Math.sin(a) * 34).toFixed(2)),
    x2: Number((Math.cos(a) * 100).toFixed(2)), y2: Number((Math.sin(a) * 100).toFixed(2)),
    lo: Number((reach * (0.35 + rnd(1) * 0.25)).toFixed(3)), hi: Number(reach.toFixed(3)),
    dur: Number((2.6 + rnd(2) * 3.4).toFixed(2)), delay: Number((-rnd(3) * 6).toFixed(2)),
  }
})

/** CSS ease-in-out: cubic-bezier(.42, 0, .58, 1), including alternate cycles. */
function easeInOut(t: number) {
  let lo = 0, hi = 1
  for (let i = 0; i < 18; i++) {
    const u = (lo + hi) / 2
    const x = 3 * (1 - u) ** 2 * u * 0.42 + 3 * (1 - u) * u ** 2 * 0.58 + u ** 3
    if (x < t) lo = u
    else hi = u
  }
  const u = (lo + hi) / 2
  return 3 * (1 - u) * u ** 2 + u ** 3
}

export function drawServiceRays(ctx: CanvasRenderingContext2D, timeMs: number, color: string) {
  ctx.clearRect(-100, -100, 200, 200)
  ctx.strokeStyle = color
  ctx.lineWidth = 0.28
  ctx.beginPath()
  for (const ray of SERVICE_RAYS) {
    const cycle = Math.max(0, timeMs / 1000 - ray.delay) / ray.dur
    const phase = cycle % 1
    const progress = easeInOut(Math.floor(cycle) % 2 ? 1 - phase : phase)
    const length = ray.lo + (ray.hi - ray.lo) * progress
    ctx.moveTo(ray.x1, ray.y1)
    ctx.lineTo(ray.x1 + (ray.x2 - ray.x1) * length, ray.y1 + (ray.y2 - ray.y1) * length)
  }
  ctx.stroke()
}
