import ArrowLink from '@/components/v4/ArrowLink'
import Reveal from '@/components/v4/Reveal'
import { AUTHORS, longDate, readMinutes, type BlogPost } from '@/lib/blog-posts'
import './blog.css'

/**
 * THE BLOG'S CARDS (2026-10-03) — one card, two settings:
 *
 *   BlogCard   the picture, the topic and the reading time, the title, two
 *              lines, the byline. The whole card is one link; the title is
 *              the link's text (the picture is decoration: alt "").
 *   BlogRow    the homepage's section under the work (owner: "a section in
 *              the homepage below the projects for the blogs. A nice
 *              horizontally cards aligned section"): a head, and the cards
 *              in ONE ROW. Two fill the page; from the third on the row
 *              scrolls sideways and snaps, on a trackpad and under a finger.
 *
 * Server components: every word is in the HTML. The entrance is the house
 * reveal. Hover (a pointer that can hover only) closes in on the picture
 * and steps the arrow; touch gets the arrow drawn.
 */

export function BlogCard({ post, index = 0, level = 'h3' }: { post: BlogPost; index?: number; level?: 'h2' | 'h3' }) {
  const Title = level
  const author = AUTHORS[post.author]
  return (
    <Reveal as="div" className="bl-card" index={index}>
      <a className="bl-card-a" href={`/blog/${post.slug}`}>
        <span className="bl-card-pic">
          <img
            src={post.cover.src}
            alt=""
            width={post.cover.width}
            height={post.cover.height}
            loading="lazy"
            decoding="async"
            draggable={false}
            style={post.cover.position ? { objectPosition: post.cover.position } : undefined}
          />
        </span>
        <span className="bl-card-meta">
          <span>{post.topic}</span>
          <span>{readMinutes(post)} min read</span>
        </span>
        <Title className="bl-card-t">{post.title}</Title>
        <span className="bl-card-x">{post.excerpt}</span>
        <span className="bl-card-by">
          <span>
            {author.name}, <time dateTime={post.published}>{longDate(post.published)}</time>
          </span>
          <svg className="bl-card-go" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
            <path d="M2 8 L13 8" />
            <path d="M9 4.5 L13 8 L9 11.5" />
          </svg>
        </span>
      </a>
    </Reveal>
  )
}

export function BlogRow({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) return null
  return (
    <section className="bl-row" aria-labelledby="bl-row-h">
      <div className="k-page bl-row-head">
        <Reveal masked as="h2" className="bl-row-h">
          <span id="bl-row-h">From the blog</span>
        </Reveal>
        <Reveal as="div" className="bl-row-side" index={1}>
          <p className="bl-row-p">What websites cost and how we build them, answered with our own numbers.</p>
          <ArrowLink href="/blog">All articles</ArrowLink>
        </Reveal>
      </div>
      {/* the row scrolls sideways on its own; the page's scroll is not its business */}
      <div className="bl-track" data-count={posts.length}>
        {posts.map((p, i) => (
          <BlogCard key={p.slug} post={p} index={i} />
        ))}
      </div>
    </section>
  )
}
