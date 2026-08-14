import type { Metadata } from 'next'
import ApertureMenu from '@/components/v4/ApertureMenu'
import Reveal from '@/components/v4/Reveal'
import Button from '@/components/v4/Button'
import ArrowLink from '@/components/v4/ArrowLink'
import ProjectCard from '@/components/v4/ProjectCard'
import SmoothScroll from '@/components/v4/SmoothScroll'
import CursorLens from '@/components/v4/CursorLens'
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

function Section({ n, title, lede, children }: { n: string; title: React.ReactNode; lede?: string; children: React.ReactNode }) {
  return (
    <section className="ds-section">
      <p className="ds-label">{n}</p>
      <Reveal masked as="h2" className="t-h2" style={{ margin: '0 0 var(--s-5)' }}>
        {title}
      </Reveal>
      {lede && (
        // weak: refraction over body copy hurts reading, per the choreography
        <div data-lens="weak">
          <Reveal as="p" index={1} className="t-body" style={{ margin: '0 0 var(--s-8)', color: 'var(--text-muted)' }}>
            {lede}
          </Reveal>
        </div>
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
      <SmoothScroll>{null}</SmoothScroll>
      <CursorLens />

      <div className="k-page">
        {/* ---------------------------------------------------------- hero */}
        <section className="ds-section ds-hero">
          <p className="ds-label">Konaverse · design system</p>
          {/* strong: the hero is where the glass is supposed to be most alive */}
          <div data-lens="strong">
            <Reveal masked as="h1" className="t-display" style={{ margin: '0 0 var(--s-6)' }}>
              Whiteout, single <em>ice</em>
            </Reveal>
          </div>
          <div data-lens="weak">
            <Reveal as="p" index={1} className="t-body" style={{ margin: 0, color: 'var(--text-muted)' }}>
              Six type sizes, eight colours, four easing curves. Every component on this page is
              the real thing — the same <code>k-</code> classes and the same token file that
              ship, not a copy. Move the cursor across this headline: the lens genuinely
              refracts it.
            </Reveal>
          </div>
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
              <p className="ds-label">Button · still at rest, alive on approach</p>
              <div className="ds-stage">
                <Button href="#" hoverLabel="Let&rsquo;s talk">Start a project</Button>
                <Button href="#" ghost hoverLabel="Case studies">See the work</Button>
              </div>
              <p className="ds-note">Move the cursor <em>near</em> one without touching it. No perpetual animation — that would contradict the system&rsquo;s own &ldquo;nothing moves on its own&rdquo; rule and spend the accent budget continuously. Proximity instead: it leans toward an approaching cursor, alive only when a human is near. On hover the fill grows up from the bottom rule while the label rolls letter by letter and the second label rolls up behind it — same direction, same curve, so it lands as one motion.</p>
            </div>

            <div className="ds-demo">
              <p className="ds-label">Arrow link · the arrow redraws its own shape</p>
              <div className="ds-stage" style={{ gap: 'var(--s-7)' }}>
                <ArrowLink href="#">See all services</ArrowLink>
                <ArrowLink href="#">Pricing</ArrowLink>
              </div>
              <p className="ds-note">Shaft and head are separate paths on one SVG. On hover both swing to a new axis, so an east arrow becomes a north-east one — a real change of shape from transforms and a dash offset, no morphing library, and it never leaves the compositor. The label shifts to ice-deep because a 2.52:1 hairline cannot carry a hover state alone.</p>
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
                <ArrowLink href="#">See all services</ArrowLink>
              </div>
              <p className="ds-note">The hub is what fans out to the six service pages, so the homepage must not bypass it. These rows have <em>no hover state at all</em> — anything that answers the cursor implies it can be clicked. The whole affordance sits on the one link below.</p>
            </div>

            <div className="ds-demo">
              <p className="ds-label">Motion budget</p>
              <p className="ds-note" style={{ marginTop: 0 }}>Four durations do all the work: <em>d-instant 120ms</em> for colour only, <em>d-base 420ms</em> for component moves, <em>d-slow 900ms</em> for reveals, <em>d-cinema 1400ms</em> for the aperture and the card entrance. Nothing structural runs under 400ms, and no curve overshoots — back and bounce easings break the register, which is why the card entrance below achieves its wobble with a second resolving tween instead.</p>
            </div>
          </div>
        </Section>

        {/* --------------------------------------------------------- tiles */}
        <Section
          n="05 · Work"
          title={<>Client work is the only <em>colour</em></>}
          lede="No frame, no rounded box, no shadow — the media is the card and the type sits under it on the page. Watch them arrive: pulled from a corner so the shape stretches, then recovering into a solid rectangle. Hovering plays a screen recording of the site; the video is not in the DOM until the first hover, so a visitor who never hovers never pays for it."
        >
          {/* strong: the choreography wants the lens to strengthen over tiles */}
          <div className="ds-tiles" data-lens="strong">
            {TILES.map(([name, desc], i) => (
              <ProjectCard key={name} title={name} meta={desc} href="#" index={i} />
            ))}
          </div>
        </Section>

        <hr className="k-rule" />
        <section className="ds-section" style={{ paddingBottom: 'var(--s-11)' }}>
          <Reveal masked as="h2" className="t-h1">Start a <em>project</em></Reveal>
          <div style={{ marginTop: 'var(--s-7)' }}>
            <Button href="/contact" hoverLabel="Say hello">Start a project</Button>
          </div>
        </section>
      </div>
    </div>
  )
}
