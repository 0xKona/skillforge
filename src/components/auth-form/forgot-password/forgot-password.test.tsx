import { render, screen } from '@testing-library/react';
import ForgotPassword from './forgot-password';
import { useRequestPasswordResetStore } from '@/store/password-reset';

// Mock the Zustand store that manages password reset state, enable control of return values
jest.mock('@/store/password-reset');

/* 
    Mock the child components, we are only concerned with which component is rendered.
*/

jest.mock('./request-code', () => {
    return function MockRequestPasswordResetForm() {
        return (
            <div data-testid="request-password-reset-form">Request Form</div>
        );
    };
});

jest.mock('./reset-password-form', () => {
    return function MockPasswordResetForm() {
        return <div data-testid="password-reset-form">Reset Form</div>;
    };
});

const defaultRequestPasswordResetStoreState = {
    providedEmail: '',
    codeSent: false,
    isLoading: false,
    errorMsg: '',
    successMsg: '',
    setLoading: jest.fn(),
    setErrorMsg: jest.fn(),
    setSuccessMsg: jest.fn(),
    setCodeSent: jest.fn(),
    setProvidedEmail: jest.fn(),
};

describe('ForgotPassword Component', () => {
    const mockUseRequestPasswordResetStore =
        useRequestPasswordResetStore as jest.MockedFunction<
            typeof useRequestPasswordResetStore
        >;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Should render RequestPasswordResetForm when codeSent is false', () => {
        // Set codeSent to false
        mockUseRequestPasswordResetStore.mockReturnValue({
            ...defaultRequestPasswordResetStoreState,
            codeSent: false, // This is the key value for this test
        });

        render(<ForgotPassword />);

        /* With codeSent set to false, the system should render the request form and
        and not the reset form */

        expect(
            screen.getByTestId('request-password-reset-form')
        ).toBeInTheDocument();

        expect(
            screen.queryByTestId('password-reset-form')
        ).not.toBeInTheDocument();
    });

    it('Should render PasswordResetForm when codeSent is true', () => {
        mockUseRequestPasswordResetStore.mockReturnValue({
            ...defaultRequestPasswordResetStoreState,
            codeSent: true,
        });

        render(<ForgotPassword />);

        // Expect the opposite, reset form should be rendered and the request form should not.

        expect(screen.getByTestId('password-reset-form')).toBeInTheDocument();
        expect(
            screen.queryByTestId('request-password-reset-form')
        ).not.toBeInTheDocument();
    });

    it('Should transition from request form to reset form when state changes', () => {
        mockUseRequestPasswordResetStore.mockReturnValue({
            ...defaultRequestPasswordResetStoreState,
            providedEmail: '',
            codeSent: false,
        });

        const { rerender } = render(<ForgotPassword />);

        // Request form should be rendered initially
        expect(
            screen.getByTestId('request-password-reset-form')
        ).toBeInTheDocument();

        /* Simulate request form being submitted and supplying an email,
        then rerendering */
        mockUseRequestPasswordResetStore.mockReturnValue({
            ...defaultRequestPasswordResetStoreState,
            providedEmail: 'test@example.com',
            codeSent: true,
        });

        rerender(<ForgotPassword />);

        // The reset form should now be visible, not the request form
        expect(screen.getByTestId('password-reset-form')).toBeInTheDocument();
        expect(
            screen.queryByTestId('request-password-reset-form')
        ).not.toBeInTheDocument();
    });
});
