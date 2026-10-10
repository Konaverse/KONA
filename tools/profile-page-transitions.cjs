/** Production-browser evidence for ordinary links; the aperture menu has its own move. */
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const puppeteer = require('puppeteer-core')
const sharp = require('sharp')
const label = process.argv[2] || 'before'
const base = process.argv[3] || 'http://127.0.0.1:3007'
const out = path.resolve('docs/design/page-transitions', process.argv[4] || label)
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

async function prepare(browser, mobile = false, cpu = 1) {
  const context = await browser.createBrowserContext()
  const page = await context.newPage()
  await page.setViewport(mobile
    ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
    : { width: 1440, height: 900, deviceScaleFactor: 1 })
  const errors = []
  page.on('pageerror', error => {
    errors.push(error.message)
    fs.appendFileSync(path.join(out, 'runtime-errors.log'), error.stack + '\n')
  })
  const cdp = await page.createCDPSession()
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu })
  await cdp.send('LayerTree.enable')
  let maxLayers = 0
  cdp.on('LayerTree.layerTreeDidChange', event => {
    maxLayers = Math.max(maxLayers, event.layers?.length || 0)
  })
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('konaverse_cookie_consent', 'declined')
    sessionStorage.setItem('konaverse_home_entrance_seen', '1')
    Math.random = () => 0.5
    const probe = window.__pageMotion = { runs: [], current: null, contexts: [], document: crypto.randomUUID() }
    const active = () => probe.current && !probe.current.end
    const rect = Element.prototype.getBoundingClientRect
    Element.prototype.getBoundingClientRect = function (...args) {
      if (active()) {
        const key = this.closest('.sr') ? 'service' : this.closest('.hm') ? 'home' : 'shared'
        probe.current.reads[key] = (probe.current.reads[key] || 0) + 1
      }
      return rect.apply(this, args)
    }
    const clone = Node.prototype.cloneNode
    Node.prototype.cloneNode = function (...args) {
      const start = performance.now()
      const result = clone.apply(this, args)
      if (active() && this instanceof Element && this.matches('.k-pt__view')) {
        probe.current.cloneMs = performance.now() - start
        probe.current.clonedNodes = result.querySelectorAll('*').length
      }
      return result
    }
    const context = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (...args) {
      if (/webgl/.test(args[0])) {
        const item = { className: this.className, time: performance.now(), during: !!active() }
        probe.contexts.push(item)
        if (active()) probe.current.contexts.push(item)
      }
      return context.apply(this, args)
    }
    const observer = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        if (active()) probe.current.tasks.push({ start: entry.startTime, duration: entry.duration })
      }
    })
    observer.observe({ type: 'longtask', buffered: true })
    window.addEventListener('k:transition', event => {
      if (event.detail) {
        probe.current = { start: performance.now(), reads: {}, contexts: [], tasks: [], frames: [], from: location.pathname }
        probe.runs.push(probe.current)
      } else if (probe.current) {
        probe.current.end = performance.now()
        probe.current.to = location.pathname
      }
    })
    const insertion = new MutationObserver(() => {
      if (!active() || probe.current.ghost) return
      const ghost = document.querySelector('.k-pt__ghost')
      if (!ghost) return
      probe.current.ghost = {
        nodes: ghost.querySelectorAll('*').length,
        videos: ghost.querySelectorAll('video').length,
        canvases: ghost.querySelectorAll('canvas').length,
        animations: ghost.getAnimations({ subtree: true }).length,
        height: ghost.querySelector('.k-pt__view')?.offsetHeight,
      }
    })
    insertion.observe(document, { childList: true, subtree: true })
    const frame = time => {
      if (active()) {
        const view = document.querySelector('.k-shift > .k-pt__view')
        const inner = document.querySelector('.k-pt__ghost-inner')
        probe.current.frames.push({ time, path: location.pathname,
          view: view ? getComputedStyle(view).transform : '',
          ghost: inner ? getComputedStyle(inner).transform : '',
        })
      }
      requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  })
  return { context, page, errors, resetLayers: () => { maxLayers = 0 }, layers: () => maxLayers }
}

async function link(page, selector, pathname) {
  await page.waitForSelector(selector)
  await page.$eval(selector, el => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
  await wait(700)
  await page.hover(selector)
  await wait(700)
  await page.click(selector)
  await page.waitForFunction(pathname => location.pathname === pathname
    && !document.documentElement.classList.contains('k-pt-active')
    && !document.querySelector('.k-pt__ghost'), { timeout: 30000 }, pathname)
  await wait(250)
}

function summarize(run) {
  const intervals = run.frames.slice(1).map((frame, i) => frame.time - run.frames[i].time)
  return { ...run, frames: undefined, frameCount: run.frames.length,
    elapsedMs: Math.round(run.end - run.start),
    maxFrameMs: Math.round(Math.max(0, ...intervals)),
    framesOver34ms: intervals.filter(value => value > 34).length,
    longTaskMs: Math.round(run.tasks.reduce((sum, item) => sum + item.duration, 0)),
  }
}

async function main() {
  fs.mkdirSync(out, { recursive: true })
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true, args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--force-device-scale-factor=1'],
  })
  const results = []
  try {
    const modes = [{ name: 'desktop', mobile: false, cpu: 1 }, { name: 'mobile', mobile: true, cpu: 1 }, { name: 'desktop-cpu4', mobile: false, cpu: 4 }]
    for (const mode of label === 'final-cpu' ? modes.filter(mode => mode.cpu === 4) : modes) {
      const harness = await prepare(browser, mode.mobile, mode.cpu)
      const { page, context, errors } = harness
      await page.goto(base + '/', { waitUntil: 'load' })
      await page.waitForFunction(() => document.querySelector('main.hm')?.dataset.heroReady === 'true')
      await wait(2000)
      harness.resetLayers()
      await link(page, '.k-shift > .k-pt__view .svs-title-link[href="/services/web-design"]', '/services/web-design')
      const serviceLayers = harness.layers()
      await wait(1200)
      await page.screenshot({ path: path.join(out, mode.name + '-service.png') })
      harness.resetLayers()
      await link(page, '.k-nav-brand', '/')
      const homeLayers = harness.layers()
      await page.waitForFunction(() => document.querySelector('.k-shift > .k-pt__view > main.hm')?.dataset.heroReady === 'true')
      await page.screenshot({ path: path.join(out, mode.name + '-home.png') })
      const probe = await page.evaluate(() => window.__pageMotion)
      fs.writeFileSync(path.join(out, mode.name + '.json'), JSON.stringify({ ...probe, errors }, null, 2))
      if (errors.length) console.log(JSON.stringify({ mode: mode.name, errors }))
      assert.equal(probe.runs.length, 2)
      assert.equal(errors.length, 0, mode.name + ': runtime errors')
      if (label.startsWith('final')) {
        for (const run of probe.runs) {
          assert.equal(run.ghost.animations, 0, 'outgoing still has no animation clocks')
          assert.equal(run.ghost.videos, 0, 'outgoing still has no video decoders')
          assert.equal(run.contexts.length, 0, 'WebGL setup waits until the ordinary slide has ended')
        }
      }
      fs.writeFileSync(path.join(out, mode.name + '.json'), JSON.stringify(probe, null, 2))
      const summary = { mode: mode.name, layers: { service: serviceLayers, home: homeLayers }, runs: probe.runs.map(summarize), errors }
      results.push(summary)
      console.log(JSON.stringify(summary))
      await context.close()
    }
    fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(results, null, 2))
  } finally { await browser.close() }
}

async function checks() {
  fs.mkdirSync(out, { recursive: true })
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true, args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--force-device-scale-factor=1'],
  })
  const results = []
  try {
    for (const mobile of label === 'check-media' ? [true] : [false, true]) {
      const mode = mobile ? 'mobile' : 'desktop'
      for (const scenario of [
        { name: 'hero', route: '/', selector: null },
        { name: 'fold', route: '/', selector: '.hm-claim', offset: 0.6 },
        { name: 'services', route: '/', selector: '.svs', offset: 0.2 },
        { name: 'service-hero', route: '/services/web-design', selector: null },
        { name: 'service-poster', route: '/services/web-design', selector: '.pst', offset: 0.1 },
      ]) {
        if (label === 'check-media' && scenario.name !== 'hero') continue
        const { page, context, errors } = await prepare(browser, mobile)
        await page.goto(base + scenario.route, { waitUntil: 'load' })
        if (scenario.route === '/') await page.waitForFunction(() => document.querySelector('main.hm')?.dataset.peelArmed === 'true')
        await wait(1500)
        if (scenario.selector) {
          await page.evaluate(({ selector, offset }) => {
            const element = document.querySelector('.k-shift > .k-pt__view ' + selector)
            window.scrollTo({ top: scrollY + element.getBoundingClientRect().top - innerHeight * offset, behavior: 'instant' })
          }, scenario)
          await wait(1000)
        }
        const frozenStyle = await page.addStyleTag({ content: '.k-shift > .k-pt__view * { animation-play-state: paused !important; }' })
        await page.evaluate(() => {
          document.querySelectorAll('video').forEach(video => video.pause())
          window.dispatchEvent(new CustomEvent('k:freeze', { detail: true }))
          document.querySelector('.k-shift > .k-pt__view').getAnimations({ subtree: true }).forEach(animation => animation.pause())
        })
        await wait(150)
        const original = await page.evaluate(() => {
          const view = document.querySelector('.k-shift > .k-pt__view')
          const items = [...view.querySelectorAll('.hw-shape,.hw-mimg,.hw-vid,.hw-headline,.hm-claim-land,.svs-row,.ro-mid,.ro-rays,.rn,.pst-stage,.pst-obj,.hp-canvas')]
            .filter(element => { const r = element.getBoundingClientRect(); return r.height && r.top < innerHeight && r.bottom > 0 })
            .map((element, index) => {
              element.dataset.snapshotCheck = String(index)
              const r = element.getBoundingClientRect()
              return { id: String(index), className: element.className.baseVal ?? element.className, x: r.x, y: r.y, width: r.width, height: r.height }
            })
          return { height: view.getBoundingClientRect().height, items, scrollY }
        })
        const before = Buffer.from(await page.screenshot({ path: path.join(out, `${mode}-${scenario.name}-live.png`) }))
        let held = []
        const hold = request => {
          const url = new URL(request.url())
          if (url.pathname === '/contact' && url.searchParams.has('_rsc')) held.push(request)
          else request.continue().catch(() => {})
        }
        await page.setRequestInterception(true)
        page.on('request', hold)
        await page.$eval('.k-nav-contact', element => element.click())
        await page.waitForSelector('.k-pt__ghost')
        const clone = await page.evaluate(() => {
          const ghost = document.querySelector('.k-pt__ghost')
          const styles = element => { const s = getComputedStyle(element); const r = element.getBoundingClientRect(); return { width: s.width, height: s.height, borderRadius: s.borderRadius, objectFit: s.objectFit, maxWidth: s.maxWidth, boxSizing: s.boxSizing, transform: s.transform, rect: { x: r.x, y: r.y, width: r.width, height: r.height } } }
          return { height: ghost.querySelector('.k-pt__view').getBoundingClientRect().height,
            media: [...document.querySelectorAll('.hw-mimg')].map(styles),
            videos: ghost.querySelectorAll('video').length,
            animations: ghost.getAnimations({ subtree: true }).length,
            items: [...ghost.querySelectorAll('[data-snapshot-check]')].map(element => {
              const r = element.getBoundingClientRect()
              return { id: element.dataset.snapshotCheck, x: r.x, y: r.y, width: r.width, height: r.height }
            }) }
        })
        assert.equal(clone.videos, 0, 'still does not create video decoders')
        assert.equal(clone.animations, 0, 'still does not restart CSS animations')
        assert.ok(Math.abs(original.height - clone.height) < 1, `${mode} ${scenario.name}: sheet height preserved (${original.height}, ${clone.height})`)
        const differences = original.items.map(item => {
          const match = clone.items.find(candidate => candidate.id === item.id)
          assert.ok(match, item.className + ': visible item retained')
          return { className: item.className, difference: Math.max(...['x', 'y', 'width', 'height'].map(key => Math.abs(item[key] - match[key]))) }
        })
        const after = Buffer.from(await page.screenshot({ path: path.join(out, `${mode}-${scenario.name}-still.png`) }))
        const raw = await sharp(before).raw().toBuffer({ resolveWithObject: true })
        const a = raw.data
        const b = await sharp(after).raw().toBuffer()
        const film = original.items.find(item => item.className.includes('hw-mimg'))
        if (film && scenario.name === 'hero') {
          const dpr = raw.info.width / page.viewport().width
          const x = Math.round((film.x + film.width - 3) * dpr)
          const y = Math.round((film.y + 3) * dpr)
          const index = (y * raw.info.width + x) * raw.info.channels
          assert.ok([...Array(raw.info.channels)].every((_, channel) => Math.abs(a[index + channel] - b[index + channel]) < 4), 'mobile rounded video crop preserved')
        }
        let changed = 0, total = 0
        for (let i = 0; i < a.length; i++) { if (Math.abs(a[i] - b[i]) > 3) changed++; total += Math.abs(a[i] - b[i]) }
        const result = { mode, scenario: scenario.name, originalHeight: original.height, cloneHeight: clone.height,
          differences, media: clone.media, changedChannels: changed / a.length, meanChannelDifference: total / a.length }
        results.push(result)
        console.log(JSON.stringify(result))
        assert.ok(differences.every(item => item.difference < 1), `${mode} ${scenario.name}: visible geometry preserved`)
        // Let the real route finish, then release the request interception.
        for (const request of held) await request.continue().catch(() => {})
        page.off('request', hold)
        await page.setRequestInterception(false)
        await page.waitForFunction(() => location.pathname === '/contact' && !document.documentElement.classList.contains('k-pt-active'), { timeout: 30000 })
        await page.evaluate(() => window.dispatchEvent(new CustomEvent('k:freeze', { detail: false })))
        await frozenStyle.dispose()
        assert.equal(errors.length, 0, mode + ': no browser errors')
        await context.close()
      }
    }
    fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(results, null, 2))
  } finally { await browser.close() }
}
async function navigationChecks() {
  fs.mkdirSync(out, { recursive: true })
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true, args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--force-device-scale-factor=1'] })
  const results = []
  try {
    for (const mobile of [false, true]) {
      const { page, context, errors } = await prepare(browser, mobile)
      const mode = mobile ? 'mobile' : 'desktop'
      await page.goto(base, { waitUntil: 'load' })
      await page.waitForFunction(() => document.querySelector('main.hm')?.dataset.heroReady === 'true')
      // Two rapid ordinary links retain the first destination.
      await page.evaluate(() => {
        document.querySelector('.k-nav-contact').click()
        document.querySelector('.k-nav-brand').click()
      })
      await page.waitForFunction(() => location.pathname === '/contact' && !document.documentElement.classList.contains('k-pt-active'))
      assert.equal(await page.evaluate(() => window.__pageMotion.runs.length), 1)
      assert.equal(await page.evaluate(() => scrollY), 0)

      // Interruption after commit must remove both the ghost and live transform.
      await page.$eval('.k-shift > .k-pt__view .ft-link[href="/services"]', element => element.click())
      await page.waitForFunction(() => location.pathname === '/services' && document.documentElement.classList.contains('k-pt-active'))
      await page.goBack({ waitUntil: 'domcontentloaded' })
      await page.waitForFunction(() => location.pathname === '/contact' && !document.documentElement.classList.contains('k-pt-active'))
      assert.equal(await page.$('.k-pt__ghost'), null)
      assert.equal(await page.$eval('.k-shift > .k-pt__view', element => element.style.transform), '')

      // A fixture on the existing Home link exercises the ordinary handler's
      // hash landing (production menu links also use /#section destinations).
      await page.$eval('.k-shift > .k-pt__view .ft-link[href="/"]', element => { element.href = '/#work'; element.click() })
      await page.waitForFunction(() => location.pathname === '/' && location.hash === '#work' && !document.documentElement.classList.contains('k-pt-active'))
      await wait(500)
      const landing = await page.$eval('.k-shift > .k-pt__view #work', element => element.getBoundingClientRect().top)
      console.log(JSON.stringify(await page.evaluate(() => ({ hashCheck: location.href, scrollY, height: document.documentElement.scrollHeight,
        work: document.querySelector('.k-shift > .k-pt__view #work').getBoundingClientRect().top,
        armed: document.querySelector('main.hm')?.dataset.peelArmed,
        classes: document.querySelector('.k-shift').className,
        view: getComputedStyle(document.querySelector('.k-shift > .k-pt__view')).transform,
      }))))
      assert.ok(Math.abs(landing) < 2, mode + ': hash lands at the incoming section')

      const beforeMenu = await page.evaluate(() => window.__pageMotion.runs.length)
      await page.click('.k-menu-btn')
      await wait(1200)
      await page.click('.k-under__link[href="/services"]')
      await page.waitForFunction(() => location.pathname === '/services' && !document.querySelector('.k-shift.is-frozen'))
      assert.equal(await page.evaluate(() => window.__pageMotion.runs.length), beforeMenu, 'menu retains its separate choreography')

      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
      await page.$eval('.k-nav-brand', element => element.click())
      await page.waitForFunction(() => location.pathname === '/')
      assert.equal(await page.$('.k-pt__ghost'), null)
      assert.equal(await page.evaluate(() => window.__pageMotion.runs.length), beforeMenu, 'reduced motion cuts immediately')
      assert.equal(errors.length, 0, mode + ': no runtime errors: ' + errors.join('\n'))
      results.push({ mode, rapidLinks: true, historyInterruption: true, hashLanding: landing, menuSeparate: true, reducedMotion: true, errors })
      await context.close()
    }
    fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(results, null, 2))
    console.log(JSON.stringify(results))
  } finally { await browser.close() }
}
(label === 'check-navigation' ? navigationChecks() : label.startsWith('check') ? checks() : main())
  .catch(error => { console.error(error); process.exitCode = 1 })
