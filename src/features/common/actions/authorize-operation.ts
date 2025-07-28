'use server';

import { getSession } from '@/features/auth/actions/auth.actions';
import { AuthError } from '@/features/auth/errors/auth.error';

async function authorizeOperation() {
  const session = await getSession();

  if (!session) {
    throw AuthError.unauthorized();
  }

  return session;
}

export default authorizeOperation;
