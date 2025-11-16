"use client";

import { MotionValue } from "framer-motion";
import { safeStringify, safeParse } from "./safe-serializer";

export function sanitizeMotionValue<T>(value: MotionValue<T> | T): T {
  if (value instanceof MotionValue) {
    return value.get();
  }
  return value;
}

export function safeAnimationProps(props: Record<string, any>) {
  const safeProps = { ...props };

  // Handle special motion properties
  const motionProps = ["animate", "initial", "exit", "transition", "variants"];
  
  motionProps.forEach(prop => {
    if (prop in safeProps) {
      try {
        // Serialize and parse to remove any Symbols
        safeProps[prop] = safeParse(safeStringify(safeProps[prop]));
      } catch (error) {
        console.warn(`Failed to sanitize motion prop ${prop}:`, error);
        delete safeProps[prop];
      }
    }
  });

  // Handle MotionValues
  Object.entries(safeProps).forEach(([key, value]) => {
    if (value instanceof MotionValue) {
      safeProps[key] = value.get();
    }
  });

  return safeProps;
}

export function createSafeVariants(variants: Record<string, any>) {
  return safeParse(safeStringify(variants));
}