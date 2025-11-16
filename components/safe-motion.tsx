"use client";

import { safeAnimationProps } from "@/lib/utils/motion-utils";

// Safe motion components with proper type checking
export const SafeMotionDiv = div;
export const SafeMotionSpan = span;
export const SafeMotionButton = button;

// HOC to make any component motion-safe
export function withSafeMotion<T extends Record<string, any>>(
  WrappedComponent: React.ComponentType<T>
) {
  return function WithSafeMotion(props: T & MotionProps) {
    const safeProps = safeAnimationProps(props);
    return <WrappedComponent {...(safeProps as T)} />;
  };
}

// Pre-defined safe animation variants
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const slideInVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

export const scaleInVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
};

// Common animation presets
export const commonTransition = {
  duration: 0.5,
  ease: "easeOut",
};

export const staggerChildren = {
  staggerChildren: 0.1,
  delayChildren: 0.2,
};
