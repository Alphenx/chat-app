'use client';

import Modal from '@/components/Modal/Modal';
import { ConfirmModalRenderProps } from '@/features/common/hooks/useConfirmModal';
import AddFriendForm from '@/features/friends/components/AddFriend/AddFriendForm';
import { useTranslations } from '@/features/i18n/hooks/useTranslations';

type AddFriendConfirmModalProps = ConfirmModalRenderProps<string>;

export function AddFriendConfirmModal({ onConfirm, ...props }: AddFriendConfirmModalProps) {
  const { t } = useTranslations('friends', 'friendsRequestList', 'actions', 'sendFriendRequest');

  return <Modal {...props} title={t('Add Friend', 'title')} body={<AddFriendForm onConfirm={onConfirm} t={t} />} />;
}

export default AddFriendConfirmModal;
