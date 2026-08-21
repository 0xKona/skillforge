import { render, screen } from '@testing-library/react';
import CvValidationError from './cv-validation-error';
import { useCvEditorState } from '@/lib/store/use-cv-editor';

// Mock dependencies
jest.mock('@/lib/store/use-cv-editor');

describe('CvValidationError', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders nothing when no errors', () => {
        (useCvEditorState as unknown as jest.Mock).mockReturnValue({
            validationErrors: [],
        });
        const { container } = render(<CvValidationError />);
        expect(container).toBeEmptyDOMElement();
    });

    it('renders errors when present', () => {
        (useCvEditorState as unknown as jest.Mock).mockReturnValue({
            validationErrors: ['Error 1', 'Error 2'],
        });
        render(<CvValidationError />);
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText('Error 1')).toBeInTheDocument();
        expect(screen.getByText('Error 2')).toBeInTheDocument();
    });
});
