import type { MetadataRoute } from 'next'

import { SITE_URL as BASE_URL } from '@/lib/site'

/** the legal pages' real last edit — a `lastmod` that moves on every
 *  build tells crawlers nothing */
const LEGAL_UPDATED = new Date('2026-08-28')

/**
 * ONE-PAGE LAUNCH (2026-08-25): `/` plus the legal pages. Every other inner
 * URL redirects home (next.config.ts) and must NOT be listed — a sitemap
 * entry that 307s is a crawl error. Add each page back the day it ships.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: LEGAL_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: LEGAL_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/cookies`,
      lastModified: LEGAL_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
