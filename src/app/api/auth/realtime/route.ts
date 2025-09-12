import { AuthError } from '@/features/auth/errors/auth.error';
import { getSession } from '@/features/auth/utils/get-session';
import { getChatMetadataById } from '@/features/chat/actions/chat.actions';
import BaseError from '@/features/common/errors/base.error';
import { wrapError } from '@/features/common/errors/try-catch';
import { Channels } from '@/features/common/services/realtime/connection/channels';
import { RealtimeServerPublisher } from '@/features/common/services/realtime/connection/server';
import { getFriendsIds } from '@/features/friends/actions/friends.actions';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user) throw AuthError.unauthorized();

    const user = session.user;
    const body = await req.formData();
    const socket_id = String(body.get('socket_id') || '');
    const channel_name = String(body.get('channel_name') || '');

    if (!socket_id || !channel_name) throw AuthError.unauthorized();

    const publisher = RealtimeServerPublisher;
    const auth = publisher.authorizeChannel(socket_id, channel_name, {
      user_id: user.id,
      user_info: {
        id: user.id,
        name: user.name,
      },
    });

    // Only allow users to subscribe to their own private channel
    if (channel_name === Channels.user(user.id)) return NextResponse.json(auth);

    if (channel_name.startsWith(Channels.PRESENCE_PREFIX)) {
      const listenerUserId = channel_name.split(Channels.PRESENCE_PREFIX)[1];

      // Session
      if (listenerUserId === user.id) return NextResponse.json(auth);

      // Friends
      const [friendsIds, error] = await getFriendsIds();
      if (error) throw error;
      if (friendsIds.includes(listenerUserId)) return NextResponse.json(auth);
    }

    if (channel_name.startsWith(Channels.CHAT_PREFIX)) {
      const chatId = channel_name.split(Channels.CHAT_PREFIX)[1];
      const [metadata, error] = await getChatMetadataById(chatId);

      if (error) throw error;
      if (metadata.participants.includes(user.id)) return NextResponse.json(auth);
    }

    throw AuthError.defaultError();
  } catch (error) {
    return NextResponse.json(wrapError(error), { status: (error as BaseError).statusCode ?? 500 });
  }
}
