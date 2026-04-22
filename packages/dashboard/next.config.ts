import type { NextConfig } from 'next';
const config: NextConfig = {
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
  env: {
    NEXT_PUBLIC_API_URL: process.env.API_URL || 'http://localhost:3001',
    NEXT_PUBLIC_CDN_DOMAIN: process.env.CDN_DOMAIN || 'cdn.yourdomain.com',
    NEXT_PUBLIC_COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID || '',
    NEXT_PUBLIC_COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID || '',
    NEXT_PUBLIC_COGNITO_REGION: process.env.AWS_REGION || 'us-east-1',
  },
};
export default config;
