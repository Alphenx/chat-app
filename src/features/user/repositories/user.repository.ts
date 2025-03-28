import BaseRepository from '@/features/common/repositories/base.repository';
import { AdapterAccount } from 'next-auth/adapters';

class UserRepository<T extends PrivateUser | PublicUser = PublicUser> extends BaseRepository<T> {
  constructor(db: Database) {
    super(db);

    this.key = {
      user: (id: UserId) => `user:${id}`,
      email: (email: string) => `user:email:${email}`,
      friends: (id: UserId) => `friends:${id}`,
      friendRequests: (id: UserId) => `friend_requests:${id}`,
      account: (id: string) => `user:account:${id}`,
      accountById: (id: UserId) => `user:account:by-user-id:${id}`,
      session: (id: UserId) => `user:session:${id}`,
      sessionById: (id: UserId) => `user:session:by-user-id:${id}`,
    };
  }

  private toPublicUser(user: PrivateUser | PublicUser): PublicUser {
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
    const createdUser = await this.setValue(this.key.user(id), { id, ...user } as T);
    if (!createdUser) return null;

    const emailRef = await this.setValue(this.key.email(user.email), id);
    if (!emailRef) {
      this.delete(this.key.user(id));
      return null;
    }

    return this.toPublicUser(createdUser);
  }

  async update(id: UserId, updates: UpdateUserDTO): Promise<PublicUser | null> {
    const updatedUser = await this.updateValue(this.key.user(id), updates as T);
    if (!updatedUser) return null;
    return this.toPublicUser(updatedUser);
  }

  async findById(id: UserId): Promise<User | null> {
    const user = await this.getValue<User>(this.key.user(id));
    if (!user) return null;

    const [friends, friendRequests] = await Promise.all([
      this.getSetMembers(this.key.friends(id)),
      this.getSortedSetMembers(this.key.friendRequests(id)),
    ]);

    const publicUser = this.toPublicUser(user);
    return { ...publicUser, friends, friendRequests };
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
    const user = await this.getValue<User>(this.key.user(id));
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

  async isFriend(senderId: UserId, recieverId: UserId): Promise<boolean> {
    return this.isSetMember(this.key.friends(senderId), recieverId);
  }

  async isRequestPending(senderId: UserId, recieverId: UserId): Promise<boolean> {
    return this.isSortedSetMember(this.key.friendRequests(recieverId), senderId);
  }

  async sendFriendRequest(userId: UserId, targetFriendId: UserId): Promise<boolean> {
    return this.addToSortedSet(this.key.friendRequests(targetFriendId), userId, Date.now());
  }

  async acceptFriendRequest(userId: UserId, friendId: UserId): Promise<boolean> {
    const [removed, addedToUserList, addedToFriendList] = await Promise.all([
      this.removeFromSortedSet(this.key.friendRequests(userId), friendId),
      this.addToSet(this.key.friends(userId), friendId),
      this.addToSet(this.key.friends(friendId), userId),
    ]);

    return removed && addedToUserList && addedToFriendList;
  }

  async removeFriend(userId: UserId, friendId: UserId): Promise<boolean> {
    const [removedAtUser, removedAtFriend] = await Promise.all([
      this.removeFromSet(this.key.friends(userId), friendId),
      this.removeFromSet(this.key.friends(friendId), userId),
    ]);

    return removedAtUser && removedAtFriend;
  }

  async getFriends(userId: UserId): Promise<PublicUser[]> {
    const friendIds = await this.getSetMembers(this.key.friends(userId));
    if (friendIds.length === 0) return [];

    const pipeline = this.db.pipeline();
    friendIds.forEach((id) => pipeline.hgetall(this.key.user(id)));
    const results = (await pipeline.exec()) as [Error | null, PrivateUser][];

    const publicUsers: PublicUser[] = [];
    results.forEach(([err, userData]) => {
      if (!err && userData && Object.keys(userData).length > 0) {
        publicUsers.push(this.toPublicUser(userData));
      }
    });
    return publicUsers;
  }
}

export default UserRepository;
