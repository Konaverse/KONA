const fs = require('node:fs')
const path = require('node:path')
const assert = require('node:assert/strict')
const puppeteer = require('puppeteer-core')
const label = process.argv[2].replace(/^homepage-check-/, '')
const base = process.argv[3] || 'http://127.0.0.1:3007'
const out = path.resolve('docs/design/homepage-startup', 'check-' + label)
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

async function main() {
  fs.mkdirSync(out, { recursive: true })
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--force-device-scale-factor=1'],
  })
  const results = []
  try {
    for (const mobile of label === 'fallbacks' ? [] : [false, true]) {
      const page = await browser.newPage()
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      await page.setViewport(mobile
        ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
        : { width: 1440, height: 900, deviceScaleFactor: 1 })
      await page.evaluateOnNewDocument(() => {
        localStorage.setItem('konaverse_cookie_consent', 'declined')
        Math.random = () => 0.5
        window.__heroEvents = []
        for (const name of ['k-peel-armed', 'k-hero-open', 'k-hero-sew', 'k-hero-ready']) {
          window.addEventListener(name, () => window.__heroEvents.push({ name, time: performance.now() }))
        }
        const buffers = new WeakMap()
        const upload = WebGLRenderingContext.prototype.bufferData
        WebGLRenderingContext.prototype.bufferData = function (target, data, usage) {
          if (this.canvas.classList.contains('hp-canvas') && target === this.ELEMENT_ARRAY_BUFFER) {
            const mesh = buffers.get(this) || {}
            if (data.length === 75600) mesh.full = this.getParameter(this.ELEMENT_ARRAY_BUFFER_BINDING)
            if (data.length === 6) mesh.quad = this.getParameter(this.ELEMENT_ARRAY_BUFFER_BINDING)
            buffers.set(this, mesh)
          }
          return upload.call(this, target, data, usage)
        }
        const draw = WebGLRenderingContext.prototype.drawElements
        WebGLRenderingContext.prototype.drawElements = function (...args) {
          if (this.canvas.classList.contains('hp-canvas')) {
            const gl = this
            window.__comparePeelMeshes = () => {
              const mesh = buffers.get(gl)
              if (!mesh?.quad || !mesh?.full) return null
              const show = gl.getUniform(gl.getParameter(gl.CURRENT_PROGRAM), gl.getUniformLocation(gl.getParameter(gl.CURRENT_PROGRAM), 'uShow'))
              const render = buffer => {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer)
                gl.clear(gl.COLOR_BUFFER_BIT)
                draw.call(gl, gl.TRIANGLES, buffer === mesh.quad ? 6 : 75600, gl.UNSIGNED_SHORT, 0)
                const pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4)
                gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
                return pixels
              }
              const binding = gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING)
              const flat = render(mesh.quad)
              const full = render(mesh.full)
              render(binding)
              let changed = 0
              let maxDifference = 0
              for (let i = 0; i < flat.length; i++) {
                if (flat[i] !== full[i]) changed++
                maxDifference = Math.max(maxDifference, Math.abs(flat[i] - full[i]))
              }
              return { show, changedChannels: changed, totalChannels: flat.length, maxDifference }
            }
          }
          return draw.apply(this, args)
        }
      })
      await page.goto(base, { waitUntil: 'load' })
      await page.waitForFunction(() => {
        const flow = document.querySelector('.hw-flow')
        return !flow.classList.contains('is-pre') && !flow.classList.contains('is-flip') && Number(getComputedStyle(document.querySelector('.hw-para')).opacity) === 1
      })
      const mode = mobile ? 'mobile' : 'desktop'
      await page.screenshot({ path: path.join(out, mode + '-hero.png') })
      const hero = await page.evaluate(() => ({
        events: window.__heroEvents,
        items: [...document.querySelectorAll('.hw-w, .hw-pill')].map(el => {
          const rect = el.getBoundingClientRect()
          return { className: el.className, x: rect.x, y: rect.y, w: rect.width, h: rect.height }
        }),
      }))
      const meshes = await page.evaluate(() => window.__comparePeelMeshes?.() ?? null)
      if (label === 'final') {
        assert.ok(meshes && meshes.show === 0, mode + ': flat opening uses quad')
        assert.ok(meshes.maxDifference <= 2 && meshes.changedChannels / meshes.totalChannels < 0.001, mode + ': quad retains the same pixels')
      }
      const scroll = async (selector, viewportTop = 0.25) => {
        await page.evaluate((selector, viewportTop) => {
          const el = document.querySelector(selector)
          window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - innerHeight * viewportTop, behavior: 'instant' })
        }, selector, viewportTop)
        await wait(650)
      }
      await scroll('.hm-claim', 0.5)
      assert.equal(await page.$eval('main.hm', el => el.classList.contains('hm-glhero')), true, mode + ': fold engages')
      await page.screenshot({ path: path.join(out, mode + '-fold.png') })
      await scroll('.hm-claim', mobile ? 0.08 : 0)
      if (mobile) assert.equal(await page.$eval('main.hm', el => el.classList.contains('hm-landed')), true, 'mobile: native landed handoff')
      await page.screenshot({ path: path.join(out, mode + '-claim.png') })
      await scroll('.hm-claim', 0.6)
      if (mobile) assert.equal(await page.$eval('main.hm', el => el.classList.contains('hm-landed')), false, 'mobile: reverse fold')
      await scroll('.sv2', 0.2)
      await wait(2200)
      assert.equal(await page.$eval('.sv2 .k-wipe', el => el.classList.contains('is-wipe')), false, mode + ': statement wipe completes')
      await page.screenshot({ path: path.join(out, mode + '-statement.png') })
      await scroll('.svs', 0.4)
      const services = await page.$$eval('.svs-row', rows => rows.map(row => getComputedStyle(row).transform))
      if (!mobile) assert.notEqual(services[1], 'none', 'desktop: fan keeps its tilt')
      await page.screenshot({ path: path.join(out, mode + '-services.png') })
      if (mobile) {
        await page.click('.svs-includes-toggle')
        assert.equal(await page.$eval('.svs-includes-toggle', el => el.getAttribute('aria-expanded')), 'true', 'mobile: includes opens')
      }
      await scroll('.wl', 0.15)
      await wait(1500)
      const workStart = await page.$eval('.wl-marq-track', el => getComputedStyle(el).transform)
      await wait(250)
      assert.notEqual(await page.$eval('.wl-marq-track', el => getComputedStyle(el).transform), workStart, mode + ': marquee still moves')
      if (mobile) {
        await scroll('.wl-row', 0.25)
        await wait(1500)
        const opacity = await page.$eval('.wl-name', el => getComputedStyle(el).opacity)
        assert.equal(opacity, '1', 'mobile: project entrance completes')
      } else {
        await page.hover('.wl-row .wl-link')
        await wait(700)
        assert.notEqual(await page.$eval('.wl-prev', el => getComputedStyle(el).transform), 'matrix(0, 0, 0, 0, 0, 0)', 'desktop: preview opens')
      }
      await page.screenshot({ path: path.join(out, mode + '-work.png') })
      await scroll('.inv', 0.1)
      await wait(2300)
      assert.equal(await page.$eval('.inv .k-wipe', el => el.classList.contains('is-wipe')), false, mode + ': invitation wipe completes')
      await page.$eval('.inv', el => el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 150, clientY: 300 })))
      await wait(200)
      assert.equal(await page.$eval('.inv .ft-field canvas', el => el.classList.contains('is-live')), true, mode + ': click ripple remains')
      await wait(2300)
      assert.equal(await page.$eval('.inv .ft-field canvas', el => el.classList.contains('is-live')), false, mode + ': ripple settles')
      await page.screenshot({ path: path.join(out, mode + '-invitation.png') })
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
      await wait(1000)
      assert.equal(await page.$eval('main.hm', el => el.classList.contains('hm-glhero')), false, mode + ': DOM video restored at top')
      assert.equal(errors.length, 0, mode + ': runtime errors')
      results.push({ mode, hero, meshes, services, errors })
      console.log(mode + ': hero, reversible fold, statement, services, projects and invitation passed')
      await page.close()
    }
    // The final rerun checks section preparation; unchanged fallback paths
    // have their separate, complete check-after recording.
    if (label !== 'before' && label !== 'final') {
      for (const fallback of ['no-webgl', 'blocked-video', 'late-video', 'no-frame-callback', 'reduced-motion', 'no-js', 'early-scroll']) {
        const page = await browser.newPage()
        await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
        const errors = []
        page.on('pageerror', error => errors.push(error.message))
        if (fallback === 'no-js') await page.setJavaScriptEnabled(false)
        if (fallback === 'reduced-motion') await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
        await page.evaluateOnNewDocument((fallback) => {
          localStorage.setItem('konaverse_cookie_consent', 'declined')
          if (fallback === 'no-webgl') {
            const original = HTMLCanvasElement.prototype.getContext
            HTMLCanvasElement.prototype.getContext = function (type, ...args) { return type.startsWith('webgl') ? null : original.call(this, type, ...args) }
          }
          if (fallback === 'no-frame-callback') HTMLVideoElement.prototype.requestVideoFrameCallback = undefined
        }, fallback)
        if (fallback.includes('video')) {
          await page.setRequestInterception(true)
          page.on('request', request => {
            if (!request.url().endsWith('hero-loop.mp4')) return request.continue()
            if (fallback === 'blocked-video') return request.abort()
            setTimeout(() => request.continue().catch(() => {}), 4500)
          })
        }
        await page.goto(base, { waitUntil: 'domcontentloaded' })
        if (fallback === 'early-scroll') await page.evaluate(() => window.scrollTo({ top: innerHeight, behavior: 'instant' }))
        if (fallback === 'no-js') await wait(1500)
        else {
          if (fallback === 'late-video') await wait(5500)
          await page.waitForFunction(() => document.querySelector('main.hm').dataset.heroReady === 'true' && Number(getComputedStyle(document.querySelector('.hw-para')).opacity) === 1, { timeout: 30000 })
          await wait(200)
        }
        assert.equal(await page.$eval('.hw-para', el => Number(getComputedStyle(el).opacity)), 1, fallback + ': copy remains visible')
        assert.equal(await page.$eval('.hw-flow', el => el.classList.contains('is-pre') && getComputedStyle(el).clipPath !== 'none'), false, fallback + ': headline remains visible')
        if (['blocked-video', 'late-video', 'no-webgl'].includes(fallback)) {
          assert.equal(await page.$eval('.hm-heropin', el => el.classList.contains('is-run')), false, fallback + ': no late cover or runway')
        }
        if (fallback === 'no-frame-callback') assert.equal(await page.$eval('.hm-heropin', el => el.classList.contains('is-run')), true, fallback + ': video texture fallback runs')
        assert.equal(errors.length, 0, fallback + ': runtime errors')
        await page.screenshot({ path: path.join(out, fallback + '.png') })
        results.push({ fallback, errors })
        console.log(fallback + ': passed')
        await page.close()
      }
    }
    fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(results, null, 2))
  } finally { await browser.close() }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
