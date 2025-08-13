export interface BaseErrorProps<N extends Namespace> {
  message: string;
  statusCode: number;
  i18nKey: TranslationKeysOf<N>;
  namespace: N;
}

class BaseError<N extends Namespace = 'common'> extends Error {
  public readonly statusCode: number;
  public readonly i18nKey: TranslationKeysOf<N>;
  public readonly namespace: N;

  constructor({ message, i18nKey, namespace, statusCode = 500 }: BaseErrorProps<N>) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.i18nKey = i18nKey;
    this.namespace = namespace;

    if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
  }

  public toPlain(): BaseErrorProps<N> {
    return {
      message: this.message,
      statusCode: this.statusCode,
      i18nKey: this.i18nKey,
      namespace: this.namespace,
    };
  }
}

export default BaseError;
