import { AppRoute } from '@/features/common/constants/routes';
import { FaCog, FaHome, FaSignOutAlt, FaUserFriends } from 'react-icons/fa';

// Per-device ordering. Only ids included here will be rendered for that device.
// Desktop has separated sections (main/footer), so we expose two orders.
export const DESKTOP_MAIN_ORDER = ['dashboard', 'contacts'] as const;
export const DESKTOP_FOOTER_ORDER = ['settings', 'logout'] as const;

// Mobile currently renders only the main section in the bottom bar.
export const MOBILE_MAIN_ORDER = ['contacts', 'dashboard'] as const;

const baseMainItems: SidebarMenuItem[] = [
  {
    id: 'contacts',
    icon: FaUserFriends,
    href: AppRoute.CONTACTS,
    labelKey: 'nav.contacts',
    defaultLabel: 'Contacts',
  },
  {
    id: 'dashboard',
    icon: FaHome,
    href: AppRoute.DASHBOARD,
    labelKey: 'nav.dashboard',
    defaultLabel: 'Dashboard',
  },
];

const baseFooterItems: SidebarMenuItem[] = [
  {
    id: 'settings',
    icon: FaCog,
    href: AppRoute.SETTINGS,
    labelKey: 'footer.settings',
    defaultLabel: 'Settings',
    disabled: true,
  },
  {
    id: 'logout',
    icon: FaSignOutAlt,
    labelKey: 'footer.logout',
    defaultLabel: 'Logout',
  },
];

export { baseFooterItems, baseMainItems };
