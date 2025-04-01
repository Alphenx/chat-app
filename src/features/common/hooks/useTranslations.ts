import { applyInterpolation, getNestedValue } from '@/features/common/utils';
import { useTranslationsContext } from '@/providers/translations-provider';
import { useEffect } from 'react';

function useTranslations<T extends LocaleTranslations, Keys extends string[]>(
  translations: LocaleTranslations<T>,
  ...keys: Keys
) {
  const { locale, translationsState, loadTranslations } = useTranslationsContext();

  type TranslationScope = NestedValue<T, Keys>;

  const localizedTranslations = translations[locale];
  const localeTranslationsState = translationsState[locale] || {};
  const isAlreadyLoaded = getNestedValue(localeTranslationsState, keys) !== undefined;

  const currentTranslations = isAlreadyLoaded
    ? getNestedValue<TranslationScope>(localeTranslationsState, keys) || {}
    : getNestedValue<TranslationScope>(localizedTranslations, keys) || {};

  // Load translations into the context
  useEffect(() => {
    if (!isAlreadyLoaded && localizedTranslations) {
      loadTranslations({ [locale]: localizedTranslations });
    }
  }, [isAlreadyLoaded, locale, localizedTranslations]);

  const t: Translator<TranslationScope> = (fallback, key, variables) => {
    const keys = key.split('.');
    const value = getNestedValue(currentTranslations, keys);
    const text = typeof value === 'string' ? value : fallback;
    return applyInterpolation(text, variables);
  };

  return { t, locale };
}

export default useTranslations;
