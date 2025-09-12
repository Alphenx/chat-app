import { log } from '@/log/logger';
import PusherClient from 'pusher-js';

declare global {
  interface Window {
    __pusherClient__?: PusherClient;
  }
}

export function getPusherClient(): PusherClient | null {
  if (typeof window === 'undefined') return null;

  if (window.__pusherClient__) return window.__pusherClient__;

  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? 'eu';

  if (!key) {
    log.error('[PUSHER][client] Missing NEXT_PUBLIC_PUSHER_KEY.');
    return null;
  }

  const client = new PusherClient(key, {
    cluster,
    forceTLS: true,
    channelAuthorization: {
      endpoint: '/api/auth/realtime',
      transport: 'ajax',
    },
  });

  window.__pusherClient__ = client;
  return client;
}

export default getPusherClient;
