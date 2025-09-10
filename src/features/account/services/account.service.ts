import AccountError from '@/features/account/errors/account.error';
import AccountRepository from '@/features/account/repositories/account.repository';
import { CatchAll } from '@/features/common/utils/decorators/catch';

export class AccountService {
  constructor(private store: AccountRepository) {}

  async getUserById(id: UserId): Promise<User> {
    const user = await this.store.findById(id);
    if (!user) throw AccountError.notFound();
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.store.findByEmail(email);
    if (!user) throw AccountError.notFound();
    return user;
  }

  async getUserByAccount(provider: string, accountId: string): Promise<User> {
    const user = await this.store.findByAccount(provider, accountId);
    if (!user) throw AccountError.notFound();
    return user;
  }

  async updateUser(id: UserId, updates: UpdateUserDTO): Promise<PublicUser> {
    const [existingUser, updatedUser] = await Promise.all([
      this.store.findById(id),
      this.store.update(id, updates),
    ]);

    if (!existingUser) throw AccountError.notFound();
    if (!updatedUser) throw AccountError.defaultError();

    return updatedUser;
  }

  async deleteUser(id: UserId): Promise<boolean> {
    if (!(await this.store.findById(id))) {
      throw AccountError.notFound();
    }
    return this.store.deleteAccount(id);
  }
}

export default AccountService;
