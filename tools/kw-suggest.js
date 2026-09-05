// Keyword research, step 1: autocomplete expansion (no login needed).
// Pulls Google + Bing suggestions for every seed, in two locales, plus an
// a–z suffix sweep for the core seeds. Output: docs/keyword-research/suggest.json
// and a readable suggest.md. Re-runnable; polite delay between requests.
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join('docs', 'keyword-research');
fs.mkdirSync(OUT_DIR, { recursive: true });

const A = [ // bucket A — Cyprus commercial
  'web design cyprus', 'website design cyprus', 'web development cyprus', 'web developer cyprus',
  'web design agency cyprus', 'web design company cyprus', 'website cost cyprus',
  'how much does a website cost in cyprus', 'web design nicosia', 'web design limassol',
  'web design larnaca', 'web design paphos', 'landing page design cyprus', 'seo cyprus',
  'seo services cyprus', 'ecommerce website cyprus', 'eshop cyprus', 'website redesign cyprus',
  'wordpress developer cyprus', 'digital agency cyprus', 'website builder cyprus',
];
const B = [ // bucket B — global niche
  '3d website', '3d website design', '3d website agency', '3d animated website', 'immersive website',
  'immersive website design', 'scrollytelling website', 'scrollytelling agency', 'webgl website',
  'webgl agency', 'three.js website', 'three.js agency', 'interactive website design',
  'awwwards agency', 'website redesign services', 'website redesign agency', 'one page website',
  'one page website design', 'single page website design', 'how much does a 3d website cost',
  '3d website cost', 'template vs custom website', 'custom website vs template',
  'what makes a website look premium', 'premium website design', 'how long does it take to build a website',
  'do i need a 3d website', 'next.js agency', 'creative web agency',
];
const CORE_SWEEP = ['web design cyprus', 'website cost cyprus', '3d website', 'scrollytelling', 'immersive website', 'webgl'];

const LOCALES = [
  { key: 'cy', gl: 'cy', hl: 'en', mkt: 'en-CY' },
  { key: 'ww', gl: 'us', hl: 'en', mkt: 'en-US' },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0 Safari/537.36';

async function google(q, loc) {
  const u = `https://suggestqueries.google.com/complete/search?client=firefox&gl=${loc.gl}&hl=${loc.hl}&q=${encodeURIComponent(q)}`;
  const r = await fetch(u, { headers: { 'user-agent': UA } });
  if (!r.ok) return [];
  const j = await r.json();
  return Array.isArray(j[1]) ? j[1] : [];
}
async function bing(q, loc) {
  const u = `https://api.bing.com/osjson.aspx?query=${encodeURIComponent(q)}&mkt=${loc.mkt}`;
  const r = await fetch(u, { headers: { 'user-agent': UA } });
  if (!r.ok) return [];
  const j = await r.json();
  return Array.isArray(j[1]) ? j[1] : [];
}

(async () => {
  const seeds = [...A.map((s) => ({ s, bucket: 'A' })), ...B.map((s) => ({ s, bucket: 'B' }))];
  const results = [];
  const seen = new Map(); // suggestion -> {bucket, sources:Set}
  const add = (sug, bucket, src, seed) => {
    const k = sug.toLowerCase().trim();
    if (!k || k === seed) return;
    if (!seen.has(k)) seen.set(k, { bucket, sources: new Set(), seeds: new Set() });
    seen.get(k).sources.add(src);
    seen.get(k).seeds.add(seed);
  };

  let n = 0;
  for (const { s, bucket } of seeds) {
    for (const loc of LOCALES) {
      const [g, b] = await Promise.all([google(s, loc).catch(() => []), bing(s, loc).catch(() => [])]);
      results.push({ seed: s, bucket, locale: loc.key, google: g, bing: b });
      g.forEach((x) => add(x, bucket, `google-${loc.key}`, s));
      b.forEach((x) => add(x, bucket, `bing-${loc.key}`, s));
      n++;
      await sleep(350);
    }
    process.stdout.write('.');
  }
  // a–z sweep on the core seeds, Google only, both locales
  for (const s of CORE_SWEEP) {
    const bucket = A.includes(s) ? 'A' : 'B';
    for (const loc of LOCALES) {
      for (const ch of 'abcdefghijklmnopqrstuvwxyz') {
        const g = await google(`${s} ${ch}`, loc).catch(() => []);
        g.forEach((x) => add(x, bucket, `google-${loc.key}-sweep`, s));
        await sleep(250);
      }
      process.stdout.write('+');
    }
  }
  console.log(`\n${n} seed×locale calls; ${seen.size} unique suggestions`);

  const flat = [...seen.entries()].map(([k, v]) => ({
    keyword: k, bucket: v.bucket, sources: [...v.sources].sort(), seeds: [...v.seeds].sort(),
  })).sort((a, b) => a.bucket.localeCompare(b.bucket) || b.sources.length - a.sources.length || a.keyword.localeCompare(b.keyword));

  fs.writeFileSync(path.join(OUT_DIR, 'suggest.json'), JSON.stringify({ generated: new Date().toISOString(), seeds: results, unique: flat }, null, 2));

  let md = `# Autocomplete expansion — ${new Date().toISOString().slice(0, 10)}\n\nGoogle (client=firefox suggest) + Bing (osjson), locales: cy = gl=cy/hl=en, ww = gl=us/hl=en. Suggestions are unique across seeds; "sources" counts how many engine×locale feeds returned it (a rough popularity signal — real volume comes from Keyword Planner).\n\n`;
  for (const bucket of ['A', 'B']) {
    md += `## Bucket ${bucket} — ${bucket === 'A' ? 'Cyprus commercial' : 'global niche'}\n\n| keyword | feeds | seeds |\n|---|---|---|\n`;
    for (const r of flat.filter((x) => x.bucket === bucket)) md += `| ${r.keyword} | ${r.sources.length} | ${r.seeds.join('; ')} |\n`;
    md += '\n';
  }
  fs.writeFileSync(path.join(OUT_DIR, 'suggest.md'), md);
  console.log('wrote', OUT_DIR);
})();
