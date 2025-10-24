import { create } from 'zustand'

interface PasswordResetState {
    isLoading: boolean
    errorMsg: string
    successMsg: string
    codeSent: boolean
    providedEmail: string
}

interface PasswordResetActions {
    setLoading: (newLoading: boolean) => void
    setErrorMsg: (newError: string) => void
    setSuccessMsg: (newSuccess: string) => void
    setCodeSent: (newCodeSent: boolean) => void
    setProvidedEmail: (newEmail: string) => void
}

const defaultRequestPwState: PasswordResetState = {
    isLoading: false,
    errorMsg: '',
    successMsg: '',
    codeSent: false,
    providedEmail: '',
}

type PasswordResetStore = PasswordResetState & PasswordResetActions

export const useRequestPasswordResetStore = create<PasswordResetStore>(
    (set) => ({
        ...defaultRequestPwState,

        setLoading: (newLoading: boolean) => set({ isLoading: newLoading }),
        setErrorMsg: (newError: string) => set({ errorMsg: newError }),
        setSuccessMsg: (newSuccess: string) => set({ successMsg: newSuccess }),
        setCodeSent: (newCodeSent: boolean) => set({ codeSent: newCodeSent }),
        setProvidedEmail: (newEmail: string) =>
            set({ providedEmail: newEmail }),
        reset: () => set(defaultRequestPwState),
    })
)
