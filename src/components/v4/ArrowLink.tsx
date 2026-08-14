import type { ReactNode } from 'react'

/**
 * ARROW LINK — the workhorse. Carries every destination the homepage is
 * allowed, so it has to be unmistakable without shouting.
 *
 * The arrow is DRAWN, not swapped. Shaft and head are separate paths on one
 * SVG; on hover the shaft swings and redraws along a new axis while the head
 * swings to match, so an east arrow becomes a north-east one. A real change of
 * shape, done with transforms and a dash offset only — no path morphing
 * library, and it stays on the compositor.
 *
 * The label also shifts to --text-accent: ice is 2.52:1 on white, so the rule
 * alone cannot carry a hover state.
 */
export default function ArrowLink({
  children,
  href,
  className = '',
}: {
  children: ReactNode
  href: string
  className?: string
}) {
  return (
    <a href={href} className={`k-arrow-link${className ? ` ${className}` : ''}`}>
      {children}
      <span className="k-arrow-link__ico" aria-hidden="true">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path className="k-arrow-link__shaft" d="M2 8h11" />
          <path className="k-arrow-link__head" d="M9.5 4.5 13 8l-3.5 3.5" />
        </svg>
      </span>
    </a>
  )
}
