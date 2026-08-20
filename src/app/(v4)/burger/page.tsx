import type { Metadata } from 'next'
import './burger.css'

/**
 * BURGER / APERTURE PREVIEW — never linked, never indexed.
 *
 * A blank stage for showing the burger + aperture around (user ask,
 * 2026-08-19). The (v4) layout mounts the real ApertureMenu on every v4
 * route, but desktop shows the horizontal links and hides the burger —
 * burger.css flips that complement for this page only (scoped :has), so
 * the burger sits alone top right on empty ground and clicking it plays
 * the real aperture open/close. Delete the folder freely when it has
 * served its purpose.
 */
export const metadata: Metadata = {
  title: 'Burger preview',
  robots: { index: false, follow: false },
}

export default function BurgerPreviewPage() {
  return (
    <main className="bp" style={{ height: '100svh', display: 'grid', placeItems: 'center' }}>
      <p className="t-small">The burger is top right — click it.</p>
    </main>
  )
}
