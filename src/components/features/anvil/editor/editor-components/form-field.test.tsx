import { render, screen, fireEvent } from '@testing-library/react';
import { FormField } from './form-field';
import { IngotField } from '@/lib/types/ingot-types';

// Mock Shadcn components
jest.mock('@/ui/shadcn/input', () => ({
    Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
        <input data-testid="mock-input" {...props} />
    ),
}));
jest.mock('@/ui/shadcn/textarea', () => ({
    Textarea: (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
        <textarea data-testid="mock-textarea" {...props} />
    ),
}));
jest.mock('@/ui/shadcn/checkbox', () => ({
    Checkbox: ({
        onCheckedChange,
        checked,
        id,
    }: {
        onCheckedChange: (checked: boolean) => void;
        checked: boolean;
        id: string;
    }) => (
        <input
            type="checkbox"
            data-testid="mock-checkbox"
            id={id}
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
        />
    ),
}));
jest.mock('@/ui/shadcn/select', () => ({
    Select: ({
        onValueChange,
        value,
        children,
    }: {
        onValueChange: (val: string) => void;
        value: string;
        children: React.ReactNode;
    }) => (
        <div
            data-testid="mock-select"
            data-value={value}
            onClick={() => onValueChange('option1')}
        >
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
    SelectItem: ({
        value,
        children,
    }: {
        value: string;
        children: React.ReactNode;
    }) => <div data-value={value}>{children}</div>,
}));
jest.mock('@/ui/shadcn/label', () => ({
    Label: ({
        children,
        htmlFor,
    }: {
        children: React.ReactNode;
        htmlFor: string;
    }) => <label htmlFor={htmlFor}>{children}</label>,
}));

describe('FormField', () => {
    const mockOnChange = jest.fn();
    const baseField: IngotField = {
        value: '',
        inputType: 'text',
        mandatory: false,
        label: 'Test Field',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders text input correctly', () => {
        render(
            <FormField
                fieldKey="testField"
                field={baseField}
                value="test value"
                onChange={mockOnChange}
            />
        );
        expect(screen.getByLabelText('Test Field')).toBeInTheDocument();
        expect(screen.getByTestId('mock-input')).toHaveValue('test value');
    });

    it('renders textarea correctly', () => {
        render(
            <FormField
                fieldKey="testArea"
                field={{ ...baseField, inputType: 'textarea' }}
                value="area value"
                onChange={mockOnChange}
            />
        );
        expect(screen.getByTestId('mock-textarea')).toHaveValue('area value');
    });

    it('renders select correctly', () => {
        render(
            <FormField
                fieldKey="testSelect"
                field={{
                    ...baseField,
                    inputType: 'select',
                    options: ['opt1', 'opt2'],
                }}
                value="opt1"
                onChange={mockOnChange}
            />
        );
        expect(screen.getByTestId('mock-select')).toBeInTheDocument();
    });

    it('handles checkbox for endDate', () => {
        render(
            <FormField
                fieldKey="endDate"
                field={baseField}
                value="2023-01-01"
                onChange={mockOnChange}
            />
        );
        const checkbox = screen.getByTestId('mock-checkbox');
        fireEvent.click(checkbox);
        expect(mockOnChange).toHaveBeenCalledWith('endDate', 'Current');
    });

    it('handles unchecking checkbox for endDate', () => {
        render(
            <FormField
                fieldKey="endDate"
                field={baseField}
                value="Current"
                onChange={mockOnChange}
            />
        );
        const checkbox = screen.getByTestId('mock-checkbox');
        fireEvent.click(checkbox);
        // Should call with today's date
        expect(mockOnChange).toHaveBeenCalledWith(
            'endDate',
            expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/)
        );
    });
});
