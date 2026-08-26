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
