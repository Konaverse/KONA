import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CaseMotion from '@/components/v4/CaseMotion'
import Button from '@/components/v4/Button'
import ArrowLink from '@/components/v4/ArrowLink'
import Reveal from '@/components/v4/Reveal'
import { CASE_STUDIES, getCaseStudy, type CaseBlock } from '@/lib/case-studies'
import { WORK_PROJECTS } from '@/lib/work-projects'
import { CALENDLY_URL, CONTACT_EMAIL, SITE_URL } from '@/lib/site'
import './case.css'

/**
 * THE CASE STUDY — /work/[slug] (2026-09-12, the user's wireframe "Case
 * Study.png", elevated: "more sections, more elements, nice clean
 * motion; in the pinned section try different things — text with cards,
 * a quote; it needs to read as a nice article").
 *
 * The page is an article on the void with a pinned index. In order:
 *
 *   §1 THE HERO — the project's name, the two paragraphs (block 1's
 *      first half), the facts on a hairline, the still with Visit under it
 *   §2 THE DEVICE — the laptop render on a glow
 *   §3 THE RECORDING — the live site under a real wheel, full width
 *   §4 THE ARTICLE — the index at the left follows the reading; the
 *      sections at the right are the six blocks of site-architecture §3
 *      (data: src/lib/case-studies.ts); the RESULT closes it (block 5,
 *      required)
 *   §5 THE FOOT — the next project, the two CTAs, all work + the service
 *      page (block 6)
 *
 * SERVER-RENDERED, every word in the raw HTML (SEO plan D5): the article,
 * the index, the facts, the captions. The motion (CaseMotion.tsx) is an
 * enhancement; the recording has a poster and the page stands without JS.
 *
 * NOT INDEXED YET — KONA_OPEN_ROUTES=/work lifts the launch redirect
 * locally (the sub-path rule covers /work/[slug]). Flip INDEXABLE, list
 * the studies in sitemap.ts, in the same commit.
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

/** one block of the article, by kind */
function Block({ block, i }: { block: CaseBlock; i: number }) {
  switch (block.kind) {
    case 'text':
      return (
        <Reveal className="cs-block cs-text" index={0}>
          {block.paragraphs.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
        </Reveal>
      )
    case 'cards':
      return (
        <ul className="cs-cards">
          {block.items.map((c, j) => (
            <li key={c.title}>
              <Reveal className="cs-card" index={j}>
                <h3 className="cs-card-t">{c.title}</h3>
                <p className="cs-card-b">{c.body}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      )
    case 'quote':
      return (
        <Reveal className="cs-block">
          <blockquote className="cs-quote">
            <p>“{block.text}”</p>
            <footer>
              {block.who}
              {block.role ? <span> · {block.role}</span> : null}
            </footer>
          </blockquote>
        </Reveal>
      )
    case 'images':
      return (
        <div className={`cs-figs${block.items.length > 1 ? ' cs-figs-2' : ''}`}>
          {block.items.map((im, j) => (
            <Reveal key={im.src + j} index={j}>
              <figure className="cs-fig">
                <div className="cs-fig-win">
                  <img src={im.src} alt={im.alt} width={1900} height={1000} loading="lazy" decoding="async" draggable={false} />
                </div>
                {im.caption ? <figcaption>{im.caption}</figcaption> : null}
              </figure>
            </Reveal>
          ))}
        </div>
      )
    case 'steps':
      return (
        <Reveal as="div" className="cs-block" index={i > 0 ? 1 : 0}>
          <ol className="cs-steps">
            {block.items.map((s) => (
              <li key={s.title} className="cs-step">
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      )
    case 'list':
      return (
        <Reveal as="div" className="cs-block" index={i > 0 ? 1 : 0}>
          <ul className="cs-list">
            {block.items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        </Reveal>
      )
    default:
      return null
  }
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const study = getCaseStudy(slug)
  if (!study) notFound()

  const url = `${SITE_URL}/work/${study.slug}`

  /* the next project: the study's own pick, else the roster's next; the
     link goes to its case study when that exists, else to the hub */
  const rosterIdx = WORK_PROJECTS.findIndex((p) => p.slug === study.slug)
  const nextSlug = study.next ?? WORK_PROJECTS[(rosterIdx + 1) % WORK_PROJECTS.length]?.slug
  const next = WORK_PROJECTS.find((p) => p.slug === nextSlug) ?? null
  const nextHref = next && getCaseStudy(next.slug) ? `/work/${next.slug}` : '/work'

  /* the hero still is a REEL of the project's stills (the hub's frames),
     cut at five a second; the first frame is the still itself */
  const project = WORK_PROJECTS.find((p) => p.slug === study.slug)
  const frames = project?.frames?.length ? project.frames : [study.still.src]

  const index = [...study.sections.map((s) => ({ id: s.id, title: s.title })), { id: 'result', title: 'Result' }]

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

  return (
    <CaseMotion>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* the entrance parks the hero; the no-JS page undoes it */}
      <noscript>
        <style>{`.cs-ent,.cs-ln{opacity:1!important;transform:none!important}`}</style>
      </noscript>

      {/* §1 — THE HERO */}
      <header className="cs-hero">
        <div className="cs-glow" aria-hidden="true">
          <i className="cs-blob" data-drift="0.12" style={{ '--w': '96rem', '--h': '40rem', '--a': 0.24, '--r': '-26deg', right: '-38rem', top: '2rem' } as React.CSSProperties} />
          <i className="cs-blob" data-drift="0.06" style={{ '--w': '60rem', '--h': '22rem', '--a': 0.1, '--r': '-14deg', left: '-26rem', bottom: '-6rem', '--d': '-6s' } as React.CSSProperties} />
        </div>
        <h1 className="cs-h1">
          {study.name.split(' ').map((w, i, arr) => (
            <span key={w + i} className="cs-mask" style={{ display: arr.length > 2 && i < arr.length - 1 ? 'inline-block' : undefined }}>
              <span className="cs-ln">{w}{i < arr.length - 1 ? ' ' : ''}</span>
            </span>
          ))}
        </h1>
        <div className="cs-intro cs-ent">
          {study.intro.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
        </div>
        <div className="cs-still-wrap cs-ent">
          <div className="cs-still" style={{ '--cs-n': frames.length, '--cs-anim': `cs-flick-${Math.min(frames.length, 12)}` } as React.CSSProperties}>
            {frames.slice(0, 12).map((src, j) => (
              <img
                key={src}
                style={{ '--f': j } as React.CSSProperties}
                src={src}
                alt={j === 0 ? study.still.alt : ''}
                width={1900}
                height={1000}
                fetchPriority={j === 0 ? 'high' : undefined}
                loading={j === 0 ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
              />
            ))}
          </div>
        </div>
        {study.live ? (
          <div className="cs-visit cs-ent">
            <Button href={study.live} external ghost hoverLabel="Open it">
              Visit site
            </Button>
          </div>
        ) : null}
        <ul className="cs-facts cs-ent" aria-label="At a glance">
          {study.facts.map((f) => (
            <li key={f.label} className="cs-fact">
              <span className="cs-fact-l">{f.label}</span>
              <span className="cs-fact-v">{f.value}</span>
            </li>
          ))}
        </ul>
      </header>

      {/* §2 — THE DEVICE */}
      <section className="cs-device" aria-label="The site on a laptop">
        <div className="cs-glow" aria-hidden="true">
          <i className="cs-blob" data-drift="0.1" style={{ '--w': '90rem', '--h': '44rem', '--a': 0.3, '--r': '-32deg', right: '-30rem', top: '-8rem', '--d': '-3s' } as React.CSSProperties} />
          <i className="cs-blob" data-drift="0.18" style={{ '--w': '70rem', '--h': '26rem', '--a': 0.18, '--r': '-10deg', left: '-28rem', bottom: '-4rem', '--d': '-9s' } as React.CSSProperties} />
        </div>
        <div className="cs-device-stage">
          {study.device.back ? (
            <img className="cs-device-back" src={study.device.back} alt="" loading="lazy" decoding="async" draggable={false} aria-hidden="true" />
          ) : null}
          <Reveal className="cs-device-front-wrap">
            <img className="cs-device-front" src={study.device.front} alt={`${study.name} — the website on a laptop`} loading="lazy" decoding="async" draggable={false} />
          </Reveal>
        </div>
        {study.live ? (
          <p className="cs-device-cap">
            <a href={study.live} target="_blank" rel="noopener noreferrer">{study.live.replace(/^https?:\/\//, '')}</a>
            {' · '}designed and built by Konaverse, {study.facts.find((f) => f.label === 'Year')?.value}
          </p>
        ) : null}
      </section>

      {/* §3 — THE RECORDING */}
      {study.reel ? (
        <figure className="cs-reel">
          <div className="cs-reel-win">
            <video autoPlay muted loop playsInline preload="metadata" poster={study.reel.poster} aria-label={`${study.name} — a screen recording of the live site`}>
              {study.reel.webm ? <source src={study.reel.webm} type="video/webm" /> : null}
              <source src={study.reel.mp4} type="video/mp4" />
              <img src={study.reel.poster} alt={study.still.alt} />
            </video>
          </div>
          <div className="cs-reel-foot">
            <figcaption>The live site, under a real scroll</figcaption>
            <span className="cs-reel-bar" aria-hidden="true"><i /></span>
          </div>
        </figure>
      ) : null}

      {/* §4 — THE ARTICLE */}
      <section className="cs-article" aria-label="The case study">
        <div className="cs-glow" aria-hidden="true">
          <i className="cs-blob" data-drift="0.05" style={{ '--w': '80rem', '--h': '30rem', '--a': 0.14, '--r': '-38deg', left: '-40rem', top: '16%', '--d': '-4s' } as React.CSSProperties} />
          <i className="cs-blob" data-drift="0.08" style={{ '--w': '100rem', '--h': '34rem', '--a': 0.13, '--r': '-28deg', right: '-46rem', top: '50%', '--d': '-11s' } as React.CSSProperties} />
          <i className="cs-blob" data-drift="0.04" style={{ '--w': '70rem', '--h': '26rem', '--a': 0.11, '--r': '-16deg', left: '-32rem', bottom: '-2rem', '--d': '-7s' } as React.CSSProperties} />
        </div>
        <nav className="cs-rail" aria-label="In this case study">
          <ol className="cs-index">
            {index.map((s, i) => (
              <li key={s.id} data-id={s.id} className={i === 0 ? 'is-active' : ''}>
                <a href={`#${s.id}`}>{s.title}</a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="cs-body">
          {study.sections.map((s) => (
            <section key={s.id} id={s.id} className="cs-sec" aria-labelledby={`${s.id}-h`}>
              <Reveal masked as="h2" className="cs-h2">
                <span id={`${s.id}-h`}>{s.title}</span>
              </Reveal>
              {s.blocks.map((b, i) => (
                <Block key={s.id + b.kind + i} block={b} i={i} />
              ))}
            </section>
          ))}
          {/* BLOCK 5 — required */}
          <section id="result" className="cs-sec" aria-labelledby="result-h">
            <Reveal masked as="h2" className="cs-h2">
              <span id="result-h">Result</span>
            </Reveal>
            {study.result.stats?.length ? (
              <ul className="cs-stats">
                {study.result.stats.map((st, j) => (
                  <li key={st.label}>
                    <Reveal className="cs-stat" index={j}>
                      <span className="cs-stat-v">{st.value}</span>
                      <span className="cs-stat-l">{st.label}</span>
                    </Reveal>
                  </li>
                ))}
              </ul>
            ) : null}
            <Reveal className="cs-result" index={1}>
              <p>{study.result.text}</p>
            </Reveal>
          </section>
        </div>
      </section>

      {/* §5 — THE FOOT */}
      <footer className="cs-foot">
        <div className="cs-glow" aria-hidden="true">
          <i className="cs-blob" data-drift="0.1" style={{ '--w': '84rem', '--h': '30rem', '--a': 0.16, '--r': '-24deg', right: '-30rem', bottom: '-10rem', '--d': '-2s' } as React.CSSProperties} />
        </div>
        {next ? (
          <a className="cs-next" href={nextHref}>
            <div className="cs-next-l">
              <span className="cs-next-k">Next project</span>
              <p className="cs-next-n">{next.name}</p>
              <p className="cs-next-line">{next.line}</p>
            </div>
            <div className="cs-next-plate" aria-hidden="true">
              <img src={next.image} alt="" width={1600} height={1100} loading="lazy" decoding="async" draggable={false} />
            </div>
          </a>
        ) : null}

        <section className="cs-invite" aria-labelledby="cs-invite-h">
          <h2 className="cs-invite-h" id="cs-invite-h">Have a project like this one?</h2>
          <div className="cs-invite-act">
            <Button href="/contact" hoverLabel="Say hello">
              Contact us
            </Button>
            <Button href={CALENDLY_URL} external ghost hoverLabel="Pick a time">
              Book a call
            </Button>
            <a className="cs-mail" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          </div>
        </section>

        {/* BLOCK 6 — the service page, and the hub */}
        <nav className="cs-links" aria-label="Related">
          <ArrowLink href="/work">All work</ArrowLink>
          <ArrowLink href={`/services/${study.service.slug}`}>{study.service.name}</ArrowLink>
        </nav>
      </footer>
    </CaseMotion>
  )
}
