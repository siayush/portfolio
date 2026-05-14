"use client";

import { AnimatePresence, m, useReducedMotion, Variants } from "framer-motion";

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  variant?: {
    hidden: { y: number };
    visible: { y: number };
  };
  duration?: number;
  delay?: number;
  yOffset?: number;
  blur?: string;
}
const BlurFade = ({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  yOffset = 6,
  blur = "6px",
}: BlurFadeProps) => {
  const shouldReduceMotion = useReducedMotion();
  const defaultVariants: Variants = shouldReduceMotion
    ? {
        hidden: { y: 0, opacity: 1, filter: "blur(0px)" },
        visible: { y: 0, opacity: 1, filter: "blur(0px)" },
      }
    : {
        hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
        visible: { y: -yOffset, opacity: 1, filter: `blur(0px)` },
      };
  const combinedVariants = variant || defaultVariants;
  return (
    <AnimatePresence>
      <m.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={combinedVariants}
        transition={{
          delay: 0.04 + delay,
          duration: shouldReduceMotion ? 0 : duration,
          ease: "easeOut",
        }}
        className={className}
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
};

export default BlurFade;
