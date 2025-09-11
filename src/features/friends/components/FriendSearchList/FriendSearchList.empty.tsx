import { SectionContainer, SectionHeader } from '@/components';
import { Center, Icon, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { MdPersonAddAlt1 } from 'react-icons/md';

interface FriendSearchListEmptyProps {
  title: ReactNode;
  message: ReactNode;
}

function FriendSearchListEmpty({ title, message }: FriendSearchListEmptyProps) {
  return (
    <SectionContainer>
      <SectionHeader title={title} />
      <Center flexDir='column' py='8' gap='3'>
        <Icon as={MdPersonAddAlt1} boxSize='40px' color='fg.muted' />
        <Text color='fg.muted' textAlign='center' fontSize={{ base: 'sm', smDown: 'xs' }}>
          {message}
        </Text>
      </Center>
    </SectionContainer>
  );
}

export default FriendSearchListEmpty;
