'use client';

import { useRealtime } from '@/features/common/hooks/useRealtime';
import { useServerList } from '@/features/common/hooks/useServerList';
import useToaster from '@/features/common/hooks/useToaster';
import {
  acceptFriendRequest,
  cancelFriendRequest,
  getFriendRequests,
  sendFriendRequest,
} from '@/features/friends/actions/friends.actions';
import FriendsError from '@/features/friends/errors/friends.error';
import { FriendsEvent, FriendsEvents } from '@/features/friends/realtime/events';
import { useTranslations } from '@/features/i18n/hooks/useTranslations';
import { createContext, ReactNode, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useFriendsActions } from './friends.context';

type FriendRequestsState = {
  requests: PublicUser[];
  loading: boolean;
  error: FriendsError | null;
  refresh: () => void;
};

type FriendRequestsActions = {
  onAcceptRequest: (user: PublicUser) => void;
  onCancelRequest: (user: PublicUser) => void;
  onSendRequest: (email: string) => void;
};

const FriendRequestsStateContext = createContext<FriendRequestsState | null>(null);
const FriendRequestsActionsContext = createContext<FriendRequestsActions | null>(null);

export function FriendRequestsProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslations('friends', 'friendsRequestList', 'actions');
  const [domainError, setDomainError] = useState<FriendsError | null>(null);
  const { addUserToFriendsList } = useFriendsActions();
  const toaster = useToaster();

  // STATE MANAGEMENT
  const { items, loading, error, refresh, runAction, local } = useServerList<PublicUser>({
    getId: (u) => u.id,
    fetchAll: async () => {
      const [requests, err] = await getFriendRequests();
      if (err) {
        setDomainError(err);
        throw err;
      }
      setDomainError(null);
      return requests ?? [];
    },
  });

  // REALTIME EVENTS
  const refreshTimeout = useRef<NodeJS.Timeout | null>(null);
  useRealtime<FriendsEvents>({
    handlers: {
      [FriendsEvent.FRIEND_REQUEST_SENT]: ({ requester }) => {
        if (refreshTimeout.current) clearTimeout(refreshTimeout.current);
        refreshTimeout.current = setTimeout(() => local.create(requester), 200);
      },
    },
  });

  // ACTIONS
  const onSendRequest = useCallback(
    (email: string) =>
      runAction({
        inServer: async () => {
          const [, error] = await sendFriendRequest(email);
          if (error) throw error;
        },
        onSuccess: () => {
          toaster.open({
            type: 'success',
            description: t('Friend added successfully', 'sendFriendRequest.feedback.success'),
          });
        },
        onError: (error) => {
          toaster.open({ type: 'error', description: error.message });
        },
      }),
    [runAction, toaster, t]
  );

  const onAcceptRequest = useCallback(
    (user: PublicUser) =>
      runAction({
        inLocal: () => local.remove(user),
        inServer: async () => {
          const [, error] = await acceptFriendRequest(user.email);
          if (error) throw error;
        },
        onError: (error) => {
          toaster.open({ type: 'error', description: error.message });
        },
        onSuccess: () => {
          addUserToFriendsList(user);
          toaster.open({
            type: 'success',
            description: t('Friend request accepted successfully!', 'acceptFriendRequest.feedback.success'),
          });
        },
      }),
    [runAction, local, toaster, addUserToFriendsList, t]
  );

  const onCancelRequest = useCallback(
    (user: PublicUser) =>
      runAction({
        inLocal: () => local.remove(user),
        inServer: async () => {
          const [, error] = await cancelFriendRequest(user.email);
          if (error) throw error;
        },
        onError: (error) => {
          toaster.open({ type: 'error', description: error.message });
        },
        onSuccess: () => {
          toaster.open({
            type: 'success',
            description: t('Friend request declined successfully!', 'cancelFriendRequest.feedback.success'),
          });
        },
      }),
    [runAction, local, toaster, t]
  );

  // CONTEXT VALUES
  const state = useMemo<FriendRequestsState>(
    () => ({ requests: items, loading, error: domainError, refresh }),
    [items, loading, domainError, refresh]
  );

  const actions = useMemo<FriendRequestsActions>(
    () => ({ onAcceptRequest, onCancelRequest, onSendRequest }),
    [onAcceptRequest, onCancelRequest, onSendRequest]
  );

  return (
    <FriendRequestsStateContext.Provider value={state}>
      <FriendRequestsActionsContext.Provider value={actions}>{children}</FriendRequestsActionsContext.Provider>
    </FriendRequestsStateContext.Provider>
  );
}

export function useFriendRequestsState(): FriendRequestsState {
  const ctx = useContext(FriendRequestsStateContext);
  if (!ctx) throw new Error('useFriendRequestsState must be used within a FriendRequestsProvider');
  return ctx;
}

export function useFriendRequestsActions(): FriendRequestsActions {
  const ctx = useContext(FriendRequestsActionsContext);
  if (!ctx) throw new Error('useFriendRequestsActions must be used within a FriendRequestsProvider');
  return ctx;
}

export default FriendRequestsProvider;
