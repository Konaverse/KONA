import { CHROME_KNOT, GLASS_SCREEN, type Fracture } from '@/components/v4/fractures'
import { WEB_DESIGN, type OrbitArt } from '@/components/v4/Orbit'

/**
 * WHAT A PLATE CAN HOLD. It began as one thing — an object that rests in
 * pieces and assembles — and the web design card broke that: a mockup with
 * props circling it is not a thing that comes apart. So the plate takes a
 * KIND, and adding a third needs a branch in ServiceCards and nothing else.
 * The contract every kind keeps is the one the section is built on: still at
 * rest, alive under the pointer, and climbing out of the top of its plate as
 * it opens.
 */
export type PlateMedia =
  | { kind: 'fracture'; art: Fracture }
  | { kind: 'orbit'; art: OrbitArt }

/**
 * THE SERVICE SET — the six services, their copy, and the object each one's
 * card holds.
 *
 * Nothing here knows about any layout: it is data only, and ServiceCards.tsx
 * is the one component that reads it now.
 *
 * REWRITTEN 2026-08-23 with §4's noir rebuild. Three things left:
 *
 *   THE SIX TINTS. Every service carried a `{ c1, c2, deep }` gradient
 *   identity — six hues spaced round the wheel, driving the aura, the ring
 *   light and the plate wash. That was a deliberate, documented break from
 *   the house's single accent, and it was the right call for a white page.
 *   On a monochrome one it is a colour-identity system sitting inside a
 *   design that has no colour, which is the plainest contradiction on the
 *   page. Identity moved to `light` below.
 *
 *   THE GLYPHS. Six stroke-drawn instruments, each drawing itself on hover
 *   through `stroke-dashoffset`. The user asked for them gone (2026-08-23):
 *   the cards get real rendered objects instead. Their drawing was also
 *   paint work on a page that had just been measured as paint-bound.
 *
 *   `Letters` and the ink sweep. The per-letter split existed so a name
 *   could ink over in the service's `deep` tone as you hovered. With the
 *   tints gone there is nothing for it to sweep TO — on the void the name is
 *   already at full brightness at rest — and it cost a span per character
 *   across six cards to say it. The card still answers a pointer four other
 *   ways: it lifts, its pane brightens, its plate lights, and its object
 *   assembles.
 *
 * All copy is PLACEHOLDER (checklist 6.6).
 */

export type Service = {
  slug: string
  name: string
  para: string
  includes: [string, string, string]
  /**
   * THE SERVICE'S OWN LIGHT — where its key light comes from, as an origin
   * in the card's own box. This is what replaced the six tints: the pane's
   * specular and the media plate's wash both orient to it, so the six cards
   * are told apart by the ANGLE their light arrives at rather than by hue.
   * Spread round the card deliberately — two cards lit from the same corner
   * are two cards you cannot tell apart at a glance, which was the whole
   * job the tints were doing.
   */
  light: [string, string]
  /**
   * What fills the card's media plate. Omitted while the object is still
   * being made — the plate then holds nothing and reads as a lit surface
   * waiting, which is honest and looks composed.
   */
  media?: PlateMedia
  /**
   * A short abstract shader render that plays behind the object, in the
   * plate. Built by tools/boomerang.js into a forwards-then-backwards loop —
   * these are randomised renders whose last frame has nothing to do with
   * their first, so a plain loop cuts hard once a cycle. Poster is its first
   * frame, and is the whole treatment under reduced motion.
   */
  loop?: { src: string; poster: string }
}

export const SERVICES: Service[] = [
  {
    slug: '3d-websites',
    name: '3D Websites',
    para: 'Real dimension for brands that need presence felt rather than described. Path-traced, pre-rendered, and engineered to read premium on every device.',
    includes: [
      'Path-traced renders, never live guesswork',
      'Scroll-driven object choreography',
      'Premium on every device, not just yours',
    ],
    light: ['18%', '8%'],
    media: { kind: 'fracture', art: CHROME_KNOT },
    loop: { src: '/services/loops/3d-websites.mp4', poster: '/services/loops/3d-websites.webp' },
  },
  {
    slug: 'web-design',
    name: 'Web Design',
    para: 'Interfaces with editorial calm and deliberate motion, designed on a system of type, space and restraint, never assembled from a template.',
    includes: [
      'A design system, not a theme',
      'Editorial type and layout',
      'Motion designed with the page, not after it',
    ],
    light: ['80%', '12%'],
    media: { kind: 'orbit', art: WEB_DESIGN },
  },
  {
    slug: 'web-development',
    name: 'Web Development',
    para: 'Engineering where performance is a feature: clean semantics, instant loads, and a site that humans and crawlers both read effortlessly.',
    includes: [
      'Server-rendered, crawlable to the last line',
      'Core Web Vitals treated as a feature',
      'Built to be maintained, not just shipped',
    ],
    light: ['50%', '-4%'],
    media: { kind: 'fracture', art: GLASS_SCREEN },
  },
  {
    slug: 'one-page-websites',
    name: 'One-page Websites',
    para: 'One page, one argument. For launches and focused offers that need a complete, sharp statement without the weight of a full site.',
    includes: [
      'One argument, sharply made',
      'Launch-ready in weeks, not months',
      'Everything earns its scroll',
    ],
    light: ['92%', '44%'],
  },
  {
    slug: 'website-redesign',
    name: 'Website Redesign',
    para: 'For sites the business outgrew. We keep what earned its place, rebuild what didn’t, and migrate without losing what search already knows about you.',
    includes: [
      'An audit of what earned its place',
      'A migration that keeps your rankings',
      'A system your team can extend',
    ],
    light: ['8%', '48%'],
  },
  {
    slug: 'seo',
    name: 'SEO',
    para: 'Structure, copy and technical groundwork, so the people searching for what you do actually find you. The AI engines asking on their behalf do too.',
    includes: [
      'Technical groundwork and structure',
      'Copy that answers real questions',
      'Visible to AI engines, not just Google',
    ],
    light: ['62%', '96%'],
  },
]
