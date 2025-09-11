type FriendRequestSentPayload = {
  requester: PublicUser;
  recipientId: UserId;
};

type FriendRequestAcceptedPayload = {
  accepter: PublicUser;
  requesterId: UserId;
};

type FriendRequestCancelledPayload = {
  canceller: PublicUser;
  recipientId: UserId;
};

export enum FriendsEvent {
  FRIEND_REQUEST_SENT = 'friends:request:sent',
  FRIEND_REQUEST_ACCEPTED = 'friends:request:accepted',
  FRIEND_REQUEST_CANCELLED = 'friends:request:cancelled',
}

export type FriendsEvents = {
  [FriendsEvent.FRIEND_REQUEST_SENT]: FriendRequestSentPayload;
  [FriendsEvent.FRIEND_REQUEST_ACCEPTED]: FriendRequestAcceptedPayload;
  [FriendsEvent.FRIEND_REQUEST_CANCELLED]: FriendRequestCancelledPayload;
};

export type FriendsEventHandlers = EventHandlerMap<FriendsEvents>;
