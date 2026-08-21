import { render, screen, fireEvent } from '@testing-library/react';
import LibraryHeader from './library-header';

// Mock RefreshButton to simplify
jest.mock('@/widgets/refresh-button', () => ({
    RefreshButton: ({
        onClick,
        isLoading,
    }: {
        onClick: () => void;
        isLoading: boolean;
    }) => (
        <button
            onClick={onClick}
            disabled={isLoading}
            data-testid="refresh-btn"
        >
            Refresh
        </button>
    ),
}));

jest.mock('@/ui/shadcn/button', () => ({
    Button: ({ children }: { children: React.ReactNode }) => (
        <button>{children}</button>
    ),
}));

jest.mock('@/ui/typography/typography', () => ({
    TypographyH2: ({ children }: { children: React.ReactNode }) => (
        <h2>{children}</h2>
    ),
    TypographyP: ({ children }: { children: React.ReactNode }) => (
        <p>{children}</p>
    ),
}));

describe('LibraryHeader', () => {
    const defaultProps = {
        isLoading: false,
        onRefresh: jest.fn(),
        mainButtonText: 'Add New',
        mainButtonLink: '/add',
        headerTitleText: 'My Library',
        headerDescriptionText: 'Library Description',
    };

    it('renders content correctly', () => {
        render(<LibraryHeader {...defaultProps} />);
        expect(screen.getByText('My Library')).toBeInTheDocument();
        expect(screen.getByText('Library Description')).toBeInTheDocument();
        expect(screen.getByText('Add New')).toBeInTheDocument();
    });

    it('handles refresh', () => {
        render(<LibraryHeader {...defaultProps} />);
        // There might be two due to responsive layout (hidden/block classes)
        const buttons = screen.getAllByTestId('refresh-btn');
        fireEvent.click(buttons[0]);
        expect(defaultProps.onRefresh).toHaveBeenCalled();
    });
});
