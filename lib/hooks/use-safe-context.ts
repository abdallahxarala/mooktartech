"use client";

import { createContext, useContext } from 'react';
import { safeStringify, safeParse } from '../utils/safe-serializer';

export function createSafeContext<T>(defaultValue: T) {
  const safeValue = typeof defaultValue === 'object'
    ? safeParse(safeStringify(defaultValue))
    : defaultValue;
    
  return createContext(safeValue);
}

export function useSafeContext<T>(context: React.Context<T>) {
  const value = useContext(context);
  return typeof value === 'object'
    ? safeParse(safeStringify(value))
    : value;
}