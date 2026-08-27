import { render, screen } from '@testing-library/react';
import NavBar from './navigation-bar';

// Mock the auth hook
const mockUseAuth = jest.fn();
jest.mock('@/hooks/use-auth', () => ({
    useAuth: () => mockUseAuth(),
}));

// Mock child components
jest.mock('./nav-profile-menu', () => {
    return function MockUserDropdown() {
        return <div data-testid="user-dropdown" />;
    };
});

jest.mock('./nav-menu-mobile', () => {
    return function MockBurgerNav() {
        return <div data-testid="burger-nav" />;
    };
});

jest.mock('./nav-item', () => {
    return function MockNavItem({
        navItem,
    }: {
        navItem: { displayText: string };
    }) {
        return <li data-testid="nav-item">{navItem.displayText}</li>;
    };
});

jest.mock('@/components/common/icons/logo', () => {
    return function MockLogo() {
        return <div data-testid="logo" />;
    };
});

jest.mock('@/components/common/ui/typography/typography', () => ({
    TypographyH1: ({ children }: { children: React.ReactNode }) => (
        <h1>{children}</h1>
    ),
}));

jest.mock('@/lib/constants/routing', () => ({
    navigationBarLinks: [
        { displayText: 'Home', route: '/', iconPath: '/icons/home.svg' },
        { displayText: 'Forge', route: '/forge', iconPath: '/icons/forge.svg' },
    ],
}));

beforeEach(() => {
    jest.clearAllMocks();
});

describe('NavBar', () => {
    it('shows skeleton while loading', () => {
        mockUseAuth.mockReturnValue({ isAuthenticated: false, loading: true });

        render(<NavBar />);
        expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    });

    it('shows login button when unauthenticated', () => {
        mockUseAuth.mockReturnValue({ isAuthenticated: false, loading: false });

        render(<NavBar />);
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.queryByTestId('user-dropdown')).not.toBeInTheDocument();
    });

    it('shows user dropdown when authenticated', () => {
        mockUseAuth.mockReturnValue({ isAuthenticated: true, loading: false });

        render(<NavBar />);
        expect(screen.getByTestId('user-dropdown')).toBeInTheDocument();
        expect(screen.queryByText('Login')).not.toBeInTheDocument();
    });

    it('renders navigation links', () => {
        mockUseAuth.mockReturnValue({ isAuthenticated: false, loading: false });

        render(<NavBar />);
        const navItems = screen.getAllByTestId('nav-item');
        expect(navItems).toHaveLength(2);
        expect(navItems[0]).toHaveTextContent('Home');
        expect(navItems[1]).toHaveTextContent('Forge');
    });
});
