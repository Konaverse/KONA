'use client'

import { useEffect, useRef } from 'react'

/**
 * THE PIXEL REVEAL (2026-09-16, user: "a blurred pixelize component,
 * and when the image enters the pixels unblur").
 *
 * Drop it inside any frame that holds <img> layers. It paints a
 * MOSAIC of those layers — every image drawn through a tiny offscreen
 * canvas and scaled back up without smoothing, under a blur — on top
 * of them, from the moment they have loaded. When the frame enters
 * the viewport the blocks shrink and the blur lifts on one clock
 * (FROM px blocks → 1, over DURATION), then the mosaic fades and the
 * live layers are what is left.
 *
 * It reads each layer's CURRENT transform (scale about its origin) at
 * every draw, so a layer already being driven — the dolly zoom in the
 * people's cards — is snapshotted where it stands and the hand-off at
 * the end is seamless.
 *
 * Reduced motion: nothing is painted, the layers stand as they are.
 * No JS: the canvas is empty and transparent — same result. Runs
 * once; the canvas is removed from paint when done.
 */
export default function PixelReveal({
  from = 56,
  duration = 1.15,
  blur = 12,
}: {
  /** the largest block, CSS px */
  from?: number
  /** seconds, from entry to sharp */
  duration?: number
  /** the blur under the mosaic at rest, px */
  blur?: number
}) {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    const frame = canvas?.parentElement
    if (!canvas || !frame) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      canvas.classList.add('is-done')
      return
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const imgs = Array.from(frame.querySelectorAll<HTMLImageElement>('img'))
    const off = document.createElement('canvas')
    const octx = off.getContext('2d')
    if (!octx || !imgs.length) return

    const scaleOf = (el: HTMLElement) => {
      const m = /scale\(([\d.]+)\)/.exec(el.style.transform)
      return m ? parseFloat(m[1]) : 1
    }

    const draw = (block: number) => {
      const W = frame.clientWidth
      const H = frame.clientHeight
      if (!W || !H) return
      if (canvas.width !== W || canvas.height !== H) {
        canvas.width = W
        canvas.height = H
      }
      const b = Math.max(1, block)
      off.width = Math.max(1, Math.round(W / b))
      off.height = Math.max(1, Math.round(H / b))
      octx.setTransform(off.width / W, 0, 0, off.height / H, 0, 0)
      octx.clearRect(0, 0, W, H)
      for (const img of imgs) {
        if (!img.complete || !img.naturalWidth) continue
        /* the layer as it stands: cover-fit, then its own scale about
           its own origin */
        const cs = getComputedStyle(img)
        const [ox, oy] = cs.transformOrigin.split(' ').map(parseFloat)
        const s = scaleOf(img)
        const k = Math.max(W / img.naturalWidth, H / img.naturalHeight)
        const dw = img.naturalWidth * k
        const dh = img.naturalHeight * k
        octx.save()
        octx.translate(ox || W / 2, oy || H / 2)
        octx.scale(s, s)
        octx.translate(-(ox || W / 2), -(oy || H / 2))
        octx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh)
        octx.restore()
      }
      ctx.imageSmoothingEnabled = b <= 1
      ctx.clearRect(0, 0, W, H)
      ctx.drawImage(off, 0, 0, W, H)
    }

    /* the mosaic stands as soon as the layers have landed */
    let ready = false
    let entered = false
    let raf = 0
    const offs: (() => void)[] = []
    const check = () => {
      if (ready) return
      if (!imgs.every((i) => i.complete && i.naturalWidth)) return
      ready = true
      draw(from)
      canvas.style.filter = `blur(${blur}px)`
      canvas.classList.add('is-set')
      if (entered) run()
    }
    imgs.forEach((img) => {
      if (img.complete) return
      const on = () => check()
      img.addEventListener('load', on)
      offs.push(() => img.removeEventListener('load', on))
    })
    check()

    /* the resolve: blocks shrink on a cubic ease-out, the blur with
       them; then the mosaic fades and leaves paint */
    let done = false
    const run = () => {
      if (done) return
      done = true
      const t0 = performance.now()
      let lastB = -1
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / (duration * 1000))
        const e = 1 - Math.pow(1 - t, 3)
        const b = Math.max(1, Math.round(from * Math.pow(1 - e, 2)))
        if (b !== lastB) {
          lastB = b
          draw(b)
        }
        canvas.style.filter = `blur(${(blur * (1 - e)).toFixed(2)}px)`
        if (t < 1) raf = requestAnimationFrame(step)
        else canvas.classList.add('is-done')
      }
      raf = requestAnimationFrame(step)
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        entered = true
        io.disconnect()
        if (ready) run()
      },
      { threshold: 0.3 },
    )
    io.observe(frame)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      offs.forEach((f) => f())
      canvas.classList.remove('is-set', 'is-done')
      canvas.style.filter = ''
    }
  }, [from, duration, blur])

  return <canvas ref={ref} className="k-pix" aria-hidden="true" />
}
