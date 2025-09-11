import { SectionContainer, SectionHeader } from '@/components';
import { HStack, Skeleton, VStack } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface FriendRequestListLoadingProps {
  title: ReactNode;
  loadingLines: number;
}

function FriendRequestListLoading({ title, loadingLines }: FriendRequestListLoadingProps) {
  return (
    <SectionContainer>
      <SectionHeader title={title} />
      <VStack gap={4} mt={4}>
        {Array.from({ length: loadingLines }).map((_, i) => (
          <HStack key={i} width='100%' align='center' gap={4}>
            {/* Avatar */}
            <Skeleton width='48px' height='48px' borderRadius='full' />
            {/* User info */}
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

export default FriendRequestListLoading;
