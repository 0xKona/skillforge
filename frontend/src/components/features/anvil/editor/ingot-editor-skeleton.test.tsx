import { render } from '@testing-library/react';
import IngotEditorSkeleton from './ingot-editor-skeleton';

// Mock UI components
jest.mock('@/ui/shadcn/skeleton', () => ({
    Skeleton: ({ className }: { className: string }) => (
        <div className={className} data-testid="skeleton" />
    ),
}));

describe('IngotEditorSkeleton', () => {
    it('renders correctly', () => {
        const { container } = render(<IngotEditorSkeleton />);
        expect(container).toBeInTheDocument();
        // Check for a reasonable number of skeletons
        expect(
            container.querySelectorAll('[data-testid="skeleton"]')
        ).not.toHaveLength(0);
    });
});
