import { CALENDLY_URL } from './site'

// The same frame is kept in the shared layout for inline and modal booking.
// These are the parameters Calendly's widget script adds to its iframe.
export const CALENDLY_FRAME_URL = `${CALENDLY_URL}?embed_domain=kona-verse.com&embed_type=Inline&hide_event_type_details=1&hide_gdpr_banner=1`

/** Match a slot even while its ancestors are translating, scaling or tilting.
 * The iframe stays in its original DOM parent: moving it would reload Calendly.
 */
export function placeCalendlyInline(panel: HTMLElement, slot: HTMLElement) {
  const rect = slot.getBoundingClientRect()
  const style = getComputedStyle(slot)
  const dimension = (axis: 'width' | 'height') => {
    const edges = axis === 'width' ? ['padding-left', 'padding-right', 'border-left-width', 'border-right-width']
      : ['padding-top', 'padding-bottom', 'border-top-width', 'border-bottom-width']
    return parseFloat(style[axis]) + (style.boxSizing === 'border-box' ? 0
      : edges.reduce((sum, key) => sum + (parseFloat(style.getPropertyValue(key)) || 0), 0))
  }
  const width = dimension('width')
  const height = dimension('height')
  let matrix = new DOMMatrix()
  for (let parent = slot.parentElement; parent; parent = parent.parentElement) {
    const transform = getComputedStyle(parent).transform
    if (transform !== 'none') matrix = new DOMMatrix(transform).multiply(matrix)
  }
  // The bounding rect already contains the translation and transform origins.
  // Recover its top-left corner from the transformed box's four corner offsets.
  const xs = [0, matrix.a * width, matrix.c * height, matrix.a * width + matrix.c * height]
  const ys = [0, matrix.b * width, matrix.d * height, matrix.b * width + matrix.d * height]
  panel.style.width = `${width}px`
  panel.style.height = `${height}px`
  panel.style.left = `${rect.left - Math.min(...xs)}px`
  panel.style.top = `${rect.top - Math.min(...ys)}px`
  panel.style.transformOrigin = '0 0'
  panel.style.transform = `matrix(${matrix.a},${matrix.b},${matrix.c},${matrix.d},0,0)`
}
