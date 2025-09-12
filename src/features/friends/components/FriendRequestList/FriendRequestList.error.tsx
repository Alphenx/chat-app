import SectionContainer from '@/components/layout/SectionContainer';
import SectionHeader from '@/components/layout/SectionHeader';
import { Flex, Icon, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { MdErrorOutline } from 'react-icons/md';

interface FriendRequestListErrorProps {
  title: ReactNode;
  message: string;
}

function FriendRequestListError({ title, message }: FriendRequestListErrorProps) {
  return (
    <SectionContainer>
      <SectionHeader title={title} />
      <Flex justify='center' align='center' gap='2' py='2'>
        <Icon size='md' color='fg.error'>
          <MdErrorOutline />
        </Icon>
        <Text color='fg.error' textAlign='center' fontSize={{ base: 'md', smDown: 'sm' }}>
          {message}
        </Text>
      </Flex>
    </SectionContainer>
  );
}

export default FriendRequestListError;
