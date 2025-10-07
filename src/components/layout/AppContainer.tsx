'use client';

import { Flex } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

function AppContainer({ children }: Props) {
  return (
    <Flex h='100dvh' maxW='120rem' mx='auto'>
      <Flex w='100%'>{children}</Flex>
    </Flex>
  );
}

export default AppContainer;
