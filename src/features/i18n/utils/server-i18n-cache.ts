import { FALLBACK_LOCALE } from '@/features/i18n/config';

export type StoreKey = `${Locale}:${Namespace}`;

export const translationsCache = new Map<StoreKey, TranslationsOf<Namespace, Locale>>();
export const pendingTranslations = new Map<StoreKey, Promise<TranslationsOf<Namespace, Locale>>>();

let serverLocale: Locale = FALLBACK_LOCALE;

export function setServerLocale(locale: Locale) {
  serverLocale = locale;
}

export function getServerLocale(): Locale {
  return serverLocale;
}
