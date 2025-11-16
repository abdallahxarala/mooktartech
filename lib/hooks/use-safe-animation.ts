"use client";

import { useState, useEffect } from "react";
import { MotionValue, useMotionValue, useAnimation } from "framer-motion";
import { safeStringify, safeParse } from "../utils/safe-serializer";

export function useSafeMotionValue<T>(initialValue: T): MotionValue<T> {
  const motionValue = useMotionValue(initialValue);

  useEffect(() => {
    try {
      // Verify the value can be safely serialized
      safeStringify(initialValue);
    } catch (error) {
      console.warn(
        "Motion value contains non-serializable data:",
        error
      );
    }
  }, [initialValue]);

  return motionValue;
}

export function useSafeAnimationControls() {
  const controls = useAnimation();
  const [isAnimating, setIsAnimating] = useState(false);

  const safeStart = async (animation: Record<string, any>) => {
    try {
      // Verify animation config can be serialized
      const safeAnimation = safeParse(safeStringify(animation));
      setIsAnimating(true);
      await controls.start(safeAnimation);
      setIsAnimating(false);
    } catch (error) {
      console.error("Invalid animation configuration:", error);
      setIsAnimating(false);
    }
  };

  return {
    controls,
    isAnimating,
    start: safeStart,
  };
}