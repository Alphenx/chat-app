export enum PusherEvent {
  // It is triggered when the connection to the websocket is established correctly
  CONNECTION_ESTABLISHED = 'pusher:connection_established',
  // It is triggered when the connection to the WebSocket fails
  CONNECTION_FAILED = 'pusher:connection_failed',
  // It is triggered when the connection is disconnected
  CONNECTION_DISCONNECTED = 'pusher:connection_disconnected',
  // It is triggered when the subscription to a channel is successful
  SUBSCRIPTION_SUCCEEDED = 'pusher:subscription_succeeded',
  // It is triggered when the subscription to a channel fails (invalid credentials, auth failed)
  SUBSCRIPTION_ERROR = 'pusher:subscription_error',
  // Only in Presence Channels: a member joins the channel
  MEMBER_ADDED = 'pusher:member_added',
  // Only in Presence Channels: a member leaves the channel
  MEMBER_REMOVED = 'pusher:member_removed',
  // Event sent from a client in private channels, using trigger('client-event-name')
  CLIENT_EVENT = 'pusher:client-event',
  // Ping sent by Pusher to keep the connection alive
  PING = 'pusher:ping',
  // Pong received in response to the ping
  PONG = 'pusher:pong',
}

type Member = {
  id: string;
  name: string;
};

export type PusherEvents = {
  [PusherEvent.CONNECTION_ESTABLISHED]: { socket_id: string };
  [PusherEvent.CONNECTION_FAILED]: { error: string };
  [PusherEvent.CONNECTION_DISCONNECTED]: { reason?: string };
  [PusherEvent.SUBSCRIPTION_SUCCEEDED]: { members?: Record<string, Member> };
  [PusherEvent.SUBSCRIPTION_ERROR]: { message: string };
  [PusherEvent.MEMBER_ADDED]: Member;
  [PusherEvent.MEMBER_REMOVED]: Member;
  [PusherEvent.CLIENT_EVENT]: unknown;
  [PusherEvent.PING]: { timestamp: number };
  [PusherEvent.PONG]: { timestamp: number };
};

export type PusherEventHandlers = EventHandlerMap<PusherEvents>;
