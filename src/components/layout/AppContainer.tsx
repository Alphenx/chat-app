'use client';

import { SIDEBAR_SIZE } from '@/features/common/constants/sidebar';
import { Flex, useBreakpointValue } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

function AppContainer({ children }: Props) {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex
      h={isMobile ? `calc(100dvh - ${SIDEBAR_SIZE.MOBILE_HEIGHT})` : '100dvh'}
      maxW='120rem'
      mx='auto'
    >
      <Flex w='100%'>{children}</Flex>
    </Flex>
  );
}

export default AppContainer;
