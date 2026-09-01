import { render, screen } from '@testing-library/react';
import { AuthListener, AuthGuard } from './auth-guard';

import { initialize } from '@/lib/api/auth';

// Mock the auth hook
const mockUseAuth = jest.fn();
jest.mock('@/hooks/use-auth', () => ({
    useAuth: () => mockUseAuth(),
}));

// Mock the auth module
jest.mock('@/lib/api/auth', () => ({
    initialize: jest.fn(),
}));

// Mock next/navigation
const mockReplace = jest.fn();
const mockPathname = jest.fn(() => '/');
jest.mock('next/navigation', () => ({
    useRouter: () => ({ replace: mockReplace }),
    usePathname: () => mockPathname(),
}));

// Mock routing constants
jest.mock('@/lib/constants/routing', () => ({
    PROTECTED_ROUTES: ['/forge', '/anvil', '/profile'],
    AUTH_ROUTES: ['/login'],
}));

beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        userId: null,
        loading: true,
    });
});

describe('AuthListener', () => {
    it('calls initialize on mount', () => {
        render(<AuthListener />);
        expect(initialize).toHaveBeenCalledTimes(1);
    });

    it('renders null', () => {
        const { container } = render(<AuthListener />);
        expect(container).toBeEmptyDOMElement();
    });

    it('does not redirect while loading', () => {
        mockPathname.mockReturnValue('/forge');
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            loading: true,
        });

        render(<AuthListener />);
        expect(mockReplace).not.toHaveBeenCalled();
    });

    it('redirects unauthenticated user from protected route to /login', () => {
        mockPathname.mockReturnValue('/forge');
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            loading: false,
        });

        render(<AuthListener />);
        expect(mockReplace).toHaveBeenCalledWith('/login');
    });

    it('redirects authenticated user from /login to /forge', () => {
        mockPathname.mockReturnValue('/login');
        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            loading: false,
        });

        render(<AuthListener />);
        expect(mockReplace).toHaveBeenCalledWith('/forge');
    });

    it('does not redirect authenticated user on a protected route', () => {
        mockPathname.mockReturnValue('/forge');
        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            loading: false,
        });

        render(<AuthListener />);
        expect(mockReplace).not.toHaveBeenCalled();
    });

    it('does not redirect unauthenticated user on a public route', () => {
        mockPathname.mockReturnValue('/about');
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            loading: false,
        });

        render(<AuthListener />);
        expect(mockReplace).not.toHaveBeenCalled();
    });
});

describe('AuthGuard', () => {
    it('shows loading spinner while auth is resolving', () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            loading: true,
        });

        render(<AuthGuard>Protected content</AuthGuard>);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
    });

    it('renders children when authenticated', () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            loading: false,
        });

        render(<AuthGuard>Protected content</AuthGuard>);
        expect(screen.getByText('Protected content')).toBeInTheDocument();
    });

    it('renders nothing when unauthenticated (after loading)', () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            loading: false,
        });

        const { container } = render(<AuthGuard>Protected content</AuthGuard>);
        expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        expect(container).toBeEmptyDOMElement();
    });

    it('redirects to /login when unauthenticated', () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            loading: false,
        });

        render(<AuthGuard>Protected content</AuthGuard>);
        expect(mockReplace).toHaveBeenCalledWith('/login');
    });
});
