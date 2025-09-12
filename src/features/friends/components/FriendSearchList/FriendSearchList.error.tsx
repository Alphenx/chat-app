import SectionContainer from '@/components/layout/SectionContainer';
import SectionHeader from '@/components/layout/SectionHeader';
import { Flex, Icon, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { MdErrorOutline } from 'react-icons/md';

interface FriendSearchListErrorProps {
  title: ReactNode;
  message: ReactNode;
  onRetry: () => void;
}

function FriendSearchListError({ title, message, onRetry }: FriendSearchListErrorProps) {
  return (
    <SectionContainer>
      <SectionHeader title={title} />
      <Flex justify='center' align='center' gap='2' py='4'>
        <Icon as={MdErrorOutline} boxSize='6' color='red.500' />
        <Text color='red.500' textAlign='center'>
          {message}
        </Text>
        <Text as='button' ml='4' fontWeight='bold' onClick={onRetry} _hover={{ textDecoration: 'underline' }}>
          Retry
        </Text>
      </Flex>
    </SectionContainer>
  );
}

export default FriendSearchListError;
