import type { Metadata } from 'next'
import HubAgent from '@/components/v4/HubAgent'
import HubBench from '@/components/v4/HubBench'
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
 * §1 THE HERO — THE BRIEF (2026-09-17, user: "familiar, smart, smooth,
 * agentic, premium, light theme and motion rich… we need to impress";
 * and, stopping THE GATHERING before it: "you reveal all the services
 * from the hero", with no picture-per-service to be had). No service is
 * named and nothing is a photograph: the hero is the studio at work,
 * drawn in code. An agent's cursor types a brief into a prompt, a plan
 * of four steps ticks itself, and the hero BUILDS — the word out of its
 * skeleton with its weight running down the variable axis, the guides
 * and the statement dragged onto them, a MOTION card drawing the house
 * curve, a PERFORMANCE dial closing on 100 — then rests alive: a dot
 * field that bends to the pointer, letters that gain weight under the
 * hand, and a prompt that is REAL (type what you need; a small router
 * answers with the right page). HubAgent.tsx. THE BEND (HubHero.tsx)
 * is parked, unimported, with its rules in hub.css.
 *
 * THE COVER (user, 2026-09-09: "Pin the hero, and the services section
 * will scroll over it"): the hero is sticky; the list, opaque and above
 * it, scrolls up over it as a plain section (the hero drifts and dims
 * beneath, HubList.tsx).
 *
 * §2 THE SERVICES — THE WORKBENCH (2026-09-17, user: "completely
 * changed… hover animated mixed with scroll motion rich… it can be a
 * grid, it can be cards… don't be afraid to mix things up"). A bento of
 * six artboards and a seventh, dark card. No photographs: each card
 * carries a scene DRAWN IN CODE that does what the service is — a
 * layout rearranging, an editor typing, a glass cube turning, a long
 * page scrolling itself, before | after under the hand, a result
 * climbing to first. Under the hand a card lights, leans, plays its
 * scene and opens its blurb while the others step back; on scroll the
 * cards come up from under the fold tipped back in perspective and
 * settle flat, a beat per column. Each card's link is its h2.
 * HubBench.tsx. THE LIST / THE STAIR it replaces (HubList.tsx — the
 * sticky cards, the tread, the plates) is parked, unimported, with
 * its rules in hub.css.
 *
 * §3 THE INVITATION follows in flow and carries the footer out.
 *
 * SERVER-RENDERED, every word in the raw HTML (SEO plan D5): the h1, the
 * statement, the prompt as a real form, the six names as h2 links with
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

/** THE STATEMENT, line by line — the breaks hold at every desktop width
 *  because the type is rem (the picture rule). PLACEHOLDER copy. */
const STATEMENT = ['Tell us what you need.', 'We design it, build it and make it move.'] as const

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
        <style>{`.sh-ent,.ha-ent{opacity:1!important;transform:none!important;filter:none!important}.ha-skel,.ha-cursor,.ha-guides{display:none!important}.ha-chip{opacity:1!important}.ha-ring-v{stroke-dashoffset:0!important}`}</style>
      </noscript>

      {/* §1 — THE HERO, sticky: the index scrolls over it */}
      <HubAgent kicker="Web design and development, Cyprus" statement={STATEMENT} />

      {/* §2 — THE LIST, on paper, in flow: scrolls up over the sticky hero */}
      <HubBench
        lead={LEAD}
        services={pages.map((p) => ({
          slug: p.slug,
          name: p.name,
          tagline: p.tagline,
          blurb: p.blurb,
          facts: p.facts.map((f) => ({ value: f.value, label: f.label })),
        }))}
      />

      {/* §3 — THE INVITATION, the site's CTA, in flow; above the sticky
          hero like the list */}
      <div className="sh-cta">
        <Invitation />
      </div>
    </main>
  )
}
