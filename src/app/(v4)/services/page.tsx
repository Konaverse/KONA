import type { Metadata } from 'next'
import ServiceCarousel, { type CarouselService } from '@/components/v4/ServiceCarousel'
import { SERVICE_PAGES } from '@/lib/service-pages'
import { SERVICE_PHOTO_ALT } from '@/lib/service-photo-alt'
import { OG_DEFAULTS, SITE_URL } from '@/lib/site'
import './hub.css'

/**
 * THE SERVICES HUB — /services.
 *
 * SINCE 2026-09-30 IT IS THE CAROUSEL (ServiceCarousel.tsx; the user:
 * "like the projects hub page… you can't scroll to go anywhere, only
 * click… a loop between the 6 cards of services"): one viewport, the
 * footer off (FooterGate), the h1 and the six services as a ring of
 * landscape cards — each the service's object on its film — with the
 * active one's name, line and two arrows above. Everything below
 * (THE BRIEF, THE WORKBENCH, the Invitation under it) is the hub it
 * replaces: HubStill / HubAgent / HubBench are parked, unimported,
 * their rules still in hub.css.
 *
 * THE HUB BEFORE (2026-09-08, the user's three frames in
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
 * INDEXED since 2026-10-02 (SEO plan v3 launch gate) and listed in
 * sitemap.ts.
 *
 * ALL COPY IS PLACEHOLDER (the user's frame text, verbatim; the blurbs are
 * first drafts in service-pages.ts).
 */
const TITLE = 'Web Design and Development Services'
const DESCRIPTION =
  'Konaverse designs and builds websites in Cyprus: web design, web development, 3D and immersive sites, one-page sites, redesigns and SEO. Six services, one studio.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/services` },
  openGraph: {
    ...OG_DEFAULTS,
    title: `${TITLE} | Konaverse`,
    description: DESCRIPTION,
    url: `${SITE_URL}/services`,
    type: 'website',
  },
}

/** each card's picture: the owner's photograph of the service at work
 *  (2026-10-01; they replace the films + object stand-ins of 09-30) */
const PHOTO: Record<string, string> = {
  'web-design': '/services/web-design/web-design-service-image.webp',
  'web-development': '/services/web-dev/web-dev-service-image.webp',
  '3d-websites': '/services/3d-websites/3d-websites-service-image.webp',
  'one-page-websites': '/services/one-page-art/one-page-design-service-image.webp',
  'website-redesign': '/services/redesign-art/website-redesign-service-image.webp',
  seo: '/services/seo-art/seo-service-image.webp',
}

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

  const services: CarouselService[] = pages.map((p) => ({
    slug: p.slug,
    name: p.name,
    blurb: p.blurb,
    image: PHOTO[p.slug] ?? p.visual,
    alt: PHOTO[p.slug] ? SERVICE_PHOTO_ALT[p.slug] : undefined,
  }))

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ServiceCarousel services={services} />
    </main>
  )
}
