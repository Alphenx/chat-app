'use client';

import BaseError from '@/features/common/errors/base.error';
import { wrapError } from '@/features/common/errors/try-catch';
import { Channels } from '@/features/common/services/realtime/connection/channels';
import { RealtimeClientSubscriber } from '@/features/common/services/realtime/connection/client';
import { useSession } from 'next-auth/react';
import { Channel } from 'pusher-js';
import { useEffect, useMemo, useRef } from 'react';

type BoundListener = {
  ownerId: number;
  priority: number;
  wrapper: (...args: unknown[]) => void;
};

type ChannelRegistry = {
  channelObj: Channel;
  subscriber: RealtimeSubscriber;
  bound: Map<string, BoundListener>; // eventKey → listener
  refCount: number;
};

const channelRegistry = new Map<string, ChannelRegistry>();
let ownerCounter = 0;

interface UseRealtimeProps<E extends EventMap> {
  handlers: EventHandlerMap<E>;
  priority?: number;
  channelName?: string;
  onError?: (error: BaseError) => void;
}

export function useRealtime<E extends EventMap>({ handlers, priority = 0, channelName, onError }: UseRealtimeProps<E>) {
  const sessionChannel = useGetUserChannel();
  const userChannel = channelName ?? sessionChannel;
  const subscriberRef = useMemo(() => RealtimeClientSubscriber, []);
  const handlersRef = useRef<EventHandlerMap<E>>(handlers);
  const onErrorRef = useRef<((error: BaseError) => void) | undefined>(onError);
  const ownerIdRef = useRef<number>(++ownerCounter);

  // Keep refs up-to-date so wrappers can call latest handlers/onError without rebinding
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    if (!subscriberRef || !userChannel) return;
    const ownerId = ownerIdRef.current;

    // Obtain or create channel entry
    let entry = channelRegistry.get(userChannel);
    if (!entry) {
      const channelObj = subscriberRef.subscribe(userChannel);
      if (!channelObj) return;
      entry = { channelObj, subscriber: subscriberRef, bound: new Map(), refCount: 0 };
      channelRegistry.set(userChannel, entry);
    }
    entry.refCount++;

    const boundByOwner = new Set<string>();

    // Bind wrappers that will call the current handler from handlersRef at runtime.
    // This avoids rebinding when consumers provide new handler references.
    for (const eventKey of Object.keys(handlersRef.current)) {
      const eventHandler = (handlersRef.current as EventHandlerMap<E>)[eventKey as keyof E];
      if (!eventHandler) continue;

      const existing = entry.bound.get(eventKey);
      if (!existing || priority > existing.priority) {
        if (existing) entry.channelObj.unbind(eventKey, existing.wrapper);

        const wrapper = async (...args: unknown[]) => {
          try {
            const currentHandler = handlersRef.current[eventKey];
            if (typeof currentHandler === 'function') {
              (currentHandler as (...a: unknown[]) => void)(...args);
            }
          } catch (error) {
            const wrapped = await wrapError(error);
            if (onErrorRef.current) onErrorRef.current(wrapped);
            return wrapped;
          }
        };

        entry.channelObj.bind(eventKey, wrapper);
        entry.bound.set(eventKey, { ownerId, priority, wrapper });
        boundByOwner.add(eventKey);
      }
    }

    return () => {
      const reg = channelRegistry.get(userChannel);
      if (!reg) return;

      for (const eventKey of boundByOwner) {
        const listener = reg.bound.get(eventKey);
        if (listener?.ownerId === ownerId) {
          reg.channelObj.unbind(eventKey, listener.wrapper);
          reg.bound.delete(eventKey);
        }
      }

      reg.refCount--;
      if (reg.refCount <= 0) {
        // Cleanup
        for (const [eventKey, listener] of reg.bound) {
          reg.channelObj.unbind(eventKey, listener.wrapper);
        }
        reg.subscriber.unsubscribe(userChannel);
        channelRegistry.delete(userChannel);
      }
    };
    // handlers and onError are intentionally omitted from deps because we use refs
    // to allow consumers to pass inline handlers/onError without forcing re-subscribe.
  }, [userChannel, subscriberRef, priority]);
}

function useGetUserChannel() {
  const { data } = useSession();
  const userId = data?.user?.id;
  return useMemo(() => (userId ? Channels.user(userId) : undefined), [userId]);
}
