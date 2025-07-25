import { INITIAL_NAMESPACES } from '@/features/i18n/config';
import { translationsLoader } from '@/features/i18n/utils/translations-loader';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type TranslationStore = Partial<{
  [N in Namespace]: TranslationsOf<N, Locale>;
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
  children,
}: {
  initialLocale: Locale;
  initialNamespaces?: Namespace[];
  children: ReactNode;
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [translations, setTranslations] = useState<TranslationStore>({});

  const loadNamespace = useCallback(
    async <N extends Namespace>(namespace: N) => {
      try {
        const translations = await translationsLoader[namespace](locale);
        setTranslations((prev) => ({ ...prev, [namespace]: translations }));
      } catch {
        console.warn(`Error loading translations for namespace "${namespace}":`);
      }
    },
    [locale]
  );

  const changeLocale = useCallback(
    async (newLocale: Locale) => {
      const loaded = Object.keys(translations) as Namespace[];
      setLocale(newLocale);
      await Promise.all(loaded.map(loadNamespace));
    },
    [loadNamespace, translations]
  );

  useEffect(() => {
    initialNamespaces.forEach((namespace) => {
      loadNamespace(namespace);
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
