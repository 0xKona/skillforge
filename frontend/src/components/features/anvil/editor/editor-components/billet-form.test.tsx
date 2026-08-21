import { render, screen, fireEvent } from '@testing-library/react';
import { BilletForm } from './billet-form';
import { generateSchemaFromIngotFields } from '@/lib/zod-form-schemas/ingot-form-generator';
import { toast } from 'sonner';
import { BilletTemplate } from '@/lib/types/ingot-types';

jest.mock('./dynamic-form', () => ({
    __esModule: true,
    default: ({
        onChange,
    }: {
        onChange: (key: string, val: string) => void;
    }) => (
        <div data-testid="dynamic-form">
            <button onClick={() => onChange('field1', 'new value')}>
                Change Field
            </button>
        </div>
    ),
}));

jest.mock('@/lib/zod-form-schemas/ingot-form-generator');
jest.mock('sonner');

describe('BilletForm', () => {
    const mockOnSave = jest.fn();
    const mockOnCancel = jest.fn();
    const mockTemplate: BilletTemplate = {
        type: 'test',
        fields: {
            field1: { value: '', inputType: 'text', mandatory: false },
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (generateSchemaFromIngotFields as jest.Mock).mockReturnValue({
            safeParse: jest.fn().mockReturnValue({ success: true }),
        });
    });

    it('renders and handles save', () => {
        render(
            <BilletForm
                template={mockTemplate}
                initialFields={mockTemplate.fields}
                type="test"
                isAdding={true}
                onSave={mockOnSave}
                onCancel={mockOnCancel}
            />
        );

        fireEvent.click(screen.getByText('Add'));
        expect(mockOnSave).toHaveBeenCalled();
    });

    it('handles validation error', () => {
        (generateSchemaFromIngotFields as jest.Mock).mockReturnValue({
            safeParse: jest.fn().mockReturnValue({
                success: false,
                error: { issues: [{ path: ['field1'], message: 'Error' }] },
            }),
        });

        render(
            <BilletForm
                template={mockTemplate}
                initialFields={mockTemplate.fields}
                type="test"
                isAdding={true}
                onSave={mockOnSave}
                onCancel={mockOnCancel}
            />
        );

        fireEvent.click(screen.getByText('Add'));
        expect(mockOnSave).not.toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalled();
    });

    it('handles cancel', () => {
        render(
            <BilletForm
                template={mockTemplate}
                initialFields={mockTemplate.fields}
                type="test"
                isAdding={true}
                onSave={mockOnSave}
                onCancel={mockOnCancel}
            />
        );

        fireEvent.click(screen.getByText('Cancel'));
        expect(mockOnCancel).toHaveBeenCalled();
    });
});
