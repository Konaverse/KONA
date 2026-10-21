// Submit every URL in the live sitemap to IndexNow (Bing, and the engines sharing it).
// Run after a deploy that adds or changes pages:  node tools/submit-indexnow.cjs
// Submit only some pages:                          node tools/submit-indexnow.cjs /blog/some-slug /pricing
// The key is the name of the 32-hex .txt file in public/. Engines verify it by fetching
// that file from the live host, so it must be deployed before the first submission.
const fs = require('node:fs')
const path = require('node:path')

const origin = (process.env.NEXT_PUBLIC_SITE_URL || 'https://kona-verse.com').replace(/\/+$/, '')
const only = process.argv.slice(2)

async function main() {
  const keyFile = fs.readdirSync(path.resolve('public')).find(f => /^[0-9a-f]{32}\.txt$/.test(f))
  if (!keyFile) throw new Error('No IndexNow key file (32 hex characters + .txt) found in public/.')
  const key = keyFile.replace(/\.txt$/, '')
  const keyLocation = `${origin}/${keyFile}`

  // Engines reject the whole batch if the live key file is missing or different.
  const live = await fetch(keyLocation, { signal: AbortSignal.timeout(15000) })
  if (!live.ok || (await live.text()).trim() !== key) {
    throw new Error(`The key file at ${keyLocation} is missing or does not match public/${keyFile}. Deploy it first.`)
  }

  let urlList
  if (only.length) {
    urlList = only.map(u => new URL(u, `${origin}/`).href)
  } else {
    const sitemap = await fetch(`${origin}/sitemap.xml`, { signal: AbortSignal.timeout(15000) })
    if (!sitemap.ok) throw new Error(`Sitemap fetch failed: HTTP ${sitemap.status}`)
    urlList = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim())
  }
  // IndexNow rejects the whole batch (422) if any URL is on another host.
  urlList = urlList.filter(u => u === origin || u.startsWith(`${origin}/`))
  if (!urlList.length) throw new Error('No URLs to submit.')

  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: new URL(origin).host, key, keyLocation, urlList }),
    signal: AbortSignal.timeout(20000),
  })
  // 200 OK, 202 Accepted (key validation pending), 4xx = fix the request or the key.
  console.log(`IndexNow responded ${response.status} for ${urlList.length} URL(s):`)
  urlList.forEach(u => console.log(`  ${u}`))
  if (!response.ok) process.exitCode = 1
}

main().catch(error => {
  console.error(error.message || error)
  process.exitCode = 1
})
