import { extractText } from '@/features/common/utils/string/extract-text-from-node';
import { getTranslations } from '@/features/i18n/utils/get-server-translations';
import { ReactNode } from 'react';

class BaseError extends Error {
  constructor(message: string | ReactNode) {
    super(typeof message === 'string' ? message : extractText(message));
    Object.setPrototypeOf(this, new.target.prototype);
  }

  protected static getTranslator<N extends Namespace, Keys extends readonly string[] = []>(
    namespace: N,
    ...keys: Keys
  ): TranslatorOf<N, Keys> {
    const { t: translator } = getTranslations<N, Keys>(namespace, ...keys);
    return translator;
  }
}

export default BaseError;
