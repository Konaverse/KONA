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
  if (process.env.PREVIEW_GRADE === '1') {
    const { PREVIEW_GRADE } = require('./preview-grade')
    await page.addStyleTag({ content: PREVIEW_GRADE })
    await new Promise((r) => setTimeout(r, 300))
  }

  // the reveal system starts everything at opacity 0 and switches it on with
  // an IntersectionObserver; headless still runs those, but give fonts + the
  // entrance a beat to land before we look.
  await new Promise((r) => setTimeout(r, 2500))
  if (sel) {
    await page.evaluate((s) => {
      const el = document.querySelector(s)
      if (el) el.scrollIntoView({ block: 'start' })
    }, sel)
    await new Promise((r) => setTimeout(r, 1600))
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
