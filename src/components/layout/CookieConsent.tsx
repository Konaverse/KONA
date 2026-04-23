"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ACCENT = "#6B7F62";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("konaverse_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("konaverse_cookie_consent", "accepted");
    
    // Update Google Analytics Consent
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted',
        'analytics_storage': 'granted'
      });
    }
    
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("konaverse_cookie_consent", "declined");
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'analytics_storage': 'denied',
      });
    }
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-[100]"
        >
          <div className="relative overflow-hidden bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl">
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#6B7F62]/10 blur-[60px] pointer-events-none" />
            
            <div className="relative z-10 space-y-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6B7F62]" />
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase opacity-50">Privacy Preference</span>
                </div>
                <h3 className="text-sm font-medium text-white tracking-wide">
                  Experience Konaverse at its best.
                </h3>
                <p className="text-xs text-white/50 leading-relaxed font-light">
                  We use cookies to refine your digital journey, analyze site traffic, and deliver a more personalized architectural experience. By continuing, you agree to our use of these tools.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  onClick={handleAccept}
                  variant="primary"
                  showArrow={false}
                  className="w-full sm:flex-1 text-[10px] tracking-widest py-4 h-auto"
                >
                  Accept All
                </Button>
                <Button 
                  onClick={handleDecline}
                  showArrow={false}
                  className="w-full sm:flex-1 text-[10px] tracking-widest py-4 h-auto border border-white/10 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white"
                >
                  Essential Only
                </Button>
              </div>

              <div className="text-center">
                <Link 
                  href="/cookies" 
                  className="font-mono text-[9px] tracking-widest uppercase opacity-30 hover:opacity-100 transition-opacity"
                >
                  View Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
