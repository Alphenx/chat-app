import { translationsLoader } from '@/features/i18n/utils/translations-loader';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export type TranslationStore = Partial<{
  [N in Namespace]: TranslationsOf<Namespace, Locale>;
}>;

interface TranslationsContextValue {
  locale: Locale;
  translations: TranslationStore;
  changeLocale: (newLocale: Locale) => Promise<void>;
  loadNamespace: <N extends Namespace>(namespace: N) => Promise<void>;
}

const TranslationsContext = createContext<TranslationsContextValue | null>(null);

export function useTranslationsContext(): TranslationsContextValue {
  const ctx = useContext(TranslationsContext);
  if (!ctx) {
    throw new Error('useTranslationsContext must be used within a TranslationsProvider');
  }
  return ctx;
}

export function TranslationsProvider({
  initialLocale,
  initialNamespaces = [],
  translations: initialTranslations = {},
  children,
}: {
  initialLocale: Locale;
  initialNamespaces?: Namespace[];
  translations?: TranslationStore;
  children: ReactNode;
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [translations, setTranslations] = useState<TranslationStore>(initialTranslations);
  const loadingNamespaces = useRef<Set<string>>(new Set());

  const loadNamespace = useCallback(
    async <N extends Namespace>(namespace: N) => {
      const cacheKey = `${locale}:${namespace}`;

      if (translations[namespace] || loadingNamespaces.current.has(cacheKey)) return;
      loadingNamespaces.current.add(cacheKey);

      try {
        const loadedTranslations = await translationsLoader[namespace](locale);
        if (loadedTranslations) {
          setTranslations((prev) => ({ ...prev, [namespace]: loadedTranslations }));
        }
      } catch (err) {
        throw new Error(`Translations for "${cacheKey}" could not be loaded.`, { cause: err });
      } finally {
        loadingNamespaces.current.delete(cacheKey);
      }
    },
    [locale, translations]
  );

  const changeLocale = useCallback(
    async (newLocale: Locale) => {
      const loadedNamespaces = Object.keys(translations) as Namespace[];
      setLocale(newLocale);
      await Promise.all(loadedNamespaces.map((ns) => loadNamespace(ns)));
    },
    [translations, loadNamespace]
  );

  useEffect(() => {
    initialNamespaces.forEach((namespace) => {
      void loadNamespace(namespace);
    });
  }, [initialNamespaces, loadNamespace]);

  const value = useMemo(
    () => ({
      locale,
      translations,
      changeLocale,
      loadNamespace,
    }),
    [locale, translations, changeLocale, loadNamespace]
  );

  return <TranslationsContext.Provider value={value}>{children}</TranslationsContext.Provider>;
}
