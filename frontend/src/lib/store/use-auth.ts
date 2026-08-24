import { create } from 'zustand';
import {
    fetchAuthSession,
    signOut as amplifySignOut,
    getCurrentUser,
} from 'aws-amplify/auth';

interface AuthState {
    isAuthenticated: boolean;
    userId: string | null;
    loading: boolean;
}

interface AuthActions {
    initialize: () => void;
    signOut: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuth = create<AuthStore>((set) => ({
    isAuthenticated: false,
    userId: null,
    loading: true,

    initialize: async () => {
        try {
            const session = await fetchAuthSession();

            if (session.tokens) {
                const user = await getCurrentUser();
                set({
                    isAuthenticated: true,
                    userId: user.userId,
                    loading: false,
                });
            } else {
                set({ isAuthenticated: false, userId: null, loading: false });
            }
        } catch {
            set({ isAuthenticated: false, userId: null, loading: false });
        }
    },

    signOut: async () => {
        await amplifySignOut();
        set({ isAuthenticated: false, userId: null, loading: false });
    },
}));
