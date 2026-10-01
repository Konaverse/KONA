/**
 * THE ROSTER — every site the studio shows (2026-09-11, for /work).
 *
 * One list, in the order the cards read them. Tzankatian is OFF the
 * site (user, 2026-10-01: "remove Tzankatian"); Chris N Clean, Heimat
 * Group, TDK and City Arcade join with case studies of their own. `slug` is the case
 * study's future URL (/work/[slug]) and never changes once published.
 *
 * `href` is the LIVE site and is only set where it is known. Velricon's
 * year, service and line are FIRST DRAFTS — the user confirms them.
 *
 * The captures are 16:11 (1600 wide) in public/work/, graded mono by
 * CSS at rest and shown in their own colour under the hand — emitted
 * light, the one place colour is allowed.
 *
 * THE CARD REELS (user, 2026-09-11): under the hand a card's plate cuts
 * through eight to ten captures of the site. They go in `frames`, as
 * `public/work/frames/<slug>/01.webp` … shot at the plate's ratio,
 * 19:10 (1900 x 1000 is the size to shoot at). Until a project has
 * them, the page cuts between two crops of its one capture.
 */
export interface WorkProject {
  slug: string
  name: string
  /** one line, the sentence under the name */
  line: string
  year: string
  /** the service it belongs to, and the page that sells it */
  service: string
  serviceSlug: string
  /** the live site, when known */
  href?: string
  image: string
  /** the card reel: eight to ten captures at 19:10, in order; absent
   *  until shot */
  frames?: string[]
}

export const WORK_PROJECTS: WorkProject[] = [
  {
    slug: 'los-santos-barbers',
    name: 'Los Santos Barbershop',
    line: 'Nicosia’s barbershop set in type as sharp as the fades.',
    year: '2025',
    service: 'One-page website',
    serviceSlug: 'one-page-websites',
    href: 'https://lossantosbarbers.com',
    image: '/work/lossantos.webp',
    frames: Array.from({ length: 7 }, (_, i) => `/work/los-santos-barbers/${String(i + 1).padStart(2, '0')}.webp`),
  },
  {
    slug: 'lumiere-eclat',
    name: 'Lumière Éclat',
    line: 'A scroll-driven story of light and steel.',
    year: '2026',
    service: '3D website',
    serviceSlug: '3d-websites',
    href: 'https://watchweb.vercel.app',
    image: '/work/lumiere.webp',
    frames: Array.from({ length: 5 }, (_, i) => `/work/lumiere-eclat/${String(i + 1).padStart(2, '0')}.webp`),
  },
  {
    slug: 'velricon',
    name: 'Velricon',
    line: 'Financial leadership, given a site with the same composure.',
    year: '2025',
    service: 'Web design',
    serviceSlug: 'web-design',
    href: 'https://velricon.com',
    image: '/work/velricon.webp',
    frames: Array.from({ length: 8 }, (_, i) => `/work/velricon/${String(i + 1).padStart(2, '0')}.webp`),
  },
  {
    slug: 'chris-n-clean',
    name: 'Chris N Clean',
    line: 'A cleaning company’s site where the house comes clean under your scroll.',
    year: '2026',
    service: 'Web design',
    serviceSlug: 'web-design',
    href: 'https://www.chrisnclean.com',
    image: '/work/covers/chris-n-clean.webp',
  },
  {
    slug: 'heimat-group',
    name: 'Heimat Group',
    line: 'A new developer’s name, set like a home.',
    year: '2026',
    service: 'Web design',
    serviceSlug: 'web-design',
    href: 'https://www.heimat-group.com',
    image: '/work/covers/heimat-group.webp',
  },
  {
    slug: 'tdk',
    name: 'TDK Design & Build',
    line: 'The studio that draws and builds, standing in front of its own name.',
    year: '2026',
    service: 'Web development',
    serviceSlug: 'web-development',
    href: 'https://tdkdb.vercel.app/en',
    image: '/work/covers/tdk.webp',
  },
  {
    slug: 'city-arcade',
    name: 'City Arcade',
    line: 'A real-estate concept where the building rises out of its frame.',
    year: '2026',
    service: 'Web design',
    serviceSlug: 'web-design',
    href: 'https://city-arcade-roan.vercel.app',
    image: '/work/covers/city-arcade.webp',
  },
]
