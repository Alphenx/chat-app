import { getServerTranslations } from '@/features/common/actions/get-server-translations';

export class BaseError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  protected static getTranslator<
    T extends LocaleTranslations<TranslationObject>,
    Keys extends string[],
  >(translations: LocaleTranslations<T>, ...keys: Keys) {
    const locale = 'en'; // TODO: get locale from request
    const { t } = getServerTranslations<T, Keys>(translations, locale, ...keys);
    return t;
  }
}
