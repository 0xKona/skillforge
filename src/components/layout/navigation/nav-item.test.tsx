import { render, screen } from '@testing-library/react';
import NavItem from './nav-item';
import { usePathname } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    usePathname: jest.fn(),
}));

// Mock NavIcon
jest.mock('./nav-icon', () => {
    const NavIcon = (props: { isActive: boolean }) => (
        <div data-testid="nav-icon" data-active={props.isActive} />
    );
    NavIcon.displayName = 'NavIcon';
    return NavIcon;
});

const mockNavItem = {
    route: '/test',
    displayText: 'Test Item',
    icon: 'test-icon',
};

describe('NavItem', () => {
    it('renders correctly', () => {
        (usePathname as jest.Mock).mockReturnValue('/other');
        render(<NavItem navItem={mockNavItem} />);
        expect(screen.getByText('Test Item')).toBeInTheDocument();
        expect(screen.getByRole('link')).toHaveAttribute('href', '/test');
    });

    it('applies active styles when route matches', () => {
        (usePathname as jest.Mock).mockReturnValue('/test');
        render(<NavItem navItem={mockNavItem} />);
        const link = screen.getByRole('link');
        expect(link).toHaveClass('bg-forge-orange/10');
        expect(screen.getByTestId('nav-icon')).toHaveAttribute(
            'data-active',
            'true'
        );
    });

    it('applies inactive styles when route does not match', () => {
        (usePathname as jest.Mock).mockReturnValue('/other');
        render(<NavItem navItem={mockNavItem} />);
        const link = screen.getByRole('link');
        expect(link).not.toHaveClass('bg-forge-orange/10');
        expect(screen.getByTestId('nav-icon')).toHaveAttribute(
            'data-active',
            'false'
        );
    });
});
