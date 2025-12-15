import { render, screen, fireEvent } from '@testing-library/react';
import { SectionList } from './section-list';
import { useCvEditorState } from '@/lib/store/use-cv-editor';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('@/lib/store/use-cv-editor');
jest.mock('sonner', () => ({
    toast: {
        warning: jest.fn(),
    },
}));
jest.mock('../forge-components/cv-section-editor-card', () => ({
    __esModule: true,
    default: ({ section }: { section: { sectionType: string } }) => (
        <div data-testid="section-card">{section.sectionType}</div>
    ),
}));

jest.mock('@/lib/classes/helpers/mapping-helpers', () => ({
    getCvSectionsList: () => ['ingot_experience', 'ingot_education'],
    getCvSectionLabelBySectionType: (type: string) => type,
}));

// Mock Select to test interaction
jest.mock('@/ui/shadcn/select', () => ({
    Select: ({
        onValueChange,
        children,
    }: {
        onValueChange: (value: string) => void;
        children: React.ReactNode;
    }) => (
        <div data-testid="select">
            <button
                data-testid="select-trigger"
                onClick={() => onValueChange('ingot_education')}
            >
                Select Education
            </button>
            <button
                data-testid="select-trigger-existing"
                onClick={() => onValueChange('ingot_experience')}
            >
                Select Experience
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

describe('SectionList', () => {
    const mockAddSection = jest.fn();
    const mockCv = {
        cvContent: {
            sections: [{ sectionType: 'ingot_experience' }],
        },
    };

    beforeEach(() => {
        (useCvEditorState as unknown as jest.Mock).mockReturnValue({
            cv: mockCv,
            addSection: mockAddSection,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders section list', () => {
        render(<SectionList />);
        expect(screen.getByText('Sections')).toBeInTheDocument();
        expect(screen.getByTestId('section-card')).toHaveTextContent(
            'ingot_experience'
        );
    });

    it('shows empty state when no sections', () => {
        (useCvEditorState as unknown as jest.Mock).mockReturnValue({
            cv: { cvContent: { sections: [] } },
            addSection: mockAddSection,
        });
        render(<SectionList />);
        expect(screen.getByText(/No sections added yet/i)).toBeInTheDocument();
    });

    it('adds a new section when selected', () => {
        render(<SectionList />);
        fireEvent.click(screen.getByTestId('select-trigger'));
        expect(mockAddSection).toHaveBeenCalledWith('ingot_education');
    });

    it('shows warning if section already exists', () => {
        render(<SectionList />);
        fireEvent.click(screen.getByTestId('select-trigger-existing'));
        expect(toast.warning).toHaveBeenCalled();
        expect(mockAddSection).not.toHaveBeenCalled();
    });
});
