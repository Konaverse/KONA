// touch test of the contact FAQ: tap a question, sample the answer's height as it opens
const puppeteer = require('puppeteer-core')
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const [url, out] = process.argv.slice(2)
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
;(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  await page.evaluateOnNewDocument(() => {
    try { localStorage.setItem('konaverse_cookie_consent', 'declined') } catch {}
  })
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 })
  await wait(1200)
  await page.evaluate(() => document.querySelector('.ct-faq-list').scrollIntoView({ block: 'start' }))
  await page.evaluate(() => window.scrollBy(0, -120))
  await wait(1500)
  const p = await page.evaluate(() => {
    const r = document.querySelectorAll('.ct-q summary')[2].getBoundingClientRect()
    return { x: r.left + 60, y: r.top + r.height / 2 }
  })
  await page.touchscreen.tap(p.x, p.y)
  const hs = []
  for (let i = 0; i < 8; i++) {
    await wait(70)
    hs.push(await page.evaluate(() => [...document.querySelectorAll('.ct-q')].map((d) => Math.round(d.querySelector('.ct-a').getBoundingClientRect().height)).slice(0, 3).join('/')))
  }
  console.log(hs.join('  '))
  await wait(700)
  console.log(await page.evaluate(() => [...document.querySelectorAll('.ct-q')].map((d) => (d.open ? 1 : 0)).join('')))
  await page.screenshot({ path: out })
  await browser.close()
})()
