import BaseError from '@/features/common/errors/base.error';

export class EmailError extends BaseError {
  private static throw = this.getTranslator('email', 'errors');

  static invalidTransport(error: unknown) {
    if (error instanceof Error) {
      return this.throw(error.message, 'defaultError');
    }
    return this.throw('An error occurred while processing the request', 'defaultError');
  }
}
