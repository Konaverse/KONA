/**
 * RESPONSIVE SOURCES BY CONVENTION (performance pass, 2026-10-03).
 *
 * The site's pictures are plain <img> (no next/image), and phones were
 * downloading the full desktop files: a 1900px capture for a 390px screen.
 * Each large set now has a smaller sibling on disk, written next to the
 * original with its width in the name:
 *
 *   /work/<slug>/NN.webp                    1900w  →  NN-960.webp
 *   /about-hero/NN.webp                     1600w  →  NN-800.webp
 *   /services/<dir>/<name>-service-image.webp ~1586w → …-800.webp
 *   /services/<dir>/<name>-graphic.webp      1672w → …-800.webp
 *   /home/bosra-2000.webp                   2000w  →  bosra-1200.webp
 *
 * `srcSetOf(src)` returns the srcset for a source in one of those sets and
 * undefined for anything else, so it is safe to spread onto any <img>. Pair
 * it with `sizes` — "100vw" by default, which never asks a desktop for less
 * than it got before; a component that knows its rendered width can pass a
 * tighter one. A NEW capture needs its sibling: run the resize in
 * tools/art.js's way (sharp, quality 80) or the srcset points at a 404.
 */
export function srcSetOf(src: string): string | undefined {
  let m = src.match(/^(\/work\/[^/]+\/\d+)\.webp$/)
  if (m) return `${m[1]}-960.webp 960w, ${src} 1900w`
  m = src.match(/^(\/about-hero\/\d+)\.webp$/)
  if (m) return `${m[1]}-800.webp 800w, ${src} 1600w`
  m = src.match(/^(\/services\/[^/]+\/[^/]+-service-image)\.webp$/)
  if (m) return `${m[1]}-800.webp 800w, ${src} 1586w`
  m = src.match(/^(\/services\/[^/]+\/[^/]+-graphic)\.webp$/)
  if (m) return `${m[1]}-800.webp 800w, ${src} 1672w`
  if (src === '/home/bosra-2000.webp') return '/home/bosra-1200.webp 1200w, /home/bosra-2000.webp 2000w'
  return undefined
}

/** spread onto an <img>: `<img {...responsive(src)} … />` sets src, srcSet
 *  and sizes together (sizes only when there is a srcset) */
export function responsive(src: string, sizes = '100vw') {
  const srcSet = srcSetOf(src)
  return srcSet ? { src, srcSet, sizes } : { src }
}
