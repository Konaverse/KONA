const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const puppeteer = require('puppeteer-core')
const base = process.argv[3] || 'http://127.0.0.1:3007'
const out = path.resolve('docs/design/homepage-session')
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

async function preparePage(context, mobile = false, blocked = false) {
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.setViewport(mobile
    ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
    : { width: 1440, height: 900, deviceScaleFactor: 1 })
  await page.evaluateOnNewDocument(blocked => {
    localStorage.setItem('konaverse_cookie_consent', 'declined')
    Math.random = () => 0.5
    window.__heroDocument = crypto.randomUUID()
    window.__heroSession = { events: [], morphs: [] }
    for (const name of ['k-peel-armed', 'k-hero-open', 'k-hero-sew', 'k-hero-ready']) {
      window.addEventListener(name, () => window.__heroSession.events.push({ name, time: performance.now() }))
    }
    const morphs = new WeakMap()
    const uniform = WebGLRenderingContext.prototype.getUniformLocation
    WebGLRenderingContext.prototype.getUniformLocation = function (program, name) {
      const location = uniform.call(this, program, name)
      if (this.canvas.classList.contains('hp-canvas') && name === 'uMorph') morphs.set(this, location)
      return location
    }
    const set = WebGLRenderingContext.prototype.uniform1f
    WebGLRenderingContext.prototype.uniform1f = function (location, value) {
      if (location === morphs.get(this)) window.__heroSession.morphs.push(value)
      return set.call(this, location, value)
    }
    if (blocked) Object.defineProperty(window, 'sessionStorage', {
      get() { throw new DOMException('Storage disabled for this check', 'SecurityError') },
    })
  }, blocked)
  return { page, errors }
}

async function waitHome(page) {
  await page.waitForFunction(() => {
    const main = document.querySelector('.k-shift > .k-pt__view > main.hm')
    return location.pathname === '/' && main?.dataset.heroReady === 'true'
      && !document.documentElement.classList.contains('k-pt-active')
      && Number(getComputedStyle(main.querySelector('.hw-para')).opacity) === 1
  }, { timeout: 30000 })
}

async function navigate(page, selector, pathname) {
  await page.click(selector)
  await page.waitForFunction(pathname => location.pathname === pathname
    && !document.documentElement.classList.contains('k-pt-active')
    && !document.querySelector('.k-pt__ghost'), { timeout: 30000 }, pathname)
  if (pathname === '/') await waitHome(page)
}

async function resetProbe(page) {
  await page.evaluate(() => {
    window.__heroSession.events = []
    window.__heroSession.morphs = []
  })
}

async function snapshot(page) {
  return page.evaluate(() => {
    const main = document.querySelector('.k-shift > .k-pt__view > main.hm')
    let stored
    try { stored = sessionStorage.getItem('konaverse_home_entrance_seen') } catch { stored = 'blocked' }
    return {
      ...window.__heroSession,
      document: window.__heroDocument,
      entrance: main.dataset.heroEntrance,
      ready: main.dataset.heroReady,
      pre: main.querySelector('.hw-flow').classList.contains('is-pre'),
      copyOpacity: getComputedStyle(main.querySelector('.hw-para')).opacity,
      imageOpacity: getComputedStyle(main.querySelector('.hw-mimg')).opacity,
      wordOpacities: [...main.querySelectorAll('.hw-w')].map(el => getComputedStyle(el).opacity),
      pillWidths: [...main.querySelectorAll('.hw-pill')].map(el => el.getBoundingClientRect().width),
      live: main.classList.contains('hm-glhero'),
      stored,
    }
  })
}

function assertSkipped(state, name) {
  assert.equal(state.entrance, 'skip', name + ': same-session visit skips entrance')
  assert.equal(state.pre, false, name + ': headline settled')
  assert.equal(state.copyOpacity, '1', name + ': copy visible')
  assert.equal(state.imageOpacity, '1', name + ': video visible')
  assert.ok(state.wordOpacities.every(value => value === '1'), name + ': every word visible')
  assert.equal(state.events.some(event => ['k-hero-open', 'k-hero-sew'].includes(event.name)), false, name + ': no entrance cues')
  assert.ok(state.morphs.every(value => value === 0), name + ': no fullscreen carve')
}

async function main() {
  fs.mkdirSync(out, { recursive: true })
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--force-device-scale-factor=1'],
  })
  const results = []
  try {
    for (const mobile of [false, true]) {
      const context = await browser.createBrowserContext()
      const { page, errors } = await preparePage(context, mobile)
      const mode = mobile ? 'mobile' : 'desktop'
      if (mobile) {
        await page.goto(base + '/privacy', { waitUntil: 'load' })
        assert.equal(await page.evaluate(() => sessionStorage.getItem('konaverse_home_entrance_seen')), null, 'other pages do not consume homepage entrance')
        await navigate(page, '.k-nav-brand', '/')
      } else {
        await page.goto(base + '/', { waitUntil: 'load' })
        await waitHome(page)
      }
      const first = await snapshot(page)
      assert.equal(first.entrance, 'play', mode + ': first session visit plays')
      assert.equal(first.stored, '1', mode + ': session remembers homepage visit')
      assert.ok(first.events.some(event => event.name === 'k-hero-sew'), mode + ': original entrance still runs')
      assert.ok(first.morphs.some(value => value > 0), mode + ': original cover still carves')
      await page.screenshot({ path: path.join(out, mode + '-first.png') })

      await navigate(page, '.k-nav-contact', '/contact')
      await resetProbe(page)
      await navigate(page, '.k-nav-brand', '/')
      const returned = await snapshot(page)
      assertSkipped(returned, mode + ' return')
      assert.equal(returned.document, first.document, mode + ': real client navigation')
      assert.equal(returned.live, false, mode + ': DOM video owns resting hero')
      await page.screenshot({ path: path.join(out, mode + '-return.png') })
      if (!mobile) {
        await wait(3300)
        assert.notDeepEqual((await snapshot(page)).pillWidths, returned.pillWidths, 'desktop: ongoing headline walk preserved')
      }

      await page.evaluate(() => {
        const claim = document.querySelector('.k-shift > .k-pt__view .hm-claim')
        window.scrollTo({ top: scrollY + claim.getBoundingClientRect().top - innerHeight * 0.5, behavior: 'instant' })
      })
      await wait(700)
      const folded = await snapshot(page)
      assert.equal(folded.live, true, mode + ': scroll fold remains active on return')
      assert.ok(folded.morphs.every(value => value === 0), mode + ': scroll cannot restart entrance')
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
      await wait(700)

      await resetProbe(page)
      await page.goBack()
      await page.waitForFunction(() => location.pathname === '/contact')
      await page.goForward()
      await waitHome(page)
      const history = await snapshot(page)
      assertSkipped(history, mode + ' history')

      await page.reload({ waitUntil: 'load' })
      await waitHome(page)
      const reloaded = await snapshot(page)
      assertSkipped(reloaded, mode + ' refresh')
      assert.notEqual(reloaded.document, first.document, mode + ': reload creates a new document')
      assert.equal(errors.length, 0, mode + ': runtime errors')
      results.push({ mode, first, returned, history, reloaded, errors })
      console.log(mode + ': first entrance, client return, ongoing motion, back/forward and refresh passed')
      await context.close()
    }

    for (const scenario of ['fresh-session', 'leave-during-entrance', 'storage-blocked']) {
      const context = await browser.createBrowserContext()
      const { page, errors } = await preparePage(context, true, scenario === 'storage-blocked')
      await page.goto(base + '/', { waitUntil: 'load' })
      await page.waitForFunction(() => document.querySelector('main.hm')?.dataset.heroEntrance === 'play')
      if (scenario === 'leave-during-entrance') {
        assert.notEqual(await page.$eval('main.hm', el => el.dataset.heroReady), 'true', 'leave while first entrance is pending')
      } else await waitHome(page)
      if (scenario !== 'fresh-session') {
        await navigate(page, '.k-nav-contact', '/contact')
        await resetProbe(page)
        await navigate(page, '.k-nav-brand', '/')
        assertSkipped(await snapshot(page), scenario)
      }
      assert.equal(errors.length, 0, scenario + ': runtime errors')
      results.push({ scenario, state: await snapshot(page), errors })
      console.log(scenario + ': passed')
      await context.close()
    }
    fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(results, null, 2))
  } finally { await browser.close() }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
