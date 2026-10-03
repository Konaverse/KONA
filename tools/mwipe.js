// desktop check of the CTA title's wipe: scroll the Invitation in, sample each
// wipe line's left/right against the heading's box while the wipe plays
//   node tools/mwipe.js <url> <out.png>
const puppeteer = require('puppeteer-core')
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const [url, out] = process.argv.slice(2)
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
;(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1536, height: 730, deviceScaleFactor: 1 })
  await page.evaluateOnNewDocument(() => {
    try { localStorage.setItem('konaverse_cookie_consent', 'declined') } catch {}
  })
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 })
  await wait(1200)
  const read = () =>
    page.evaluate(() => {
      const h = document.querySelector('.inv-line')
      const r = h.getBoundingClientRect()
      const mid = (r.left + r.right) / 2
      return [...h.querySelectorAll('.k-wipe-l')].map((l) => {
        const b = l.getBoundingClientRect()
        return Math.round((b.left + b.right) / 2 - mid)
      })
    })
  console.log('line centres vs heading centre, before:', JSON.stringify(await read()))
  await page.evaluate(() => document.querySelector('.inv-line').scrollIntoView({ block: 'center' }))
  await wait(650)
  console.log('mid-wipe:', JSON.stringify(await read()))
  await page.screenshot({ path: out })
  await browser.close()
})()
