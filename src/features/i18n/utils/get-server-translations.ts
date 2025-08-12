import { FALLBACK_LOCALE } from '@/features/i18n/config';
import { createTranslator } from '@/features/i18n/utils/create-translator';
import { detectLocaleServer } from '@/features/i18n/utils/detect-locale-server';
import { translationsLoader } from '@/features/i18n/utils/translations-loader';

export async function getTranslations<N extends Namespace, Keys extends readonly string[] = []>(
  namespace: N,
  ...keys: Keys
): Promise<{
  t: TranslatorOf<N, Keys>;
}> {
  const locale = await detectLocaleServer();

  try {
    let translations = await translationsLoader[namespace](locale);

    if (!translations) {
      translations = await translationsLoader[namespace](FALLBACK_LOCALE);
    }

    if (!translations) {
      throw new Error(`No translations found for namespace "${namespace}".`);
    }

    const t = createTranslator(translations, namespace, ...keys) as TranslatorOf<N, Keys>;
    return { t };
  } catch (err) {
    throw new Error(`Failed to load translations at "${locale}/${namespace}".`, { cause: err });
  }
}
