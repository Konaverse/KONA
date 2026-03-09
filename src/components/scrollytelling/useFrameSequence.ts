import { useState, useEffect, useCallback, useRef } from "react";

export const TOTAL_FRAMES = 1084;
export const PIXELS_PER_FRAME = 22;

const CLIPS = [
    { folder: "00_start_to_web_dev", frames: 151, globalStart: 0 },
    { folder: "01_web_dev_to_web_apps", frames: 151, globalStart: 151 },
    { folder: "02_web_apps_to_videography", frames: 151, globalStart: 302 },
    { folder: "03_videography_to_digital_ads", frames: 151, globalStart: 453 },
    { folder: "04_digital_ads_to_social_media", frames: 240, globalStart: 604 },
    { folder: "05_social_media_to_invitation", frames: 240, globalStart: 844 },
];

/**
 * Resolves a global frame index to its specific folder and filename path.
 */
export function getFramePath(globalIndex: number): string {
    // Clamp index
    const safeIndex = Math.max(0, Math.min(globalIndex, TOTAL_FRAMES - 1));

    // Find which clip this frame belongs to
    let targetClip = CLIPS[0];
    for (let i = CLIPS.length - 1; i >= 0; i--) {
        if (safeIndex >= CLIPS[i].globalStart) {
            targetClip = CLIPS[i];
            break;
        }
    }

    // Calculate local frame number within the clip folder (1-indexed)
    const localIndex = safeIndex - targetClip.globalStart;
    const frameNumber = localIndex + 1;

    // Format with leading zeros: ezgif-frame-001.webp
    const paddedNumber = String(frameNumber).padStart(3, "0");

    return `/frames/${targetClip.folder}/ezgif-frame-${paddedNumber}.webp`;
}

export function useFrameSequence() {
    const [isInitialLoaded, setIsInitialLoaded] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);

    // We store the actual HTMLImageElements so the Canvas can draw them instantly
    const imagesCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
    const hasStartedPreloadingRef = useRef(false);

    // Preload a specific range of frames
    const preloadRange = useCallback(async (startIdx: number, endIdx: number) => {
        const promises: Promise<void>[] = [];

        for (let i = startIdx; i <= endIdx; i++) {
            if (imagesCacheRef.current.has(i)) continue;

            const p = new Promise<void>((resolve) => {
                const img = new Image();
                img.onload = () => {
                    imagesCacheRef.current.set(i, img);
                    resolve();
                };
                img.onerror = () => {
                    // Store a failed image as null or just resolve
                    // (We won't store it so the canvas drawing skips it cleanly)
                    resolve();
                };
                img.src = getFramePath(i);
            });
            promises.push(p);
        }

        await Promise.all(promises);
    }, []);

    useEffect(() => {
        if (hasStartedPreloadingRef.current) return;
        hasStartedPreloadingRef.current = true;

        let mounted = true;

        const runPreload = async () => {
            if (!mounted) return;

            // 1. Initial Priority Batch: Clip 00 (Frames 0 - 150)
            const initialBatchEnd = Math.min(150, TOTAL_FRAMES - 1);
            await preloadRange(0, initialBatchEnd);

            if (!mounted) return;

            // Unlock the UI
            setIsInitialLoaded(true);
            setLoadingProgress(Math.round(((initialBatchEnd + 1) / TOTAL_FRAMES) * 100));

            // 2. Background Batch: The rest of the frames
            // We process them in chunks of ~50 to avoid hanging the browser
            const batchSize = 50;
            for (let i = initialBatchEnd + 1; i < TOTAL_FRAMES; i += batchSize) {
                if (!mounted) break;
                const end = Math.min(i + batchSize - 1, TOTAL_FRAMES - 1);
                await preloadRange(i, end);

                if (!mounted) break;
                setLoadingProgress(Math.round(((end + 1) / TOTAL_FRAMES) * 100));
            }
        };

        runPreload();

        return () => {
            mounted = false;
        };
    }, [preloadRange]);

    // Expose a synchronous getter for the canvas to call rapidly
    const getImage = useCallback((index: number) => {
        return imagesCacheRef.current.get(index) || null;
    }, []);

    return {
        isInitialLoaded,
        loadingProgress,
        getImage,
        TOTAL_FRAMES
    };
}
