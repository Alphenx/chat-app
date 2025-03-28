import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
  reactStrictMode: false,
  env: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    UPSTASH_URL: process.env.UPSTASH_URL,
    UPSTASH_PASSWORD: process.env.UPSTASH_PASSWORD,
  },
};

export default nextConfig;
