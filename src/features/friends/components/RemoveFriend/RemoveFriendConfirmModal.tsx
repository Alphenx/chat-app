import Modal from '@/components/Modal/Modal';
import type { ConfirmModalRenderProps } from '@/features/common/hooks/useConfirmModal';
import { useTranslations } from '@/features/i18n/hooks/useTranslations';
import { Button, Text } from '@chakra-ui/react';
import { useState } from 'react';

type RemoveFriendConfirmModalProps = ConfirmModalRenderProps<PublicUser>;

function RemoveFriendConfirmModal({
  value: user,
  onConfirm,
  onCancel,
  ...props
}: RemoveFriendConfirmModalProps) {
  const { t } = useTranslations('friends', 'friendsList', 'actions', 'removeFriend');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      {...props}
      title={t('Confirm Removal', 'label')}
      body={
        <Text>
          {t(
            'Are you sure you want to remove <bold>${name}</bold> from your friends?',
            'confirm.message',
            { name: user?.name ?? 'this user' }
          )}
        </Text>
      }
      footer={
        <>
          <Button colorPalette='red' mr={3} onClick={handleConfirm} loading={loading}>
            {t('Yes, remove', 'confirm.yes')}
          </Button>
          <Button variant='outline' onClick={() => onCancel()}>
            {t('No, cancel', 'confirm.no')}
          </Button>
        </>
      }
    />
  );
}

export default RemoveFriendConfirmModal;
