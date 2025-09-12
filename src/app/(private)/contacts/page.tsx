import PageContainer from '@/components/layout/PageContainer';
import FriendRequestList from '@/features/friends/components/FriendRequestList/FriendRequestList';
import FriendSearchList from '@/features/friends/components/FriendSearchList/FriendSearchList';
import FriendsSectionHeader from '@/features/friends/components/FriendsSectionHeader/FriendsSectionHeader';
import FriendRequestsProvider from '@/features/friends/context/friends-requests.context';
import FriendsProvider from '@/features/friends/context/friends.context';

async function ContactsPage() {
  return (
    <PageContainer>
      <FriendsProvider>
        <FriendRequestsProvider>
          <FriendsSectionHeader />
          <FriendRequestList />
          <FriendSearchList />
        </FriendRequestsProvider>
      </FriendsProvider>
    </PageContainer>
  );
}

export default ContactsPage;
