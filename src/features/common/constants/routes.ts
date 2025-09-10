export enum AppRoute {
  DASH = '/',

  HOME = DASH,
  LOGIN = DASH + 'login',
  REGISTER = DASH + 'register',
  FORGOT_PASSWORD = DASH + 'forgot-password',
  CONTACTS = DASH + 'contacts',
  DASHBOARD = DASH + 'dashboard',
  SETTINGS = DASH + 'settings',
}

export const PUBLIC_ROUTES: AppRoute[] = [
  AppRoute.LOGIN,
  AppRoute.REGISTER,
  AppRoute.FORGOT_PASSWORD,
];

export const STATIC_PATHS: string[] = [
  '/_next/',
  '/assets/',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
];
