import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Button from '@/components/v4/Button'
import ArrowLink from '@/components/v4/ArrowLink'
import RunLight from '@/components/v4/RunLight'
import RunHero from '@/components/v4/RunHero'
import RunGround from '@/components/v4/RunGround'
import RunAnswer from '@/components/v4/RunAnswer'
import RunTrack from '@/components/v4/RunTrack'
import ServicePoster from '@/components/v4/ServicePoster'
import { RunKind, RunFix, RunWork, RunGets, type RunWorkItem } from '@/components/v4/RunMore'
import Invitation from '@/components/v4/Invitation'
import { RUN_DECK, SERVICE_PAGES, getServicePage } from '@/lib/service-pages'
import { CALENDLY_URL, OG_DEFAULTS, SITE_URL } from '@/lib/site'
import { CASE_STUDIES } from '@/lib/case-studies'
import { BLOG_POSTS } from '@/lib/blog-posts'
import { WORK_PROJECTS } from '@/lib/work-projects'
import '../scenes.css'
import '../run.css'
import '../more.css'

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
 *   (1 was replaced 2026-09-30 by RunHero — THE SUNBURST: a big word
 *   behind, a ring of rays, the h1 on top in difference, two CTAs; still.
 *   RunBrief is parked. The rest of this note is the run as designed.)
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
 * price" section — after the process comes the CTA. REOPENED 2026-10-02
 * (owner: "we've stripped a lot… no problem solving, problem-focused
 * content"): a page with `more` (service-pages.ts) carries THE
 * SUBSTANCE (RunMore.tsx, more.css), all in flow — after the statement
 * THE FIT (what it is / when it is the wrong choice, from `plate`) and
 * THE PROBLEMS; after the poster THE WORK (its case studies) and WHAT
 * YOU GET; then the process and the CTA. Web design first.
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
 * INDEXED since 2026-10-02 (SEO plan v3 launch gate); sitemap.ts lists
 * every slug from SERVICE_PAGES.
 */
/** THE RUN BAR's anchors, in page order — every section on the page
 *  (2026-10-02, owner: "fix the floating navbar to include every
 *  section"). The substance's four come only with `more` (THE WORK only
 *  when the page names studies); "Start" is the Invitation (#contact) —
 *  it pointed at the parked handover's #start and went nowhere. The
 *  poster is an interlude, not a chapter. */
const chaptersFor = (more: boolean, work: boolean) => [
  { id: 'brief', label: 'Brief' },
  { id: 'answer', label: 'Answer' },
  ...(more ? [{ id: 'fit', label: 'Fit' }, { id: 'fixes', label: 'Fixes' }] : []),
  ...(more && work ? [{ id: 'work', label: 'Work' }] : []),
  ...(more ? [{ id: 'gets', label: 'You get' }] : []),
  { id: 'plan', label: 'Plan' },
  { id: 'contact', label: 'Start' },
]

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
    openGraph: {
      ...OG_DEFAULTS,
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
  'web-design': { src: '/services/web-design/web-design-floating.webp', grade: 'none' },
  'web-development': { src: '/services/web-dev/web-dev-floating.webp', grade: 'none' },
  '3d-websites': { src: '/services/3d-websites/3d-design-floating.webp', grade: 'none' },
  'one-page-websites': { src: '/services/one-page-art/one-page-floating.webp', grade: 'none' },
  'website-redesign': { src: '/services/redesign-art/website-redesign-floating.webp', grade: 'none' },
  seo: { src: '/services/seo-art/seo-floating.webp', grade: 'none' },
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
        /* a STARTING price, so minPrice (not price); SEO is a monthly
           retainer, so its unit says so (SEO plan v3 §3) */
        offers: {
          '@type': 'Offer',
          priceCurrency: 'EUR',
          priceSpecification: {
            '@type': page.slug === 'seo' ? 'UnitPriceSpecification' : 'PriceSpecification',
            minPrice: page.fromPrice,
            priceCurrency: 'EUR',
            ...(page.slug === 'seo' ? { unitText: 'MONTH' } : {}),
          },
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

  /* THE WORK: the case studies the page names, with their captures */
  const work: RunWorkItem[] = (page.more?.work ?? []).flatMap((w) => {
    const study = CASE_STUDIES.find((c) => c.slug === w.slug)
    const project = WORK_PROJECTS.find((p) => p.slug === w.slug)
    if (!study || !project) return []
    const sector = study.facts.find((f) => f.label === 'Sector')?.value
    return [
      {
        slug: w.slug,
        name: study.name,
        meta: [sector, project.year].filter(Boolean).join(' · '),
        line: w.line,
        desk: project.frames?.[0] ?? study.still.src,
        phone: project.phones?.[0],
      },
    ]
  })

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
      {/* the hero is still and parks nothing; the run bar waits for JS and
          the no-JS page shows it. Everything else hides only under a
          class its own driver sets. */}
      <noscript>
        <style>{`.rn{opacity:1!important;transform:translateX(-50%)!important}`}</style>
      </noscript>

      {/* ONE GROUND under the whole page (2026-09-30, RunGround: the
          paper and the hover dots — the poster and the process card carry
          their own dots layer, placed by the same driver) */}
      <RunGround>
        {/* 1 — THE HERO (THE SUNBURST): the big word, the rays, the h1
            over them, the two CTAs. RunBrief.tsx is parked. */}
        <RunHero name={page.name} word={page.word} modifier={page.modifier} back={page.back}>
          {cta}
        </RunHero>

        {/* 2 — THE STATEMENT: the direct answer's first paragraph (the
            second is cut from the page, 2026-09-30); the three facts as
            cards in a row */}
        <RunAnswer
          label="The short answer"
          answer={page.answer[0]}
          facts={page.facts.map((f, i) => ({ value: f.value, label: f.label, cue: f.cue, plate: (page.deck ?? RUN_DECK)[i] }))}
        />

      {/* THE FIT (what it is / when it is the wrong choice) was CUT from
          the page 2026-09-30 by the owner; RunFit.tsx and its crowd ground
          (.rs-ground) are parked. It is BACK, in flow, on a page with
          `more` (2026-10-02): RunKind, then the problems it fixes. */}
      {page.more && (
        <>
          <RunKind headline={page.plate.headline} beats={page.plate.beats} image={page.plate.image} alt={page.plate.alt} pictures={page.more.kindPictures} />
          <RunFix title={page.more.fixTitle} problems={page.more.problems} />
        </>
      )}

      {/* THE POSTER (2026-09-19): the interlude between the fit and the
          plan — the tagline at poster scale, cut by the service's object.
          Not a chapter: RunLight's rail does not count it. */}
      {POSTER[page.slug] && (
        <ServicePoster tagline={page.tagline} object={POSTER[page.slug].src} grade={POSTER[page.slug].grade} />
      )}

      {/* THE WORK and WHAT YOU GET (2026-10-02), before the process */}
      {page.more && work.length > 0 && <RunWork title={page.more.workTitle} items={work} />}
      {page.more && <RunGets title={page.more.getsTitle} gets={page.more.gets} />}

      {/* 4 — THE PLAN: the process */}
      <RunTrack steps={page.process} />

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
        {/* the link back to the article this service is the subject of
            (blog plan §5: the piece links here once, the page links back) */}
        {BLOG_POSTS.filter((p) => p.service.slug === page.slug).map((p) => (
          <p key={p.slug} className="rs-sister">
            From the blog: <a href={`/blog/${p.slug}`}>{p.title}</a>
          </p>
        ))}
      </nav>
      </RunGround>

      {/* THE LIGHT and THE RUN BAR — both fixed, so they sit LAST in the
          source: nothing stands between a crawler and the h1 */}
      <RunLight chapters={chaptersFor(!!page.more, work.length > 0)} />
    </article>
  )
}
