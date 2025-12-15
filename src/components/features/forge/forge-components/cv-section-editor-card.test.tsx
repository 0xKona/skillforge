import { render, screen, fireEvent } from '@testing-library/react';
import CvSectionEditorCard from './cv-section-editor-card';
import { useCvEditorState } from '@/lib/store/use-cv-editor';
import { Section } from '@/lib/types/cv-types';

// Mock dependencies
jest.mock('@/lib/store/use-cv-editor');

describe('CvSectionEditorCard', () => {
    const mockRemoveSection = jest.fn();
    const mockSetActiveSection = jest.fn();
    const mockReorderSections = jest.fn();
    const mockSection: Section = {
        sectionType: 'ingot_experience',
        ingotIds: [],
        billetIds: [],
        sortBilletsBy: 'date-desc',
        sortIngotsBy: 'date-desc',
    };
    const mockCv = {
        cvContent: {
            sections: [mockSection, mockSection],
        },
    };

    beforeEach(() => {
        (useCvEditorState as unknown as jest.Mock).mockReturnValue({
            cv: mockCv,
            removeSection: mockRemoveSection,
            setActiveSection: mockSetActiveSection,
            reorderSections: mockReorderSections,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        render(<CvSectionEditorCard section={mockSection} index={0} />);
        expect(screen.getByText('experience')).toBeInTheDocument();
    });

    it('calls setActiveSection when clicked', () => {
        render(<CvSectionEditorCard section={mockSection} index={0} />);
        fireEvent.click(screen.getByText('experience'));
        expect(mockSetActiveSection).toHaveBeenCalledWith(0);
    });

    it('calls removeSection when delete button clicked', () => {
        render(<CvSectionEditorCard section={mockSection} index={0} />);
        // Find the delete button (it has the Trash2 icon, but we can find by role button and index or class)
        // Since we mocked Button in setup.tsx, we can look for the one that calls removeSection
        // But here we need to trigger the click.
        // The delete button is the 3rd button (Up, Down, Delete)
        const buttons = screen.getAllByRole('button');
        const deleteButton = buttons[2];
        fireEvent.click(deleteButton);
        expect(mockRemoveSection).toHaveBeenCalledWith(0);
    });

    it('calls reorderSections when move up clicked', () => {
        render(<CvSectionEditorCard section={mockSection} index={1} />);
        const buttons = screen.getAllByRole('button');
        const moveUpButton = buttons[0];
        fireEvent.click(moveUpButton);
        expect(mockReorderSections).toHaveBeenCalledWith(1, 0);
    });

    it('calls reorderSections when move down clicked', () => {
        render(<CvSectionEditorCard section={mockSection} index={0} />);
        const buttons = screen.getAllByRole('button');
        const moveDownButton = buttons[1];
        fireEvent.click(moveDownButton);
        expect(mockReorderSections).toHaveBeenCalledWith(0, 1);
    });

    it('disables move up button for first item', () => {
        render(<CvSectionEditorCard section={mockSection} index={0} />);
        const buttons = screen.getAllByRole('button');
        expect(buttons[0]).toBeDisabled();
    });

    it('disables move down button for last item', () => {
        render(<CvSectionEditorCard section={mockSection} index={1} />);
        const buttons = screen.getAllByRole('button');
        expect(buttons[1]).toBeDisabled();
    });
});
