"use client";

import React, { useState, useEffect, useRef } from "react";

const SIZE = 28;

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const rafRef    = useRef<number>();
  const prevPos   = useRef({ x: -SIZE, y: -SIZE });
  const targetPos = useRef({ x: -SIZE, y: -SIZE });

  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine);
    if (!fine) return;

    document.body.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      setVisible(true);
    };
    const onEnter = () => setVisible(true);
    const onLeave = () => setVisible(false);

    const tick = () => {
      const tx = targetPos.current.x - SIZE / 2;
      const ty = targetPos.current.y - SIZE / 2;
      const nx = prevPos.current.x + (tx - prevPos.current.x) * 0.18;
      const ny = prevPos.current.y + (ty - prevPos.current.y) * 0.18;
      prevPos.current = { x: nx, y: ny };
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${nx}px, ${ny}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    document.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseenter", onEnter);
    document.documentElement.addEventListener("mouseleave", onLeave);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.body.style.cursor = "";
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="fixed pointer-events-none rounded-full bg-white mix-blend-difference z-[10000] transition-opacity duration-300"
      style={{
        width: SIZE,
        height: SIZE,
        top: 0,
        left: 0,
        opacity: visible ? 1 : 0,
      }}
    />
  );
}
