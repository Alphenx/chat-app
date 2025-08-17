import BaseError from '@/features/common/errors/base.error';

export class I18nError extends BaseError<'common'> {
  static defaultError() {
    return new this({
      i18nKey: 'defaultError',
      message: 'Failed to load translations. Please try again later.',
      statusCode: 500,
      namespace: 'common',
    });
  }

  static moduleNotFound(params: { namespace: Namespace; locale: Locale }) {
    const { namespace, locale } = params;
    return new this({
      i18nKey: 'i18n.moduleNotFound',
      message: `Translations module not found for "${namespace}" in locale "${locale}".`,
      statusCode: 404,
      namespace: 'common',
    });
  }
}

export default I18nError;
