/* Local production evidence: node tools/profile-service-template.cjs before|after|check [baseUrl] */
const fs = require('node:fs')
const path = require('node:path')
const assert = require('node:assert/strict')
const puppeteer = require('puppeteer-core')
const label = process.argv[2] || 'before'
const base = process.argv[3] || 'http://127.0.0.1:3007'
const out = path.resolve('docs/design/service-template', label)
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
const slugs = ['web-design', 'web-development', '3d-websites', 'one-page-websites', 'website-redesign', 'seo']

async function prepare(browser, mobile, cpu = 1, reduced = false) {
  const context = await browser.createBrowserContext()
  const page = await context.newPage()
  await page.setViewport({ width: mobile ? 390 : 1440, height: mobile ? 844 : 900, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile })
  if (reduced) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  const client = await page.createCDPSession()
  await client.send('Performance.enable')
  if (cpu !== 1) await client.send('Emulation.setCPUThrottlingRate', { rate: cpu })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('konaverse_cookie_consent', 'declined')
    Math.random = () => 0.5
    const probe = window.__serviceProbe = { reads: {}, contexts: [], tasks: [], frames: [], ready: 0, rayDraws: 0 }
    const stroke = CanvasRenderingContext2D.prototype.stroke
    CanvasRenderingContext2D.prototype.stroke = function (...args) {
      if (this.canvas.classList.contains('ro-rays')) probe.rayDraws++
      return stroke.apply(this, args)
    }
    const rect = Element.prototype.getBoundingClientRect
    Element.prototype.getBoundingClientRect = function () {
      const key = ['sr', 'ro', 'ro-back', 'ra-say', 'ra-slot', 'rq', 'pst', 'rk', 'rx', 'rw', 'rg', 'ad', 'ro-dots'].find(key => this.classList.contains(key)) || 'other'
      probe.reads[key] = (probe.reads[key] || 0) + 1
      return rect.call(this)
    }
    const getContext = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (kind, ...args) {
      if (/webgl/.test(kind)) probe.contexts.push({ time: performance.now(), class: this.className })
      return getContext.call(this, kind, ...args)
    }
    new PerformanceObserver(list => probe.tasks.push(...list.getEntries().map(entry => ({ start: entry.startTime, duration: entry.duration })))).observe({ type: 'longtask', buffered: true })
    const frame = time => { probe.frames.push(time); requestAnimationFrame(frame) }
    requestAnimationFrame(frame)
    const ready = new MutationObserver(() => {
      if (document.querySelector('.ra.is-live') && !probe.ready) probe.ready = performance.now()
    })
    ready.observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] })
  })
  return { context, page, client, errors }
}

async function sample(page, client, name, action) {
  const metrics = async () => Object.fromEntries((await client.send('Performance.getMetrics')).metrics.map(item => [item.name, item.value]))
  const before = await page.evaluate(() => ({ reads: { ...window.__serviceProbe.reads }, time: performance.now(), frame: window.__serviceProbe.frames.length }))
  const m0 = await metrics()
  if (action) await action()
  else await wait(1100)
  const after = await page.evaluate(() => ({ reads: { ...window.__serviceProbe.reads }, time: performance.now(), frames: window.__serviceProbe.frames.slice(), tasks: window.__serviceProbe.tasks.slice() }))
  const m1 = await metrics()
  const frames = after.frames.slice(before.frame)
  const gaps = frames.slice(1).map((time, i) => time - frames[i])
  return { name, elapsedMs: Math.round(after.time - before.time), reads: Object.fromEntries(Object.entries(after.reads).map(([key, count]) => [key, count - (before.reads[key] || 0)])), maxFrameMs: Math.round(Math.max(0, ...gaps)), framesOver34ms: gaps.filter(time => time > 34).length, longTaskMs: Math.round(after.tasks.filter(task => task.start >= before.time).reduce((sum, task) => sum + task.duration, 0)), metricsMs: Object.fromEntries(['TaskDuration', 'ScriptDuration', 'LayoutDuration', 'RecalcStyleDuration'].map(key => [key, Math.round((m1[key] - m0[key]) * 1000)])) }
}

async function scrollTo(page, selector, fraction = 0.25) {
  await page.$eval(selector, (el, fraction) => window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - innerHeight * fraction, behavior: 'instant' }), fraction)
  await wait(2200)
}

async function picture(page, name) {
  return page.evaluate(name => {
    // Fixed CSS animation time makes the hero's independent clocks comparable.
    for (const animation of document.getAnimations()) {
      animation.pause()
      animation.currentTime = animation.animationName?.startsWith('ro-') ? 1700 : 3000
    }
    const nodes = document.querySelectorAll('.ro, .ro-back, .ra, .ra-fact, .pst, .pst-line, .pst-obj, .rq, .rq-track, .rk, .rx, .rw, .rg, .ad, .inv')
    return { name, y: scrollY, height: document.querySelector('.sr').offsetHeight, elements: Array.from(nodes).map(el => ({ class: el.className, rect: (() => { const r = el.getBoundingClientRect(); return { top: r.top, left: r.left, width: r.width, height: r.height } })(), transform: getComputedStyle(el).transform, fontSize: getComputedStyle(el).fontSize })) }
  }, name)
}

async function behavior(page, client, mobile) {
  await scrollTo(page, '.ro', 0)
  const draws = () => page.evaluate(() => window.__serviceProbe.rayDraws)
  const before = await draws(); await wait(500)
  assert.ok(await draws() > before, 'visible rays breathe')
  await page.click('.k-menu-btn')
  await wait(1600)
  const paused = await draws(); await wait(500)
  assert.equal(await draws(), paused, 'menu holds ray drawing')
  await page.click('.k-menu-btn'); await wait(1800)
  const resumed = await draws(); await wait(500)
  assert.ok(await draws() > resumed, 'rays resume after menu')
  await scrollTo(page, '.pst', 0.15)
  const away = await draws(); await wait(500)
  assert.equal(await draws(), away, 'distant rays sleep')
  for (let i = 1; i <= 3; i++) await scrollTo(page, `.ra-slot:nth-child(${i})`, 0.2)
  await wait(600)
  assert.equal(await page.$$eval('.ra-fact.is-done', cards => cards.length), 3, 'all fact arrivals finish')
  await scrollTo(page, '.ro', 0)
  assert.equal(await page.$$eval('.ra-fact.is-down', cards => cards.length), 0, 'cards reset below fold')
  if (!mobile) {
    await page.click('.rn-chip[href="#plan"]')
    await wait(2400)
    assert.ok(Math.abs(await page.$eval('#plan', el => el.getBoundingClientRect().top)) < 3, 'run bar anchor lands')
  }
  const counts = await sample(page, client, 'behavior-rest')
  for (const key of ['sr', 'ra', 'rk', 'rx', 'rw', 'rg', 'rq', 'pst']) assert.equal(counts.reads[key] || 0, 0, key + ': settled geometry sleeps')
  return { passed: true, resting: counts }
}

async function main() {
  fs.mkdirSync(out, { recursive: true })
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--force-device-scale-factor=1'] })
  const results = []
  try {
    const modes = label === 'check' ? [{ name: 'desktop', mobile: false }, { name: 'mobile', mobile: true }, { name: 'reduced', mobile: false, reduced: true }] : [{ name: 'desktop', mobile: false }, { name: 'mobile', mobile: true }, { name: 'cpu4', mobile: false, cpu: 4 }]
    for (const mode of label.endsWith('-cpu') ? modes.filter(mode => mode.cpu === 4) : modes) {
      for (const slug of label === 'check' ? slugs : ['web-design']) {
        const { context, page, client, errors } = await prepare(browser, mode.mobile, mode.cpu, mode.reduced)
        await page.goto(base + '/services/' + slug, { waitUntil: 'load', timeout: 60000 })
        await wait(3000)
        const cold = await page.evaluate(() => ({ readyMs: window.__serviceProbe.ready, contexts: window.__serviceProbe.contexts, longTaskMs: Math.round(window.__serviceProbe.tasks.reduce((sum, task) => sum + task.duration, 0)), maxFrameMs: Math.round(Math.max(0, ...window.__serviceProbe.frames.slice(1).map((time, i) => time - window.__serviceProbe.frames[i]))), images: Array.from(document.images).map(img => ({ src: img.currentSrc, complete: img.complete, naturalWidth: img.naturalWidth, width: img.clientWidth })), animations: document.getAnimations().length }))
        const samples = []
        const pictures = []
        const prefix = mode.name + '-' + slug
        if (label !== 'check') {
          samples.push(await sample(page, client, 'hero-rest'))
          await page.addStyleTag({ content: '.ro-rays, .ro-rays line { animation-play-state:paused!important }' })
          samples.push(await sample(page, client, 'diagnostic-rays-paused'))
          await page.evaluate(() => document.querySelector('style:last-child')?.remove())
        }
        for (const [name, selector, fraction] of [['hero', '.ro', 0], ['answer', '.ra', 0.1], ['fit', '#fit', 0.2], ['poster', '.pst', 0.15], ['plan', '#plan', -0.5], ['contact', '.inv', 0.1]]) {
          if (!await page.$(selector)) continue
          await scrollTo(page, selector, fraction)
          if (label !== 'check') samples.push(await sample(page, client, name + '-rest'))
          pictures.push(await picture(page, name))
          await page.screenshot({ path: path.join(out, prefix + '-' + name + '.png') })
          await page.evaluate(() => document.getAnimations().forEach(animation => animation.play()))
        }
        if (label !== 'check') {
          samples.push(await sample(page, client, 'scroll-through', () => page.evaluate(() => new Promise(resolve => {
            const start = performance.now(), y = scrollY, target = 0
            const move = time => { const p = Math.min(1, (time - start) / 2000); window.scrollTo(0, y + (target - y) * p); if (p < 1) requestAnimationFrame(move); else resolve() }
            requestAnimationFrame(move)
          }))))
        }
        const controls = label === 'check' && slug === 'web-design' && !mode.reduced ? await behavior(page, client, mode.mobile) : undefined
        const anchors = await page.$$eval('.rn-chip', links => links.map(link => ({ href: link.getAttribute('href'), exists: !!document.querySelector(link.getAttribute('href')) })))
        assert.ok(anchors.every(anchor => anchor.exists), prefix + ': chapter targets exist')
        const result = { mode: mode.name, slug, cold, samples, pictures, controls, anchors, errors }
        results.push(result)
        fs.writeFileSync(path.join(out, prefix + '.json'), JSON.stringify(result, null, 2))
        console.log(JSON.stringify({ mode: mode.name, slug, cold: { ...cold, images: undefined }, samples, errors }))
        assert.equal(errors.length, 0, prefix + ': browser errors')
        assert.ok(await page.$('h1'), prefix + ': heading remains')
        assert.ok(await page.$('script[type="application/ld+json"]'), prefix + ': schema remains')
        await context.close()
      }
    }
    if (label === 'check') {
      const page = await browser.newPage()
      await page.setJavaScriptEnabled(false)
      await page.setViewport({ width: 390, height: 844 })
      await page.goto(base + '/services/web-design', { waitUntil: 'load' })
      assert.equal(await page.$$eval('.ro-rays--svg line', lines => lines.length), 132, 'SVG fallback keeps all rays')
      assert.equal(await page.$eval('.ro-rays--svg', el => getComputedStyle(el).display), 'block', 'no-JS SVG visible')
      assert.equal(await page.$$eval('.ra.is-live, .rq.is-live', nodes => nodes.length), 0, 'no-JS content finished')
      await page.screenshot({ path: path.join(out, 'no-js-hero.png') })
      await page.close()
    }
    fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(results, null, 2))
  } finally { await browser.close() }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
