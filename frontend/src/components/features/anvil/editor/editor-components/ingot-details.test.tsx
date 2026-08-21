import { render, screen, fireEvent } from '@testing-library/react';
import { IngotDetails } from './ingot-details';

jest.mock('./dynamic-form', () => ({
    __esModule: true,
    default: () => <div data-testid="dynamic-form">Dynamic Form</div>,
}));

jest.mock('@/ui/shadcn/card', () => ({
    Card: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    CardHeader: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    CardTitle: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    CardContent: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
}));

jest.mock('@/ui/shadcn/input', () => ({
    Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
        <input data-testid="name-input" {...props} />
    ),
}));
jest.mock('@/ui/shadcn/label', () => ({
    Label: ({ children }: { children: React.ReactNode }) => (
        <label>{children}</label>
    ),
}));

describe('IngotDetails', () => {
    const mockOnNameChange = jest.fn();
    const mockOnFieldChange = jest.fn();

    it('renders correctly', () => {
        render(
            <IngotDetails
                ingotName="Test Ingot"
                onNameChange={mockOnNameChange}
                fields={{}}
                values={{}}
                onFieldChange={mockOnFieldChange}
            />
        );

        expect(screen.getByDisplayValue('Test Ingot')).toBeInTheDocument();
        expect(screen.getByTestId('dynamic-form')).toBeInTheDocument();
    });

    it('calls onNameChange', () => {
        render(
            <IngotDetails
                ingotName="Test Ingot"
                onNameChange={mockOnNameChange}
                fields={{}}
                values={{}}
                onFieldChange={mockOnFieldChange}
            />
        );

        fireEvent.change(screen.getByTestId('name-input'), {
            target: { value: 'New Name' },
        });
        expect(mockOnNameChange).toHaveBeenCalledWith('New Name');
    });
});
