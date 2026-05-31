---
name: smooth-scrollytelling
description: Build a buttery, cinematic scroll-scrubbed video scene (Apple-style) in a Next.js + Framer Motion app. Use when the user wants to scroll-scrub a video/frame sequence, a pinned "scrollytelling" hero, or fix a frame-sequence scrub that looks like it steps/lags frame-by-frame on slow scroll. Covers ffmpeg frame extraction with motion interpolation, the canvas render approach, and the three smoothness layers (interpolated frames + rAF lerp + sub-frame cross-blend).
---

# Smooth scrollytelling video scenes

A scroll-driven frame sequence that feels like fluid film, not a slideshow. The
defining trick is the **three smoothness layers** — most implementations only do
the first and look steppy on slow scroll.

## When to use this

- "Scroll-scrub a video" / "Apple-AirPods-style scroll animation".
- A pinned section where a full-bleed clip plays as you scroll and copy fades in.
- Fixing an existing frame-scrub that "goes frame by frame" / "lags" / "snaps"
  when scrolling slowly.

## The core idea (why it's smooth)

Naive scrubbing draws `frames[round(progress * N)]`. On slow scroll the viewer
sits on one discrete frame, then it snaps to the next — visibly steppy. Three
layers fix it, and you want **all three**:

1. **Motion-interpolated source frames.** Extract with `ffmpeg minterpolate`
   (motion-compensated) so there are genuine in-between frames, not duplicates.
   Closes the real motion gaps at the source.
2. **rAF lerp loop.** Don't bind the drawn frame to scroll 1:1. Keep a continuous
   `target` from scroll and ease a `current` toward it every animation frame
   (`current += (target - current) * SMOOTH`). Gives the weighty cinematic settle.
3. **Sub-frame cross-blend.** Keep the position as a float (no rounding). Draw
   frame `⌊p⌋` opaque, then frame `⌈p⌉` on top at `globalAlpha = frac(p)` — a true
   dissolve between frames instead of a hard cut.

Render onto a `<canvas>`, not stacked `<img>`/`<video>` — you control compositing
(the blend) and avoid DOM/layout thrash. `<video>` + currentTime scrubbing is
unreliable across browsers (keyframe seeking) and can't cross-blend; don't use it.

## Process

### 1. Probe the source

```
ffprobe -v error -select_streams v:0 \
  -show_entries stream=width,height,r_frame_rate,nb_frames,duration \
  -of default=noprint_wrappers=1 "input.mp4"
```

Note duration and source fps — you'll interpolate *up* from there.

### 2. Extract frames with motion interpolation

Scale first (faster interpolation), then `minterpolate` to 60fps. Output JPGs to
`public/<area>/frames/<name>/` with zero-padded names. **Use a folder/name
without spaces** even if the source file has them (URLs).

```
ffmpeg -y -i "input.mp4" \
  -vf "scale=1280:-2,minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1" \
  -q:v 5 "public/About/frames/droplet/frame_%03d.jpg"
```

- `mi_mode=mci` = motion-compensated interpolation (the quality mode; slow but
  worth it — expect ~3-4 fps processing).
- `scale=1280:-2` — 1280w is plenty for a tinted full-bleed bg; `-2` keeps it
  even-dimensioned. Drop to 1152/1024 if payload matters.
- `-q:v` 4-7 (lower = better/larger). 5 is a good default.
- Frame count ≈ `duration × 60`. Verify and budget: at ~50KB/frame, 300 frames
  ≈ 15MB. Gate that off mobile (see below). If too heavy, lower fps to 48 or
  raise `-q:v` — the cross-blend hides a lower count well.

Then count + size-check:

```
# PowerShell
$d="public/About/frames/droplet"; $f=Get-ChildItem "$d\*.jpg"
"count=$($f.Count)"; "MB="+[math]::Round(($f|Measure Length -Sum).Sum/1MB,2)
```

Set `FRAME_COUNT` in the component to the exact count.

### 3. Drop in the component

Copy `reference/ScrollScrubScene.tsx` (next to this file) into the project, set
`FRAME_COUNT`, `framePath`, `SCRUB_VH`, and the overlay copy. It implements all
three smoothness layers plus the production guards below.

### 4. Wire it into the page

- The scene returns a tall track (`height: <SCRUB_VH>vh`) with a `position:
  sticky; top:0; height:100svh` inner stage. Place it in normal flow where you
  want the pin.
- **Critical:** if a parent uses a CSS `transform` (e.g. a tilt-in `motion.div`),
  render the scene as a *sibling outside* that transformed element — a transform
  ancestor traps `position: sticky`.
- The held last frame is what the *next* section can tilt/iris over.

## Non-negotiable production details (easy to get wrong)

- **Canvas cover-draw math** (object-fit: cover): scale by `max(cw/iw, ch/ih)`,
  center. Re-run on resize; size the backing store to `clientSize × DPR`
  (cap DPR at 2).
- **Opaque context:** `getContext("2d", { alpha:false })` + `imageSmoothingQuality
  = "high"`. `globalAlpha` blending still works on an opaque canvas.
- **Drive frames from `requestAnimationFrame`, never inside the scroll event.**
  Update `target` in the scroll/`useMotionValueEvent` handler; draw in the loop.
- **Pause the loop off-screen** with an `IntersectionObserver` (start/stop rAF).
- **Preload** every frame as `new Image()` (`decoding="async"`); draw the first
  one as soon as it loads so there's no black flash.
- **Frames finish before the track ends** (`FRAME_END ≈ 0.9`) so the last frame
  holds while final copy settles.
- **Reduced motion + mobile fallback:** render a single static frame with all copy
  shown — and guard the preload with a live `matchMedia` check so phones never
  start the multi-MB download (the `narrow` state hasn't resolved on first commit).
- Commit the extracted frames; make sure `.gitignore` doesn't exclude them.

## Tuning knobs

- `SMOOTH` (lerp factor, ~0.16): lower = heavier/more luxurious lag, higher =
  tighter. This is the main "feel" dial.
- `SCRUB_VH`: longer track = slower scrub (fewer vh per frame).
- `FRAME_END`: where the frames stop and the last frame holds.
- Source fps / `-q:v` / width: the payload-vs-quality triangle.

## Quick checklist

- [ ] Probed source; chose fps/width/quality with payload in mind.
- [ ] `minterpolate=...:mi_mode=mci` (interpolated, not duplicated frames).
- [ ] Frames in `public/.../frames/<name>/`, no spaces, zero-padded; `FRAME_COUNT` set.
- [ ] Canvas render: cover-draw, DPR-aware, opaque ctx, high smoothing.
- [ ] All three smoothness layers present (interp frames + rAF lerp + cross-blend).
- [ ] rAF loop paused off-screen; first frame drawn on load.
- [ ] Sticky scene is OUTSIDE any transformed ancestor.
- [ ] Reduced-motion + mobile static fallback; preload guarded by matchMedia.
- [ ] Frames committed.
