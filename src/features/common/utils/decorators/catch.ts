import BaseError from '@/features/common/errors/base.error';

/**
 * Decorator for Async Methods that catches unusual errors and delegates them to a handler.
 */
export function Catch(handler: (error: unknown) => void): MethodDecorator {
  return (_, _key, descriptor: PropertyDescriptor) => {
    const original = descriptor.value!;

    descriptor.value = async function (...args: unknown[]): Promise<unknown> {
      try {
        return await original.apply(this, args);
      } catch (error) {
        if (error instanceof BaseError) throw error;
        throw handler(error instanceof Error ? error.message : error);
      }
    };
  };
}

/**
 * A class decorator that wraps all methods of a class with a try-catch block.
 * If an error is thrown during the execution of a method, the provided `handler`
 * function is invoked with the error. Errors of type `BaseError` are re-thrown
 * without invoking the handler.
 */
export function CatchAll(handler: (error: unknown) => void): ClassDecorator {
  return (constructor) => {
    const prototype = constructor.prototype;

    for (const key of Object.getOwnPropertyNames(prototype)) {
      if (key === 'constructor') continue;

      const descriptor = Object.getOwnPropertyDescriptor(prototype, key);
      if (!descriptor || typeof descriptor.value !== 'function') continue;

      const original = descriptor.value as (...args: unknown[]) => Promise<unknown>;

      descriptor.value = async function (...args: unknown[]): Promise<unknown> {
        try {
          return await original.apply(this, args);
        } catch (error) {
          if (error instanceof BaseError) throw error;
          throw handler(error instanceof Error ? error.message : error);
        }
      };

      Object.defineProperty(prototype, key, descriptor);
    }

    return constructor;
  };
}
