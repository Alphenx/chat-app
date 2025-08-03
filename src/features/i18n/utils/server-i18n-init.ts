'use server';

import { FALLBACK_LOCALE } from '@/features/i18n/config';
import { TranslationStore } from '@/features/i18n/contexts/translations.context';
import {
  getServerLocale,
  pendingTranslations,
  setServerLocale,
  StoreKey,
  translationsCache,
} from '@/features/i18n/utils/server-i18n-cache';
import { translationsLoader } from '@/features/i18n/utils/translations-loader';

export async function initTranslations(
  locale: Locale,
  namespaces: Namespace[] = []
): Promise<TranslationStore> {
  setServerLocale(locale);

  const allTranslations: TranslationStore = {};

  await Promise.all(
    namespaces.map(async (namespace) => {
      const currentTranslations = await ensureTranslations(namespace);
      allTranslations[namespace] = currentTranslations;
    })
  );

  return allTranslations;
}

export async function ensureTranslations<N extends Namespace>(
  namespace: N
): Promise<TranslationsOf<Namespace, Locale>> {
  const locale = getServerLocale();
  const cacheKey = `${locale}:${namespace}` as StoreKey;

  if (translationsCache.has(cacheKey)) {
    return translationsCache.get(cacheKey)!;
  }

  if (pendingTranslations.has(cacheKey)) {
    return pendingTranslations.get(cacheKey)!;
  }

  const loadPromise = (async () => {
    try {
      let translations = await translationsLoader[namespace](locale);

      if (!translations) {
        translations = await translationsLoader[namespace](FALLBACK_LOCALE);
      }
      translationsCache.set(cacheKey, translations);

      return translations;
    } catch (err) {
      throw new Error(`Translations for "${cacheKey}" could not be loaded.`, { cause: err });
    } finally {
      pendingTranslations.delete(cacheKey);
    }
  })();

  pendingTranslations.set(cacheKey, loadPromise);
  return loadPromise;
}
