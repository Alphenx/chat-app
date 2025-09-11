'use server';

import authorizeOperation from '@/features/common/actions/authorize-operation';
import { tryCatch } from '@/features/common/errors/try-catch';
import { RealtimeServerPublisher } from '@/features/common/services/realtime/connection/server';
import FriendsError from '@/features/friends/errors/friends.error';
import FriendsRepository from '@/features/friends/repositories/friends.repository';
import FriendsService from '@/features/friends/services/friends.service';
import { db } from '@/lib/db/connection';

const service = new FriendsService(new FriendsRepository(db), RealtimeServerPublisher);

export async function getFriendsIds(): ResultAsync<UserId[], FriendsError> {
  return await tryCatch(async () => {
    const { user } = await authorizeOperation();
    return await service.getFriendsIds(user.id);
  });
}

export async function getFriends(): ResultAsync<PublicUser[], FriendsError> {
  return await tryCatch(async () => {
    const { user } = await authorizeOperation();
    return await service.getFriends(user.id);
  });
}

export async function getFriendRequests(): ResultAsync<PublicUser[], FriendsError> {
  return await tryCatch(async () => {
    const { user } = await authorizeOperation();
    return await service.getFriendRequests(user.id);
  });
}

export async function sendFriendRequest(friendEmail: string): ResultAsync<boolean, FriendsError> {
  return await tryCatch(async () => {
    const { user } = await authorizeOperation();
    return await service.sendFriendRequest(user, friendEmail);
  });
}

export async function acceptFriendRequest(friendEmail: string): ResultAsync<boolean, FriendsError> {
  return await tryCatch(async () => {
    const { user } = await authorizeOperation();
    return await service.acceptFriendRequest(user, friendEmail);
  });
}

export async function cancelFriendRequest(friendEmail: string): ResultAsync<boolean, FriendsError> {
  return await tryCatch(async () => {
    const { user } = await authorizeOperation();
    return await service.cancelFriendRequest(user, friendEmail);
  });
}

export async function removeFriend(friendEmail: string): ResultAsync<boolean, FriendsError> {
  return await tryCatch(async () => {
    const { user } = await authorizeOperation();
    return await service.removeFriend(user.id, friendEmail);
  });
}
