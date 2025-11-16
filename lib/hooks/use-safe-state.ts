"use client";

import { useState, useCallback } from 'react';
import { safeStringify, safeParse } from '../utils/safe-serializer';

export function useSafeState<T>(initialState: T) {
  const [state, setState] = useState<T>(
    typeof initialState === 'object' ? safeParse(safeStringify(initialState)) : initialState
  );

  const setSafeState = useCallback((value: T | ((prev: T) => T)) => {
    setState(current => {
      const nextValue = value instanceof Function ? value(current) : value;
      return typeof nextValue === 'object' 
        ? safeParse(safeStringify(nextValue))
        : nextValue;
    });
  }, []);

  return [state, setSafeState] as const;
}