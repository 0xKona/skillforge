import { passwordStorage } from './password-storage';

describe('passwordStorage', () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    describe('set', () => {
        it('stores a password in sessionStorage', () => {
            passwordStorage.set('mySecret123');
            expect(sessionStorage.getItem('temp_auth_password')).toBe(
                'mySecret123'
            );
        });
    });

    describe('get', () => {
        it('retrieves a stored password', () => {
            sessionStorage.setItem('temp_auth_password', 'storedPass');
            expect(passwordStorage.get()).toBe('storedPass');
        });

        it('returns null when no password is stored', () => {
            expect(passwordStorage.get()).toBeNull();
        });
    });

    describe('clear', () => {
        it('removes the stored password', () => {
            sessionStorage.setItem('temp_auth_password', 'toDelete');
            passwordStorage.clear();
            expect(sessionStorage.getItem('temp_auth_password')).toBeNull();
        });
    });
});
