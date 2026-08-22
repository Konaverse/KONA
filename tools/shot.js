const puppeteer = require('puppeteer-core')
const CHROME =
  process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const url = process.argv[2]
const out = process.argv[3]
const sel = process.argv[4] || null

;(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--force-device-scale-factor=1', '--hide-scrollbars'],
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 })
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })
  // ad-hoc CSS for bisecting a visual bug: INJECT_CSS='.foo{display:none}'
  if (process.env.INJECT_CSS) {
    await page.addStyleTag({ content: process.env.INJECT_CSS })
    await new Promise((r) => setTimeout(r, 250))
  }
  if (process.env.PREVIEW_GRADE === '1') {
    const { PREVIEW_GRADE } = require('./preview-grade')
    await page.addStyleTag({ content: PREVIEW_GRADE })
    await new Promise((r) => setTimeout(r, 300))
  }

  // the reveal system starts everything at opacity 0 and switches it on with
  // an IntersectionObserver; headless still runs those, but give fonts + the
  // entrance a beat to land before we look.
  await new Promise((r) => setTimeout(r, 2500))
  // CAUTION: an element shot SCROLLS to the element, and this page is full of
  // scroll-driven work -- the hero peel starts folding on the first scrolled
  // pixel. If what you are judging reacts to scroll, take a viewport shot at
  // rest instead, or you will photograph the effect mid-flight and read it as
  // a rendering bug. Set SHOT_NO_SCROLL=1 to clip without scrolling.
  if (sel) {
    if (process.env.SHOT_NO_SCROLL !== '1') {
      await page.evaluate((s) => {
        const el = document.querySelector(s)
        if (el) el.scrollIntoView({ block: 'start' })
      }, sel)
    }
    await new Promise((r) => setTimeout(r, 1600))
    if (process.env.SHOT_NO_SCROLL === '1') {
      // clip out of the CURRENT viewport rather than handing the element to
      // puppeteer, whose own element screenshot scrolls it into view too
      const box = await page.evaluate((s) => {
        const el = document.querySelector(s)
        if (!el) return null
        const r = el.getBoundingClientRect()
        return { x: Math.max(0, r.x), y: Math.max(0, r.y), width: r.width, height: r.height }
      }, sel)
      if (box && box.width > 0) {
        const W = page.viewport().width
        const H = page.viewport().height
        const clip = {
          x: box.x,
          y: box.y,
          width: Math.min(box.width, W - box.x),
          height: Math.min(box.height, H - box.y),
        }
        await page.screenshot({ path: out, clip })
        await browser.close()
        console.log('shot (clip, no scroll):', out)
        return
      }
    }
    const el = await page.$(sel)
    if (el) {
      await el.screenshot({ path: out })
      await browser.close()
      console.log('shot (element):', out)
      return
    }
  }
  await page.screenshot({ path: out })
  await browser.close()
  console.log('shot (viewport):', out)
})().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
