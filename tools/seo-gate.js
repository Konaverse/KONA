#!/usr/bin/env node
/**
 * THE SEO GATE (SEO plan v3 §2, 2026-10-02). Crawls every URL in the
 * sitemap plus the redirect map and fails on anything that would cost
 * rankings. Run it against a local production build before every deploy
 * that touches pages, and against the live domain right after.
 *
 *   node tools/seo-gate.js                      # http://localhost:3005
 *   node tools/seo-gate.js https://kona-verse.com
 *
 * Checks per page: 200, no redirect; self-canonical on the apex host;
 * exactly one <h1> whose text has spaces; a <title> and a meta
 * description; og:image present; no noindex (meta or header); every
 * JSON-LD block parses and carries no retired or ineligible type
 * (FAQPage, HowTo, QAPage, Review, AggregateRating — plan §3); no
 * content <img> without an alt ATTRIBUTE (alt="" is allowed: decoration
 * is the author's call, the gate only catches a forgotten attribute);
 * HTML under Googlebot's 2 MB cap.
 * Redirects: single hop, permanent where the map says so, target 200.
 */
const BASE = (process.argv[2] || 'http://localhost:3005').replace(/\/$/, '')
const CANON = 'https://kona-verse.com'
const BANNED_TYPES = ['FAQPage', 'HowTo', 'QAPage', 'Review', 'AggregateRating']

/** [from, to, permanent] — keep in step with next.config.ts */
const REDIRECTS = [
  ['/index', '/', true],
  ['/projects', '/work', true],
  ['/projects/web-development', '/work', true],
  ['/services/videography', '/services', true],
  ['/pricing', '/services', true],
  ['/blog', '/', false],
]
const GONE = ['/llms.txt', '/about.md', '/services/videography.md']

const fails = []
const fail = (url, msg) => fails.push(`${url}  ${msg}`)

const text = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i'))
  return m ? (m[2] ?? m[3]) : null
}

async function checkPage(path) {
  const url = BASE + path
  const res = await fetch(url, { redirect: 'manual' })
  if (res.status !== 200) return fail(path, `status ${res.status}`)
  const html = await res.text()
  const xr = res.headers.get('x-robots-tag') || ''
  if (/noindex/i.test(xr)) fail(path, `X-Robots-Tag: ${xr}`)
  if (Buffer.byteLength(html) > 2 * 1024 * 1024) fail(path, 'HTML over 2 MB')

  const head = html.slice(0, html.indexOf('</head>') + 7)
  const metas = head.match(/<meta[^>]+>/gi) || []
  const meta = (key) => metas.find((m) => attr(m, 'name') === key || attr(m, 'property') === key)
  for (const m of metas) {
    if (/^(robots|googlebot)$/i.test(attr(m, 'name') || '') && /noindex/i.test(attr(m, 'content') || ''))
      fail(path, `meta ${attr(m, 'name')}: ${attr(m, 'content')}`)
  }
  if (!/<title>[^<]+<\/title>/.test(head)) fail(path, 'no <title>')
  if (!attr(meta('description') || '', 'content')) fail(path, 'no meta description')
  if (!attr(meta('og:image') || '', 'content')) fail(path, 'no og:image')

  const canon = (head.match(/<link[^>]+rel="canonical"[^>]*>/i) || [])[0]
  const want = CANON + (path === '/' ? '' : path)
  if (!canon) fail(path, 'no canonical')
  else if (attr(canon, 'href') !== want) fail(path, `canonical ${attr(canon, 'href')} != ${want}`)

  const h1s = html.match(/<h1[\s>][\s\S]*?<\/h1>/gi) || []
  if (h1s.length !== 1) fail(path, `${h1s.length} <h1>`)
  else {
    const t = text(h1s[0])
    if (!t) fail(path, 'empty <h1> text')
    else if (t.length > 12 && !t.includes(' ')) fail(path, `<h1> text has no spaces: "${t}"`)
  }

  for (const block of html.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi) || []) {
    const raw = block.replace(/^<script[^>]*>/, '').replace(/<\/script>$/, '')
    let data
    try {
      data = JSON.parse(raw)
    } catch {
      fail(path, 'JSON-LD does not parse')
      continue
    }
    const types = JSON.stringify(data).match(/"@type":("[^"]+"|\[[^\]]*\])/g) || []
    for (const b of BANNED_TYPES) if (types.some((t) => t.includes(`"${b}"`))) fail(path, `JSON-LD carries ${b}`)
    if (/"[^"]+":(""|null)/.test(JSON.stringify(data))) fail(path, 'JSON-LD has an empty value')
  }

  const imgs = html.match(/<img\b[^>]*>/gi) || []
  const noAlt = imgs.filter((i) => attr(i, 'alt') === null)
  if (noAlt.length) fail(path, `${noAlt.length} <img> without alt: ${attr(noAlt[0], 'src')}`)
  const described = imgs.filter((i) => (attr(i, 'alt') || '').trim()).length
  return { path, imgs: imgs.length, described, h1: h1s[0] ? text(h1s[0]).slice(0, 70) : '' }
}

async function checkRedirect([from, to, permanent]) {
  const res = await fetch(BASE + from, { redirect: 'manual' })
  const loc = res.headers.get('location') || ''
  const want = permanent ? [301, 308] : [302, 307]
  if (!want.includes(res.status)) return fail(from, `redirect status ${res.status}, want ${want.join('/')}`)
  const target = new URL(loc, BASE)
  if (target.pathname !== to) return fail(from, `redirects to ${target.pathname}, want ${to}`)
  const hop = await fetch(new URL(to, BASE), { redirect: 'manual' })
  if (hop.status !== 200) fail(from, `target ${to} returns ${hop.status} (chain or dead end)`)
}

async function main() {
  const sm = await (await fetch(`${BASE}/sitemap.xml`)).text()
  const paths = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname || '/')
  if (!paths.length) fail('/sitemap.xml', 'no URLs')
  const rows = []
  for (const p of paths) {
    const r = await checkPage(p)
    if (r) rows.push(r)
  }
  for (const r of REDIRECTS) await checkRedirect(r)
  for (const g of GONE) {
    const res = await fetch(BASE + g, { redirect: 'manual' })
    if (res.status !== 404 && res.status !== 410) fail(g, `should be gone, returns ${res.status}`)
  }
  const robots = await (await fetch(`${BASE}/robots.txt`)).text()
  if (/Disallow:\s*\/\s*$/m.test(robots)) fail('/robots.txt', 'disallows the whole site')

  for (const r of rows) console.log(`${r.path.padEnd(32)} img ${String(r.described).padStart(2)}/${String(r.imgs).padEnd(3)} h1 "${r.h1}"`)
  console.log(`\n${paths.length} pages, ${REDIRECTS.length} redirects, ${GONE.length} retired URLs checked against ${BASE}`)
  if (fails.length) {
    console.log(`\nFAIL (${fails.length})\n  ` + fails.join('\n  '))
    process.exit(1)
  }
  console.log('PASS')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
