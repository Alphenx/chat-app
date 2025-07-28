'use server';

import AccountRepository from '@/features/account/repositories/account.repository';
import AccountService from '@/features/account/services/account.service';
import authorizeOperation from '@/features/common/actions/authorize-operation';
import { db } from '@/lib/db/connection';

const service = new AccountService(new AccountRepository(db));

export async function getUserByEmail(email: string) {
  await authorizeOperation();
  return service.getUserByEmail(email);
}

export async function getAccountData() {
  const { user } = await authorizeOperation();
  return service.getUserById(user.id);
}

export async function updateAccountData(updates: Omit<PublicUser, 'id'>) {
  const { user } = await authorizeOperation();
  return service.updateUser(user.id, updates);
}

export async function deleteAccount() {
  const { user } = await authorizeOperation();
  return service.deleteUser(user.id);
}
