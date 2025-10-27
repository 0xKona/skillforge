import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormInput from './form-input';
import { useForm } from 'react-hook-form';

interface SetupProps {
    id: string;
    inputName: string;
    placeholder: string;
    label: string;
    type?: 'email' | 'text' | 'password';
    disabled?: boolean;
}

const TEST_ID = 'test-input';
const TEST_INPUT_NAME = 'test';
const TEST_PLACEHOLDER = 'Test';
const TEST_LABEL = 'Test Label';

// Create a wrapper component that uses the form hook and passes to target
function TestWrapper(props: SetupProps) {
    const form = useForm({
        defaultValues: {
            [props.inputName]: '',
        },
    });

    return <FormInput form={form} {...props} />;
}

describe('FormInput Component', () => {
    it('Should render the input component with the correct label', () => {
        render(
            <TestWrapper
                id={TEST_ID}
                inputName={TEST_INPUT_NAME}
                placeholder={TEST_PLACEHOLDER}
                label={TEST_LABEL}
            />
        );

        const label = screen.getByTestId(`${TEST_ID}-label`);

        expect(label).toBeInTheDocument();
        expect(label).toHaveTextContent(TEST_LABEL);
    });

    it('Should render the input component with the correct placeholder', () => {
        render(
            <TestWrapper
                id={TEST_ID}
                inputName={TEST_INPUT_NAME}
                placeholder={TEST_PLACEHOLDER}
                label={TEST_LABEL}
            />
        );

        const input = screen.getByTestId(TEST_ID);

        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('placeholder', TEST_PLACEHOLDER);
    });

    it('Should allow user to input text', async () => {
        const user = userEvent.setup();

        render(
            <TestWrapper
                id={TEST_ID}
                inputName={TEST_INPUT_NAME}
                placeholder={TEST_PLACEHOLDER}
                label={TEST_LABEL}
            />
        );

        const input = screen.getByTestId(TEST_ID);

        await user.type(input, 'Hello World');

        expect(input).toHaveValue('Hello World');
    });

    it('Should have show password button if type is password', async () => {
        render(
            <TestWrapper
                id={TEST_ID}
                inputName={TEST_INPUT_NAME}
                placeholder={TEST_PLACEHOLDER}
                label={TEST_LABEL}
                type="password"
            />
        );

        const showPass = screen.getByTestId(`${TEST_ID}-show-pass`);
        expect(showPass).toBeInTheDocument();
    });

    it('Should not have show password button if type is text', async () => {
        render(
            <TestWrapper
                id={TEST_ID}
                inputName={TEST_INPUT_NAME}
                placeholder={TEST_PLACEHOLDER}
                label={TEST_LABEL}
                type="text"
            />
        );

        const showPass = screen.queryByTestId(`${TEST_ID}-show-pass`);
        expect(showPass).not.toBeInTheDocument();
    });

    // Should not show password button if type is email

    // Show Password should start as hidden

    // Toggle show password should work

    // Fieldstate Error test
});
