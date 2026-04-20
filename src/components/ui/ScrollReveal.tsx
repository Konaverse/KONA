"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { scrollReveal } from "@/lib/motion";

interface Props {
  children: ReactNode;
  variants?: Variants;
  delay?: number;
  amount?: number;
  once?: boolean;
  as?: "div" | "section" | "span" | "li";
  className?: string;
}

export default function ScrollReveal({
  children,
  variants = scrollReveal,
  delay = 0,
  amount = 0.3,
  once = true,
  as = "div",
  className,
}: Props) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </Comp>
  );
}
