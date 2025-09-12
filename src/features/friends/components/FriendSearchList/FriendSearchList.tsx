'use client';

import SectionContainer from '@/components/layout/SectionContainer';
import SectionHeader from '@/components/layout/SectionHeader';
import Search from '@/components/Search/Search';
import UserListItem from '@/components/UserListItem/UserListItem';
import { useFriends } from '@/features/friends/hooks/useFriends';
import { useTranslations } from '@/features/i18n/hooks/useTranslations';
import { Separator } from '@chakra-ui/react';
import { Fragment } from 'react';
import FriendSearchListEmpty from './FriendSearchList.empty';
import FriendSearchListError from './FriendSearchList.error';
import FriendSearchListLoading from './FriendSearchList.loading';

export default function FriendSearchList() {
  const { t } = useTranslations('friends', 'friendsList');
  const { friends, loading, error, actions, refresh } = useFriends();

  const title = t('Your friends', 'title');

  if (loading) {
    return <FriendSearchListLoading title={title} loadingLines={3} />;
  }

  if (error) {
    return <FriendSearchListError title={title} message={error.message} onRetry={refresh} />;
  }

  if (friends.length === 0) {
    return <FriendSearchListEmpty title={title} message={t('You have no friends yet.', 'empty')} />;
  }

  return (
    <SectionContainer>
      <SectionHeader title={title} />
      <Search
        label={t('Search', 'search.label')}
        placeholder={t('Search for users...', 'search.placeholder')}
        items={friends}
        error={error}
        filterFn={filterByNameOrEmail}
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

function filterByNameOrEmail(user: PublicUser, query: string): boolean {
  const q = query.trim().toLowerCase();
  return user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q);
}
