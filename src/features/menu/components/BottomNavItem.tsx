'use client';

import { Box, Icon } from '@chakra-ui/react';
import Link from 'next/link';

type Props = {
  item: NavItemType;
  active?: boolean;
};

function BottomNavItem({ item, active = false }: Props) {
  const content = (
    <Box
      display='flex'
      alignItems='center'
      justifyContent='center'
      h={10}
      w={10}
      rounded='full'
      bg={active ? 'whiteAlpha.200' : 'transparent'}
      color='whiteAlpha.900'
      transition='background 180ms ease, transform 120ms ease'
      _hover={{ bg: active ? 'whiteAlpha.200' : 'whiteAlpha.100' }}
      role='menuitem'
      aria-current={active ? 'page' : undefined}
    >
      <Icon as={item.icon} boxSize={5} />
    </Box>
  );

  const ariaLabel = typeof item.label === 'string' ? item.label : undefined;

  return (
    <Box aria-disabled={item.disabled} _disabled={{ opacity: 0.6 }}>
      <Link href={item.href ?? '#'} onClick={item.onClick} aria-label={ariaLabel}>
        {content}
      </Link>
    </Box>
  );
}

export default BottomNavItem;
