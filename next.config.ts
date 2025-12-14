import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img.icons8.com',
                pathname: '/**',
            },
        ],
    },
    transpilePackages: ['@react-pdf/renderer'],
};

export default nextConfig;
