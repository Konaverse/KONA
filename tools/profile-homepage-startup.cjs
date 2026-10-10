const fs = require('node:fs')
const path = require('node:path')
const assert = require('node:assert/strict')
const puppeteer = require('puppeteer-core')
const label = process.argv[2].replace(/^homepage-/, '')
const base = process.argv[3] || 'http://127.0.0.1:3007'
const out = path.resolve('docs/design/homepage-startup', label)
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function main() {
  fs.mkdirSync(out, { recursive: true })
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--force-device-scale-factor=1'],
  })
  try {
    const results = []
    for (const mode of ['desktop-cold', 'desktop-warm', 'desktop-slow', 'mobile-cold']) {
      const page = await browser.newPage()
      const mobile = mode.startsWith('mobile')
      await page.setViewport(mobile
        ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
        : { width: 1440, height: 900, deviceScaleFactor: 1, hasTouch: false })
      const cdp = await page.createCDPSession()
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: mode.includes('slow') ? 4 : 1 })
      await cdp.send('Network.setCacheDisabled', { cacheDisabled: !mode.includes('warm') })
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      await page.evaluateOnNewDocument(() => {
        localStorage.setItem('konaverse_cookie_consent', 'declined')
        let randomState = 42
        Math.random = () => { randomState = (randomState * 1664525 + 1013904223) >>> 0; return randomState / 4294967296 }
        const report = { events: [], contexts: [], uploads: [], videoFrames: [], longTasks: [], frames: [], reads: {} }
        window.__startupProbe = report
        for (const name of ['k-peel-armed', 'k-hero-open', 'k-hero-sew', 'k-hero-ready']) {
          window.addEventListener(name, () => report.events.push({ name, time: performance.now() }))
        }
        const getContext = HTMLCanvasElement.prototype.getContext
        const videoCallback = HTMLVideoElement.prototype.requestVideoFrameCallback
        const lastMediaTime = new WeakMap()
        if (videoCallback) HTMLVideoElement.prototype.requestVideoFrameCallback = function (callback) {
          const video = this
          return videoCallback.call(video, (now, metadata) => {
            lastMediaTime.set(video, metadata.mediaTime)
            report.videoFrames.push({ time: now, mediaTime: metadata.mediaTime })
            callback(now, metadata)
          })
        }
        HTMLCanvasElement.prototype.getContext = function (type, ...args) {
          const start = performance.now()
          const result = getContext.call(this, type, ...args)
          if (type.startsWith('webgl')) report.contexts.push({ type, time: start, duration: performance.now() - start, className: this.className, parent: this.parentElement?.className })
          return result
        }
        for (const type of [WebGLRenderingContext, WebGL2RenderingContext]) {
          const original = type.prototype.texImage2D
          type.prototype.texImage2D = function (...args) {
            const video = args.find(arg => arg instanceof HTMLVideoElement)
            if (video) report.uploads.push({ time: performance.now(), videoTime: video.currentTime, frames: video.getVideoPlaybackQuality().totalVideoFrames, callbackMediaTime: lastMediaTime.get(video) })
            return original.apply(this, args)
          }
        }
        const rect = Element.prototype.getBoundingClientRect
        Element.prototype.getBoundingClientRect = function () {
          const key = ['hm-claim', 'hm-heropin', 'svs-list', 'wl-marq'].find(name => this.classList.contains(name))
          if (key) {
            const second = Math.floor(performance.now() / 1000)
            const counts = report.reads[second] || (report.reads[second] = {})
            counts[key] = (counts[key] || 0) + 1
          }
          return rect.call(this)
        }
        new PerformanceObserver(list => report.longTasks.push(...list.getEntries().map(entry => ({ time: entry.startTime, duration: entry.duration })))).observe({ type: 'longtask', buffered: true })
        let previous = performance.now()
        const frame = (now) => {
          report.frames.push({ time: now, delta: now - previous })
          previous = now
          if (now < 12000) requestAnimationFrame(frame)
        }
        requestAnimationFrame(frame)
      })
      if (mode.includes('warm')) {
        await page.goto(base + '/', { waitUntil: 'networkidle0', timeout: 60000 })
        await wait(1000)
        // Measure an opening with warm assets, independent of repeat-visit behavior.
        await page.evaluate(() => sessionStorage.removeItem('konaverse_home_entrance_seen'))
      }
      await page.goto(base + '/', { waitUntil: 'load', timeout: 60000 })
      await page.waitForFunction(() => performance.now() > 10000, { timeout: 30000 })
      if (label !== 'before') await page.waitForFunction(() => {
        const ready = window.__startupProbe.events.find(event => event.name === 'k-hero-ready')
        return ready && performance.now() > ready.time + 2000
      }, { timeout: 60000 })
      const report = await page.evaluate(() => ({
        ...window.__startupProbe,
        videos: [...document.querySelectorAll('video')].map(v => ({ className: v.className, src: v.getAttribute('src'), readyState: v.readyState, paused: v.paused, time: v.currentTime })),
        lowerWipes: document.querySelectorAll('.sv2 .k-wipe-l, .inv .k-wipe-l, .ft .k-wipe-l').length,
        copyOpacity: getComputedStyle(document.querySelector('.hw-para')).opacity,
      }))
      const firstOpen = report.events.find(event => event.name === 'k-hero-open')?.time || 0
      const firstSew = report.events.find(event => event.name === 'k-hero-sew')?.time || 0
      const entranceFrames = report.frames.filter(frame => frame.time >= (firstOpen || firstSew) && frame.time <= firstSew + 1800)
      const summary = {
        mode, events: report.events, contexts: report.contexts, reads: report.reads,
        videoUploads: report.uploads.length,
        repeatedVideoFrameUploads: report.uploads.filter((upload, i) => i > 0 && upload.frames === report.uploads[i - 1].frames).length,
        repeatedCallbackFrameUploads: report.uploads.filter((upload, i) => i > 0 && upload.callbackMediaTime !== undefined && upload.callbackMediaTime === report.uploads[i - 1].callbackMediaTime).length,
        longTaskCount: report.longTasks.length,
        longTaskTotalMs: report.longTasks.reduce((total, task) => total + task.duration, 0),
        entranceFramesOver33ms: entranceFrames.filter(frame => frame.delta > 33.4).length,
        entranceFramesOver50ms: entranceFrames.filter(frame => frame.delta > 50).length,
        maxFrameMs: Math.max(...entranceFrames.map(frame => frame.delta), 0),
        lowerWipes: report.lowerWipes, videos: report.videos, copyOpacity: report.copyOpacity, errors,
      }
      results.push(summary)
      fs.writeFileSync(path.join(out, mode + '.json'), JSON.stringify({ summary, report }, null, 2))
      await page.screenshot({ path: path.join(out, mode + '.png') })
      if (label !== 'before') {
        assert.equal(errors.length, 0, mode + ': runtime errors')
        assert.equal(Number(report.copyOpacity), 1, mode + ': hero copy arrived')
        const ready = report.events.find(event => event.name === 'k-hero-ready')
        assert.ok(ready, mode + ': entrance finished')
        const fluid = report.contexts.find(context => context.type === 'webgl2')
        if (fluid) assert.ok(fluid.time > ready.time, mode + ': cursor setup waits for entrance')
        assert.equal(report.contexts.some(context => context.parent?.includes('ft-field')), false, mode + ': offscreen field deferred')
        assert.equal(report.lowerWipes, 0, mode + ': offscreen text measurement deferred')
        assert.equal(summary.repeatedCallbackFrameUploads, 0, mode + ': upload only once per video-frame callback')
        for (const [second, reads] of Object.entries(report.reads)) {
          assert.equal(reads['svs-list'] || 0, 0, mode + ': offscreen services asleep')
          assert.equal(reads['wl-marq'] || 0, 0, mode + ': offscreen marquee asleep')
          if (Number(second) > Math.ceil(ready.time / 1000) + 1) {
            assert.equal(reads['hm-heropin'] || 0, 0, mode + ': resting peel asleep')
            assert.equal(reads['hm-claim'] || 0, 0, mode + ': resting claim asleep')
          }
        }
        const sew = report.events.find(event => event.name === 'k-hero-sew')
        const armed = report.events.find(event => event.name === 'k-peel-armed')
        if (armed) assert.ok(armed.time <= sew.time, mode + ': cover cannot arrive after headline')
      }
      console.log(JSON.stringify(summary))
      await page.close()
    }
    fs.writeFileSync(path.join(out, 'summary.json'), JSON.stringify(results, null, 2))
  } finally { await browser.close() }
}
if (label.startsWith('session')) require('./check-homepage-session.cjs')
else if (label.startsWith('check-')) require('./check-homepage-motion.cjs')
else main().catch(error => { console.error(error); process.exitCode = 1 })
