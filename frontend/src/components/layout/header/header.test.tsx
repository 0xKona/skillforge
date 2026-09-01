import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { Header } from './header';

const mockUseAuth = jest.fn();
const mockPathname = jest.fn(() => '/forge');

jest.mock('@/hooks/use-auth', () => ({
    useAuth: () => mockUseAuth(),
}));

jest.mock('next/navigation', () => ({
    usePathname: () => mockPathname(),
}));

jest.mock('@/ui/shadcn/dropdown-menu', () => ({
    DropdownMenu: ({ children }: { children: ReactNode }) => (
        <div>{children}</div>
    ),
    DropdownMenuTrigger: ({ children }: { children: ReactNode }) => children,
    DropdownMenuContent: ({ children }: { children: ReactNode }) => (
        <div>{children}</div>
    ),
    DropdownMenuItem: ({ children }: { children: ReactNode }) => (
        <div>{children}</div>
    ),
    DropdownMenuSeparator: () => <hr />,
}));

beforeEach(() => {
    jest.clearAllMocks();
    mockPathname.mockReturnValue('/forge');
});

describe('Header', () => {
    it('centers authenticated desktop navigation in the middle grid column', () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            loading: false,
        });

        render(<Header />);

        const header = screen.getByRole('banner');
        const nav = screen.getByRole('navigation');

        expect(header.firstElementChild).toHaveClass(
            'grid-cols-[1fr_auto_1fr]'
        );
        expect(nav.parentElement).toHaveClass('justify-self-center');
        expect(
            screen.getByRole('link', { name: 'SkillForge' })
        ).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Forge' })).toHaveClass(
            'text-flux'
        );
        const menuButton = screen.getByRole('button', { name: 'Open menu' });
        expect(menuButton).toBeInTheDocument();

        fireEvent.click(menuButton);
        expect(
            screen.getByRole('button', { name: 'Close menu' })
        ).toBeInTheDocument();
    });

    it('keeps the login control for logged-out users', () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            loading: false,
        });

        render(<Header />);

        expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute(
            'href',
            '/login'
        );
        expect(screen.getByRole('link', { name: 'Forge' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Anvil' })).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Open menu' })
        ).toBeInTheDocument();
    });

    it('shows the loading user-menu placeholder while auth is resolving', () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            loading: true,
        });

        render(<Header />);

        expect(
            screen.getByRole('banner').querySelector('.animate-skeleton')
        ).toBeInTheDocument();
        expect(
            screen.queryByRole('link', { name: 'Login' })
        ).not.toBeInTheDocument();
    });
});
