'use client'

import { Fragment, useEffect, useRef, type CSSProperties } from 'react'
import { gsap } from '@/lib/motion-v4'
import ArrowLink from '@/components/v4/ArrowLink'

/**
 * THE SUBSTANCE — four sections for a service page (2026-10-02, the
 * owner on the lean run: "we've stripped a lot… no problem solving,
 * problem-focused content", then "keep our brand aesthetic, motion,
 * visually appealing, no pinned scroll sections, image rich, in brand
 * layout"). Researched first (Google Search Central: no preferred word
 * count, first-hand non-commodity content wins, FAQ rich results are
 * gone; AI crawlers read only the server HTML), so the words are carried
 * by DESIGNED pieces — captions, quotes, cards — never a wall of text.
 *
 *   RunKind  the fit: "what it is" on a paper card beside a void card
 *            whose picture is "when it is the wrong choice"
 *   RunFix   the problems, as a client says them, each set large and
 *            CUT BY the picture of the project that answers it (the
 *            house's difference-blend grammar); our answer under it
 *   RunWork  the service's case studies: desktop capture with the phone
 *            capture overlapping it, staggered in two columns
 *   RunGets  what you get: the about page's bento grammar — paper cards,
 *            a black wash, a light that runs round the edge on hover
 *
 * MOTION, all in flow — NO PIN: entrances on arrival (`is-in` from one
 * IntersectionObserver), pictures drifting against the page on
 * `[data-drift]` (one rect a frame off gsap.ticker), mono prints that
 * take their colour under the hand. Hidden states only under `.is-live`
 * (this driver's), so no JS and reduced motion read the finished page.
 * Every word is server-rendered. Styles: services/more.css.
 */

/** THE DRIVER, shared: arrivals + drift for one section */
function useRun(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    root.classList.add('is-live')

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          e.target.classList.add('is-in')
          io.unobserve(e.target)
        }),
      { threshold: 0.18, rootMargin: '0px 0px -6% 0px' },
    )
    root.querySelectorAll('[data-in]').forEach((el) => io.observe(el))

    /* THE DRIFT: each marked element slides against the page by its
       rate, about the viewport's middle — offsets measured on resize so
       nothing reads its own transform */
    const drifts = Array.from(root.querySelectorAll<HTMLElement>('[data-drift]')).map((el) => ({
      el,
      rate: parseFloat(el.dataset.drift || '0'),
      top: 0,
      h: 0,
      last: NaN,
    }))
    const measure = () => {
      const r0 = root.getBoundingClientRect()
      drifts.forEach((d) => {
        d.el.style.transform = ''
        const r = d.el.getBoundingClientRect()
        d.top = r.top - r0.top
        d.h = r.height
        d.last = NaN
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(root)
    const tick = () => {
      const r = root.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < -vh * 0.2 || r.top > vh * 1.2) return
      for (const d of drifts) {
        const c = r.top + d.top + d.h / 2
        const y = ((c - vh / 2) / vh) * d.rate * vh
        if (Math.abs(y - d.last) < 0.3) continue
        d.last = y
        d.el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`
      }
    }
    tick()
    gsap.ticker.add(tick)
    return () => {
      io.disconnect()
      ro.disconnect()
      gsap.ticker.remove(tick)
      root.classList.remove('is-live')
      drifts.forEach((d) => (d.el.style.transform = ''))
      root.querySelectorAll('.is-in').forEach((el) => el.classList.remove('is-in'))
    }
  }, [ref])
}

/** a line of display type, its words rising from masks one after
 *  another. The words ARE the heading's text — ONE copy, real spaces
 *  between the masks — so a crawler reads the line once (an sr-only
 *  twin beside an aria-hidden split read every heading twice). */
function Words({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(' ')
  return (
    <>
      {/* the space sits OUTSIDE each mask: inside an inline-block it
          collapses and the words run together */}
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className="rm-m">
              <span className="rm-w" style={{ '--d': `${delay + i * 0.045}s` } as CSSProperties}>
                {w}
              </span>
            </span>
            {i < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
    </>
  )
}

/* ------------------------------------------------------------------ */

export function RunKind({
  headline,
  beats,
  image,
  alt,
  pictures,
}: {
  headline: string
  beats: readonly { title: string; body: string }[]
  image: string
  alt: string
  /** "what it is", shown: a desktop capture and a phone capture */
  pictures?: readonly [string, string]
}) {
  const ref = useRef<HTMLElement | null>(null)
  useRun(ref)
  const [is, not] = beats
  return (
    <section ref={ref} id="fit" className="rk" aria-label={headline}>
      <h2 className="rm-h2" data-in>
        <Words text={headline} />
      </h2>
      <div className="rk-row">
        <div className="rk-card rk-is" data-in>
          {pictures ? (
            <span className="rk-shots" aria-hidden="true">
              <span className="rk-desk" data-drift="-0.04">
                <img src={pictures[0]} alt="" loading="lazy" decoding="async" draggable={false} />
              </span>
              <span className="rk-phone" data-drift="-0.1">
                <img src={pictures[1]} alt="" loading="lazy" decoding="async" draggable={false} />
              </span>
            </span>
          ) : null}
          <h3 className="rk-t">{is.title}</h3>
          <p className="rk-p">{is.body}</p>
        </div>
        <div className="rk-card rk-not k-dark" data-in>
          <span className="rk-pic" aria-hidden="true">
            <span className="rk-print" data-drift="-0.06">
              <img src={image} alt="" loading="lazy" decoding="async" draggable={false} />
            </span>
          </span>
          <div className="rk-body">
            <h3 className="rk-t">{not.title}</h3>
            <p className="rk-p">{not.body}</p>
          </div>
          <span className="sr-only">{alt}</span>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

export function RunFix({
  title,
  problems,
}: {
  title: string
  problems: readonly { say: string; answer: string; study: string; pictures: readonly string[]; link: string }[]
}) {
  const ref = useRef<HTMLElement | null>(null)
  useRun(ref)
  return (
    <section ref={ref} id="fixes" className="rx" aria-label={title}>
      <h2 className="rm-h2" data-in>
        <Words text={title} />
      </h2>
      <ol className="rx-list">
        {problems.map((p, i) => {
          const phones = p.pictures.length > 1
          return (
            <li key={p.say} className={`rx-row${i % 2 ? ' is-flip' : ''}${phones ? ' is-phones' : ''}`} data-in>
              <figure className="rx-plate" data-drift="-0.05">
                {p.pictures.map((src, j) => (
                  <span key={src} className="rx-win" style={{ '--j': j } as CSSProperties}>
                    <img src={src} alt="" loading="lazy" decoding="async" draggable={false} />
                  </span>
                ))}
              </figure>
              {/* the problem, as the client says it: over the picture in
                  difference — ink on the paper, light on the print */}
              <h3 className="rx-say">
                <Words text={`“${p.say}”`} delay={0.15} />
              </h3>
              <div className="rx-body">
                <p className="rx-p">{p.answer}</p>
                <ArrowLink href={`/work/${p.study}`}>{p.link}</ArrowLink>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

/* ------------------------------------------------------------------ */

export type RunWorkItem = {
  slug: string
  name: string
  meta: string
  line: string
  desk: string
  phone?: string
}

export function RunWork({ title, items }: { title: string; items: readonly RunWorkItem[] }) {
  const ref = useRef<HTMLElement | null>(null)
  useRun(ref)
  return (
    <section ref={ref} id="work" className="rw" aria-label={title}>
      <div className="rw-head">
        <h2 className="rm-h2" data-in>
          <Words text={title} />
        </h2>
        <ArrowLink href="/work">All work</ArrowLink>
      </div>
      <ul className="rw-grid">
        {items.map((w, i) => (
          <li key={w.slug} className="rw-item" data-in style={{ '--i': i } as CSSProperties}>
            <a className="rw-card" href={`/work/${w.slug}`}>
              <span className="rw-frame">
                <span className="rw-win">
                  <img src={w.desk} alt={`${w.name}, the website`} loading="lazy" decoding="async" draggable={false} />
                </span>
                {w.phone ? (
                  <span className="rw-phone-at" data-drift="-0.09" aria-hidden="true">
                    <span className="rw-phone">
                      <img src={w.phone} alt="" loading="lazy" decoding="async" draggable={false} />
                    </span>
                  </span>
                ) : null}
              </span>
              <span className="rw-text">
                <h3 className="rw-name">{w.name}</h3>
                <span className="rw-meta">{w.meta}</span>
                <span className="rw-line">{w.line}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ------------------------------------------------------------------ */

export function RunGets({
  title,
  gets,
}: {
  title: string
  gets: readonly { title: string; text: string; pictures?: readonly string[] }[]
}) {
  const ref = useRef<HTMLElement | null>(null)
  useRun(ref)
  return (
    <section ref={ref} id="gets" className="rg" aria-label={title}>
      <h2 className="rm-h2" data-in>
        <Words text={title} />
      </h2>
      <ul className="rg-grid" data-in>
        {gets.map((g, i) => (
          <li key={g.title} className={`rg-card${g.pictures ? ' is-pic' : ''}`} style={{ '--i': i } as CSSProperties}>
            {g.pictures ? (
              <span className="rg-pics" aria-hidden="true">
                {g.pictures.map((src, j) => (
                  <span
                    key={src}
                    className={`rg-pic${/\/m-\d+\.webp$/.test(src) ? ' is-phone' : ''}`}
                    style={{ '--j': j } as CSSProperties}
                  >
                    <img src={src} alt="" loading="lazy" decoding="async" draggable={false} />
                  </span>
                ))}
              </span>
            ) : null}
            <span className="rg-text">
              <h3 className="rg-t">{g.title}</h3>
              <p className="rg-p">{g.text}</p>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
