'use client';

import PageHeader from '@/components/layout/PageHeader';
import AddFriendActionButton from '@/features/friends/components/AddFriend/AddFriendActionButton';
import { useTranslations } from '@/features/i18n/hooks/useTranslations';

function FriendsSectionHeader() {
  const { t } = useTranslations('friends');

  return (
    <PageHeader title={t('Contacts', 'title')}>
      <AddFriendActionButton />
    </PageHeader>
  );
}

export default FriendsSectionHeader;
