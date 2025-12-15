import { render, screen, fireEvent } from '@testing-library/react';
import CvSectionEditorSortDropdown from './cv-section-editor-billet-sort-dropdown';
import { useCvEditorState } from '@/lib/store/use-cv-editor';
import SortingHelpers from '@/lib/classes/helpers/sorting-helpers';
import { Section } from '@/lib/types/cv-types';

// Mock dependencies
jest.mock('@/lib/store/use-cv-editor');
jest.mock('@/lib/classes/helpers/sorting-helpers');

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
                onClick={() => onValueChange('date-asc')}
            >
                Change Sort
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

describe('CvSectionEditorSortDropdown', () => {
    const mockUpdateSection = jest.fn();
    const mockSection: Section = {
        sectionType: 'ingot_experience',
        ingotIds: [],
        billetIds: [],
        sortBilletsBy: 'date-desc',
        sortIngotsBy: 'date-desc',
    };

    beforeEach(() => {
        (useCvEditorState as unknown as jest.Mock).mockReturnValue({
            updateSection: mockUpdateSection,
        });
        (SortingHelpers.getSortOrderOptions as jest.Mock).mockReturnValue([
            'date-desc',
            'date-asc',
        ]);
        (SortingHelpers.getSortOrderLabel as jest.Mock).mockReturnValue(
            'Date Descending'
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly for billets', () => {
        render(
            <CvSectionEditorSortDropdown
                section={mockSection}
                activeSectionIndex={0}
                type="billet"
            />
        );
        expect(screen.getByText('Sort Billets By')).toBeInTheDocument();
    });

    it('renders correctly for ingots', () => {
        render(
            <CvSectionEditorSortDropdown
                section={mockSection}
                activeSectionIndex={0}
                type="ingot"
            />
        );
        expect(screen.getByText('Sort Ingots By')).toBeInTheDocument();
    });

    it('calls updateSection when sort order changes for billets', () => {
        render(
            <CvSectionEditorSortDropdown
                section={mockSection}
                activeSectionIndex={0}
                type="billet"
            />
        );
        fireEvent.click(screen.getByTestId('select-trigger'));
        expect(mockUpdateSection).toHaveBeenCalledWith(0, {
            sortBilletsBy: 'date-asc',
        });
    });

    it('calls updateSection when sort order changes for ingots', () => {
        render(
            <CvSectionEditorSortDropdown
                section={mockSection}
                activeSectionIndex={0}
                type="ingot"
            />
        );
        fireEvent.click(screen.getByTestId('select-trigger'));
        expect(mockUpdateSection).toHaveBeenCalledWith(0, {
            sortIngotsBy: 'date-asc',
        });
    });
});
