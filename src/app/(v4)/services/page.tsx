import type { Metadata } from 'next'
import HubHero from '@/components/v4/HubHero'
import HubList from '@/components/v4/HubList'
import ScrollFillText from '@/components/v4/ScrollFillText'
import Button from '@/components/v4/Button'
import Invitation from '@/components/v4/Invitation'
import { SERVICE_PAGES } from '@/lib/service-pages'
import { SITE_URL } from '@/lib/site'
import './hub.css'

/**
 * THE SERVICES HUB — /services (2026-09-08, the user's three frames in
 * ServicesHubSections.zip: "Hero load", "Hero final state", "Services
 * Section"). Its SEO job is small and fixed (site-architecture §2): route
 * visitors, pass authority down to the six pages, rank for the broad term.
 * Short intro, one entry per service linking down, nothing lifted from the
 * children.
 *
 * §1 THE HERO — THE BEND. The statement top-right, the small paragraph
 * bottom-left, the display word bottom-right. On load the statement rises
 * line by line; then ONE move: the word "bending" slides LEFT out of its
 * sentence into the gutter, and the hole it leaves fills with a dark-grain
 * plate — the same object as the homepage hero's inline pills — opened by
 * the word's own departure. The pill is exactly the word's footprint, so
 * nothing reflows; the sentence still reads with the plate in the word's
 * place. HubHero.tsx.
 *
 * THE COVER (user, 2026-09-09: "Pin the hero, and the services section
 * will scroll over it"): the hero is sticky; the list, opaque and above
 * it, scrolls up over it as a plain section (the hero drifts and dims
 * beneath, HubList.tsx).
 *
 * §2 THE LIST (rebuilt 2026-09-09 to the user's reference image.png: "a
 * long, maybe 300vh section that's not pinned. Simple yet elegant"). On
 * paper, in flow: a lead paragraph with a small label at its left, filling
 * letter by letter as it climbs (the house scroll fill), then one row per
 * service split by hairlines — the number and the title (the link), then
 * THE EDITORIAL BLOCK (user, same day: "add in an editorial way more
 * content — image, mini cards, text"): the plate with the tagline as its
 * caption, the blurb and the "What it is" paragraph with a BUTTON to the
 * service's page, and the three facts as mini cards. THE STACK: the rows are CARDS that never leave — each
 * sticks a title-and-a-half below the one before, so a card covers the
 * one above it and leaves the top half of its title showing; the deck is
 * compact so the LAST card's block still fits under the five half-titles
 * above it. Each card reveals once as it enters. HubList.tsx.
 *
 * §3 THE INVITATION follows in flow and carries the footer out.
 *
 * SERVER-RENDERED, every word in the raw HTML (SEO plan D5): the h1, the
 * statement with "bending" in its sentence, the six names as h2 links with
 * their lines. The drivers are enhancements; the layout is the fallback.
 *
 * NOT INDEXED YET — same gate as the template: KONA_OPEN_ROUTES=/services
 * in .env.local lifts the launch redirect locally. Flip INDEXABLE, drop
 * the redirect and list the hub in sitemap.ts in one commit.
 *
 * ALL COPY IS PLACEHOLDER (the user's frame text, verbatim; the blurbs are
 * first drafts in service-pages.ts).
 */
const INDEXABLE = false

const TITLE = 'Web Design and Development Services'
const DESCRIPTION =
  'Konaverse designs and builds websites in Cyprus — web design, web development, 3D and immersive sites, one-page sites, redesigns and SEO. Six services, one studio.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/services` },
  robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: true },
  openGraph: {
    title: `${TITLE} | Konaverse`,
    description: DESCRIPTION,
    url: `${SITE_URL}/services`,
    type: 'website',
  },
}

/** THE STATEMENT, line by line — the frame's six breaks, held at every
 *  desktop width because the type is rem (the picture rule). `bend` marks
 *  the word that leaves. */
const STATEMENT: (string | { bend: string; after: string })[] = [
  'Our expertise consists of',
  'designing the web and',
  { bend: 'bending', after: ' the rules of' },
  'creativity in a way that',
  'satisfies every need you',
  'might desire',
]

const no = (i: number) => String(i + 1).padStart(2, '0')

/** the list's lead — PLACEHOLDER, the second half of the frame's paragraph
 *  (the first half is the hero's small paragraph) */
const LEAD =
  'Our websites are the result when you combine a personalised structure, layout and motion. When you work with us, we make sure your website stands out and is remembered.'

export default function ServicesHubPage() {
  const pages = SERVICE_PAGES

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}/services` },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'Services',
        itemListElement: pages.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: p.name,
          url: `${SITE_URL}/services/${p.slug}`,
        })),
      },
    ],
  }

  return (
    <main className="sh">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* the entrance parks everything at opacity 0 (hub.css .sh-ent); the
          no-JS page undoes it, and the bend's final state is CSS too */}
      <noscript>
        <style>{`.sh-ent{opacity:1!important;transform:none!important;filter:none!important}`}</style>
      </noscript>

      {/* §1 — THE HERO, sticky: the index scrolls over it */}
      <HubHero>
        <div className="sh-hero-l">
          {/* the keyword line, top-left (user, 2026-09-08: out of the h1,
              onto the left of the hero) */}
          <p className="sh-kicker sh-ent">Web design and development, Cyprus</p>
          <p className="sh-para sh-ent">
            We aim to fill the internet with websites that convey a strong character and
            personality through it. We design websites that provide immersive experiences to
            the visitors. No more plain and lifeless websites.
          </p>
        </div>

        <div className="sh-hero-r">
          <p className="sh-state">
            {STATEMENT.map((ln, i) => (
              <span key={i} className={`sh-mask${typeof ln === 'string' ? '' : ' sh-mask-bend'}`}>
                <span className="sh-ln sh-ent">
                  {typeof ln === 'string' ? (
                    ln
                  ) : (
                    <>
                      {/* THE SLOT: the word in the flow, the plate behind
                          it in the word's own footprint (HubHero). The
                          plate is decorative; the sentence reads whole
                          without it. The synonyms the word rolls through
                          are injected by the driver, so the served
                          sentence says "bending" once. */}
                      <span className="sh-slot">
                        <em className="sh-word">
                          <span className="sh-syn is-cur">{ln.bend}</span>
                        </em>
                        <span className="sh-pill" aria-hidden="true">
                          <img src="/home/inline-1.webp" alt="" draggable={false} />
                          <i className="sh-glint" />
                        </span>
                      </span>
                      {ln.after}
                    </>
                  )}
                </span>
              </span>
            ))}
          </p>

          {/* the h1: the display word alone (user, 2026-09-08 — the keyword
              line moved to the kicker top-left; the title tag and the intro
              carry the broad term) */}
          <h1 className="sh-h1">
            <span className="sh-mask sh-mask-w">
              <span className="sh-h1-w sh-ent">Services</span>
            </span>
          </h1>
        </div>
      </HubHero>

      {/* §2 — THE LIST, on paper, in flow: scrolls up over the sticky hero */}
      <HubList>
        <div className="sh-lead">
          <span className="sh-lead-l">Services</span>
          <ScrollFillText as="p" className="sh-lead-p" text={LEAD} />
        </div>

        <ol className="sh-list">
          {pages.map((p, i) => (
            <li key={p.slug} className="sh-row" style={{ '--i': i } as React.CSSProperties}>
              <span className="sh-row-no" aria-hidden="true">{no(i)}</span>
              <h2 className="sh-row-title">
                <span className="sh-row-mask">
                  <a className="sh-row-link" href={`/services/${p.slug}`}>{p.name}</a>
                </span>
              </h2>
              {/* THE TREAD (2026-09-13) — the step's flat, an editorial
                  spread under the title: left the promise, the blurb and
                  the way in; right the plate, the service's own poster
                  with its number printed on it, cut by the page's right
                  edge rather than framed by the card; along the foot the
                  three facts as one hairline strip — the case study's
                  meta row, so a fact reads the same everywhere. The
                  title above is the same link as the button, so the tree
                  reads it twice on purpose (user: "make the CTA clear"). */}
              <div className="sh-tread">
                <div className="sh-tread-copy">
                  <p className="sh-pull">{p.tagline}</p>
                  <p className="sh-blurb">{p.blurb}</p>
                  <div className="sh-tread-cta">
                    <Button href={`/services/${p.slug}`} hoverLabel="View the service">
                      {`Explore ${p.name}`}
                    </Button>
                  </div>
                </div>
                <figure className="sh-plate">
                  <img src={p.visual} alt="" draggable={false} loading="lazy" decoding="async" style={{ objectPosition: p.visualPos }} />
                  <span className="sh-plate-no" aria-hidden="true">
                    <span className="sh-plate-no-in">{no(i)}</span>
                  </span>
                  <figcaption className="sh-plate-cap">{p.plate.headline}</figcaption>
                  <i className="sh-plate-glint" aria-hidden="true" />
                </figure>
                <dl className="sh-spec">
                  {p.facts.map((f) => (
                    <div key={f.label} className="sh-spec-it">
                      <dt>{f.label}</dt>
                      <dd>{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </li>
          ))}
        </ol>

      </HubList>

      {/* §3 — THE INVITATION, the site's CTA, in flow; above the sticky
          hero like the list */}
      <div className="sh-cta">
        <Invitation />
      </div>
    </main>
  )
}
