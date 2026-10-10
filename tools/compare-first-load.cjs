/* Summarize renderer-specific trace cost. Long Tasks API can include frames. */
const fs = require('node:fs')
const path = require('node:path')
const zlib = require('node:zlib')
const root = path.resolve('docs/design/first-load')
const labels = process.argv.slice(2)
for (const label of labels.length ? labels : ['before', 'after']) {
  const dir = path.join(root, label)
  const results = []
  for (const file of fs.readdirSync(dir).filter(file => /^(home|service)-.*\.json$/.test(file))) {
    const { summary, startup } = JSON.parse(fs.readFileSync(path.join(dir, file)))
    const events = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(dir, file.replace('.json', '.trace.json.gz'))))).traceEvents
    const origin = new URL(summary.url).origin
    const mainPid = events.find(event => event.name === 'EvaluateScript' && event.args?.data?.url?.startsWith(origin))?.pid
    const mainTid = events.find(event => event.name === 'EvaluateScript' && event.pid === mainPid)?.tid
    const main = events.filter(event => event.ph === 'X' && event.pid === mainPid && event.tid === mainTid)
    const phases = {}
    for (const name of ['EvaluateScript', 'v8.compile', 'FunctionCall', 'Layout', 'UpdateLayoutTree', 'Paint']) {
      const items = main.filter(event => event.name === name)
      phases[name] = { totalMs: items.reduce((sum, event) => sum + (event.dur || 0) / 1000, 0), maxMs: Math.max(...items.map(event => (event.dur || 0) / 1000), 0) }
    }
    const long = main.filter(event => event.name === 'RunTask' && event.dur >= 50000)
    const waits = summary.gl.filter(item => /getProgramInfoLog|getShaderInfoLog|getProgramParameter|getShaderParameter/.test(item.name))
    const fluid = summary.contexts.find(item => item.type === 'webgl2')
    const heroWaits = waits.filter(item => !fluid || item.time < fluid.time)
    const cursorWaits = waits.filter(item => fluid && item.time >= fluid.time)
    const result = {
      mode: summary.mode, rendererLongTaskCount: long.length, rendererLongTaskMs: long.reduce((sum, event) => sum + event.dur / 1000, 0),
      maxRendererTaskMs: Math.max(...long.map(event => event.dur / 1000), 0),
      heroShaderWaitMs: heroWaits.reduce((sum, item) => sum + item.duration, 0),
      cursorShaderWaitMs: cursorWaits.reduce((sum, item) => sum + item.duration, 0),
      firstStrokeShaderWaitMs: summary.interaction.gl.filter(item => /getProgramInfoLog|getShaderInfoLog|getProgramParameter|getShaderParameter/.test(item.name)).reduce((sum, item) => sum + item.duration, 0),
      readyMs: summary.events.find(item => item.name === 'calendly-ready')?.time,
      heroReadyMs: summary.events.find(item => item.name === 'k-hero-ready')?.time,
      scriptBytes: startup.resources.filter(item => item.name.includes('_next') && item.type === 'script').reduce((sum, item) => sum + item.bytes, 0),
      phases,
    }
    results.push(result)
    console.log(JSON.stringify({ label, ...result }))
  }
  fs.writeFileSync(path.join(dir, 'summary.json'), JSON.stringify(results, null, 2))
}
