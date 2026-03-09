"use client";

import { useEffect, useRef } from "react";
import { subscribeSpotlight } from "./cursorTracker";

export function CursorSpotlight() {
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const div = divRef.current;
        if (!div) return;

        return subscribeSpotlight((x, y, opacity) => {
            div.style.opacity = String(opacity);
            div.style.background = `radial-gradient(
                700px circle at ${x}px ${y}px,
                rgba(107, 127, 98, 0.10) 0%,
                rgba(107, 127, 98, 0.04) 45%,
                transparent 70%
            )`;
        });
    }, []);

    return (
        <div
            ref={divRef}
            style={{
                position: "fixed",
                inset: 0,
                pointerEvents: "none",
                zIndex: 5, // above frames (z-1), below text overlays (z-10)
                opacity: 0,
            }}
        />
    );
}
