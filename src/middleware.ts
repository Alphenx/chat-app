import { AppRoute, PUBLIC_ROUTES, STATIC_PATHS } from '@/features/common/constants/routes';
import { getToken, JWT } from 'next-auth/jwt';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  if (isStaticPath(pathname)) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const validToken = isValidToken(token);

  if (!validToken && !isPublicRoute(pathname)) {
    return NextResponse.redirect(new URL(AppRoute.LOGIN, origin));
  }

  if (validToken && isPublicRoute(pathname)) {
    return NextResponse.redirect(new URL(AppRoute.DASHBOARD, origin));
  }

  return NextResponse.next();
}

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

function isStaticPath(pathname: string) {
  return STATIC_PATHS.some((path) => pathname.startsWith(path));
}

function isValidToken(token: JWT | null) {
  if (!token) return false;
  if (!token.exp || typeof token.exp !== 'number') return false;
  if (Date.now() / 1000 >= token.exp) return false;
  if (!token.id || !token.email) return false;
  return true;
}

export const config = {
  matcher: ['/((?!api|_next|assets|favicon.ico|robots.txt|sitemap.xml).*)'],
};
