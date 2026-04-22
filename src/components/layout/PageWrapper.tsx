"use client";

import { useEffect, useState, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface PageWrapperProps {
  children: ReactNode;
  theme?: "dark" | "light";
  className?: string;
}

export default function PageWrapper({
  children,
  theme = "dark",
  className,
}: PageWrapperProps) {
  const isDark = theme === "dark";

  return (
    <div 
      className={cn(
        "relative w-full",
        isDark ? "bg-[var(--color-near-black)] text-[var(--color-off-white)]" : "bg-[var(--color-soft-white)] text-[var(--color-obsidian)]",
        className
      )}
    >
      {children}
    </div>
  );
}
