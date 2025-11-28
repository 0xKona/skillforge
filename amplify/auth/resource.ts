import { defineAuth } from '@aws-amplify/backend';

/**
 * Generates a unique friendly name for the User Pool based on the environment.
 * - Local Sandbox: skillForgeAuth-<username>
 * - CI/CD Branch: skillForgeAuth-<branch>
 * - Production (main): skillForgeAuth-prod
 */
const getFriendlyName = () => {
    const branch = process.env.AWS_BRANCH;
    const userName = process.env.USER || process.env.USERNAME;
    const user = userName?.split('.')[0];

    if (branch) {
        return branch === 'main'
            ? 'skillForgeAuth-prod'
            : `skillForgeAuth-${branch}`;
    }

    if (user) {
        return `skillForgeAuth-${user}`;
    }

    return 'skillForgeAuth';
};

export const auth = defineAuth({
    // User friendly name for user pool
    name: getFriendlyName(),
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
        'custom:bio': {
            dataType: 'String',
            mutable: true,
            maxLen: 256,
        },
    },
});
