import SectionContainer from '@/components/layout/SectionContainer';
import SectionHeader from '@/components/layout/SectionHeader';
import { Center, Icon, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { FaUserFriends } from 'react-icons/fa';

interface FriendRequestListEmptyProps {
  title: ReactNode;
  message: ReactNode;
}

function FriendRequestListEmpty({ title, message }: FriendRequestListEmptyProps) {
  return (
    <SectionContainer>
      <SectionHeader title={title} />
      <Center flexDirection='column' justifyContent='center' alignItems='center' gap='2' py='2'>
        <Icon as={FaUserFriends} size='2xl' color='fg.muted' />
        <Text color='fg.muted' textAlign='center' fontSize={{ base: 'sm', smDown: 'xs' }}>
          {message}
        </Text>
      </Center>
    </SectionContainer>
  );
}

export default FriendRequestListEmpty;
