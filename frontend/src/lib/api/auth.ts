import { Amplify } from 'aws-amplify';
import { Hub } from 'aws-amplify/utils';
import {
    fetchAuthSession,
    signOut as amplifySignOut,
    getCurrentUser,
    signIn,
    signUp,
    confirmSignUp,
    resendSignUpCode,
    resetPassword,
    confirmResetPassword,
} from 'aws-amplify/auth';
import { backendConfig } from '@/lib/constants/backend';

// --- Configure Amplify (runs once on module load) ---

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

// --- Auth State ---

export interface AuthState {
    isAuthenticated: boolean;
    userId: string | null;
    loading: boolean;
}

let state: AuthState = {
    isAuthenticated: false,
    userId: null,
    loading: true,
};

const listeners = new Set<() => void>();

function setState(next: Partial<AuthState>) {
    state = { ...state, ...next };
    listeners.forEach((cb) => cb());
}

// --- Public API ---

/** Subscribe to state changes (for useSyncExternalStore). */
export function subscribe(cb: () => void): () => void {
    listeners.add(cb);
    return () => {
        listeners.delete(cb);
    };
}

/** Get current auth state snapshot (for useSyncExternalStore + non-React code). */
export function getSnapshot(): AuthState {
    return state;
}

/** Initialize auth — call once on app mount. */
export async function initialize(): Promise<void> {
    try {
        const session = await fetchAuthSession();
        if (session.tokens) {
            const user = await getCurrentUser();
            setState({
                isAuthenticated: true,
                userId: user.userId,
                loading: false,
            });
        } else {
            setState({ isAuthenticated: false, userId: null, loading: false });
        }
    } catch {
        setState({ isAuthenticated: false, userId: null, loading: false });
    }
}

/** Sign out and clear state. Always clears local auth, even if Cognito errors. */
export async function signOut(): Promise<void> {
    try {
        await amplifySignOut();
    } finally {
        setState({ isAuthenticated: false, userId: null, loading: false });
    }
}

/** Get auth token for API requests. Throws if not authenticated. */
export async function getAuthToken(): Promise<string> {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    if (!token) {
        await signOut();
        throw new Error('Not authenticated');
    }
    return token;
}

// --- Hub Listener (real-time session events) ---

Hub.listen('auth', ({ payload }) => {
    switch (payload.event) {
        case 'signedIn':
            initialize();
            break;
        case 'signedOut':
            setState({ isAuthenticated: false, userId: null, loading: false });
            break;
        case 'tokenRefresh_failure':
            setState({ isAuthenticated: false, userId: null, loading: false });
            break;
    }
});

// --- Re-export Cognito operations (single import source for auth forms) ---

export {
    signIn,
    signUp,
    confirmSignUp,
    resendSignUpCode,
    resetPassword,
    confirmResetPassword,
};
