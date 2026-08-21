import { render, screen, fireEvent } from '@testing-library/react';
import BilletEditor from './billet-editor';
import { Billet } from '@/lib/types/ingot-types';

// Mock dependencies
jest.mock('@/lib/templates/ingot-templates', () => ({
    BILLET_TEMPLATES: {
        'test-type': {
            type: 'test-type',
            fields: {
                field1: { mandatory: true, value: '', inputType: 'text' },
            },
        },
    },
}));

// Mock child components
jest.mock('./editor-components/billet-list', () => ({
    BilletList: ({
        onEdit,
        onDelete,
        billets,
    }: {
        onEdit: (b: { id: string }) => void;
        onDelete: (id: string) => void;
        billets: { id: string }[];
    }) => (
        <div data-testid="billet-list">
            {billets.map((b) => (
                <div key={b.id} data-testid={`billet-${b.id}`}>
                    <button onClick={() => onEdit(b)}>Edit {b.id}</button>
                    <button onClick={() => onDelete(b.id)}>
                        Delete {b.id}
                    </button>
                </div>
            ))}
        </div>
    ),
}));

jest.mock('./editor-components/billet-form', () => ({
    BilletForm: ({
        onSave,
        onCancel,
    }: {
        onSave: (data: unknown) => void;
        onCancel: () => void;
    }) => (
        <div data-testid="billet-form">
            <button onClick={() => onSave({ field1: { value: 'saved' } })}>
                Save
            </button>
            <button onClick={onCancel}>Cancel</button>
        </div>
    ),
}));

describe('BilletEditor', () => {
    const mockOnChange = jest.fn();
    const mockBillets: Billet[] = [
        {
            id: '1',
            type: 'test-type',
            fields: {
                field1: { value: 'val1', mandatory: true, inputType: 'text' },
            },
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        render(
            <BilletEditor
                billets={mockBillets}
                activeType="test-type"
                onChange={mockOnChange}
            />
        );
        expect(screen.getByText('Billets')).toBeInTheDocument();
        expect(screen.getByTestId('billet-list')).toBeInTheDocument();
        expect(screen.getByText('Add')).toBeInTheDocument();
    });

    it('starts adding a billet', () => {
        render(
            <BilletEditor
                billets={mockBillets}
                activeType="test-type"
                onChange={mockOnChange}
            />
        );
        fireEvent.click(screen.getByText('Add'));
        expect(screen.getByTestId('billet-form')).toBeInTheDocument();
        expect(screen.queryByText('Add')).not.toBeInTheDocument();
    });

    it('cancels adding a billet', () => {
        render(
            <BilletEditor
                billets={mockBillets}
                activeType="test-type"
                onChange={mockOnChange}
            />
        );
        fireEvent.click(screen.getByText('Add'));
        fireEvent.click(screen.getByText('Cancel'));
        expect(screen.queryByTestId('billet-form')).not.toBeInTheDocument();
        expect(screen.getByText('Add')).toBeInTheDocument();
    });

    it('saves a new billet', () => {
        render(
            <BilletEditor
                billets={mockBillets}
                activeType="test-type"
                onChange={mockOnChange}
            />
        );
        fireEvent.click(screen.getByText('Add'));
        fireEvent.click(screen.getByText('Save'));

        expect(mockOnChange).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({ id: '1' }),
                expect.objectContaining({ type: 'test-type' }),
            ])
        );
        // The new billet will have a random UUID, so we check array length or partial match
        const calls = mockOnChange.mock.calls[0][0];
        expect(calls).toHaveLength(2);
    });

    it('starts editing a billet', () => {
        render(
            <BilletEditor
                billets={mockBillets}
                activeType="test-type"
                onChange={mockOnChange}
            />
        );
        fireEvent.click(screen.getByText('Edit 1'));
        expect(screen.getByTestId('billet-form')).toBeInTheDocument();
    });

    it('saves an edited billet', () => {
        render(
            <BilletEditor
                billets={mockBillets}
                activeType="test-type"
                onChange={mockOnChange}
            />
        );
        fireEvent.click(screen.getByText('Edit 1'));
        fireEvent.click(screen.getByText('Save'));

        expect(mockOnChange).toHaveBeenCalledWith([
            expect.objectContaining({
                id: '1',
                fields: { field1: { value: 'saved' } },
            }),
        ]);
    });

    it('deletes a billet', () => {
        render(
            <BilletEditor
                billets={mockBillets}
                activeType="test-type"
                onChange={mockOnChange}
            />
        );
        fireEvent.click(screen.getByText('Delete 1'));
        expect(mockOnChange).toHaveBeenCalledWith([]);
    });
});
