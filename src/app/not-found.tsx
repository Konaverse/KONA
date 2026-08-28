import type { Metadata } from 'next'
import V4Layout from '@/app/(v4)/layout'
import Reveal from '@/components/v4/Reveal'
import Button from '@/components/v4/Button'
import ArrowLink from '@/components/v4/ArrowLink'
import { SECTIONS } from '@/lib/site'
import './not-found.css'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
}

/**
 * THE 404 (2026-08-28). Next only honours a not-found at the app root for
 * unmatched URLs, and the root sits outside the (v4) route group — so this
 * page wears the v4 shell explicitly by composing the group's layout. Same
 * grain, menu, cursor, footer as any v4 page; the ghost route list in
 * PageTransition never sees it, so its links leave with a plain cut.
 *
 * Copy is the studio's voice, not a joke: one line, one way home, and the
 * three places a lost visitor was probably looking for.
 */
export default function NotFound() {
  return (
    <V4Layout>
      <main className="nf k-page">
        <Reveal as="p" className="nf-eyebrow t-small">
          404
        </Reveal>
        <Reveal masked as="h1" className="t-h1 nf-title" index={1}>
          This page <em>isn&rsquo;t here.</em>
        </Reveal>
        <Reveal as="p" className="t-body nf-lead" index={2}>
          The address may be old, or the page may not exist yet — the site is one page for now,
          and everything is on it.
        </Reveal>
        <Reveal className="nf-actions" index={3}>
          <Button href="/" hoverLabel="Go home">
            Back to the site
          </Button>
          <div className="nf-links">
            <ArrowLink href={SECTIONS.services}>What we do</ArrowLink>
            <ArrowLink href={SECTIONS.work}>Selected work</ArrowLink>
            <ArrowLink href={SECTIONS.contact}>Contact</ArrowLink>
          </div>
        </Reveal>
      </main>
    </V4Layout>
  )
}
