import { applyInterpolation } from '@/features/common/utils/string/apply-interpolation';
import { applyRichText } from '@/features/common/utils/string/apply-rich-text';

export function createTranslator<T extends object, Keys extends string[] = []>(
  translations: T,
  ...keys: Keys
): Translator<T, Keys> {
  const prefix = keys.length ? keys.join('.') + '.' : '';

  return (fallback, key, variables) => {
    const path = (prefix + key).split('.');
    const value = getNestedValue<string>(translations, path);
    const text = typeof value === 'string' ? value : fallback;
    const withVars = variables ? applyInterpolation(text, variables) : text;
    return applyRichText(withVars);
  };
}

function getNestedValue<T>(obj: object, path: string[]): T | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cursor: any = obj;

  for (const segment of path) {
    if (cursor !== null && typeof cursor === 'object' && segment in cursor) {
      cursor = cursor[segment];
    } else {
      return undefined;
    }
  }

  return cursor;
}
