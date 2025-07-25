'use server';

import { FALLBACK_LOCALE } from '@/features/i18n/config';
import { createTranslator, detectLocaleServer, translationsLoader } from '@/features/i18n/utils';

type StoreKey = `${Namespace}:${Locale}`;
type StoreValue = Promise<TranslationsOf<Namespace, Locale>>;

const store = new Map<StoreKey, StoreValue>();

async function loadNamespace<N extends Namespace>(
  namespace: N,
  locale: Locale
): Promise<TranslationsOf<N, Locale>> {
  const key = `${namespace}:${locale}` as StoreKey;

  // Check if the translations are already in the store
  if (store.has(key)) return store.get(key)!;

  const promise = (async () => {
    const translations = await translationsLoader[namespace](locale);
    if (translations) {
      return translations;
    }
    // Fallback if you are missing translations
    return translationsLoader[namespace](FALLBACK_LOCALE) as Promise<TranslationsOf<N, Locale>>;
  })();

  store.set(key, promise);
  return await promise;
}

export async function getTranslations<N extends Namespace, Keys extends readonly string[] = []>(
  namespace: N,
  ...keys: Keys
): Promise<{ t: TranslatorOf<N, Keys> }> {
  const locale = await detectLocaleServer();
  const nsTranslations = await loadNamespace(namespace, locale);

  const t = createTranslator(nsTranslations, namespace, ...keys) as TranslatorOf<N, Keys>;

  return { t };
}
