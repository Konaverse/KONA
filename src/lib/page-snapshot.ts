/** A still of the outgoing sheet, with distant sections reduced to their boxes. */
export function createPageSnapshot(view: HTMLElement, viewportHeight: number) {
  const viewRect = view.getBoundingClientRect()
  const frozen = new Map<Element, Map<string, string>>()
  // CSS animation progress is not copied by cloneNode. Capture its current
  // properties before the ghost's animation:none rule removes those clocks.
  for (const animation of view.getAnimations({ subtree: true })) {
    const effect = animation.effect
    if (!(effect instanceof KeyframeEffect) || !(effect.target instanceof Element)) continue
    const target = effect.target
    const values = frozen.get(target) ?? new Map<string, string>()
    const style = getComputedStyle(target)
    for (const frame of effect.getKeyframes()) {
      for (const key of Object.keys(frame)) {
        if (['offset', 'computedOffset', 'easing', 'composite'].includes(key)) continue
        const property = key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
        values.set(property, style.getPropertyValue(property))
      }
    }
    frozen.set(target, values)
  }

  // The outgoing sheet travels 31% of a viewport and tilts 2.2 degrees.
  // A full viewport of extra content on either side covers that whole sweep.
  const top = -viewportHeight
  const bottom = viewportHeight * 2
  const placeFixed = (source: Element, clone: HTMLElement) => {
    if (!source.matches('.hp-canvas, .rl, .rn') || getComputedStyle(source).position !== 'fixed') return
    // A transformed ghost makes fixed descendants relative to its full
    // height. Anchor these viewport layers to their captured position instead.
    let parent = source.parentElement
    while (parent && parent !== view && getComputedStyle(parent).position === 'static') parent = parent.parentElement
    const origin = parent && view.contains(parent) ? parent.getBoundingClientRect() : viewRect
    const rect = source.getBoundingClientRect()
    clone.style.position = 'absolute'
    clone.style.top = `${rect.top - origin.top}px`
    clone.style.left = `${rect.left - origin.left}px`
    clone.style.right = 'auto'
    clone.style.bottom = 'auto'
    clone.style.width = `${rect.width}px`
    clone.style.height = `${rect.height}px`
    clone.style.transform = 'none'
  }
  const copy = (source: Node): Node => {
    const clone = source.cloneNode(false)
    if (!(source instanceof Element) || !(clone instanceof Element)) return clone
    if (source instanceof HTMLElement && clone instanceof HTMLElement
      && source.matches('section, header, footer, .hm-heropin')) {
      const rect = source.getBoundingClientRect()
      if (rect.bottom < top || rect.top > bottom) {
        // Keep the tag, classes, margins and sibling position. Only its
        // children leave; the remaining sheet must keep identical geometry.
        clone.style.boxSizing = 'border-box'
        const style = getComputedStyle(source)
        const extra = style.boxSizing === 'border-box' ? 0 :
          ['padding-top', 'padding-bottom', 'border-top-width', 'border-bottom-width']
            .reduce((sum, property) => sum + (parseFloat(style.getPropertyValue(property)) || 0), 0)
        const height = parseFloat(style.height) + extra
        clone.style.height = `${Number.isFinite(height) ? height : source.offsetHeight}px`
        clone.style.minHeight = clone.style.height
        clone.style.maxHeight = clone.style.height
        clone.style.contentVisibility = 'hidden'
        return clone
      }
    }
    if ((clone instanceof HTMLElement || clone instanceof SVGElement)) {
      frozen.get(source)?.forEach((value, property) => clone.style.setProperty(property, value))
    }

    if (source instanceof HTMLVideoElement || source instanceof HTMLCanvasElement) {
      const still = document.createElement('canvas')
      for (const attribute of clone.attributes) {
        if (!['src', 'autoplay', 'loop', 'preload', 'poster', 'data-src'].includes(attribute.name)) {
          still.setAttribute(attribute.name, attribute.value)
        }
      }
      still.width = source instanceof HTMLVideoElement ? source.videoWidth : source.width
      still.height = source instanceof HTMLVideoElement ? source.videoHeight : source.height
      const style = getComputedStyle(source)
      // Tag selectors also style films. A canvas inherits the same authored
      // crop, grade and placement without retaining a second video decoder.
      for (const property of ['width', 'height', 'display', 'position', 'top', 'right', 'bottom', 'left',
        'object-fit', 'object-position', 'filter', 'opacity', 'visibility', 'border-radius', 'transform', 'transform-origin']) {
        const value = style.getPropertyValue(property)
        still.style.setProperty(property, property === 'filter' && value === 'blur(0px)' ? 'none' : value)
      }
      const emptyPeel = source.matches('.hp-canvas') && !source.closest('.hm-glhero')
      if (still.width && still.height && !emptyPeel && style.display !== 'none' && style.visibility !== 'hidden') {
        try { still.getContext('2d')?.drawImage(source, 0, 0) } catch {
          // An undecoded or cross-origin film retains its empty fallback.
        }
      }
      placeFixed(source, still)
      if (source instanceof HTMLVideoElement) {
        // A real crop wrapper clips the frozen frame exactly like the film;
        // object-fit on a canvas alone can escape its rounded edge in Chrome.
        const frame = document.createElement('div')
        for (const attribute of still.attributes) frame.setAttribute(attribute.name, attribute.value)
        frame.removeAttribute('width')
        frame.removeAttribute('height')
        frame.style.overflow = 'hidden'
        for (const attribute of Array.from(still.attributes)) {
          if (!['width', 'height'].includes(attribute.name)) still.removeAttribute(attribute.name)
        }
        still.style.display = 'block'
        still.style.width = '100%'
        still.style.height = '100%'
        still.style.objectFit = style.objectFit
        still.style.objectPosition = style.objectPosition
        frame.appendChild(still)
        return frame
      }
      return still
    }
    if (clone instanceof HTMLElement) placeFixed(source, clone)
    for (const child of source.childNodes) clone.appendChild(copy(child))
    return clone
  }
  return copy(view) as HTMLElement
}
