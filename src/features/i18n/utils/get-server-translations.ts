import { FALLBACK_LOCALE } from '@/features/i18n/config';
import I18nError from '@/features/i18n/errors/i18n.error';
import { createTranslator } from '@/features/i18n/utils/create-translator';
import { detectLocaleServer } from '@/features/i18n/utils/detect-locale-server';
import { translationsLoader } from '@/features/i18n/utils/translations-loader';

const CACHE_TTL_MS = 30000; // 30s
const cache = new Map<string, { expiresAt: number; value: object }>();

export async function getTranslations<N extends Namespace, Keys extends readonly string[] = []>(
  namespace: N,
  ...keys: Keys
): Promise<{
  t: TranslatorOf<N, Keys>;
}> {
  const locale = await detectLocaleServer();

  const key = `${locale}:${namespace}`;
  const now = Date.now();

  const cached = cache.get(key);
  if (cached && cached.expiresAt > now) {
    const t = createTranslator(cached.value, namespace, ...keys) as TranslatorOf<N, Keys>;
    return { t };
  }

  let translations = null;
  let primaryError = null;

  try {
    translations = await translationsLoader[namespace](locale);
  } catch (err) {
    primaryError = err;
    try {
      translations = await translationsLoader[namespace](FALLBACK_LOCALE);
    } catch (fallbackErr) {
      throw fallbackErr ?? primaryError;
    }
  }

  if (!translations) {
    throw I18nError.defaultError();
  }

  cache.set(key, { value: translations as object, expiresAt: now + CACHE_TTL_MS });

  const t = createTranslator(translations, namespace, ...keys) as TranslatorOf<N, Keys>;
  return { t };
}
