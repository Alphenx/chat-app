import getPusherServer from '@/lib/pusher/server';
import PusherServer from 'pusher';

function getRealtimePublisher(server: PusherServer): RealtimePublisher {
  return {
    trigger: (channel, event, payload) => server.trigger(channel, event, payload),
    authorizeChannel: (socketId, channelName, userData) => {
      return server.authorizeChannel(socketId, channelName, userData);
    },
  };
}

const server = getPusherServer();

export const RealtimeServerPublisher = getRealtimePublisher(server);
