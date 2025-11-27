import { create } from 'zustand';
import {
    fetchUserAttributes,
    fetchAuthSession,
    signOut as amplifySignOut,
    getCurrentUser,
} from 'aws-amplify/auth';
import type { FetchUserAttributesOutput } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { AvatarService } from '@/lib/classes/avatar-service';

interface ClientAuthState {
    userAttributes: FetchUserAttributesOutput | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    userId: string | null;
    avatarUrl: string | undefined;

    setAvatarUrl: (url: string) => void;
    checkAuthStatus: () => Promise<void>;
    signOut: () => Promise<void>;
    initialize: () => () => void; // Returns unsubscribe function
}

export const useClientAuth = create<ClientAuthState>((set, get) => ({
    userAttributes: null,
    loading: true,
    error: null,
    isAuthenticated: false,
    userId: null,
    avatarUrl: undefined,

    setAvatarUrl: (url: string) => set({ avatarUrl: url }),

    checkAuthStatus: async () => {
        try {
            set({ loading: true, error: null });

            const session = await fetchAuthSession();

            if (session.tokens) {
                const user = await getCurrentUser();
                const attributes = await fetchUserAttributes();

                // Fetch fresh avatar URL using the service
                const avatarUrl = await AvatarService.getCurrentAvatarUrl();

                set({
                    isAuthenticated: true,
                    userId: user.userId,
                    userAttributes: attributes,
                    avatarUrl: avatarUrl,
                    loading: false,
                });
            } else {
                set({
                    isAuthenticated: false,
                    userAttributes: null,
                    userId: null,
                    avatarUrl: undefined,
                    loading: false,
                });
            }
        } catch (err) {
            console.error('Error fetching user data:', err);
            set({
                error:
                    err instanceof Error
                        ? err.message
                        : 'Failed to fetch user data',
                isAuthenticated: false,
                userAttributes: null,
                userId: null,
                avatarUrl: undefined,
                loading: false,
            });
        }
    },

    signOut: async () => {
        try {
            await amplifySignOut();
            set({
                userAttributes: null,
                isAuthenticated: false,
                userId: null,
                avatarUrl: undefined,
            });
        } catch (err) {
            console.error('Error signing out:', err);
            throw err;
        }
    },

    initialize: () => {
        const { checkAuthStatus } = get();

        // Initial check
        checkAuthStatus();

        // Listen for auth events
        const unsubscribe = Hub.listen('auth', ({ payload }) => {
            switch (payload.event) {
                case 'signedIn':
                case 'tokenRefresh':
                    checkAuthStatus();
                    break;
                case 'signedOut':
                case 'tokenRefresh_failure':
                    set({
                        isAuthenticated: false,
                        userAttributes: null,
                        userId: null,
                        avatarUrl: undefined,
                    });
                    break;
            }
        });

        return unsubscribe;
    },
}));
