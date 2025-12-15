import { render, screen, fireEvent } from '@testing-library/react';
import { SectionEditor } from './section-editor';
import { useCvEditorState } from '@/lib/store/use-cv-editor';
import IngotHelpers from '@/lib/classes/helpers/ingot-helpers';

// Mock dependencies
jest.mock('@/lib/store/use-cv-editor');
jest.mock('@/lib/classes/helpers/ingot-helpers');
jest.mock('@/lib/classes/helpers/mapping-helpers', () => ({
    getCvSectionLabelBySectionType: () => 'Experience',
}));

jest.mock('../forge-components/cv-section-editor-billet-sort-dropdown', () => ({
    __esModule: true,
    default: () => <div data-testid="sort-dropdown" />,
}));
jest.mock('../forge-components/cv-editor-header', () => ({
    __esModule: true,
    default: () => <div data-testid="editor-header" />,
}));
jest.mock('../forge-components/cv-section-editor-billet', () => ({
    __esModule: true,
    default: () => <div data-testid="editor-billets" />,
}));

describe('SectionEditor', () => {
    const mockToggleIngotInSection = jest.fn();
    const mockSection = {
        sectionType: 'ingot_experience',
        ingotIds: ['ingot1'],
    };
    const mockCv = {
        id: 'cv1',
        cvContent: {
            sections: [mockSection],
        },
    };
    const mockIngot1 = {
        id: 'ingot1',
        name: 'Ingot 1',
        type: 'ingot_experience',
        content: { billets: [{}] },
    };
    const mockIngot2 = {
        id: 'ingot2',
        name: 'Ingot 2',
        type: 'ingot_experience',
        content: { billets: [] },
    };

    beforeEach(() => {
        (useCvEditorState as unknown as jest.Mock).mockReturnValue({
            cv: mockCv,
            activeSectionIndex: 0,
            availableIngots: [mockIngot1, mockIngot2],
            toggleIngotInSection: mockToggleIngotInSection,
        });
        (
            IngotHelpers.checkBilletsCanBeSortedByDate as jest.Mock
        ).mockReturnValue(false);
        (
            IngotHelpers.checkIngotsCanBeSortedByDate as jest.Mock
        ).mockReturnValue(false);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        render(<SectionEditor />);
        expect(screen.getByTestId('editor-header')).toBeInTheDocument();
        expect(screen.getByText('Ingot 1')).toBeInTheDocument();
        expect(screen.getByText('Ingot 2')).toBeInTheDocument();
    });

    it('renders sort dropdowns when applicable', () => {
        (
            IngotHelpers.checkBilletsCanBeSortedByDate as jest.Mock
        ).mockReturnValue(true);
        (
            IngotHelpers.checkIngotsCanBeSortedByDate as jest.Mock
        ).mockReturnValue(true);
        render(<SectionEditor />);
        expect(screen.getAllByTestId('sort-dropdown')).toHaveLength(2);
    });

    it('toggles ingot selection', () => {
        render(<SectionEditor />);
        const checkbox = screen.getByLabelText('Ingot 2');
        fireEvent.click(checkbox);
        expect(mockToggleIngotInSection).toHaveBeenCalledWith(0, 'ingot2');
    });

    it('renders billets for selected ingot', () => {
        render(<SectionEditor />);
        expect(screen.getByTestId('editor-billets')).toBeInTheDocument();
    });

    it('shows empty state when no relevant ingots', () => {
        (useCvEditorState as unknown as jest.Mock).mockReturnValue({
            cv: mockCv,
            activeSectionIndex: 0,
            availableIngots: [],
            toggleIngotInSection: mockToggleIngotInSection,
        });
        render(<SectionEditor />);
        expect(
            screen.getByText(/You haven't created any/i)
        ).toBeInTheDocument();
        expect(screen.getByRole('link')).toHaveAttribute(
            'href',
            expect.stringContaining('/anvil/create')
        );
    });
});
