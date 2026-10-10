/* Compare the raster to the original SVG at identical CSS animation times. */
const fs = require('node:fs')
const path = require('node:path')
const assert = require('node:assert/strict')
const puppeteer = require('puppeteer-core')
const sharp = require('sharp')
const base = process.argv[2] || 'http://127.0.0.1:3007'
const out = path.resolve('docs/design/service-template/ray-parity')
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

async function main() {
  fs.mkdirSync(out, { recursive: true })
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--enable-unsafe-swiftshader', '--use-gl=angle'] })
  const results = []
  try {
    for (const [name, width, height, dpr] of [['desktop', 1440, 900, 1], ['mobile', 390, 844, 1], ['retina', 390, 844, 2]]) {
      const page = await browser.newPage()
      await page.setViewport({ width, height, deviceScaleFactor: dpr })
      await page.evaluateOnNewDocument(() => { localStorage.setItem('konaverse_cookie_consent', 'declined'); Math.random = () => 0.5 })
      await page.goto(base + '/services/web-design', { waitUntil: 'networkidle0' })
      await page.waitForSelector('[data-rays-live]')
      await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('k:freeze', { detail: true }))
        document.getAnimations().forEach(animation => animation.pause())
        const style = document.createElement('style')
        style.textContent = '.ro-rays--svg { animation:ro-turn 90s linear infinite; } .ro-rays--svg line { animation:ro-ray 4s ease-in-out infinite alternate; }'
        document.head.appendChild(style)
      })
      for (const time of [0, 1700, 12000, 45678]) {
        await page.evaluate(time => {
          document.querySelector('.ro-rays--svg').style.display = 'block'
          document.querySelector('.ro-rays--canvas').style.visibility = 'hidden'
          for (const animation of document.querySelector('.ro-rays--svg').getAnimations({ subtree: true })) { animation.pause(); animation.currentTime = time }
        }, time)
        await wait(100)
        const svgPath = path.join(out, `${name}-${time}-svg.png`)
        await page.screenshot({ path: svgPath })
        await page.evaluate(time => {
          document.querySelector('.ro-rays--svg').style.display = 'none'
          const canvas = document.querySelector('.ro-rays--canvas')
          canvas.style.visibility = 'visible'
          const clock = canvas.getAnimations()[0]
          clock.pause(); clock.currentTime = time
          window.dispatchEvent(new Event('k:page-snapshot'))
        }, time)
        await wait(100)
        const canvasPath = path.join(out, `${name}-${time}-canvas.png`)
        await page.screenshot({ path: canvasPath })
        const original = await sharp(svgPath).removeAlpha().raw().toBuffer()
        const raster = await sharp(canvasPath).removeAlpha().raw().toBuffer()
        assert.equal(original.length, raster.length)
        let total = 0, max = 0, changed = 0
        for (let i = 0; i < original.length; i++) { const difference = Math.abs(original[i] - raster[i]); total += difference; max = Math.max(max, difference); if (difference > 10) changed++ }
        const result = { name, time, meanChannelDifference: total / original.length, maxChannelDifference: max, shareOver10: changed / original.length }
        results.push(result); console.log(JSON.stringify(result))
        // Canvas is a composited bitmap; Retina subpixel edges differ from
        // directly painted SVG. Keep a separate, explicit edge tolerance.
        assert.ok(result.meanChannelDifference < (dpr === 1 ? 0.12 : 0.35), 'SVG/raster picture agrees beyond antialiasing')
        assert.ok(result.shareOver10 < (dpr === 1 ? 0.002 : 0.004), 'different pixels remain confined to hairline edges')
      }
      await page.close()
    }
    fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(results, null, 2))
  } finally { await browser.close() }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
