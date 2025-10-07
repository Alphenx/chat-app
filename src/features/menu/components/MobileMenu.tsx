'use client';

import { AppRoute } from '@/features/common/constants/routes';
import BottomNavItem from '@/features/menu/components/BottomNavItem';
import UserBadge from '@/features/menu/components/UserBadge';
import { Box, HStack } from '@chakra-ui/react';

type Props = Pick<NavItems, 'mainItems'> & {
  settingsHref?: string;
  isActive: (href?: string) => boolean;
};

function MobileMenu({ mainItems, settingsHref = AppRoute.SETTINGS, isActive }: Props) {
  return (
    <Box
      as='nav'
      role='navigation'
      aria-label='Bottom navigation'
      pos='fixed'
      left={0}
      right={0}
      bottom={0}
      zIndex={20}
      display='flex'
      justifyContent='center'
      pb={4}
      py={2}
    >
      <HStack
        gap={2}
        align='center'
        bg='gray.900'
        color='white'
        shadow='xl'
        rounded='full'
        p={2}
        mx={1}
        w='xs'
        border='1px solid'
        justifyContent='space-between'
        borderColor='whiteAlpha.200'
      >
        {mainItems.map((item) => (
          <BottomNavItem key={item.id} item={item} active={isActive(item.href)} />
        ))}

        {settingsHref ? (
          <Box h={10} w={10} display='flex' alignItems='center' justifyContent='center'>
            <UserBadge href={settingsHref} isMobile />
          </Box>
        ) : null}
      </HStack>
    </Box>
  );
}

export default MobileMenu;
