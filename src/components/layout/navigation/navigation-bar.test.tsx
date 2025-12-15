import { render, screen } from '@testing-library/react';
import NavBar from './navigation-bar';
import { useClientAuth } from '@/lib/store/use-client-auth';
import React from 'react';

// Mock useClientAuth
jest.mock('@/lib/store/use-client-auth', () => ({
    useClientAuth: jest.fn(),
}));

// Mock child components
jest.mock('./nav-menu-mobile', () => {
    const BurgerNav = () => <div data-testid="burger-nav" />;
    BurgerNav.displayName = 'BurgerNav';
    return BurgerNav;
});
jest.mock('./nav-item', () => {
    const NavItem = ({ navItem }: { navItem: { displayText: string } }) => (
        <li data-testid="nav-item">{navItem.displayText}</li>
    );
    NavItem.displayName = 'NavItem';
    return NavItem;
});
jest.mock('./nav-profile-menu', () => {
    const UserDropdown = () => <div data-testid="user-dropdown" />;
    UserDropdown.displayName = 'UserDropdown';
    return UserDropdown;
});
jest.mock('@/components/common/icons/logo', () => {
    const Logo = () => <div data-testid="logo" />;
    Logo.displayName = 'Logo';
    return Logo;
});

// Mock navigationBarLinks
jest.mock('@/lib/constants/routing', () => ({
    navigationBarLinks: [
        { route: '/home', displayText: 'Home' },
        { route: '/about', displayText: 'About' },
    ],
}));

describe('NavBar', () => {
    it('renders logo and title', () => {
        (useClientAuth as unknown as jest.Mock).mockReturnValue({
            isAuthenticated: false,
            loading: false,
        });
        render(<NavBar />);
        expect(screen.getAllByTestId('logo')).toHaveLength(2); // Desktop and mobile
        expect(screen.getAllByText('SkillForge')).toHaveLength(2); // Desktop and mobile
    });

    it('renders nav items on desktop', () => {
        (useClientAuth as unknown as jest.Mock).mockReturnValue({
            isAuthenticated: false,
            loading: false,
        });
        render(<NavBar />);
        expect(screen.getAllByTestId('nav-item')).toHaveLength(2);
    });

    it('renders burger nav', () => {
        (useClientAuth as unknown as jest.Mock).mockReturnValue({
            isAuthenticated: false,
            loading: false,
        });
        render(<NavBar />);
        expect(screen.getByTestId('burger-nav')).toBeInTheDocument();
    });

    it('renders login button when not authenticated', () => {
        (useClientAuth as unknown as jest.Mock).mockReturnValue({
            isAuthenticated: false,
            loading: false,
        });
        render(<NavBar />);
        expect(screen.getByTestId('button')).toBeInTheDocument();
        expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('renders user dropdown when authenticated', () => {
        (useClientAuth as unknown as jest.Mock).mockReturnValue({
            isAuthenticated: true,
            loading: false,
        });
        render(<NavBar />);
        expect(screen.getByTestId('user-dropdown')).toBeInTheDocument();
        expect(screen.queryByTestId('button')).not.toBeInTheDocument();
    });

    it('renders skeleton when loading', () => {
        (useClientAuth as unknown as jest.Mock).mockReturnValue({
            isAuthenticated: false,
            loading: true,
        });
        render(<NavBar />);
        expect(screen.getByTestId('skeleton')).toBeInTheDocument();
        expect(screen.queryByTestId('user-dropdown')).not.toBeInTheDocument();
        expect(screen.queryByTestId('button')).not.toBeInTheDocument();
    });
});
