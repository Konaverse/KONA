"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const colors = {
    deepForest: "#1a1d18",
    midnight: "#2a2e26",
    oak: "#6b5545",
    sand: "#c8b4a0",
    parchment: "#f8f7f5",
};

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    originX: number;
    originY: number;
}

const navItems = [
    {
        label: "Solutions",
        href: "/solutions",
        subItems: [
            { label: "Web Development", href: "/solutions/web-development" },
            { label: "Web Applications", href: "/solutions/web-applications" },
            { label: "Digital Advertising", href: "/solutions/digital-advertising" },
            { label: "Social Media", href: "/solutions/social-media" },
        ],
    },
    {
        label: "Projects",
        href: "/projects",
        subItems: [
            { label: "Website Projects", href: "/projects/website-projects" },
            { label: "Videography", href: "/projects/videography" },
            { label: "Social Media Projects", href: "/projects/social-media" },
        ],
    },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Pricing", href: "/pricing" },
];

/**
 * Full-viewport mobile menu with radial expansion from hamburger position.
 */
export function MobileMenu({ isOpen, onClose, originX, originY }: MobileMenuProps) {
    const [expandedSection, setExpandedSection] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Focus trap
    useEffect(() => {
        if (isOpen && menuRef.current) {
            const focusableElements = menuRef.current.querySelectorAll<HTMLElement>(
                'a, button, [tabindex]:not([tabindex="-1"])'
            );
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        }
    }, [isOpen]);

    const toggleSection = (label: string) => {
        setExpandedSection(expandedSection === label ? null : label);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={menuRef}
                    className="fixed inset-0 z-[1000] flex flex-col"
                    style={{ backgroundColor: colors.deepForest }}
                    initial={{
                        clipPath: `circle(0% at ${originX}px ${originY}px)`,
                    }}
                    animate={{
                        clipPath: `circle(150% at ${originX}px ${originY}px)`,
                    }}
                    exit={{
                        clipPath: `circle(0% at ${originX}px ${originY}px)`,
                    }}
                    transition={{
                        duration: 0.5,
                        ease: [0.25, 0.1, 0.25, 1],
                    }}
                >
                    {/* Background grid pattern */}
                    <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                        <defs>
                            <pattern id="mobile-menu-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                                <path
                                    d="M 60 0 L 0 0 0 60"
                                    fill="none"
                                    stroke={`${colors.sand}0a`}
                                    strokeWidth="0.5"
                                />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#mobile-menu-grid)" />
                    </svg>

                    {/* Content container */}
                    <div className="relative flex flex-col h-full px-6 py-20 overflow-y-auto">
                        {/* Navigation items - right aligned */}
                        <nav className="flex-1 flex flex-col justify-center items-end pr-4">
                            {navItems.map((item, index) => (
                                <motion.div
                                    key={item.label}
                                    className="w-full text-right"
                                    initial={{ opacity: 0, x: 40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        delay: 0.2 + (navItems.length - 1 - index) * 0.05,
                                        duration: 0.3,
                                        ease: [0.25, 0.1, 0.25, 1],
                                    }}
                                >
                                    {item.subItems ? (
                                        // Expandable section
                                        <div className="mb-6">
                                            <button
                                                onClick={() => toggleSection(item.label)}
                                                className="text-right w-full focus:outline-none flex items-center justify-end gap-2 mb-2"
                                            >
                                                <span
                                                    className="text-[10px] font-mono font-normal uppercase"
                                                    style={{ color: colors.oak, letterSpacing: "0.25em" }}
                                                >
                                                    {item.label}
                                                </span>
                                                {/* Dropdown indicator */}
                                                <motion.svg
                                                    width="12"
                                                    height="8"
                                                    viewBox="0 0 12 8"
                                                    fill="none"
                                                    animate={{ rotate: expandedSection === item.label ? 180 : 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <path
                                                        d="M1 1L6 6L11 1"
                                                        stroke={expandedSection === item.label ? colors.parchment : colors.oak}
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </motion.svg>
                                            </button>

                                            {/* Expandable underline */}
                                            <motion.div
                                                className="h-px ml-auto"
                                                style={{ backgroundColor: colors.oak }}
                                                animate={{
                                                    width: expandedSection === item.label ? "3rem" : "1.5rem",
                                                    opacity: expandedSection === item.label ? 0.6 : 0.3,
                                                }}
                                                transition={{ duration: 0.2 }}
                                            />

                                            {/* Sub items */}
                                            <AnimatePresence>
                                                {expandedSection === item.label && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.25 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="pt-4 pb-2 space-y-3">
                                                            {item.subItems.map((subItem, subIndex) => (
                                                                <motion.div
                                                                    key={subItem.href}
                                                                    initial={{ opacity: 0, x: 20 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ delay: subIndex * 0.05 }}
                                                                >
                                                                    <Link
                                                                        href={subItem.href}
                                                                        onClick={onClose}
                                                                        className="block text-lg font-light transition-colors duration-200"
                                                                        style={{
                                                                            color: colors.sand,
                                                                            letterSpacing: "0.03em",
                                                                        }}
                                                                        onMouseEnter={(e) => {
                                                                            e.currentTarget.style.color = colors.parchment;
                                                                        }}
                                                                        onMouseLeave={(e) => {
                                                                            e.currentTarget.style.color = colors.sand;
                                                                        }}
                                                                    >
                                                                        {subItem.label}
                                                                    </Link>
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ) : (
                                        // Regular nav item
                                        <Link
                                            href={item.href}
                                            onClick={onClose}
                                            className="block mb-4"
                                        >
                                            <span
                                                className="text-2xl font-extralight transition-colors duration-200"
                                                style={{
                                                    color: colors.parchment,
                                                    letterSpacing: "0.02em",
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.color = colors.sand;
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.color = colors.parchment;
                                                }}
                                            >
                                                {item.label}
                                            </span>
                                        </Link>
                                    )}
                                </motion.div>
                            ))}

                            {/* CTA separator */}
                            <motion.div
                                className="w-16 h-px my-8"
                                style={{ backgroundColor: `${colors.sand}4d` }}
                                initial={{ opacity: 0, scaleX: 0 }}
                                animate={{ opacity: 1, scaleX: 1 }}
                                transition={{ delay: 0.45, duration: 0.3 }}
                            />

                            {/* CTA */}
                            <motion.div
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5, duration: 0.3 }}
                            >
                                <Link
                                    href="/contact"
                                    onClick={onClose}
                                    className="inline-flex items-center gap-2 text-base font-normal transition-colors duration-200"
                                    style={{
                                        color: colors.parchment,
                                        letterSpacing: "0.1em",
                                    }}
                                >
                                    <span>Get a Quote</span>
                                    <span>→</span>
                                </Link>
                            </motion.div>
                        </nav>

                        {/* Footer */}
                        <motion.footer
                            className="flex items-center justify-between pt-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.55, duration: 0.3 }}
                        >
                            <span
                                className="text-[10px] font-mono font-light"
                                style={{ color: colors.oak, letterSpacing: "0.15em" }}
                            >
                                © 2026 Konaverse
                            </span>

                            <div
                                className="flex items-center gap-3 text-[10px] font-mono font-light"
                                style={{ color: colors.oak, letterSpacing: "0.1em" }}
                            >
                                <a href="#" className="hover:text-[#c8b4a0] transition-colors">IG</a>
                                <span>·</span>
                                <a href="#" className="hover:text-[#c8b4a0] transition-colors">X</a>
                                <span>·</span>
                                <a href="#" className="hover:text-[#c8b4a0] transition-colors">LI</a>
                            </div>
                        </motion.footer>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default MobileMenu;
