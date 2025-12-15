import { render, screen, fireEvent } from '@testing-library/react';
import AnvilInterface from './anvil-interface';
import { useAnvilInterfaceState } from '@/lib/store/use-anvil-interface';
import { Ingot } from '@/lib/types/ingot-types';

// Mock dependencies
jest.mock('@/lib/store/use-anvil-interface');

// Mock child components
jest.mock('@/widgets/library-header', () => ({
    __esModule: true,
    default: ({
        onRefresh,
        isLoading,
    }: {
        onRefresh: () => void;
        isLoading: boolean;
    }) => (
        <div data-testid="library-header">
            <button onClick={onRefresh}>Refresh</button>
            {isLoading && <span>Loading...</span>}
        </div>
    ),
}));

jest.mock('./anvil-filters', () => ({
    __esModule: true,
    default: () => <div data-testid="anvil-filters">Filters</div>,
}));

jest.mock('@/widgets/library-card', () => ({
    __esModule: true,
    default: ({ cardData }: { cardData: Ingot }) => (
        <div data-testid="library-card">{cardData.name}</div>
    ),
}));

jest.mock('./ingot-card-skeleton', () => ({
    __esModule: true,
    default: () => <div data-testid="ingot-card-skeleton">Skeleton</div>,
}));

// Mock Next.js Link
jest.mock('next/link', () => ({
    __esModule: true,
    default: ({
        children,
        href,
    }: {
        children: React.ReactNode;
        href: string;
    }) => <a href={href}>{children}</a>,
}));

describe('AnvilInterface', () => {
    const mockLoadAnvilIngots = jest.fn();
    const mockResetFilters = jest.fn();
    const mockIngots: Ingot[] = [
        {
            id: '1',
            name: 'Experience Ingot',
            type: 'ingot_experience',
        } as Ingot,
        { id: '2', name: 'Education Ingot', type: 'ingot_education' } as Ingot,
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading state correctly', () => {
        (useAnvilInterfaceState as unknown as jest.Mock).mockReturnValue({
            loading: true,
            anvilIngots: [],
            loadAnvilIngots: mockLoadAnvilIngots,
            searchQuery: '',
            typeFilter: 'ALL',
            resetFilters: mockResetFilters,
        });

        render(<AnvilInterface />);

        expect(screen.getByTestId('library-header')).toBeInTheDocument();
        expect(screen.getByTestId('anvil-filters')).toBeInTheDocument();
        expect(screen.getAllByTestId('ingot-card-skeleton')).toHaveLength(6);
        expect(mockLoadAnvilIngots).toHaveBeenCalled();
    });

    it('renders empty state when no ingots exist', () => {
        (useAnvilInterfaceState as unknown as jest.Mock).mockReturnValue({
            loading: false,
            anvilIngots: [],
            loadAnvilIngots: mockLoadAnvilIngots,
            searchQuery: '',
            typeFilter: 'ALL',
            resetFilters: mockResetFilters,
        });

        render(<AnvilInterface />);

        expect(
            screen.getByText("You haven't created any ingots yet.")
        ).toBeInTheDocument();
        expect(screen.getByText('Create your first Ingot')).toBeInTheDocument();
        expect(
            screen.queryByTestId('ingot-card-skeleton')
        ).not.toBeInTheDocument();
        expect(screen.queryByTestId('library-card')).not.toBeInTheDocument();
    });

    it('renders empty search results state', () => {
        (useAnvilInterfaceState as unknown as jest.Mock).mockReturnValue({
            loading: false,
            anvilIngots: mockIngots,
            loadAnvilIngots: mockLoadAnvilIngots,
            searchQuery: 'NonExistent',
            typeFilter: 'ALL',
            resetFilters: mockResetFilters,
        });

        render(<AnvilInterface />);

        expect(
            screen.getByText('No ingots match your filters.')
        ).toBeInTheDocument();
        expect(screen.getByText('Clear Filters')).toBeInTheDocument();
        expect(screen.queryByTestId('library-card')).not.toBeInTheDocument();
    });

    it('renders ingots correctly', () => {
        (useAnvilInterfaceState as unknown as jest.Mock).mockReturnValue({
            loading: false,
            anvilIngots: mockIngots,
            loadAnvilIngots: mockLoadAnvilIngots,
            searchQuery: '',
            typeFilter: 'ALL',
            resetFilters: mockResetFilters,
        });

        render(<AnvilInterface />);

        expect(screen.getAllByTestId('library-card')).toHaveLength(2);
        expect(screen.getByText('Experience Ingot')).toBeInTheDocument();
        expect(screen.getByText('Education Ingot')).toBeInTheDocument();
    });

    it('filters ingots based on search query', () => {
        (useAnvilInterfaceState as unknown as jest.Mock).mockReturnValue({
            loading: false,
            anvilIngots: mockIngots,
            loadAnvilIngots: mockLoadAnvilIngots,
            searchQuery: 'Experience',
            typeFilter: 'ALL',
            resetFilters: mockResetFilters,
        });

        render(<AnvilInterface />);

        expect(screen.getAllByTestId('library-card')).toHaveLength(1);
        expect(screen.getByText('Experience Ingot')).toBeInTheDocument();
        expect(screen.queryByText('Education Ingot')).not.toBeInTheDocument();
    });

    it('filters ingots based on type filter', () => {
        (useAnvilInterfaceState as unknown as jest.Mock).mockReturnValue({
            loading: false,
            anvilIngots: mockIngots,
            loadAnvilIngots: mockLoadAnvilIngots,
            searchQuery: '',
            typeFilter: 'ingot_education',
            resetFilters: mockResetFilters,
        });

        render(<AnvilInterface />);

        expect(screen.getAllByTestId('library-card')).toHaveLength(1);
        expect(screen.getByText('Education Ingot')).toBeInTheDocument();
        expect(screen.queryByText('Experience Ingot')).not.toBeInTheDocument();
    });

    it('calls resetFilters when clear filters button is clicked', () => {
        (useAnvilInterfaceState as unknown as jest.Mock).mockReturnValue({
            loading: false,
            anvilIngots: mockIngots,
            loadAnvilIngots: mockLoadAnvilIngots,
            searchQuery: 'NonExistent',
            typeFilter: 'ALL',
            resetFilters: mockResetFilters,
        });

        render(<AnvilInterface />);
        fireEvent.click(screen.getByText('Clear Filters'));
        expect(mockResetFilters).toHaveBeenCalled();
    });
});
