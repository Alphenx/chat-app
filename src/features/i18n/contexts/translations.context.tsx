import { tryCatch } from '@/features/common/errors/try-catch';
import { FALLBACK_LOCALE, INITIAL_NAMESPACES } from '@/features/i18n/config';
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
  initialNamespaces = INITIAL_NAMESPACES,
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

  const localeRef = useRef<Locale>(initialLocale);
  const translationsRef = useRef<TranslationStore>(initialTranslations);

  useEffect(() => {
    localeRef.current = locale;
  }, [locale]);

  useEffect(() => {
    translationsRef.current = translations;
  }, [translations]);

  const loadNamespaceInternal = useCallback(
    async <N extends Namespace>(namespace: N, targetLocale?: Locale) => {
      const effectiveLocale = targetLocale ?? localeRef.current;
      const cacheKey = `${effectiveLocale}:${namespace}`;

      if (translationsRef.current[namespace] || loadingNamespaces.current.has(cacheKey)) return;
      loadingNamespaces.current.add(cacheKey);

      try {
        const [loaded] = await tryCatch(translationsLoader[namespace](effectiveLocale));
        if (loaded) {
          setTranslations((prev) => {
            if (prev[namespace] === loaded) return prev;
            return { ...prev, [namespace]: loaded };
          });
          return;
        }

        const [fallbackLoaded] = await tryCatch(translationsLoader[namespace](FALLBACK_LOCALE));
        if (fallbackLoaded) {
          setTranslations((prev) => {
            if (prev[namespace] === fallbackLoaded) return prev;
            return { ...prev, [namespace]: fallbackLoaded };
          });
        }
      } finally {
        loadingNamespaces.current.delete(cacheKey);
      }
    },
    []
  );

  const loadNamespace = useCallback(
    async <N extends Namespace>(namespace: N) => loadNamespaceInternal(namespace),
    [loadNamespaceInternal]
  );

  const changeLocale = useCallback(
    async (newLocale: Locale) => {
      const loadedNamespaces = Object.keys(translationsRef.current) as Namespace[];
      localeRef.current = newLocale;
      setLocale(newLocale);
      await Promise.all(loadedNamespaces.map((ns) => loadNamespaceInternal(ns, newLocale)));
    },
    [loadNamespaceInternal]
  );

  useEffect(() => {
    // Fire all loads concurrently for initial namespaces
    void Promise.all(initialNamespaces.map((ns) => loadNamespaceInternal(ns)));
  }, [initialNamespaces, loadNamespaceInternal]);

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
