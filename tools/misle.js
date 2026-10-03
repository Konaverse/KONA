// touch test of the case study's island on a phone: open it, tap a chapter,
// report where the page went.  node tools/misle.js <url> <out.png> [chapter]
const puppeteer = require('puppeteer-core')
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const [url, out, want = 'Result'] = process.argv.slice(2)
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
;(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  await page.evaluateOnNewDocument(() => {
    try { localStorage.setItem('konaverse_cookie_consent', 'declined') } catch {}
  })
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 })
  await wait(1500)
  const mid = (sel, text) =>
    page.evaluate(
      (s, t) => {
        const el = [...document.querySelectorAll(s)].find((x) => !t || x.textContent.trim() === t)
        const r = el.getBoundingClientRect()
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
      },
      sel,
      text,
    )
  const b = await mid('.cx-isle-btn')
  await page.touchscreen.tap(b.x, b.y)
  await wait(900)
  await page.screenshot({ path: out.replace(/\.png$/, '-open.png') })
  const l = await mid('.cx-isle-list a', want)
  await page.touchscreen.tap(l.x, l.y)
  await wait(2600)
  console.log(
    JSON.stringify(
      await page.evaluate(() => ({
        y: Math.round(window.scrollY),
        open: document.querySelector('.cx-isle').classList.contains('is-open'),
        on: document.querySelector('.cx-isle-list li.is-on')?.textContent,
        p: document.querySelector('.cx-isle').style.getPropertyValue('--cx-p'),
      })),
    ),
  )
  await page.screenshot({ path: out.replace(/\.png$/, '-went.png') })
  await browser.close()
})()
