"use client";

import { useEffect, useRef } from 'react';
import { sanitizeProps, inspectForSymbols } from '../utils/safe-serializer';

export function useSafeProps<T extends Record<string, any>>(props: T, componentName: string) {
  const safeProps = sanitizeProps(props);
  const propsRef = useRef(safeProps);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.group(`[${componentName}] Props inspection`);
      inspectForSymbols(props);
      console.groupEnd();
    }
  }, [props, componentName]);

  useEffect(() => {
    propsRef.current = safeProps;
  }, [safeProps]);

  return safeProps;
}