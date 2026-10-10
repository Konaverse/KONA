/* Deterministic GPU output and startup interruption checks, against production. */
const fs = require('node:fs')
const path = require('node:path')
const zlib = require('node:zlib')
const crypto = require('node:crypto')
const assert = require('node:assert/strict')
const puppeteer = require('puppeteer-core')
const label = process.argv[2] || 'after'
const base = process.argv[3] || 'http://127.0.0.1:3008'
const out = path.resolve('docs/design/first-load', label)
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
const hash = value => crypto.createHash('sha256').update(value).digest('hex')

async function parity(browser) {
  const context = await browser.createBrowserContext()
  const page = await context.newPage()
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('konaverse_cookie_consent', 'declined')
    const sources = []
    window.__shaderSources = sources
    const source = WebGL2RenderingContext.prototype.shaderSource
    WebGL2RenderingContext.prototype.shaderSource = function (shader, code) {
      sources.push(code)
      return source.call(this, shader, code)
    }
    const getContext = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      const result = getContext.call(this, type, ...args)
      if (type === 'webgl2') window.__fluidGL = result
      return result
    }
  })
  await page.goto(base + '/privacy', { waitUntil: 'domcontentloaded' })
  await wait(13000)
  await page.mouse.move(50, 400)
  await page.mouse.move(60, 400)
  await wait(5000)
  const resting = Buffer.from(await page.screenshot({ path: path.join(out, 'resting.png') }))
  const sample = await page.evaluate(async () => {
    const nativeRAF = window.requestAnimationFrame
    const nativeCancel = window.cancelAnimationFrame
    const pending = new Map()
    let id = -1
    window.requestAnimationFrame = callback => { pending.set(id, callback); return id-- }
    window.cancelAnimationFrame = id => { if (id < 0) pending.delete(id); else nativeCancel(id) }
    // Let the last native callbacks hand their next frames to our manual clock.
    await new Promise(resolve => nativeRAF(() => nativeRAF(resolve)))
    let time = performance.now()
    const step = () => {
      const callbacks = [...pending.values()]
      pending.clear()
      time += 1000 / 60
      for (const callback of callbacks) callback(time)
    }
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 100, clientY: 350, pointerType: 'mouse' }))
    step()
    for (let i = 1; i <= 18; i++) {
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 100 + i * 50, clientY: 350 + Math.sin(i / 18 * Math.PI) * 70, pointerType: 'mouse' }))
      step()
    }
    const gl = window.__fluidGL
    const pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4)
    gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
    const result = { width: gl.drawingBufferWidth, height: gl.drawingBufferHeight, pixels: Array.from(pixels), sources: window.__shaderSources }
    window.requestAnimationFrame = nativeRAF
    window.cancelAnimationFrame = nativeCancel
    for (const callback of pending.values()) nativeRAF(callback)
    return result
  })
  const pixels = Buffer.from(sample.pixels)
  fs.writeFileSync(path.join(out, 'cursor.rgba.gz'), zlib.gzipSync(pixels))
  const report = { width: sample.width, height: sample.height, hashes: [...new Set(sample.sources.map(hash))].sort(), pixelHash: hash(pixels), restingHash: hash(resting), errors }
  if (label !== 'before') {
    const before = JSON.parse(fs.readFileSync('docs/design/first-load/before/parity.json'))
    const original = zlib.gunzipSync(fs.readFileSync('docs/design/first-load/before/cursor.rgba.gz'))
    assert.equal(pixels.length, original.length, 'cursor resolution preserved')
    assert.deepEqual(report.hashes, before.hashes, 'every compiled shader source preserved')
    let changed = 0, total = 0, max = 0
    for (let i = 0; i < pixels.length; i++) {
      const delta = Math.abs(pixels[i] - original[i])
      if (delta) changed++
      total += delta
      max = Math.max(max, delta)
    }
    report.comparison = { changed, max, mean: total / pixels.length, restingIdentical: before.restingHash === report.restingHash }
    assert.ok(report.comparison.mean < 0.1, 'same deterministic solver output')
  }
  fs.writeFileSync(path.join(out, 'parity.json'), JSON.stringify(report, null, 2))
  console.log(JSON.stringify(report))
  assert.equal(errors.length, 0)
  await context.close()
}

async function interruptions(browser) {
  const results = []
  for (const scenario of ['no-parallel', 'late-compile', 'leave-during-compile']) {
    const context = await browser.createBrowserContext()
    const page = await context.newPage()
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, hasTouch: true, isMobile: true })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.evaluateOnNewDocument(scenario => {
      localStorage.setItem('konaverse_cookie_consent', 'declined')
      window.__compileChecks = 0
      window.__shaderDeletes = 0
      window.__programDeletes = 0
      const getExtension = WebGLRenderingContext.prototype.getExtension
      WebGLRenderingContext.prototype.getExtension = function (name) {
        if (scenario === 'no-parallel' && name === 'KHR_parallel_shader_compile') return null
        return getExtension.call(this, name)
      }
      const getParameter = WebGLRenderingContext.prototype.getProgramParameter
      WebGLRenderingContext.prototype.getProgramParameter = function (program, parameter) {
        if (parameter === 0x91b1) {
          window.__compileChecks++
          if (scenario !== 'no-parallel' && performance.now() < 4500) return false
        }
        return getParameter.call(this, program, parameter)
      }
      for (const [name, key] of [['deleteProgram', '__programDeletes'], ['deleteShader', '__shaderDeletes']]) {
        const original = WebGLRenderingContext.prototype[name]
        WebGLRenderingContext.prototype[name] = function (...args) { window[key]++; return original.apply(this, args) }
      }
    }, scenario)
    await page.goto(base + '/', { waitUntil: 'domcontentloaded' })
    if (scenario === 'leave-during-compile') {
      await page.waitForFunction(() => window.__compileChecks > 2)
      await page.$eval('.k-nav-brand[href="/"]', el => { el.setAttribute('href', '/privacy'); el.click() })
      await page.waitForFunction(() => location.pathname === '/privacy' && !document.documentElement.classList.contains('k-pt-active'))
      const count = await page.evaluate(() => window.__compileChecks)
      await wait(800)
      assert.equal(await page.evaluate(() => window.__compileChecks), count, 'compilation polling stops on unmount')
      assert.equal(await page.$('main.hm'), null)
    } else {
      await page.waitForFunction(() => document.querySelector('main.hm')?.dataset.heroReady === 'true')
      await wait(5000)
      const armed = await page.$eval('main.hm', el => el.dataset.peelArmed === 'true')
      assert.equal(armed, scenario === 'no-parallel', scenario + ': fallback or original renderer runs')
      assert.equal(await page.$eval('.hw-para', el => Number(getComputedStyle(el).opacity)), 1)
    }
    const result = await page.evaluate(() => ({ checks: window.__compileChecks, shaderDeletes: window.__shaderDeletes, programDeletes: window.__programDeletes }))
    if (scenario !== 'no-parallel') {
      assert.equal(result.shaderDeletes, 2, scenario + ': pending shaders released')
      assert.equal(result.programDeletes, 1, scenario + ': pending program released')
    }
    assert.equal(errors.length, 0, scenario + ': no runtime errors')
    results.push({ scenario, ...result, errors })
    console.log(scenario + ': passed')
    await context.close()
  }
  fs.writeFileSync(path.join(out, 'interruptions.json'), JSON.stringify(results, null, 2))
}

async function cursorResize(browser) {
  const context = await browser.createBrowserContext()
  const page = await context.newPage()
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('konaverse_cookie_consent', 'declined')
    window.__cursorCompileChecks = 0
    window.__cursorDraws = 0
    const parameter = WebGL2RenderingContext.prototype.getProgramParameter
    WebGL2RenderingContext.prototype.getProgramParameter = function (program, value) {
      if (value === 0x91b1) {
        window.__cursorCompileChecks++
        if (performance.now() < 5000) return false
      }
      return parameter.call(this, program, value)
    }
    for (const name of ['drawArrays', 'drawElements']) {
      const draw = WebGL2RenderingContext.prototype[name]
      WebGL2RenderingContext.prototype[name] = function (...args) { window.__cursorDraws++; return draw.apply(this, args) }
    }
  })
  await page.goto(base + '/privacy', { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => window.__cursorCompileChecks > 2)
  await page.mouse.move(100, 350)
  await page.mouse.move(800, 400)
  assert.equal(await page.evaluate(() => window.__cursorDraws), 0, 'pointer input is ignored during preparation')
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 })
  await wait(6000)
  const before = await page.evaluate(() => window.__cursorDraws)
  await page.mouse.move(100, 350)
  await page.mouse.move(900, 450)
  await wait(300)
  assert.ok(await page.evaluate(() => window.__cursorDraws) > before, 'cursor responds after interrupted resize preparation')
  const size = await page.$eval('canvas', canvas => ({ width: canvas.width, height: canvas.height }))
  assert.deepEqual(size, { width: 1280, height: 800 }, 'same DPR and viewport dimensions after resize')
  assert.equal(errors.length, 0, 'resize does not query disposed shader state')
  fs.writeFileSync(path.join(out, 'cursor-resize.json'), JSON.stringify({ size, errors, inputDuringCompileIgnored: true, resumed: true }, null, 2))
  console.log('cursor-resize: passed')
  await context.close()
}

async function main() {
  fs.mkdirSync(out, { recursive: true })
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true,
    args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--force-device-scale-factor=1'] })
  try {
    await parity(browser)
    if (label !== 'before') {
      await interruptions(browser)
      await cursorResize(browser)
    }
  } finally { await browser.close() }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
