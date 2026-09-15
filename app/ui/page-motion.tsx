"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";

export const easeOutSoft = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOutSoft },
  },
};

export const stagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.08 },
  },
};

export const MotionLink = motion.create(Link);

export const tap = { scale: 0.98 };
export const hoverLift = { y: -2 };

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: easeOutSoft }}
    >
      {children}
    </motion.div>
  );
}
