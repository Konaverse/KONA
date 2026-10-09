import type { MetadataRoute } from 'next'

import { getSitemapPosts } from '@/sanity/posts'
import { CASE_STUDIES } from '@/lib/case-studies'
import { SERVICE_PAGES } from '@/lib/service-pages'
import { SITE_URL as BASE_URL } from '@/lib/site'

/**
 * EVERY INDEXABLE URL (SEO plan v3 launch gate, 2026-10-02): home, the
 * inner pages, the six services and the seven case studies from their
 * data files, the blog and its pieces (2026-10-03), the legal pages. Nothing that redirects, nothing
 * noindex — a sitemap entry that 3xx's is a crawl error.
 *
 * `lastModified` is the page's REAL last content edit, kept by hand:
 * bump a date in the same commit that changes that page's copy. A date
 * that moves on every build (`new Date()`) teaches crawlers to ignore
 * ours. No changefreq or priority — Google ignores both.
 */
const LAUNCH = new Date('2026-10-02')
const LEGAL_UPDATED = new Date('2026-08-28')

/** THE COPY PASS (2026-10-03): the service pages' prices and wording,
 *  the homepage's blog row, the contact page's answers */
const COPY_PASS = new Date('2026-10-03')

/** per-page overrides once a page is edited after launch */
const UPDATED: Record<string, Date> = {
  '': COPY_PASS,
  '/contact': COPY_PASS,
  /* Microsoft Clarity added to the policies */
  '/cookies': new Date('2026-10-07'),
  '/privacy': new Date('2026-10-07'),
}

const entry = (path: string, fallback: Date = LAUNCH) => ({
  url: `${BASE_URL}${path}`,
  lastModified: UPDATED[path] ?? fallback,
})

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getSitemapPosts()
  return [
    entry(''),
    entry('/services'),
    ...SERVICE_PAGES.map((s) => entry(`/services/${s.slug}`, COPY_PASS)),
    entry('/work'),
    ...CASE_STUDIES.map((c) => entry(`/work/${c.slug}`)),
    entry('/about'),
    /* the blog: the index moves with its newest piece, each piece with
       its own `updated` */
    entry('/blog', new Date(posts.map((p) => p.updated).sort().pop() ?? '2026-10-03')),
    ...posts.map((p) => entry(`/blog/${p.slug}`, new Date(p.updated))),
    entry('/contact'),
    entry('/privacy', LEGAL_UPDATED),
    entry('/terms', LEGAL_UPDATED),
    entry('/cookies', LEGAL_UPDATED),
  ]
}
