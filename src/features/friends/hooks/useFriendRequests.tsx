import { useFriendRequestsActions, useFriendRequestsState } from '@/features/friends/context/friends-requests.context';
import { useTranslations } from '@/features/i18n/hooks/useTranslations';
import { useMemo } from 'react';
import { FaBan, FaCheck } from 'react-icons/fa';

export function useFriendRequests() {
  const { t } = useTranslations('friends', 'friendsRequestList', 'actions');

  const { requests, loading, error } = useFriendRequestsState();
  const { onAcceptRequest, onCancelRequest } = useFriendRequestsActions();

  const actions = useMemo(
    () => [
      {
        id: 'accept-request',
        label: t('Accept', 'acceptFriendRequest.button'),
        icon: <FaCheck />,
        onClick: onAcceptRequest,
      },
      {
        id: 'cancel-request',
        label: t('Cancel', 'cancelFriendRequest.button'),
        icon: <FaBan />,
        onClick: onCancelRequest,
      },
    ],
    [t, onAcceptRequest, onCancelRequest]
  );

  return { requests, loading, error, actions };
}

export default useFriendRequests;
