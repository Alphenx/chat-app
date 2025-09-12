import BaseError from '@/features/common/errors/base.error';

export class FriendsError extends BaseError<'friends'> {
  static defaultError() {
    return new this({
      i18nKey: 'errors.defaultError',
      message: 'Something went wrong. Please try again.',
      statusCode: 500,
      namespace: 'friends',
    });
  }

  static cantAddYourself() {
    return new this({
      i18nKey: 'errors.cantAddYourself',
      message: 'You cannot add yourself as a friend.',
      statusCode: 400,
      namespace: 'friends',
    });
  }

  static alreadyExists() {
    return new this({
      i18nKey: 'errors.userAlreadyExists',
      message: 'User already exists.',
      statusCode: 409,
      namespace: 'friends',
    });
  }

  static notFound() {
    return new this({
      i18nKey: 'errors.userNotFound',
      message: 'User not found.',
      statusCode: 404,
      namespace: 'friends',
    });
  }

  static alreadyFriend() {
    return new this({
      i18nKey: 'errors.alreadyFriend',
      message: 'This user is already a friend.',
      statusCode: 409,
      namespace: 'friends',
    });
  }

  static requestAlreadySent() {
    return new this({
      i18nKey: 'errors.requestAlreadySent',
      message: 'Friend request already sent.',
      statusCode: 409,
      namespace: 'friends',
    });
  }
}

export default FriendsError;
