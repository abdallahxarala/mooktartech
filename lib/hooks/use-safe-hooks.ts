"use client";

import { useState, useCallback, useMemo } from 'react';
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

export function useSafeCallback<T extends (...args: any[]) => any>(callback: T) {
  return useCallback((...args: Parameters<T>) => {
    const result = callback(...args);
    return typeof result === 'object' 
      ? safeParse(safeStringify(result))
      : result;
  }, [callback]);
}

export function useSafeMemo<T>(factory: () => T, deps: any[]) {
  return useMemo(() => {
    const value = factory();
    return typeof value === 'object'
      ? safeParse(safeStringify(value))
      : value;
  }, deps);
}