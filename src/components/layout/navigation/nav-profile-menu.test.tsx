import { render, screen, fireEvent } from '@testing-library/react';
import UserDropdown from './nav-profile-menu';
import { useClientAuth } from '@/lib/store/use-client-auth';
import React from 'react';

// Mock useClientAuth
jest.mock('@/lib/store/use-client-auth', () => ({
    useClientAuth: jest.fn(),
}));

// Mock shadcn components
jest.mock('@/ui/shadcn/avatar', () => ({
    Avatar: ({
        children,
        ...props
    }: {
        children: React.ReactNode;
    } & React.HTMLAttributes<HTMLDivElement>) => (
        <div data-testid="avatar" {...props}>
            {children}
        </div>
    ),
    // eslint-disable-next-line @next/next/no-img-element
    AvatarImage: ({ src }: { src: string }) => <img src={src} alt="avatar" />,
    AvatarFallback: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
}));

jest.mock('@/ui/shadcn/skeleton', () => ({
    Skeleton: () => <div data-testid="skeleton" />,
}));

// Mock DropdownMenu components
jest.mock('@/ui/shadcn/dropdown-menu', () => ({
    DropdownMenu: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
        <button data-testid="dropdown-trigger">{children}</button>
    ),
    DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="dropdown-content">{children}</div>
    ),
    DropdownMenuGroup: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    DropdownMenuItem: ({
        children,
        onClick,
    }: {
        children: React.ReactNode;
        onClick?: () => void;
    }) => (
        <div role="menuitem" onClick={onClick}>
            {children}
        </div>
    ),
    DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    DropdownMenuSeparator: () => <hr />,
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
