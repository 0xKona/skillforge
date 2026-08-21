import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FormTextarea from './form-textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Mock Shadcn components
jest.mock('@/ui/shadcn/label', () => ({
    Label: ({
        children,
        htmlFor,
        ...props
    }: {
        children: React.ReactNode;
        htmlFor: string;
    }) => (
        <label htmlFor={htmlFor} {...props}>
            {children}
        </label>
    ),
}));

jest.mock('@/ui/shadcn/textarea', () => ({
    Textarea: ({
        id,
        placeholder,
        disabled,
        className,
        onChange,
        value,
        ...props
    }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
        <textarea
            id={id}
            placeholder={placeholder}
            disabled={disabled}
            className={className}
            onChange={onChange}
            value={value}
            {...props}
        />
    ),
}));

const TestWrapper = ({
    defaultValues = { testField: '' },
    validationSchema = z.object({ testField: z.string() }),
    props = {},
}: {
    defaultValues?: { testField: string };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validationSchema?: z.ZodType<any, any, any>;
    props?: Partial<React.ComponentProps<typeof FormTextarea>>;
}) => {
    const form = useForm({
        defaultValues,
        resolver: zodResolver(validationSchema),
        mode: 'onChange',
    });

    return (
        <FormTextarea
            form={form}
            id="test-textarea"
            inputName="testField"
            label="Test Label"
            placeholder="Test Placeholder"
            {...props}
        />
    );
};

describe('FormTextarea', () => {
    it('renders correctly', () => {
        render(<TestWrapper />);
        expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText('Test Placeholder')
        ).toBeInTheDocument();
    });

    it('handles input change', async () => {
        render(<TestWrapper />);
        const textarea = screen.getByPlaceholderText('Test Placeholder');
        fireEvent.change(textarea, { target: { value: 'New Value' } });
        expect(textarea).toHaveValue('New Value');
    });

    it('displays error message', async () => {
        const schema = z.object({
            testField: z.string().min(5, 'Too short'),
        });

        render(<TestWrapper validationSchema={schema} />);
        const textarea = screen.getByPlaceholderText('Test Placeholder');

        fireEvent.change(textarea, { target: { value: 'abc' } });

        await waitFor(() => {
            expect(screen.getByText('Too short')).toBeInTheDocument();
        });
    });

    it('is disabled when disabled prop is true', () => {
        render(<TestWrapper props={{ disabled: true }} />);
        expect(screen.getByPlaceholderText('Test Placeholder')).toBeDisabled();
    });
});
