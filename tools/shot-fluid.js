/**
 * Film the fluid cursor where it actually is: a pointer-driven effect that
 * paints nothing until something moves. Puppeteer drives a stroke across the
 * viewport, then captures mid-trail.
 *
 * The fluid mounts only for `(hover: hover)` and non-reduced motion, so the
 * page has to be told it is a hover machine before React decides.
 *
 *   node tools/shot-fluid.js <url> <out.png> [y-fraction] [x0] [x1]
 */
const puppeteer = require('puppeteer-core')
const CHROME =
  process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const [url, out, yFrac = '0.5', x0 = '0.10', x1 = '0.92', scrollTo = ''] = process.argv.slice(2)
const W = 1440
const H = 900

;(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      // headless has no GPU by default and the fluid is WebGL; without these
      // the canvas silently never renders and the shot is a clean page.
      '--enable-unsafe-swiftshader',
      '--use-gl=angle',
    ],
  })
  const page = await browser.newPage()
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1, hasTouch: false })
  // NOTE: no matchMedia emulation. Headless Chrome already reports
  // `(hover: hover)` true and reduced-motion false, which is what the fluid's
  // mount gate reads. An earlier version stubbed matchMedia to force it and
  // that broke ApertureMenu's hydration, leaving the overlay rendered OPEN
  // over every shot — the menu is open in the no-JS markup by design.
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })
  await new Promise((r) => setTimeout(r, 3000))

  if (process.env.PREVIEW_GRADE === '1') {
    const { PREVIEW_GRADE } = require('./preview-grade')
    await page.addStyleTag({ content: PREVIEW_GRADE })
    await new Promise((r) => setTimeout(r, 300))
  }

  // park the section under test in the viewport before stroking. A selector
  // scrolls to that element; a bare number is a scrollY in px.
  if (scrollTo) {
    await page.evaluate((t) => {
      const n = Number(t)
      if (Number.isFinite(n)) window.scrollTo(0, n)
      else document.querySelector(t)?.scrollIntoView({ block: 'center' })
    }, scrollTo)
    await new Promise((r) => setTimeout(r, 1500))
  }

  const y = Math.round(H * parseFloat(yFrac))
  const ax = Math.round(W * parseFloat(x0))
  const bx = Math.round(W * parseFloat(x1))

  // one continuous stroke — the sim needs velocity, so a teleport paints a dot
  await page.mouse.move(ax, y)
  const STEPS = Number(process.env.FLUID_STEPS || 18)
  for (let i = 1; i <= STEPS; i++) {
    const t = i / STEPS
    await page.mouse.move(
      Math.round(ax + (bx - ax) * t),
      Math.round(y + Math.sin(t * Math.PI * 1.6) * 90),
    )
    await new Promise((r) => setTimeout(r, Number(process.env.FLUID_STEP_MS || 8)))
  }
  // catch it while the dye is still dense; the tail is gone in ~0.7s
  await new Promise((r) => setTimeout(r, Number(process.env.FLUID_SETTLE_MS || 40)))
  await page.screenshot({ path: out })
  await browser.close()
  console.log('fluid shot:', out)
})().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
