import BaseError from '@/features/common/errors/base.error';

class AccountError extends BaseError {
  private static async throw(...args: Parameters<TranslatorOf<'account', ['errors']>>) {
    const translator = await this.getTranslator('account', 'errors');
    return new this(translator(...args));
  }

  static defaultError() {
    return this.throw('Something went wrong. Please try again.', 'defaultError');
  }

  static alreadyExists() {
    return this.throw('User already exists.', 'userAlreadyExists');
  }

  static notFound() {
    return this.throw('User not found.', 'userNotFound');
  }

  static alreadyFriend() {
    return this.throw('This user is already a friend.', 'alreadyFriend');
  }

  static requestAlreadySent() {
    return this.throw('Friend request already sent.', 'requestAlreadySent');
  }
}

export default AccountError;
