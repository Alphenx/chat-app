import { SectionContainer, SectionHeader } from '@/components';
import { HStack, Skeleton, VStack } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface FriendSearchListLoadingProps {
  title: ReactNode;
  loadingLines: number;
}

function FriendSearchListLoading({ title, loadingLines }: FriendSearchListLoadingProps) {
  return (
    <SectionContainer>
      <SectionHeader title={title} />
      <VStack gap={4} mt={4}>
        {/* Search input */}
        <Skeleton height='40px' width='100%' borderRadius='md' />
        {Array.from({ length: loadingLines }).map((_, i) => (
          <HStack key={i} width='100%' align='center' gap='4'>
            <Skeleton boxSize='48px' borderRadius='full' />
            <VStack align='start' gap='2' flex='1'>
              <Skeleton height='16px' width='65%' borderRadius='sm' />
              <Skeleton height='14px' width='90%' borderRadius='sm' />
            </VStack>
          </HStack>
        ))}
      </VStack>
    </SectionContainer>
  );
}

export default FriendSearchListLoading;
