/* eslint-disable @typescript-eslint/no-unused-vars */
import { AuthRepository } from '@/features/auth/repositories/auth.repository';
import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter';
import { Adapter, AdapterUser } from 'next-auth/adapters';

function CustomRedisAdapter(db: Database): Adapter {
  const baseAdapter = UpstashRedisAdapter(db);
  const authRepository = new AuthRepository(db);

  return {
    ...baseAdapter,
    async createUser(user: AdapterUser) {
      const { email, emailVerified, ...data } = user;
      if (!email) return null;

      const existingUser = await authRepository.findByEmail(email);
      if (existingUser) return existingUser as unknown as AdapterUser;

      return await authRepository.create({ email, ...data } as CreateUserDTO);
    },
    async getUser(id: string) {
      return await authRepository
        .findById(id)
        .then((user) => user as unknown as AdapterUser)
        .catch(() => null);
    },
    async getUserByEmail(email: string) {
      return await authRepository
        .findByEmail(email)
        .then((user) => user as unknown as AdapterUser)
        .catch(() => null);
    },
    async getUserByAccount({ provider, providerAccountId }) {
      return await authRepository
        .findByAccount(provider, providerAccountId)
        .then((user) => user as unknown as AdapterUser)
        .catch(() => null);
    },
    async updateUser({ id, ...data }) {
      return await authRepository
        .update(id, data as UpdateUserDTO)
        .then((user) => user as unknown as AdapterUser);
    },
    async deleteUser(userId: string) {
      await authRepository.deleteAccount(userId);
    },
  };
}

export default CustomRedisAdapter;
