import type { ReactNode } from 'react'
import Reveal from '@/components/v4/Reveal'
import ArrowLink from '@/components/v4/ArrowLink'

/**
 * THE LEGAL SHELL — the one shape all three policies share (2026-08-28).
 *
 * Quiet on purpose. These pages are read, not experienced: one measured
 * column, an h1 at h1 size (not display — nothing on a policy page earns the
 * display cut), numbered sections at h3, and the page's only motion is the
 * head's reveal. Everything visual is tokens.css; legal.css in the route
 * group does the rhythm, the way work.css does for /work.
 *
 * SERVER-RENDERED. The whole text is in the raw HTML (SEO plan D5): a
 * policy that only exists after hydration is a policy a regulator's crawler
 * cannot read.
 */

export function LegalPage({
  eyebrow = 'Legal',
  title,
  updated,
  children,
  next,
}: {
  eyebrow?: string
  title: ReactNode
  /** "August 2026" — rendered as the last-updated line */
  updated: string
  children: ReactNode
  /** the other policies, as the foot's onward links */
  next: { href: string; label: string }[]
}) {
  return (
    <article className="lg k-page">
      <header className="lg-head">
        <Reveal as="p" className="lg-eyebrow t-small">
          {eyebrow}
        </Reveal>
        <Reveal masked as="h1" className="t-h1 lg-title" index={1}>
          {title}
        </Reveal>
        <Reveal as="p" className="lg-updated t-small" index={2}>
          Last updated {updated}
        </Reveal>
      </header>

      <hr className="k-rule" />

      <div className="lg-body">{children}</div>

      <hr className="k-rule" />

      <footer className="lg-foot">
        {next.map((n) => (
          <ArrowLink key={n.href} href={n.href}>
            {n.label}
          </ArrowLink>
        ))}
      </footer>
    </article>
  )
}

/** The opening paragraph(s) before the numbered sections. */
export function LegalIntro({ children }: { children: ReactNode }) {
  return <div className="lg-intro t-body">{children}</div>
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="lg-sec">
      <h2 className="t-h3 lg-sec-title">{title}</h2>
      <div className="lg-sec-body t-body">{children}</div>
    </section>
  )
}

/** A list with a hairline tick instead of a disc — the house bullet. */
export function LegalList({ children }: { children: ReactNode }) {
  return <ul className="lg-list">{children}</ul>
}

/** An address / definition block set off by a hairline on the left. */
export function LegalCard({ children }: { children: ReactNode }) {
  return <div className="lg-card">{children}</div>
}

/** A named row inside a LegalCard — "_ga · Distinguishes visitors · 2 years". */
export function LegalRow({ name, children }: { name: string; children: ReactNode }) {
  return (
    <p className="lg-row">
      <code className="lg-row-name">{name}</code>
      <span className="lg-row-desc">{children}</span>
    </p>
  )
}

/** An outbound reference, always in a new tab. */
export function LegalExt({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="lg-ext" href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}
