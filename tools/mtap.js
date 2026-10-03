// touch test of the menu: scroll, tap the burger, tap a link, report the route
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
  await wait(1500)
  for (let s = 1; s <= 20; s++) {
    await page.evaluate((v) => window.scrollTo(0, v), s * 40)
    await wait(30)
  }
  await wait(600)
  const b = await page.evaluate(() => {
    const r = document.querySelector('.k-menu-btn').getBoundingClientRect()
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height }
  })
  console.log('button', JSON.stringify(b))
  await page.screenshot({ path: out.replace(/\.png$/, '-0.png') })
  await page.touchscreen.tap(b.x, b.y)
  await wait(1400)
  console.log('open', await page.evaluate(() => document.querySelector('.k-menu-btn').getAttribute('aria-expanded')))
  await page.screenshot({ path: out.replace(/\.png$/, '-1.png') })
  const l = await page.evaluate(() => {
    const a = [...document.querySelectorAll('.k-under__link')].find((x) => x.textContent.trim() === 'About')
    const r = a.getBoundingClientRect()
    return { x: r.left + 40, y: r.top + r.height / 2 }
  })
  await page.touchscreen.tap(l.x, l.y)
  await wait(3500)
  console.log('route', await page.evaluate(() => location.pathname), 'open', await page.evaluate(() => document.querySelector('.k-menu-btn').getAttribute('aria-expanded')))
  await page.screenshot({ path: out.replace(/\.png$/, '-2.png') })
  await browser.close()
})()
