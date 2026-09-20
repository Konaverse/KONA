import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Button from '@/components/v4/Button'
import ArrowLink from '@/components/v4/ArrowLink'
import RunLight from '@/components/v4/RunLight'
import RunBrief from '@/components/v4/RunBrief'
import RunAnswer from '@/components/v4/RunAnswer'
import RunFit from '@/components/v4/RunFit'
import RunPlan from '@/components/v4/RunPlan'
import ServicePoster from '@/components/v4/ServicePoster'
import Invitation from '@/components/v4/Invitation'
import { SCENE } from '@/components/v4/ServiceScene'
import { RUN_DECK, SERVICE_PAGES, getServicePage } from '@/lib/service-pages'
import { CALENDLY_URL, SITE_URL } from '@/lib/site'
import '../scenes.css'
import '../run.css'

/**
 * THE SERVICE PAGE TEMPLATE — THE RUN. One component, six instances
 * (docs/site-architecture.md §2a; data in src/lib/service-pages.ts).
 *
 * REDESIGNED 2026-09-17 (docs/prompts/service-template-redesign.md; the
 * user on the template it replaces — the plate, the window, the paper
 * burial, "everything connects to everything": poorly driven, poorly
 * implemented, poorly designed — "do not rescue it. Keep its content
 * and its SEO skeleton, nothing else"; the storyboard was approved the
 * same day: "perfect"). ServiceStage.tsx, ServiceProcess.tsx and
 * service.css are PARKED, unimported.
 *
 * THE IDEA. The hub's hero is an agent taking a brief and building the
 * page. A service page is the next chapter: THE BRIEF HAS BEEN
 * ACCEPTED, AND THE JOB RUNS AS YOU SCROLL — the scroll is the agent's
 * clock. Five chapters, five different scroll mechanics, and every
 * readout on screen is a true fact from this page's data:
 *
 *   1  THE BRIEF      RunBrief     a load pass — Kona's marquee renders
 *                                  the outlined h1 to ink; the tagline is
 *                                  the agent's comment; the hub's scene,
 *                                  enlarged, is the artboard
 *   2  THE ANSWER     RunAnswer    pinned — a read-head fills the prose
 *                                  and PLUCKS the phrases that carry the
 *                                  numbers; each fact LANDS as a plate (the
 *                                  studio's work on a screen) on a stack,
 *                                  and its number computes on the picture
 *   3  THE FIT        RunFit       one stage: "what it is" on paper beside
 *                                  a small framed noir plate; the agent
 *                                  drags the frame to FULL BLEED and the
 *                                  picture is the void "when it is the
 *                                  wrong choice" and the close stand on
 *   4  THE PLAN       RunPlan      pinned, horizontal — a week ruler from
 *                                  `weeks`, a playhead, bars that tick
 *                                  pending → running → done, the cards on
 *                                  a fanned rail, give/get as an exchange
 *   5  THE HANDOVER   RunHandover  the void — the light pools under the
 *                                  nearer CTA; the receipt; the links out
 *
 * IMAGERY (the user, after the first cut, which had none: "we have
 * abandoned imagery completely and I don't like it… purposeful imagery,
 * incorporated on scroll"). Two kinds, both data: `deck` — the studio's
 * own work on screens, the plates the facts land on — and `plate.image`
 * — one noir plate a service, the fit's window and then its ground. All
 * STAND-INS from the site's pool, shown mono.
 *
 * and two things that run the whole page (RunLight): THE LIGHT — the
 * ground is a fixed layer of moving light from the neutral ramp, its
 * core aimed at whatever is working — and THE RUN BAR, five anchors
 * that tick as the chapters are read.
 *
 * THE ORDER IS THE ORDER A CRAWLER AND A LANGUAGE MODEL READ IN, and it
 * is fixed (§2a):
 *
 *   1  h1 with the primary keyword — the display word plus the modifier,
 *      both inside the one <h1>, as clean text
 *   2  the direct answer — what, for whom, from-price, timeline in the
 *      first hundred words; the three facts repeat the numbers for the eye
 *   3  what it is / when it is the wrong choice
 *   4  process
 *   5  the two CTAs — Contact and Book
 *   6  the up-link to /services and the one link to the sister page
 *
 * LOCKED 2026-09-08 (user): no proof section and no "what changes the
 * price" section — after the process comes the CTA.
 *
 * SERVER-RENDERED, every word in the raw HTML (SEO plan D5). The five
 * chapters are client components, which Next still renders on the
 * server; nothing is injected. Each parks its hidden states under a
 * class only its own driver sets (`is-live`), so no JS and reduced
 * motion read the finished page; the hero's parked states are lifted by
 * the noscript rule below.
 *
 * PLACEHOLDER COPY written for this template (checklist 6.6): the run
 * bar's five labels, "Brief received / accepted", "How it goes", "You
 * give / You get", "n steps · week x of y", "Move to weigh it again",
 * the receipt's "Steps, planned", and the facts' `cue` phrases.
 *
 * NOT INDEXED YET. The route is reachable in development only
 * (KONA_OPEN_ROUTES in .env.local lifts the launch redirect for /services);
 * production still redirects home until the real copy exists.
 * Flip INDEXABLE, drop the redirect and list the pages in sitemap.ts in the
 * same commit.
 */
const INDEXABLE = false

/** the run's five chapters: the bar's anchors (PLACEHOLDER labels) */
const CHAPTERS = [
  { id: 'brief', label: 'Brief' },
  { id: 'answer', label: 'Answer' },
  { id: 'fit', label: 'Fit' },
  { id: 'plan', label: 'Plan' },
  { id: 'start', label: 'Start' },
] as const

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

/** THE POSTER's object per service, and the noir grade it takes
 *  (ServicePoster.tsx, run.css `.pst-obj--*`) */
const POSTER: Record<string, { src: string; grade: 'none' | 'chrome' | 'glass' }> = {
  'web-design': { src: '/services/web-design/main.webp', grade: 'none' },
  'web-development': { src: '/services/3d-websites/glass-screen.webp', grade: 'glass' },
  '3d-websites': { src: '/services/3d-websites/knot.webp', grade: 'chrome' },
  'one-page-websites': { src: '/services/one-page-art/mockup.webp', grade: 'none' },
  'website-redesign': { src: '/services/redesign-art/arrow.webp', grade: 'chrome' },
  seo: { src: '/services/seo-art/sphere.webp', grade: 'chrome' },
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

  const cta = (
    <>
      <Button href="/contact" hoverLabel="Say hello">
        Start a project
      </Button>
      <Button href={CALENDLY_URL} external ghost hoverLabel="Pick a time">
        Book a call
      </Button>
    </>
  )

  return (
    <article className="sr" style={{ '--sr-word': `${page.wordSize}rem` } as React.CSSProperties}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* the hero parks its entrance (run.css .rb-ent, the outlined word);
          the no-JS page undoes it. Everything else hides only under a
          class its own driver sets. */}
      <noscript>
        <style>{`.rb-ent{opacity:1!important;transform:none!important}.rb-word{--rb-x:300rem!important;-webkit-text-stroke-color:transparent!important}.rb-sel,.k-agent{display:none!important}.rn{opacity:1!important;transform:translateX(-50%)!important}`}</style>
      </noscript>

      {/* 1 — THE BRIEF: the h1, the tagline, the two CTAs */}
      <RunBrief name={page.name} word={page.word} modifier={page.modifier} tagline={page.tagline} scene={SCENE[page.slug] ?? 'design'}>
        {cta}
      </RunBrief>

      {/* 2 + 3 — THE ANSWER and THE FIT share ONE GROUND: the user's
          aerial crowd, sticky behind both (run.css .rs-ground); the plan
          then scrolls over it */}
      <div className="rs-ground">
        <div className="rs-bg" aria-hidden="true">
          <img
            src="/services/walking-1400.webp"
            srcSet="/services/walking-700.webp 700w, /services/walking-1000.webp 1000w, /services/walking-1400.webp 1400w"
            sizes="100vw"
            alt=""
            width={1086}
            height={1448}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>

      {/* 2 — THE ANSWER: the direct answer; the three facts, a plate each */}
      <RunAnswer
        answer={page.answer}
        facts={page.facts.map((f, i) => ({ value: f.value, label: f.label, cue: f.cue, plate: (page.deck ?? RUN_DECK)[i] }))}
      />

      {/* 3 — THE FIT: what it is, when it is the wrong choice */}
      <RunFit
        headline={page.plate.headline}
        beats={page.plate.beats}
        close={page.plate.close}
        image={page.plate.image}
        alt={page.plate.alt}
      />
      </div>

      {/* THE POSTER (2026-09-19): the interlude between the fit and the
          plan — the tagline at poster scale, cut by the service's object.
          Not a chapter: RunLight's rail does not count it. */}
      {POSTER[page.slug] && (
        <ServicePoster tagline={page.tagline} object={POSTER[page.slug].src} grade={POSTER[page.slug].grade} />
      )}

      {/* 4 — THE PLAN: the process */}
      <RunPlan steps={page.process} />

      {/* 5 — THE CTA: the site's Invitation (2026-09-18, user: "replace
          the cta with the new one we built"). THE HANDOVER it replaces
          (RunHandover.tsx — the void, the light pooling under the
          receipt) is parked, unimported, with its rules in run.css; the
          service's own `invite` line and the receipt go with it. */}
      <Invitation />

      {/* 6 — the up-link and the sister service */}
      <nav className="rs-foot" aria-label="Related">
        <ArrowLink href="/services">All services</ArrowLink>
        {page.sister && (
          <p className="rs-sister">
            {page.sister.line}{' '}
            <a href={`/services/${page.sister.slug}`}>{page.sister.name}</a>
          </p>
        )}
      </nav>

      {/* THE LIGHT and THE RUN BAR — both fixed, so they sit LAST in the
          source: nothing stands between a crawler and the h1 */}
      <RunLight chapters={CHAPTERS} />
    </article>
  )
}
