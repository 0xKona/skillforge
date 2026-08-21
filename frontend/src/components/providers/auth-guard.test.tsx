import { render, screen } from '@testing-library/react';
import { AuthGuard } from './auth-guard';

// Mock next/navigation
const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        replace: mockReplace,
        push: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        refresh: jest.fn(),
        prefetch: jest.fn(),
    }),
}));

// Mock the auth store
const mockUseClientAuth = jest.fn();
jest.mock('@/lib/store/use-client-auth', () => ({
    useClientAuth: (...args: unknown[]) => {
        const state = mockUseClientAuth();
        // Zustand supports both selector and no-selector patterns
        if (typeof args[0] === 'function') {
            return (args[0] as (s: unknown) => unknown)(state);
        }
        return state;
    },
}));

describe('AuthGuard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('shows loading spinner while auth state is resolving', () => {
        mockUseClientAuth.mockReturnValue({
            isAuthenticated: false,
            loading: true,
        });

        render(
            <AuthGuard>
                <div>Protected Content</div>
            </AuthGuard>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('redirects to /login when not authenticated', () => {
        mockUseClientAuth.mockReturnValue({
            isAuthenticated: false,
            loading: false,
        });

        render(
            <AuthGuard>
                <div>Protected Content</div>
            </AuthGuard>
        );

        expect(mockReplace).toHaveBeenCalledWith('/login');
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('renders children when authenticated', () => {
        mockUseClientAuth.mockReturnValue({
            isAuthenticated: true,
            loading: false,
        });

        render(
            <AuthGuard>
                <div>Protected Content</div>
            </AuthGuard>
        );

        expect(screen.getByText('Protected Content')).toBeInTheDocument();
        expect(mockReplace).not.toHaveBeenCalled();
    });
});
