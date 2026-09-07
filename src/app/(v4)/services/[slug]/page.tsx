import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Button from '@/components/v4/Button'
import ArrowLink from '@/components/v4/ArrowLink'
import Reveal from '@/components/v4/Reveal'
import ServiceStage from '@/components/v4/ServiceStage'
import ServiceProcess from '@/components/v4/ServiceProcess'
import { SERVICE_PAGES, getServicePage, formatEuro } from '@/lib/service-pages'
import { CALENDLY_URL, CONTACT_EMAIL, SITE_URL } from '@/lib/site'
import '../service.css'

/**
 * THE SERVICE PAGE TEMPLATE — one component, six instances
 * (docs/site-architecture.md §2a; data in src/lib/service-pages.ts).
 *
 * The order on the page is the order a crawler and a language model read in,
 * and it is fixed:
 *
 *   1  h1 with the primary keyword — the display word plus the modifier line,
 *      both inside the one <h1>
 *   2  the direct answer — what, for whom, from-price, timeline in the first
 *      hundred words; the three fact cards repeat the numbers for the eye
 *   3  what it is / when it is the wrong choice — the two beats on the plate
 *   4  process
 *   5  proof — one case study
 *   6  what changes the price
 *   7  the two CTAs — Contact and Book
 *   8  the up-link to /services and the one link to the sister page
 *
 * SERVER-RENDERED, every word in the raw HTML (SEO plan D5). The stage's
 * motion is an enhancement in ServiceStage.tsx; the layout is the fallback.
 *
 * NOT INDEXED YET. The route is reachable in development only
 * (KONA_OPEN_ROUTES in .env.local lifts the launch redirect for /services);
 * production still redirects home until the hub and the real copy exist.
 * Flip INDEXABLE, drop the redirect and list the pages in sitemap.ts in the
 * same commit.
 */
const INDEXABLE = false

export const dynamicParams = false

export function generateStaticParams() {
  return SERVICE_PAGES.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = getServicePage(slug)
  if (!page) return {}
  const url = `${SITE_URL}/services/${page.slug}`
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: url },
    robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title: `${page.title} | Konaverse`,
      description: page.description,
      url,
      type: 'website',
    },
  }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = getServicePage(slug)
  if (!page) notFound()

  const url = `${SITE_URL}/services/${page.slug}`

  /* Service + BreadcrumbList — only what is visible on the page (§2a) */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: page.title,
        serviceType: page.name,
        description: page.answer[0],
        url,
        provider: { '@id': `${SITE_URL}/#organization` },
        areaServed:
          page.areaServed === 'Cyprus'
            ? { '@type': 'Country', name: 'Cyprus' }
            : 'Worldwide',
        offers: {
          '@type': 'Offer',
          priceCurrency: 'EUR',
          price: page.fromPrice,
          description: 'Starting price',
          url,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}/services` },
          { '@type': 'ListItem', position: 3, name: page.name, item: url },
        ],
      },
    ],
  }

  return (
    <article className="sp" style={{ '--sp-word': `${page.wordSize}rem` } as React.CSSProperties}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ServiceStage plate={page.plate.image}>
        {/* THE WINDOW — the plate, clipped to the slot at rest. Decorative
            here: the slot's <img> below carries the alt. */}
        <div className="sp-frame" aria-hidden="true">
          <img src={page.plate.image} alt="" draggable={false} />
        </div>

        {/* 1 + 2 — THE HERO */}
        <header className="sp-hero" data-nav-hero="0.2">
          <div className="sp-hero-l">
            <h1 className="sp-h1">
              <span className="sp-h1-w">{page.word}</span>
              <span className="sp-h1-m">{page.modifier}</span>
            </h1>
            <div className="sp-cta">
              <Button href="/contact" hoverLabel="Say hello">
                Start a project
              </Button>
              <Button href={CALENDLY_URL} external ghost hoverLabel="Pick a time">
                Book a call
              </Button>
            </div>
            <p className="sp-tag">{page.tagline}</p>
            <ul className="sp-facts" aria-label="At a glance">
              {page.facts.map((f, i) => (
                <li key={f.label} className={`sp-fact${i === 2 ? ' k-dark sp-fact-dark' : ''}`}>
                  <span className="sp-fact-cap" aria-hidden="true">
                    <img src={`/home/inline-${f.plate}.webp`} alt="" />
                  </span>
                  <span className="sp-fact-label">{f.label}</span>
                  <span className="sp-fact-value">{f.value}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="sp-hero-r">
            <div className="sp-slot">
              <img
                src={page.plate.image}
                alt={page.plate.alt}
                fetchPriority="high"
                decoding="async"
                draggable={false}
              />
            </div>
            <div className="sp-answer">
              {page.answer.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </div>
        </header>

        {/* 3 — THE PLATE: what it is, what it is not */}
        <section className="sp-plate k-dark" aria-label="What it is">
          <Reveal masked as="h2" className="sp-plate-h">
            {page.plate.headline}
          </Reveal>
          {page.plate.beats.map((b, i) => (
            <div key={b.title} className={`sp-beat sp-beat-${i + 1}`}>
              <Reveal as="h3" className="sp-beat-t">
                {b.title}
              </Reveal>
              <Reveal as="p" className="sp-beat-b" index={1}>
                {b.body}
              </Reveal>
            </div>
          ))}
          <Reveal as="p" className="sp-plate-close">
            {page.plate.close}
          </Reveal>
        </section>
      </ServiceStage>

      {/* THE PAPER — rises over the plate */}
      <div className="sp-body">
        {/* 4 — PROCESS: the schedule (ServiceProcess.tsx) */}
        <ServiceProcess steps={page.process} headingId="sp-process-h" />

        <hr className="k-rule sp-rule" />

        {/* 5 — PROOF */}
        <section className="sp-sec sp-proof" aria-labelledby="sp-proof-h">
          <div className="sp-sec-head">
            <Reveal masked as="h2" className="t-h1">
              <span id="sp-proof-h">Proof</span>
            </Reveal>
            <Reveal as="p" className="t-body sp-sec-lead" index={1}>
              One project, at length, is more useful than twelve as thumbnails.
            </Reveal>
          </div>
          <Reveal className="sp-case" index={1}>
            <a
              className="sp-case-media"
              href={page.proof.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${page.proof.name} — visit the site`}
            >
              <img src={page.proof.image} alt={page.proof.alt} loading="lazy" decoding="async" />
            </a>
            <div className="sp-case-cap">
              <div>
                <h3 className="t-h2 sp-case-name">{page.proof.name}</h3>
                <p className="t-body sp-case-line">{page.proof.line}</p>
              </div>
              <div className="sp-case-side">
                <span className="t-small">{page.proof.year}</span>
                <ArrowLink href={page.proof.href} external>
                  Visit the site
                </ArrowLink>
              </div>
            </div>
          </Reveal>
        </section>

        <hr className="k-rule sp-rule" />

        {/* 6 — WHAT CHANGES THE PRICE */}
        <section className="sp-sec sp-price" aria-labelledby="sp-price-h">
          <div className="sp-sec-head">
            <Reveal masked as="h2" className="t-h1">
              <span id="sp-price-h">What changes the price</span>
            </Reveal>
            <Reveal as="p" className="sp-from" index={1}>
              <span className="t-small">{page.name} starts at</span>
              <strong className="sp-from-n">{formatEuro(page.fromPrice)}</strong>
            </Reveal>
          </div>
          <dl className="sp-drivers">
            {page.priceDrivers.map((d, i) => (
              <Reveal key={d.driver} className="sp-driver" index={i}>
                <dt className="t-h3">{d.driver}</dt>
                <dd className="t-body">{d.effect}</dd>
              </Reveal>
            ))}
          </dl>
        </section>

        <hr className="k-rule sp-rule" />

        {/* 7 — THE TWO CTAs */}
        <section className="sp-sec sp-invite" aria-labelledby="sp-invite-h">
          <Reveal masked as="h2" className="t-display sp-invite-h">
            <span id="sp-invite-h">{page.invite}</span>
          </Reveal>
          <Reveal className="sp-invite-act" index={1}>
            <Button href="/contact" hoverLabel="Say hello">
              Start a project
            </Button>
            <Button href={CALENDLY_URL} external ghost hoverLabel="Pick a time">
              Book a call
            </Button>
            <a className="sp-mail" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          </Reveal>
        </section>

        {/* 8 — UP-LINK and the sister page */}
        <nav className="sp-foot" aria-label="Related">
          <ArrowLink href="/services">All services</ArrowLink>
          {page.sister && (
            <p className="sp-sister t-small">
              {page.sister.line}{' '}
              <a href={`/services/${page.sister.slug}`}>{page.sister.name}</a>
            </p>
          )}
        </nav>
      </div>
    </article>
  )
}
