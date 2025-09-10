import getPusherClient from '@/lib/pusher/client';
import PusherClient, { Channel } from 'pusher-js';

function getRealtimeSubscriber(client: PusherClient | null): RealtimeSubscriber | null {
  if (!client) return null;
  return {
    subscribe: (channel: string): Channel => client.subscribe(channel),
    unsubscribe: (channel: string) => client.unsubscribe(channel),
    connect: () => client.connect(),
    disconnect: () => client.disconnect(),
  };
}

const client = getPusherClient();

export const RealtimeClientSubscriber = getRealtimeSubscriber(client);
