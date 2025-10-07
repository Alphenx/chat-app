'use client';

import { IconButton } from '@/components';
import { AppRoute } from '@/features/common/constants/routes';
import { SIDEBAR_SIZE } from '@/features/common/constants/sidebar';
import UserBadge from '@/features/menu/components/UserBadge';
import { Box, Stack } from '@chakra-ui/react';

type Props = NavItems & {
  isActive: (href?: string) => boolean;
};

function DesktopMenu({ mainItems, footerItems, isActive }: Props) {
  return (
    <Box
      as='nav'
      role='navigation'
      aria-label='Primary sidebar'
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      alignItems='center'
      h='100vh'
      w={SIDEBAR_SIZE.DESKTOP_WIDTH}
      bg='bg.panel'
      borderRightWidth='1px'
      borderColor='whiteAlpha.200'
      px={3}
      py={4}
      gap={4}
    >
      <UserBadge href={AppRoute.DASHBOARD} />

      <Stack gap={2} align='center' flex='1' mt={2}>
        {mainItems.map((item) => {
          const active = isActive(item.href);
          return (
            <IconButton
              key={item.id}
              href={item.href}
              icon={<item.icon />}
              label={item.label}
              role='menuitem'
              variant='ghost'
              size='md'
              rounded='lg'
              bg={active ? 'teal.700' : 'transparent'}
              color={active ? 'white' : 'inherit'}
              _hover={{ bg: active ? 'teal.700' : 'teal.600', color: 'white' }}
              transition='background 0.2s, color 0.1s'
              tooltipProps={{ positioning: { placement: 'right' }, showArrow: true }}
              disabled={item.disabled}
              onClick={item.onClick}
              aria-current={active ? 'page' : undefined}
            />
          );
        })}
      </Stack>

      <Stack gap={2} align='center' mb={2}>
        {footerItems.map((item) => {
          const active = isActive(item.href);
          return (
            <IconButton
              key={item.id}
              href={item.href}
              icon={<item.icon />}
              label={item.label}
              role='menuitem'
              variant='ghost'
              size='md'
              rounded='lg'
              bg={active ? 'gray.700' : 'transparent'}
              color={active ? 'white' : 'inherit'}
              _hover={{ bg: active ? 'gray.700' : 'whiteAlpha.200', color: 'white' }}
              transition='background 0.2s, color 0.1s'
              tooltipProps={{ positioning: { placement: 'right' }, showArrow: true }}
              disabled={item.disabled}
              onClick={item.onClick}
              aria-current={active ? 'page' : undefined}
            />
          );
        })}
      </Stack>
    </Box>
  );
}

export default DesktopMenu;
