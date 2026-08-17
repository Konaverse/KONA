import type { Metadata } from 'next'
import Reveal from '@/components/v4/Reveal'
import Button from '@/components/v4/Button'
import ArrowLink from '@/components/v4/ArrowLink'
import ProjectCard from '@/components/v4/ProjectCard'
import ProjectSheets from '@/components/v4/ProjectSheets'
import './work.css'

/**
 * The work hub — a STUB, and deliberately one.
 *
 * It exists to clear checklist blocker B2: the page transition needs two routes
 * to move between, and until now app/(v4) held exactly one. It is a real route
 * rather than a throwaway because /work is one of the seven URLs the homepage
 * is specified to link to (site-architecture §8), so this is scaffolding the
 * real page will grow into rather than something to delete.
 *
 * What is NOT here, and why: the cards carry no poster or video, because those
 * assets do not exist yet (blocker B1). Until they do, the tiles are frames and
 * the card's main move — the recording playing on hover — cannot be judged.
 *
 * noindex until it holds real work.
 */
export const metadata: Metadata = {
  title: 'Work',
  robots: { index: false, follow: false },
}

const PROJECTS: [string, string][] = [
  ['Meridian', 'Brand and site · 2026'],
  ['Atlas Freight', 'Platform · 2025'],
  ['Nord Studio', 'One-page site · 2025'],
]

const CAPABILITIES = [
  ['3D & immersive websites', 'From 4,000'],
  ['Web design', 'From 2,000'],
  ['Web development', 'From 2,000'],
  ['One-page websites', 'From 1,000'],
]

export default function WorkPage() {
  return (
    <div className="wk">
      <div className="k-page">
        <section className="wk-section wk-hero">
          <Reveal masked as="h1" className="t-display" style={{ margin: '0 0 var(--s-6)' }}>
            Selected <em>work</em>
          </Reveal>
          <Reveal as="p" className="t-body wk-lead" index={1}>
            Every project here was built as one continuous story rather than a stack
            of sections. Three of them, at length, is more useful than twelve as
            thumbnails.
          </Reveal>
        </section>

        <hr className="k-rule" />

        <section className="wk-section">
          <div className="wk-tiles">
            {PROJECTS.map(([name, meta], i) => (
              <ProjectCard key={name} title={name} meta={meta} href="#" index={i} />
            ))}
          </div>
        </section>

        <hr className="k-rule" />
      </div>

      {/* Homepage §5's page-turn, living here until the v4 homepage exists —
          full bleed, so it sits OUTSIDE .k-page's gutter. */}
      {/* Stand-in artwork from the legacy asset pool until B1 lands —
          the mechanic needs real pixels to be judged in full. */}
      <ProjectSheets
        projects={[
          { title: 'Meridian', line: 'A brand and site built as one continuous story.', year: '2026', href: '#', image: '/General/aesth_skyscrapers.png' },
          { title: 'Atlas Freight', line: 'A logistics platform that reads like a dashboard should.', year: '2025', href: '#', image: '/General/aesth_office.png' },
          { title: 'Nord Studio', line: 'One page, one argument, no scroll wasted.', year: '2025', href: '#', image: '/General/staircase.jpeg' },
        ]}
      />

      <div className="k-page">
        <hr className="k-rule" />

        <section className="wk-section">
          <Reveal masked as="h2" className="t-h2" style={{ margin: '0 0 var(--s-7)' }}>
            What we do
          </Reveal>
          {CAPABILITIES.map(([name, price]) => (
            <div className="k-row" key={name}>
              <span className="t-h3">{name}</span>
              <span className="t-small">{price}</span>
            </div>
          ))}
          <div style={{ marginTop: 'var(--s-7)' }}>
            <ArrowLink href="/design-system">Back to the design system</ArrowLink>
          </div>
        </section>

        <hr className="k-rule" />

        <section className="wk-section" style={{ paddingBottom: 'var(--s-11)' }}>
          <Reveal masked as="h2" className="t-h1">
            Start a <em>project</em>
          </Reveal>
          <div style={{ marginTop: 'var(--s-7)' }}>
            <Button href="/contact" hoverLabel="Say hello">Start a project</Button>
          </div>
        </section>
      </div>
    </div>
  )
}
