import { render, screen, fireEvent } from '@testing-library/react';
import { CvHeader } from './cv-header';
import { useCvEditorState } from '@/lib/store/use-cv-editor';

// Mock the store
jest.mock('@/lib/store/use-cv-editor');

describe('CvHeader', () => {
    const mockUpdateMetadata = jest.fn();
    const mockCv = {
        title: 'Test CV',
        description: 'Test Description',
    };

    beforeEach(() => {
        (useCvEditorState as unknown as jest.Mock).mockReturnValue({
            cv: mockCv,
            updateMetadata: mockUpdateMetadata,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        render(<CvHeader />);
        expect(screen.getByLabelText('CV Title')).toHaveValue('Test CV');
        expect(screen.getByLabelText('Description')).toHaveValue(
            'Test Description'
        );
    });

    it('calls updateMetadata when title changes', () => {
        render(<CvHeader />);
        const titleInput = screen.getByLabelText('CV Title');
        fireEvent.change(titleInput, { target: { value: 'New Title' } });
        expect(mockUpdateMetadata).toHaveBeenCalledWith(
            'New Title',
            'Test Description'
        );
    });

    it('calls updateMetadata when description changes', () => {
        render(<CvHeader />);
        const descInput = screen.getByLabelText('Description');
        fireEvent.change(descInput, { target: { value: 'New Description' } });
        expect(mockUpdateMetadata).toHaveBeenCalledWith(
            'Test CV',
            'New Description'
        );
    });

    it('returns null if cv is null', () => {
        (useCvEditorState as unknown as jest.Mock).mockReturnValue({
            cv: null,
            updateMetadata: mockUpdateMetadata,
        });
        const { container } = render(<CvHeader />);
        expect(container).toBeEmptyDOMElement();
    });
});
