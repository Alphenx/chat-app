import { Channels } from '@/features/common/services/realtime/connection/channels';
import FriendsError from '@/features/friends/errors/friends.error';
import { FriendsEvent, FriendsEvents } from '@/features/friends/realtime/events';
import FriendsRepository from '@/features/friends/repositories/friends.repository';

class FriendsService {
  constructor(
    private store: FriendsRepository,
    private publisher: RealtimePublisher<FriendsEvents>
  ) {}

  async getFriendsIds(userId: UserId): Promise<UserId[]> {
    return this.store.getFriendsIds(userId);
  }

  async getFriends(userId: UserId): Promise<PublicUser[]> {
    return this.store.getFriends(userId);
  }

  async getFriendRequests(userId: UserId): Promise<PublicUser[]> {
    return this.store.getFriendRequests(userId);
  }

  async sendFriendRequest(user: PublicUser, friendEmail: string): Promise<boolean> {
    const friend = await this.store.findByEmail(friendEmail);
    if (!friend) throw FriendsError.notFound();
    if (user.id === friend.id) throw FriendsError.cantAddYourself();

    const [requestPending, alreadyFriends] = await Promise.all([
      this.store.isFriendRequest(user.id, friend.id),
      this.store.isFriend(user.id, friend.id),
    ]);

    if (requestPending) throw FriendsError.requestAlreadySent();
    if (alreadyFriends) throw FriendsError.alreadyFriend();

    const ok = await this.store.sendFriendRequest(user.id, friend.id);
    if (ok) {
      await this.publisher.trigger(Channels.user(friend.id), FriendsEvent.FRIEND_REQUEST_SENT, {
        requester: user,
        recipientId: friend.id,
      });
    }
    return ok;
  }

  async acceptFriendRequest(user: PublicUser, friendEmail: string): Promise<boolean> {
    const friend = await this.store.findByEmail(friendEmail);
    if (!friend) throw FriendsError.notFound();
    if (user.id === friend.id) throw FriendsError.cantAddYourself();

    const [requestPending, alreadyFriends] = await Promise.all([
      this.store.isFriendRequest(user.id, friend.id),
      this.store.isFriend(user.id, friend.id),
    ]);

    if (!requestPending) throw FriendsError.notFound();
    if (alreadyFriends) throw FriendsError.alreadyFriend();

    const ok = await this.store.acceptFriendRequest(user.id, friend.id);
    if (ok) {
      await this.publisher.trigger(Channels.user(friend.id), FriendsEvent.FRIEND_REQUEST_ACCEPTED, {
        accepter: user,
        requesterId: friend.id,
      });
    }
    return ok;
  }

  async cancelFriendRequest(user: PublicUser, friendEmail: string): Promise<boolean> {
    const friend = await this.store.findByEmail(friendEmail);
    if (!friend) throw FriendsError.notFound();
    if (user.id === friend.id) throw FriendsError.cantAddYourself();

    const requestPending = await this.store.isFriendRequest(user.id, friend.id);
    if (!requestPending) throw FriendsError.notFound();

    const ok = await this.store.cancelFriendRequest(user.id, friend.id);
    if (ok) {
      await this.publisher.trigger(Channels.user(friend.id), FriendsEvent.FRIEND_REQUEST_CANCELLED, {
        canceller: user,
        recipientId: friend.id,
      });
    }
    return ok;
  }

  async removeFriend(userId: UserId, friendEmail: string): Promise<boolean> {
    const friend = await this.store.findByEmail(friendEmail);
    if (!friend) throw FriendsError.notFound();

    return this.store.removeFriend(userId, friend.id);
  }
}

export default FriendsService;
