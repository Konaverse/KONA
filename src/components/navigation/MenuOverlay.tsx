'use client'

import { useRef, useState, useLayoutEffect, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from '@/utils/gsap'

// ─── Data ────────────────────────────────────────────────────────────────────

interface SubItem { label: string; href: string }
interface NavItem  { label: string; href: string; subItems?: SubItem[] }

const NAV_LINKS: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Solutions',
    href: '/solutions',
    subItems: [
      { label: 'Web Development',       href: '/solutions/web-development' },
      { label: 'Web Applications',      href: '/solutions/web-applications' },
      { label: 'Videography',           href: '/solutions/videography' },
      { label: 'Digital Advertising',   href: '/solutions/digital-advertising' },
      { label: 'Social Media Management', href: '/solutions/social-media' },
    ],
  },
  {
    label: 'Projects',
    href: '/projects',
    subItems: [
      { label: 'All Projects',      href: '/projects' },
      { label: 'Web Development',   href: '/projects/web-development' },
      { label: 'Videography',       href: '/projects/videography' },
    ],
  },
  { label: 'About',   href: '/about' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
]

// ─── NavLink ─────────────────────────────────────────────────────────────────

function NavLink({
  item,
  maskChildRef,
  onClose,
  overlayOpen,
}: {
  item: NavItem
  maskChildRef: (el: HTMLSpanElement | null) => void
  onClose: () => void
  overlayOpen: boolean
}) {
  const [subOpen, setSubOpen] = useState(false)
  const subRef = useRef<HTMLDivElement>(null)
  const hasSubItems = !!item.subItems?.length

  // Reset sub-menu when overlay closes
  useEffect(() => {
    if (!overlayOpen) setSubOpen(false)
  }, [overlayOpen])

  // Sub-menu height animation
  useLayoutEffect(() => {
    if (!hasSubItems || !subRef.current) return
    const ctx = gsap.context(() => {
      if (subOpen) {
        gsap.fromTo(
          subRef.current,
          { height: 0 },
          { height: 'auto', duration: 0.4, ease: 'power2.out', overwrite: true },
        )
      } else {
        gsap.to(subRef.current, {
          height: 0,
          duration: 0.3,
          ease: 'power2.in',
          overwrite: true,
        })
      }
    })
    return () => ctx.revert()
  }, [subOpen, hasSubItems])

  const linkClass =
    'block font-cormorant font-light leading-[1.1] text-[#ededea] ' +
    'transition-[color,transform] duration-[250ms] ease-out ' +
    'hover:text-[#6b7f62] hover:translate-x-2'

  return (
    <div className="mb-1">
      {/* Mask reveal wrapper */}
      <div className="mask-parent">
        <span ref={maskChildRef} className="mask-child">
          {hasSubItems ? (
            <button
              onClick={() => setSubOpen((v) => !v)}
              className={`${linkClass} text-left w-full`}
              style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}
            >
              {item.label}
            </button>
          ) : (
            <Link
              href={item.href}
              onClick={onClose}
              className={linkClass}
              style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}
            >
              {item.label}
            </Link>
          )}
        </span>
      </div>

      {/* Sub-menu — height animated by GSAP */}
      {hasSubItems && (
        <div ref={subRef} className="nav-submenu">
          <div className="pl-6 flex flex-col">
            {item.subItems!.map((sub) => (
              <Link
                key={sub.label}
                href={sub.href}
                onClick={onClose}
                className="font-mono uppercase text-[13px] tracking-[0.12em] text-[#6b7f62] leading-[2.2] hover:opacity-70 transition-opacity duration-200"
              >
                {sub.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── MenuOverlay ─────────────────────────────────────────────────────────────

export default function MenuOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const overlayRef    = useRef<HTMLDivElement>(null)
  const footerRef     = useRef<HTMLDivElement>(null)
  const linkChildRefs = useRef<(HTMLSpanElement | null)[]>([])
  const isFirstRender = useRef(true)

  // Mount: set hidden state so there's no flash
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(overlayRef.current, { autoAlpha: 0, pointerEvents: 'none' })
      gsap.set(footerRef.current,  { opacity: 0 })
    }, overlayRef)
    return () => ctx.revert()
  }, [])

  // Open / close animation
  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const links = linkChildRefs.current.filter((el): el is HTMLSpanElement => el !== null)

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      if (isOpen) {
        // Ensure links start at 100% before animating in (handles rapid toggle)
        gsap.set(links, { y: '100%' })

        tl.set(overlayRef.current, { pointerEvents: 'all' })
        tl.to(overlayRef.current, { autoAlpha: 1, duration: 0.3, ease: 'power2.out' })
        tl.to(links, { y: '0%', duration: 0.5, stagger: 0.06, ease: 'power3.out' }, '-=0.1')
        tl.to(footerRef.current, { opacity: 1, duration: 0.4 }, '-=0.2')
      } else {
        tl.to(links, {
          y: '100%',
          duration: 0.25,
          stagger: { each: 0.03, from: 'end' },
          ease: 'power2.in',
        })
        tl.to(footerRef.current, { opacity: 0, duration: 0.2 }, '<')
        tl.to(overlayRef.current, { autoAlpha: 0, duration: 0.25, ease: 'power2.in' }, '-=0.05')
        tl.set(overlayRef.current, { pointerEvents: 'none' })
      }
    })

    return () => ctx.revert()
  }, [isOpen])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-40 bg-[#0a0a0a] grain flex flex-col"
    >
      {/* ── Zone 1: Top bar (logo only — hamburger in Navbar is the close control) ── */}
      <div className="flex-none flex items-center h-[60px] md:h-[72px] px-[24px] md:px-[48px]">
        <Link href="/" onClick={onClose} className="flex items-center flex-shrink-0">
          <Image
            src="/About/KonaLogoNoBg.png"
            alt="Konaverse"
            width={80}
            height={32}
            style={{ height: 32, width: 'auto' }}
          />
        </Link>
      </div>

      {/* ── Zone 2: Primary nav links ── */}
      <div className="flex-1 flex items-center overflow-y-auto">
        <nav className="pl-[24px] md:pl-[48px] pt-[72px] pb-20 w-full">
          {NAV_LINKS.map((item, i) => (
            <NavLink
              key={item.label}
              item={item}
              maskChildRef={(el) => { linkChildRefs.current[i] = el }}
              onClose={onClose}
              overlayOpen={isOpen}
            />
          ))}
        </nav>
      </div>

      {/* ── Zone 3: Bottom bar (absolute) ── */}
      <div
        ref={footerRef}
        className="absolute bottom-[32px] left-[24px] right-[24px] md:left-[48px] md:right-[48px] flex flex-col md:flex-row items-center md:justify-between gap-4"
      >
        <div className="flex items-center gap-6">
          <a
            href="https://instagram.com/konaverse"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] text-[#ededea] opacity-40 hover:text-[#6b7f62] hover:opacity-100 transition-[color,opacity] duration-300"
          >
            Instagram
          </a>
          <a
            href="https://linkedin.com/company/konaverse"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] text-[#ededea] opacity-40 hover:text-[#6b7f62] hover:opacity-100 transition-[color,opacity] duration-300"
          >
            LinkedIn
          </a>
        </div>
        <span className="font-mono text-[11px] text-[#ededea] opacity-40">
          © 2025 Konaverse
        </span>
      </div>
    </div>
  )
}
