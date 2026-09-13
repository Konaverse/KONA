import type { Metadata } from 'next'
import Reveal from '@/components/v4/Reveal'
import Button from '@/components/v4/Button'
import ArrowLink from '@/components/v4/ArrowLink'
import ProjectCard from '@/components/v4/ProjectCard'
import './design-system.css'

/**
 * The living design system. Real React, real tokens, real components — the same
 * CSS that ships, not a copy of it.
 *
 * The shell — `.k-root`, the noscript reveal fallback, grain, aperture menu,
 * Lenis, the fluid cursor and the page transition — now lives in the shared
 * app/(v4)/layout.tsx, so this file is only the page.
 */
export const metadata: Metadata = {
  title: 'Design system',
  robots: { index: false, follow: false },
}

/* THE RAMP. Chips paint from the token itself, never from the hex beside
   them, so any drift between this page and tokens.css shows up here first. */
const RAMP: [string, string][] = [
  ['--n-0', 'light surface-raised'],
  ['--n-1', 'light surface'],
  ['--n-2', 'light surface-inset'],
  ['--n-3', 'light hairline'],
  ['--n-4', 'dark body · light hairline-strong'],
  ['--n-5', 'dark text-muted'],
  ['--n-6', 'text-faint, both poles'],
  ['--n-7', 'light text-muted'],
  ['--n-8', 'dark hairline-strong'],
  ['--n-9', 'dark hairline + inset'],
  ['--n-10', 'dark surface-raised'],
  ['--n-11', 'dark surface'],
]

/* The roles, and the measured contrast each one carries against the ground
   of its own polarity. These are what components reference. */
const ROLES: [string, string, string][] = [
  ['surface', 'n-1', 'n-11'],
  ['surface-raised', 'n-0', 'n-10'],
  ['surface-inset', 'n-2', 'n-9'],
  ['hairline', 'n-3', 'n-9'],
  ['text', 'ink · 16.56:1', 'n-0 · 18.57:1'],
  ['text-muted', 'n-7 · 5.81:1', 'n-5 · 8.09:1'],
  ['text-faint', 'n-6 · 3.55:1 large only', 'n-6 · 4.96:1'],
  ['focus-ring', 'ink', 'n-0'],
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
    <div className="ds">
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
          title={<>One ramp, twelve <em>steps</em></>}
          lede="Monochrome tech noir. Every ground and every piece of type on the site is drawn from this one cool-neutral ramp, paper at one end and void at the other, and neither end is absolute. Colour survives in exactly one place: as emitted light in the aurora. It is never a surface and never type."
        >
          <div className="ds-ramp">
            {RAMP.map(([name, role], i) => (
              <Reveal key={name} index={Math.min(i, 3)}>
                <span className="ds-chip" style={{ background: `var(${name})` }} />
                <b>{name.replace('--', '')}</b>
                <span>{role}</span>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ------------------------------------------------------ polarity */}
        <Section
          n="01b · Polarity"
          title={<>The same section, <em>flipped</em></>}
          lede="A dark section is not a second theme. It is k-dark, which re-points the role tokens at the other end of the ramp and does nothing else: no background, no stacking context. Anything written against roles inverts for free. Both panels below are the identical markup."
        >
          <div className="ds-poles">
            {(['k-light', 'k-dark'] as const).map((pole) => (
              <div key={pole} className={`ds-pole ${pole}`}>
                <p className="ds-pole-h">{pole}</p>

                <div className="ds-card">
                  <b className="t-h3">Elevation</b>
                  <p className="ds-card-p">
                    {pole === 'k-dark'
                      ? 'On dark: the surface ladder plus a hairline ring and a top-edge catch. No drop shadow at any level, because a shadow on a near-black ground is invisible.'
                      : 'On light: stacked micro-offsets plus an always-on inset hairline ring. Never one heavy drop.'}
                  </p>
                  <div className="ds-lifts">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <i key={n} style={{ boxShadow: `var(--lift-${n})` }}>{n}</i>
                    ))}
                  </div>
                </div>

                {/* k-dark, and NOT because the section is dark: this bed IS a
                    dark ground, so the type on it takes the dark polarity even
                    inside k-light. Polarity follows the GROUND, not the section. */}
                <div className="ds-glassbed k-dark">
                  <div className="ds-card k-glass">
                    <b className="t-h3">Glass</b>
                    <p className="ds-card-p">
                      Gradient fill, outer stroke, top-edge catch, and a second
                      stroke inset by one pixel. No backdrop-filter.
                    </p>
                  </div>
                </div>

                <div className="ds-roles">
                  {ROLES.map(([role, light, dark]) => (
                    <div key={role} className="ds-role">
                      <b>{role}</b>
                      <span>{pole === 'k-dark' ? dark : light}</span>
                    </div>
                  ))}
                </div>
              </div>
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
              <p className="ds-label">Button · still at rest, the flood answers where you arrived</p>
              <div className="ds-stage">
                <Button href="#" hoverLabel="Let&rsquo;s talk">Start a project</Button>
                <Button href="#" ghost hoverLabel="Case studies">See the work</Button>
              </div>
              <p className="ds-note">Nothing moves until you cross the edge — no perpetual animation, no leaning at a nearby cursor, and nothing drawn outside the pill. At rest the label carries one small mark on its right that names the destination: an east arrow for the site&rsquo;s own pages, north-east for anything that leaves it, the arrow link&rsquo;s own grammar. Then everything answers the crossing, from the exact point where you crossed. A disc of the other polarity floods out and inverts the button, each letter flipping as the edge passes under it — the primary floods to the page and takes the ghost&rsquo;s hairline as it goes, the ghost floods to ink, so the two simply trade places. And the label rolls up to its second line while the arrow rolls up and out with it, the label slides over, and the house sparkle rolls up into the room on the left: two marks, one per state, one side each. Leave, and the flood drains toward the point you left through.</p>
            </div>

            <div className="ds-demo">
              <p className="ds-label">Arrow link · a line that resolves into an arrow</p>
              <div className="ds-stage" style={{ gap: 'var(--s-7)' }}>
                <ArrowLink href="#">See all services</ArrowLink>
                <ArrowLink href="#">Pricing</ArrowLink>
                <ArrowLink href="#" external>Read the case study</ArrowLink>
              </div>
              <p className="ds-note">At rest it is a plain line, claiming nothing about where the link goes. On hover the head grows out of the shaft&rsquo;s own tip and the whole arrow steps forward along its own axis — so the internal ones advance east and the external one advances north-east, off a single distance. <em>Which</em> arrow it becomes is the point. Internal resolves to east; only the third one here, marked <code>external</code>, swings to north-east. ↗ is the web&rsquo;s near-universal sign for &ldquo;opens elsewhere&rdquo;, so every link wearing it was a real semantic clash. The rest state now does work: the icon stays neutral until you are about to act on it, then tells you what kind of destination this is. On touch, where there is no hover, the resolved arrow is shown permanently.</p>
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
