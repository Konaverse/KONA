/* Check the user's card-alignment contract against a local production server. */
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const puppeteer = require('puppeteer-core')

const base = process.argv[2] || 'http://127.0.0.1:3010'
const out = path.resolve('docs/design/blog-carousel')
const pause = ms => new Promise(resolve => setTimeout(resolve, ms))

async function capture(page, name) {
  // Capture only the viewport. Expanding Chrome's capture surface to a section
  // outside the viewport can reset native scroll-snap positions.
  await page.screenshot({ path: path.join(out, name), captureBeyondViewport: false })
}

async function aligned(page, index) {
  await page.waitForFunction(index => {
    const root = document.querySelector('.bl-carousel')
    const track = root?.querySelector('.bl-track')
    const card = track?.querySelectorAll('.bl-card')[index]
    return root?.dataset.activeIndex === String(index) && card &&
      Math.abs(card.getBoundingClientRect().left - track.getBoundingClientRect().left) <= 1
  }, { timeout: 6000 }, index)
  await pause(350)
  const geometry = await page.evaluate(index => {
    const track = document.querySelector('.bl-track')
    const cards = track.querySelectorAll('.bl-card')
    const edge = track.getBoundingClientRect().left
    return {
      index,
      alignment: cards[index].getBoundingClientRect().left - edge,
      previousRight: index > 0 ? cards[index - 1].getBoundingClientRect().right - edge : null,
      overflow: getComputedStyle(track).overflowX,
      pageOverflow: document.documentElement.scrollWidth - innerWidth,
      status: document.querySelector('.bl-carousel-status').textContent.trim(),
      previousDisabled: document.querySelector('[aria-label="Previous article"]').disabled,
      nextDisabled: document.querySelector('[aria-label="Next article"]').disabled,
      count: cards.length,
    }
  }, index)
  assert.ok(Math.abs(geometry.alignment) <= 1, 'active card aligns to the crop edge')
  if (index > 0) assert.ok(geometry.previousRight <= 0, 'previous card is entirely behind the crop edge')
  assert.equal(geometry.overflow, 'auto')
  assert.ok(geometry.pageOverflow <= 1, 'carousel does not widen the page')
  assert.equal(geometry.status, `Article ${index + 1} of ${geometry.count}`)
  assert.equal(geometry.previousDisabled, index === 0)
  assert.equal(geometry.nextDisabled, index === geometry.count - 1)
  return geometry
}

async function open(browser, viewport, options = {}) {
  const page = await browser.newPage()
  await page.setViewport(viewport)
  if (options.reduce) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  if (options.noJs) await page.setJavaScriptEnabled(false)
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('konaverse_cookie_consent', 'declined')
    sessionStorage.setItem('konaverse_home_entrance_seen', '1')
  })
  await page.goto(base, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('.bl-track .bl-card')
  if (!options.noJs) await page.waitForSelector('.bl-carousel[data-ready]')
  await page.evaluate(() => document.querySelector('.bl-row-in').scrollIntoView({ block: 'center' }))
  await pause(1800)
  return page
}

async function main() {
  fs.mkdirSync(out, { recursive: true })
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--enable-unsafe-swiftshader', '--use-gl=angle'],
  })
  const checks = []
  try {
    const page = await open(browser, { width: 1440, height: 900, deviceScaleFactor: 1 })
    const first = await aligned(page, 0)
    assert.ok(first.count >= 3, 'production fixture has enough posts to test multiple steps')
    const controls = await page.evaluate(() => {
      const nav = document.querySelector('.bl-carousel-nav').getBoundingClientRect()
      const track = document.querySelector('.bl-track').getBoundingClientRect()
      const button = document.querySelector('.bl-carousel-arrow')
      const rect = button.getBoundingClientRect()
      return { above: nav.bottom <= track.top, circular: getComputedStyle(button).borderRadius === '50%', size: Math.min(rect.width, rect.height) }
    })
    assert.equal(controls.above, true)
    assert.equal(controls.circular, true)
    assert.ok(controls.size >= 44, 'controls provide at least a 44px target')
    await capture(page, 'desktop-first.png')
    await page.click('[aria-label="Next article"]')
    checks.push({ case: 'desktop-next', ...await aligned(page, 1) })
    await pause(900)
    await capture(page, 'desktop-second.png')
    await aligned(page, 1)
    await page.click('[aria-label="Previous article"]')
    await aligned(page, 0)
    await page.evaluate(() => {
      const next = document.querySelector('[aria-label="Next article"]')
      next.click()
      next.click()
    })
    checks.push({ case: 'rapid-clicks', ...await aligned(page, 2) })
    const last = first.count - 1
    await page.focus('.bl-track')
    await page.keyboard.press('End')
    checks.push({ case: 'keyboard-last', ...await aligned(page, last) })
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 })
    checks.push({ case: 'resize-keeps-last', ...await aligned(page, last) })
    await page.evaluate(() => document.querySelector('.bl-row-in').scrollIntoView({ block: 'center' }))
    await pause(900)
    await capture(page, 'mobile-last.png')
    await page.focus('.bl-track')
    await page.keyboard.press('Home')
    await aligned(page, 0)
    await page.keyboard.press('ArrowRight')
    checks.push({ case: 'keyboard-next-mobile', ...await aligned(page, 1) })
    await page.close()

    const touch = await open(browser, { width: 390, height: 844, deviceScaleFactor: 1, hasTouch: true, isMobile: true })
    const box = await touch.$eval('.bl-track', el => {
      const rect = el.getBoundingClientRect()
      return { x: rect.left + rect.width * 0.85, y: Math.max(100, Math.min(innerHeight - 100, rect.top + 100)), distance: rect.width * 0.65 }
    })
    const client = await touch.createCDPSession()
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box.x, y: box.y }] })
    for (let step = 1; step <= 10; step++) {
      await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: box.x - box.distance * step / 10, y: box.y }] })
      await pause(50)
    }
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await touch.waitForFunction(() => Number(document.querySelector('.bl-carousel').dataset.activeIndex) > 0)
    const swiped = await touch.$eval('.bl-carousel', el => Number(el.dataset.activeIndex))
    checks.push({ case: 'native-touch-swipe', ...await aligned(touch, swiped) })
    await pause(900)
    await capture(touch, 'mobile-swipe.png')
    await touch.close()

    const reduced = await open(browser, { width: 1440, height: 900, deviceScaleFactor: 1 }, { reduce: true })
    const immediate = await reduced.evaluate(() => {
      document.querySelector('[aria-label="Next article"]').click()
      const track = document.querySelector('.bl-track')
      return Math.abs(track.querySelectorAll('.bl-card')[1].getBoundingClientRect().left - track.getBoundingClientRect().left)
    })
    assert.ok(immediate <= 1, 'reduced motion moves immediately')
    checks.push({ case: 'reduced-motion', ...await aligned(reduced, 1) })
    await reduced.close()

    const noJs = await open(browser, { width: 390, height: 844, deviceScaleFactor: 1, hasTouch: true, isMobile: true }, { noJs: true })
    const fallback = await noJs.evaluate(() => ({
      links: [...document.querySelectorAll('.bl-track .bl-card-a')].map(a => a.getAttribute('href')),
      opacity: getComputedStyle(document.querySelector('.bl-track .bl-card')).opacity,
      controlsHidden: getComputedStyle(document.querySelector('.bl-carousel-nav')).display === 'none',
    }))
    assert.equal(fallback.links.length, first.count)
    assert.ok(fallback.links.every(href => href.startsWith('/blog/')))
    assert.equal(fallback.opacity, '1')
    assert.equal(fallback.controlsHidden, true)
    checks.push({ case: 'no-javascript', ...fallback })
    await capture(noJs, 'mobile-no-js.png')
    await noJs.close()
    fs.writeFileSync(path.join(out, 'checks.json'), JSON.stringify(checks, null, 2) + '\n')
    console.log(JSON.stringify(checks, null, 2))
    console.log('PASS: leading-edge alignment, full clipping, final-card travel, rapid clicks, resize, keyboard, touch, reduced motion and server-rendered fallback.')
  } finally {
    await browser.close()
  }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
