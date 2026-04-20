"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { EASE_IN_OUT_CIRC, EASE_OUT_EXPO } from "@/lib/motion";

interface Props {
  open: boolean;
  onClose: () => void;
}

type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

const NAV: NavItem[] = [
  {
    label: "Solutions",
    href: "/solutions",
    children: [
      { label: "Web Development", href: "/solutions/web-development" },
      { label: "Web Applications", href: "/solutions/web-applications" },
      { label: "Videography", href: "/solutions/videography" },
      { label: "Digital Advertising", href: "/solutions/digital-advertising" },
      { label: "Social Media", href: "/solutions/social-media" },
    ],
  },
  {
    label: "Projects",
    href: "/projects",
    children: [
      { label: "Website Projects", href: "/projects/website-projects" },
      { label: "Videography Projects", href: "/projects/videography" },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

const containerVariants = {
  hidden: {
    clipPath: "circle(0% at 100% 0%)",
    transition: { duration: 0.6, ease: EASE_IN_OUT_CIRC },
  },
  visible: {
    clipPath: "circle(150% at 100% 0%)",
    transition: { duration: 0.8, ease: EASE_IN_OUT_CIRC },
  },
};

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT_EXPO } },
};

export default function NavOverlay({ open, onClose }: Props) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!open) {
      setActiveIdx(null);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.nav
          key="nav-overlay"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={containerVariants}
          className="fixed inset-0 z-[80] flex items-center"
          style={{ background: "#050505" }}
        >
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <svg className="h-full w-full">
              <defs>
                <pattern id="nav-grid" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#nav-grid)" />
            </svg>
          </div>

          <motion.ul
            variants={listVariants}
            className="relative z-10 flex flex-col gap-4 px-8 md:px-20 w-full"
          >
            {NAV.map((item, i) => (
              <motion.li
                key={item.label}
                variants={itemVariants}
                className="relative"
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
              >
                <div className="flex items-baseline md:items-center gap-4 md:gap-6">
                  <span
                    className="text-[10px] tracking-[0.32em] uppercase opacity-50 w-6 shrink-0"
                    style={{ fontFamily: "var(--font-geist-mono), monospace", color: "var(--color-text-muted-dark)" }}
                  >
                    0{i + 1}
                  </span>
                  <div className="relative inline-flex items-center">
                    <Link
                      href={item.href}
                      onClick={onClose}
                      data-cursor="hover"
                      className="group inline-flex items-center"
                      style={{
                        fontFamily: "var(--font-display-serif), serif",
                        fontWeight: 200,
                        fontSize: "clamp(40px, 9vw, 96px)",
                        lineHeight: 1,
                        letterSpacing: "-0.02em",
                        color: "var(--color-text-primary-dark)",
                      }}
                    >
                      <span className="transition-colors duration-300 group-hover:text-[var(--color-green-neon)]">
                        {item.label}
                      </span>
                      {item.children && (
                        <span
                          aria-hidden
                          className="ml-3 opacity-40 transition-opacity duration-300 group-hover:opacity-80"
                          style={{ fontSize: "0.35em" }}
                        >
                          →
                        </span>
                      )}
                    </Link>

                    {/* Sub-items dropdown (desktop hover) — anchored to right of arrow */}
                    {item.children && (
                      <AnimatePresence>
                        {activeIdx === i && (
                          <motion.ul
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                            className="hidden md:flex absolute left-full top-1/2 -translate-y-1/2 pl-8 flex-col gap-1"
                          >
                            {item.children.map((sub) => (
                              <li key={sub.href}>
                                <Link
                                  href={sub.href}
                                  onClick={onClose}
                                  data-cursor="hover"
                                  className="text-[11px] tracking-[0.24em] uppercase hover:text-[var(--color-green-neon)] transition-colors duration-200 whitespace-nowrap"
                                  style={{
                                    fontFamily: "var(--font-geist-mono), monospace",
                                    color: "var(--color-text-muted-dark)",
                                  }}
                                >
                                  — {sub.label}
                                </Link>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                </div>

                {/* Mobile: always-visible sub-items */}
                {item.children && (
                  <ul className="md:hidden mt-2 ml-10 flex flex-col gap-1">
                    {item.children.map((sub) => (
                      <li key={sub.href}>
                        <Link
                          href={sub.href}
                          onClick={onClose}
                          className="text-[10px] tracking-[0.24em] uppercase"
                          style={{
                            fontFamily: "var(--font-geist-mono), monospace",
                            color: "var(--color-text-muted-dark)",
                          }}
                        >
                          — {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.li>
            ))}
          </motion.ul>

          {/* Footer inside overlay */}
          <motion.div
            variants={itemVariants}
            className="absolute bottom-8 left-8 md:left-20 right-8 md:right-20 flex flex-col md:flex-row md:items-end md:justify-between gap-4 text-[10px] tracking-[0.3em] uppercase"
            style={{ fontFamily: "var(--font-geist-mono), monospace", color: "var(--color-text-muted-dark)" }}
          >
            <span>Konaverse · Cyprus · {new Date().getFullYear()}</span>
            <a
              href="mailto:info@kona-verse.com"
              data-cursor="hover"
              className="hover:text-[var(--color-green-neon)] transition-colors"
            >
              info@kona-verse.com
            </a>
          </motion.div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
