import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import IngotEditor from './ingot-editor';
import { useIngotEditorState } from '@/lib/store/use-ingot-editor';
import { useIngotPreviewState } from '@/lib/store/use-ingot-preview';
import { IngotEditorData } from '@/lib/types/ingot-types';
import MappingHelpers from '@/lib/classes/helpers/mapping-helpers';

// Mock dependencies
jest.mock('@/lib/store/use-ingot-editor');
jest.mock('@/lib/store/use-ingot-preview');
jest.mock('@/lib/classes/helpers/mapping-helpers');
jest.mock('@/lib/templates/ingot-templates', () => ({
    INGOT_TEMPLATES: {
        ingot_experience: {
            type: 'ingot_experience',
            content: {
                billetFormat: 'billet_exp_job',
                fields: {},
            },
        },
    },
}));
jest.mock('@/lib/classes/helpers/ingot-form-helpers', () => ({
    IngotFormHelper: {
        getIngotFieldValues: jest.fn().mockReturnValue({}),
    },
}));

// Mock child components
jest.mock('./editor-components/editor-header', () => ({
    EditorHeader: ({
        title,
        onSave,
        onPreview,
    }: {
        title: string;
        onSave: () => void;
        onPreview: () => void;
    }) => (
        <div data-testid="editor-header">
            <h1>{title}</h1>
            <button onClick={onSave}>Save</button>
            <button onClick={onPreview}>Preview</button>
        </div>
    ),
    EditorFooter: ({ onSave }: { onSave: () => void }) => (
        <div data-testid="editor-footer">
            <button onClick={onSave}>Footer Save</button>
        </div>
    ),
}));

jest.mock('./editor-components/ingot-details', () => ({
    IngotDetails: () => <div data-testid="ingot-details">Ingot Details</div>,
}));

jest.mock('./editor-components/billet-section', () => ({
    BilletSection: () => <div data-testid="billet-section">Billet Section</div>,
}));

jest.mock('./ingot-editor-skeleton', () => ({
    __esModule: true,
    default: () => <div data-testid="ingot-editor-skeleton">Skeleton</div>,
}));

jest.mock('@/components/features/pdf/ingot-preview-modal', () => ({
    __esModule: true,
    default: () => <div data-testid="preview-modal">Preview Modal</div>,
}));

// Mock Tabs
jest.mock('@/ui/animate-ui/animate/tabs', () => ({
    Tabs: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    TabsList: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    TabsContents: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    TabsContent: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
}));
jest.mock('@/ui/animate-ui/components/animate/tabs', () => ({
    TabsTrigger: ({ children }: { children: React.ReactNode }) => (
        <button>{children}</button>
    ),
}));

// Mock navigation
jest.mock('next/navigation', () => ({
    redirect: jest.fn(),
}));

describe('IngotEditor', () => {
    const mockInitialize = jest.fn();
    const mockInitializeNewIngot = jest.fn();
    const mockSaveIngot = jest.fn();
    const mockOpenPreviewModal = jest.fn();

    const mockIngotData: IngotEditorData = {
        name: 'Test Ingot',
        type: 'ingot_experience',
        content: {
            fields: {},
            billets: [],
            billetFormat: 'billet_exp_job',
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (MappingHelpers.getIngotLabelByType as jest.Mock).mockReturnValue(
            'Experience'
        );
        (useIngotEditorState as unknown as jest.Mock).mockReturnValue({
            isLoading: false,
            ingotData: mockIngotData,
            errors: {},
            initialize: mockInitialize,
            initializeNewIngot: mockInitializeNewIngot,
            setIngotName: jest.fn(),
            handleContentChange: jest.fn(),
            handleBilletsChange: jest.fn(),
            saveIngot: mockSaveIngot,
        });
        (useIngotPreviewState as unknown as jest.Mock).mockReturnValue({
            showPreviewModal: false,
            openPreviewModal: mockOpenPreviewModal,
        });
    });

    it('renders skeleton when loading', () => {
        (useIngotEditorState as unknown as jest.Mock).mockReturnValue({
            isLoading: true,
            ingotData: { ...mockIngotData, type: '' }, // No type means no template
            initialize: mockInitialize,
            initializeNewIngot: mockInitializeNewIngot,
            setIngotName: jest.fn(),
            handleContentChange: jest.fn(),
            handleBilletsChange: jest.fn(),
            saveIngot: mockSaveIngot,
        });
        render(<IngotEditor initialIngotData={mockIngotData} />);
        expect(screen.getByTestId('ingot-editor-skeleton')).toBeInTheDocument();
    });

    it('renders editor content when loaded', () => {
        render(<IngotEditor initialIngotData={mockIngotData} />);
        expect(screen.getByTestId('editor-header')).toBeInTheDocument();
        expect(screen.getAllByTestId('ingot-details').length).toBeGreaterThan(
            0
        );
        expect(screen.getAllByTestId('billet-section').length).toBeGreaterThan(
            0
        );
        expect(screen.getByTestId('editor-footer')).toBeInTheDocument();
    });

    it('initializes data on mount', () => {
        render(<IngotEditor initialIngotData={mockIngotData} />);
        expect(mockInitialize).toHaveBeenCalledWith(mockIngotData);
    });

    it('calls saveIngot when save button is clicked', async () => {
        mockSaveIngot.mockResolvedValue(true);
        render(<IngotEditor initialIngotData={mockIngotData} />);
        fireEvent.click(screen.getByText('Save'));
        expect(mockSaveIngot).toHaveBeenCalled();
    });

    it('opens preview modal', () => {
        render(<IngotEditor initialIngotData={mockIngotData} />);
        fireEvent.click(screen.getByText('Preview'));
        expect(mockOpenPreviewModal).toHaveBeenCalled();
    });

    it('renders preview modal when showPreviewModal is true', () => {
        (useIngotPreviewState as unknown as jest.Mock).mockReturnValue({
            showPreviewModal: true,
            openPreviewModal: mockOpenPreviewModal,
        });
        render(<IngotEditor initialIngotData={mockIngotData} />);
        expect(screen.getByTestId('preview-modal')).toBeInTheDocument();
    });

    it('renders error when template is missing', () => {
        (useIngotEditorState as unknown as jest.Mock).mockReturnValue({
            isLoading: false,
            ingotData: { ...mockIngotData, type: 'unknown_type' },
            initialize: mockInitialize,
            initializeNewIngot: mockInitializeNewIngot,
            setIngotName: jest.fn(),
            handleContentChange: jest.fn(),
            handleBilletsChange: jest.fn(),
            saveIngot: mockSaveIngot,
        });
        render(<IngotEditor initialIngotData={mockIngotData} />);
        expect(
            screen.getByText(/Error: Ingot Type Template not found/)
        ).toBeInTheDocument();
    });
});
