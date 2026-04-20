"use client";

import { useEffect, useRef } from "react";
import { useAnimation, useInView } from "framer-motion";

export function useScrollReveal(once: boolean = true, amount: number = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const inView = useInView(ref, { once, amount });

  useEffect(() => {
    if (inView) controls.start("visible");
    else if (!once) controls.start("hidden");
  }, [inView, controls, once]);

  return { ref, controls };
}
