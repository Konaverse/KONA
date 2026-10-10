/** Local runtime check: node tools/profile-shared-effects.cjs <label> [baseUrl] */
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const puppeteer = require('puppeteer-core')

const label = process.argv[2] || 'check'
const base = process.argv[3] || 'http://127.0.0.1:3005'
const out = path.resolve('docs/design/shared-effects', label)
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function main() {
  fs.mkdirSync(out, { recursive: true })
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--force-device-scale-factor=1'],
  })
  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1, hasTouch: false })
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('konaverse_cookie_consent', 'declined')
      const draws = new Map()
      const reads = {}
      for (const context of [WebGLRenderingContext, WebGL2RenderingContext]) {
        for (const method of ['drawArrays', 'drawElements']) {
          const original = context.prototype[method]
          context.prototype[method] = function (...args) {
            draws.set(this.canvas, (draws.get(this.canvas) || 0) + 1)
            return original.apply(this, args)
          }
        }
      }
      const originalRect = Element.prototype.getBoundingClientRect
      Element.prototype.getBoundingClientRect = function () {
        const key = this.classList.contains('k-dark') ? 'dark-surfaces'
          : this.hasAttribute('data-lift') ? 'lifted-images'
            : this.classList.contains('ft') ? 'footer' : 'other'
        reads[key] = (reads[key] || 0) + 1
        return originalRect.call(this)
      }
      window.__sharedProbe = () => {
        let fluidDraws = 0
        for (const [canvas, count] of draws) {
          let el = canvas.parentElement
          while (el) {
            if (el.style.mixBlendMode === 'difference' && el.style.zIndex === '55') {
              fluidDraws += count
              break
            }
            el = el.parentElement
          }
        }
        return { fluidDraws, reads: { ...reads } }
      }
    })
    await page.goto(base + '/privacy', { waitUntil: 'networkidle0', timeout: 60000 })
    await wait(3500)
    const samples = {}
    async function sample(name, action) {
      const before = await page.evaluate(() => window.__sharedProbe())
      if (action) await action()
      else await wait(1000)
      const after = await page.evaluate(() => window.__sharedProbe())
      samples[name] = {
        fluidDraws: after.fluidDraws - before.fluidDraws,
        reads: Object.fromEntries(Object.keys(after.reads).map((key) => [key, after.reads[key] - (before.reads[key] || 0)])),
      }
    }
    async function stroke(y = 370) {
      await page.mouse.move(100, y)
      for (let i = 1; i <= 24; i++) {
        await page.mouse.move(100 + i * 45, y + Math.sin(i / 24 * Math.PI * 1.6) * 80)
        await wait(20)
      }
    }
    await sample('idleBeforeMovement')
    await sample('moving', async () => {
      await stroke()
      await page.screenshot({ path: path.join(out, 'active-trail.png') })
    })
    await wait(5000)
    await sample('idleAfterTrail')
    await page.screenshot({ path: path.join(out, 'idle.png') })
    await page.evaluate(() => window.dispatchEvent(new CustomEvent('k:freeze', { detail: true })))
    await wait(350)
    await sample('menuPaused', () => stroke())
    await page.evaluate(() => window.dispatchEvent(new CustomEvent('k:freeze', { detail: false })))
    await wait(1000)
    await sample('resumeWithoutMovement')
    await sample('movingAgain', () => stroke(500))
    await page.evaluate(() => window.dispatchEvent(new CustomEvent('k:transition', { detail: true })))
    await wait(350)
    await sample('transitionPaused', () => stroke())
    await page.evaluate(() => window.dispatchEvent(new CustomEvent('k:transition', { detail: false })))
    await wait(1200)
    await sample('transitionResumeWithoutMovement')
    if (label !== 'before') {
      const signal = async (name, detail) => page.evaluate((type, value) => window.dispatchEvent(new CustomEvent(type, { detail: value })), name, detail)
      await signal('k:freeze', true)
      await signal('k:transition', true)
      await signal('k:freeze', false)
      await wait(350)
      await sample('overlappingPause', () => stroke())
      await signal('k:transition', false)
      await page.evaluate(() => {
        Object.defineProperty(document, 'hidden', { configurable: true, get: () => true })
        document.dispatchEvent(new Event('visibilitychange'))
      })
      await wait(350)
      await sample('hiddenTab', () => stroke())
      await page.evaluate(() => {
        delete document.hidden
        document.dispatchEvent(new Event('visibilitychange'))
      })
      await wait(500)
      await sample('visibleAgainWithoutMovement')
      await page.click('.k-menu-btn')
      await page.waitForSelector('.k-menu-btn[aria-expanded="true"]')
      await wait(800)
      await sample('actualMenuOpen', () => stroke())
      await page.click('.k-menu-btn')
      await page.waitForSelector('.k-menu-btn[aria-expanded="false"]')
      await wait(900)
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await wait(1000)
      const letter = await page.$('.ft-mail-l')
      assert.ok(letter, 'footer address exists')
      await letter.hover()
      await wait(1000)
      assert.ok(await page.evaluate(() => [...document.querySelectorAll('.ft-mail-l')].some((el) => /"wght" (?!200\b)\d+/.test(el.style.fontVariationSettings))), 'footer weights still respond to the pointer')
      await page.mouse.move(30, 200)
      await wait(4000)
      await sample('footerIdle')
      await page.screenshot({ path: path.join(out, 'footer.png') })
      await page.evaluate(() => {
        window.__transitionSignals = []
        window.addEventListener('k:transition', (event) => window.__transitionSignals.push(event.detail))
        document.querySelector('.ft a[href="/services"]').click()
      })
      await page.waitForFunction(() => location.pathname === '/services' && !document.documentElement.classList.contains('k-pt-active'))
      assert.deepEqual(await page.evaluate(() => window.__transitionSignals), [true, false], 'real link transition pauses and resumes effects')
      await page.goto(base + '/', { waitUntil: 'networkidle0', timeout: 60000 })
      await wait(4500)
      await page.screenshot({ path: path.join(out, 'homepage.png') })
      for (const mode of ['touch', 'reducedMotion']) {
        const checkPage = await browser.newPage()
        if (mode === 'touch') await checkPage.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
        else await checkPage.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
        await checkPage.goto(base + '/privacy', { waitUntil: 'networkidle0', timeout: 60000 })
        await wait(3000)
        assert.equal(await checkPage.evaluate(() => document.querySelectorAll('canvas').length), 0, mode + ': fluid canvas must not mount')
        await checkPage.close()
      }
    }
    fs.writeFileSync(path.join(out, 'metrics.json'), JSON.stringify({ base, label, samples, errors }, null, 2))
    console.log(JSON.stringify({ label, samples, errors }, null, 2))
    if (label !== 'before') {
      assert.equal(errors.length, 0, 'browser runtime errors')
      for (const name of ['idleBeforeMovement', 'idleAfterTrail', 'menuPaused', 'resumeWithoutMovement', 'transitionPaused', 'transitionResumeWithoutMovement', 'overlappingPause', 'hiddenTab', 'visibleAgainWithoutMovement', 'actualMenuOpen', 'footerIdle']) {
        assert.equal(samples[name].fluidDraws, 0, name + ': fluid must sleep')
      }
      assert.ok(samples.moving.fluidDraws > 0, 'cursor must render during movement')
      assert.ok(samples.movingAgain.fluidDraws > 0, 'cursor must wake after pause')
      assert.equal(samples.idleAfterTrail.reads['dark-surfaces'] || 0, 0, 'grain must not poll geometry at rest')
    }
  } finally {
    await browser.close()
  }
}
if (label.startsWith('homepage-')) require('./profile-homepage-startup.cjs')
else main().catch((error) => { console.error(error); process.exitCode = 1 })
