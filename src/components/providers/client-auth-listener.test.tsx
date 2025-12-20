import { render, waitFor } from '@testing-library/react';
import { ClientAuthListener } from './client-auth-listener';
import { useClientAuth } from '@/lib/store/use-client-auth';
import { usePathname, useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('@/lib/store/use-client-auth');
jest.mock('next/navigation', () => ({
    usePathname: jest.fn(),
    useRouter: jest.fn(),
}));
jest.mock('@/lib/constants/routing', () => ({
    PROTECTED_ROUTES: ['/forge', '/anvil', '/profile'],
    AUTH_ROUTES: ['/login'],
}));

describe('ClientAuthListener', () => {
    const mockInitialize = jest.fn();
    const mockUnsubscribe = jest.fn();
    const mockReplace = jest.fn();
    const mockRefresh = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup default mocks
        mockInitialize.mockReturnValue(mockUnsubscribe);
        (useRouter as jest.Mock).mockReturnValue({
            replace: mockReplace,
            refresh: mockRefresh,
        });

        // Default store state
        (useClientAuth as unknown as jest.Mock).mockImplementation(
            (selector) => {
                const state = {
                    initialize: mockInitialize,
                    isAuthenticated: false,
                    loading: false,
                };
                return selector(state);
            }
        );
    });

    it('initializes auth listener on mount and unsubscribes on unmount', () => {
        (usePathname as jest.Mock).mockReturnValue('/');

        const { unmount } = render(<ClientAuthListener />);

        expect(mockInitialize).toHaveBeenCalledTimes(1);

        unmount();

        expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('does not redirect when loading', () => {
        (usePathname as jest.Mock).mockReturnValue('/forge');
        (useClientAuth as unknown as jest.Mock).mockImplementation(
            (selector) => {
                const state = {
                    initialize: mockInitialize,
                    isAuthenticated: false,
                    loading: true,
                };
                return selector(state);
            }
        );

        render(<ClientAuthListener />);

        expect(mockReplace).not.toHaveBeenCalled();
    });

    it('redirects to /login when on protected route and not authenticated', () => {
        (usePathname as jest.Mock).mockReturnValue('/forge');
        (useClientAuth as unknown as jest.Mock).mockImplementation(
            (selector) => {
                const state = {
                    initialize: mockInitialize,
                    isAuthenticated: false,
                    loading: false,
                };
                return selector(state);
            }
        );

        render(<ClientAuthListener />);

        expect(mockReplace).toHaveBeenCalledWith('/login');
    });

    it('uses hard navigation to /forge when on login page and authenticated', () => {
        (usePathname as jest.Mock).mockReturnValue('/login');
        (useClientAuth as unknown as jest.Mock).mockImplementation(
            (selector) => {
                const state = {
                    initialize: mockInitialize,
                    isAuthenticated: true,
                    loading: false,
                };
                return selector(state);
            }
        );

        // Suppress jsdom navigation error
        const consoleError = jest.spyOn(console, 'error').mockImplementation();

        render(<ClientAuthListener />);

        // Should NOT use router.replace (uses window.location.href instead)
        expect(mockReplace).not.toHaveBeenCalled();

        consoleError.mockRestore();
    });

    it('does not redirect when on protected route and authenticated', () => {
        (usePathname as jest.Mock).mockReturnValue('/forge');
        (useClientAuth as unknown as jest.Mock).mockImplementation(
            (selector) => {
                const state = {
                    initialize: mockInitialize,
                    isAuthenticated: true,
                    loading: false,
                };
                return selector(state);
            }
        );

        render(<ClientAuthListener />);

        expect(mockReplace).not.toHaveBeenCalled();
    });

    it('does not redirect when on public route and not authenticated', () => {
        (usePathname as jest.Mock).mockReturnValue('/about');
        (useClientAuth as unknown as jest.Mock).mockImplementation(
            (selector) => {
                const state = {
                    initialize: mockInitialize,
                    isAuthenticated: false,
                    loading: false,
                };
                return selector(state);
            }
        );

        render(<ClientAuthListener />);

        expect(mockReplace).not.toHaveBeenCalled();
    });

    it('calls router.refresh() when auth state changes', async () => {
        (usePathname as jest.Mock).mockReturnValue('/forge');

        // First render with unauthenticated state
        const { rerender } = render(<ClientAuthListener />);

        // Initial state - no refresh yet (prevAuthRef is null initially)
        expect(mockRefresh).not.toHaveBeenCalled();

        // Update to authenticated state
        (useClientAuth as unknown as jest.Mock).mockImplementation(
            (selector) => {
                const state = {
                    initialize: mockInitialize,
                    isAuthenticated: true,
                    loading: false,
                };
                return selector(state);
            }
        );

        rerender(<ClientAuthListener />);

        // Should trigger refresh when auth state changes
        await waitFor(() => {
            expect(mockRefresh).toHaveBeenCalled();
        });
    });
});
