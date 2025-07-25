import { useTranslationsContext } from '@/features/i18n/contexts/translations.context';
import { createTranslator } from '@/features/i18n/utils/create-translator';
import { useEffect, useMemo } from 'react';

export function useTranslations<N extends Namespace, Keys extends readonly string[] = []>(
  namespace: N,
  ...keys: Keys
): {
  t: TranslatorOf<N, Keys>;
} {
  const { locale, translations, loadNamespace } = useTranslationsContext();

  const nsTranslations = translations[namespace];

  useEffect(() => {
    if (!nsTranslations) {
      loadNamespace(namespace);
    }
  }, [namespace, locale, nsTranslations, loadNamespace]);

  const t = useMemo(() => {
    if (!nsTranslations) {
      return (fallback: string) => fallback;
    }

    return createTranslator(nsTranslations, namespace, ...keys);
  }, [nsTranslations, keys, namespace]) as TranslatorOf<N, Keys>;

  return { t };
}
