import translations from '@/features/auth/i18n';
import { BaseError } from '@/features/common/errors/base.error';

export class AuthError extends BaseError {
  private static t = this.getTranslator(translations, 'auth', 'errors');

  static defaultError(): AuthError {
    return new AuthError(this.t('Something went wrong. Please try again.', 'defaultError'));
  }

  static userAlreadyExists(): AuthError {
    return new AuthError(this.t('This account already exists.', 'userAlreadyExists'));
  }

  static userNotFound(): AuthError {
    return new AuthError(this.t('No account found.', 'userNotFound'));
  }

  static invalidCredentials(): AuthError {
    return new AuthError(this.t('Invalid credentials.', 'invalidCredentials'));
  }

  static unauthorized(): AuthError {
    return new AuthError(this.t('Unauthorized access.', 'unauthorized'));
  }

  static emailNotValidated(): AuthError {
    return new AuthError(this.t('Email not validated.', 'emailNotValidated'));
  }

  static invalidToken(): AuthError {
    return new AuthError(this.t('Invalid or expired token.', 'invalidToken'));
  }
}
