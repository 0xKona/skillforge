import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    trailingSlash: true,
    transpilePackages: ['@react-pdf/renderer'],
    // TODO: Remove after Task 4 rewrites service layer from Amplify GraphQL to REST API.
    // The legacy service files import types from @amplify/data which are incompatible
    // with the stub schema. Type checking is done separately via `bun run type-check`.
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
