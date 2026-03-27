"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import HomeFooter from "@/components/sections/HomeFooter";

/* ── Counter hook ── */
function CountUp({
  target,
  suffix = "",
  prefix = "",
  duration = 2000,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target * 10) / 10);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {display % 1 === 0 ? display : display.toFixed(1)}
      {suffix}
    </span>
  );
}

/* ── Data ── */
const CAPABILITIES = [
  {
    title: "SaaS Platforms",
    text: "Multi-tenant architectures built for scale. User management, subscription billing, and analytics from day one.",
  },
  {
    title: "Data Dashboards",
    text: "Real-time visualizations that turn complex data into actionable insights. Built for speed, designed for clarity.",
  },
  {
    title: "Workflow Automation",
    text: "Custom tools that eliminate repetitive tasks. Integrations, pipelines, and logic that work while you sleep.",
  },
];

const FEATURES = [
  {
    title: "Auth & Roles",
    text: "Secure authentication with granular role-based access control. Multi-factor authentication, session management, OAuth2 integrations, and permission hierarchies that protect every endpoint without compromising user experience.",
  },
  {
    title: "Real-Time Data",
    text: "WebSockets, server-sent events, and optimistic UI updates. Live dashboards, collaborative editing, instant notifications — your data arrives the moment it changes, with graceful reconnection logic built in.",
  },
  {
    title: "API Architecture",
    text: "RESTful and GraphQL APIs designed for flexibility and performance. Versioned endpoints, rate limiting, caching strategies, and comprehensive documentation that makes integration effortless for any team.",
  },
  {
    title: "Database Design",
    text: "Normalized schemas, migrations, and query optimization. From PostgreSQL to MongoDB, we design data layers that stay fast at scale with proper indexing, connection pooling, and automated backups.",
  },
  {
    title: "Payment Integration",
    text: "Stripe, PayPal, and custom billing flows built to convert. Subscription management, invoicing, tax calculation, and webhook handling — every edge case accounted for so you never miss revenue.",
  },
  {
    title: "Cloud Infrastructure",
    text: "Auto-scaling deployments on Vercel, AWS, or your preferred provider. CI/CD pipelines, containerization, monitoring, and alerting — your infrastructure grows with your user base automatically.",
  },
  {
    title: "Testing & QA",
    text: "Unit, integration, and end-to-end tests baked into every sprint. Automated test suites that catch regressions before they reach production, with coverage reports and visual regression testing.",
  },
  {
    title: "Security First",
    text: "OWASP compliance, input sanitization, and encrypted data at rest. Regular dependency audits, penetration testing, CSP headers, and security-focused code reviews in every development cycle.",
  },
];

const DASHBOARD_METRICS = [
  { value: 99.9, suffix: "%", label: "Uptime SLA" },
  { value: 200, prefix: "< ", suffix: "ms", label: "API Response Time" },
  { value: 100, suffix: "%", label: "Test Coverage Goal" },
];

/* ── FeatureItem — left column, scroll-activated ── */
function FeatureItem({
  feature,
  index,
  isActive,
  onActivate,
}: {
  feature: (typeof FEATURES)[0];
  index: number;
  isActive: boolean;
  onActivate: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-35% 0px -35% 0px" });

  useEffect(() => {
    if (isInView) onActivate(index);
  }, [isInView, index, onActivate]);

  return (
    <div ref={ref} className="relative py-10 md:py-14">
      {/* Left accent line */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full"
        style={{
          background: isActive ? "#00ff88" : "rgba(255,255,255,0.06)",
          boxShadow: isActive ? "0 0 14px rgba(0,255,136,0.4)" : "none",
          transition: "background 0.5s ease, box-shadow 0.5s ease",
        }}
      />

      <div className="pl-8 md:pl-10">
        {/* Step number */}
        <span
          className="font-mono text-[11px] tracking-[0.2em] block mb-3"
          style={{
            color: isActive ? "#00ff88" : "rgba(0,255,136,0.2)",
            transition: "color 0.5s ease",
          }}
        >
          0{index + 1}
        </span>

        {/* Title */}
        <h3
          className="uppercase mb-4"
          style={{
            fontFamily: "var(--font-monument), sans-serif",
            fontWeight: 800,
            fontSize: "clamp(16px, 2.2vw, 26px)",
            letterSpacing: "0.04em",
            color: isActive ? "#fff" : "rgba(255,255,255,0.3)",
            transition: "color 0.5s ease",
          }}
        >
          {feature.title}
        </h3>

        {/* Growing divider */}
        <div
          className="rounded-full mb-5"
          style={{
            height: 2,
            width: isActive ? 52 : 0,
            background: "#00ff88",
            boxShadow: isActive ? "0 0 12px rgba(0,255,136,0.5)" : "none",
            transition: "width 0.5s ease, box-shadow 0.5s ease",
          }}
        />

        {/* Description */}
        <p
          className="text-sm md:text-[15px] leading-[1.85] max-w-md"
          style={{
            color: isActive ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.15)",
            transition: "color 0.5s ease",
          }}
        >
          {feature.text}
        </p>
      </div>
    </div>
  );
}

/* ── FeatureVisual — abstract mockup per feature ── */
function FeatureVisual({ index }: { index: number }) {
  const g = "#00ff88";
  const dim = "rgba(255,255,255,0.07)";
  const mid = "rgba(255,255,255,0.15)";
  const txt = "rgba(255,255,255,0.25)";

  switch (index) {
    case 0: // Auth & Roles
      return (
        <div className="space-y-3">
          {["Admin", "Editor", "Viewer"].map((role, i) => (
            <div
              key={role}
              className="flex items-center gap-3 rounded-lg px-4 py-3"
              style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${dim}` }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-mono text-[10px] shrink-0"
                style={{ background: `${g}15`, color: `${g}99` }}
              >
                {role[0]}
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="h-2 rounded" style={{ width: 72 - i * 12, background: mid }} />
                <div className="h-1.5 rounded" style={{ width: 48, background: dim }} />
              </div>
              <span
                className="px-2.5 py-1 rounded-full font-mono text-[9px]"
                style={{ background: `${g}15`, color: g }}
              >
                {role}
              </span>
            </div>
          ))}
          <div className="flex gap-2 mt-4">
            <div className="flex-1 h-8 rounded-lg" style={{ background: `${g}12`, border: `1px solid ${g}30` }} />
            <div className="w-8 h-8 rounded-lg" style={{ background: dim }} />
          </div>
        </div>
      );

    case 1: // Real-Time Data
      return (
        <div>
          <div className="flex items-end gap-1.5 h-36 mb-4 px-2">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 50].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t transition-all duration-300"
                style={{
                  height: `${h}%`,
                  background: i >= 10 ? `${g}80` : `${g}${Math.round(10 + (h / 100) * 25).toString(16)}`,
                }}
              />
            ))}
          </div>
          <div className="flex justify-between px-2">
            {["00:00", "06:00", "12:00", "18:00", "Now"].map((t) => (
              <span key={t} className="font-mono text-[9px]" style={{ color: txt }}>{t}</span>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-5 px-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: g }} />
            <span className="font-mono text-[10px]" style={{ color: `${g}80` }}>Live</span>
          </div>
        </div>
      );

    case 2: // API Architecture
      return (
        <div className="space-y-2.5 font-mono text-[11px]">
          {[
            { method: "GET", path: "/api/v1/users", status: "200" },
            { method: "POST", path: "/api/v1/users", status: "201" },
            { method: "GET", path: "/api/v1/users/:id", status: "200" },
            { method: "PUT", path: "/api/v1/users/:id", status: "200" },
            { method: "DELETE", path: "/api/v1/users/:id", status: "204" },
          ].map((ep, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg px-4 py-2.5"
              style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${dim}` }}
            >
              <span
                className="px-2 py-0.5 rounded text-[9px] font-bold shrink-0"
                style={{
                  background: ep.method === "GET" ? `${g}15` : ep.method === "POST" ? "rgba(59,130,246,0.15)" : ep.method === "DELETE" ? "rgba(239,68,68,0.15)" : "rgba(251,191,36,0.15)",
                  color: ep.method === "GET" ? g : ep.method === "POST" ? "#3b82f6" : ep.method === "DELETE" ? "#ef4444" : "#fbbf24",
                }}
              >
                {ep.method}
              </span>
              <span style={{ color: "rgba(255,255,255,0.4)" }} className="flex-1 truncate">{ep.path}</span>
              <span style={{ color: `${g}80` }}>{ep.status}</span>
            </div>
          ))}
        </div>
      );

    case 3: // Database Design
      return (
        <div className="space-y-4">
          {[
            { table: "users", cols: ["id uuid PK", "email varchar", "role enum", "created_at timestamp"] },
            { table: "projects", cols: ["id uuid PK", "owner_id uuid FK", "name varchar", "status enum"] },
          ].map((t) => (
            <div key={t.table} className="rounded-lg overflow-hidden" style={{ border: `1px solid ${dim}` }}>
              <div className="px-4 py-2 flex items-center gap-2" style={{ background: `${g}08`, borderBottom: `1px solid ${dim}` }}>
                <div className="w-2 h-2 rounded-sm" style={{ background: `${g}50` }} />
                <span className="font-mono text-[11px] font-bold" style={{ color: `${g}cc` }}>{t.table}</span>
              </div>
              {t.cols.map((col) => (
                <div key={col} className="px-4 py-1.5 font-mono text-[10px] flex gap-3" style={{ borderBottom: `1px solid ${dim}` }}>
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>{col.split(" ")[0]}</span>
                  <span style={{ color: txt }}>{col.split(" ").slice(1).join(" ")}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      );

    case 4: // Payment Integration
      return (
        <div className="space-y-4">
          <div className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${dim}` }}>
            <div className="flex justify-between items-center mb-4">
              <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: txt }}>Invoice #1042</span>
              <span className="px-2.5 py-1 rounded-full font-mono text-[9px]" style={{ background: `${g}15`, color: g }}>Paid</span>
            </div>
            {[
              { item: "Platform License", price: "€299.00" },
              { item: "API Access", price: "€49.00" },
              { item: "Priority Support", price: "€79.00" },
            ].map((row) => (
              <div key={row.item} className="flex justify-between py-2 font-mono text-[11px]" style={{ borderBottom: `1px solid ${dim}` }}>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>{row.item}</span>
                <span style={{ color: "rgba(255,255,255,0.6)" }}>{row.price}</span>
              </div>
            ))}
            <div className="flex justify-between pt-3 font-mono text-[12px] font-bold">
              <span style={{ color: "rgba(255,255,255,0.5)" }}>Total</span>
              <span style={{ color: g }}>€427.00</span>
            </div>
          </div>
        </div>
      );

    case 5: // Cloud Infrastructure
      return (
        <div className="flex flex-col items-center gap-3">
          {/* Load balancer */}
          <div className="rounded-lg px-6 py-2.5 font-mono text-[10px]" style={{ background: `${g}10`, border: `1px solid ${g}30`, color: `${g}cc` }}>
            Load Balancer
          </div>
          <div className="w-px h-4" style={{ background: `${g}40` }} />
          {/* Server nodes */}
          <div className="flex gap-3 w-full">
            {["Node 1", "Node 2", "Node 3"].map((n, i) => (
              <div key={n} className="flex-1 rounded-lg px-3 py-3 text-center" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${dim}` }}>
                <div className="w-5 h-5 rounded mx-auto mb-2" style={{ background: i === 0 ? `${g}30` : dim }} />
                <span className="font-mono text-[9px] block" style={{ color: txt }}>{n}</span>
                <span className="font-mono text-[9px]" style={{ color: i === 0 ? g : txt }}>{i === 0 ? "Active" : "Standby"}</span>
              </div>
            ))}
          </div>
          <div className="w-px h-4" style={{ background: dim }} />
          {/* Database */}
          <div className="rounded-lg px-6 py-2.5 font-mono text-[10px]" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${dim}`, color: txt }}>
            PostgreSQL — Primary
          </div>
        </div>
      );

    case 6: // Testing & QA
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: txt }}>Test Suite</span>
            <span className="font-mono text-[11px] font-bold" style={{ color: g }}>47/47 passed</span>
          </div>
          {[
            { name: "Auth flow", tests: 8, ms: 120 },
            { name: "API endpoints", tests: 15, ms: 340 },
            { name: "Database queries", tests: 12, ms: 280 },
            { name: "Payment webhook", tests: 6, ms: 90 },
            { name: "E2E user journey", tests: 6, ms: 1200 },
          ].map((suite) => (
            <div key={suite.name} className="flex items-center gap-3 rounded-lg px-4 py-2.5" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${dim}` }}>
              <div className="w-3 h-3 rounded-full shrink-0" style={{ background: `${g}60` }} />
              <span className="flex-1 font-mono text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>{suite.name}</span>
              <span className="font-mono text-[9px]" style={{ color: txt }}>{suite.tests} tests</span>
              <span className="font-mono text-[9px]" style={{ color: `${g}80` }}>{suite.ms}ms</span>
            </div>
          ))}
        </div>
      );

    case 7: // Security First
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: `${g}12`, border: `1px solid ${g}25` }}>
              <span className="font-mono text-[18px] font-bold" style={{ color: g }}>A+</span>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest block" style={{ color: txt }}>Security Score</span>
              <span className="font-mono text-[13px] font-bold" style={{ color: "rgba(255,255,255,0.6)" }}>98 / 100</span>
            </div>
          </div>
          {[
            { name: "OWASP Top 10", status: "Clear" },
            { name: "Dependency Audit", status: "Clear" },
            { name: "CSP Headers", status: "Active" },
            { name: "SQL Injection", status: "Protected" },
            { name: "XSS Prevention", status: "Active" },
          ].map((check) => (
            <div key={check.name} className="flex items-center justify-between px-4 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${dim}` }}>
              <span className="font-mono text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>{check.name}</span>
              <span className="font-mono text-[9px] px-2 py-0.5 rounded-full" style={{ background: `${g}12`, color: `${g}cc` }}>{check.status}</span>
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
}

/* ── FeatureScreen — sticky right panel with cross-fade ── */
function FeatureScreen({ activeIndex }: { activeIndex: number }) {
  return (
    <div
      className="rounded-2xl"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}
    >
      {/* Window chrome */}
      <div
        className="flex items-center gap-2 px-5 py-3.5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex gap-1.5">
          {[0.12, 0.2, 0.12].map((o, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: `rgba(255,255,255,${o})` }} />
          ))}
        </div>
        <div className="flex-1 text-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={activeIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="font-mono text-[10px] tracking-[0.15em] uppercase block"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              {FEATURES[activeIndex].title}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="w-[38px]" /> {/* Balance the dots */}
      </div>

      {/* Content area */}
      <div className="relative min-h-[380px] p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <FeatureVisual index={activeIndex} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── CapabilityCard ── */
function CapabilityCard({
  cap,
  index,
}: {
  cap: (typeof CAPABILITIES)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top, opacity: 1 });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setSpotlight((prev) => ({ ...prev, opacity: 0 }));
      }}
      className="relative rounded-xl px-6 py-6 md:px-8 md:py-7 cursor-default"
      style={{
        background: isHovered ? "rgba(0,255,136,0.03)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${isHovered ? "rgba(0,255,136,0.22)" : "rgba(255,255,255,0.05)"}`,
        boxShadow: isHovered ? "0 0 36px rgba(0,255,136,0.07)" : "none",
        marginLeft: index * 16,
        transform: isHovered ? "translateY(-3px)" : "translateY(0)",
        transition: "background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s ease",
        overflow: "hidden",
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, #00ff88, transparent)",
          opacity: isHovered ? 0.55 : 0,
          transition: "opacity 0.4s ease",
        }}
      />

      {/* Mouse spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(280px circle at ${spotlight.x}px ${spotlight.y}px, rgba(0,255,136,0.07), transparent 50%)`,
          opacity: spotlight.opacity,
          transition: "opacity 0.3s ease",
        }}
      />

      <div className="relative">
        {/* Growing divider */}
        <div
          className="rounded-full mb-4"
          style={{
            height: 2,
            width: isHovered ? 44 : 20,
            background: "#00ff88",
            boxShadow: isHovered ? "0 0 12px rgba(0,255,136,0.5)" : "none",
            transition: "width 0.4s ease, box-shadow 0.4s ease",
          }}
        />

        <h3
          className="uppercase mb-3"
          style={{
            fontFamily: "var(--font-monument), sans-serif",
            fontWeight: 800,
            fontSize: "clamp(14px, 1.8vw, 20px)",
            letterSpacing: "0.04em",
            color: isHovered ? "#fff" : "rgba(255,255,255,0.8)",
            transition: "color 0.4s ease",
          }}
        >
          {cap.title}
        </h3>
        <p className="text-sm leading-[1.75]" style={{ color: "rgba(255,255,255,0.5)" }}>
          {cap.text}
        </p>
      </div>
    </motion.div>
  );
}

/* ── Component ── */
export default function WebApplicationsContent() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [activeFeature, setActiveFeature] = useState(0);
  const handleFeatureActivate = useCallback((i: number) => {
    setActiveFeature(i);
  }, []);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const layer1Y = useTransform(heroProgress, [0, 1], [0, -60]);
  const layer2Y = useTransform(heroProgress, [0, 1], [0, -180]);

  return (
    <div className="bg-black min-h-screen" style={{ overflowX: "clip" }}>

      {/* ══════════════════════════════════════════════════════════
          HERO — 2-layer parallax
      ══════════════════════════════════════════════════════════ */}
      <div ref={heroRef} className="relative h-screen overflow-hidden">
        {/* Layer 1 — background */}
        <motion.div className="absolute inset-0" style={{ y: layer1Y, zIndex: 1 }}>
          <Image
            src="/images/solutions/web-applications/layer1 - data visualizations.png"
            alt="Data visualizations"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </motion.div>

        {/* Layer 2 — foreground */}
        <motion.div className="absolute inset-0" style={{ y: layer2Y, zIndex: 2 }}>
          <Image
            src="/images/solutions/web-applications/layer2- ui.png"
            alt="Application UI elements"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>

        {/* Gradient veil */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[60%] z-[3]"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
          }}
        />

        {/* Faded watermark */}
        <div
          className="absolute top-[10vh] right-[clamp(1.5rem,6vw,6rem)] z-[3] select-none pointer-events-none"
          style={{
            fontFamily: "var(--font-monument), sans-serif",
            fontWeight: 800,
            fontSize: "clamp(180px, 25vw, 360px)",
            lineHeight: 1,
            color: "rgba(255,255,255,0.025)",
          }}
        >
          02
        </div>

        {/* Title block */}
        <div className="absolute bottom-16 left-[clamp(1.5rem,4vw,4rem)] z-[4]">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-mono text-[10px] tracking-[0.35em] uppercase mb-5"
            style={{ color: "#00ff88" }}
          >
            Solution 02
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="uppercase leading-[0.88]"
            style={{
              fontFamily: "var(--font-monument), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(44px, 9vw, 110px)",
              color: "#fff",
            }}
          >
            Web
            <br />
            Applications
          </motion.h1>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          CAPABILITIES — split-screen layout
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-44 px-[clamp(1.5rem,4vw,4rem)]">
        {/* Grid bg */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs>
            <pattern id="g-cap" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#g-cap)" />
        </svg>

        <div className="relative z-[1] max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">
          {/* Left — styled panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="relative rounded-2xl p-8 md:p-10 lg:p-12"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* Left green accent bar */}
            <div
              className="absolute left-0 top-8 bottom-8 w-[3px] rounded-full"
              style={{
                background: "linear-gradient(to bottom, #00ff88, rgba(0,255,136,0.1))",
                boxShadow: "0 0 16px rgba(0,255,136,0.3)",
              }}
            />

            {/* Corner decoration — top right */}
            <div className="absolute top-5 right-5 flex gap-1.5">
              {[1, 2, 3].map((d) => (
                <div
                  key={d}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: `rgba(0,255,136,${0.15 * d})` }}
                />
              ))}
            </div>

            {/* Faint grid in panel */}
            <svg className="absolute inset-0 w-full h-full rounded-2xl opacity-[0.025] pointer-events-none">
              <defs>
                <pattern id="g-cap-panel" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#g-cap-panel)" />
            </svg>

            <div className="relative">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7 }}
                className="font-mono text-[10px] tracking-[0.3em] uppercase mb-8"
                style={{ color: "rgba(0,255,136,0.5)" }}
              >
                Capabilities
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="uppercase leading-[0.95] mb-8"
                style={{
                  fontFamily: "var(--font-monument), sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(28px, 4.5vw, 56px)",
                  color: "#fff",
                }}
              >
                Systems That
                <br />
                <span style={{ color: "#00ff88" }}>Scale With You</span>
              </motion.h2>

              {/* Green divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="origin-left mb-8"
                style={{
                  width: "clamp(48px, 8vw, 80px)",
                  height: 2,
                  background: "#00ff88",
                  boxShadow: "0 0 14px rgba(0,255,136,0.4)",
                }}
              />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="text-sm md:text-base leading-[1.8]"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                We build applications that handle your first 100 users and your
                first 100,000 with the same architecture. Production-grade
                patterns, typed end-to-end, tested automatically, deployed
                with zero downtime.
              </motion.p>

              {/* Bottom stat row */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex gap-8 mt-10 pt-8"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                {[
                  { value: "3", label: "App Types" },
                  { value: "∞", label: "Scale" },
                  { value: "0", label: "Downtime" },
                ].map((s) => (
                  <div key={s.label}>
                    <div
                      className="font-mono font-bold mb-1"
                      style={{ fontSize: "clamp(20px, 2.5vw, 28px)", color: "#00ff88" }}
                    >
                      {s.value}
                    </div>
                    <div
                      className="font-mono text-[9px] tracking-[0.25em] uppercase"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Right — staggered capability cards */}
          <div className="flex flex-col gap-5">
            {CAPABILITIES.map((cap, i) => (
              <CapabilityCard key={cap.title} cap={cap} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FEATURES — scrollytelling with sticky visual panel
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-44 px-[clamp(1.5rem,4vw,4rem)]">
        {/* Grid bg */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs>
            <pattern id="g-feat" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#g-feat)" />
        </svg>

        <div className="relative z-[1] max-w-7xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[10px] tracking-[0.3em] uppercase mb-6"
            style={{ color: "rgba(0,255,136,0.5)" }}
          >
            What We Build
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="uppercase leading-[0.95] mb-20"
            style={{
              fontFamily: "var(--font-monument), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(28px, 4.5vw, 56px)",
              color: "#fff",
            }}
          >
            Under The
            <br />
            <span style={{ color: "#00ff88" }}>Hood</span>
          </motion.h2>

          <div className="flex gap-12 lg:gap-20">
            {/* Left column — scrollable features */}
            <div className="flex-1 min-w-0">
              {FEATURES.map((feat, i) => (
                <FeatureItem
                  key={feat.title}
                  feature={feat}
                  index={i}
                  isActive={i === activeFeature}
                  onActivate={handleFeatureActivate}
                />
              ))}
            </div>

            {/* Right column — sticky visual panel (desktop only) */}
            <div className="w-[45%] shrink-0 hidden lg:block">
              <div className="sticky top-32">
                <FeatureScreen activeIndex={activeFeature} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          DASHBOARD METRICS — animated counters
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-36 px-[clamp(1.5rem,4vw,4rem)]">
        <div className="relative z-[1] max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[10px] tracking-[0.3em] uppercase mb-16"
            style={{ color: "rgba(0,255,136,0.5)" }}
          >
            Performance Standards
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {DASHBOARD_METRICS.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="text-center"
              >
                <div
                  className="font-mono font-bold mb-3"
                  style={{
                    fontSize: "clamp(40px, 6vw, 64px)",
                    color: "#00ff88",
                    lineHeight: 1,
                  }}
                >
                  <CountUp
                    target={m.value}
                    suffix={m.suffix}
                    prefix={m.prefix || ""}
                    duration={2200}
                  />
                </div>
                <div
                  className="font-mono text-[10px] tracking-[0.25em] uppercase"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {m.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          PROMISE
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-36 md:py-48 px-[clamp(1.5rem,4vw,4rem)]">
        <div className="relative z-[1] max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[10px] tracking-[0.3em] uppercase mb-8"
            style={{ color: "rgba(0,255,136,0.5)" }}
          >
            Our Promise
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="uppercase leading-[0.95] mb-8"
            style={{
              fontFamily: "var(--font-monument), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(24px, 3.5vw, 44px)",
              color: "#fff",
            }}
          >
            The Standard
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="origin-left mb-10"
            style={{
              width: "clamp(60px, 10vw, 140px)",
              height: 2,
              background: "#00ff88",
              boxShadow: "0 0 16px rgba(0,255,136,0.3)",
            }}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-base md:text-lg leading-[1.8] max-w-2xl"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Your application will be built with production-grade patterns from
            day one. Typed end-to-end. Tested automatically. Deployed with zero
            downtime.
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CTA
      ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(0,255,136,0.04) 0%, transparent 60%)",
          }}
        />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs>
            <pattern id="cta-g-wa" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-g-wa)" />
        </svg>
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.2) 30%, rgba(0,255,136,0.2) 70%, transparent 100%)",
          }}
        />

        <div className="relative z-[1] flex flex-col items-center justify-center min-h-[80vh] px-6 py-32">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[11px] tracking-[0.3em] uppercase mb-8"
            style={{ color: "rgba(0,255,136,0.5)" }}
          >
            Ready to Build?
          </motion.p>
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
            Let&apos;s Turn Your Vision
            <br />
            <span style={{ color: "#00ff88" }}>Into Reality</span>
          </motion.h2>
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
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center text-sm md:text-base leading-relaxed max-w-lg mb-12"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Whether you need a SaaS platform, an admin dashboard, or a
            custom workflow tool &mdash; we&apos;re ready to engineer
            something extraordinary.
          </motion.p>
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
