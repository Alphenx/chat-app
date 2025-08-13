import BaseError from '@/features/common/errors/base.error';

class AccountError extends BaseError<'account'> {
  static defaultError() {
    return new this({
      message: 'Something went wrong. Please try again.',
      i18nKey: 'errors.defaultError',
      statusCode: 500,
    });
  }

  static alreadyExists() {
    return new this({
      message: 'User already exists.',
      i18nKey: 'errors.userAlreadyExists',
      statusCode: 409,
    });
  }

  static notFound() {
    return new this({
      message: 'User not found.',
      i18nKey: 'errors.userNotFound',
      statusCode: 404,
    });
  }

  static alreadyFriend() {
    return new this({
      message: 'This user is already a friend.',
      i18nKey: 'errors.alreadyFriend',
      statusCode: 409,
    });
  }

  static requestAlreadySent() {
    return new this({
      message: 'Friend request already sent.',
      i18nKey: 'errors.requestAlreadySent',
      statusCode: 409,
    });
  }
}

export default AccountError;
