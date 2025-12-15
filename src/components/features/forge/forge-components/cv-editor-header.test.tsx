import { render, screen, fireEvent } from '@testing-library/react';
import CvEditorHeader from './cv-editor-header';
import { useCvEditorState } from '@/lib/store/use-cv-editor';
import MappingHelpers from '@/lib/classes/helpers/mapping-helpers';

// Mock dependencies
jest.mock('@/lib/store/use-cv-editor');
jest.mock('@/lib/classes/helpers/mapping-helpers');

describe('CvEditorHeader', () => {
    const mockSetActiveSection = jest.fn();
    const mockSection = {
        sectionType: 'ingot_experience',
        ingotIds: [],
        billetIds: [],
        sortBilletsBy: 'date-desc',
        sortIngotsBy: 'date-desc',
    };

    beforeEach(() => {
        (useCvEditorState as unknown as jest.Mock).mockReturnValue({
            setActiveSection: mockSetActiveSection,
        });
        (
            MappingHelpers.getCvSectionLabelBySectionType as jest.Mock
        ).mockReturnValue('Experience');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        render(<CvEditorHeader section={mockSection as any} />);
        expect(screen.getByText('Edit Experience section')).toBeInTheDocument();
    });

    it('calls setActiveSection(null) when back button is clicked', () => {
        render(<CvEditorHeader section={mockSection as any} />);
        const backButton = screen.getByRole('button');
        fireEvent.click(backButton);
        expect(mockSetActiveSection).toHaveBeenCalledWith(null);
    });
});
