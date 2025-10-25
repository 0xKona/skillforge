import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { amplifyConfig } from '@/configs/amplify.config';
import { fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth/server';
import type { FetchUserAttributesOutput } from 'aws-amplify/auth';
import { cookies } from 'next/headers';

export const { runWithAmplifyServerContext } = createServerRunner({
    config: amplifyConfig,
});

/**
 * Get the current authenticated user's session on the server
 * Use this in server components, server actions, or API routes
 */
export async function getAuthenticatedUser() {
    try {
        const currentSession = await runWithAmplifyServerContext({
            nextServerContext: { cookies },
            operation: (contextSpec) => fetchAuthSession(contextSpec),
        });

        if (!currentSession.tokens) {
            return null;
        }

        return currentSession;
    } catch (error) {
        console.error('Error getting authenticated user:', error);
        return null;
    }
}

/**
 * Get the current authenticated user's attributes on the server
 * Use this in server components, server actions, or API routes
 */
export async function getUserAttributes(): Promise<FetchUserAttributesOutput | null> {
    try {
        const attributes = await runWithAmplifyServerContext({
            nextServerContext: { cookies },
            operation: (contextSpec) => fetchUserAttributes(contextSpec),
        });

        return attributes;
    } catch (error) {
        console.error('Error getting user attributes:', error);
        return null;
    }
}

/**
 * Check if a user is authenticated on the server
 * Returns true if the user has a valid session
 */
export async function isAuthenticated(): Promise<boolean> {
    const session = await getAuthenticatedUser();
    return !!session?.tokens;
}
