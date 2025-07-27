/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSession } from '@/features/auth/actions/auth.actions';
import { AuthError } from '@/features/auth/errors/auth.error';

type AuthenticatedMethod = (user: BaseUser, ...args: any[]) => any;

export function RequireAuth() {
  return function (
    _target: object,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<AuthenticatedMethod>
  ): void {
    const originalMethod = descriptor.value!;
    descriptor.value = async function (this: any, ...args: any[]) {
      const session = await getSession();
      const user = session?.user as BaseUser;

      if (!session || !user) {
        throw AuthError.unauthorized();
      }

      return originalMethod.call(this, user, ...args);
    };
  };
}
