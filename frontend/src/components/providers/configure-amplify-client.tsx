'use client';

import { Amplify } from 'aws-amplify';
import { backendConfig } from '@/lib/config/backend-config';

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: backendConfig.auth.userPoolId,
            userPoolClientId: backendConfig.auth.userPoolClientId,
            identityPoolId: backendConfig.auth.identityPoolId,
        },
    },
    Storage: {
        S3: {
            bucket: backendConfig.storage.bucket,
            region: backendConfig.storage.region,
        },
    },
});

export default function ConfigureAmplifyClientSide() {
    return null;
}
