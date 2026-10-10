const fs = require('node:fs')
const path = require('node:path')
const zlib = require('node:zlib')
const dir = path.resolve('docs/design/first-load', process.argv[2] || 'baseline')
for (const name of fs.readdirSync(dir).filter(name => /^(home|service)-.*\.json$/.test(name))) {
  const { summary, startup } = JSON.parse(fs.readFileSync(path.join(dir, name)))
  const main = summary.trace.find(item => item.name === 'EvaluateScript' && item.longest.some(event => event.data?.url?.startsWith(summary.url.split('/').slice(0, 3).join('/'))))?.pid
  console.log(JSON.stringify({ mode: summary.mode, longTaskTotalMs: summary.longTaskTotalMs, tasks: summary.topLongTasks.slice(0, 6),
    events: summary.events, contexts: summary.contexts, gl: summary.gl,
    main: summary.trace.filter(item => item.pid === main && item.name !== 'RunTask').map(item => ({ name: item.name, total: item.totalMs, max: item.maxMs, longest: item.longest.slice(0, 4) })),
    calendlyTasks: summary.calendly.map(frame => ({ origin: frame.origin, tasks: frame.tasks?.slice(0, 4) })),
    scriptBytes: startup.resources.filter(item => item.type === 'script' && item.name.includes('_next')).reduce((sum, item) => sum + item.bytes, 0),
    cpu: summary.cpu.filter(item => item.url.includes('_next')).slice(0, 6),
  }))
}
if (process.argv[3]) {
  const profile = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(dir, process.argv[3] + '.cpuprofile.gz'))))
  const values = new Map()
  for (let i = 0; i < profile.samples.length; i++) values.set(profile.samples[i], (values.get(profile.samples[i]) || 0) + profile.timeDeltas[i] / 1000)
  for (const node of profile.nodes.filter(node => node.callFrame.url.includes('_next')).sort((a, b) => (values.get(b.id) || 0) - (values.get(a.id) || 0)).slice(0, 15)) {
    const { url, lineNumber, columnNumber } = node.callFrame
    const file = path.join('.next/static/chunks', url.split('/').pop())
    const line = fs.existsSync(file) ? fs.readFileSync(file, 'utf8').split('\n')[lineNumber] || '' : ''
    console.log(JSON.stringify({ frame: node.callFrame, selfMs: values.get(node.id), code: line.slice(Math.max(0, columnNumber - 100), columnNumber + 500) }))
  }
}
