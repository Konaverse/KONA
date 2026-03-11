"use client";

import { useEffect, useRef } from "react";
import { vhToPx } from "./scrollConstants";

// ── Easy to update ───────────────────────────────────────────
const STATS = [
    { value: 50, suffix: "+", label: "Projects" },
    { value: 12, suffix: "+", label: "Clients" },
    { value: 3, suffix: "", label: "Years" },
];

// Animation timing
const INITIAL_DELAY = 800;  // ms before first counter starts
const STAGGER = 250;  // ms between each counter
const COUNT_DURATION = 1700; // ms for each count-up
const LABEL_DELAY = 100;  // ms after count finishes before label appears
const LINE_DELAY = 120;  // ms after all labels appear before line draws

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const FONT = "var(--font-geist-mono, 'Geist Mono', monospace)";

// Fade the stats counter based on scroll position (in vh).
// Stats disappear once the hero crack is ~25% open.
const FADE_START_VH = 0.7;
const FADE_END_VH   = 1.2;

export function StatsCounter() {
    const containerRef = useRef<HTMLDivElement>(null);
    const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const suffixRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
    const lineRef = useRef<HTMLDivElement>(null);

    /* ── Count-up + staggered reveal ─────────────────────── */
    useEffect(() => {
        let mounted = true;
        let labelsRevealed = 0;
        const rafIds: number[] = [];
        const timeouts: ReturnType<typeof setTimeout>[] = [];

        STATS.forEach((stat, i) => {
            const t0 = setTimeout(() => {
                if (!mounted) return;
                const startTime = performance.now();

                const animate = (now: number) => {
                    if (!mounted) return;

                    const elapsed = now - startTime;
                    const progress = Math.min(1, elapsed / COUNT_DURATION);
                    const count = Math.round(easeOut(progress) * stat.value);

                    const numEl = numberRefs.current[i];
                    if (numEl) numEl.textContent = String(count);

                    if (progress < 1) {
                        rafIds.push(requestAnimationFrame(animate));
                    } else {
                        const sufEl = suffixRefs.current[i];
                        if (sufEl) sufEl.style.opacity = "1";

                        const t1 = setTimeout(() => {
                            if (!mounted) return;
                            const labelEl = labelRefs.current[i];
                            if (labelEl) {
                                labelEl.style.opacity = "1";
                                labelEl.style.transform = "translateY(0)";
                            }

                            labelsRevealed++;
                            if (labelsRevealed === STATS.length) {
                                const t2 = setTimeout(() => {
                                    if (!mounted) return;
                                    const line = lineRef.current;
                                    if (line) line.style.width = "100%";
                                }, LINE_DELAY);
                                timeouts.push(t2);
                            }
                        }, LABEL_DELAY);
                        timeouts.push(t1);
                    }
                };

                rafIds.push(requestAnimationFrame(animate));
            }, INITIAL_DELAY + i * STAGGER);

            timeouts.push(t0);
        });

        return () => {
            mounted = false;
            rafIds.forEach(cancelAnimationFrame);
            timeouts.forEach(clearTimeout);
        };
    }, []);

    /* ── Scroll-based fade — matches opening chapter ─────── */
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        let rafId: number;
        let currentOpacity = 1;

        const tick = () => {
            const fadeStartPx = vhToPx(FADE_START_VH);
            const fadeEndPx   = vhToPx(FADE_END_VH);
            const scrollY = window.scrollY;

            const target =
                scrollY >= fadeEndPx ? 0
                    : scrollY > fadeStartPx ? 1 - (scrollY - fadeStartPx) / (fadeEndPx - fadeStartPx)
                        : 1;

            currentOpacity += (target - currentOpacity) * 0.1;
            el.style.opacity = String(currentOpacity);
            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: "fixed",
                bottom: "6%",
                left: "6%",
                zIndex: 15,
                pointerEvents: "none",
            }}
        >
            {/* Anchoring line */}
            <div
                ref={lineRef}
                style={{
                    width: "0%",
                    height: "1px",
                    background: "rgba(250, 247, 242, 0.2)",
                    marginBottom: "14px",
                    transition: `width 700ms cubic-bezier(0.22, 1, 0.36, 1)`,
                }}
            />

            {/* Stats row */}
            <div style={{ display: "flex", gap: "40px", alignItems: "flex-start" }}>
                {STATS.map((stat, i) => (
                    <div key={stat.label}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "1px" }}>
                            <span
                                ref={el => { numberRefs.current[i] = el; }}
                                style={{
                                    fontFamily: FONT,
                                    fontWeight: 300,
                                    fontSize: "clamp(1.6rem, 2.2vw, 2rem)",
                                    color: "#faf7f2",
                                    lineHeight: 1,
                                    display: "block",
                                }}
                            >
                                0
                            </span>
                            <span
                                ref={el => { suffixRefs.current[i] = el; }}
                                style={{
                                    fontFamily: FONT,
                                    fontWeight: 300,
                                    fontSize: "clamp(1.6rem, 2.2vw, 2rem)",
                                    color: "#6b7f62",
                                    lineHeight: 1,
                                    opacity: 0,
                                    transition: "opacity 150ms ease",
                                }}
                            >
                                {stat.suffix}
                            </span>
                        </div>

                        <div
                            ref={el => { labelRefs.current[i] = el; }}
                            style={{
                                fontFamily: FONT,
                                fontWeight: 300,
                                fontSize: "0.6rem",
                                color: "rgba(250, 247, 242, 0.4)",
                                letterSpacing: "0.18em",
                                textTransform: "uppercase",
                                marginTop: "6px",
                                opacity: 0,
                                transform: "translateY(9px)",
                                transition: "opacity 400ms ease, transform 400ms ease",
                            }}
                        >
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
