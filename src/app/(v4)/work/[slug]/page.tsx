import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CaseTrack from '@/components/v4/CaseTrack'
import Button from '@/components/v4/Button'
import ArrowLink from '@/components/v4/ArrowLink'
import { CASE_STUDIES, getCaseStudy, type CaseBlock } from '@/lib/case-studies'
import { WORK_PROJECTS } from '@/lib/work-projects'
import { CALENDLY_URL, CONTACT_EMAIL, SITE_URL } from '@/lib/site'
import './travel.css'

/**
 * THE CASE STUDY — /work/[slug]. SECOND BUILD, 2026-09-18 (user: "poor
 * designed, low on imagery and video, but good on text content… a
 * complete redesign… maybe full horizontal… imagery and video focused…
 * one viewport can be one video in a big container, one can be a nice
 * layout… a bit of editorial design layout with agentic. No numbering,
 * no hairlines, no eyebrows"). The first build (2026-09-12: a dark
 * article with a pinned index on a mesh-gradient ground) is parked:
 * CaseMotion.tsx, CaseMesh.tsx, case.css — unimported.
 *
 * THE TRAVEL. The page is one horizontal run of SPREADS on a pinned
 * stage, driven by the ordinary vertical scroll (CaseTrack.tsx has the
 * how). The words are the first build's, untouched — the six blocks of
 * site-architecture §3 in the same order — but every block is now laid
 * out as a spread WITH PICTURES, and the project's captures are dealt
 * through the run so no spread is bare:
 *
 *   THE COVER     paper — the name, huge, set across the edge of a big
 *                 window that cuts through the site's captures (the
 *                 hub's reel, this project alone); the facts as plain
 *                 lines; Visit
 *   THE OPENING   paper — the lede in display type, the second paragraph
 *                 beside it, the laptop render floating at two rates
 *   THE FILM      void — one viewport, one video, in one big container
 *   A CHAPTER     paper — the title in display type, its paragraphs as
 *                 staggered columns, a tall plate; then its blocks:
 *     cards       picture tiles on a stair
 *     quote       a void page: the line in display type over a capture
 *     images      big plates, the second dropped and smaller
 *     steps       THE NOTES — the agent's cursor walks the decisions as
 *                 the spread crosses the screen, and the plate beside
 *                 them cuts to each one's picture (a hand on a note
 *                 takes over)
 *     list        plain lines in columns
 *   THE RESULT    void — block 5 (required), the two CTAs, block 6's links
 *   THE NEXT      the next project's plate, its name across the edge
 *
 * THE ISLAND floats at the foot of the stage: a progress ring, the
 * chapter on show, the index, the live site.
 *
 * SERVER-RENDERED, every word in the raw HTML in reading order (SEO plan
 * D5); phones, reduced motion and no JS get the same DOM in flow. NOT
 * INDEXED YET — KONA_OPEN_ROUTES=/work lifts the launch redirect locally.
 * Flip INDEXABLE and list the studies in sitemap.ts in the same commit.
 */
const INDEXABLE = false

export const dynamicParams = false

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const study = getCaseStudy(slug)
  if (!study) return {}
  const url = `${SITE_URL}/work/${study.slug}`
  return {
    title: study.title,
    description: study.description,
    alternates: { canonical: url },
    robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title: `${study.title} | Konaverse`,
      description: study.description,
      url,
      type: 'article',
      images: [{ url: `${SITE_URL}${study.still.src}`, width: 1900, height: 1000 }],
    },
  }
}

/** a picture in a window: the print slides inside it (CaseTrack), the
 *  window leans with the run's speed and wipes open on arrival */
function Plate({
  src,
  alt = '',
  shape,
  caption,
  at,
  eager,
}: {
  src: string
  alt?: string
  /** wide 19:10 by the stage's height · tall crop · tile · small */
  shape: 'wide' | 'tall' | 'tile' | 'small'
  caption?: string
  /** where the crop looks, for the tall and tile crops */
  at?: string
  eager?: boolean
}) {
  return (
    <figure className={`cx-plate cx-plate-${shape} cx-r`}>
      <span className="cx-win">
        <span className="cx-print">
          <img
            src={src}
            alt={alt}
            width={1900}
            height={1000}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
            style={at ? { objectPosition: at } : undefined}
          />
        </span>
      </span>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}

/** where the crops look, dealt in turn — so two tiles of one capture differ */
const LOOKS = ['18% 30%', '78% 40%', '50% 12%', '30% 80%', '85% 70%', '10% 55%']

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const study = getCaseStudy(slug)
  if (!study) notFound()

  const url = `${SITE_URL}/work/${study.slug}`

  /* the next project: the study's own pick, else the roster's next */
  const rosterIdx = WORK_PROJECTS.findIndex((p) => p.slug === study.slug)
  const nextSlug = study.next ?? WORK_PROJECTS[(rosterIdx + 1) % WORK_PROJECTS.length]?.slug
  const next = WORK_PROJECTS.find((p) => p.slug === nextSlug) ?? null
  const nextHref = next && getCaseStudy(next.slug) ? `/work/${next.slug}` : '/work'

  /* THE PICTURES: the project's captures, dealt through the run in turn */
  const project = WORK_PROJECTS.find((p) => p.slug === study.slug)
  const frames = project?.frames?.length ? project.frames : [study.still.src]
  let dealt = 0
  const deal = () => frames[++dealt % frames.length]
  let looked = 0
  const look = () => LOOKS[looked++ % LOOKS.length]

  /* the name, in lines: the last word alone when there are three or more */
  const words = study.name.split(' ')
  const nameLines = words.length >= 3 ? [words.slice(0, -1).join(' '), words[words.length - 1]] : words

  const chapters = [
    { id: 'opening', title: 'Opening' },
    ...(study.reel ? [{ id: 'film', title: 'The film' }] : []),
    ...study.sections.map((s) => ({ id: s.id, title: s.title })),
    { id: 'result', title: 'Result' },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Work', item: `${SITE_URL}/work` },
          { '@type': 'ListItem', position: 3, name: study.name, item: url },
        ],
      },
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: study.name,
        description: study.description,
        url,
        image: `${SITE_URL}${study.still.src}`,
        author: { '@id': `${SITE_URL}/#organization` },
        publisher: { '@id': `${SITE_URL}/#organization` },
        isPartOf: { '@id': `${SITE_URL}/#website` },
        ...(study.live ? { about: { '@type': 'WebSite', name: study.name, url: study.live } } : {}),
      },
    ],
  }

  /** one block of a chapter, as a spread */
  const spread = (block: CaseBlock, key: string) => {
    switch (block.kind) {
      case 'text':
        return null // a chapter's text is its opening spread (below)
      case 'cards':
        return (
          <div key={key} className="cx-s cx-cards">
            <ul className="cx-cards-row">
              {block.items.map((c, j) => (
                <li key={c.title} className="cx-card" data-rate={[0.05, -0.03, 0.06][j % 3]}>
                  <Plate src={deal()} shape="tile" at={look()} />
                  <div className="cx-r" style={{ '--d': `${0.08 + j * 0.06}s` } as React.CSSProperties}>
                    <h3 className="cx-card-t">{c.title}</h3>
                    <p className="cx-card-b">{c.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )
      case 'quote':
        return (
          <div key={key} className="cx-s cx-quote k-dark">
            <span className="cx-quote-bg" aria-hidden="true">
              <span className="cx-print">
                <img src={deal()} alt="" width={1900} height={1000} loading="lazy" decoding="async" draggable={false} />
              </span>
            </span>
            <blockquote className="cx-quote-in cx-r" data-rate="-0.06">
              <p>“{block.text}”</p>
              <footer>
                {block.who}
                {block.role ? <span>, {block.role}</span> : null}
              </footer>
            </blockquote>
          </div>
        )
      case 'images':
        return (
          <div key={key} className="cx-s cx-figs">
            {block.items.map((im, j) => (
              <Plate key={im.src + j} src={im.src} alt={im.alt} caption={im.caption} shape={j === 0 ? 'wide' : 'small'} />
            ))}
          </div>
        )
      case 'steps': {
        const pics = block.items.map(() => deal())
        return (
          <div key={key} className="cx-s cx-notes">
            <figure className="cx-plate cx-plate-wide cx-notes-plate cx-r" aria-hidden="true">
              <span className="cx-win">
                <span className="cx-print">
                  {pics.map((src, j) => (
                    <img key={src + j} className={`cx-notes-f${j === 0 ? ' is-on' : ''}`} src={src} alt="" width={1900} height={1000} loading="lazy" decoding="async" draggable={false} />
                  ))}
                </span>
              </span>
            </figure>
            <div className="cx-notes-side">
              <i className="cx-agent" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 2.5 L17 9.2 L10.6 11 L8.4 17.5 Z" />
                </svg>
                <b>Kona</b>
              </i>
              <ol className="cx-notes-list">
                {block.items.map((s, j) => (
                  <li key={s.title} className={`cx-note${j === 0 ? ' is-on' : ''}`}>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )
      }
      case 'list':
        return (
          <div key={key} className="cx-s cx-list">
            <ul className="cx-list-in">
              {block.items.map((it, j) => (
                <li key={it} className="cx-r" style={{ '--d': `${j * 0.04}s` } as React.CSSProperties}>
                  {it}
                </li>
              ))}
            </ul>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <CaseTrack chapters={chapters} live={study.live}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* arrivals wait hidden under .is-live only, so the no-JS page needs no undo */}

      {/* THE COVER */}
      <header className="cx-s cx-cover" id="opening">
        <div className="cx-cover-side">
          <ul className="cx-facts cx-r" style={{ '--d': '0.5s' } as React.CSSProperties}>
            {study.facts.map((f) => (
              <li key={f.label}>
                <span className="sr-only">{f.label}: </span>
                {f.value}
              </li>
            ))}
          </ul>
          {study.live ? (
            <div className="cx-cover-act cx-r" style={{ '--d': '0.62s' } as React.CSSProperties}>
              <Button href={study.live} external hoverLabel="Open it">
                Visit site
              </Button>
            </div>
          ) : null}
        </div>
        <figure className="cx-plate cx-plate-cover cx-r" style={{ '--d': '0.2s' } as React.CSSProperties}>
          <span className="cx-win">
            <span className="cx-print cx-reel">
              {frames.slice(0, 8).map((src, j) => (
                <img
                  key={src}
                  className={j === 0 ? 'is-on' : ''}
                  src={src}
                  alt={j === 0 ? study.still.alt : ''}
                  width={1900}
                  height={1000}
                  fetchPriority={j === 0 ? 'high' : undefined}
                  loading={j < 2 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable={false}
                />
              ))}
            </span>
          </span>
        </figure>
        <h1 className="cx-h1 cx-r" data-rate="-0.12">
          {nameLines.map((ln, i) => (
            <span key={ln + i} className="cx-mask">
              <span className="cx-ln" style={{ '--d': `${0.1 + i * 0.1}s` } as React.CSSProperties}>
                {ln}
                {i < nameLines.length - 1 ? ' ' : ''}
              </span>
            </span>
          ))}
        </h1>
      </header>

      {/* THE OPENING — block 1's first half */}
      <section className="cx-s cx-open" aria-label="Opening">
        <div className="cx-open-text">
          <p className="cx-lede cx-r">{study.intro[0]}</p>
          {study.intro.slice(1).map((p, j) => (
            <p key={p.slice(0, 32)} className="cx-open-p cx-r" style={{ '--d': `${0.12 + j * 0.08}s` } as React.CSSProperties}>
              {p}
            </p>
          ))}
        </div>
        <div className="cx-device" aria-hidden={false}>
          {study.device.back ? (
            <img className="cx-device-back" data-rate="0.16" src={study.device.back} alt="" loading="lazy" decoding="async" draggable={false} aria-hidden="true" />
          ) : null}
          <img className="cx-device-front" data-rate="-0.08" src={study.device.front} alt={`${study.name} — the website on a laptop`} loading="lazy" decoding="async" draggable={false} />
        </div>
      </section>

      {/* THE FILM — one viewport, one video */}
      {study.reel ? (
        <section className="cx-s cx-film k-dark" id="film" aria-label="The film">
          <figure className="cx-film-fig cx-r">
            <span className="cx-win">
              <video autoPlay muted loop playsInline preload="metadata" poster={study.reel.poster} aria-label={`${study.name} — a screen recording of the live site`}>
                {study.reel.webm ? <source src={study.reel.webm} type="video/webm" /> : null}
                <source src={study.reel.mp4} type="video/mp4" />
              </video>
            </span>
            <figcaption>The live site, under a real scroll</figcaption>
          </figure>
        </section>
      ) : null}

      {/* THE CHAPTERS — the six blocks, each a run of spreads */}
      {study.sections.map((s) => {
        const paragraphs = s.blocks.flatMap((b) => (b.kind === 'text' ? b.paragraphs : []))
        return (
          <section key={s.id} id={s.id} className="cx-ch" aria-labelledby={`${s.id}-h`}>
            <div className="cx-s cx-text">
              <div className="cx-text-main">
              <h2 className="cx-h2 cx-r" id={`${s.id}-h`} data-rate="-0.1">
                <span className="cx-mask">
                  <span className="cx-ln">{s.title}</span>
                </span>
              </h2>
              <div className="cx-cols">
                {paragraphs.map((p, j) => (
                  <p key={p.slice(0, 32)} className="cx-r" style={{ '--d': `${0.1 + j * 0.08}s` } as React.CSSProperties}>
                    {p}
                  </p>
                ))}
              </div>
              </div>
              <Plate src={deal()} shape="tall" at={look()} />
            </div>
            {s.blocks.map((b, i) => spread(b, s.id + b.kind + i))}
          </section>
        )
      })}

      {/* THE END TITLE (2026-09-19, user: "more sections like this" — the
          About page's words and the rose — "go for the titles"). The cover
          says the name THIN over the film; this card says it once more,
          HEAVY, on the void, cut by the project's own laptop — the title
          card a film lands on before its credits. It is on the VOID
          because the laptops are silver: on paper silver is mid-grey,
          exactly where a difference blend loses its letters; on the void
          silver is the light thing, so the name is white on the dark and
          turns dark where it crosses the machine. The render is taken to
          monochrome here so the inversion stays in the noir register —
          the project's colour is everywhere else on the page.
          THE VERB is the track's own: the name's lines carry opposite
          `data-rate`s, so as the card crosses the screen they pass each
          other over the laptop, which slides at a third rate (CaseTrack's
          DEPTH — no new driver). Decoration: the name is already the h1. */}
      <section className="cx-s cx-title k-dark" aria-hidden="true">
        <img
          className="cx-title-dev"
          data-rate="0.1"
          src={study.device.front}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
        />
        <p className="cx-title-t">
          {nameLines.map((ln, i) => (
            <span key={ln + i} className="cx-title-ln" data-rate={i % 2 ? '0.24' : '-0.24'}>
              {ln}
            </span>
          ))}
        </p>
      </section>

      {/* THE RESULT — block 5 (required), the invitation, block 6 */}
      <section className="cx-s cx-result k-dark" id="result" aria-labelledby="result-h">
        <span className="cx-quote-bg" aria-hidden="true">
          <span className="cx-print">
            <img src={study.still.src} alt="" width={1900} height={1000} loading="lazy" decoding="async" draggable={false} />
          </span>
        </span>
        <div className="cx-result-in">
          <h2 className="cx-h2 cx-r" id="result-h">
            <span className="cx-mask">
              <span className="cx-ln">Result</span>
            </span>
          </h2>
          {study.result.stats?.length ? (
            <ul className="cx-stats">
              {study.result.stats.map((st, j) => (
                <li key={st.label} className="cx-r" style={{ '--d': `${0.1 + j * 0.07}s` } as React.CSSProperties}>
                  <span className="cx-stat-v">{st.value}</span>
                  <span className="cx-stat-l">{st.label}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <p className="cx-result-t cx-r" style={{ '--d': '0.14s' } as React.CSSProperties}>
            {study.result.text}
          </p>
        </div>
        <div className="cx-invite cx-r" style={{ '--d': '0.2s' } as React.CSSProperties}>
          <h2 className="cx-invite-h">Have a project like this one?</h2>
          <div className="cx-invite-act">
            <Button href="/contact" hoverLabel="Say hello">
              Contact us
            </Button>
            <Button href={CALENDLY_URL} external ghost hoverLabel="Pick a time">
              Book a call
            </Button>
          </div>
          <a className="cx-mail" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          <nav className="cx-links" aria-label="Related">
            <ArrowLink href="/work">All work</ArrowLink>
            <ArrowLink href={`/services/${study.service.slug}`}>{study.service.name}</ArrowLink>
          </nav>
        </div>
      </section>

      {/* THE NEXT */}
      {next ? (
        <a className="cx-s cx-next" href={nextHref} aria-label={`Next project: ${next.name}`}>
          <figure className="cx-plate cx-plate-wide cx-r" aria-hidden="true">
            <span className="cx-win">
              <span className="cx-print">
                <img src={next.image} alt="" width={1900} height={1000} loading="lazy" decoding="async" draggable={false} />
              </span>
            </span>
          </figure>
          <p className="cx-next-n cx-r" data-rate="-0.1" aria-hidden="true">
            <span className="cx-mask">
              <span className="cx-ln">{next.name}</span>
            </span>
          </p>
          <p className="cx-next-line cx-r" aria-hidden="true">
            {next.line}
            <span className="cx-next-go">
              Next project
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M2 8 L13 8" />
                <path d="M9 4.5 L13 8 L9 11.5" />
              </svg>
            </span>
          </p>
        </a>
      ) : null}
    </CaseTrack>
  )
}
