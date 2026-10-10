import { gsap } from '@/lib/motion-v4'
import { observeSharedEffectPause } from '@/lib/shared-effects'

/** Keep scroll drivers out of the page/menu transition's frame budget. */
export function runUnpausedTicker(tick: gsap.TickerCallback, onResume?: () => void) {
  let listening = false
  const unsubscribe = observeSharedEffectPause(paused => {
    if (paused) {
      gsap.ticker.remove(tick)
      listening = false
    } else if (!listening) {
      onResume?.()
      tick(gsap.ticker.time, 16.7, gsap.ticker.frame, 0)
      gsap.ticker.add(tick)
      listening = true
    }
  })
  return () => {
    unsubscribe()
    gsap.ticker.remove(tick)
  }
}

type ScrollDriver = {
  root: HTMLElement
  tick: (rect: DOMRect, deltaTime: number) => boolean | void
  near: boolean
  awake: boolean
  paused: boolean
  prepare: () => void
}
const scrollDrivers = new Set<ScrollDriver>()
let scrollListening = false

/** Read all active sections before any driver writes a transform or class. */
const scrollFrame = (_time: number, deltaTime: number) => {
  const active = Array.from(scrollDrivers).filter(driver => driver.near && driver.awake && !driver.paused)
  active.forEach(driver => driver.prepare())
  const samples = active.map(driver => ({ driver, rect: driver.root.getBoundingClientRect() }))
  for (const { driver, rect } of samples) driver.awake = driver.tick(rect, deltaTime) === true
  if (!Array.from(scrollDrivers).some(driver => driver.near && driver.awake && !driver.paused)) {
    gsap.ticker.remove(scrollFrame)
    scrollListening = false
  }
}
const wakeScrollFrame = () => {
  if (scrollListening) return
  scrollListening = true
  gsap.ticker.add(scrollFrame)
}

/** Wake on scroll/resize, then run only until the authored glide has settled. */
export function runScrollTicker(
  root: HTMLElement,
  tick: ScrollDriver['tick'],
  measure?: () => void,
  events: string[] = [],
) {
  let dirty = true
  const driver: ScrollDriver = { root, tick, near: false, awake: true, paused: false,
    prepare: () => { if (dirty) { dirty = false; measure?.() } },
  }
  scrollDrivers.add(driver)
  const wake = () => {
    driver.awake = true
    if (driver.near && !driver.paused) wakeScrollFrame()
  }
  const resize = () => { dirty = true; wake() }
  const observer = new IntersectionObserver(([entry]) => {
    driver.near = entry.isIntersecting
    if (driver.near) wake()
  }, { rootMargin: `${Math.round(window.innerHeight * 0.25)}px 0px` })
  observer.observe(root)
  const ro = new ResizeObserver(resize)
  ro.observe(root)
  const unpause = observeSharedEffectPause(value => {
    driver.paused = value
    if (!value) resize()
  })
  window.addEventListener('scroll', wake, { passive: true })
  window.addEventListener('resize', resize, { passive: true })
  events.forEach(event => window.addEventListener(event, wake))
  return () => {
    scrollDrivers.delete(driver)
    observer.disconnect()
    ro.disconnect()
    unpause()
    window.removeEventListener('scroll', wake)
    window.removeEventListener('resize', resize)
    events.forEach(event => window.removeEventListener(event, wake))
    if (!scrollDrivers.size) {
      gsap.ticker.remove(scrollFrame)
      scrollListening = false
    }
  }
}

/** Prepare expensive decorative resources shortly before they enter view. */
export function prepareNearEffect(root: HTMLElement, setup: () => void | (() => void)) {
  let cleanup: void | (() => void)
  let started = false
  const start = () => {
    if (started) return
    started = true
    observer.disconnect()
    cleanup = setup()
  }
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) start()
  }, { rootMargin: `${Math.round(window.innerHeight * 0.5)}px 0px` })
  observer.observe(root)
  root.addEventListener('focusin', start)
  return () => { observer.disconnect(); root.removeEventListener('focusin', start); cleanup?.() }
}
