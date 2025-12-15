import { render } from '@testing-library/react';
import IngotCardSkeleton from './ingot-card-skeleton';

// Mock UI components
jest.mock('@/ui/shadcn/card', () => ({
    Card: ({
        children,
        className,
    }: {
        children: React.ReactNode;
        className: string;
    }) => (
        <div className={className} data-testid="card">
            {children}
        </div>
    ),
}));

jest.mock('@/ui/shadcn/skeleton', () => ({
    Skeleton: ({ className }: { className: string }) => (
        <div className={className} data-testid="skeleton" />
    ),
}));

describe('IngotCardSkeleton', () => {
    it('renders correctly', () => {
        const { container } = render(<IngotCardSkeleton />);
        expect(container).toBeInTheDocument();
        expect(
            container.querySelectorAll('[data-testid="skeleton"]')
        ).toHaveLength(6);
    });
});
