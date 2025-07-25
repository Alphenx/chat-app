import { LOCALES, NAMESPACES } from '@/features/i18n/config';
import type { TranslationModules } from '@/features/i18n/models/modules';

declare global {
  type Namespace = (typeof NAMESPACES)[number];
  type Locale = (typeof LOCALES)[number];

  type TranslationObject = {
    [key: string]: string | TranslationObject;
  };

  type TranslationModule = {
    [L in Locale]: { [N in Namespace]: TranslationObject };
  };

  type TranslationsOf<N extends Namespace, L extends Locale> = TranslationModules[N][L];

  type TranslatorOf<N extends Namespace, Keys extends readonly string[] = []> = Translator<
    TranslationsOf<N, Locale>,
    Keys
  >;

  type TranslationKeysOf<N extends Namespace, Keys extends readonly string[] = []> = TranslationKey<
    TranslationsOf<N, Locale>,
    Keys
  >;

  type Loader = (locale: Locale) => Promise<TranslationsOf<Namespace, Locale>>;
}
