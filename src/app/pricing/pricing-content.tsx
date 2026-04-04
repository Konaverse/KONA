"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import HomeFooter from "@/components/sections/HomeFooter";
import { ChevronDown } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ════════════════════════════════════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════════════════════════════════════ */

interface PricingTier {
  name: string;
  price: string;
  priceNote?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta?: boolean;
}

interface ServicePricing {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  pricingModel: string;
  tiers: PricingTier[];
  addons?: string[];
  note?: string;
}

const SERVICES: ServicePricing[] = [
  {
    id: "web-development",
    number: "01",
    title: "Web Development",
    subtitle: "Fixed-Price",
    pricingModel: "One-time investment. Scoped, quoted, delivered.",
    tiers: [
      {
        name: "The Landing",
        price: "€500",
        priceNote: "one-time",
        description:
          "Single page, conversion-focused. Responsive, fast, SEO-ready. Built to make a first impression that lasts.",
        features: [
          "Custom responsive design",
          "Mobile-first development",
          "SEO fundamentals",
          "Contact form integration",
          "Performance optimized",
        ],
      },
      {
        name: "The Foundation",
        price: "€900",
        priceNote: "one-time",
        description:
          "Multi-page site for established businesses. Brand integration, contact flows, and a digital presence that works.",
        features: [
          "Up to 5 custom pages",
          "Brand identity integration",
          "Advanced contact forms",
          "Mobile-first responsive",
          "On-page SEO setup",
          "Analytics integration",
        ],
        highlighted: true,
      },
      {
        name: "The Blueprint",
        price: "€1,500+",
        priceNote: "starting price",
        description:
          "Comprehensive web presence. Blog integration, CMS, advanced interactions. Price scales with addons and complexity.",
        features: [
          "Up to 12 custom pages",
          "CMS integration",
          "Blog system",
          "Advanced animations",
          "Full SEO package",
          "Multilingual support available",
        ],
      },
      {
        name: "The Storefront",
        price: "€2,500+",
        priceNote: "starting price",
        description:
          "Full online store. Product catalog, cart, checkout, payment processing. Everything you need to sell online.",
        features: [
          "Product catalog & management",
          "Shopping cart & checkout",
          "Payment gateway integration",
          "Inventory management",
          "Order tracking",
          "Customer accounts",
        ],
      },
    ],
    addons: [
      "CMS setup",
      "Blog integration",
      "Multilingual support",
      "Booking systems",
      "Custom integrations",
      "Advanced animations",
      "SEO optimization package",
    ],
  },
  {
    id: "social-media",
    number: "02",
    title: "Social Media Management",
    subtitle: "Monthly Retainer",
    pricingModel: "Ongoing partnership. Consistent content. Measurable growth.",
    tiers: [
      {
        name: "Signal",
        price: "€200",
        priceNote: "per month",
        description:
          "Core social presence. Establish your brand voice and start building an audience with consistent, quality content.",
        features: [
          "8\u201312 posts per month",
          "1\u20132 platforms",
          "Content calendar",
          "Basic community management",
          "Monthly performance snapshot",
        ],
      },
      {
        name: "Momentum",
        price: "€450",
        priceNote: "per month",
        description:
          "Scaling reach. Strategic content across multiple platforms with engagement management and performance tracking.",
        features: [
          "15\u201320 posts per month",
          "2\u20133 platforms",
          "Hashtag & trend strategy",
          "Stories & reels content",
          "Engagement management",
          "Bi-weekly reporting",
        ],
        highlighted: true,
      },
      {
        name: "Full Frequency",
        price: "€800",
        priceNote: "per month",
        description:
          "Complete social engine. Full content creation, active community management, and data-driven strategy across all platforms.",
        features: [
          "25+ posts per month",
          "All platforms",
          "Full content creation",
          "Graphics & copywriting",
          "Active community management",
          "Detailed analytics & strategy calls",
        ],
      },
    ],
    addons: [
      "Short-form video production",
      "Paid ad management",
      "Influencer coordination",
      "Campaign launches",
      "Additional platforms",
    ],
  },
  {
    id: "videography",
    number: "03",
    title: "Videography",
    subtitle: "Project-Based",
    pricingModel:
      "Starting prices. Every project is scoped individually based on complexity, duration, and deliverables.",
    tiers: [
      {
        name: "Short-Form",
        price: "From €300",
        priceNote: "per project",
        description:
          "Social-first video. Reels, shorts, TikToks. Up to 60 seconds of content designed to stop the scroll.",
        features: [
          "Up to 60 seconds",
          "Filming & editing",
          "Platform-optimized format",
          "Color grading",
          "Background music",
        ],
      },
      {
        name: "Brand Film",
        price: "From €800",
        priceNote: "per project",
        description:
          "Cinematic brand video or promotional piece. Scripting, filming, color grading, and sound design. 1\u20133 minutes.",
        features: [
          "1\u20133 minute runtime",
          "Script development",
          "Professional filming",
          "Color grading & sound design",
          "2 revision rounds",
        ],
        highlighted: true,
      },
      {
        name: "Motion Design",
        price: "From €600",
        priceNote: "per project",
        description:
          "Pure motion graphics. Animated explainers, logo animations, kinetic typography. No live footage required.",
        features: [
          "Animated explainers",
          "Logo animations",
          "Kinetic typography",
          "Custom illustrations",
          "Scales with duration",
        ],
      },
      {
        name: "Full Production",
        price: "Custom Quote",
        priceNote: "scoped per project",
        description:
          "Multi-day shoots, commercial-grade production. Drone footage, multi-camera setups, documentary-style. Built for scale.",
        features: [
          "Multi-day production",
          "Drone & multi-camera",
          "Full post-production",
          "Commercial-grade output",
          "Dedicated project manager",
        ],
        cta: true,
      },
    ],
  },
  {
    id: "digital-advertising",
    number: "04",
    title: "Digital Advertising",
    subtitle: "Monthly Retainer",
    pricingModel:
      "Strategy, setup, optimization, and creative. Ad spend budget is separate and managed transparently.",
    tiers: [
      {
        name: "Ignite",
        price: "€300",
        priceNote: "per month",
        description:
          "Single platform. Campaign setup, audience targeting, A/B testing, and monthly reporting. Ideal for businesses entering paid ads.",
        features: [
          "Single platform (Meta or Google)",
          "Campaign setup & management",
          "Audience targeting",
          "Basic A/B testing",
          "Monthly reporting",
        ],
      },
      {
        name: "Accelerate",
        price: "€600",
        priceNote: "per month",
        description:
          "Multi-platform. Advanced segmentation, retargeting funnels, creative rotation, and conversion tracking.",
        features: [
          "Meta + Google Ads",
          "Advanced audience segmentation",
          "Retargeting funnels",
          "Creative rotation",
          "Bi-weekly optimization",
          "Conversion tracking setup",
        ],
        highlighted: true,
      },
      {
        name: "Dominate",
        price: "€1,000",
        priceNote: "per month",
        description:
          "Full paid media management. Custom landing pages, full-funnel strategy, weekly optimization, creative production included.",
        features: [
          "All relevant platforms",
          "Custom landing pages",
          "Full-funnel strategy",
          "Weekly optimization",
          "Detailed ROI reporting",
          "Creative production included",
        ],
      },
    ],
    note: "Ad spend is separate and managed transparently. Recommended minimums: €300/mo (Ignite), €600/mo (Accelerate), €1,000/mo (Dominate).",
  },
  {
    id: "web-applications",
    number: "05",
    title: "Web Applications",
    subtitle: "Project-Based",
    pricingModel:
      "Custom-built software. Base price reflects minimum complexity. Final investment scales with scope.",
    tiers: [
      {
        name: "Foundation",
        price: "From €3,000",
        priceNote: "starting price",
        description:
          "MVP or focused web app. User authentication, database, core functionality. Dashboards, internal tools, booking systems, client portals.",
        features: [
          "User authentication",
          "Database architecture",
          "Core functionality",
          "Responsive UI",
          "Deployment & hosting setup",
        ],
      },
      {
        name: "Engineered",
        price: "From €6,000",
        priceNote: "starting price",
        description:
          "Complex logic, third-party integrations, role-based access, real-time features. Built for serious operational needs.",
        features: [
          "Complex business logic",
          "Third-party API integrations",
          "Role-based access control",
          "Real-time features",
          "Advanced UI/UX",
          "Automated testing",
        ],
        highlighted: true,
      },
      {
        name: "Enterprise",
        price: "Custom Quote",
        priceNote: "scoped per project",
        description:
          "Large-scale systems. Multi-tenant architecture, payment processing, compliance requirements. Scoped and quoted individually.",
        features: [
          "Multi-tenant architecture",
          "Payment processing",
          "Compliance & security",
          "Scalable infrastructure",
          "Dedicated support",
          "SLA agreements",
        ],
        cta: true,
      },
    ],
  },
];

const FAQ_ITEMS = [
  {
    question: "What\u2019s included in the quoted price?",
    answer:
      "Everything listed under each tier \u2014 design, development, revisions, and deployment. No hidden fees. If something falls outside the agreed scope, we\u2019ll discuss it with you before any additional work begins.",
  },
  {
    question: "Do you require a deposit?",
    answer:
      "Yes \u2014 50% upfront for fixed-price projects, with the remainder due on delivery. Monthly retainers are billed at the start of each month. This keeps things simple and fair for both sides.",
  },
  {
    question: "Can I upgrade or switch plans?",
    answer:
      "Absolutely. We scale with you. If your needs grow mid-project or mid-retainer, we\u2019ll adjust the scope and pricing together \u2014 no penalties, no friction.",
  },
  {
    question: "What if my project doesn\u2019t fit a listed tier?",
    answer:
      "Most don\u2019t, perfectly. Every quote is tailored after an initial discovery call. These tiers give you a transparent starting point \u2014 your final proposal will be built around your specific goals and requirements.",
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   HELPER COMPONENTS
   ════════════════════════════════════════════════════════════════════════════ */

function GridOverlay({ id }: { id: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none">
      <defs>
        <pattern
          id={id}
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 80 0 L 0 0 0 80"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

function TierCard({
  tier,
  index,
  variant = "default",
}: {
  tier: PricingTier;
  index: number;
  variant?: "default" | "horizontal" | "prominent";
}) {
  const [isHovered, setIsHovered] = useState(false);

  const isHorizontal = variant === "horizontal";
  const isProminent = variant === "prominent";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative backdrop-blur-sm rounded-sm transition-all duration-500 ${
        isHorizontal ? "flex flex-col md:flex-row md:items-start gap-6" : ""
      } ${isProminent ? "lg:col-span-2" : ""}`}
      style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${
          isHovered ? "rgba(0,255,136,0.15)" : "rgba(255,255,255,0.05)"
        }`,
        boxShadow: isHovered
          ? "0 0 40px rgba(0,255,136,0.06), 0 10px 30px rgba(0,0,0,0.2)"
          : "0 4px 20px rgba(0,0,0,0.1)",
        padding: "clamp(24px, 3vw, 40px)",
      }}
    >
      {/* Highlighted badge */}
      {tier.highlighted && (
        <div
          className="absolute -top-px left-6 right-6 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, #00ff88, transparent)",
          }}
        />
      )}

      {/* Header area */}
      <div className={isHorizontal ? "md:w-1/3 md:shrink-0" : ""}>
        <div className="flex items-baseline gap-3 mb-2">
          <h4
            className="uppercase leading-none"
            style={{
              fontFamily: "var(--font-monument), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(16px, 1.5vw, 22px)",
              color: tier.highlighted ? "#00ff88" : "rgba(255,255,255,0.9)",
            }}
          >
            {tier.name}
          </h4>
          {tier.priceNote && (
            <span
              className="uppercase"
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: "9px",
                letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.25)",
              }}
            >
              {tier.priceNote}
            </span>
          )}
        </div>

        <p
          className="mb-4"
          style={{
            fontFamily: "var(--font-monument), sans-serif",
            fontWeight: 800,
            fontSize: tier.price === "Custom Quote" ? "clamp(20px, 2vw, 28px)" : "clamp(28px, 3vw, 44px)",
            color:
              tier.price === "Custom Quote"
                ? "rgba(0,255,136,0.7)"
                : "#ffffff",
            lineHeight: 1,
          }}
        >
          {tier.price}
        </p>

        <p
          className="leading-relaxed"
          style={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontSize: "clamp(12px, 1vw, 14px)",
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.7,
          }}
        >
          {tier.description}
        </p>
      </div>

      {/* Features */}
      <div className={`${isHorizontal ? "" : "mt-6"} ${isHorizontal ? "md:flex-1" : ""}`}>
        <div
          className="mb-4"
          style={{
            width: isHorizontal ? "100%" : "40px",
            height: 1,
            background: isHorizontal
              ? "linear-gradient(90deg, rgba(0,255,136,0.2), transparent)"
              : "rgba(0,255,136,0.3)",
          }}
        />
        <ul className="space-y-2.5">
          {tier.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span
                className="mt-1.5 w-1 h-1 rounded-full shrink-0"
                style={{ background: "rgba(0,255,136,0.5)" }}
              />
              <span
                style={{
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  fontSize: "clamp(12px, 0.9vw, 14px)",
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.5,
                }}
              >
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {tier.cta && (
          <div className="mt-6">
            <Button href="/contact" variant="primary" size="md">
              <span style={{ color: "#00ff88" }}>Get a Quote</span>
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function AddonChip({ name }: { name: string }) {
  return (
    <span
      className="inline-block px-3 py-1.5 rounded-sm"
      style={{
        fontFamily: "var(--font-geist-mono), monospace",
        fontSize: "9px",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.35)",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {name}
    </span>
  );
}

function FaqItem({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: { question: string; answer: string };
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="backdrop-blur-sm rounded-sm overflow-hidden transition-all duration-500"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${isOpen ? "rgba(0,255,136,0.12)" : "rgba(255,255,255,0.05)"}`,
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 text-left"
        style={{ padding: "clamp(16px, 2vw, 24px)" }}
      >
        <span
          style={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontSize: "clamp(14px, 1.1vw, 17px)",
            color: isOpen ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)",
            transition: "color 0.3s",
          }}
        >
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0"
        >
          <ChevronDown
            size={16}
            style={{
              color: isOpen ? "#00ff88" : "rgba(255,255,255,0.25)",
              transition: "color 0.3s",
            }}
          />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div
              style={{
                padding: "0 clamp(16px, 2vw, 24px) clamp(16px, 2vw, 24px)",
              }}
            >
              <div
                className="mb-4"
                style={{
                  width: "30px",
                  height: 1,
                  background: "rgba(0,255,136,0.3)",
                }}
              />
              <p
                style={{
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  fontSize: "clamp(13px, 1vw, 15px)",
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.8,
                }}
              >
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SERVICE SECTION RENDERER — unique layout per service
   ════════════════════════════════════════════════════════════════════════════ */

function ServiceSection({ service }: { service: ServicePricing }) {
  return (
    <div
      id={`pricing-${service.id}`}
      className="relative pb-24 md:pb-32 mb-8"
    >
      {/* Faded watermark number */}
      <div
        className="absolute -top-8 -right-4 pointer-events-none select-none"
        style={{
          fontFamily: "var(--font-monument), sans-serif",
          fontWeight: 800,
          fontSize: "clamp(120px, 18vw, 280px)",
          color: "rgba(255,255,255,0.02)",
          lineHeight: 0.8,
        }}
      >
        {service.number}
      </div>

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mb-4"
      >
        <p
          className="uppercase mb-3"
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "10px",
            letterSpacing: "0.3em",
            color: "rgba(0,255,136,0.5)",
          }}
        >
          {service.number} \u2014 {service.subtitle}
        </p>
        <h2
          className="uppercase leading-[0.95]"
          style={{
            fontFamily: "var(--font-monument), sans-serif",
            fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 52px)",
            color: "#ffffff",
          }}
        >
          {service.title}
        </h2>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mb-10 max-w-xl"
        style={{
          fontFamily: "var(--font-geist-sans), sans-serif",
          fontSize: "clamp(13px, 1vw, 15px)",
          color: "rgba(255,255,255,0.4)",
          lineHeight: 1.7,
        }}
      >
        {service.pricingModel}
      </motion.p>

      {/* Green divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-10 origin-left"
        style={{
          width: "clamp(40px, 6vw, 80px)",
          height: 1,
          background: "#00ff88",
          boxShadow: "0 0 12px rgba(0,255,136,0.2)",
        }}
      />

      {/* Tier cards — layout varies by service */}
      {service.id === "web-development" && (
        <div className="space-y-4">
          {service.tiers.map((tier, i) => (
            <TierCard key={tier.name} tier={tier} index={i} variant="horizontal" />
          ))}
        </div>
      )}

      {service.id === "social-media" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {service.tiers.slice(0, 2).map((tier, i) => (
            <TierCard key={tier.name} tier={tier} index={i} />
          ))}
          {service.tiers.slice(2).map((tier, i) => (
            <TierCard
              key={tier.name}
              tier={tier}
              index={i + 2}
              variant="prominent"
            />
          ))}
        </div>
      )}

      {service.id === "videography" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {service.tiers.map((tier, i) => (
            <TierCard key={tier.name} tier={tier} index={i} />
          ))}
        </div>
      )}

      {service.id === "digital-advertising" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {service.tiers.map((tier, i) => (
              <TierCard key={tier.name} tier={tier} index={i} />
            ))}
          </div>
          {service.note && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-6 rounded-sm"
              style={{
                padding: "clamp(16px, 2vw, 24px)",
                border: "1px dashed rgba(0,255,136,0.15)",
                background: "rgba(0,255,136,0.02)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  fontSize: "clamp(12px, 0.9vw, 14px)",
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.7,
                }}
              >
                <span style={{ color: "rgba(0,255,136,0.6)" }}>\u2139</span>{" "}
                {service.note}
              </p>
            </motion.div>
          )}
        </>
      )}

      {service.id === "web-applications" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {service.tiers.slice(0, 2).map((tier, i) => (
            <TierCard key={tier.name} tier={tier} index={i} />
          ))}
          {service.tiers.slice(2).map((tier, i) => (
            <TierCard
              key={tier.name}
              tier={tier}
              index={i + 2}
              variant="prominent"
            />
          ))}
        </div>
      )}

      {/* Addons */}
      {service.addons && service.addons.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <p
            className="uppercase mb-3"
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "9px",
              letterSpacing: "0.25em",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            Available Addons
          </p>
          <div className="flex flex-wrap gap-2">
            {service.addons.map((addon) => (
              <AddonChip key={addon} name={addon} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Bottom separator (subtle) */}
      <div
        className="mt-16 md:mt-24"
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════════════════════ */

export default function PricingContent() {
  const heroRef = useRef<HTMLElement>(null);
  const [activeService, setActiveService] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const navButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  /* ── Hero parallax ── */
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroBgY = useTransform(heroScrollProgress, [0, 1], [0, 150]);
  const heroContentOpacity = useTransform(
    heroScrollProgress,
    [0, 0.4],
    [1, 0]
  );
  const heroScrollIndicatorOpacity = useTransform(
    heroScrollProgress,
    [0, 0.15],
    [1, 0]
  );

  /* ── GSAP scroll tracking for service navigator ── */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      SERVICES.forEach((service, i) => {
        const el = document.getElementById(`pricing-${service.id}`);
        if (!el) return;

        ScrollTrigger.create({
          trigger: el,
          start: "top 40%",
          end: "bottom 40%",
          onEnter: () => setActiveService(i),
          onEnterBack: () => setActiveService(i),
        });
      });
    });

    return () => ctx.revert();
  }, []);

  /* ── Auto-scroll mobile nav to active item ── */
  useEffect(() => {
    const btn = navButtonRefs.current[activeService];
    if (btn && mobileNavRef.current) {
      btn.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeService]);

  /* ── Click handler for nav items ── */
  const scrollToService = useCallback((index: number) => {
    const service = SERVICES[index];
    const el = document.getElementById(`pricing-${service.id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <div className="bg-black min-h-screen">
      {/* ══════════════════════════════════════════════════════════════════
          SECTION 1: HERO
          ══════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        {/* Parallax background */}
        <motion.div className="absolute inset-0" style={{ y: heroBgY }}>
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse at 70% 40%, rgba(0,255,136,0.06) 0%, transparent 50%),
                radial-gradient(ellipse at 20% 80%, rgba(0,255,136,0.03) 0%, transparent 50%)
              `,
            }}
          />
        </motion.div>

        <GridOverlay id="pricing-hero-grid" />

        {/* Vertical accent lines */}
        <div
          className="absolute left-[12%] top-0 w-px h-full hidden md:block"
          style={{ background: "rgba(255,255,255,0.03)" }}
        />
        <div
          className="absolute right-[25%] top-0 w-px h-full hidden md:block"
          style={{ background: "rgba(255,255,255,0.03)" }}
        />

        {/* Content */}
        <motion.div
          className="absolute inset-0 z-10 flex flex-col justify-end pb-16 md:pb-24 px-[clamp(1.5rem,4vw,4rem)]"
          style={{ opacity: heroContentOpacity }}
        >
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[11px] tracking-[0.3em] uppercase mb-4"
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              color: "rgba(0,255,136,0.5)",
            }}
          >
            Your Investment
          </motion.p>

          <motion.h1
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{
              duration: 1,
              delay: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="leading-[0.85] uppercase"
            style={{
              fontFamily: "var(--font-monument), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(28px, 10vw, 120px)",
              color: "#ffffff",
            }}
          >
            Transparent
            <br />
            <span style={{ color: "#00ff88" }}>Pricing</span>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-6 origin-left"
            style={{
              width: "clamp(60px, 10vw, 140px)",
              height: 2,
              background: "#00ff88",
              boxShadow: "0 0 20px rgba(0,255,136,0.3)",
            }}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-6 max-w-lg"
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              color: "rgba(255,255,255,0.5)",
              fontSize: "clamp(13px, 1.2vw, 16px)",
              lineHeight: 1.7,
            }}
          >
            No mystery invoices. No scope creep surprises. Clear investment
            tiers for every service we offer — built to scale with your
            ambition.
          </motion.p>

          {/* Right side — service count badge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="absolute bottom-16 md:bottom-24 right-[clamp(1.5rem,4vw,4rem)] hidden md:flex flex-col items-end gap-3"
          >
            <p
              className="text-[10px] tracking-[0.3em] uppercase"
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                color: "rgba(255,255,255,0.2)",
              }}
            >
              5 Services
            </p>
            <div
              className="w-px h-10"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,255,136,0.3), transparent)",
              }}
            />
            <p
              className="text-[10px] tracking-[0.15em]"
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                color: "rgba(0,255,136,0.4)",
              }}
            >
              18 Tiers
            </p>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          style={{ opacity: heroScrollIndicatorOpacity }}
        >
          <span
            className="text-[9px] tracking-[0.3em] uppercase"
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-6"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,255,136,0.4), transparent)",
            }}
          />
        </motion.div>

        {/* Bottom border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="absolute bottom-0 left-0 right-0 h-px origin-left z-[6]"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,255,136,0.4) 0%, rgba(0,255,136,0.1) 50%, transparent 100%)",
          }}
        />
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 2: SERVICE NAVIGATOR
          ══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-32">
        <GridOverlay id="pricing-services-grid" />

        {/* Subtle bg glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, rgba(0,255,136,0.03) 0%, transparent 50%)",
          }}
        />

        {/* Mobile: horizontal sticky nav */}
        <div
          ref={mobileNavRef}
          className="lg:hidden sticky top-16 z-30 -mx-[clamp(1.5rem,4vw,4rem)] px-[clamp(1.5rem,4vw,4rem)] mb-10"
          style={{
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {SERVICES.map((service, i) => (
              <button
                key={service.id}
                ref={(el) => { navButtonRefs.current[i] = el; }}
                onClick={() => scrollToService(i)}
                className="shrink-0 px-4 py-2 rounded-sm transition-all duration-300"
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "10px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  color:
                    activeService === i
                      ? "#00ff88"
                      : "rgba(255,255,255,0.35)",
                  background:
                    activeService === i
                      ? "rgba(0,255,136,0.06)"
                      : "transparent",
                  borderBottom:
                    activeService === i
                      ? "1px solid rgba(0,255,136,0.4)"
                      : "1px solid transparent",
                }}
              >
                {service.title}
              </button>
            ))}
          </div>
        </div>

        <div className="relative z-[1] max-w-7xl mx-auto px-[clamp(1.5rem,4vw,4rem)]">
          <div className="flex gap-12 lg:gap-20">
            {/* Desktop: sticky left nav */}
            <div className="hidden lg:block w-56 shrink-0">
              <div className="sticky top-32">
                <p
                  className="uppercase mb-8"
                  style={{
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: "9px",
                    letterSpacing: "0.3em",
                    color: "rgba(255,255,255,0.2)",
                  }}
                >
                  Services
                </p>

                <nav className="space-y-1">
                  {SERVICES.map((service, i) => (
                    <button
                      key={service.id}
                      onClick={() => scrollToService(i)}
                      className="group w-full text-left flex items-center gap-3 py-3 transition-all duration-400"
                      style={{
                        borderLeft:
                          activeService === i
                            ? "2px solid #00ff88"
                            : "2px solid transparent",
                        paddingLeft: "16px",
                      }}
                    >
                      <span
                        className="transition-colors duration-300"
                        style={{
                          fontFamily: "var(--font-geist-mono), monospace",
                          fontSize: "10px",
                          letterSpacing: "0.15em",
                          color:
                            activeService === i
                              ? "rgba(0,255,136,0.6)"
                              : "rgba(255,255,255,0.15)",
                        }}
                      >
                        {service.number}
                      </span>
                      <span
                        className="transition-colors duration-300"
                        style={{
                          fontFamily: "var(--font-geist-sans), sans-serif",
                          fontSize: "14px",
                          color:
                            activeService === i
                              ? "rgba(255,255,255,0.9)"
                              : "rgba(255,255,255,0.3)",
                        }}
                      >
                        {service.title}
                      </span>
                    </button>
                  ))}
                </nav>

                {/* Decorative element */}
                <div
                  className="mt-12"
                  style={{
                    width: 1,
                    height: "60px",
                    marginLeft: "16px",
                    background:
                      "linear-gradient(to bottom, rgba(0,255,136,0.15), transparent)",
                  }}
                />
              </div>
            </div>

            {/* Right: service sections */}
            <div className="flex-1 min-w-0">
              {SERVICES.map((service) => (
                <ServiceSection key={service.id} service={service} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 3: TRANSPARENCY
          ══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-44" style={{ overflowX: "clip" }}>
        <GridOverlay id="pricing-transparency-grid" />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, rgba(0,255,136,0.04) 0%, transparent 50%)",
          }}
        />

        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.15) 30%, rgba(0,255,136,0.15) 70%, transparent 100%)",
          }}
        />

        <div className="relative z-[1] max-w-3xl mx-auto px-[clamp(1.5rem,4vw,4rem)]">
          {/* 3a: Manifesto */}
          <div className="text-center mb-24 md:mb-32">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="uppercase mb-8"
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: "11px",
                letterSpacing: "0.3em",
                color: "rgba(0,255,136,0.5)",
              }}
            >
              Our Promise
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="uppercase leading-[0.95] mb-12"
              style={{
                fontFamily: "var(--font-monument), sans-serif",
                fontWeight: 800,
                fontSize: "clamp(32px, 6vw, 72px)",
                color: "#ffffff",
              }}
            >
              No Hidden Fees
              <span style={{ color: "#00ff88" }}>.</span>
            </motion.h2>

            {[
              "No scope creep surprises.",
              "No mystery invoices.",
              "Just honest pricing for honest work.",
            ].map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
                style={{
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  fontSize: "clamp(15px, 1.3vw, 19px)",
                  color:
                    i === 2 ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.35)",
                  lineHeight: 2.2,
                }}
              >
                {line}
              </motion.p>
            ))}
          </div>

          {/* 3b: FAQ */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="uppercase text-center mb-10"
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: "11px",
                letterSpacing: "0.3em",
                color: "rgba(0,255,136,0.5)",
              }}
            >
              Common Questions
            </motion.p>

            <div className="space-y-3">
              {FAQ_ITEMS.map((item, i) => (
                <FaqItem
                  key={i}
                  item={item}
                  isOpen={openFaq === i}
                  onToggle={() =>
                    setOpenFaq(openFaq === i ? null : i)
                  }
                  index={i}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 4: CTA
          ══════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-black overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(0,255,136,0.04) 0%, transparent 60%)",
          }}
        />

        {/* Grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs>
            <pattern
              id="pricing-cta-grid"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 80 0 L 0 0 0 80"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pricing-cta-grid)" />
        </svg>

        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.2) 30%, rgba(0,255,136,0.2) 70%, transparent 100%)",
          }}
        />

        <div className="relative z-[1] flex flex-col items-center justify-center min-h-[80vh] px-6 py-32">
          {/* Label */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[11px] tracking-[0.3em] uppercase mb-8"
            style={{ color: "rgba(0,255,136,0.5)" }}
          >
            Ready to Invest?
          </motion.p>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-center leading-[0.95] uppercase mb-6"
            style={{
              fontFamily: "var(--font-monument), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(32px, 7vw, 80px)",
              color: "#ffffff",
            }}
          >
            Let&apos;s Build What
            <br />
            <span style={{ color: "#00ff88" }}>Matters</span>
          </motion.h2>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 origin-center"
            style={{
              width: "clamp(80px, 12vw, 160px)",
              height: 2,
              background: "#00ff88",
              boxShadow: "0 0 20px rgba(0,255,136,0.3)",
            }}
          />

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center text-sm md:text-base leading-relaxed max-w-lg mb-12"
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Every project begins with a conversation. Let&apos;s discuss your
            goals, scope, and timeline &mdash; no commitment required.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-fit"
          >
            <Button href="/contact" variant="primary" size="lg">
              <span style={{ color: "#00ff88" }}>Get a Quote</span>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ══════ Footer ══════ */}
      <HomeFooter />
    </div>
  );
}
