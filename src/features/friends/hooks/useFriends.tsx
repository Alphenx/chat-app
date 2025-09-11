import { useConfirmModal } from '@/features/common/hooks/useConfirmModal';
import RemoveFriendConfirmModal from '@/features/friends/components/RemoveFriend/RemoveFriendConfirmModal';
import { useFriendsActions, useFriendsState } from '@/features/friends/context/friends.context';
import { useStartChatAction } from '@/features/friends/hooks/useStartChatAction';
import { useTranslations } from '@/features/i18n/hooks/useTranslations';
import { useMemo } from 'react';
import { IoChatbubblesOutline } from 'react-icons/io5';
import { MdDelete } from 'react-icons/md';

export function useFriends() {
  const { t } = useTranslations('friends', 'friendsList', 'actions');

  const { friends, loading, error, refresh } = useFriendsState();
  const { onRemoveFriend } = useFriendsActions();
  const { prepareChatOnHover, startChatOnClick } = useStartChatAction();

  const openRemoveFriendConfirmModal = useConfirmModal<PublicUser>({
    content: (props) => <RemoveFriendConfirmModal {...props} />,
    handler: onRemoveFriend,
  });

  const actions = useMemo(
    () => [
      {
        id: 'start-chat',
        icon: <IoChatbubblesOutline />,
        label: t('Start Chat', 'startChat.button'),
        onClick: startChatOnClick,
        onMouseEnter: prepareChatOnHover,
      },
      {
        id: 'remove-friend',
        icon: <MdDelete />,
        label: t('Remove Friend', 'removeFriend.button'),
        onClick: openRemoveFriendConfirmModal,
      },
    ],
    [t, startChatOnClick, prepareChatOnHover, openRemoveFriendConfirmModal]
  );

  return { friends, loading, error, actions, refresh };
}

export default useFriends;
