import { afterPageTransition, observeSharedEffectPause } from '@/lib/shared-effects'

const HERO_SESSION_KEY = 'konaverse_home_entrance_seen'
const heroEntrances = new WeakMap<HTMLElement, boolean>()
let heroSeenInMemory = false

/** One decision per mounted homepage, shared by all three hero drivers. */
export function shouldPlayHeroEntrance(element: Element) {
  const main = element.closest<HTMLElement>('main.hm')
  if (!main) return true
  const existing = heroEntrances.get(main)
  if (existing !== undefined) return existing

  let seen = heroSeenInMemory
  try {
    seen ||= window.sessionStorage.getItem(HERO_SESSION_KEY) === '1'
    window.sessionStorage.setItem(HERO_SESSION_KEY, '1')
  } catch {
    // Storage restrictions still permit once-only behavior during SPA browsing.
  }
  heroSeenInMemory = true
  const play = !seen
  heroEntrances.set(main, play)
  main.dataset.heroEntrance = play ? 'play' : 'skip'
  return play
}

/** Only defer setup on the homepage; other routes keep their own timing. */
export function isHomepageEffect(element: Element) {
  return !!element.closest('.k-pt__view')?.querySelector('main.hm')
}

/** Prepare an effect half a viewport ahead, retaining server-rendered content. */
export function prepareHomepageEffect(element: HTMLElement, setup: () => void | (() => void)) {
  if (!isHomepageEffect(element) || !('IntersectionObserver' in window)) return setup()
  const hero = element.closest('.k-pt__view')?.querySelector<HTMLElement>('main.hm')
  const margin = Math.round(window.innerHeight * 0.5)
  let started = false
  let near = false
  let cleanup: void | (() => void)
  const start = () => {
    if (started) return
    started = true
    observer.disconnect()
    window.removeEventListener('k-hero-ready', prepare)
    window.removeEventListener('scroll', prepare)
    cleanup = afterPageTransition(setup)
  }
  const prepare = () => {
    if (started || !near || !element.isConnected) return
    // Early font/video layout can briefly put a lower section in range.
    // Wait for the opening to settle, unless the user already scrolls there.
    if (hero?.dataset.heroReady !== 'true' && window.scrollY === 0) return
    const rect = element.getBoundingClientRect()
    if (rect.top <= window.innerHeight + margin && rect.bottom >= -margin) start()
  }
  const observer = new IntersectionObserver(entries => {
    near = entries.some(entry => entry.isIntersecting)
    prepare()
  }, { rootMargin: `${margin}px 0px` })
  observer.observe(element)
  window.addEventListener('k-hero-ready', prepare)
  window.addEventListener('scroll', prepare, { passive: true })
  element.addEventListener('focusin', start)
  return () => {
    observer.disconnect()
    window.removeEventListener('k-hero-ready', prepare)
    window.removeEventListener('scroll', prepare)
    element.removeEventListener('focusin', start)
    cleanup?.()
  }
}

/** Keep an initialized section's ticker off while it is far from the screen. */
export function observeHomepageActivity(element: Element, change: (active: boolean) => void) {
  let near = !isHomepageEffect(element) || !('IntersectionObserver' in window)
  let paused = false
  const publish = () => change(near && !paused)
  const unpause = observeSharedEffectPause(value => {
    paused = value
    publish()
  })
  const observer = near ? null : new IntersectionObserver(entries => {
    near = entries.some(entry => entry.isIntersecting)
    publish()
  }, { rootMargin: `${Math.round(window.innerHeight * 0.5)}px 0px` })
  observer?.observe(element)
  publish()
  return () => {
    observer?.disconnect()
    unpause()
  }
}

/** Once fallback content has arrived, a late video must not cover it again. */
export function markHeroFallback(element: Element) {
  const main = element.closest<HTMLElement>('main.hm')
  if (main && main.dataset.peelArmed !== 'true') main.dataset.heroFallback = 'true'
}

export function markHeroReady(element: Element) {
  const main = element.closest<HTMLElement>('main.hm')
  if (!main || main.dataset.heroReady === 'true') return
  main.dataset.heroReady = 'true'
  window.dispatchEvent(new CustomEvent('k-hero-ready', { detail: main }))
}
