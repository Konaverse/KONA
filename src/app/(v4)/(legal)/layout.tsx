import './legal.css'

/**
 * The three policies (privacy, terms, cookies) share one stylesheet and
 * nothing else — the shell is a component (Legal.tsx) so each page keeps
 * its own metadata and copy in the raw HTML. A route group so the URLs
 * stay flat: /privacy, not /legal/privacy (they are already indexed and
 * in the sitemap under those paths).
 */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return children
}
