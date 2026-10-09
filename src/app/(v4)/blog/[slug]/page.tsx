import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Fragment, type ReactNode } from 'react'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/JsonLd'
import ArrowLink from '@/components/v4/ArrowLink'
import { BlogGrid } from '@/components/v4/BlogCards'
import BlogToc from '@/components/v4/BlogToc'
import Invitation from '@/components/v4/Invitation'
import Reveal from '@/components/v4/Reveal'
import { AUTHORS, longDate, readMinutes, wordCount, type Block } from '@/lib/blog-posts'
import { PortableText, type PortableTextComponents } from 'next-sanity'
import { articleBlocks, getPost, getPosts } from '@/sanity/posts'
import { client } from '@/sanity/client'
import { POST_SLUGS_QUERY } from '@/sanity/queries'
import { getCaseStudy } from '@/lib/case-studies'
import { OG_DEFAULTS, SITE_URL } from '@/lib/site'

/**
 * /blog/[slug] — THE ARTICLE (2026-10-03; docs/blog-plan-2026.md §5).
 *
 * THE ORDER IS THE ORDER A READER AND A CRAWLER WANT: the breadcrumb, the
 * question as the h1, who wrote it and when, then THE ANSWER as the first
 * paragraph, and only then the depth: sections with a table wherever
 * the question is a cost or a comparison. The contents ride a rail at
 * the left on desktop and stand above the text on a phone.
 *
 * LINKS (the plan): exactly one link to the service page the piece feeds
 * (the card at the foot), the case studies it cites, and the rest of the
 * blog. The service page links back (services/[slug]/page.tsx).
 *
 * SCHEMA: BlogPosting with its author as the site's Person node (@id from
 * the root layout's graph), real dates, the image, the word count; and
 * the breadcrumb Home › Blog › title. Statically generated, every word in
 * the server HTML.
 */

export async function generateStaticParams() {
  return client.withConfig({ useCdn: false }).fetch(POST_SLUGS_QUERY, {}, { perspective: 'published', stega: false })
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  const url = `${SITE_URL}/blog/${post.slug}`
  return {
    title: post.metaTitle,
    description: post.description,
    alternates: { canonical: url },
    authors: [{ name: AUTHORS[post.author].name, url: `${SITE_URL}/about` }],
    openGraph: {
      ...OG_DEFAULTS,
      title: post.title,
      description: post.description,
      url,
      type: 'article',
      publishedTime: post.published,
      modifiedTime: post.updated,
      authors: [AUTHORS[post.author].name],
      images: [{ url: `${new URL(post.cover.src, SITE_URL).href}`, width: post.cover.width, height: post.cover.height, alt: post.cover.alt }],
    },
  }
}

/** the two inline marks a body string may carry: [label](/path), **strong** */
function rich(text: string): ReactNode[] {
  return text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g).map((part, i) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (link) return <a key={i} href={link[2]}>{rich(link[1])}</a>
    const strong = part.match(/^\*\*([^*]+)\*\*$/)
    if (strong) return <strong key={i}>{rich(strong[1])}</strong>
    return <Fragment key={i}>{part}</Fragment>
  })
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case 'p':
      return <p>{rich(block.text)}</p>
    case 'h2':
      return (
        <h2 className="bl-h2" id={block.id}>
          {block.text}
        </h2>
      )
    case 'h3':
      return <h3 className="bl-h3">{block.text}</h3>
    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul'
      return (
        <Tag className="bl-list">
          {block.items.map((it) => (
            <li key={it.slice(0, 40)}>{rich(it)}</li>
          ))}
        </Tag>
      )
    }
    case 'table':
      return (
        <figure className="bl-table">
          <div className="bl-table-in">
            <table>
              <caption>{block.caption}</caption>
              <thead>
                <tr>
                  {block.head.map((h) => (
                    <th key={h} scope="col">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, i) => (
                      <td key={i}>{rich(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </figure>
      )
    case 'stats':
      return (
        <ul className="bl-stats">
          {block.items.map((s) => (
            <li key={s.label}>
              <span className="bl-stat-v">{s.value}</span>
              <span className="bl-stat-l">{s.label}</span>
            </li>
          ))}
        </ul>
      )
    case 'image':
      return (
        <figure className="bl-inline-image">
          <Image src={block.src} alt={block.alt} width={block.width} height={block.height} loading="lazy" decoding="async" />
          {block.caption ? <figcaption>{block.caption}</figcaption> : null}
        </figure>
      )
    case 'note':
      return (
        <aside className="bl-note k-dark">
          <p className="bl-note-t">{block.title}</p>
          <p>{rich(block.text)}</p>
        </aside>
      )
  }
}


type NativeBodyBlock = NonNullable<Parameters<typeof articleBlocks>[0]>[number]

function CustomBodyBlock({ value }: { value: NativeBodyBlock }) {
  const block = articleBlocks([value])[0]
  return block ? <BlockView block={block} /> : null
}

const portableComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children, value }) => <h2 className="bl-h2" id={value._key}>{children}</h2>,
    h3: ({ children }) => <h3 className="bl-h3">{children}</h3>,
  },
  list: {
    bullet: ({ children }) => <ul className="bl-list">{children}</ul>,
    number: ({ children }) => <ol className="bl-list">{children}</ol>,
  },
  types: {
    articleTable: CustomBodyBlock,
    articleStats: CustomBodyBlock,
    articleNote: CustomBodyBlock,
    articleImage: CustomBodyBlock,
  },
}

export default async function BlogArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const url = `${SITE_URL}/blog/${post.slug}`
  const author = AUTHORS[post.author]
  const contents = post.blocks.flatMap((b) => (b.kind === 'h2' ? [{ id: b.id, text: b.text }] : []))
  const studies = post.studies.map((s) => getCaseStudy(s)).filter((s): s is NonNullable<typeof s> => !!s)
  const others = (await getPosts()).filter((p) => p.slug !== post.slug)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        headline: post.title,
        description: post.description,
        url,
        mainEntityOfPage: url,
        datePublished: post.published,
        dateModified: post.updated,
        inLanguage: 'en',
        wordCount: wordCount(post),
        articleSection: post.topic,
        image: {
          '@type': 'ImageObject',
          url: `${new URL(post.cover.src, SITE_URL).href}`,
          width: post.cover.width,
          height: post.cover.height,
        },
        author: { '@id': `${SITE_URL}/${author.id}` },
        publisher: { '@id': `${SITE_URL}/#organization` },
        isPartOf: { '@id': `${SITE_URL}/blog#blog` },
        about: { '@id': `${SITE_URL}/services/${post.service.slug}#service` },
        ...(studies.length ? { mentions: studies.map((s) => ({ '@id': `${SITE_URL}/work/${s.slug}#article` })) } : {}),
      },
    ],
  }

  return (
    <main className="bl-art">
      <JsonLd data={jsonLd} />
      <article>
        <header className="k-page bl-art-head">
          <nav aria-label="Breadcrumb">
            <ol className="bl-crumbs">
              <li>
                <Link href="/blog">Blog</Link>
              </li>
              <li aria-current="page">{post.topic}</li>
            </ol>
          </nav>
          <Reveal as="h1" className="bl-art-h1">
            <span>{post.title}</span>
          </Reveal>
          <Reveal as="div" index={1}>
            <ul className="bl-art-meta">
              <li>
                <b>
                  <a href="#author" rel="author">
                    {author.name}
                  </a>
                </b>
                {author.role}
              </li>
              <li>
                <b>
                  <time dateTime={post.published}>{longDate(post.published)}</time>
                </b>
                {post.updated !== post.published ? (
                  <>
                    Updated <time dateTime={post.updated}>{longDate(post.updated)}</time>
                  </>
                ) : (
                  'Published'
                )}
              </li>
              <li>
                <b>{readMinutes(post)} minutes</b>
                Reading time
              </li>
            </ul>
          </Reveal>
          <Reveal as="div" index={2}>
            <figure className="bl-art-cover">
              <img
                src={post.cover.src}
                alt={post.cover.alt}
                width={post.cover.width}
                height={post.cover.height}
                fetchPriority="high"
                decoding="async"
                draggable={false}
                style={post.cover.position ? { objectPosition: post.cover.position } : undefined}
              />
            </figure>
          </Reveal>
        </header>

        <div className="k-page bl-art-grid">
          {/* the contents, marking the section being read (BlogToc) */}
          <BlogToc items={contents} />

          <div className="bl-body">
            {/* THE ANSWER: first, whole, liftable */}
            <p className="bl-answer">{post.answer}</p>
            {post.body ? <PortableText value={post.body} components={portableComponents} /> : post.blocks.map((b, i) => (
              <BlockView key={i} block={b} />
            ))}

            {/* the one service this piece feeds */}
            <aside className="bl-svc" aria-label="Related service">
              <p className="bl-svc-k">The service behind this article</p>
              <p className="bl-svc-t">{post.service.label}</p>
              <p className="bl-svc-p">{post.service.line}</p>
              <ArrowLink href={`/services/${post.service.slug}`}>See {post.service.label.toLowerCase()}</ArrowLink>
            </aside>

            {studies.length ? (
              <nav className="bl-cited" aria-label="Case studies in this article">
                <span className="bl-cited-k">Case studies in this article</span>
                {studies.map((s) => (
                  <ArrowLink key={s.slug} href={`/work/${s.slug}`}>
                    {s.name}
                  </ArrowLink>
                ))}
              </nav>
            ) : null}

            {/* THE AUTHOR (owner, 2026-10-03: "we need an author bio with
                structured data"): the portrait, the name, the bio. The
                same words are the `description` of his Person node in
                the root layout's graph, which this article's `author`
                points at by @id. */}
            <footer className="bl-author" id="author" aria-label="About the author">
              <img className="bl-author-pic" src={author.portrait} alt={`${author.name}, ${author.role}`} width={160} height={192} loading="lazy" decoding="async" />
              <div className="bl-author-in">
                <p className="bl-author-k">Written by</p>
                <p className="bl-author-n">{author.name}</p>
                <p className="bl-author-r">{author.role}</p>
                <p className="bl-author-b">{author.bio}</p>
                <p className="bl-author-l">
                  {author.links.map((l) =>
                    l.href.startsWith('http') ? (
                      <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer me">
                        {l.label}
                      </a>
                    ) : (
                      <a key={l.href} href={l.href}>
                        {l.label}
                      </a>
                    ),
                  )}
                </p>
                <p className="bl-author-d">
                  Published <time dateTime={post.published}>{longDate(post.published)}</time>. Every number in this article is from our own projects or
                  price list; where we do not have a figure, we say so.
                </p>
              </div>
            </footer>
          </div>
        </div>
      </article>

      {others.length ? (
        <section className="k-page bl-more" aria-labelledby="bl-more-h">
          <h2 className="bl-more-h" id="bl-more-h">
            More from the blog
          </h2>
          <BlogGrid posts={others.slice(0, 3)} />
        </section>
      ) : null}

      <Invitation />
    </main>
  )
}
