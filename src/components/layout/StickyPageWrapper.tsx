"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

export default function StickyPageWrapper({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [stickyTop, setStickyTop] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    const update = () => {
      setStickyTop(Math.min(0, window.innerHeight - el.offsetHeight));
    };
    
    update();
    
    const observer = new ResizeObserver(update);
    observer.observe(el);
    window.addEventListener("resize", update);
    
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={ref} style={{ position: "sticky", top: stickyTop, zIndex: 1 }}>
      {children}
    </div>
  );
}
