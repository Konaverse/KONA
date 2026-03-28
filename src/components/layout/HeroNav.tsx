"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";

const NAV_LINKS = [
  { id: "solutions", label: "Solutions", href: "/solutions" },
  { id: "projects", label: "Projects", href: "/projects" },
  { id: "about", label: "About", href: "/about" },
  { id: "contact", label: "Contact", href: "/contact" },
  { id: "pricing", label: "Pricing", href: "/pricing" },
] as const;

const DROPDOWNS: Record<string, { label: string; href: string }[]> = {
  solutions: [
    { label: "Web Development", href: "/solutions/web-development" },
    { label: "Videography", href: "/solutions/videography" },
    { label: "Social Media", href: "/solutions/social-media" },
    { label: "Digital Ads", href: "/solutions/digital-advertising" },
    { label: "Web Apps", href: "/solutions/web-applications" },
  ],
  projects: [
    { label: "Website Projects", href: "/projects/website-projects" },
    { label: "Videography Projects", href: "/projects/videography" },
    { label: "Social Media Projects", href: "/projects/social-media" },
  ],
};

function getActiveId(pathname: string): string | null {
  for (const link of NAV_LINKS) {
    if (pathname === link.href || pathname.startsWith(link.href + "/")) return link.id;
    if (link.id === "solutions" && pathname.startsWith("/solutions")) return link.id;
    if (link.id === "projects" && pathname.startsWith("/projects")) return link.id;
  }
  return null;
}

// ── Animated hamburger / X toggle ──────────────────────────────────────────
function MenuToggle({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      className="lg:hidden relative z-10 w-10 h-10 flex items-center justify-center"
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
    >
      <div className="relative w-5 h-3.5">
        <motion.span
          className="absolute left-0 block w-5 h-[1.5px] bg-white/80 rounded-full"
          animate={open
            ? { top: "50%", rotate: 45, y: "-50%" }
            : { top: 0, rotate: 0, y: 0 }
          }
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.span
          className="absolute left-0 top-1/2 -translate-y-1/2 block w-3.5 h-[1.5px] bg-white/50 rounded-full ml-auto"
          style={{ left: "auto", right: 0 }}
          animate={open
            ? { opacity: 0, scaleX: 0 }
            : { opacity: 1, scaleX: 1 }
          }
          transition={{ duration: 0.2 }}
        />
        <motion.span
          className="absolute left-0 bottom-0 block w-5 h-[1.5px] bg-white/80 rounded-full"
          animate={open
            ? { bottom: "50%", rotate: -45, y: "50%" }
            : { bottom: 0, rotate: 0, y: 0 }
          }
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </button>
  );
}

// ── Full-viewport mobile menu ──────────────────────────────────────────────
function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const activeId = getActiveId(pathname);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99,
            background: "#060a07",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Background decorative grid lines */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {[20, 50, 80].map((pct) => (
              <motion.div
                key={pct}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.6, delay: 0.1 + pct * 0.002, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  left: `${pct}%`,
                  top: 0,
                  width: 1,
                  height: "100%",
                  background: "rgba(0, 255, 136, 0.04)",
                  transformOrigin: "top",
                }}
              />
            ))}
          </div>

          {/* Top accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background: "linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.3) 30%, rgba(0,255,136,0.3) 70%, transparent 100%)",
              transformOrigin: "center",
            }}
          />

          {/* Content — padded below the nav bar */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "100px 32px 48px",
              gap: 0,
            }}
          >
            {/* Main nav links */}
            {NAV_LINKS.map((link, i) => {
              const isActive = activeId === link.id;
              const dropdown = DROPDOWNS[link.id];

              return (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    style={{
                      display: "block",
                      fontFamily: "var(--font-monument), sans-serif",
                      fontSize: "clamp(28px, 8vw, 42px)",
                      fontWeight: 800,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: isActive ? "#00ff88" : "rgba(255, 255, 255, 0.85)",
                      textDecoration: "none",
                      padding: "14px 0",
                      lineHeight: 1.1,
                    }}
                  >
                    {link.label}
                  </Link>

                  {/* Sub-links for solutions/projects */}
                  {dropdown && (
                    <div style={{ paddingLeft: 4, paddingBottom: 8 }}>
                      {dropdown.map((sub, j) => (
                        <motion.div
                          key={sub.href}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.3 + i * 0.06 + j * 0.04 }}
                        >
                          <Link
                            href={sub.href}
                            onClick={onClose}
                            style={{
                              display: "block",
                              fontFamily: "var(--font-geist-mono), monospace",
                              fontSize: 13,
                              fontWeight: 300,
                              letterSpacing: "0.06em",
                              color: "rgba(255, 255, 255, 0.4)",
                              textDecoration: "none",
                              padding: "8px 0 8px 16px",
                              borderLeft: "1px solid rgba(0, 255, 136, 0.1)",
                              transition: "color 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = "#00ff88";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = "rgba(255, 255, 255, 0.4)";
                            }}
                          >
                            {sub.label}
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}

            {/* CTA button */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              style={{ marginTop: 24 }}
            >
              <Link
                href="/contact"
                onClick={onClose}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 28px",
                  border: "1px solid rgba(0, 255, 136, 0.35)",
                  borderRadius: 12,
                  color: "#00ff88",
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: 12,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                Get a Quote
              </Link>
            </motion.div>
          </div>

          {/* Bottom — branding */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            style={{
              padding: "0 32px 32px",
              borderTop: "1px solid rgba(0, 255, 136, 0.06)",
              paddingTop: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: 9,
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "rgba(0, 255, 136, 0.25)",
              }}
            >
              Konaverse
            </span>
            <span
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: 9,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.15)",
              }}
            >
              &copy; {new Date().getFullYear()}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function HeroNav() {
  const pathname = usePathname();
  const activeId = getActiveId(pathname);
  const [hovered, setHovered] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Hide on /journey
  if (pathname === "/journey") return null;

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between"
        style={{
          padding: "16px clamp(1.5rem, 4vw, 4rem)",
          pointerEvents: "auto",
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 relative z-10">
          <Image
            src="/KonaLogoNoBg.png"
            alt="Konaverse"
            width={120}
            height={40}
            className="h-8 w-auto brightness-200"
            priority
          />
        </Link>

        {/* Center links */}
        <div className="hidden lg:flex items-center gap-1 rounded-2xl px-1.5 py-1.5"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeId === link.id;
            const isHovered = hovered === link.id;
            const dropdown = DROPDOWNS[link.id];
            const isDropdownOpen = dropdownOpen === link.id;

            return (
              <div
                key={link.id}
                className="relative"
                onMouseEnter={() => {
                  setHovered(link.id);
                  if (dropdown) setDropdownOpen(link.id);
                }}
                onMouseLeave={() => {
                  setHovered(null);
                  if (dropdown) setDropdownOpen(null);
                }}
              >
                <Link
                  href={link.href}
                  className="relative px-4 py-2 rounded-xl block"
                >
                  {/* Active glassmorphism pill — layoutId drives the sliding animation */}
                  {isActive && (
                    <motion.div
                      layoutId="globalNavActive"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        boxShadow:
                          "0 2px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)",
                      }}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}

                  {/* Hover glow (non-active) */}
                  <AnimatePresence>
                    {isHovered && !isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-xl"
                        style={{ background: "rgba(255,255,255,0.04)" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      />
                    )}
                  </AnimatePresence>

                  <span
                    className="relative z-10 font-mono text-[11px] tracking-[0.12em] uppercase transition-colors duration-200 whitespace-nowrap"
                    style={{
                      color: isActive
                        ? "#00ff88"
                        : isHovered
                          ? "rgba(255,255,255,0.9)"
                          : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {link.label}
                  </span>
                </Link>

                {/* Dropdown panel — with invisible bridge to prevent gap-hover loss */}
                <AnimatePresence>
                  {dropdown && isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        paddingTop: 8,
                        zIndex: 50,
                      }}
                    >
                      <div
                        style={{
                          minWidth: 200,
                          background: "rgba(10, 14, 10, 0.92)",
                          backdropFilter: "blur(16px)",
                          WebkitBackdropFilter: "blur(16px)",
                          border: "1px solid rgba(0, 255, 136, 0.1)",
                          borderRadius: 10,
                          padding: "8px 0",
                          boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 1px rgba(0,255,136,0.15)",
                        }}
                      >
                      {dropdown.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-4 py-2.5 font-mono text-[11px] tracking-[0.08em] transition-colors duration-150 whitespace-nowrap"
                          style={{ color: "rgba(255,255,255,0.55)" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = "#00ff88";
                            e.currentTarget.style.background = "rgba(0, 255, 136, 0.06)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          {item.label}
                        </Link>
                      ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* CTA — matches "Our Services" Button style, smaller */}
        <div className="hidden lg:block flex-shrink-0 relative z-10">
          <Button href="/contact" variant="primary" size="sm">
            <span style={{ color: "#00ff88" }}>Get a Quote</span>
          </Button>
        </div>

        {/* Mobile hamburger / X toggle */}
        <MenuToggle open={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)} />
      </motion.nav>

      {/* Full-viewport mobile menu */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
