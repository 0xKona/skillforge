import { render, screen, fireEvent } from '@testing-library/react';
import { CvEditor } from './cv-editor';
import { useCvEditorState } from '@/lib/store/use-cv-editor';
import { useIsMobile } from '@/hooks/use-is-mobile';

// Mock dependencies
jest.mock('@/lib/store/use-cv-editor');
jest.mock('@/hooks/use-is-mobile');
jest.mock('@/hooks/use-cv-auto-save', () => ({
    useCvAutoSave: jest.fn(),
}));

// Mock child components
jest.mock('./cv-header', () => ({
    CvHeader: () => <div data-testid="cv-header" />,
}));
jest.mock('./section-list', () => ({
    SectionList: () => <div data-testid="section-list" />,
}));
jest.mock('./section-editor', () => ({
    SectionEditor: () => <div data-testid="section-editor" />,
}));
jest.mock('../../pdf/cv-preview', () => ({
    CvPreview: () => <div data-testid="cv-preview" />,
}));
jest.mock('../forge-components/cv-validation-error', () => ({
    __esModule: true,
    default: () => <div data-testid="validation-error" />,
}));
jest.mock('../forge-components/cv-editor-skeleton', () => ({
    __esModule: true,
    default: () => <div data-testid="editor-skeleton" />,
}));

describe('CvEditor', () => {
    const mockInitializeEditor = jest.fn();
    const mockResetState = jest.fn();
    const mockSaveCv = jest.fn();
    const mockCv = {
        cvContent: { sections: [] },
    };

    beforeEach(() => {
        (useCvEditorState as unknown as jest.Mock).mockReturnValue({
            initializeEditor: mockInitializeEditor,
            loading: false,
            saving: false,
            saveCv: mockSaveCv,
            cv: mockCv,
            activeSectionIndex: null,
            resetState: mockResetState,
            availableIngots: [],
        });
        (useIsMobile as jest.Mock).mockReturnValue(false);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('initializes editor on mount', () => {
        render(<CvEditor cvId="123" />);
        expect(mockInitializeEditor).toHaveBeenCalledWith('123');
    });

    it('resets state on unmount', () => {
        const { unmount } = render(<CvEditor cvId="123" />);
        unmount();
        expect(mockResetState).toHaveBeenCalled();
    });

    it('renders skeleton when loading', () => {
        (useCvEditorState as unknown as jest.Mock).mockReturnValue({
            loading: true,
            initializeEditor: mockInitializeEditor,
            resetState: mockResetState,
        });
        render(<CvEditor cvId="123" />);
        expect(screen.getByTestId('editor-skeleton')).toBeInTheDocument();
    });

    it('renders editor content when loaded', () => {
        render(<CvEditor cvId="123" />);
        expect(screen.getByTestId('cv-header')).toBeInTheDocument();
        expect(screen.getByTestId('section-list')).toBeInTheDocument(); // activeSectionIndex is null
        expect(screen.getByTestId('cv-preview')).toBeInTheDocument();
    });

    it('renders section editor when activeSectionIndex is set', () => {
        (useCvEditorState as unknown as jest.Mock).mockReturnValue({
            initializeEditor: mockInitializeEditor,
            loading: false,
            saving: false,
            saveCv: mockSaveCv,
            cv: mockCv,
            activeSectionIndex: 0,
            resetState: mockResetState,
            availableIngots: [],
        });
        render(<CvEditor cvId="123" />);
        expect(screen.getByTestId('section-editor')).toBeInTheDocument();
        expect(screen.queryByTestId('section-list')).not.toBeInTheDocument();
    });

    it('renders mobile layout', () => {
        (useIsMobile as jest.Mock).mockReturnValue(true);
        render(<CvEditor cvId="123" />);
        expect(screen.getByTestId('tabs-list')).toBeInTheDocument();
    });

    it('calls saveCv when save button clicked', () => {
        render(<CvEditor cvId="123" />);
        fireEvent.click(screen.getByText('Save & Close'));
        expect(mockSaveCv).toHaveBeenCalled();
    });
});
