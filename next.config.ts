import type { NextConfig } from 'next';
import { FALLBACK_LOCALE, LOCALES } from './src/features/i18n/config';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  i18n: {
    locales: [...LOCALES],
    defaultLocale: FALLBACK_LOCALE,
    localeDetection: false,
  },
  serverExternalPackages: [
    'next-auth',
    '@next-auth/upstash-redis-adapter',
    '@upstash/redis',
    'nodemailer',
  ],
  reactStrictMode: true,
  env: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    UPSTASH_URL: process.env.UPSTASH_URL,
    UPSTASH_PASSWORD: process.env.UPSTASH_PASSWORD,
  },
};

export default nextConfig;
