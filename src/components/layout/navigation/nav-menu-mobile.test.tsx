import { render, screen, fireEvent } from '@testing-library/react';
import BurgerNav from './nav-menu-mobile';

// Mock useClickOutside
jest.mock('@/hooks/use-click-outside', () => ({
    useClickOutside: jest.fn(() => ({ current: null })),
}));

// Mock NavItem
jest.mock('./nav-item', () => {
    const NavItem = ({ navItem }: { navItem: { displayText: string } }) => (
        <li data-testid="nav-item">{navItem.displayText}</li>
    );
    NavItem.displayName = 'NavItem';
    return NavItem;
});

// Mock navigationBarLinks
jest.mock('@/lib/constants/routing', () => ({
    navigationBarLinks: [
        { route: '/home', displayText: 'Home' },
        { route: '/about', displayText: 'About' },
    ],
}));

describe('BurgerNav', () => {
    it('renders burger button', () => {
        render(<BurgerNav />);
        expect(
            screen.getByLabelText('Toggle navigation menu')
        ).toBeInTheDocument();
    });

    it('menu is initially closed', () => {
        render(<BurgerNav />);
        expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('opens menu when button is clicked', () => {
        render(<BurgerNav />);
        const button = screen.getByLabelText('Toggle navigation menu');
        fireEvent.click(button);
        expect(screen.getByRole('list')).toBeInTheDocument();
        expect(screen.getAllByTestId('nav-item')).toHaveLength(2);
    });

    it('closes menu when button is clicked again', () => {
        render(<BurgerNav />);
        const button = screen.getByLabelText('Toggle navigation menu');
        fireEvent.click(button);
        expect(screen.getByRole('list')).toBeInTheDocument();
        fireEvent.click(button);
        expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });
});
