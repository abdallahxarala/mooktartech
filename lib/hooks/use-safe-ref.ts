"use client";

import { useRef, useEffect } from 'react';
import { safeStringify, safeParse } from '../utils/safe-serializer';

export function useSafeRef<T>(initialValue: T) {
  const ref = useRef<T>(
    typeof initialValue === 'object' 
      ? safeParse(safeStringify(initialValue))
      : initialValue
  );

  useEffect(() => {
    // Update ref value safely when initialValue changes
    ref.current = typeof initialValue === 'object'
      ? safeParse(safeStringify(initialValue))
      : initialValue;
  }, [initialValue]);

  return ref;
}