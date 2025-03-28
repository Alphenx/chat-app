import { Link as ChakraLink, LinkProps as ChakraLinkProps } from '@chakra-ui/react';
import NextLink from 'next/link';

type LinkProps = ChakraLinkProps;

function Link({ href = '#', children, ...props }: LinkProps) {
  return (
    <ChakraLink asChild {...props}>
      <NextLink href={href}>{children}</NextLink>
    </ChakraLink>
  );
}

export default Link;
