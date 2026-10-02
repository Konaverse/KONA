import type { Metadata } from 'next'
import WorkCascade, { type CascadeCard } from '@/components/v4/WorkCascade'
import { WORK_PROJECTS } from '@/lib/work-projects'
import { getCaseStudy } from '@/lib/case-studies'
import { OG_DEFAULTS, SITE_URL } from '@/lib/site'
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
 * clock. INDEXED since 2026-10-02 (SEO plan v3 launch gate).
 */
const TITLE = 'Website Design Portfolio'
const DESCRIPTION =
  'Seven websites designed and built by Konaverse in Cyprus: a barbershop, a financial leadership firm, a cleaning company, a property developer, a design-and-build studio and two concepts. Every one from a blank file.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/work` },
  openGraph: {
    ...OG_DEFAULTS,
    title: `${TITLE} | Konaverse`,
    description: DESCRIPTION,
    url: `${SITE_URL}/work`,
    type: 'website',
  },
}

/** THE RUN (WorkCascade), top-left to bottom-right: one cover a project
 *  (the user's covers, 2026-09-19 — public/work/covers/<slug>.webp, with a
 *  960w sibling). A slug that is in WORK_PROJECTS takes its name, its line
 *  and its case study from there; the four that are not yet carry their
 *  own name and have NO destination — the card is a picture, not a link —
 *  until they get a case study or a live URL. Light and dark alternate
 *  down the run so neighbours separate. THE LAST ONE IS THE PLATE — the
 *  card the page opens on at full bleed: a light one, so the nav's ink
 *  reads over it, and one with no window corners baked into the shot. */
const RUN: { slug: string; name?: string }[] = [
  { slug: 'los-santos-barbers' },
  { slug: 'lumiere-eclat' },
  { slug: 'chris-n-clean', name: 'Chris N. Clean' },
  { slug: 'velricon' },
  { slug: 'heimat-group', name: 'Heimat Group' },
  { slug: 'tdk', name: 'TDK' },
  { slug: 'city-arcade', name: 'City Arcade' },
]

export default function WorkPage() {
  const projects = WORK_PROJECTS

  const cards: CascadeCard[] = RUN.map(({ slug, name }) => {
    const p = projects.find((x) => x.slug === slug)
    return {
      slug,
      name: p?.name ?? name ?? slug,
      meta: p ? `${p.service}, ${p.year}` : '',
      href: p ? (getCaseStudy(slug) ? `/work/${slug}` : p.href) : undefined,
      src: `/work/covers/${slug}.webp`,
      alt: p
        ? `The ${p.name} website, designed and built by Konaverse`
        : `The ${name ?? slug} website, by Konaverse`,
      small: `/work/covers/${slug}-960.webp`,
    }
  })

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
      {/* work.css hides the run until the driver parks the deck; a browser
          that does not know the `scripting` media feature needs telling */}
      <noscript>
        <style>{`.wc .wc-run{visibility:visible!important}`}</style>
      </noscript>

      {/* THE CASCADE (2026-09-19): the page opens on one card at full
          bleed, draws in to card size, and deals the run. The old hub
          (WorkHero — the statement and the slider) is parked, unimported,
          with its rules above in work.css. No scroll behaviour yet. */}
      <WorkCascade
        cards={cards}
        title="Selected work"
        line="Every one from a blank file."
        opener={{ src: '/work/covers/opener.webp', small: '/work/covers/opener-960.webp' }}
      />

    </main>
  )
}
