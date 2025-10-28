import { create } from 'zustand';

// Controller State
interface AuthFormState {
    isLoading: boolean;
    error: string;
    successMessage: string;
    needsConfirmation: boolean;
    showForgotPassword: boolean;
}

interface AuthFormActions {
    setIsLoading: (newLoading: boolean) => void;
    setError: (newError: string) => void;
    setSuccessMessage: (newSuccess: string) => void;
    setNeedsConfirmation: (newConfirm: boolean) => void;
    setShowForgotPassword: (newShowForgot: boolean) => void;
}

const defaultAuthFormState: AuthFormState = {
    isLoading: false,
    error: '',
    successMessage: '',
    needsConfirmation: false,
    showForgotPassword: false,
};

type AuthFormStore = AuthFormState & AuthFormActions;

export const useAuthControlState = create<AuthFormStore>((set) => ({
    ...defaultAuthFormState,

    setIsLoading: (newLoading) => set({ isLoading: newLoading }),
    setError: (newError) => set({ error: newError }),
    setSuccessMessage: (newSuccess) => set({ successMessage: newSuccess }),
    setNeedsConfirmation: (newConfirm) =>
        set({ needsConfirmation: newConfirm }),
    setShowForgotPassword: (newShowForgot) =>
        set({ showForgotPassword: newShowForgot }),

    reset: () => set(defaultAuthFormState),
}));

// Sign In State

// Sign Up State
interface SignUpFormState {
    signUpEmail: string;
    userPassword: string;
    confirmationCode: string;
}

interface SignUpFormActions {
    setSignUpEmail: (newEmail: string) => void;
    setConfirmationCode: (newCode: string) => void;
    setUserPassword: (newPassword: string) => void;
}

const defaultSignUpFormState: SignUpFormState = {
    signUpEmail: '',
    userPassword: '',
    confirmationCode: '',
};

type SignUpFormStore = SignUpFormState & SignUpFormActions;

export const useSignUpFormState = create<SignUpFormStore>((set) => ({
    ...defaultSignUpFormState,

    setSignUpEmail: (newEmail) => set({ signUpEmail: newEmail }),
    setConfirmationCode: (newCode) => set({ confirmationCode: newCode }),
    setUserPassword: (newPassword) => set({ userPassword: newPassword }),

    reset: () => set(defaultSignUpFormState),
}));
