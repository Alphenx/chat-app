import BaseError from '@/features/common/errors/base.error';

export class AuthError extends BaseError<'auth'> {
  static defaultError() {
    return new this({
      i18nKey: 'errors.defaultError',
      message: 'Something went wrong. Please try again later.',
      statusCode: 500,
    });
  }

  static userAlreadyExists() {
    return new this({
      i18nKey: 'errors.userAlreadyExists',
      message: 'This account already exists.',
      statusCode: 409,
    });
  }

  static userNotFound() {
    return new this({
      i18nKey: 'errors.userNotFound',
      message: 'User not found.',
      statusCode: 404,
    });
  }

  static invalidCredentials() {
    return new this({
      i18nKey: 'errors.invalidCredentials',
      message: 'Invalid credentials.',
      statusCode: 401,
    });
  }

  static unauthorized() {
    return new this({
      i18nKey: 'errors.unauthorized',
      message: 'Unauthorized access.',
      statusCode: 401,
    });
  }

  static emailNotValidated() {
    return new this({
      i18nKey: 'errors.emailNotValidated',
      message: 'Email not validated.',
      statusCode: 400,
    });
  }

  static invalidToken() {
    return new this({
      i18nKey: 'errors.invalidToken',
      message: 'Invalid or expired token.',
      statusCode: 401,
    });
  }
}
