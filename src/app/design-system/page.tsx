import type { Metadata } from 'next'
import ApertureMenu from '@/components/v4/ApertureMenu'
import Reveal from '@/components/v4/Reveal'
import '@/styles/tokens.css'
import './design-system.css'

/**
 * The living design system. Real React, real tokens, real components — the same
 * CSS that ships, not a copy of it. Sits outside app/(site) so it renders
 * without the legacy navbar, footer, cursor and smooth-scroll wrapper.
 *
 * `.k-root` carries the Whiteout base styling as a wrapper class rather than a
 * bare `body` rule, because Next hoists every CSS import to global scope.
 */
export const metadata: Metadata = {
  title: 'Design system',
  robots: { index: false, follow: false },
}

const SWATCHES = [
  ['--white', '#FFFFFF', 'surface'],
  ['--mist', '#F4F6F7', 'surface-raised'],
  ['--silver', '#DDE3E7', 'hairline'],
  ['--graphite', '#687076', 'text-muted · 5.04:1'],
  ['--ink', '#15171A', 'text · 17.96:1'],
  ['--ice', '#7FA8C9', 'accent · light + rim only'],
  ['--ice-soft', '#DCE8F1', 'accent-wash'],
  ['--ice-deep', '#2E5F8A', 'text-accent · 6.73:1'],
]

const SCALE: [string, string, string][] = [
  ['t-display', '200 · 0.95 · -0.045em', 'Ahead of market'],
  ['t-h1', '200 · 1.08 · -0.04em', 'We build the web as a place'],
  ['t-h2', '400 · 1.08 · -0.03em', 'Selected work from the studio'],
  ['t-h3', '500 · 1.32 · -0.015em', 'Immersive scrollytelling'],
  ['t-body', '400 · 1.65', 'Every site is built as one continuous story rather than a stack of sections.'],
  ['t-small', '400 · 1.55', 'Based in Cyprus, working globally. Projects begin at 2,000 euro.'],
]

const SERVICES = [
  ['3D & immersive websites', 'From 4,000'],
  ['Web design', 'From 2,000'],
  ['Web development', 'From 2,000'],
  ['One-page websites', 'From 1,000'],
]

const TILES = [
  ['Titan Sable', 'Scroll-driven product story'],
  ['DT Zankatian', 'Full site, seven templates'],
  ['Los Santos Barbers', 'One-page, booking led'],
]

function Arrow() {
  return (
    <span className="k-arrow-link__ico" aria-hidden="true">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M2 8h11M9 3.5 13.5 8 9 12.5" />
      </svg>
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M2 8h11M9 3.5 13.5 8 9 12.5" />
      </svg>
    </span>
  )
}

function Section({ n, title, lede, children }: { n: string; title: React.ReactNode; lede?: string; children: React.ReactNode }) {
  return (
    <section className="ds-section">
      <p className="ds-label">{n}</p>
      <Reveal masked as="h2" className="t-h2" style={{ margin: '0 0 var(--s-5)' }}>
        {title}
      </Reveal>
      {lede && (
        <Reveal as="p" index={1} className="t-body" style={{ margin: '0 0 var(--s-8)', color: 'var(--text-muted)' }}>
          {lede}
        </Reveal>
      )}
      {children}
    </section>
  )
}

export default function DesignSystemPage() {
  return (
    <div className="k-root ds">
      {/* Every .k-reveal starts at opacity 0 and is turned on by an
          IntersectionObserver. If JS never runs, that content would be
          invisible forever — the whole page, blank. The aperture menu already
          takes the progressive-enhancement stance (it renders OPEN without JS);
          the reveal has to as well. Belongs in the root layout once the legacy
          site is gone. */}
      <noscript>
        <style>{`.k-reveal{opacity:1!important;filter:none!important;transform:none!important}`}</style>
      </noscript>
      <div className="k-grain" />
      <ApertureMenu />

      <div className="k-page">
        {/* ---------------------------------------------------------- hero */}
        <section className="ds-section ds-hero">
          <p className="ds-label">Konaverse · design system</p>
          <Reveal masked as="h1" className="t-display" style={{ margin: '0 0 var(--s-6)' }}>
            Whiteout, single <em>ice</em>
          </Reveal>
          <Reveal as="p" index={1} className="t-body" style={{ margin: 0, color: 'var(--text-muted)' }}>
            Six type sizes, eight colours, four easing curves. Every component on this page is
            the real thing — the same <code>k-</code> classes and the same token file that
            ship, not a copy. Open the aperture from the burger, top right.
          </Reveal>
        </section>

        {/* -------------------------------------------------------- colour */}
        <Section
          n="01 · Colour"
          title={<>Eight values, seven <em>roles</em></>}
          lede="Components reference a role, never a raw value, so the whole site retunes by editing three lines. Ice is 2.52:1 on white — it can carry light, rim and object tint, never text. When the accent must be readable, that is ice-deep."
        >
          <div className="ds-swatches">
            {SWATCHES.map(([name, hex, role], i) => (
              <Reveal key={name} index={Math.min(i, 3)}>
                <span className="ds-chip" style={{ background: hex }} />
                <b>{name.replace('--', '')}</b>
                <code>{hex}</code>
                <span>{role}</span>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ---------------------------------------------------------- type */}
        <Section
          n="02 · Type"
          title={<>Manrope, weight does the <em>work</em></>}
          lede="One family, six sizes. The personality is the jump between 200 and 600, which is why the mid weights stay out of headlines. No eyebrows, no section numbers, no second face — a break is space and a hairline."
        >
          <div className="ds-scale">
            {SCALE.map(([cls, meta, sample], i) => (
              <div className="ds-scale-row" key={cls}>
                <span className="ds-meta">{cls}<br />{meta}</span>
                <Reveal index={Math.min(i, 3)} className={cls}>
                  {cls === 't-display' || cls === 't-h1' ? (
                    <>{sample.split(' ').slice(0, -1).join(' ')} <em>{sample.split(' ').slice(-1)}</em></>
                  ) : sample}
                </Reveal>
              </div>
            ))}
          </div>
        </Section>

        {/* ------------------------------------------------------ the reveal */}
        <Section
          n="03 · The signature"
          title={<>Refraction, not <em>fade</em></>}
          lede="Nothing fades. Type resolves from a displaced blurred state, as though coming into focus through moving glass. Two expressions of one idea — the crop edge is the variable, the refraction never is. Everything on this page is revealing this way as you scroll."
        >
          <div className="ds-two">
            <div className="ds-demo">
              <p className="ds-label">A · masked rise · display type only</p>
              <Reveal masked className="t-h2">Built as one continuous story</Reveal>
              <p className="ds-note">Rises out of a real crop <em>and</em> resolves from the same blur, so it reads as coming into focus as it clears the edge.</p>
            </div>
            <div className="ds-demo">
              <p className="ds-label">B · pure refraction · everything else</p>
              <Reveal className="t-body" style={{ margin: 0 }}>
                Konaverse is a studio for brands that need to arrive somewhere ahead of their
                market. No natural crop edge exists around a paragraph, and inventing one
                looks like a mistake.
              </Reveal>
              <p className="ds-note">18px displaced, 14px blurred, 900ms on e-glass. The rule that keeps it honest: only mask where an edge already exists.</p>
            </div>
          </div>
        </Section>

        {/* ---------------------------------------------------- components */}
        <Section
          n="04 · Components"
          title={<>Ten, and no <em>more</em></>}
          lede="Calm at rest, one legible move on touch. If a hover does more than one thing, cut until it does one. No bounce or back curves anywhere — they break the register."
        >
          <div className="ds-two">
            <div className="ds-demo">
              <p className="ds-label">Button · the fill irises from the centre</p>
              <div className="ds-stage">
                <a href="#" className="k-btn">Start a project</a>
                <a href="#" className="k-btn k-btn-ghost">See the work</a>
              </div>
              <p className="ds-note">The same circle that grows the menu out of the burger fills a button — the aperture is the system&rsquo;s one <em>this opens</em> gesture, reused rather than invented twice. The disc is sized off the button&rsquo;s own width, so wide and narrow feel identical.</p>
            </div>

            <div className="ds-demo">
              <p className="ds-label">Arrow link · the arrow draws the rule</p>
              <div className="ds-stage" style={{ gap: 'var(--s-7)' }}>
                <a href="#" className="k-arrow-link">See all services<Arrow /></a>
                <a href="#" className="k-arrow-link">Pricing<Arrow /></a>
              </div>
              <p className="ds-note">The workhorse — it carries all three destinations the homepage is allowed. The arrow leaves through its own crop while its replacement enters from the left, and the rule draws underneath as though the arrow drew it. The label also shifts to ice-deep, because a 2.52:1 hairline cannot carry a hover state on its own.</p>
            </div>

            <div className="ds-demo">
              <p className="ds-label">Project tile · links to its case study</p>
              <a href="#" className="k-card">
                <span className="k-card__media"><span className="ds-img" /></span>
                <span className="ds-cap">
                  <b>Titan Sable</b>
                  <span className="t-small">Scroll-driven product story</span>
                </span>
              </a>
              <p className="ds-note">Quiet on purpose — client work supplies the only colour on the page. The lift and the image easing inside its own crop are the same gesture seen from outside and in.</p>
            </div>

            <div className="ds-demo">
              <p className="ds-label">List row · services, deliberately not links</p>
              {SERVICES.map(([name, price]) => (
                <div className="k-row" key={name}>
                  <span className="t-h3">{name}</span>
                  <span className="t-small">{price}</span>
                </div>
              ))}
              <div style={{ marginTop: 'var(--s-6)' }}>
                <a href="#" className="k-arrow-link">See all services<Arrow /></a>
              </div>
              <p className="ds-note">The hub is what fans out to the six service pages, so the homepage must not bypass it. These rows have <em>no hover state at all</em> — anything that answers the cursor implies it can be clicked. The whole affordance sits on the one link below.</p>
            </div>
          </div>
        </Section>

        {/* --------------------------------------------------------- tiles */}
        <Section n="05 · Work" title={<>Client work is the only <em>colour</em></>}>
          <div className="ds-tiles">
            {TILES.map(([name, desc], i) => (
              <Reveal key={name} index={Math.min(i, 3)}>
                <a href="#" className="k-card">
                  <span className="k-card__media"><span className="ds-img" /></span>
                  <span className="ds-cap">
                    <b>{name}</b>
                    <span className="t-small">{desc}</span>
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </Section>

        <hr className="k-rule" />
        <section className="ds-section" style={{ paddingBottom: 'var(--s-11)' }}>
          <Reveal masked as="h2" className="t-h1">Start a <em>project</em></Reveal>
          <div style={{ marginTop: 'var(--s-7)' }}>
            <a href="/contact" className="k-btn">Start a project</a>
          </div>
        </section>
      </div>
    </div>
  )
}
