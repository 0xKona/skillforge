import { render, screen, fireEvent } from '@testing-library/react';
import CvLibrarySearch from './cv-library-search';
import { useCvInterfaceState } from '@/lib/store/use-cv-interface';

// Mock dependencies
jest.mock('@/lib/store/use-cv-interface');

describe('CvLibrarySearch', () => {
    const mockSetSearchQuery = jest.fn();

    beforeEach(() => {
        (useCvInterfaceState as unknown as jest.Mock).mockReturnValue({
            searchQuery: '',
            setSearchQuery: mockSetSearchQuery,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders input correctly', () => {
        render(<CvLibrarySearch />);
        expect(
            screen.getByPlaceholderText('Search CVs...')
        ).toBeInTheDocument();
    });

    it('calls setSearchQuery on input change', () => {
        render(<CvLibrarySearch />);
        const input = screen.getByPlaceholderText('Search CVs...');
        fireEvent.change(input, { target: { value: 'test' } });
        expect(mockSetSearchQuery).toHaveBeenCalledWith('test');
    });

    it('shows reset button when searchQuery is present', () => {
        (useCvInterfaceState as unknown as jest.Mock).mockReturnValue({
            searchQuery: 'test',
            setSearchQuery: mockSetSearchQuery,
        });
        render(<CvLibrarySearch />);
        expect(screen.getByText('Reset')).toBeInTheDocument();
    });

    it('calls setSearchQuery("") when reset button is clicked', () => {
        (useCvInterfaceState as unknown as jest.Mock).mockReturnValue({
            searchQuery: 'test',
            setSearchQuery: mockSetSearchQuery,
        });
        render(<CvLibrarySearch />);
        fireEvent.click(screen.getByText('Reset'));
        expect(mockSetSearchQuery).toHaveBeenCalledWith('');
    });
});
