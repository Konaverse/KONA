/** Pause decorative work while either navigation mechanism owns the screen. */
export function observeSharedEffectPause(onChange: (paused: boolean) => void) {
  let menu = Boolean(document.querySelector('.k-shift.is-frozen'))
  let transition = document.documentElement.classList.contains('k-pt-active')
  let last: boolean | undefined
  const update = () => {
    const paused = menu || transition || document.hidden
    if (paused === last) return
    last = paused
    onChange(paused)
  }
  const onMenu = (event: Event) => {
    menu = Boolean((event as CustomEvent<boolean>).detail)
    update()
  }
  const onTransition = (event: Event) => {
    transition = Boolean((event as CustomEvent<boolean>).detail)
    update()
  }
  window.addEventListener('k:freeze', onMenu)
  window.addEventListener('k:transition', onTransition)
  document.addEventListener('visibilitychange', update)
  update()
  return () => {
    window.removeEventListener('k:freeze', onMenu)
    window.removeEventListener('k:transition', onTransition)
    document.removeEventListener('visibilitychange', update)
  }
}

/** Start expensive setup after an ordinary page transition has landed. */
export function afterPageTransition(setup: () => void | (() => void)) {
  if (!document.documentElement.classList.contains('k-pt-active')) return setup()
  let cleanup: void | (() => void)
  const start = (event: Event) => {
    if ((event as CustomEvent<boolean>).detail) return
    window.removeEventListener('k:transition', start)
    cleanup = setup()
  }
  window.addEventListener('k:transition', start)
  return () => {
    window.removeEventListener('k:transition', start)
    cleanup?.()
  }
}
