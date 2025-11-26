'use client';

import { useState, useEffect } from 'react';
import {
    fetchUserAttributes,
    fetchAuthSession,
    signOut as amplifySignOut,
    getCurrentUser,
} from 'aws-amplify/auth';
import type { FetchUserAttributesOutput } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { Hub } from 'aws-amplify/utils';

// TODO - Convert this to zustand state;

export function useAuth() {
    const router = useRouter();
    const [userAttributes, setUserAttributes] =
        useState<FetchUserAttributesOutput | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        // Check authentication status on mount and when auth state changes
        checkAuthStatus();

        // Listen for auth events (sign in, sign out, token refresh, etc.)
        const unsubscribe = Hub.listen('auth', ({ payload }) => {
            switch (payload.event) {
                case 'signedIn':
                    console.log('User signed in');
                    checkAuthStatus();
                    break;
                case 'signedOut':
                    console.log('User signed out');
                    setIsAuthenticated(false);
                    setUserAttributes(null);
                    setUserId(null);
                    break;
                case 'tokenRefresh':
                    console.log('Token refreshed');
                    checkAuthStatus();
                    break;
                case 'tokenRefresh_failure':
                    console.log('Token refresh failed');
                    setIsAuthenticated(false);
                    setUserAttributes(null);
                    setUserId(null);
                    break;
            }
        });

        return () => unsubscribe();
    }, []);

    async function checkAuthStatus() {
        try {
            setLoading(true);
            setError(null);

            // Fetch the current session to verify authentication
            const session = await fetchAuthSession();

            if (session.tokens) {
                setIsAuthenticated(true);

                // Fetch current user info
                const user = await getCurrentUser();
                setUserId(user.userId);

                // Fetch user attributes (email, name, sub, etc.)
                const attributes = await fetchUserAttributes();
                setUserAttributes(attributes);
            } else {
                setIsAuthenticated(false);
                setUserAttributes(null);
                setUserId(null);
            }
        } catch (err) {
            console.error('Error fetching user data:', err);
            setError(
                err instanceof Error ? err.message : 'Failed to fetch user data'
            );
            setIsAuthenticated(false);
            setUserAttributes(null);
            setUserId(null);
        } finally {
            setLoading(false);
        }
    }

    const handleSignOut = async () => {
        try {
            await amplifySignOut();
            setUserAttributes(null);
            setIsAuthenticated(false);
            setUserId(null);
            router.push('/login');
        } catch (err) {
            console.error('Error signing out:', err);
            throw err;
        }
    };

    return {
        userId,
        userAttributes,
        loading,
        error,
        isAuthenticated,
        signOut: handleSignOut,
        refreshAuth: checkAuthStatus,
    };
}
