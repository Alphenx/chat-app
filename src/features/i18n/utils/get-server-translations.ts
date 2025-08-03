import { createTranslator } from '@/features/i18n/utils/create-translator';
import {
  getServerLocale,
  StoreKey,
  translationsCache,
} from '@/features/i18n/utils/server-i18n-cache';

/**
 * Returns **synchronously** the translator for a given Namespace,
 * Using the Locale set by Inittranslator.
 *
 * @throws Error if it has not been called to Inittranslator for that Namespace.
 */
export function getTranslations<N extends Namespace, Keys extends readonly string[] = []>(
  namespace: N,
  ...keys: Keys
): {
  t: TranslatorOf<N, Keys>;
} {
  const locale = getServerLocale();
  const cacheKey = `${locale}:${namespace}` as StoreKey;

  const translations = translationsCache.get(cacheKey);

  if (!translations) {
    throw new Error(`Translations for "${namespace}" not initialized for locale "${locale}".`);
  }

  const t = createTranslator(translations, namespace, ...keys) as TranslatorOf<N, Keys>;

  return { t };
}
