import type { Metadata } from 'next'
import WorkHero, { type HeroProject } from '@/components/v4/WorkHero'
import Button from '@/components/v4/Button'
import { WORK_PROJECTS } from '@/lib/work-projects'
import { getCaseStudy } from '@/lib/case-studies'
import { CALENDLY_URL, SITE_URL } from '@/lib/site'
import './work.css'

/**
 * THE WORK HUB — /work. Second build, 2026-09-17 (user: "elevate the
 * concept of the hero by redesigning it. I like the current hero, but
 * it's poorly designed and implemented… No eyebrows, no numbering, and
 * no hairlines. — Replace the cards section with the hover section of
 * the projects we have in the homepage"). The first build (2026-09-11,
 * the wireframe "Work Page.png") is parked: WorkMotion.tsx, unimported,
 * and its rules at the foot of work.css.
 *
 * §1 THE HERO (WorkHero.tsx). The concept is the first build's, the
 * user's own: a statement; under it a WINDOW cutting relentlessly
 * through the projects' captures, leaning to the hand; on scroll it
 * grows to the whole viewport and "selected", then "work", rise on it.
 * Rebuilt: the statement is display type and IS the hero; the two CTAs
 * (Contact, Book — the two the inner-page phase decided) stand under it;
 * the window is wide and cut by the fold; the vertical service labels,
 * the meta row and its hairlines are GONE; and the growth is a scrub on
 * the glide inside a sticky stage — no wheel lock. The title lands huge,
 * on a diagonal; the reel's cut slows as the window grows.
 *
 * §2 THE SLIDER — inside the hero (third build, the same evening; the
 * user's recording "projects section vide.mp4": "after the container
 * opens to full viewport it stays to full viewport and becomes this
 * section… connected to the footer"). The full bleed STAYS: a track of
 * names across the middle, the project on show centred and its
 * neighbours cut by the screen's edges; the reel locked to that project
 * and dissolving on a change; a filmstrip window cut by the fold; two
 * arrows. The scroll walks it, a band per project. The homepage's hover
 * list on a paper cover (WorkList `bare`) stood here for a day and did
 * not tie with the hero. NOTHING follows but the footer — the house void
 * comes up under the dark stage (the Invitation left this page with the
 * cover: the hero carries the two CTAs, the footer the address).
 *
 * SERVER-RENDERED, every word in the raw HTML (SEO plan D5): the h1 is
 * the statement; the list's h2 ("Selected work") and the four names as
 * links. No video on the page: the reel is stacked captures cut by a
 * clock. NOT INDEXED YET — KONA_OPEN_ROUTES=/work lifts the launch
 * redirect locally.
 */
const INDEXABLE = false

const TITLE = 'Work'
const DESCRIPTION =
  'Four websites designed and built by Konaverse in Cyprus — a videographer, a barbershop, a watchmaker and a financial advisory. Every one from a blank file.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/work` },
  robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: true },
  openGraph: {
    title: `${TITLE} | Konaverse`,
    description: DESCRIPTION,
    url: `${SITE_URL}/work`,
    type: 'website',
  },
}

/** THE STATEMENT, line by line (the breaks hold: the type is rem); the
 *  last line is set in ink */
const STATEMENT = ['We don’t build to impress, we', 'build to bring your vision to life.', 'If it impresses, then so be it.'] as const

/** how many captures of each project the reel cuts through */
const REEL_EACH = 4

export default function WorkPage() {
  const projects = WORK_PROJECTS

  /* the slider's roster: where each project goes (its case study, else
     the live site), its filmstrip capture, the captures its reel cuts */
  const roster: HeroProject[] = projects.map((p) => ({
    slug: p.slug,
    name: p.name,
    service: p.service,
    year: p.year,
    href: getCaseStudy(p.slug) ? `/work/${p.slug}` : p.href ?? '/contact',
    image: p.image,
    shots: [p.image, ...(p.frames ?? []).slice(1, REEL_EACH)],
  }))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Work', item: `${SITE_URL}/work` },
        ],
      },
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_URL}/work#page`,
        url: `${SITE_URL}/work`,
        name: TITLE,
        description: DESCRIPTION,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'ItemList',
        name: 'Selected work',
        itemListElement: projects.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: p.name,
          ...(getCaseStudy(p.slug) ? { url: `${SITE_URL}/work/${p.slug}` } : p.href ? { url: p.href } : {}),
        })),
      },
    ],
  }

  return (
    <main className="wk">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* the hero's entrance parks its lines and buttons (work.css
          .wh-ent); the no-JS page undoes it */}
      <noscript>
        <style>{`.wh-ent{opacity:1!important;transform:none!important}`}</style>
      </noscript>

      {/* §1 — THE HERO */}
      <WorkHero lines={STATEMENT} projects={roster}>
        <Button href="/contact" hoverLabel="Say hello">
          Contact us
        </Button>
        <Button href={CALENDLY_URL} external ghost hoverLabel="Pick a time">
          Book a call
        </Button>
      </WorkHero>

    </main>
  )
}
