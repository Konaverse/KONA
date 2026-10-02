import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/site'

/**
 * AI-CRAWLER POLICY (SEO plan v3, owner 2026-10-02: allow training bots
 * too — D7). Everyone may crawl everything but the API. The search and
 * user-fetch bots get groups of their own on purpose: a crawler obeys
 * only its most specific group, so a future `Disallow` added under `*`
 * can never silently take the site out of ChatGPT, Claude, Perplexity,
 * Copilot or Apple search. Cloudflare's "Block AI bots" must stay OFF
 * for this zone or the edge contradicts this file.
 */
const SEARCH_AND_USER_BOTS = [
  'Googlebot',
  'Bingbot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Applebot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: SEARCH_AND_USER_BOTS, allow: '/', disallow: '/api/' },
      { userAgent: '*', allow: '/', disallow: '/api/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
