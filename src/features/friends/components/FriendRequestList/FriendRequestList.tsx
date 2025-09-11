'use client';

import { List, SectionContainer, SectionHeader, UserListItem } from '@/components';
import { useFriendRequests } from '@/features/friends/hooks/useFriendRequests';
import { useTranslations } from '@/features/i18n/hooks/useTranslations';
import { Separator } from '@chakra-ui/react';
import { Fragment } from 'react';
import FriendRequestListEmpty from './FriendRequestList.empty';
import FriendRequestListError from './FriendRequestList.error';
import FriendRequestListLoading from './FriendRequestList.loading';

function FriendRequestList() {
  const { t } = useTranslations('friends', 'friendsRequestList');
  const { requests, loading, error, actions } = useFriendRequests();

  const title = t('Friend requests', 'title');

  if (loading) {
    return <FriendRequestListLoading title={title} loadingLines={2} />;
  }

  if (error) {
    return (
      <FriendRequestListError title={title} message={error.message ?? t('Error loading friend requests', 'error')} />
    );
  }

  if (requests.length === 0) {
    return (
      <FriendRequestListEmpty
        title={title}
        message={t('When people request to be your friends, they will appear here.', 'noRequests')}
      />
    );
  }

  return (
    <SectionContainer>
      <SectionHeader title={title} />
      <List
        items={requests}
        render={(user, index, users) => (
          <Fragment key={user.id}>
            <UserListItem user={user} actions={actions} />
            {index < users.length - 1 && <Separator />}
          </Fragment>
        )}
      />
    </SectionContainer>
  );
}

export default FriendRequestList;
