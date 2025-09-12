import { useConfirmModal } from '@/features/common/hooks/useConfirmModal';
import { AddFriendConfirmModal } from '@/features/friends/components/AddFriend/AddFriendConfirmModal';
import { useFriendRequestsActions } from '@/features/friends/context/friends-requests.context';
import { useTranslations } from '@/features/i18n/hooks/useTranslations';
import { Button } from '@chakra-ui/react';
import { MdPersonAddAlt1 } from 'react-icons/md';

function AddFriendActionButton() {
  const { t } = useTranslations('friends', 'friendsList', 'actions', 'addFriend');
  const { onSendRequest } = useFriendRequestsActions();

  const openAddFriendModal = useConfirmModal({
    content: (props) => <AddFriendConfirmModal {...props} />,
    handler: onSendRequest,
  });

  const onClick = () => openAddFriendModal();

  return (
    <Button size={{ base: 'sm', smDown: 'xs' }} variant='subtle' onClick={onClick}>
      <MdPersonAddAlt1 />
      {t('Add Friend', 'button')}
    </Button>
  );
}

export default AddFriendActionButton;
