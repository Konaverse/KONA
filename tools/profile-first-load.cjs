/* Production first-load attribution. Run one browser at a time:
 * node tools/profile-first-load.cjs <label> [baseUrl] [mode|all]
 * Raw compressed traces/profiles are local evidence; summaries are reproducible.
 */
const fs = require('node:fs')
const path = require('node:path')
const zlib = require('node:zlib')
const assert = require('node:assert/strict')
const puppeteer = require('puppeteer-core')
const label = process.argv[2] || 'baseline'
const base = process.argv[3] || 'http://127.0.0.1:3008'
const selected = process.argv[4] || 'all'
const out = path.resolve('docs/design/first-load', label)
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
const modes = ['home-desktop-cold', 'home-desktop-warm', 'home-mobile-cold', 'home-mobile-warm', 'home-cpu4',
  'service-desktop-cold', 'service-desktop-warm', 'service-mobile-cold', 'service-mobile-warm', 'service-cpu4']

function probe() {
  try { localStorage.setItem('konaverse_cookie_consent', 'declined') } catch {}
  const report = { origin: location.origin, events: [], contexts: [], gl: [], tasks: [], frames: [], draws: 0 }
  window.__firstLoad = report
  performance.mark('first-load:document')
  for (const name of ['k-peel-armed', 'k-hero-open', 'k-hero-sew', 'k-hero-ready']) {
    window.addEventListener(name, () => {
      report.events.push({ name, time: performance.now() })
      performance.mark('first-load:' + name)
    })
  }
  window.addEventListener('message', event => {
    if (event.origin === 'https://calendly.com' && event.data?.event === 'calendly.event_type_viewed') {
      report.events.push({ name: 'calendly-ready', time: performance.now() })
      performance.mark('first-load:calendly-ready')
    }
  })
  const getContext = HTMLCanvasElement.prototype.getContext
  HTMLCanvasElement.prototype.getContext = function (type, ...args) {
    const time = performance.now()
    const result = getContext.call(this, type, ...args)
    if (type.startsWith('webgl')) {
      report.contexts.push({ type, time, duration: performance.now() - time, parent: this.parentElement?.className })
      performance.measure('first-load:getContext:' + type, { start: time, end: performance.now() })
    }
    return result
  }
  for (const Context of [WebGLRenderingContext, WebGL2RenderingContext]) {
    for (const name of ['compileShader', 'linkProgram', 'getShaderParameter', 'getProgramParameter', 'getShaderInfoLog', 'getProgramInfoLog', 'getUniformLocation', 'checkFramebufferStatus']) {
      const original = Context.prototype[name]
      Context.prototype[name] = function (...args) {
        const time = performance.now()
        const result = original.apply(this, args)
        const duration = performance.now() - time
        if (duration > 1) report.gl.push({ name, time, duration })
        return result
      }
    }
    for (const name of ['drawArrays', 'drawElements']) {
      const original = Context.prototype[name]
      Context.prototype[name] = function (...args) {
        if (this.canvas.closest('[style*="mix-blend-mode"]')) {
          if (!report.draws) report.firstFluidDraw = performance.now()
          report.draws++
        }
        return original.apply(this, args)
      }
    }
  }
  new PerformanceObserver(list => report.tasks.push(...list.getEntries().map(entry => ({
    time: entry.startTime, duration: entry.duration,
    attribution: entry.attribution?.map(item => ({ name: item.name, src: item.containerSrc })),
  })))).observe({ type: 'longtask', buffered: true })
  let previous = performance.now()
  function frame(now) {
    report.frames.push({ time: now, delta: now - previous })
    previous = now
    if (now < 22000) requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}

function cpuSummary(profile) {
  const nodes = new Map(profile.nodes.map(node => [node.id, node]))
  const byFunction = new Map()
  for (let i = 0; i < (profile.samples || []).length; i++) {
    const node = nodes.get(profile.samples[i])
    if (!node) continue
    const { functionName, url, lineNumber } = node.callFrame
    const key = [functionName, url, lineNumber].join('|')
    const item = byFunction.get(key) || { functionName, url, lineNumber, selfMs: 0 }
    item.selfMs += (profile.timeDeltas[i] || 0) / 1000
    byFunction.set(key, item)
  }
  return [...byFunction.values()].sort((a, b) => b.selfMs - a.selfMs).slice(0, 45)
}

function traceSummary(buffer) {
  const trace = JSON.parse(Buffer.from(buffer).toString())
  const names = ['EvaluateScript', 'CompileScript', 'v8.compile', 'FunctionCall', 'UpdateLayoutTree', 'Layout', 'Paint', 'CompositeLayers', 'RunTask']
  const result = {}
  for (const event of trace.traceEvents) {
    if (event.ph !== 'X' || !names.includes(event.name)) continue
    const key = event.pid + ':' + event.tid + ':' + event.name
    const group = result[key] || (result[key] = { pid: event.pid, tid: event.tid, name: event.name, totalMs: 0, count: 0, maxMs: 0, longest: [] })
    const duration = (event.dur || 0) / 1000
    group.totalMs += duration
    group.count++
    group.maxMs = Math.max(group.maxMs, duration)
    if (duration >= 10) group.longest.push({ duration, time: event.ts / 1000, data: event.args?.data })
  }
  for (const group of Object.values(result)) group.longest = group.longest.sort((a, b) => b.duration - a.duration).slice(0, 10)
  return Object.values(result)
}

async function launch() {
  return puppeteer.launch({
    executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--force-device-scale-factor=1'],
  })
}

async function main() {
  fs.mkdirSync(out, { recursive: true })
  for (const mode of modes.filter(mode => selected === 'all' || mode === selected)) {
    if (selected === 'all' && fs.existsSync(path.join(out, mode + '.json'))) continue
    // A new process also isolates the shader cache, not just HTTP storage.
    const browser = await launch()
    try {
      const context = await browser.createBrowserContext()
      const page = await context.newPage()
      const mobile = mode.includes('mobile')
      const home = mode.startsWith('home')
      await page.setViewport(mobile
        ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
        : { width: 1440, height: 900, deviceScaleFactor: 1, hasTouch: false })
      const cdp = await page.createCDPSession()
      await cdp.send('Network.enable')
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: mode.includes('cpu4') ? 4 : 1 })
      await page.evaluateOnNewDocument(probe)
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      const url = base + (home ? '/' : '/services/web-design')
      if (mode.includes('warm')) {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
        await wait(13000)
        if (home) await page.evaluate(() => sessionStorage.removeItem('konaverse_home_entrance_seen'))
      } else {
        await cdp.send('Network.clearBrowserCache')
        await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
      }
      await cdp.send('Profiler.enable')
      await cdp.send('Profiler.setSamplingInterval', { interval: 1000 })
      await cdp.send('Profiler.start')
      console.log(mode + ': recording')
      await page.tracing.start({ categories: ['toplevel', 'devtools.timeline', 'v8.execute', 'blink.user_timing', 'disabled-by-default-devtools.timeline'] })
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
      await page.waitForFunction(() => performance.now() > 13000, { timeout: 60000 })
      const startup = await page.evaluate(() => ({ ...window.__firstLoad,
        resources: performance.getEntriesByType('resource').map(item => ({ name: item.name, type: item.initiatorType, start: item.startTime, duration: item.duration, bytes: item.transferSize })),
        navigation: performance.getEntriesByType('navigation')[0].toJSON(),
        ready: document.querySelector('.cal')?.dataset.ready,
        heroReady: document.querySelector('main.hm')?.dataset.heroReady,
      }))
      const { profile } = await cdp.send('Profiler.stop')
      console.log(mode + ': collecting trace')
      const trace = await page.tracing.stop()
      fs.writeFileSync(path.join(out, mode + '.trace.json.gz'), zlib.gzipSync(Buffer.from(trace)))
      fs.writeFileSync(path.join(out, mode + '.cpuprofile.gz'), zlib.gzipSync(JSON.stringify(profile)))
      const frames = []
      for (const frame of page.frames()) {
        if (!frame.url().includes('calendly.com')) continue
        frames.push(await frame.evaluate(() => ({ ...window.__firstLoad, frames: undefined, resources: undefined })).catch(() => ({ unavailable: true })))
      }
      await page.waitForFunction(() => document.querySelector('.cal')?.dataset.ready === 'true', { timeout: 60000 })
      const first = await page.evaluate(() => window.__firstLoad.draws)
      if (!mobile) {
        await page.mouse.move(100, 350)
        for (let i = 1; i <= 18; i++) {
          await page.mouse.move(100 + i * 50, 350 + Math.sin(i / 18 * Math.PI) * 70)
          await wait(20)
        }
      }
      const active = await page.evaluate(() => ({ draws: window.__firstLoad.draws, gl: window.__firstLoad.gl }))
      let settled, resting
      for (let i = 0; i < 20; i++) {
        settled = await page.evaluate(() => window.__firstLoad.draws)
        await wait(1000)
        resting = await page.evaluate(() => window.__firstLoad.draws)
        if (resting === settled) break
      }
      const summary = {
        mode, url, events: startup.events, contexts: startup.contexts, gl: startup.gl,
        topLongTasks: startup.tasks.sort((a, b) => b.duration - a.duration).slice(0, 12),
        longTaskTotalMs: startup.tasks.reduce((sum, task) => sum + task.duration, 0),
        longTaskCount: startup.tasks.length,
        maxFrameMs: Math.max(...startup.frames.filter(item => item.time > 500).map(item => item.delta), 0),
        ready: startup.ready, readyBeforeInteraction: true, heroReady: startup.heroReady, firstFluidDraw: startup.firstFluidDraw,
        cpu: cpuSummary(profile), trace: traceSummary(trace), calendly: frames,
        interaction: { activeDraws: active.draws - first, idleDraws: resting - settled, gl: active.gl.filter(item => item.time > 13000) }, errors,
      }
      await page.screenshot({ path: path.join(out, mode + '.png') })
      fs.writeFileSync(path.join(out, mode + '.json'), JSON.stringify({ summary, startup }, null, 2))
      console.log(JSON.stringify({ mode, longTasks: summary.longTaskTotalMs, maxFrameMs: summary.maxFrameMs, contexts: summary.contexts, ready: summary.ready, interaction: summary.interaction, top: summary.cpu.slice(0, 6), errors }))
      assert.equal(errors.length, 0, mode + ': runtime errors')
      assert.equal(summary.interaction.idleDraws, 0, mode + ': cursor rests')
      if (!mobile) assert.ok(summary.interaction.activeDraws > 0, mode + ': cursor responds')
      await context.close()
    } finally { await browser.close() }
  }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
