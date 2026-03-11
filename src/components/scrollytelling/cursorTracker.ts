/**
 * Shared cursor tracker — one RAF loop, one mousemove listener.
 * Components subscribe via subscribeSpotlight / subscribeParallax.
 * No React state — all updates go directly to DOM refs.
 */

import { getTotalScroll } from "./scrollConstants";

type SpotlightListener = (viewportX: number, viewportY: number, opacity: number) => void;
type ParallaxListener = (normX: number, normY: number, opacity: number) => void;

const spotListeners = new Set<SpotlightListener>();
const parListeners = new Set<ParallaxListener>();

let rawX = 0;
let rawY = 0;
let spotX = 0;
let spotY = 0;
let parX = 0;
let parY = 0;
let displayOpacity = 1;
let rafId: number | null = null;
let initialized = false;

const tick = () => {
    // Spotlight — slow, weighted feel (flashlight in fog)
    spotX += (rawX - spotX) * 0.07;
    spotY += (rawY - spotY) * 0.07;

    // Parallax — slightly more responsive
    const nx = rawX / window.innerWidth - 0.5;
    const ny = rawY / window.innerHeight - 0.5;
    parX += (nx - parX) * 0.1;
    parY += (ny - parY) * 0.1;

    // Sequence fade-out (lerped ~500ms)
    const totalScroll = getTotalScroll();
    const fadeZone = totalScroll * 0.06;
    const scrollY = window.scrollY;
    const fadeStart = totalScroll - fadeZone;
    const targetOpacity =
        scrollY >= totalScroll ? 0
        : scrollY > fadeStart ? 1 - (scrollY - fadeStart) / fadeZone
        : 1;
    displayOpacity += (targetOpacity - displayOpacity) * 0.1;

    if (spotListeners.size > 0) {
        spotListeners.forEach(fn => fn(spotX, spotY, displayOpacity));
    }
    if (parListeners.size > 0) {
        // When fading out, also shrink the parallax offset to zero
        const scaledParX = parX * displayOpacity;
        const scaledParY = parY * displayOpacity;
        parListeners.forEach(fn => fn(scaledParX, scaledParY, displayOpacity));
    }

    rafId = requestAnimationFrame(tick);
};

function init() {
    if (initialized || typeof window === "undefined") return;
    initialized = true;

    rawX = spotX = window.innerWidth / 2;
    rawY = spotY = window.innerHeight / 2;

    window.addEventListener(
        "mousemove",
        (e) => { rawX = e.clientX; rawY = e.clientY; },
        { passive: true },
    );

    rafId = requestAnimationFrame(tick);
}

export function subscribeSpotlight(fn: SpotlightListener): () => void {
    init();
    spotListeners.add(fn);
    return () => { spotListeners.delete(fn); };
}

export function subscribeParallax(fn: ParallaxListener): () => void {
    init();
    parListeners.add(fn);
    return () => { parListeners.delete(fn); };
}
