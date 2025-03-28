import { AuthorFooter, Logo } from '@/components';
import { Flex } from '@chakra-ui/react';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

function Layout({ children }: Props) {
  return (
    <Flex direction='column' minH='100vh'>
      <Logo showName height={{ base: '170px', lg: '200px', xl: '250px' }} />
      <Flex flex='1'>{children}</Flex>
      <AuthorFooter />
    </Flex>
  );
}

export default Layout;
