"use client";

/**
 * Safely sanitize data by removing Symbols and other non-serializable values
 */
export function sanitizeData<T>(data: T): T {
  if (!data) return data;
  return JSON.parse(JSON.stringify(data, (key, value) => 
    typeof value === 'symbol' ? undefined : value
  ));
}

/**
 * Safely serialize data by handling special JavaScript types
 */
export function safeJSONReplacer(key: string, value: any): any {
  // Handle undefined values
  if (value === undefined) {
    return null;
  }

  // Handle Symbol values
  if (typeof value === 'symbol') {
    return undefined; // Remove Symbols from serialization
  }

  // Handle special object types
  if (value !== null && typeof value === 'object') {
    if (value instanceof Map) {
      return {
        __type: 'Map',
        value: Array.from(value.entries())
      };
    }
    if (value instanceof Set) {
      return {
        __type: 'Set',
        value: Array.from(value)
      };
    }
    if (value instanceof Date) {
      return {
        __type: 'Date',
        value: value.toISOString()
      };
    }
    if (value instanceof RegExp) {
      return {
        __type: 'RegExp',
        value: value.toString()
      };
    }
    if (value instanceof Error) {
      return {
        __type: 'Error',
        name: value.name,
        message: value.message,
        stack: value.stack
      };
    }
  }

  // Handle functions
  if (typeof value === 'function') {
    return {
      __type: 'Function',
      name: value.name
    };
  }

  return value;
}

/**
 * Safely revive serialized data by reconstructing special types
 */
export function safeJSONReviver(key: string, value: any): any {
  if (value && typeof value === 'object' && '__type' in value) {
    switch (value.__type) {
      case 'Map':
        return new Map(value.value);
      case 'Set':
        return new Set(value.value);
      case 'Date':
        return new Date(value.value);
      case 'RegExp': {
        const matches = value.value.match(/\/(.*?)\/([gimsuy]*)?$/);
        return matches ? new RegExp(matches[1], matches[2] || '') : value;
      }
      case 'Error': {
        const error = new Error(value.message);
        error.name = value.name;
        error.stack = value.stack;
        return error;
      }
      case 'Function':
        return {
          name: value.name,
          toString: () => `[Function: ${value.name}]`
        };
    }
  }
  return value;
}

/**
 * Safely stringify any value
 */
export function safeStringify(value: any, replacer = safeJSONReplacer): string {
  return JSON.stringify(value, replacer);
}

/**
 * Safely parse a JSON string
 */
export function safeParse(text: string): any {
  try {
    return JSON.parse(text, safeJSONReviver);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
}

/**
 * Safely sanitize props by removing Symbols and non-serializable values
 */
export function sanitizeProps<T extends Record<string, any>>(props: T): T {
  return Object.entries(props).reduce((acc, [key, value]) => {
    acc[key] = typeof value === 'object' ? sanitizeData(value) : value;
    return acc;
  }, {} as T);
}

/**
 * Inspect an object for Symbols and log their locations
 */
export function inspectForSymbols(obj: any, path: string = ''): void {
  if (!obj || typeof obj !== 'object') return;

  Object.entries(obj).forEach(([key, value]) => {
    const currentPath = path ? `${path}.${key}` : key;

    if (typeof value === 'symbol') {
      console.warn(`Symbol found at ${currentPath}:`, value.toString());
    } else if (typeof value === 'object' && value !== null) {
      inspectForSymbols(value, currentPath);
    }
  });
}