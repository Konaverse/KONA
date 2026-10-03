// List em dashes that are in COPY (string literals, JSX text), not in comments.
//   node tools/dashes.js [dir ...]        (default: src)
// Comments are stripped with a small scanner that knows strings, template
// literals, // and /* */ (JSX {/* */} is the same token).
const fs = require('fs')
const path = require('path')
const roots = process.argv.slice(2).length ? process.argv.slice(2) : ['src']
const files = []
const walk = (d) => {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name)
    if (f.isDirectory()) walk(p)
    else if (/\.(ts|tsx)$/.test(f.name)) files.push(p)
  }
}
roots.forEach((r) => (fs.statSync(r).isDirectory() ? walk(r) : files.push(r)))

const strip = (src) => {
  let out = ''
  let i = 0
  let mode = null // null | "'" | '"' | '`'
  while (i < src.length) {
    const c = src[i]
    const n = src[i + 1]
    if (mode) {
      out += c
      if (c === '\\') {
        out += n ?? ''
        i += 2
        continue
      }
      if (c === mode) mode = null
      i++
      continue
    }
    if (c === '/' && n === '/') {
      while (i < src.length && src[i] !== '\n') i++
      continue
    }
    if (c === '/' && n === '*') {
      i += 2
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) {
        if (src[i] === '\n') out += '\n'
        i++
      }
      i += 2
      continue
    }
    if (c === '"' || c === '`') mode = c
    // an apostrophe in JSX text ("don't") is not a string: only open on a
    // quote that follows a code-ish character
    if (c === "'" && /[\s(,[{=:?+!&|>]/.test(src[i - 1] || ' ')) mode = c
    out += c
    i++
  }
  return out
}

let total = 0
for (const f of files) {
  const lines = strip(fs.readFileSync(f, 'utf8')).split('\n')
  const hits = []
  lines.forEach((l, k) => {
    if (l.includes('—')) hits.push(k + 1)
  })
  if (hits.length) {
    total += hits.length
    console.log(`${f.replace(/\\/g, '/')}  (${hits.length})  ${process.env.LINES ? hits.join(',') : ''}`)
  }
}
console.log(`\n${total} em dashes in copy`)
