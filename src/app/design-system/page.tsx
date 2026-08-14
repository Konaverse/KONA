import type { Metadata } from 'next'
import ApertureMenu from '@/components/v4/ApertureMenu'
import '@/styles/tokens.css'

/**
 * v4 preview route. Sits OUTSIDE app/(site) so it renders without the legacy
 * navbar, footer, cursor and smooth-scroll wrapper.
 *
 * `.k-root` is what carries the Whiteout base styling. It is a wrapper class
 * rather than a bare `body` rule because Next hoists every CSS import to global
 * scope — styling `body` here would repaint the legacy dark site too. Once the
 * legacy site is gone, `.k-root` moves onto <body> and this wrapper disappears.
 */
export const metadata: Metadata = {
  title: 'Design system',
  robots: { index: false, follow: false },
}

export default function DesignSystemPage() {
  return (
    <div className="k-root" style={{ minHeight: '100svh' }}>
      <div className="k-grain" />
      <ApertureMenu />

      <main className="k-page" style={{ paddingTop: '32vh', paddingBottom: 'var(--s-11)' }}>
        <span className="k-mask">
          <h1 className="k-reveal is-in t-display" style={{ margin: 0 }}>
            Ahead of <em>market</em>
          </h1>
        </span>
        <p className="k-reveal is-in t-body" style={{ marginTop: 'var(--s-6)' }}>
          The page beneath the menu. Open the aperture from the burger, top right — the
          circle is born inside the button, and closing plays the same timeline backwards
          into it at 1.6&times;. Escape closes too.
        </p>
      </main>
    </div>
  )
}
