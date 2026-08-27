import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserDropdown from './nav-profile-menu';

// Mock the auth module
const mockSignOut = jest.fn();
jest.mock('@/lib/api/auth', () => ({
    signOut: () => mockSignOut(),
}));

// Mock the auth hook (unused directly in this component but may be needed)
jest.mock('@/hooks/use-auth', () => ({
    useAuth: () => ({
        isAuthenticated: true,
        userId: 'user-1',
        loading: false,
    }),
}));

beforeEach(() => {
    jest.clearAllMocks();
});

describe('UserDropdown', () => {
    it('renders the avatar trigger', () => {
        render(<UserDropdown />);
        expect(screen.getByTestId('dropdown-trigger')).toBeInTheDocument();
    });

    it('renders profile link', () => {
        render(<UserDropdown />);
        expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    it('renders log out button', () => {
        render(<UserDropdown />);
        expect(screen.getByText('Log out')).toBeInTheDocument();
    });

    it('calls signOut when log out is clicked', async () => {
        const user = userEvent.setup();
        render(<UserDropdown />);

        await user.click(screen.getByText('Log out'));
        expect(mockSignOut).toHaveBeenCalledTimes(1);
    });
});
