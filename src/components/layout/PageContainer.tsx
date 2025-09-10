import { Box, VStack } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

function PageContainer({ children }: Props) {
  return (
    <Box w='100%' h='100dvh' p={{ base: '4', md: '6' }} mx='auto' maxW='breakpoint-2xl'>
      <VStack gap='6' align='stretch'>
        {children}
      </VStack>
    </Box>
  );
}

export default PageContainer;
