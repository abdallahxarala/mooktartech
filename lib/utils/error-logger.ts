/**
 * Safely sanitizes props by handling special cases and non-serializable values
 */
function sanitizeProps(props: Record<string, any>): Record<string, any> {
  try {
    // Handle null or undefined props
    if (!props) return {};
    
    const safeProps: Record<string, any> = {};
    
    for (const key in props) {
      try {
        const value = props[key];
        
        // Handle different value types
        switch (typeof value) {
          case 'symbol':
            safeProps[key] = `[Symbol: ${String(value)}]`;
            break;
            
          case 'function':
            safeProps[key] = `[Function: ${value.name || 'anonymous'}]`;
            break;
            
          case 'object':
            if (value === null) {
              safeProps[key] = null;
            } else if (value instanceof Date) {
              safeProps[key] = value.toISOString();
            } else if (value instanceof RegExp) {
              safeProps[key] = value.toString();
            } else if (value instanceof Error) {
              safeProps[key] = {
                name: value.name,
                message: value.message,
                stack: value.stack
              };
            } else if (Array.isArray(value)) {
              safeProps[key] = value.map(item => 
                typeof item === 'object' ? sanitizeProps({ item }).item : item
              );
            } else {
              safeProps[key] = sanitizeProps(value);
            }
            break;
            
          default:
            safeProps[key] = value;
        }
      } catch (e) {
        safeProps[key] = '[Unserializable]';
        console.warn(`Failed to sanitize prop "${key}":`, e);
      }
    }
    
    return safeProps;
  } catch (e) {
    console.error('Failed to sanitize props:', e);
    return { error: 'Could not sanitize props' };
  }
}

/**
 * Logs an error with sanitized context
 */
export function logError(error: Error, componentName: string, context?: Record<string, any>) {
  console.error(`[${componentName}] Error:`, {
    name: error.name,
    message: error.message,
    stack: error.stack,
    context: context ? sanitizeProps(context) : undefined,
  });
}

/**
 * Logs component mount with sanitized props
 */
export function logComponentMount(componentName: string, props?: Record<string, any>) {
  console.log(`[${componentName}] Mounted`, sanitizeProps(props || {}));
}

/**
 * Logs component unmount
 */
export function logComponentUnmount(componentName: string) {
  console.log(`[${componentName}] Unmounted`);
}

/**
 * Logs state changes with sanitized values
 */
export function logStateChange(componentName: string, stateName: string, value: any) {
  console.log(`[${componentName}] ${stateName} changed:`, 
    typeof value === 'object' ? sanitizeProps({ value }).value : value
  );
}

/**
 * Logs events with sanitized details
 */
export function logEvent(componentName: string, eventName: string, details?: Record<string, any>) {
  console.log(`[${componentName}] ${eventName}:`, sanitizeProps(details || {}));
}

/**
 * Logs component render with sanitized props
 */
export function logRender(componentName: string, props?: Record<string, any>) {
  console.log(`[${componentName}] Rendering`, sanitizeProps(props || {}));
}