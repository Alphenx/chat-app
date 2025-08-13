import BaseError from '@/features/common/errors/base.error';

export class EmailError extends BaseError<'email'> {
  static invalidTransport(error: unknown) {
    if (error instanceof Error) {
      return new this({
        message: error.message,
        i18nKey: 'errors.defaultError',
        statusCode: 500,
      });
    }

    return new this({
      message: 'An error occurred while processing the request',
      i18nKey: 'errors.defaultError',
      statusCode: 500,
    });
  }
}
