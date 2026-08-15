import type { ReactNode } from 'react'

/**
 * ARROW LINK — the workhorse. Carries every destination the homepage is
 * allowed, so it has to be unmistakable without shouting.
 *
 * AT REST IT IS A LINE. Not an arrow, not a chevron — a plain horizontal
 * stroke, which claims nothing about where the link goes.
 *
 * ON HOVER IT BECOMES AN ARROW, and which arrow it becomes is the point.
 * The old version morphed east into NORTH-EAST, and ↗ is the web's
 * near-universal sign for "opens elsewhere" while every one of these links is
 * internal — a real semantic clash, logged as 2.1 on the pre-design checklist.
 *
 * So the convention is respected rather than overridden:
 *
 *   internal (default) → EAST arrow. Forward, next, onward, still here.
 *   external           → NORTH-EAST arrow. Leaves the site.
 *
 * Which makes the rest state do genuine work: the icon is neutral until you
 * are about to act on it, and then it tells you what kind of destination this
 * is at exactly the moment that matters.
 *
 * The head grows out of the shaft's own tip rather than being swapped in.
 * Scaling from the vertex is geometrically identical to drawing each barb
 * outward along its length, and it is one property on the compositor.
 *
 * The whole arrow also steps FORWARD as it resolves — and forward means along
 * its own axis, so an internal arrow steps east and an external one steps
 * north-east, off one distance. Growing a head and advancing are one statement
 * ("it goes that way"), not two competing ones.
 *
 * ON TOUCH THE ARROW IS ALWAYS SHOWN. There is no hover, so the line-at-rest
 * refinement would leave touch users with an icon that never resolves into
 * anything meaningful. Same rule as the button's second label: the hover state
 * may restate, it may not be the only place meaning lives.
 */
export default function ArrowLink({
  children,
  href,
  external = false,
  className = '',
}: {
  children: ReactNode
  href: string
  /** Marks the destination as off-site: the arrow resolves to ↗ instead of →.
   *  Controls the marker only — target and rel stay the caller's business. */
  external?: boolean
  className?: string
}) {
  const cls = [
    'k-arrow-link',
    external ? 'k-arrow-link-ext' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <a href={href} className={cls}>
      {children}
      <span className="k-arrow-link__ico" aria-hidden="true">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
          {/* the group is what swings to north-east for external links, so the
              shaft and its head stay one object through the rotation */}
          <g className="k-arrow-link__g">
            <path className="k-arrow-link__shaft" d="M2 8 L13 8" />
            <path className="k-arrow-link__head" d="M9 4.5 L13 8 L9 11.5" />
          </g>
        </svg>
      </span>
    </a>
  )
}
