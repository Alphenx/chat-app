'use client';

import Avatar from '@/components/Avatar/Avatar';
import Tooltip from '@/components/Tooltip/Tooltip';
import { Box } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

function UserBadge({ isMobile, href }: { isMobile?: boolean; href: string }) {
  const { data } = useSession();
  const { name, image } = data?.user || {};

  const size = isMobile ? 'xs' : 'md';
  const placement = isMobile ? 'top' : 'right';

  return (
    <Box>
      <Link href={href} aria-label={name ?? 'Profile'}>
        <Tooltip content={name} showArrow positioning={{ placement }}>
          <Avatar src={image} size={size} cursor='pointer' display='block' />
        </Tooltip>
      </Link>
    </Box>
  );
}

export default UserBadge;
