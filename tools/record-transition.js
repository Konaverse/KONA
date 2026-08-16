/* Film the page transition (or any v4 motion) as a frame sequence.
 *
 * Why this exists: every tab the agent can see is throttled to 0fps — rAF
 * never fires there, so GSAP freezes and motion cannot be judged. Headless
 * Chrome runs rAF normally; this records the real thing via CDP screencast.
 *
 *   node tools/record-transition.js <outdir> [fromPath] [toPath] [timeScale] [scrollY]
 *
 *   outdir     where the frames land (t<ms>_i<n>.png, ms from recording start)
 *   fromPath   route to start on            (default /design-system)
 *   toPath     route to navigate to         (default /work)
 *   timeScale  gsap globalTimeline scale — 0.25 films the move in 4x detail
 *              (needs the dev-only window.__gsap handle from motion-v4.ts)
 *   scrollY    scroll depth before clicking (default 0)
 *
 * Contact sheet afterwards (ffmpeg needs a numeric sequence, so re-index):
 *   i=0; for f in out/t*.png; do cp "$f" "out/seq$(printf %03d $i).png"; i=$((i+1)); done
 *   ffmpeg -framerate 30 -i out/seq%03d.png -vf "scale=320:-1,tile=6x5" sheet%d.png
 *
 * Assumes `npm run dev` is serving on :3000 (override with BASE_URL).
 */
const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer-core')

const OUT = process.argv[2] || 'transition-strip'
const FROM = process.argv[3] || '/design-system'
const TO = process.argv[4] || '/work'
const TIMESCALE = parseFloat(process.argv[5] || '1')
const SCROLL = parseInt(process.argv[6] || '0', 10)
const BASE = process.env.BASE_URL || 'http://localhost:3000'
const CHROME =
  process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

;(async () => {
  fs.mkdirSync(OUT, { recursive: true })
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--window-size=1934,1020', '--hide-scrollbars', '--force-device-scale-factor=1'],
  })
  const page = await browser.newPage()
  // 1918x900 = the reference recording's frame, so strips compare 1:1
  await page.setViewport({ width: 1918, height: 900, deviceScaleFactor: 1 })
  await page.evaluateOnNewDocument(() => {
    try { localStorage.setItem('konaverse_cookie_consent', 'declined') } catch {}
  })

  const consoleLines = []
  page.on('console', (m) => consoleLines.push(`[${m.type()}] ${m.text()}`))
  page.on('pageerror', (e) => consoleLines.push(`[pageerror] ${e.message}`))

  // Warm both routes so dev-mode compilation doesn't distort the recorded run.
  await page.goto(BASE + TO, { waitUntil: 'networkidle2', timeout: 60000 })
  await page.goto(BASE + FROM, { waitUntil: 'networkidle2', timeout: 60000 })
  await new Promise((r) => setTimeout(r, 1500)) // let the entry reveals finish

  if (SCROLL > 0) {
    await page.evaluate((y) => window.scrollTo(0, y), SCROLL)
    await new Promise((r) => setTimeout(r, 800))
  }
  if (TIMESCALE !== 1) {
    await page.evaluate((ts) => {
      if (window.__gsap) window.__gsap.globalTimeline.timeScale(ts)
    }, TIMESCALE)
  }

  const cdp = await page.createCDPSession()
  const frames = []
  let t0 = null
  cdp.on('Page.screencastFrame', async (ev) => {
    const t = ev.metadata.timestamp * 1000
    if (t0 === null) t0 = t
    frames.push({ t: t - t0, data: ev.data })
    try { await cdp.send('Page.screencastFrameAck', { sessionId: ev.sessionId }) } catch {}
  })
  await cdp.send('Page.startScreencast', { format: 'png', everyNthFrame: 1 })

  await new Promise((r) => setTimeout(r, 300))
  const clicked = await page.evaluate((to) => {
    const a = [...document.querySelectorAll('a')].find(
      (x) => new URL(x.href, location.href).pathname === to,
    )
    if (!a) return false
    a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }))
    return true
  }, TO)
  if (!clicked) throw new Error(`no link to ${TO} found on ${FROM}`)

  await new Promise((r) => setTimeout(r, Math.max(2500, 2500 / TIMESCALE)))
  await cdp.send('Page.stopScreencast')

  frames.forEach((f, i) => {
    const name = `t${String(Math.round(f.t)).padStart(5, '0')}_i${String(i).padStart(3, '0')}.png`
    fs.writeFileSync(path.join(OUT, name), Buffer.from(f.data, 'base64'))
  })
  fs.writeFileSync(path.join(OUT, 'console.txt'), consoleLines.join('\n'))
  console.log(`frames: ${frames.length}, span: ${Math.round(frames[frames.length - 1].t)}ms`)
  await browser.close()
})().catch((e) => { console.error(e); process.exit(1) })
