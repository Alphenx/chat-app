import { BaseError } from '@/features/common/errors/base.error';
import translations from '@/features/common/services/email/i18n';

export class EmailError extends BaseError {
  private static t = this.getTranslator(translations, 'email', 'errors');

  static invalidTransport(error: unknown): EmailError {
    let message = this.t('An error occurred while processing the request', 'defaultError');

    if (error instanceof Error) {
      message = message + `: ${error.message}`;
    }
    return new EmailError(message);
  }
}
