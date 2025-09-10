import BaseRepository from '@/features/common/repositories/base.repository';
import { AdapterAccount } from 'next-auth/adapters';

export class AccountRepository<
  T extends PrivateUser | PublicUser = PublicUser,
> extends BaseRepository<T> {
  constructor(db: Database) {
    super(db);

    this.key = {
      user: (id: UserId) => `user:${id}`,
      email: (email: string) => `user:email:${email}`,
      account: (id: string) => `user:account:${id}`,
      accountById: (id: UserId) => `user:account:by-user-id:${id}`,
      session: (id: UserId) => `user:session:${id}`,
      sessionById: (id: UserId) => `user:session:by-user-id:${id}`,
      friends: (id: UserId) => `user:friends:${id}`,
      friendRequests: (id: UserId) => `user:friend-requests:${id}`,
    };
  }

  protected toPublicUser(user: PrivateUser | PublicUser): PublicUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, emailVerified, ...publicData } = user as PrivateUser;
    return publicData;
  }

  async userExists(id: UserId): Promise<boolean> {
    return this.exists(this.key.user(id));
  }

  async emailExists(email: string): Promise<boolean> {
    return this.exists(this.key.email(email));
  }

  async create(user: CreateUserDTO): Promise<PublicUser | null> {
    const id: UserId = crypto.randomUUID();
    const createdUser = await this.set(this.key.user(id), { id, ...user } as T);
    if (!createdUser) return null;

    const emailRef = await this.setValue(this.key.email(user.email), id);
    if (!emailRef) {
      this.delete(this.key.user(id));
      return null;
    }

    return this.toPublicUser(createdUser);
  }

  async update(id: UserId, updates: UpdateUserDTO): Promise<PublicUser | null> {
    const updatedUser = await this.set(this.key.user(id), updates as T);
    if (!updatedUser) return null;
    return this.toPublicUser(updatedUser);
  }

  async findById(id: UserId): Promise<User | null> {
    const user = await this.get(this.key.user(id));
    if (!user) return null;

    const [friends, friendRequests] = await Promise.all([
      this.getSetMembers(this.key.friends(id)),
      this.getSortedSetMembers(this.key.friendRequests(id)),
    ]);

    const publicUser = this.toPublicUser(user);
    return { ...publicUser, friends, friendRequests };
  }

  async findAccountPublicData(id: UserId): Promise<PublicUser | null> {
    const user = await this.get(this.key.user(id));
    if (!user) return null;
    return this.toPublicUser(user);
  }

  async findAccountsPublicData(ids: UserId[]): Promise<PublicUser[]> {
    const users = await this.getMany(ids, (id) => this.key.user(id));
    return users.reduce<PublicUser[]>((acc, user) => {
      if (user) acc.push(this.toPublicUser(user));
      return acc;
    }, []);
  }

  async findByEmail(email: string): Promise<User | null> {
    const id = await this.getValue<UserId>(this.key.email(email));
    if (!id) return null;
    return this.findById(id);
  }

  async findByAccount(provider: string, accountId: string): Promise<User | null> {
    const accountKey = this.key.account(`${provider}:${accountId}`);
    const accountData = await this.getValue<AdapterAccount>(accountKey);
    if (!accountData || !accountData.userId) return null;
    return this.findById(accountData.userId);
  }

  async deleteAccount(id: UserId): Promise<boolean> {
    const user = await this.get(this.key.user(id));
    if (!user) return false;

    const keysToDelete = [
      this.key.accountById(id),
      this.key.email(user.email),
      this.key.friendRequests(id),
      this.key.friends(id),
      this.key.sessionById(id),
      this.key.user(id),
    ];

    return this.delete(keysToDelete);
  }
}

export default AccountRepository;
