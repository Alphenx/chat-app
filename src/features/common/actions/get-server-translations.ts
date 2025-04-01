import { applyInterpolation, getNestedValue } from '@/features/common/utils';

export function getServerTranslations<T extends LocaleTranslations, Keys extends string[]>(
  translations: LocaleTranslations<T>,
  locale: string,
  ...keys: Keys
) {
  type TranslationScope = NestedValue<T, Keys>;

  const currentTranslations = getNestedValue(translations[locale], keys);

  const t: Translator<TranslationScope> = (fallback, key, variables) => {
    const keys = key.split('.');
    const value = getNestedValue(currentTranslations, keys);
    const text = typeof value === 'string' ? value : fallback;
    return applyInterpolation(text, variables);
  };

  return { t, locale };
}
