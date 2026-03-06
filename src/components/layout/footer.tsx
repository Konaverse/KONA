"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram, Linkedin, Twitter } from "lucide-react";

/**
 * Konaverse Footer - Concept: The Blueprint Legend
 * 
 * An architectural closure that treats the site's footer as a technical drawing legend.
 * Uses asymmetric structural zones defined by 1px grid lines.
 */

const colors = {
    void: "#0d0f0c",   // Near-black Green (Darker than Deep Forest)
    forest: "#1a1d18", // Deep Forest
    oak: "#6b5545",    // Oak
    sand: "#c8b4a0",   // Sand
    parchment: "#f8f7f5", // Parchment
};

const footerLinks = {
    solutions: [
        { label: "Web Development", href: "/#web-development" },
        { label: "Web Applications", href: "/#web-applications" },
        { label: "Digital Advertising", href: "/#digital-advertising" },
        { label: "Social Media", href: "/#social-media" },
        { label: "Videography", href: "/#videography" },
    ],
    nav: [
        { label: "About", href: "/#about" },
        { label: "Projects", href: "/projects" },
        { label: "Contact", href: "/#contact" },
        { label: "Pricing", href: "/#pricing" },
    ],
    social: [
        { label: "LinkedIn", href: "https://linkedin.com", icon: <Linkedin size={16} /> },
        { label: "Instagram", href: "https://instagram.com", icon: <Instagram size={16} /> },
        { label: "Twitter", href: "https://twitter.com", icon: <Twitter size={16} /> },
    ],
};

export default function Footer() {
    const pathname = usePathname();

    // Hide on /journey pages
    if (pathname?.startsWith("/journey")) return null;

    return (
        <footer
            className="relative w-full overflow-hidden border-t border-white/5"
            style={{ backgroundColor: colors.void }}
        >
            {/* Background Architectural Grid Lines */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
                <div className="absolute left-[20%] top-0 w-px h-full" style={{ backgroundColor: colors.sand }} />
                <div className="absolute left-[50%] top-0 w-px h-full" style={{ backgroundColor: colors.sand }} />
                <div className="absolute left-[80%] top-0 w-px h-full" style={{ backgroundColor: colors.sand }} />
            </div>

            <div className="max-w-[1400px] mx-auto px-6 py-24 md:py-32 relative z-10">

                {/* Top Zone: Tagline & Logo */}
                <div className="grid grid-cols-12 gap-8 mb-32 items-end">
                    <div className="col-span-12 lg:col-span-8">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-4xl md:text-6xl lg:text-7xl font-extralight leading-[1.1] tracking-tighter"
                            style={{ color: colors.parchment }}
                        >
                            Building Websites <br />
                            <span style={{ color: colors.oak }}>That Print Money</span>
                        </motion.h2>
                    </div>

                    <div className="col-span-12 lg:col-span-4 lg:text-right flex flex-col items-start lg:items-end">
                        <Image
                            src="/KonaLogoNoBg.png"
                            alt="Konaverse Logo"
                            width={240}
                            height={80}
                            className="h-14 md:h-20 w-auto brightness-200"
                        />
                        <div className="font-sans font-bold text-2xl tracking-tighter mt-4" style={{ color: colors.parchment }}>
                            KONAVERSE
                        </div>
                        <p className="text-[10px] font-mono tracking-[0.4em] uppercase opacity-30 mt-2" style={{ color: colors.sand }}>
                            Architectural Excellence
                        </p>
                    </div>
                </div>

                {/* Middle Zone: Legend Links */}
                <div className="grid grid-cols-12 gap-8 lg:gap-16 border-t border-white/5 pt-16">

                    {/* Legend 01: Solutions */}
                    <div className="col-span-12 md:col-span-6 lg:col-span-3 space-y-8">
                        <div className="space-y-10">
                            <span className="text-[12px] font-mono tracking-[0.5em] uppercase opacity-40" style={{ color: colors.sand }}>
                                01_Solutions /
                            </span>
                            <ul className="flex flex-col gap-3">
                                {footerLinks.solutions.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm md:text-base font-light transition-all duration-300 hover:translate-x-1 inline-block outline-none focus-visible:ring-1 focus-visible:ring-oak pr-2"
                                            style={{ color: colors.parchment }}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Legend 02: Company */}
                    <div className="col-span-12 md:col-span-6 lg:col-span-3 space-y-8">
                        <div className="space-y-10">
                            <span className="text-[12px] font-mono tracking-[0.5em] uppercase opacity-40" style={{ color: colors.sand }}>
                                02_Navigate /
                            </span>
                            <ul className="flex flex-col gap-3">
                                {footerLinks.nav.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm md:text-base font-light transition-all duration-300 hover:translate-x-1 inline-block outline-none focus-visible:ring-1 focus-visible:ring-oak pr-2"
                                            style={{ color: colors.parchment }}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Legend 03: Socials */}
                    <div className="col-span-12 md:col-span-6 lg:col-span-3 space-y-8">
                        <div className="space-y-10">
                            <span className="text-[12px] font-mono tracking-[0.5em] uppercase opacity-40" style={{ color: colors.sand }}>
                                03_Connect /
                            </span>
                            <ul className="flex flex-col gap-3">
                                {footerLinks.social.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`Visit our ${link.label}`}
                                            className="flex items-center gap-2 text-sm md:text-base font-light transition-all duration-300 hover:translate-x-1 inline-block outline-none focus-visible:ring-1 focus-visible:ring-oak pr-2"
                                            style={{ color: colors.parchment }}
                                        >
                                            <span style={{ color: colors.oak }}>{link.icon}</span>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Legend 04: Manifest */}
                    <div className="col-span-12 md:col-span-6 lg:col-span-3 space-y-8 lg:text-right flex flex-col lg:items-end">
                        <div className="space-y-10 max-w-[200px]">
                            <span className="text-[12px] font-mono tracking-[0.5em] uppercase opacity-40" style={{ color: colors.sand }}>
                                04_Manifest /
                            </span>
                            <p className="text-xs font-light leading-relaxed opacity-60 italic" style={{ color: colors.sand }}>
                                Not an agency. <br />
                                A creative partner for those <br />
                                who value intentionality <br />
                                over consensus.
                            </p>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar: Copyright Pillar */}
                <div className="mt-32 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-[9px] font-mono tracking-[0.4em] uppercase opacity-40" style={{ color: colors.sand }}>
                        © {new Date().getFullYear()} Konaverse STRATEGIC PRACTICE
                    </div>

                    {/* L-Shape Architectural Detail */}
                    <div className="hidden md:block w-8 h-8 opacity-10">
                        <div className="absolute bottom-0 right-0 w-full h-px" style={{ backgroundColor: colors.parchment }} />
                        <div className="absolute bottom-0 right-0 w-px h-full" style={{ backgroundColor: colors.parchment }} />
                    </div>

                    <div className="text-[9px] font-mono tracking-[0.4em] uppercase opacity-40 flex items-center gap-2" style={{ color: colors.sand }}>
                        <span>Powered By</span>
                        <span style={{ color: colors.parchment }}>Konaverse</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

