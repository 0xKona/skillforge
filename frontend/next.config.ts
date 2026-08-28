import type { NextConfig } from 'next';

const isExport = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
    ...(isExport && { output: 'export' }),
    images: {
        unoptimized: true,
    },
    trailingSlash: true,
    transpilePackages: ['@react-pdf/renderer'],
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
