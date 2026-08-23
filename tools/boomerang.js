/* BUILD A SEAMLESS LOOP OUT OF A CLIP THAT DOES NOT LOOP.
 *
 *   node tools/boomerang.js <in.mp4> <out.mp4> [width] [fps] [crf]
 *
 * The card backgrounds are randomised abstract shader renders: their last
 * frame has nothing to do with their first, so playing one on `loop` cuts
 * hard once a cycle. The fix (user's, and it is the right one) is to play the
 * clip forwards and then backwards, so both junctions are frames meeting
 * themselves.
 *
 * WHY BUILD THE FILE RATHER THAN REVERSE IN THE BROWSER. Playing a <video>
 * backwards means stepping `currentTime` down from a rAF loop, and video is
 * only decodable forwards from a keyframe — every backward step re-decodes
 * from the nearest one. It stutters, it pins a core, and it is not
 * hardware-accelerated. A concatenated file is an ordinary forward decode:
 * the GPU does it for free, and `loop` needs no JS at all.
 *
 * TWO THINGS THAT ARE EASY TO GET WRONG, AND BOTH SHOW:
 *
 * 1. THE DUPLICATE FRAMES. Naively, forward is f0..fN and the reverse is
 *    fN..f0, so fN plays twice at the join; and the last frame of the reverse
 *    is f0, which the loop then plays again. Two one-frame hitches, once a
 *    cycle each, and they read as a tic. So the reversed half is the INTERIOR
 *    only — f(N-1)..f1 — and every frame in the finished loop is distinct
 *    from its neighbour.
 *
 * 2. THE HELD FIRST FRAME. Every one of these clips opens on a few identical
 *    frames — a static hold before the shader starts moving, black in most of
 *    them. Left in, the boomerang parks on it once a cycle: a visible blink
 *    at exactly the moment the loop is supposed to be invisible. So the head
 *    is trimmed to the first frame that actually differs from frame 0, found
 *    by reading per-frame luma rather than by guessing a number per file.
 *
 * Output is halved in resolution and framerate on purpose: the plate renders
 * about 630x280 CSS, and 60fps on an ambient background behind an object is
 * paying twice for something nobody can see.
 *
 * ── AND IT IS GRADED DOWN, WHICH IS NOT OPTIONAL ──────────────────────────
 * These renders are lit as hero art: bright chrome, full contrast, the
 * brightest thing in any frame. Behind a chrome object they are a disaster —
 * same material, same value range, and the gaps between a deconstructed
 * object's pieces stop reading as absence because what shows through them is
 * brighter than the object. A background has to be darker than the thing in
 * front of it or there is no thing in front of it.
 *
 * So the grade is baked in rather than scrimmed at runtime: a CSS overlay
 * strong enough to fix this would be most of a black rectangle, and it would
 * cost a composited layer on every card to do what ffmpeg does once. The
 * slight blur is the same idea — it is a background, and backgrounds are out
 * of focus.
 */
const { execFileSync } = require('child_process')
const fs = require('fs')

const IN = process.argv[2]
const OUT = process.argv[3]
const WIDTH = Number(process.argv[4] || 1280)
const FPS = Number(process.argv[5] || 30)
const CRF = Number(process.argv[6] || 26)
/* brightness/contrast/saturation/blur, tuned so the loop lands in the plate's
   own value range instead of above it. Override with GRADE=... for art that
   arrives darker; GRADE=none ships it straight. */
const GRADE = process.env.GRADE ?? 'eq=brightness=-0.22:contrast=0.55:saturation=0.5,gblur=sigma=1.1'
if (!IN || !OUT) {
  console.error('usage: node tools/boomerang.js <in.mp4> <out.mp4> [width] [fps] [crf]')
  process.exit(1)
}

const run = (args) => execFileSync('ffmpeg', args, { encoding: 'buffer', maxBuffer: 1 << 28 })
const probe = (args) => execFileSync('ffprobe', args, { encoding: 'utf8' }).trim()

/** per-frame average luma, so the held head can be found rather than guessed */
function lumaSeries(file) {
  const out = execFileSync(
    'ffmpeg',
    ['-v', 'error', '-i', file, '-vf', 'signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-', '-f', 'null', '-'],
    { encoding: 'utf8', maxBuffer: 1 << 28 },
  )
  return out
    .split('\n')
    .filter((l) => l.includes('YAVG'))
    .map((l) => Number(l.split('=')[1]))
}

const luma = lumaSeries(IN)
let head = 0
while (head < luma.length - 1 && Math.abs(luma[head + 1] - luma[0]) < 0.5) head++
/* `head` is the last frame of the hold; start on the one after it */
const start = Math.min(head + 1, luma.length - 1)

const tmp = OUT.replace(/\.mp4$/, '.norm.mp4')
run([
  '-v', 'error', '-y', '-i', IN,
  '-vf', [
    `trim=start_frame=${start}`, 'setpts=PTS-STARTPTS',
    `scale=${WIDTH}:-2:flags=lanczos`, `fps=${FPS}`,
    ...(GRADE && GRADE !== 'none' ? [GRADE] : []),
  ].join(','),
  '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', tmp,
])

const M = Number(probe(['-v', 'error', '-select_streams', 'v:0', '-count_frames',
  '-show_entries', 'stream=nb_read_frames', '-of', 'default=nw=1:nk=1', tmp]))

/* forward f0..f(M-1), then the INTERIOR reversed: f(M-2)..f1 */
run([
  '-v', 'error', '-y', '-i', tmp,
  '-filter_complex',
  `[0:v]split[a][b];[b]trim=start_frame=1:end_frame=${M - 1},setpts=PTS-STARTPTS,reverse[r];[a][r]concat=n=2:v=1[o]`,
  '-map', '[o]', '-an',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', String(CRF),
  '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
  OUT,
])
fs.unlinkSync(tmp)

const kb = (f) => (fs.statSync(f).size / 1024).toFixed(0)
const dur = probe(['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', OUT])
console.log(
  `${IN.split(/[\\/]/).pop()} → ${OUT.split(/[\\/]/).pop()}  ` +
  `head ${start}f · ${M}f → ${2 * M - 2}f · ${Number(dur).toFixed(2)}s · ` +
  `${kb(IN)}KB → ${kb(OUT)}KB`,
)
