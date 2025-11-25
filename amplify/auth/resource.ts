import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
    // User friendly name for user pool
    name: 'skillForgeAuth',
    loginWith: {
        email: true,
    },
    userAttributes: {
        preferredUsername: {
            mutable: true,
            required: false,
        },
        // Maps to standard 'picture' attribute
        profilePicture: {
            mutable: true,
            required: false,
        },
    },
});
