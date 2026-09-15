"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const v: Variants = {
    hidden: { opacity: 0, y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay },
    },
  };
  return (
    <motion.div
      variants={v}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, margin: "-80px" }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

export { variants };