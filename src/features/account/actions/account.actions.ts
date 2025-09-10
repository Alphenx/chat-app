'use server';

import AccountError from '@/features/account/errors/account.error';
import AccountRepository from '@/features/account/repositories/account.repository';
import AccountService from '@/features/account/services/account.service';
import authorizeOperation from '@/features/common/actions/authorize-operation';
import { tryCatch } from '@/features/common/errors/try-catch';
import { db } from '@/lib/db/connection';

const service = new AccountService(new AccountRepository(db));

export async function getUserByEmail(email: string): ResultAsync<PublicUser, AccountError> {
  return await tryCatch(async () => {
    await authorizeOperation();
    return await service.getUserByEmail(email);
  });
}
export async function getAccountData(): ResultAsync<PublicUser, AccountError> {
  return await tryCatch(async () => {
    const { user } = await authorizeOperation();
    return await service.getUserById(user.id);
  });
}

export async function updateAccountData(
  updates: Omit<PublicUser, 'id'>
): ResultAsync<PublicUser, AccountError> {
  return await tryCatch(async () => {
    const { user } = await authorizeOperation();
    return await service.updateUser(user.id, updates);
  });
}

export async function deleteAccount(): ResultAsync<boolean, AccountError> {
  return await tryCatch(async () => {
    const { user } = await authorizeOperation();
    return await service.deleteUser(user.id);
  });
}
