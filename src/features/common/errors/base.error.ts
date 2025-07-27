import { extractText } from '@/features/common/utils';
import { getTranslations } from '@/features/i18n/utils';
import { ReactNode } from 'react';

class BaseError extends Error {
  constructor(message: string | ReactNode) {
    super(typeof message === 'string' ? message : extractText(message));
    Object.setPrototypeOf(this, new.target.prototype);
  }

  protected static async getTranslator<N extends Namespace, Keys extends readonly string[] = []>(
    namespace: N,
    ...keys: Keys
  ): Promise<TranslatorOf<N, Keys>> {
    const { t: translator } = await getTranslations<N, Keys>(namespace, ...keys);
    return translator;
  }
}

export default BaseError;
