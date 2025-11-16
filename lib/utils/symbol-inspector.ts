export function inspectValue(value: any, path: string = 'root'): void {
  if (value === null || value === undefined) {
    console.log(`[${path}] ${value}`);
    return;
  }

  if (typeof value === 'symbol') {
    console.warn(`[Symbol detected] ${path}:`, value.toString());
    return;
  }

  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        inspectValue(item, `${path}[${index}]`);
      });
    } else {
      Object.entries(value).forEach(([key, val]) => {
        inspectValue(val, `${path}.${key}`);
      });
    }
  }
}

export function safeSerialize(value: any): any {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === 'symbol') {
    return value.toString();
  }

  if (Array.isArray(value)) {
    return value.map(safeSerialize);
  }

  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, safeSerialize(v)])
    );
  }

  return value;
}