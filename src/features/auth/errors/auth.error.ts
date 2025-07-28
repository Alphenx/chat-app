import BaseError from '@/features/common/errors/base.error';

export class AuthError extends BaseError {
  private static async throw(...args: Parameters<TranslatorOf<'auth', ['errors']>>) {
    const translator = await this.getTranslator('auth', 'errors');
    return new this(translator(...args));
  }

  static defaultError() {
    return this.throw('Something went wrong. Please try again.', 'defaultError');
  }

  static userAlreadyExists() {
    return this.throw('This account already exists.', 'userAlreadyExists');
  }

  static userNotFound() {
    return this.throw('No account found.', 'userNotFound');
  }

  static invalidCredentials() {
    return this.throw('Invalid credentials.', 'invalidCredentials');
  }

  static unauthorized() {
    return this.throw('Unauthorized access.', 'unauthorized');
  }

  static emailNotValidated() {
    return this.throw('Email not validated.', 'emailNotValidated');
  }

  static invalidToken() {
    return this.throw('Invalid or expired token.', 'invalidToken');
  }
}
