import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    UPSTASH_URL: process.env.UPSTASH_URL,
    UPSTASH_PASSWORD: process.env.UPSTASH_PASSWORD,
  },
};

export default nextConfig;
