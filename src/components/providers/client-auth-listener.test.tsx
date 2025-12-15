import { render } from '@testing-library/react';
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
    PROTECTED_ROUTES: ['/protected'],
}));

describe('ClientAuthListener', () => {
    const mockInitialize = jest.fn();
    const mockUnsubscribe = jest.fn();
    const mockReplace = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup default mocks
        mockInitialize.mockReturnValue(mockUnsubscribe);
        (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });

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
        (usePathname as jest.Mock).mockReturnValue('/protected');
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
        (usePathname as jest.Mock).mockReturnValue('/protected/dashboard');
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

    it('does not redirect when on protected route and authenticated', () => {
        (usePathname as jest.Mock).mockReturnValue('/protected/dashboard');
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
        (usePathname as jest.Mock).mockReturnValue('/public');
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
});
