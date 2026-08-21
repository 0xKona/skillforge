/**
 * Centralised backend configuration loaded from environment variables.
 * Values are populated by `infra/scripts/generate-frontend-env.ts` which
 * reads CloudFormation stack outputs and writes them to .env.local.
 */
export const backendConfig = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL ?? '',
    auth: {
        region: process.env.NEXT_PUBLIC_AWS_REGION ?? 'eu-west-2',
        userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID ?? '',
        userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID ?? '',
        identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID ?? '',
    },
    storage: {
        bucket: process.env.NEXT_PUBLIC_S3_BUCKET ?? '',
        region: process.env.NEXT_PUBLIC_AWS_REGION ?? 'eu-west-2',
    },
};
