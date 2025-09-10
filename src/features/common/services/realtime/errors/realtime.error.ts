import BaseError from '@/features/common/errors/base.error';

export class RealtimeError extends BaseError<'realtime'> {
  static defaultError() {
    return new this({
      i18nKey: 'errors.defaultError',
      message: 'Realtime error. Please try again.',
      statusCode: 500,
      namespace: 'realtime',
    });
  }

  static connectionFailed() {
    return new this({
      i18nKey: 'errors.connectionFailed',
      message: 'Connection to realtime server failed.',
      statusCode: 504,
      namespace: 'realtime',
    });
  }

  static channelNotFound() {
    return new this({
      i18nKey: 'errors.channelNotFound',
      message: 'Channel not found.',
      statusCode: 404,
      namespace: 'realtime',
    });
  }

  static unauthorized() {
    return new this({
      i18nKey: 'errors.unauthorized',
      message: 'Unauthorized for realtime action.',
      statusCode: 401,
      namespace: 'realtime',
    });
  }
}

export default RealtimeError;
