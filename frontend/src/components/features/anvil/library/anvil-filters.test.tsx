import { render, screen, fireEvent } from '@testing-library/react';
import AnvilInterfaceFilters from './anvil-filters';
import { useAnvilInterfaceState } from '@/lib/store/use-anvil-interface';
import MappingHelpers from '@/lib/classes/helpers/mapping-helpers';

// Mock dependencies
jest.mock('@/lib/store/use-anvil-interface');
jest.mock('@/lib/classes/helpers/mapping-helpers');

// Mock Select component
jest.mock('@/ui/shadcn/select', () => ({
    Select: ({
        onValueChange,
        children,
    }: {
        onValueChange: (val: string) => void;
        children: React.ReactNode;
    }) => (
        <div data-testid="select">
            <button
                data-testid="select-trigger"
                onClick={() => onValueChange('ingot_experience')}
            >
                Select Type
            </button>
            {children}
        </div>
    ),
    SelectTrigger: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    SelectValue: () => <div>Select Value</div>,
    SelectContent: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    SelectItem: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
}));

describe('AnvilInterfaceFilters', () => {
    const mockSetSearchQuery = jest.fn();
    const mockSetTypeFilter = jest.fn();
    const mockResetFilters = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (MappingHelpers.getIngotTypeList as jest.Mock).mockReturnValue([
            'ingot_experience',
            'ingot_education',
        ]);
        (MappingHelpers.getIngotLabelByType as jest.Mock).mockImplementation(
            (type: string) => {
                if (type === 'ingot_experience') return 'Experience';
                if (type === 'ingot_education') return 'Education';
                return type;
            }
        );
    });

    it('renders search input and select', () => {
        (useAnvilInterfaceState as unknown as jest.Mock).mockReturnValue({
            searchQuery: '',
            typeFilter: 'ALL',
            setSearchQuery: mockSetSearchQuery,
            setTypeFilter: mockSetTypeFilter,
            resetFilters: mockResetFilters,
        });

        render(<AnvilInterfaceFilters />);
        expect(
            screen.getByPlaceholderText('Search ingots...')
        ).toBeInTheDocument();
        expect(screen.getByTestId('select')).toBeInTheDocument();
    });

    it('calls setSearchQuery on input change', () => {
        (useAnvilInterfaceState as unknown as jest.Mock).mockReturnValue({
            searchQuery: '',
            typeFilter: 'ALL',
            setSearchQuery: mockSetSearchQuery,
            setTypeFilter: mockSetTypeFilter,
            resetFilters: mockResetFilters,
        });

        render(<AnvilInterfaceFilters />);
        const input = screen.getByPlaceholderText('Search ingots...');
        fireEvent.change(input, { target: { value: 'test' } });
        expect(mockSetSearchQuery).toHaveBeenCalledWith('test');
    });

    it('calls setTypeFilter on select change', () => {
        (useAnvilInterfaceState as unknown as jest.Mock).mockReturnValue({
            searchQuery: '',
            typeFilter: 'ALL',
            setSearchQuery: mockSetSearchQuery,
            setTypeFilter: mockSetTypeFilter,
            resetFilters: mockResetFilters,
        });

        render(<AnvilInterfaceFilters />);
        fireEvent.click(screen.getByTestId('select-trigger'));
        expect(mockSetTypeFilter).toHaveBeenCalledWith('ingot_experience');
    });

    it('shows reset button when filters are active', () => {
        (useAnvilInterfaceState as unknown as jest.Mock).mockReturnValue({
            searchQuery: 'test',
            typeFilter: 'ALL',
            setSearchQuery: mockSetSearchQuery,
            setTypeFilter: mockSetTypeFilter,
            resetFilters: mockResetFilters,
        });

        render(<AnvilInterfaceFilters />);
        expect(screen.getByText('Reset')).toBeInTheDocument();
    });

    it('shows reset button when type filter is active', () => {
        (useAnvilInterfaceState as unknown as jest.Mock).mockReturnValue({
            searchQuery: '',
            typeFilter: 'ingot_experience',
            setSearchQuery: mockSetSearchQuery,
            setTypeFilter: mockSetTypeFilter,
            resetFilters: mockResetFilters,
        });

        render(<AnvilInterfaceFilters />);
        expect(screen.getByText('Reset')).toBeInTheDocument();
    });

    it('hides reset button when no filters are active', () => {
        (useAnvilInterfaceState as unknown as jest.Mock).mockReturnValue({
            searchQuery: '',
            typeFilter: 'ALL',
            setSearchQuery: mockSetSearchQuery,
            setTypeFilter: mockSetTypeFilter,
            resetFilters: mockResetFilters,
        });

        render(<AnvilInterfaceFilters />);
        expect(screen.queryByText('Reset')).not.toBeInTheDocument();
    });

    it('calls resetFilters when reset button is clicked', () => {
        (useAnvilInterfaceState as unknown as jest.Mock).mockReturnValue({
            searchQuery: 'test',
            typeFilter: 'ALL',
            setSearchQuery: mockSetSearchQuery,
            setTypeFilter: mockSetTypeFilter,
            resetFilters: mockResetFilters,
        });

        render(<AnvilInterfaceFilters />);
        fireEvent.click(screen.getByText('Reset'));
        expect(mockResetFilters).toHaveBeenCalled();
    });
});
