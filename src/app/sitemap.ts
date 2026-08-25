import type { MetadataRoute } from 'next'

const BASE_URL = 'https://kona-verse.com'

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
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/cookies`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
