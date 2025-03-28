/* eslint-disable @typescript-eslint/no-unused-vars */
import UserRepository from '@/features/user/repositories/user.repository';
import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter';
import { Adapter, AdapterUser } from 'next-auth/adapters';

function CustomRedisAdapter(db: Database): Adapter {
  const baseAdapter = UpstashRedisAdapter(db);
  const userRepository = new UserRepository(db);

  const getUser = async (id: string) => {
    return await userRepository
      .findById(id)
      .then((user) => user as unknown as AdapterUser)
      .catch(() => null);
  };

  return {
    ...baseAdapter,
    async createUser(user: AdapterUser): Promise<PublicUser | null> {
      const { emailVerified, ...data } = user;
      return await userRepository.create(data as CreateUserDTO);
    },
    getUser,
    async getUserByEmail(email: string) {
      return await userRepository
        .findByEmail(email)
        .then((user) => user as unknown as AdapterUser)
        .catch(() => null);
    },
    async getUserByAccount({ provider, providerAccountId }) {
      return await userRepository
        .findByAccount(provider, providerAccountId)
        .then((user) => user as unknown as AdapterUser)
        .catch(() => null);
    },
    async updateUser({ id, ...data }) {
      return await userRepository
        .update(id, data as UpdateUserDTO)
        .then((user) => user as unknown as AdapterUser);
    },
    async deleteUser(userId: string) {
      await userRepository.deleteAccount(userId);
    },
  };
}

export default CustomRedisAdapter;
