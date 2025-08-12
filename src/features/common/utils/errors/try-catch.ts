import BaseError from '@/features/common/errors/base.error';
import { log } from '@/log/logger';

const DEFAULT_PLAIN = {
  message: 'Something went wrong. Please try again later.',
  statusCode: 500,
  i18nKey: 'errors.defaultError',
} as const;

export function tryCatch<T, E = Error>(operation: Promise<T>): ResultAsync<T, E>;
export function tryCatch<T, E = Error>(operation: () => Promise<T>): ResultAsync<T, E>;
export function tryCatch<T, E = Error>(operation: () => T): ResultSync<T, E>;
export function tryCatch<T, E = Error>(
  operation: Operation<T>
): ResultSync<T, E> | ResultAsync<T, E> {
  try {
    const result = typeof operation === 'function' ? operation() : operation;

    if (result instanceof Promise) {
      return result
        .then((data: T) => [data, null] as const)
        .catch((error: E) => [null, wrapError<E>(error)]);
    }

    return [result, null] as const;
  } catch (error) {
    return [null, wrapError<E>(error)] as const;
  }
}

export function wrapError<E = Error>(error: unknown): E {
  if (error instanceof BaseError) {
    const raw = error.toPlain();
    log.error(`[${error.name}] ${error.message}\n`, raw);
    return raw as E;
  }

  log.error(`[UnknownError] ${(error as Error).message}\n`, error);
  return DEFAULT_PLAIN as E;
}
