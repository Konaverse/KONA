import type { Metadata } from 'next'
import WorkMotion from '@/components/v4/WorkMotion'
import Button from '@/components/v4/Button'
import ArrowLink from '@/components/v4/ArrowLink'
import Invitation from '@/components/v4/Invitation'
import { WORK_PROJECTS } from '@/lib/work-projects'
import { CALENDLY_URL, SITE_URL } from '@/lib/site'
import './work.css'

/**
 * THE WORK HUB — /work (2026-09-11, the user's wireframe "Work Page.png",
 * brought to life: "add images, scroll motion, design elements, and work
 * really well with hover").
 *
 * §1 THE HERO — on paper (user, 2026-09-11: the inset dark card is
 * gone), the statement centred (two lines muted, the third in ink), a
 * WINDOW under it — THE
 * REEL (user, 2026-09-11): the projects' captures stacked and cut
 * between at four to five a second, relentlessly, no video needed — with
 * the two CTAs on it (Contact, Book — the two the inner-page phase
 * decided), the services as vertical labels at the
 * page's edges. ON DESKTOP the hero is PINNED (user, 2026-09-11): a
 * notch of scroll sets the window growing to the full viewport at a
 * fixed speed, then "selected" and "work" rise at the viewport's centre;
 * a notch back reverses it from wherever it is (WorkMotion.tsx). On
 * phones "selected work" stays set across the window's bottom edge —
 * paper over the dark window, ink on the paper either side, the edge
 * cutting the word (mix-blend difference), lagging the scroll.
 *
 * §2 THE META ROW — year, studio, discipline on one hairline, drawn as
 * it enters.
 *
 * §3 THE CARDS — the four projects as dark cards, two by two, all the
 * same (user, 2026-09-11: none featured): the capture in a plate at the
 * top, the name, the line, the link. They ARRIVE AS PAPER — the
 * homepage §4 entrance (user: "similar to the services cards") — each
 * card inside a cell the driver bends by its inner corner. Under the
 * hand: the cursor becomes the frosted "View" disc, the plate becomes a
 * REEL of the site's captures cutting at the window's rate, the
 * spotlight rides the ring, the card lifts a step.
 *
 * §4 THE INVITATION follows in flow.
 *
 * SERVER-RENDERED, every word in the raw HTML (SEO plan D5). No video
 * on the page: the reel is CSS. NOT INDEXED YET —
 * KONA_OPEN_ROUTES=/work lifts the launch redirect locally. Case
 * studies (/work/[slug]) do not exist yet; the links go to the live
 * sites where known.
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

/** the services at the page's edges (the wireframe's vertical labels) */
const SIDES = ['Web design', 'Web development', '3D websites']

export default function WorkPage() {
  const projects = WORK_PROJECTS
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
          ...(p.href ? { url: p.href } : {}),
        })),
      },
    ],
  }

  return (
    <WorkMotion>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* the entrance parks the hero at opacity 0; the no-JS page undoes
          it and lands the reveals */}
      <noscript>
        <style>{`.wk-ent,.wk-win,.wk-side,.wk-title,.wk-card,.wk-cell{opacity:1!important;transform:none!important;filter:none!important}.wk-meta-l::before,.wk-meta-l::after{transform:none!important}`}</style>
      </noscript>

      {/* §1 — THE HERO: the stage is what pins on desktop */}
      <header className="wk-hero">
        <div className="wk-stage">
        {/* the services, vertical, at the page's edges */}
        <ul className="wk-sides wk-sides-l" aria-label="Services">
          {SIDES.map((s) => (
            <li key={s} className="wk-side">{s}</li>
          ))}
        </ul>
        <ul className="wk-sides wk-sides-r" aria-hidden="true">
          {SIDES.map((s) => (
            <li key={s} className="wk-side">{s}</li>
          ))}
        </ul>

        <div className="wk-card-hero">
          <h1 className="wk-state">
            <span className="wk-mask"><span className="wk-ln wk-ent">We don’t build to impress, we</span></span>
            <span className="wk-mask"><span className="wk-ln wk-ent">build to bring your vision to life.</span></span>
            <span className="wk-mask"><span className="wk-ln wk-ent wk-ln-ink">If it impresses, then so be it.</span></span>
          </h1>

          {/* THE WINDOW: THE REEL — the captures stacked, each shown for
              one step of a stepped animation, two crops of each so the
              cut never repeats too soon; graded; the two CTAs on it */}
          <div className="wk-win k-dark">
            <div className="wk-win-media wk-reel" aria-hidden="true">
              {projects.flatMap((p, i) =>
                [0, 1].map((crop) => (
                  <img
                    key={`${p.slug}-${crop}`}
                    className={`wk-reel-f${crop ? ' wk-reel-f-low' : ''}`}
                    style={{ '--f': i * 2 + crop } as React.CSSProperties}
                    src={p.image}
                    alt=""
                    width={1600}
                    height={1100}
                    loading="eager"
                    decoding="async"
                    draggable={false}
                  />
                )),
              )}
            </div>
            {/* the shade the expansion raises under the title */}
            <div className="wk-win-shade" aria-hidden="true" />
            <div className="wk-win-acts">
              <Button href="/contact" ghost hoverLabel="Say hello">
                Contact us
              </Button>
              <Button href={CALENDLY_URL} external hoverLabel="Pick a time">
                Book a call
              </Button>
            </div>
          </div>
        </div>

        {/* THE CUT TITLE (phones): across the window's bottom edge */}
        <div className="wk-title-wrap" aria-hidden="true">
          <p className="wk-title">selected work</p>
        </div>

        {/* THE BIG TITLE (desktop): rises at the viewport's centre once
            the window has the whole stage — "selected", then "work" */}
        <p className="wk-big" aria-hidden="true">
          <span className="wk-big-m"><span className="wk-big-w">selected</span></span>
          <span className="wk-big-m"><span className="wk-big-w">work</span></span>
        </p>
        </div>
      </header>

      {/* §2 — THE META ROW */}
      <div className="wk-meta" aria-hidden="true">
        <span className="wk-meta-l">2024 – 2026</span>
        <span className="wk-meta-l">Konaverse</span>
        <span className="wk-meta-l">Design &amp; development</span>
      </div>

      {/* §3 — THE CARDS */}
      <section className="wk-grid" aria-label="Selected work">
        <h2 className="sr-only">Selected work</h2>
        {projects.map((p, i) => {
          /* the plate's reel: the shot frames, or two crops of the one
             capture until they exist */
          const frames = p.frames?.length ? p.frames : [p.image, p.image]
          return (
          <div key={p.slug} className="wk-cell">
          <article
            className="wk-card k-dark"
            style={{ '--i': i % 2, '--wk-n': frames.length, '--wk-anim': `wk-flick-${frames.length}` } as React.CSSProperties}
          >
            <div className="wk-plate">
              {frames.map((src, j) => (
                <img
                  key={j}
                  className={`wk-pf${!p.frames?.length && j === 1 ? ' wk-pf-low' : ''}`}
                  style={{ '--f': j } as React.CSSProperties}
                  src={src}
                  alt={j === 0 ? `${p.name} — the website` : ''}
                  width={1900}
                  height={1000}
                  loading={i < 2 && j === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable={false}
                />
              ))}
            </div>
            <div className="wk-card-body">
              <p className="wk-card-meta">
                <span>{p.year}</span>
                <span>{p.service}</span>
              </p>
              <h3 className="wk-card-name">{p.name}</h3>
              <p className="wk-card-line">{p.line}</p>
              <div className="wk-card-act">
                {p.href ? (
                  <ArrowLink href={p.href} external>
                    View project
                  </ArrowLink>
                ) : (
                  <span className="wk-card-soon">Case study soon</span>
                )}
              </div>
            </div>
            {/* the whole card is the link where there is one */}
            {p.href ? (
              <a className="wk-card-cover" href={p.href} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} — view project`} />
            ) : null}
          </article>
          </div>
          )
        })}
      </section>

      {/* §4 — THE INVITATION */}
      <div className="wk-cta">
        <Invitation />
      </div>
    </WorkMotion>
  )
}
