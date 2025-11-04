import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            // Allow for default avatar image
            {
                protocol: 'https',
                hostname: 'img.icons8.com',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
