import type { MetadataRoute } from 'next'

import { CASE_STUDIES } from '@/lib/case-studies'
import { SERVICE_PAGES } from '@/lib/service-pages'
import { SITE_URL as BASE_URL } from '@/lib/site'

/**
 * EVERY INDEXABLE URL (SEO plan v3 launch gate, 2026-10-02): home, the
 * four inner pages, the six services and the seven case studies from
 * their data files, the legal pages. Nothing that redirects, nothing
 * noindex — a sitemap entry that 3xx's is a crawl error.
 *
 * `lastModified` is the page's REAL last content edit, kept by hand:
 * bump a date in the same commit that changes that page's copy. A date
 * that moves on every build (`new Date()`) teaches crawlers to ignore
 * ours. No changefreq or priority — Google ignores both.
 */
const LAUNCH = new Date('2026-10-02')
const LEGAL_UPDATED = new Date('2026-08-28')

/** per-page overrides once a page is edited after launch */
const UPDATED: Record<string, Date> = {}

const entry = (path: string, fallback: Date = LAUNCH) => ({
  url: `${BASE_URL}${path}`,
  lastModified: UPDATED[path] ?? fallback,
})

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    entry(''),
    entry('/services'),
    ...SERVICE_PAGES.map((s) => entry(`/services/${s.slug}`)),
    entry('/work'),
    ...CASE_STUDIES.map((c) => entry(`/work/${c.slug}`)),
    entry('/about'),
    entry('/contact'),
    entry('/privacy', LEGAL_UPDATED),
    entry('/terms', LEGAL_UPDATED),
    entry('/cookies', LEGAL_UPDATED),
  ]
}
