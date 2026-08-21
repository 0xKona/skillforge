'use client';

import { Amplify } from 'aws-amplify';

// Temporary stub: will be properly configured with env vars in Task 3.
// This allows the static export build to succeed without amplify_outputs.json.
Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID ?? '',
            userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID ?? '',
            identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID ?? '',
        },
    },
});

export default function ConfigureAmplifyClientSide() {
    return null;
}
