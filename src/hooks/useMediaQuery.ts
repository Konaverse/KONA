"use client";

import { useState, useEffect } from "react";

/**
 * SSR-safe media query hook.
 * Defaults to `false` on the server / before hydration so the desktop
 * layout is rendered first — avoids layout shift on desktop.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
