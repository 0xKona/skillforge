import { render, screen, fireEvent } from '@testing-library/react';
import UserDropdown from './nav-profile-menu';
import { useClientAuth } from '@/lib/store/use-client-auth';
import React from 'react';

// Mock useClientAuth
jest.mock('@/lib/store/use-client-auth', () => ({
    useClientAuth: jest.fn(),
}));

describe('UserDropdown', () => {
    const mockSignOut = jest.fn();

    beforeEach(() => {
        (useClientAuth as unknown as jest.Mock).mockReturnValue({
            signOut: mockSignOut,
            avatarUrl: 'http://example.com/avatar.jpg',
        });
    });

    it('renders avatar with correct image', () => {
        render(<UserDropdown />);
        const img = screen.getByAltText('avatar');
        expect(img).toHaveAttribute('src', 'http://example.com/avatar.jpg');
    });

    it('renders dropdown content', () => {
        render(<UserDropdown />);
        expect(screen.getByTestId('dropdown-content')).toBeInTheDocument();
    });

    it('calls signOut when logout is clicked', () => {
        render(<UserDropdown />);
        const logoutItem = screen.getByText('Log out');
        fireEvent.click(logoutItem);
        expect(mockSignOut).toHaveBeenCalled();
    });

    it('renders profile link', () => {
        render(<UserDropdown />);
        expect(screen.getByText('Profile')).toBeInTheDocument();
    });
});
