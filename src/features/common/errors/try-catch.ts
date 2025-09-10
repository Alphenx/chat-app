import BaseError, { BaseErrorProps } from '@/features/common/errors/base.error';
import { getTranslations } from '@/features/i18n/utils/get-server-translations';
import { log } from '@/log/logger';

export function tryCatch<T, E = Error>(operation: Promise<T>): ResultAsync<T, E>;
export function tryCatch<T, E = Error>(operation: () => Promise<T>): ResultAsync<T, E>;
export function tryCatch<T, E = Error>(operation: () => T): ResultSync<T, E>;
export function tryCatch<T, E = Error>(operation: T): ResultSync<T, E>;
export function tryCatch<T, E = Error>(
  operation: Operation<T>
): ResultSync<T, E> | ResultAsync<T, E> {
  try {
    const result = typeof operation === 'function' ? operation() : operation;

    if (isPromiseLike(result)) {
      return result
        .then((data: T) => [data, null] as const)
        .catch(async (error: E) => [null, await wrapError<E>(error)]);
    }

    return [result, null] as const;
  } catch (error) {
    const wrapped = wrapError<E>(error);
    if (isPromiseLike(wrapped)) return wrapped.then((err) => [null, err] as const);
    return [null, wrapped] as const;
  }
}

const DEFAULT_ERROR: BaseErrorProps<'common'> = {
  namespace: 'common',
  i18nKey: 'defaultError',
  message: 'Something went wrong. Please try again later.',
  statusCode: 500,
};

export async function wrapError<E = BaseError>(error: unknown): Promise<E> {
  if (error instanceof BaseError) {
    const raw = error.toPlain();

    try {
      const { t } = await getTranslations(raw.namespace);
      const translatedError = { ...raw, message: t(raw.message, raw.i18nKey) };
      log.error(`[${error.name}] ${error.message}`, translatedError);
      return translatedError as E;
    } catch (error) {
      log.error(`[i18nError] Failed to translate ${raw.i18nKey}`, { error });
      return raw as E;
    }
  }

  log.error(`[UnknownError] ${(error as Error)?.message ?? 'Unknown'}`, error);

  try {
    const { t } = await getTranslations(DEFAULT_ERROR.namespace);
    return {
      ...DEFAULT_ERROR,
      message: t(DEFAULT_ERROR.message, DEFAULT_ERROR.i18nKey),
    } as E;
  } catch (error) {
    log.error(`[i18nError] Failed to translate ${DEFAULT_ERROR.i18nKey}`, { error });
    return DEFAULT_ERROR as E;
  }
}

function isPromiseLike<T = unknown>(value: unknown): value is Promise<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return !!value && typeof (value as any).then === 'function';
}
