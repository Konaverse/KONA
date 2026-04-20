"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import NavOverlay from "./NavOverlay";
import { EASE_OUT_EXPO } from "@/lib/motion";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  const line1 = {
    closed: { rotate: 0, y: -4 },
    open: { rotate: 45, y: 0 },
  };
  const line2 = {
    closed: { opacity: 1, scaleX: 1 },
    open: { opacity: 0, scaleX: 0 },
  };
  const line3 = {
    closed: { rotate: 0, y: 4 },
    open: { rotate: -45, y: 0 },
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[90] pointer-events-none">
        <div className="flex items-center justify-between px-5 md:px-10 py-5 md:py-7">
          <Link
            href="/"
            data-cursor="hover"
            className="pointer-events-auto inline-flex items-center gap-3"
            aria-label="Konaverse home"
          >
            <div className="relative h-8 w-8 md:h-10 md:w-10">
              <Image
                src="/About/KonaLogoNoBg.png"
                alt="Konaverse"
                fill
                className="object-contain"
                sizes="40px"
                priority
              />
            </div>
            <span
              className="hidden sm:inline-block text-[10px] tracking-[0.4em] uppercase"
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                color: "var(--color-text-muted-dark)",
              }}
            >
              Konaverse
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            data-cursor="hover"
            className="pointer-events-auto group relative inline-flex h-10 w-10 md:h-11 md:w-11 items-center justify-center"
          >
            <span
              aria-hidden
              className="absolute inset-0 rounded-full border border-[var(--color-border-dark)] transition-colors duration-300 group-hover:border-[var(--color-green-neon)]"
            />
            <div className="relative h-4 w-5">
              <motion.span
                aria-hidden
                className="absolute left-0 top-1/2 h-px w-full origin-center"
                style={{ background: open ? "var(--color-green-neon)" : "var(--color-text-primary-dark)" }}
                variants={line1}
                animate={open ? "open" : "closed"}
                transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
              />
              <motion.span
                aria-hidden
                className="absolute left-0 top-1/2 h-px w-full origin-center"
                style={{ background: open ? "var(--color-green-neon)" : "var(--color-text-primary-dark)" }}
                variants={line2}
                animate={open ? "open" : "closed"}
                transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
              />
              <motion.span
                aria-hidden
                className="absolute left-0 top-1/2 h-px w-full origin-center"
                style={{ background: open ? "var(--color-green-neon)" : "var(--color-text-primary-dark)" }}
                variants={line3}
                animate={open ? "open" : "closed"}
                transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
              />
            </div>
          </button>
        </div>
      </header>

      <NavOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
