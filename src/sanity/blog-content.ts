import 'server-only'
import {draftMode} from 'next/headers'
import type {QueryParams} from 'next-sanity'
import {client} from './client'
import {sanityFetch} from './live'

export const BLOG_CACHE_TAG = 'sanity:blog-content'

// Next.js caches the published response briefly; read from the origin so a
// refresh cannot refill that cache with an older Sanity CDN response.
const publishedClient = client.withConfig({useCdn: false})

export async function fetchBlogContent<const Query extends string>(query: Query, params: QueryParams = {}) {
  if ((await draftMode()).isEnabled) {
    // Keep Presentation's perspective, authentication and uncached drafts.
    const {data} = await sanityFetch({query, params, stega: false})
    return data
  }

  return publishedClient.fetch(query, params, {
    perspective: 'published',
    stega: false,
    next: {revalidate: 60, tags: [BLOG_CACHE_TAG]},
  })
}
