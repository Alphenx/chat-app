import PusherServer from 'pusher';

declare global {
  var __pusherServer__: PusherServer | undefined;
}

export function getPusherServer() {
  if (global.__pusherServer__) return global.__pusherServer__;

  const { PUSHER_ID, PUSHER_SECRET, NEXT_PUBLIC_PUSHER_KEY, NEXT_PUBLIC_PUSHER_CLUSTER = 'eu' } = process.env;

  if (!PUSHER_ID || !PUSHER_SECRET || !NEXT_PUBLIC_PUSHER_KEY) {
    throw new Error('[PUSHER][server] Missing environment variables.');
  }

  const instance = new PusherServer({
    appId: PUSHER_ID,
    key: NEXT_PUBLIC_PUSHER_KEY,
    secret: PUSHER_SECRET,
    cluster: NEXT_PUBLIC_PUSHER_CLUSTER,
    useTLS: true,
  });

  global.__pusherServer__ = instance;
  return instance;
}

export default getPusherServer;
