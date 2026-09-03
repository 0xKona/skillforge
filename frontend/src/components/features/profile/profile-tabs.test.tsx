import { render, screen } from '@testing-library/react';
import { ProfileTabs } from './profile-tabs';

const mockPathname = jest.fn(() => '/profile/edit-profile');

jest.mock('next/navigation', () => ({
    usePathname: () => mockPathname(),
}));

describe('ProfileTabs', () => {
    beforeEach(() => {
        mockPathname.mockReturnValue('/profile/edit-profile');
    });

    it('renders labeled tabs including on the default viewport', () => {
        render(<ProfileTabs />);

        expect(screen.getByRole('link', { name: /profile/i })).toBeVisible();
        expect(screen.getByRole('link', { name: /password/i })).toBeVisible();
        expect(
            screen.getByRole('link', { name: /delete account/i })
        ).toBeVisible();
    });

    it('marks the active profile tab', () => {
        render(<ProfileTabs />);

        expect(screen.getByRole('link', { name: /profile/i })).toHaveClass(
            'text-flux'
        );
    });
});
