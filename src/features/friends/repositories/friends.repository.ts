import AccountRepository from '@/features/account/repositories/account.repository';

class FriendsRepository extends AccountRepository<Friend> {
  constructor(db: Database) {
    super(db);

    this.key = {
      ...this.key,
      friends: (id: UserId) => `friends:${id}`,
      friendRequests: (id: UserId) => `friend_requests:${id}`,
    };
  }

  /** Checks if the "friendId" exists in the target account friend list */
  async isFriend(accountId: UserId, friendId: UserId): Promise<boolean> {
    return await this.isSetMember(this.key.friends(accountId), friendId);
  }

  /** Checks if the "friendId" exists in the target account friend requests list */
  async isFriendRequest(accountId: UserId, friendId: UserId): Promise<boolean> {
    return await this.isSortedSetMember(this.key.friendRequests(accountId), friendId);
  }

  async getFriendsIds(accountId: UserId): Promise<UserId[]> {
    return await this.getSetMembers(this.key.friends(accountId));
  }

  /** Returns the list of friends for the target account */
  async getFriends(accountId: UserId): Promise<Friend[]> {
    const friendIds = await this.getFriendsIds(accountId);
    if (friendIds.length === 0) return [];

    const results = await this.getMany(friendIds, (id) => this.key.user(id));
    return results.map((userData) => this.toPublicUser(userData));
  }

  /** Returns the list of friend requests for the target account */
  async getFriendRequests(ownerId: UserId): Promise<PublicUser[]> {
    const requestIds = await this.getSortedSetMembers(this.key.friendRequests(ownerId));
    if (!requestIds.length) return [];

    const results = await this.getMany(requestIds, (id) => this.key.user(id));
    return results.map((userData) => this.toPublicUser(userData));
  }

  /** Removes a friend from the target account */
  async removeFriend(ownerId: UserId, friendId: UserId): Promise<boolean> {
    const [removedAtUser, removedAtFriend] = await Promise.all([
      this.removeFromSet(this.key.friends(ownerId), friendId),
      this.removeFromSet(this.key.friends(friendId), ownerId),
    ]);

    return removedAtUser && removedAtFriend;
  }

  /** Sends a friend request to the target account */
  async sendFriendRequest(accountId: UserId, friendId: UserId): Promise<boolean> {
    return this.addToSortedSet(this.key.friendRequests(friendId), accountId, Date.now());
  }

  /** Accepts a friend request from the target account */
  async acceptFriendRequest(accountId: UserId, friendId: UserId): Promise<boolean> {
    const [addedAtUser, addedAtFriend] = await Promise.all([
      this.addToSet(this.key.friends(accountId), friendId),
      this.addToSet(this.key.friends(friendId), accountId),
    ]);

    if (addedAtUser && addedAtFriend) {
      return await this.removeFromSortedSet(this.key.friendRequests(accountId), friendId);
    }

    return false;
  }

  /** Cancels a friend request to the target account */
  async cancelFriendRequest(accountId: UserId, friendId: UserId): Promise<boolean> {
    return await this.removeFromSortedSet(this.key.friendRequests(accountId), friendId);
  }
}

export default FriendsRepository;
