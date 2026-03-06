"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram, Linkedin, Twitter, Mail, MapPin, ArrowUpRight, Terminal } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toISOString().replace('T', ' ').slice(0, 19));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const footerLinks = {
    navigation: [
      { name: "WORK", href: "#projects-showcase" },
      { name: "SERVICES", href: "#services" },
      { name: "ABOUT", href: "#about" },
      { name: "CONTACT", href: "#contact" },
    ],
    legal: [
      { name: "PRIVACY", href: "#" },
      { name: "TERMS", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ];

  return (
    <footer className="relative w-full overflow-hidden bg-[#030014]">
      {/* Scan lines overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.02]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
        }}
      />

      {/* Top border with animation */}
      <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30" />
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Glowing orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-0 left-20 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ 
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-0 right-20 w-48 h-48 bg-purple-500/5 rounded-full blur-[80px]"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Main Terminal Container */}
        <div className="py-12 md:py-16">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-cyan-500/20">
              <div className="flex items-center gap-3">
                <motion.div 
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                />
                <span className="text-cyan-400 font-mono text-sm">SYSTEM_ONLINE</span>
              </div>
              <span className="text-cyan-400/60 font-mono text-xs">{currentTime} UTC</span>
            </div>

            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <h3 className="text-2xl md:text-3xl font-bold">
                <span className="text-white">Konaverse</span>
                <span className="text-cyan-400">_</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                  COMMAND
                </span>
              </h3>
            </div>
          </motion.div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            
            {/* Brand Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 md:col-span-2"
            >
              <div className="p-6 rounded-lg border border-cyan-500/20 bg-black/40 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/Konaverse websites screenshots/KonaverseLOGO.png"
                    alt="Konaverse"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-lg"
                />
                  <div>
                    <div className="text-white font-bold font-mono">Konaverse_SOCIALS</div>
                    <div className="text-cyan-400/60 text-xs font-mono">DIGITAL_SYSTEMS</div>
                  </div>
              </div>

                <p className="text-white/50 text-sm mb-4 font-mono leading-relaxed">
                  {'>'} Crafting mission-critical digital experiences that transform brands into market leaders.
              </p>

                <div className="space-y-2">
                  <a 
                    href="mailto:hello@Konaversesocials.com" 
                    className="flex items-center gap-2 text-cyan-400/70 hover:text-cyan-400 transition-colors group"
                  >
                  <Mail className="w-4 h-4" />
                    <span className="text-xs font-mono">hello@Konaversesocials.com</span>
                </a>
                  <div className="flex items-center gap-2 text-cyan-400/70">
                  <MapPin className="w-4 h-4" />
                    <span className="text-xs font-mono">LOCATION: CYPRUS</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-6 rounded-lg border border-purple-500/20 bg-black/40 backdrop-blur-sm h-full">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-1 rounded-full bg-purple-400" />
                  <h4 className="text-purple-400 font-mono text-sm">NAVIGATION</h4>
                </div>
                <ul className="space-y-2">
                  {footerLinks.navigation.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                        className="text-white/50 hover:text-cyan-400 transition-colors text-xs font-mono inline-flex items-center gap-2 group"
                    >
                        <span className="text-cyan-400/50">{'>'}</span>
                      {link.name}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
              </div>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
            >
              <div className="p-6 rounded-lg border border-cyan-500/20 bg-black/40 backdrop-blur-sm h-full">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-1 rounded-full bg-cyan-400" />
                  <h4 className="text-cyan-400 font-mono text-sm">SERVICES</h4>
                </div>
                <ul className="space-y-2">
                  {[
                    "Web Development",
                    "Web Applications",
                    "Social Media",
                    "Digital Advertising",
                    "Videography",
                  ].map((service) => (
                    <li key={service}>
                      <a
                        href="#services"
                        className="text-white/50 hover:text-cyan-400 transition-colors text-xs font-mono inline-flex items-center gap-2 group"
                      >
                        <span className="text-cyan-400/50">{'>'}</span>
                        {service.toUpperCase()}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Social & Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="p-6 rounded-lg border border-pink-500/20 bg-black/40 backdrop-blur-sm h-full">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-1 rounded-full bg-pink-400" />
                  <h4 className="text-pink-400 font-mono text-sm">CONNECT</h4>
                </div>
                
                <div className="flex gap-2 mb-6">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-9 h-9 rounded-lg bg-white/[0.03] border border-cyan-500/20 flex items-center justify-center text-cyan-400/60 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
                      aria-label={social.label}
                    >
                      <social.icon className="w-4 h-4" />
                    </motion.a>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white/40">STATUS:</span>
                    <span className="text-green-400">OPERATIONAL</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white/40">UPTIME:</span>
                    <span className="text-cyan-400">99.9%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white/40">VERSION:</span>
                    <span className="text-purple-400">2.0.{currentYear}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Terminal Bar */}
            <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="pt-6 border-t border-white/[0.05]"
          >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-white/30 text-xs font-mono">
                <span className="text-cyan-400/50">{'>'}</span>
                <span>© {currentYear} Konaverse_SOCIALS</span>
                <span className="text-cyan-400/30">|</span>
                <span>ALL_SYSTEMS_GO</span>
              </div>
            
              <div className="flex gap-4">
              {footerLinks.legal.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                    className="text-white/30 hover:text-cyan-400 transition-colors text-xs font-mono"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

            <div className="mt-4 text-center">
              <p className="text-white/20 text-xs font-mono">
                BUILT_WITH: NEXT.JS | THREEJS | FRAMER_MOTION | TAILWIND
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

