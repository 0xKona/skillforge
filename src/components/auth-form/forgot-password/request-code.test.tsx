import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RequestPasswordResetForm from './request-code';
import { useRequestPasswordResetStore } from '@/store/password-reset';
import { useAuthFlowState } from '@/store/auth-form';
import {
    defaultPasswordResetStoreState,
    defaultAuthFlowState,
} from '@/test-utils/test-helpers';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    forgotPasswordRequestSchema,
    resetPasswordFormSchema,
} from '@/lib/form-schemas/auth-schema';
import { resetPassword } from 'aws-amplify/auth';

// IDs
const FORM_MAIN = 'request-password-form';
const FORM_HEADER_ID = 'header-request-password-reset';
const FORM_EMAIL_INPUT_ID = 'request-pass-reset-email-input';
const FORM_EMAIL_ERROR = 'request-pass-reset-email-input-error';
const FORM_SUBMIT_BUTTON = 'request-pass-reset-submit';
const FORM_BACK_BUTTON = 'request-pass-reset-back-button';
const FORM_ERROR = 'request-pass-reset-error';
const FORM_SUCCESS = 'request-pass-reset-success';

// Mock AWS Amplify
jest.mock('aws-amplify/auth');

// Mock the Zustand stores
jest.mock('@/store/password-reset');
jest.mock('@/store/auth-form');

// Test wrapper component to provide form context
function TestWrapper() {
    const requestForm = useForm({
        resolver: zodResolver(forgotPasswordRequestSchema),
        defaultValues: {
            email: '',
        },
    });

    const resetForm = useForm({
        resolver: zodResolver(resetPasswordFormSchema),
        defaultValues: {
            email: '',
            code: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    return (
        <RequestPasswordResetForm
            requestForm={requestForm}
            resetForm={resetForm}
        />
    );
}

describe('RequestPasswordResetForm Component', () => {
    const mockUseRequestPasswordResetStore =
        useRequestPasswordResetStore as jest.MockedFunction<
            typeof useRequestPasswordResetStore
        >;
    const mockUseAuthFlowState = useAuthFlowState as jest.MockedFunction<
        typeof useAuthFlowState
    >;
    const mockResetPassword = resetPassword as jest.MockedFunction<
        typeof resetPassword
    >;

    const mockSetShowForgotPassword = jest.fn();
    const mockSetLoading = jest.fn();
    const mockSetErrorMsg = jest.fn();
    const mockSetSuccessMsg = jest.fn();
    const mockSetCodeSent = jest.fn();
    const mockSetProvidedEmail = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        mockUseRequestPasswordResetStore.mockReturnValue({
            ...defaultPasswordResetStoreState,
            setLoading: mockSetLoading,
            setErrorMsg: mockSetErrorMsg,
            setSuccessMsg: mockSetSuccessMsg,
            setCodeSent: mockSetCodeSent,
            setProvidedEmail: mockSetProvidedEmail,
        });

        mockUseAuthFlowState.mockReturnValue({
            ...defaultAuthFlowState,
            setShowForgotPassword: mockSetShowForgotPassword,
        });
    });

    it('Should render the form with all elements', () => {
        render(<TestWrapper />);

        const formMain = document.getElementById(FORM_MAIN);
        const formHeader = document.getElementById(FORM_HEADER_ID);
        const formEmailInput = document.getElementById(FORM_EMAIL_INPUT_ID);
        const submitButton = document.getElementById(FORM_SUBMIT_BUTTON);
        const backButton = document.getElementById(FORM_BACK_BUTTON);

        expect(formHeader).toBeInTheDocument();
        expect(formEmailInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
        expect(backButton).toBeInTheDocument();
    });

    it('Should be able to cancel', async () => {
        const user = userEvent.setup();
        render(<TestWrapper />);

        const backButton = screen.getByTestId(FORM_BACK_BUTTON);

        await user.click(backButton);

        expect(mockSetShowForgotPassword).toHaveBeenCalledWith(false);
    });

    it('Should be able to type in email', async () => {
        const user = userEvent.setup();
        render(<TestWrapper />);

        const emailInput = screen.getByTestId(FORM_EMAIL_INPUT_ID);

        await user.type(emailInput, 'test@example.com');

        expect(emailInput).toHaveValue('test@example.com');
    });

    it('Should be able to type in email and request code', async () => {
        const user = userEvent.setup();
        mockResetPassword.mockResolvedValueOnce({} as never);

        render(<TestWrapper />);

        const emailInput = screen.getByTestId(FORM_EMAIL_INPUT_ID);
        const submitButton = screen.getByTestId(FORM_SUBMIT_BUTTON);

        await user.type(emailInput, 'test@example.com');
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockResetPassword).toHaveBeenCalledWith({
                username: 'test@example.com',
            });
        });

        expect(mockSetLoading).toHaveBeenCalledWith(true);
        expect(mockSetErrorMsg).toHaveBeenCalledWith('');
        expect(mockSetSuccessMsg).toHaveBeenCalledWith('');
        expect(mockSetProvidedEmail).toHaveBeenCalledWith('test@example.com');
        expect(mockSetCodeSent).toHaveBeenCalledWith(true);
        expect(mockSetSuccessMsg).toHaveBeenCalledWith(
            'Verification code sent! Please check your email.'
        );
        expect(mockSetLoading).toHaveBeenCalledWith(false);
    });

    it('Should not be able to request code if no email supplied', async () => {
        const user = userEvent.setup();
        render(<TestWrapper />);

        const submitButton = screen.getByTestId(FORM_SUBMIT_BUTTON);

        await user.click(submitButton);

        // Form validation should prevent submission
        expect(mockResetPassword).not.toHaveBeenCalled();
        expect(mockSetLoading).not.toHaveBeenCalled();

        // Error text should prompt user
        const errorText = screen.getByTestId(FORM_EMAIL_ERROR);
        expect(errorText).toHaveTextContent(
            'Please enter a valid email address'
        );
    });

    it('Should not be able to request code if an invalid input (not email) is supplied', async () => {
        const user = userEvent.setup();
        render(<TestWrapper />);

        const emailInput = screen.getByTestId(FORM_EMAIL_INPUT_ID);
        const submitButton = screen.getByTestId(FORM_SUBMIT_BUTTON);

        await user.type(emailInput, 'not-an-email');
        await user.click(submitButton);

        // Form validation should prevent submission
        expect(mockResetPassword).not.toHaveBeenCalled();
        expect(mockSetLoading).not.toHaveBeenCalled();

        // Error text should prompt user
        const errorText = screen.getByTestId(FORM_EMAIL_ERROR);
        expect(errorText).toHaveTextContent(
            'Please enter a valid email address'
        );
    });

    it('Should display error message when password reset fails', async () => {
        const user = userEvent.setup();
        const errorMessage = 'Failed to send reset code';
        mockResetPassword.mockRejectedValueOnce(new Error(errorMessage));

        mockUseRequestPasswordResetStore.mockReturnValue({
            ...defaultPasswordResetStoreState,
            errorMsg: errorMessage,
            setLoading: mockSetLoading,
            setErrorMsg: mockSetErrorMsg,
            setSuccessMsg: mockSetSuccessMsg,
            setCodeSent: mockSetCodeSent,
            setProvidedEmail: mockSetProvidedEmail,
        });

        render(<TestWrapper />);

        const emailInput = screen.getByTestId(FORM_EMAIL_INPUT_ID);
        const submitButton = screen.getByTestId(FORM_SUBMIT_BUTTON);

        await user.type(emailInput, 'test@example.com');
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockSetErrorMsg).toHaveBeenCalledWith(errorMessage);
        });

        expect(mockSetLoading).toHaveBeenCalledWith(false);
        expect(mockSetCodeSent).not.toHaveBeenCalled();

        const errorText = screen.getByTestId(FORM_ERROR);
        expect(errorText).toHaveTextContent(errorMessage);
    });

    it('Should display success message when code is sent', () => {
        mockUseRequestPasswordResetStore.mockReturnValue({
            ...defaultPasswordResetStoreState,
            successMsg: 'Verification code sent! Please check your email.',
            setLoading: mockSetLoading,
            setErrorMsg: mockSetErrorMsg,
            setSuccessMsg: mockSetSuccessMsg,
            setCodeSent: mockSetCodeSent,
            setProvidedEmail: mockSetProvidedEmail,
        });

        render(<TestWrapper />);

        const successText = screen.getByTestId(FORM_SUCCESS);

        expect(successText).toHaveTextContent(
            'Verification code sent! Please check your email.'
        );
    });

    it('Should show loading state when submitting', () => {
        mockUseRequestPasswordResetStore.mockReturnValue({
            ...defaultPasswordResetStoreState,
            isLoading: true,
            setLoading: mockSetLoading,
            setErrorMsg: mockSetErrorMsg,
            setSuccessMsg: mockSetSuccessMsg,
            setCodeSent: mockSetCodeSent,
            setProvidedEmail: mockSetProvidedEmail,
        });

        render(<TestWrapper />);

        const submitButton = screen.getByTestId(FORM_SUBMIT_BUTTON);

        expect(submitButton).toBeDisabled();
        expect(submitButton).toHaveTextContent('Sending...');
    });
});
