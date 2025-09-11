'use client';

import { useRealtime } from '@/features/common/hooks/useRealtime';
import { useServerList } from '@/features/common/hooks/useServerList';
import { useToaster } from '@/features/common/hooks/useToaster';
import { getFriends, removeFriend } from '@/features/friends/actions/friends.actions';
import FriendsError from '@/features/friends/errors/friends.error';
import { FriendsEvent, FriendsEvents } from '@/features/friends/realtime/events';
import { useTranslations } from '@/features/i18n/hooks/useTranslations';
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

type FriendsState = {
  friends: PublicUser[];
  loading: boolean;
  error: FriendsError | null;
  refresh: () => void;
};

type FriendsActions = {
  onRemoveFriend: (value: BaseUser) => Promise<void>;
  addUserToFriendsList: (user: PublicUser) => void;
};

const FriendsStateContext = createContext<FriendsState | null>(null);
const FriendsActionsContext = createContext<FriendsActions | null>(null);

export function FriendsProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslations('friends', 'friendsList', 'actions');
  const [domainError, setDomainError] = useState<FriendsError | null>(null);
  const toaster = useToaster();

  // STATE MANAGEMENT
  const { items, loading, refresh, runAction, local } = useServerList<PublicUser>({
    getId: (u) => u.id,
    fetchAll: async () => {
      const [friends, err] = await getFriends();
      if (err) {
        setDomainError(err);
        throw err;
      }
      setDomainError(null);
      return friends ?? [];
    },
  });

  // REALTIME EVENTS
  useRealtime<FriendsEvents>({
    handlers: {
      [FriendsEvent.FRIEND_REQUEST_ACCEPTED]: ({ accepter }) => {
        local.create(accepter);
        toaster.open({
          type: 'success',
          description: t('${name} accepted your request', 'realtime.friendRequestAccepted', {
            name: accepter.name ?? accepter.email ?? 'User',
          }),
        });
      },
      [FriendsEvent.FRIEND_REQUEST_CANCELLED]: ({ canceller }) => {
        toaster.open({
          type: 'info',
          description: t('${name} declined your request', 'realtime.friendRequestCancelled', {
            name: canceller.name ?? canceller.email ?? 'User',
          }),
        });
      },
    },
    priority: 1,
  });

  const addUserToFriendsList = useCallback((user: PublicUser) => local.create(user), [local]);

  const removeFriendAction = useCallback(
    (user: PublicUser) =>
      runAction({
        inLocal: () => {
          local.remove(user);
        },
        inServer: async () => {
          const [, error] = await removeFriend(user.email);
          if (error) throw error;
        },
        onError: (error) => {
          toaster.open({ type: 'error', description: error.message });
        },
        onSuccess: () => {
          toaster.open({
            type: 'success',
            description: t('Friend removed successfully', 'removeFriend.feedback.success'),
          });
        },
      }),
    [runAction, local, toaster, t]
  );

  // CONTEXT VALUES
  const state = useMemo<FriendsState>(
    () => ({ friends: items, loading, error: domainError, local, refresh }),
    [items, loading, domainError, local, refresh]
  );

  const actions = useMemo<FriendsActions>(
    () => ({ onRemoveFriend: removeFriendAction, addUserToFriendsList }),
    [removeFriendAction, addUserToFriendsList]
  );

  return (
    <FriendsStateContext.Provider value={state}>
      <FriendsActionsContext.Provider value={actions}>{children}</FriendsActionsContext.Provider>
    </FriendsStateContext.Provider>
  );
}

export function useFriendsState(): FriendsState {
  const ctx = useContext(FriendsStateContext);
  if (!ctx) throw new Error('useFriendsState must be used within a FriendsProvider');
  return ctx;
}

export function useFriendsActions(): FriendsActions {
  const ctx = useContext(FriendsActionsContext);
  if (!ctx) throw new Error('useFriendsActions must be used within a FriendsProvider');
  return ctx;
}

export default FriendsProvider;
