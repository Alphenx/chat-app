'use client';

import { AppRoute } from '@/features/common/constants/routes';
import useSidebar from '@/features/menu/hooks/useSidebar';
import { useBreakpointValue } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import DesktopMenu from './DesktopMenu';
import MobileMenu from './MobileMenu';

function SidebarMenu() {
  const isMobile = useBreakpointValue({ base: true, sm: false });
  const items = useSidebar({ isMobile });
  const pathname = usePathname();

  const isActive = (href?: string) => !!href && (pathname === href || pathname.startsWith(href));

  const isChatDetail = isMobile && pathname.startsWith(AppRoute.DASHBOARD + AppRoute.DASH);
  if (isChatDetail) return null;

  return isMobile ? (
    <MobileMenu mainItems={items.mainItems} isActive={isActive} />
  ) : (
    <DesktopMenu {...items} isActive={isActive} />
  );
}

export default SidebarMenu;
