import { AppRoute, PUBLIC_ROUTES, STATIC_PATHS } from '@/features/common/constants/routes';
import type { NextRequestWithAuth } from 'next-auth/middleware';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const isAuthenticated = !!token;

    if (isStaticPath(pathname)) return NextResponse.next();

    if (isAuthenticated && isPublicRoute(pathname)) {
      return NextResponse.redirect(new URL(AppRoute.DASHBOARD, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        return isStaticPath(pathname) || isPublicRoute(pathname) || !!token;
      },
    },
  }
);

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

function isStaticPath(pathname: string) {
  return STATIC_PATHS.some((path) => pathname.startsWith(path));
}

export const config = {
  matcher: ['/((?!api|_next|assets|favicon.ico|robots.txt|sitemap.xml).*)'],
};
