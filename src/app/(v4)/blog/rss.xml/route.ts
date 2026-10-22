import { AUTHORS } from '@/lib/blog-posts'
import { SITE_URL } from '@/lib/site'
import { getSitemapPosts } from '@/sanity/posts'

/**
 * /blog/rss.xml — THE FEED (SEO audit D7, 2026-10-21: the URL returned
 * 404). RSS 2.0 for feed readers and aggregators, newest piece first,
 * from the same published posts as the sitemap and on the same 60-second
 * refresh. The blog index links it with <link rel="alternate">.
 */

export const revalidate = 60

const FEED_URL = `${SITE_URL}/blog/rss.xml`

const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export async function GET() {
  const posts = (await getSitemapPosts()).sort((a, b) => b.published.localeCompare(a.published))
  const newest = posts.map((p) => p.updated).sort().pop()

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`
      return [
        '    <item>',
        `      <title>${escape(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${new Date(post.published).toUTCString()}</pubDate>`,
        `      <dc:creator>${escape(AUTHORS[post.author].name)}</dc:creator>`,
        `      <description>${escape(post.description)}</description>`,
        '    </item>',
      ].join('\n')
    })
    .join('\n')

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">',
    '  <channel>',
    '    <title>Konaverse Blog</title>',
    `    <link>${SITE_URL}/blog</link>`,
    '    <description>What websites cost, how redesigns keep their rankings and how we build: articles from Konaverse, a web studio in Cyprus.</description>',
    '    <language>en</language>',
    newest ? `    <lastBuildDate>${new Date(newest).toUTCString()}</lastBuildDate>` : '',
    `    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml" />`,
    items,
    '  </channel>',
    '</rss>',
  ]
    .filter(Boolean)
    .join('\n')

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
