import { Response } from 'node-fetch';
import { Channel } from 'pusher-js';

declare global {
  type EventMap = Record<string, unknown>;

  type EventHandler<P = unknown> = (payload: P) => void;

  type EventHandlerMap<EventMap = EventMap> = Partial<{
    [EventKey in keyof EventMap]: EventHandler<EventMap[EventKey]>;
  }>;

  interface RealtimePublisher<EventMap = Record<string, unknown>> {
    trigger<E extends keyof EventMap>(channel: string, event: E, payload: EventMap[E]): Promise<Response>;
    authorizeChannel: (socketId: string, channelName: string, userData?: PresenceChannelData) => ChannelAuthResponse;
  }

  interface RealtimeSubscriber {
    subscribe(channel: string): Channel;
    unsubscribe(channel: string): void;
    connect(): void;
    disconnect(): void;
  }
}
