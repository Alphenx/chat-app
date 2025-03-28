import { deepMerge } from '@/features/common/utils/object-utils';
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

interface TranslationsContextProps {
  locale: string;
  changeLanguage: (newLocale: string) => Promise<void>;
  translationsState: LocaleTranslations;
  loadTranslations: (scopedTranslations: LocaleTranslations) => void;
}

const TranslationsContext = createContext<TranslationsContextProps | null>(null);

export const useTranslationsContext = (): TranslationsContextProps => {
  const context = useContext(TranslationsContext);
  if (!context) {
    throw new Error('useTranslationsContext must be used within a TranslationsProvider');
  }
  return context;
};

interface TranslationsProviderProps {
  initialLocale?: string;
  children: ReactNode;
}

export const TranslationsProvider = ({ initialLocale, children }: TranslationsProviderProps) => {
  const [locale, setLocale] = useState<string>(initialLocale || 'en');
  const [translationsState, setTranslationsState] = useState<LocaleTranslations>({});

  // It is used to inject translations without overwriting nested properties
  const loadTranslations = useCallback((scopedTranslations: Record<string, TranslationObject>) => {
    setTranslationsState((prev) => deepMerge(prev, scopedTranslations));
  }, []);

  const changeLanguage = useCallback(async (newLocale: string) => {
    setLocale(newLocale);
    setTranslationsState({});
    localStorage.setItem('locale', newLocale);
  }, []);

  const contextValue = useMemo(
    () => ({ locale, changeLanguage, translationsState, loadTranslations }),
    [locale, changeLanguage, translationsState, loadTranslations]
  );

  return (
    <TranslationsContext.Provider value={contextValue}>{children}</TranslationsContext.Provider>
  );
};
