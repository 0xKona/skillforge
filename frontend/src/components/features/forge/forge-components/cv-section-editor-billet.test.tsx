import { render, screen, fireEvent } from '@testing-library/react';
import CvSectionEditorBillets from './cv-section-editor-billet';
import { useCvEditorState } from '@/lib/store/use-cv-editor';
import { BilletHelper } from '@/lib/classes/helpers/billet-helpers';
import { Section } from '@/lib/types/cv-types';
import { Ingot, Billet } from '@/lib/types/ingot-types';

// Mock dependencies
jest.mock('@/lib/store/use-cv-editor');
jest.mock('@/lib/classes/helpers/billet-helpers');

describe('CvSectionEditorBillets', () => {
    const mockToggleBillet = jest.fn();
    const mockSection: Section = {
        sectionType: 'ingot_experience',
        ingotIds: [],
        billetIds: ['billet1'],
        sortBilletsBy: 'date-desc',
        sortIngotsBy: 'date-desc',
    };
    const mockIngot: Ingot = {
        id: 'ingot1',
        name: 'Ingot 1',
        type: 'experience',
        content: {
            billets: [
                { id: 'billet1', fields: { title: { value: 'Job 1' } } },
                { id: 'billet2', fields: { title: { value: 'Job 2' } } },
            ],
        },
    } as unknown as Ingot;

    beforeEach(() => {
        (useCvEditorState as unknown as jest.Mock).mockReturnValue({
            activeSectionIndex: 0,
            toggleBillet: mockToggleBillet,
        });
        (BilletHelper.sortBillets as jest.Mock).mockReturnValue(
            mockIngot.content.billets
        );
        (BilletHelper.getBilletFieldNames as jest.Mock).mockReturnValue([
            'title',
        ]);
        (BilletHelper.getBilletDisplayName as jest.Mock).mockImplementation(
            (b: Billet) => b.fields.title.value
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        render(
            <CvSectionEditorBillets ingot={mockIngot} section={mockSection} />
        );
        expect(screen.getByText('Include Items')).toBeInTheDocument();
        expect(screen.getByText('2 available')).toBeInTheDocument();
        expect(screen.getByText('Job 1')).toBeInTheDocument();
        expect(screen.getByText('Job 2')).toBeInTheDocument();
    });

    it('returns null if activeSectionIndex is null', () => {
        (useCvEditorState as unknown as jest.Mock).mockReturnValue({
            activeSectionIndex: null,
            toggleBillet: mockToggleBillet,
        });
        const { container } = render(
            <CvSectionEditorBillets ingot={mockIngot} section={mockSection} />
        );
        expect(container).toBeEmptyDOMElement();
    });

    it('calls toggleBillet when a billet is clicked', () => {
        render(
            <CvSectionEditorBillets ingot={mockIngot} section={mockSection} />
        );
        fireEvent.click(screen.getByText('Job 2'));
        expect(mockToggleBillet).toHaveBeenCalledWith(0, 'billet2');
    });

    it('shows selected state correctly', () => {
        render(
            <CvSectionEditorBillets ingot={mockIngot} section={mockSection} />
        );
        const checkboxes = screen.getAllByTestId('checkbox');
        expect(checkboxes[0]).toBeChecked(); // billet1 is in billetIds
        expect(checkboxes[1]).not.toBeChecked(); // billet2 is not
    });
});
