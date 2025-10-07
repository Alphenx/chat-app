type SidebarMenuItem = {
  id: string;
  defaultLabel: string;
  labelKey: TranslationKeysOf<'menu'>;
  icon: ElementType;
  href?: AppRoute;
  disabled?: boolean;
  onClick?: () => void;
  label?: string;
};

type NavItemType = {
  id: string;
  label: string | ReactNode;
  icon: ElementType;
  href?: AppRoute;
  disabled?: boolean;
  onClick?: () => void;
};

type NavItems = { mainItems: NavItemType[]; footerItems: NavItemType[] };
