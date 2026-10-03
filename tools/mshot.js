// phone-viewport shots: node tools/mshot.js <url> <out.png> [scrollY,scrollY,...|end]
// touch + mobile emulation at 390x844 @2x; each scroll offset writes out-<n>.png
const puppeteer = require('puppeteer-core')
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const [url, out, stops] = process.argv.slice(2)
;(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'] })
  const page = await browser.newPage()
  await page.setViewport({
    width: Number(process.env.SHOT_W || 390),
    height: Number(process.env.SHOT_H || 844),
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })
  await page.evaluateOnNewDocument(() => {
    try { localStorage.setItem('konaverse_cookie_consent', 'declined') } catch {}
  })
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 })
  await new Promise((r) => setTimeout(r, 1500))
  if (process.env.EVAL) console.log(JSON.stringify(await page.evaluate(process.env.EVAL)))
  const list = (stops || '0').split(',')
  for (let i = 0; i < list.length; i++) {
    const y = list[i] === 'end' ? await page.evaluate(() => document.documentElement.scrollHeight) : Number(list[i])
    // stepped, so scroll-driven drivers see the travel
    const from = await page.evaluate(() => window.scrollY)
    const n = 24
    for (let s = 1; s <= n; s++) {
      await page.evaluate((v) => window.scrollTo(0, v), from + ((y - from) * s) / n)
      await new Promise((r) => setTimeout(r, 30))
    }
    await new Promise((r) => setTimeout(r, Number(process.env.SHOT_WAIT || 900)))
    if (process.env.EVAL_AFTER) console.log(JSON.stringify(await page.evaluate(process.env.EVAL_AFTER)))
    await page.screenshot({ path: list.length > 1 ? out.replace(/\.png$/, `-${i}.png`) : out })
  }
  await browser.close()
})()
