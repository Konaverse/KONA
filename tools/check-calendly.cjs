const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const puppeteer = require('puppeteer-core')
const sharp = require('sharp')
const label = process.argv[2] || 'before'
const base = process.argv[3] || 'http://127.0.0.1:3007'
const out = path.resolve('docs/design/calendly', label)
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

async function main() {
  fs.mkdirSync(out, { recursive: true })
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true, args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader'] })
  const results = []
  try {
    for (const mode of ['desktop', 'mobile']) {
      const context = await browser.createBrowserContext()
      const page = await context.newPage()
      await page.setViewport(mode === 'mobile' ? { width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true }
        : { width: 1440, height: 900, deviceScaleFactor: 1 })
      const errors = [], requests = [], failures = []
      page.on('pageerror', error => errors.push(error.message))
      page.on('request', request => {
        if (request.isNavigationRequest() && request.url().startsWith('https://calendly.com/')) requests.push({ url: request.url(), time: Date.now() })
      })
      page.on('requestfailed', request => {
        if (/calendly/.test(request.url())) failures.push({ url: request.url(), error: request.failure()?.errorText })
      })
      await page.evaluateOnNewDocument(() => {
        localStorage.setItem('konaverse_cookie_consent', 'declined')
        sessionStorage.setItem('konaverse_home_entrance_seen', '1')
        window.__calProbe = { events: [], start: performance.now() }
        window.addEventListener('message', e => {
          if (e.origin === 'https://calendly.com' && e.data?.event?.startsWith('calendly.')) {
            window.__calProbe.events.push({ event: e.data.event, time: performance.now() })
          }
        })
      })
      await page.goto(base + '/privacy', { waitUntil: 'domcontentloaded' })
      if (label === 'debug-visible') await page.addStyleTag({ content: '.cal[data-mode="parked"] .cal-pop {left:0!important;top:0!important;visibility:visible!important;opacity:0!important}' })
      if (label === 'debug-behind') await page.addStyleTag({ content: '.cal[data-mode="parked"] .cal-pop {left:0!important;top:0!important;visibility:visible!important;opacity:1!important;z-index:-1!important}' })
      await wait(6500)
      if (label !== 'before') await page.waitForFunction(() => document.querySelector('.cal')?.dataset.ready === 'true', { timeout: 30000 }).catch(async error => {
        console.log(JSON.stringify({ error: error.message, errors, requests, failures, state: await page.evaluate(() => ({ events: window.__calProbe.events,
          cal: document.querySelector('.cal')?.outerHTML.slice(0, 2500), frames: [...document.querySelectorAll('iframe')].map(f => f.src) })) }))
        for (const f of page.frames().filter(f => /calendly/.test(f.url()))) console.log(JSON.stringify(await f.evaluate(() => ({ url: location.href, text: document.body?.innerText.slice(0, 2000) })).catch(e => ({ error: e.message }))))
        throw error
      })
      const idle = await page.evaluate(() => ({ events: window.__calProbe.events,
        ready: document.querySelector('.cal')?.dataset.ready,
        mode: document.querySelector('.cal')?.dataset.mode,
        frames: [...document.querySelectorAll('iframe[src*="calendly.com"]')].map(f => ({ src: f.src, width: f.clientWidth, height: f.clientHeight })) }))
      await page.screenshot({ path: path.join(out, mode + '-parked.png') })
      if (label !== 'before') {
        assert.equal(idle.frames.length, 1)
        assert.equal(idle.ready, 'true')
        assert.equal(idle.mode, 'parked')
        await page.evaluate(() => { window.__calOriginal = document.querySelector('.cal iframe'); window.__calWindow = window.__calOriginal.contentWindow })
        // Verify the fully rendered warm-up frame cannot paint over the site.
        await page.evaluate(() => { document.querySelector('.cal').dataset.ready = 'warming' })
        const warm = await page.screenshot({ path: path.join(out, mode + '-warm-hidden.png') })
        await page.$eval('.cal-pop', el => { el.style.visibility = 'hidden' })
        const hidden = await page.screenshot()
        const a = await sharp(warm).raw().toBuffer(), b = await sharp(hidden).raw().toBuffer()
        let difference = 0
        for (let i = 0; i < a.length; i++) difference += Math.abs(a[i] - b[i])
        assert.ok(difference / a.length < 0.01, 'warming calendar does not change the visible page')
        await page.evaluate(() => { document.querySelector('.cal').dataset.ready = 'true'; document.querySelector('.cal-pop').style.visibility = '' })
      }
      const reqBeforeOpen = requests.length
      await page.evaluate(() => {
        const a = document.createElement('a'); a.href = 'https://calendly.com/kona-verse/30min'; a.textContent = 'Probe booking'
        Object.assign(a.style, { position: 'fixed', left: '30px', top: '75px', zIndex: '100' }); a.id = 'cal-probe-link'; document.body.appendChild(a)
        window.__calProbe.click = performance.now(); a.click()
        window.__calProbe.readyAtClick = document.querySelector('.cal')?.dataset.ready === 'true'
        window.__calProbe.openedAt = performance.now()
      })
      if (label !== 'before') await page.screenshot({ path: path.join(out, mode + '-first-modal-frame.png') })
      await wait(label === 'before' ? 7000 : 1000)
      const open = await page.evaluate(() => ({ ...window.__calProbe,
        frames: document.querySelectorAll('iframe[src*="calendly.com"]').length,
        ready: document.querySelector('.cal')?.dataset.ready,
        noteHidden: document.querySelector('.cal-note')?.hidden,
        note: document.querySelector('.cal-note')?.textContent }))
      if (label !== 'before') {
        assert.equal(requests.length, reqBeforeOpen, 'opening uses the preloaded document')
        assert.equal(open.noteHidden, true)
        assert.equal(open.ready, 'true')
        assert.equal(open.readyAtClick, true)
      }
      const cal = page.frames().find(f => f.url().startsWith('https://calendly.com/'))
      const calendar = cal ? await cal.evaluate(() => ({ text: document.body.innerText.slice(0, 1600), buttons: document.querySelectorAll('button').length })).catch(e => ({ error: e.message })) : null
      await page.screenshot({ path: path.join(out, mode + '-modal.png') })
      await page.keyboard.press('Escape')
      await wait(500)
      await page.evaluate(() => document.querySelector('#cal-probe-link').remove())
      const reqBeforeContact = requests.length
      await page.evaluate(() => {
        window.__calProbe.contact = performance.now()
        const a = document.querySelector('.ft-link[href="/contact"]'); a?.click()
      })
      await page.waitForFunction(() => location.pathname === '/contact' && !document.documentElement.classList.contains('k-pt-active'))
      await wait(label === 'before' ? 7000 : 1000)
      const contact = await page.evaluate(() => ({ ...window.__calProbe,
        mode: document.querySelector('.cal')?.dataset.mode,
        sameFrame: window.__calOriginal === document.querySelector('.cal iframe'),
        sameWindow: window.__calWindow === document.querySelector('.cal iframe')?.contentWindow,
        frames: [...document.querySelectorAll('iframe[src*="calendly.com"]')].map(f => ({ src: f.src, rect: f.getBoundingClientRect().toJSON() })),
        slot: document.querySelector('.ct-cal-host')?.getBoundingClientRect().toJSON() }))
      await page.screenshot({ path: path.join(out, mode + '-contact.png') })
      const checks = {}
      if (label !== 'before') {
        assert.equal(contact.mode, 'inline')
        assert.equal(contact.sameFrame, true)
        assert.equal(contact.sameWindow, true)
        assert.equal(requests.length, reqBeforeContact, 'contact does not create another booking document')
        const frameRect = contact.frames[0].rect
        for (const key of ['left', 'top', 'width', 'height']) assert.ok(Math.abs(frameRect[key] - contact.slot[key]) < 0.2, key + ': aligns with contact slot')
        await page.$eval('[data-calendly-inline]', el => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
        await wait(250)
        await page.screenshot({ path: path.join(out, mode + '-contact-scrolled.png') })
        checks.scrollAlignment = await page.evaluate(() => {
          const a = document.querySelector('[data-calendly-inline]').getBoundingClientRect(), b = document.querySelector('.cal iframe').getBoundingClientRect()
          return Math.max(...['left', 'top', 'width', 'height'].map(key => Math.abs(a[key] - b[key])))
        })
        assert.ok(checks.scrollAlignment < 0.2)
        const selected = await cal.evaluate(() => {
          const day = [...document.querySelectorAll('button')].find(b => !b.disabled && /available/i.test(b.getAttribute('aria-label') || ''))
          if (!day) return false
          day.click(); return true
        })
        if (selected) {
          await wait(600)
          checks.selectedDay = true
          checks.selectionText = await cal.evaluate(() => document.body.innerText)
        }
        await page.click('.k-menu-btn')
        await wait(1300)
        checks.menuAlignment = await page.evaluate(() => {
          const a = document.querySelector('.k-shift [data-calendly-inline]').getBoundingClientRect(), b = document.querySelector('.cal iframe').getBoundingClientRect()
          return { delta: Math.max(...['left', 'top', 'width', 'height'].map(key => Math.abs(a[key] - b[key]))), inert: document.querySelector('.cal-pop').inert }
        })
        assert.ok(checks.menuAlignment.delta < 0.3, 'calendar rides scaled menu page')
        assert.equal(checks.menuAlignment.inert, true)
        await page.screenshot({ path: path.join(out, mode + '-menu.png') })
        await page.click('.k-menu-btn')
        await wait(1300)
        await page.$eval('.ft-link[href="/privacy"]', el => el.click())
        await page.waitForFunction(() => location.pathname === '/privacy' && !document.documentElement.classList.contains('k-pt-active'))
        await wait(200)
        assert.equal(await page.$eval('.cal', el => el.dataset.mode), 'parked')
        await page.$eval('.ft-link[href="/contact"]', el => el.click())
        await page.waitForFunction(() => location.pathname === '/contact' && !document.documentElement.classList.contains('k-pt-active'))
        await wait(250)
        checks.returnReady = await page.evaluate(() => document.querySelector('.cal').dataset.ready === 'true'
          && window.__calOriginal === document.querySelector('.cal iframe') && window.__calWindow === document.querySelector('.cal iframe').contentWindow)
        assert.equal(checks.returnReady, true)
        if (selected) assert.match(await cal.evaluate(() => document.body.innerText), /Select a Time/, 'selected date survives route returns')
        await wait(500)
        await page.evaluate(() => {
          window.__calRect = Element.prototype.getBoundingClientRect
          window.__calIdleReads = 0
          Element.prototype.getBoundingClientRect = function (...args) {
            if (this.hasAttribute('data-calendly-inline')) window.__calIdleReads++
            return window.__calRect.apply(this, args)
          }
        })
        await wait(1100)
        checks.idleSlotReads = await page.evaluate(() => {
          Element.prototype.getBoundingClientRect = window.__calRect
          return window.__calIdleReads
        })
        assert.equal(checks.idleSlotReads, 0, 'no idle positioning loop')
        await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
        await page.$eval('.ft-link[href="/privacy"]', el => el.click())
        await page.waitForFunction(() => location.pathname === '/privacy' && !document.querySelector('.k-pt__ghost'))
        await page.$eval('.ft-link[href="/contact"]', el => el.click())
        await page.waitForFunction(() => location.pathname === '/contact' && document.querySelector('.cal').dataset.mode === 'inline')
        checks.reducedMotion = true
        assert.equal(requests.length, 1, 'one Calendly navigation through all opens and route changes')
        assert.equal(errors.length, 0)
      }
      results.push({ mode, idle, open, calendar, contact, checks, requests, contactRequests: requests.length - reqBeforeContact, failures, errors })
      console.log(JSON.stringify(results.at(-1)))
      await context.close()
    }
    fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(results, null, 2))
  } finally { await browser.close() }
}
async function coldChecks() {
  fs.mkdirSync(out, { recursive: true })
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true,
    args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader'] })
  const results = []
  try {
    for (const mode of label === 'reopen' ? ['desktop', 'mobile'] : ['desktop', 'mobile', 'blocked', 'no-js']) {
      const context = await browser.createBrowserContext()
      const page = await context.newPage()
      await page.setViewport(mode === 'desktop' ? { width: 1440, height: 900, deviceScaleFactor: 1 }
        : { width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
      const errors = []
      let frameRequests = 0
      page.on('request', request => { if (request.isNavigationRequest() && request.url().startsWith('https://calendly.com/')) frameRequests++ })
      page.on('pageerror', e => errors.push(e.message))
      if (mode === 'no-js') await page.setJavaScriptEnabled(false)
      if (mode === 'blocked') {
        await page.setRequestInterception(true)
        page.on('request', request => request.url().startsWith('https://calendly.com/') ? request.abort() : request.continue())
      }
      await page.evaluateOnNewDocument(() => localStorage.setItem('konaverse_cookie_consent', 'declined'))
      await page.goto(base + '/contact', { waitUntil: 'domcontentloaded' })
      let state
      if (mode === 'no-js') {
        assert.ok(await page.$('.ct-cal-host noscript iframe[loading="eager"]'))
        assert.ok(await page.$('.ct-cal-out[target="_blank"]'))
        state = { directFrameAndLinkRendered: true }
      } else if (mode === 'blocked') {
        await page.waitForFunction(() => document.querySelector('.cal-note [data-calendly-external]') && !document.querySelector('.cal-note').hidden, { timeout: 22000 })
        state = await page.$eval('.cal-note', el => ({ fallback: el.innerText, href: el.querySelector('a').href }))
        assert.match(state.fallback, /Open the calendar in a new tab/)
      } else {
        await page.waitForFunction(() => document.querySelector('.cal')?.dataset.mode === 'inline')
        await page.waitForFunction(() => document.querySelector('.cal')?.dataset.ready === 'true', { timeout: 45000 })
        state = await page.evaluate(() => {
          const frame = document.querySelector('.cal iframe')
          return { ready: true, earlyEventRemembered: window.__konaverseCalendlyReady?.has(frame.contentWindow),
            frame: frame.getBoundingClientRect().toJSON(), slot: document.querySelector('[data-calendly-inline]').getBoundingClientRect().toJSON() }
        })
        assert.equal(state.earlyEventRemembered, true)
        for (const key of ['left', 'top', 'width', 'height']) assert.ok(Math.abs(state.frame[key] - state.slot[key]) < 0.2)
        if (label === 'reopen') {
          await page.evaluate(() => {
            window.__calOriginal = document.querySelector('.cal iframe')
            const a = document.createElement('a'); a.href = 'https://calendly.com/kona-verse/30min'; a.id = 'cal-reopen'
            a.textContent = 'Booking probe'; Object.assign(a.style, { position: 'fixed', top: '75px', left: '30px' }); document.body.append(a)
          })
          for (let i = 0; i < 2; i++) {
            await page.$eval('#cal-reopen', el => el.click())
            await wait(800)
            assert.equal(await page.$eval('.cal', el => el.dataset.mode), 'popover')
            assert.equal(await page.evaluate(() => document.querySelector('.cal iframe') === window.__calOriginal && document.querySelector('.cal').dataset.ready === 'true'), true)
            assert.equal(await page.$eval('.cal-note', el => el.hidden), true)
            const box = await page.$eval('.cal iframe', el => el.getBoundingClientRect().toJSON())
            assert.ok(Math.abs(box.width - 340) < 1, 'inline transform does not leak into reopened modal')
            await page.keyboard.press('Escape')
            await wait(500)
            assert.equal(await page.$eval('.cal', el => el.dataset.mode), 'inline')
          }
          assert.equal(frameRequests, 1)
          state.modalReopens = 2
          state.frameRequests = frameRequests
          await page.$eval('#cal-reopen', el => el.remove())
        }
      }
      await page.screenshot({ path: path.join(out, mode + '.png') })
      assert.equal(errors.length, 0)
      results.push({ mode, ...state, errors })
      console.log(JSON.stringify(results.at(-1)))
      await context.close()
    }
    fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(results, null, 2))
  } finally { await browser.close() }
}
(['cold', 'reopen'].includes(label) ? coldChecks() : main()).catch(error => { console.error(error); process.exitCode = 1 })
