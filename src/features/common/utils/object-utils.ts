export function getNestedValue<T = unknown, U = Record<string, unknown>>(
  obj: U,
  keys: string[]
): T | undefined {
  return keys.reduce((acc: unknown, key: string) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj) as T | undefined;
}

export function isObject(item: unknown): boolean {
  return !!item && typeof item === 'object' && !Array.isArray(item);
}

export function deepMerge<T>(target: T, source: Partial<T>): T {
  const output = { ...target };

  Object.keys(source).forEach((key) => {
    const typedKey = key as keyof T;
    const targetValue = target[typedKey] as Record<string, unknown>;
    const sourceValue = source[typedKey] as Record<string, unknown>;

    if (isObject(targetValue) && isObject(sourceValue)) {
      output[typedKey] = deepMerge(targetValue, sourceValue) as T[keyof T];
    } else {
      output[typedKey] = sourceValue as T[keyof T];
    }
  });

  return output;
}
