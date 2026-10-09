import 'server-only'
import {cache} from 'react'
import type {BlogPost, Block} from '@/lib/blog-posts'
import {postsByDate} from '@/lib/blog-posts'
import type {POSTS_QUERY_RESULT} from './sanity.types'
import {client} from './client'
import {fetchBlogContent} from './blog-content'
import {POST_QUERY, POSTS_QUERY} from './queries'
import {urlFor} from './images'

type SanityPost = POSTS_QUERY_RESULT[number]
type BodyBlock = NonNullable<SanityPost['body']>[number]
type TextBlock = Extract<BodyBlock, {_type: 'block'}>

function inlineText(block: TextBlock): string {
  return (block.children ?? []).map(span => {
    let text = span.text ?? ''
    for (const mark of span.marks ?? []) {
      if (mark === 'strong') text = '**' + text + '**'
      else {
        const link = block.markDefs?.find(def => def._key === mark)
        if (link?.href) text = '[' + text + '](' + link.href + ')'
      }
    }
    return text
  }).join('')
}

/** Convert the editor's structured content into the existing website renderer. */
export function articleBlocks(body: SanityPost['body']): Block[] {
  const blocks: Block[] = []
  for (const item of body ?? []) {
    switch (item._type) {
      case 'block': {
        const text = inlineText(item)
        if (item.listItem) {
          const ordered = item.listItem === 'number'
          const previous = blocks.at(-1)
          if (previous?.kind === 'list' && Boolean(previous.ordered) === ordered) previous.items.push(text)
          else blocks.push({kind: 'list', ordered, items: [text]})
        } else if (item.style === 'h2') blocks.push({kind: 'h2', id: item._key, text})
        else if (item.style === 'h3') blocks.push({kind: 'h3', text})
        else blocks.push({kind: 'p', text})
        break
      }
      case 'articleTable':
        blocks.push({kind: 'table', caption: item.caption ?? '', head: item.head ?? [], rows: (item.rows ?? []).map(row => row.cells ?? [])})
        break
      case 'articleStats':
        blocks.push({kind: 'stats', items: (item.items ?? []).map(stat => ({value: stat.value ?? '', label: stat.label ?? ''}))})
        break
      case 'articleNote':
        blocks.push({kind: 'note', title: item.title ?? '', text: item.text ?? ''})
        break
      case 'articleImage':
        if (item.asset) blocks.push({kind: 'image', src: urlFor(item).width(1600).auto('format').url(), alt: item.alt ?? '', width: item.width ?? 1600, height: item.height ?? 1000, caption: item.caption})
        break
    }
  }
  return blocks
}

function toPost(post: SanityPost | null): BlogPost | null {
  if (!post?.slug || !post.title || !post.cover?.asset || !post.published || !post.updated ||
    (post.author !== 'konstantinos' && post.author !== 'nabil') ||
    !post.service?.slug || !post.service.label || !post.service.line) return null
  const cover = post.cover
  return {
    slug: post.slug, title: post.title, metaTitle: post.metaTitle || post.title,
    description: post.description || post.excerpt || '',
    excerpt: post.excerpt || '', topic: post.topic || '', published: post.published, updated: post.updated,
    author: post.author, answer: post.answer || '', blocks: articleBlocks(post.body), body: post.body || [],
    cover: {
      src: urlFor(cover).width(Math.min(cover.width || 1920, 1920)).auto('format').url(),
      alt: cover.alt || '', width: cover.width || 1920, height: cover.height || 1080,
      position: cover.position || (cover.hotspot ? (cover.hotspot.x ?? 0.5) * 100 + '% ' + (cover.hotspot.y ?? 0.5) * 100 + '%' : undefined),
    },
    service: {slug: post.service.slug, label: post.service.label, line: post.service.line},
    studies: post.studies || [],
  }
}

export const getPosts = cache(async (): Promise<BlogPost[]> => {
  try {
    const data = await fetchBlogContent(POSTS_QUERY)
    return data.map(toPost).filter((post): post is BlogPost => post !== null)
  } catch (error) {
    // Keep local UI previews available when the dev server cannot reach Sanity.
    // Production and non-network errors must still surface normally.
    const networkError = typeof error === 'object' && error !== null &&
      'isNetworkError' in error && error.isNetworkError === true
    if (process.env.NODE_ENV !== 'development' || !networkError) throw error
    console.warn('[sanity] Network unavailable; using local blog posts for development.')
    return postsByDate()
  }
})

export const getPost = cache(async (slug: string): Promise<BlogPost | null> => {
  const data = await fetchBlogContent(POST_QUERY, {slug})
  return toPost(data)
})

/** Metadata routes cannot subscribe to browser live events. Refresh on request after 60 seconds. */
export async function getSitemapPosts(): Promise<BlogPost[]> {
  const data = await client.withConfig({useCdn: false}).fetch(POSTS_QUERY, {}, {perspective: 'published', stega: false, next: {revalidate: 60}})
  return data.map(toPost).filter((post): post is BlogPost => post !== null)
}
