import { render, screen, fireEvent } from '@testing-library/react';
import CvLibraryInterface from './cv-library';
import { useCvInterfaceState } from '@/lib/store/use-cv-interface';
import { CV } from '@/lib/types/cv-types';

// Mock dependencies
jest.mock('@/lib/store/use-cv-interface');

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

jest.mock('./forge-components/cv-library-search', () => ({
    __esModule: true,
    default: () => <div data-testid="cv-library-search">Search Component</div>,
}));

jest.mock('@/widgets/library-card', () => ({
    __esModule: true,
    default: ({ cardData }: { cardData: CV }) => (
        <div data-testid="library-card">{cardData.title}</div>
    ),
}));

jest.mock('./forge-components/cv-card-skeleton', () => ({
    __esModule: true,
    default: () => <div data-testid="cv-card-skeleton">Skeleton</div>,
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

describe('CvLibraryInterface', () => {
    const mockLoadCvs = jest.fn();
    const mockCvs: CV[] = [
        { id: '1', title: 'Software Engineer CV' } as CV,
        { id: '2', title: 'Project Manager CV' } as CV,
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading state correctly', () => {
        (useCvInterfaceState as unknown as jest.Mock).mockReturnValue({
            loading: true,
            cvs: [],
            loadCvs: mockLoadCvs,
            searchQuery: '',
        });

        render(<CvLibraryInterface />);

        expect(screen.getByTestId('library-header')).toBeInTheDocument();
        expect(screen.getByTestId('cv-library-search')).toBeInTheDocument();
        expect(screen.getAllByTestId('cv-card-skeleton')).toHaveLength(6);
        expect(mockLoadCvs).toHaveBeenCalled();
    });

    it('renders empty state when no CVs exist', () => {
        (useCvInterfaceState as unknown as jest.Mock).mockReturnValue({
            loading: false,
            cvs: [],
            loadCvs: mockLoadCvs,
            searchQuery: '',
        });

        render(<CvLibraryInterface />);

        expect(
            screen.getByText("You haven't created any CVs yet.")
        ).toBeInTheDocument();
        expect(screen.getByText('Create your first CV')).toBeInTheDocument();
        expect(
            screen.queryByTestId('cv-card-skeleton')
        ).not.toBeInTheDocument();
        expect(screen.queryByTestId('library-card')).not.toBeInTheDocument();
    });

    it('renders empty search results state', () => {
        (useCvInterfaceState as unknown as jest.Mock).mockReturnValue({
            loading: false,
            cvs: mockCvs,
            loadCvs: mockLoadCvs,
            searchQuery: 'NonExistent',
        });

        render(<CvLibraryInterface />);

        expect(
            screen.getByText('No CVs match your search.')
        ).toBeInTheDocument();
        expect(
            screen.queryByText('Create your first CV')
        ).not.toBeInTheDocument();
        expect(screen.queryByTestId('library-card')).not.toBeInTheDocument();
    });

    it('renders CVs correctly', () => {
        (useCvInterfaceState as unknown as jest.Mock).mockReturnValue({
            loading: false,
            cvs: mockCvs,
            loadCvs: mockLoadCvs,
            searchQuery: '',
        });

        render(<CvLibraryInterface />);

        expect(screen.getAllByTestId('library-card')).toHaveLength(2);
        expect(screen.getByText('Software Engineer CV')).toBeInTheDocument();
        expect(screen.getByText('Project Manager CV')).toBeInTheDocument();
    });

    it('filters CVs based on search query', () => {
        (useCvInterfaceState as unknown as jest.Mock).mockReturnValue({
            loading: false,
            cvs: mockCvs,
            loadCvs: mockLoadCvs,
            searchQuery: 'Software',
        });

        render(<CvLibraryInterface />);

        expect(screen.getAllByTestId('library-card')).toHaveLength(1);
        expect(screen.getByText('Software Engineer CV')).toBeInTheDocument();
        expect(
            screen.queryByText('Project Manager CV')
        ).not.toBeInTheDocument();
    });

    it('calls loadCvs on mount and refresh', () => {
        (useCvInterfaceState as unknown as jest.Mock).mockReturnValue({
            loading: false,
            cvs: [],
            loadCvs: mockLoadCvs,
            searchQuery: '',
        });

        render(<CvLibraryInterface />);

        // Called on mount
        expect(mockLoadCvs).toHaveBeenCalledTimes(1);

        // Call refresh via header mock
        fireEvent.click(screen.getByText('Refresh'));
        expect(mockLoadCvs).toHaveBeenCalledTimes(2);
    });
});
