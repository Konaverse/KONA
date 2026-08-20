import { Fragment } from 'react'

/**
 * THE SERVICE SET — the six services, their copy, their photographs and their
 * hairline glyphs, plus the letter-splitter every service name is set with.
 *
 * Lifted out of ServicesAccordion.tsx (2026-08-19) when §4 was rebuilt as the
 * threshold (ServicesThreshold.tsx): the content outlived the instrument, and
 * two components now set the same six names. Nothing here knows about either
 * layout — it is data and drawings only.
 *
 * All copy is PLACEHOLDER (checklist 6.6).
 */

export type Service = {
  slug: string
  name: string
  para: string
  includes: [string, string, string]
  image: string
  w: number
  h: number
  glyph: React.ReactNode
  /** the service's own light. See THE SIX TINTS below. */
  tint: Tint
  /**
   * What fills the card's media plate in ServiceCards.tsx.
   *   'glyph' — the hairline drawing above, centred on a tinted panel
   *   'photo' — `image` instead, filling the same panel edge to edge
   * The plate is sized for the photograph either way, so this is a one-word
   * change per card with no layout consequence. All six ship as 'glyph'
   * while the photographs are stand-in art.
   */
  media: 'glyph' | 'photo'
}

/**
 * THE SIX TINTS — one gradient identity per service.
 *
 * The house runs a single accent (ice, tokens.css route B). The bento breaks
 * that on purpose and only there: six cards that differ only in their glyph
 * are six identical cards, and the grid's whole job is to be scannable at a
 * glance. So each service gets a light of its own.
 *
 * The break is disciplined, not decorative:
 *   - six hues spaced evenly round the wheel, starting at the house ice, so
 *     the accent is a MEMBER of the set rather than something it contradicts;
 *   - every c1/c2 pair sits in the same lightness and chroma band, so no card
 *     shouts louder than another and the grid still reads as whiteout;
 *   - `deep` is the only value allowed to carry text or an icon stroke, and
 *     each one clears AA on white (3d's is --ice-deep itself, unchanged).
 * c1/c2 never touch text. They are aura, ring light and wash only.
 */
export type Tint = { c1: string; c2: string; deep: string }


/* The glyphs: stroke-drawn instruments, viewBox 100, hairline weight held
   by vector-effect in CSS. Every drawable stroke carries pathLength=100 +
   .g-draw so one dashoffset tween draws any of them edge-to-edge; dots and
   dashed strokes stay out of the draw (a dash pattern and the draw trick
   share stroke-dasharray and cannot coexist). Each is a small SCENE, not an
   icon (user call: "each one needs to be magnificent"), and each keeps one
   or two idle motions, keyed by its .wd-g* class in home.css. Carried over
   unchanged from the index/detail instrument — in the accordion they play
   over the panel image as ice-lit line work (the "animated neon icon" ask,
   executed in the house accent). */
const GLYPHS = {
  three_d: (
    /* The hero object's world: cube with trapped air, two crossed orbits,
       one sparkle. The orbit PLANES never rotate — a flat ellipse swept in
       the plane reads as a clock hand and periodically tangles the cube
       (seen on film); instead the DOTS travel their ellipses via
       offset-path, which is the hero's own rule: attitude constant, motion
       carried by what rides the orbit. */
    <svg className="wd-glyph wd-g1" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <ellipse cx="50" cy="52" rx="46" ry="13" pathLength={100} className="g-draw" transform="rotate(-16 50 52)" />
      <ellipse cx="50" cy="50" rx="30" ry="9" pathLength={100} className="g-draw" transform="rotate(58 50 50)" />
      <path className="g-draw" pathLength={100} d="M50 18 L72 29 L50 40 L28 29 Z" />
      <path className="g-draw" pathLength={100} d="M28 29 L28 55 L50 66 L50 40" />
      <path className="g-draw" pathLength={100} d="M72 29 L72 55 L50 66" />
      {/* the trapped air */}
      <circle cx="44" cy="50" r="1.2" className="g-dot" />
      <circle cx="55" cy="45" r="0.9" className="g-dot" />
      <circle cx="48" cy="58" r="1" className="g-dot" />
      <path className="g-draw g-spark" pathLength={100} d="M82 10 L84.2 15.8 L90 18 L84.2 20.2 L82 26 L79.8 20.2 L74 18 L79.8 15.8 Z" />
      {/* the travellers — positioned entirely by offset-path (CSS hides
          them where Motion Path is unsupported) */}
      <circle r="2.2" className="g-dot g-orbdot g-orbdot1" />
      <circle r="1.8" className="g-dot g-orbdot g-orbdot2" />
    </svg>
  ),
  design: (
    /* the hero's stage in miniature: the staircase window, its own layout
       roughed in, and the designer's cursor still moving things */
    <svg className="wd-glyph wd-g2" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <path
        className="g-draw"
        pathLength={100}
        d="M56 14 H 86 A 6 6 0 0 1 92 20 V 44 A 6 6 0 0 1 86 50 H 62 A 6 6 0 0 0 56 56 V 80 A 6 6 0 0 1 50 86 H 14 A 6 6 0 0 1 8 80 V 56 A 6 6 0 0 1 14 50 H 44 A 6 6 0 0 0 50 44 V 20 A 6 6 0 0 1 56 14 Z"
      />
      {/* headline + chip in the tall block */}
      <path className="g-draw" pathLength={100} d="M62 24 H 84" />
      <path className="g-draw" pathLength={100} d="M62 31 H 78" />
      <rect x="62" y="37" width="14" height="6" rx="3" pathLength={100} className="g-draw" />
      {/* paragraph in the wide block */}
      <path className="g-draw" pathLength={100} d="M14 60 H 44" />
      <path className="g-draw" pathLength={100} d="M14 67 H 38" />
      <path className="g-draw" pathLength={100} d="M14 74 H 30" />
      <path className="g-draw g-cursor" pathLength={100} d="M68 56 L68 70 L72 66.5 L75 73 L77.5 71.5 L74.5 65 L79 64.5 Z" />
    </svg>
  ),
  development: (
    /* the editor: a browser frame, code with real indentation, brackets,
       one line still being typed and the caret keeping time */
    <svg className="wd-glyph wd-g3" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <rect x="10" y="16" width="80" height="66" rx="5" pathLength={100} className="g-draw" />
      <path className="g-draw" pathLength={100} d="M10 28 H 90" />
      <circle cx="17" cy="22" r="1.6" className="g-dot" />
      <circle cx="24" cy="22" r="1.6" className="g-dot" />
      <path className="g-draw" pathLength={100} d="M18 40 H 44" />
      <path className="g-draw g-type" pathLength={100} d="M24 49 H 56" />
      <path className="g-draw" pathLength={100} d="M24 58 H 48" />
      <path className="g-draw" pathLength={100} d="M18 67 H 38" />
      <path className="g-draw" pathLength={100} d="M68 42 L61 53 L68 64" />
      <path className="g-draw" pathLength={100} d="M78 42 L85 53 L78 64" />
      <path className="g-draw g-caret" pathLength={100} d="M75 40 L71 66" />
    </svg>
  ),
  one_page: (
    /* The one page, alive: content and scroll dot travel together — the
       glyph demonstrates scrolling the way §3 demonstrates parallax. The
       content is CLIPPED to the page and runs taller than it, so the
       travel reveals below-the-fold blocks instead of poking past the
       frame (the unclipped first cut did exactly that on film). */
    <svg className="wd-glyph wd-g4" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="wd-g4-clip">
          <rect x="31.5" y="9.5" width="37" height="81" rx="5" />
        </clipPath>
      </defs>
      <rect x="30" y="8" width="40" height="84" rx="6" pathLength={100} className="g-draw" />
      <g className="g-page" clipPath="url(#wd-g4-clip)">
        <rect x="36" y="16" width="28" height="14" rx="2" pathLength={100} className="g-draw" />
        <path className="g-draw" pathLength={100} d="M36 38 H 62" />
        <path className="g-draw" pathLength={100} d="M36 45 H 58" />
        <path className="g-draw" pathLength={100} d="M36 52 H 54" />
        <rect x="36" y="61" width="16" height="7" rx="3.5" pathLength={100} className="g-draw" />
        <path className="g-draw" pathLength={100} d="M36 78 H 60" />
        {/* below the fold — what the scroll travel reveals */}
        <rect x="36" y="86" width="28" height="12" rx="2" pathLength={100} className="g-draw" />
        <path className="g-draw" pathLength={100} d="M36 106 H 56" />
      </g>
      <path className="g-draw" pathLength={100} d="M78 16 V 84" />
      <circle cx="78" cy="22" r="2.2" className="g-dot g-scroll" />
    </svg>
  ),
  redesign: (
    /* the transformation: the old page dashed and swaying, the new one
       solid and still, and the flow between them never stopping */
    <svg className="wd-glyph wd-g5" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <g className="g-old">
        <rect x="12" y="30" width="34" height="44" strokeDasharray="3.2 3" />
        <path d="M18 40 H 40" strokeDasharray="3.2 3" />
        <path d="M18 48 H 36" strokeDasharray="3.2 3" />
        <path d="M18 56 H 30" strokeDasharray="3.2 3" />
      </g>
      <rect x="50" y="28" width="38" height="50" rx="5" pathLength={100} className="g-draw" />
      <path className="g-draw" pathLength={100} d="M57 40 H 80" />
      <path className="g-draw" pathLength={100} d="M57 48 H 74" />
      <rect x="57" y="57" width="14" height="8" rx="2" pathLength={100} className="g-draw" />
      {/* the flow: a dashed arc whose dashes march old → new */}
      <path className="g-flow" d="M30 20 C 42 6, 60 6, 70 17" strokeDasharray="4 4" />
      <path className="g-draw" pathLength={100} d="M64.5 15.5 L70 17 L68 10.5" />
    </svg>
  ),
  seo: (
    /* the results page: three results, the top one starred, and inside the
       lens the only thing that matters — the line going up */
    <svg className="wd-glyph wd-g6" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <path className="g-draw" pathLength={100} d="M12 24 H 48" />
      <path className="g-draw" pathLength={100} d="M12 31 H 36" />
      <path className="g-draw" pathLength={100} d="M12 46 H 52" />
      <path className="g-draw" pathLength={100} d="M12 53 H 40" />
      <path className="g-draw" pathLength={100} d="M12 68 H 44" />
      <path className="g-draw" pathLength={100} d="M12 75 H 32" />
      <path className="g-draw g-spark" pathLength={100} d="M56 21 L57.2 23.8 L60 25 L57.2 26.2 L56 29 L54.8 26.2 L52 25 L54.8 23.8 Z" />
      <g className="g-lens">
        <circle cx="70" cy="52" r="17" pathLength={100} className="g-draw" />
        <path className="g-draw" pathLength={100} d="M60 58 L66 53 L70 55 L78 45" />
        <circle cx="78" cy="45" r="1.6" className="g-dot" />
        <path className="g-draw" pathLength={100} d="M82 64 L 92 74" />
      </g>
    </svg>
  ),
} as const

/* The imagery: the moody-blue art-direction set (design/images), converted
   to public/services/. Chosen from the frames NOT already spent on this
   page — §3 holds the glass portrait, the hero holds the distorted one and
   the typing chip, §5's three featured sheets hold fog/city/hall. Stand-in
   art like §5's: replaced when real per-service artwork lands. */
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
    image: '/services/3d.webp',
    w: 1024,
    h: 1536,
    glyph: GLYPHS.three_d,
    media: 'glyph',
    tint: { c1: '#7FA8C9', c2: '#96A6D9', deep: '#2E5F8A' },
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
    image: '/services/design.webp',
    w: 1122,
    h: 1402,
    glyph: GLYPHS.design,
    media: 'glyph',
    tint: { c1: '#DCA1B4', c2: '#E3A99B', deep: '#9B4A5F' },
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
    image: '/services/development.webp',
    w: 1024,
    h: 1536,
    glyph: GLYPHS.development,
    media: 'glyph',
    tint: { c1: '#83C6B2', c2: '#7FBCCB', deep: '#1E6C61' },
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
    image: '/services/one-page.webp',
    w: 1024,
    h: 1536,
    glyph: GLYPHS.one_page,
    media: 'glyph',
    tint: { c1: '#E4B58F', c2: '#DCC68C', deep: '#8A5A24' },
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
    image: '/services/redesign.webp',
    w: 1122,
    h: 1402,
    glyph: GLYPHS.redesign,
    media: 'glyph',
    tint: { c1: '#AEA2D6', c2: '#C6A0D0', deep: '#5D4A94' },
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
    image: '/services/seo.webp',
    w: 1122,
    h: 1402,
    glyph: GLYPHS.seo,
    media: 'glyph',
    tint: { c1: '#B6C68B', c2: '#8FC79C', deep: '#4C6B2C' },
  },
]

/** row label split into letter spans; --i is the GLOBAL letter index so the
 *  ink (and, open, white) sweep runs across the whole name, word gaps included */
export function Letters({ text }: { text: string }) {
  let i = 0
  return (
    <span aria-hidden="true">
      {text.split(' ').map((word, wi) => (
        <Fragment key={wi}>
          <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {Array.from(word).map((ch, ci) => (
              <span key={ci} style={{ '--i': i++ } as React.CSSProperties}>
                {ch}
              </span>
            ))}
          </span>
          {wi < text.split(' ').length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </span>
  )
}
