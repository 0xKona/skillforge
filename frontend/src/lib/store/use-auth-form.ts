import { create } from 'zustand';

/**
 * Global authentication flow state
 * Only store data needed across components, NOT UI state like loading/errors
 */
interface AuthFlowState {
    // Which auth view to show
    needsConfirmation: boolean;
    showForgotPassword: boolean;

    // Data needed for verification flow
    verificationEmail: string;
}

interface AuthFlowActions {
    setNeedsConfirmation: (needsConfirmation: boolean) => void;
    setShowForgotPassword: (showForgotPassword: boolean) => void;
    setVerificationEmail: (email: string) => void;
    resetAuthFlow: () => void;
}

const defaultAuthFlowState: AuthFlowState = {
    needsConfirmation: false,
    showForgotPassword: false,
    verificationEmail: '',
};

type AuthFlowStore = AuthFlowState & AuthFlowActions;

export const useAuthFlowState = create<AuthFlowStore>((set) => ({
    ...defaultAuthFlowState,

    setNeedsConfirmation: (needsConfirmation) => set({ needsConfirmation }),
    setShowForgotPassword: (showForgotPassword) => set({ showForgotPassword }),
    setVerificationEmail: (email) => set({ verificationEmail: email }),

    resetAuthFlow: () => set(defaultAuthFlowState),
}));

/**
 * Temporary password storage utilities
 * Uses sessionStorage for temporary password storage during verification flow
 */
const PASSWORD_STORAGE_KEY = 'temp_auth_password';

export const passwordStorage = {
    set: (password: string) => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(PASSWORD_STORAGE_KEY, password);
        }
    },
    get: (): string | null => {
        if (typeof window !== 'undefined') {
            return sessionStorage.getItem(PASSWORD_STORAGE_KEY);
        }
        return null;
    },
    clear: () => {
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem(PASSWORD_STORAGE_KEY);
        }
    },
};
