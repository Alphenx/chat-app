import { useTranslations } from '@/features/i18n/hooks/useTranslations';
import {
  DESKTOP_FOOTER_ORDER,
  DESKTOP_MAIN_ORDER,
  MOBILE_MAIN_ORDER,
  baseFooterItems,
  baseMainItems,
} from '@/features/menu/constants';
import { signOut } from 'next-auth/react';
import { useCallback, useMemo } from 'react';

type UseSidebarOptions = { isMobile?: boolean };

function useSidebar(options: UseSidebarOptions = {}) {
  const { isMobile = false } = options;
  const { t } = useTranslations('menu');

  const handleSignOut = useCallback(() => signOut(), []);

  const actionsMap = useMemo<Record<string, (() => void) | undefined>>(
    () => ({ logout: handleSignOut }),
    [handleSignOut]
  );

  const translateAndAttachActions = useCallback(
    (items: SidebarMenuItem[]): NavItemType[] =>
      items.map((item) => ({
        ...item,
        label: t(item.defaultLabel, item.labelKey),
        onClick: actionsMap[item.id],
      })),
    [t, actionsMap]
  );

  const sortByOrder = useCallback(
    (items: NavItemType[], order: readonly string[]) =>
      order.map((id) => items.find((i) => i.id === id)).filter((i): i is NavItemType => Boolean(i)),
    []
  );

  const mainItems = useMemo<NavItemType[]>(() => {
    const items = translateAndAttachActions(baseMainItems);
    const order = isMobile ? MOBILE_MAIN_ORDER : DESKTOP_MAIN_ORDER;
    return sortByOrder(items, order);
  }, [translateAndAttachActions, isMobile, sortByOrder]);

  const footerItems = useMemo<NavItemType[]>(() => {
    const items = translateAndAttachActions(baseFooterItems);
    const order = DESKTOP_FOOTER_ORDER; // footer only shown on desktop for now
    return isMobile ? [] : sortByOrder(items, order);
  }, [translateAndAttachActions, sortByOrder, isMobile]);

  return { mainItems, footerItems };
}

export default useSidebar;
