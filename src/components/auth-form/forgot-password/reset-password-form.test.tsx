import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PasswordResetForm from './reset-password-form';
import { useRequestPasswordResetStore } from '@/store/password-reset';
import { useAuthControlState } from '@/store/auth-form';
import {
    defaultPasswordResetStoreState,
    defaultAuthControlState,
} from '@/test-utils/test-helpers';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordFormSchema } from '@/lib/form-schemas/auth-schema';
import { confirmResetPassword, resetPassword } from 'aws-amplify/auth';

// IDs
const FORM_HEADER_ID = 'header-reset-pass-form';
const FORM_EMAIL_INPUT_ID = 'email-reset-pass-form';
const FORM_CODE_INPUT_ID = 'code-reset-pass-form';
const FORM_NEW_PASSWORD_INPUT_ID = 'reset-new-password';
const FORM_CONFIRM_PASSWORD_INPUT_ID = 'reset-confirm-password';
const FORM_SUBMIT_BUTTON_ID = 'submit-auth-form-button';
const FORM_RESEND_BUTTON_ID = 'reset-password-form-resend';
const FORM_ERROR_ID = 'error-reset-pass-form';
const FORM_SUCCESS_ID = 'success-reset-pass-form';

// Text
const FORM_RESEND_BUTTON_TEXT = 'Resend Code';
const FORM_CANCEL_BUTTON_TEXT = 'Cancel';
const FORM_ERROR = 'text-red-500';
const FORM_SUCCESS = 'text-green-500';

// Mock the Zustand stores
jest.mock('@/store/password-reset');
jest.mock('@/store/auth-form');

// Test wrapper component to provide form context
function TestWrapper({ providedEmail = 'test@example.com' }) {
    const resetForm = useForm({
        resolver: zodResolver(resetPasswordFormSchema),
        defaultValues: {
            email: providedEmail,
            code: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    return <PasswordResetForm resetForm={resetForm} />;
}

describe('PasswordResetForm Component', () => {
    const mockUseRequestPasswordResetStore =
        useRequestPasswordResetStore as jest.MockedFunction<
            typeof useRequestPasswordResetStore
        >;
    const mockUseAuthControlState = useAuthControlState as jest.MockedFunction<
        typeof useAuthControlState
    >;
    const mockConfirmResetPassword =
        confirmResetPassword as jest.MockedFunction<
            typeof confirmResetPassword
        >;
    const mockResetPassword = resetPassword as jest.MockedFunction<
        typeof resetPassword
    >;

    const mockSetShowForgotPassword = jest.fn();
    const mockSetLoading = jest.fn();
    const mockSetErrorMsg = jest.fn();
    const mockSetSuccessMsg = jest.fn();
    const mockSetCodeSent = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        mockUseRequestPasswordResetStore.mockReturnValue({
            ...defaultPasswordResetStoreState,
            providedEmail: 'test@example.com',
            setLoading: mockSetLoading,
            setErrorMsg: mockSetErrorMsg,
            setSuccessMsg: mockSetSuccessMsg,
            setCodeSent: mockSetCodeSent,
        });

        mockUseAuthControlState.mockReturnValue({
            ...defaultAuthControlState,
            setShowForgotPassword: mockSetShowForgotPassword,
        });
    });

    afterEach(() => {
        // Restore real timers
        jest.useRealTimers();
    });

    it('Should render the form with all elements', () => {
        render(<TestWrapper />);

        const formHeader = document.getElementById(FORM_HEADER_ID);
        const emailInput = document.getElementById(FORM_EMAIL_INPUT_ID);
        const codeInput = document.getElementById(FORM_CODE_INPUT_ID);
        const newPasswordInput = document.getElementById(
            FORM_NEW_PASSWORD_INPUT_ID
        );
        const confirmPasswordInput = document.getElementById(
            FORM_CONFIRM_PASSWORD_INPUT_ID
        );
        const submitButton = screen.getByTestId(FORM_SUBMIT_BUTTON_ID);
        const resendButton = screen.getByText(FORM_RESEND_BUTTON_TEXT);
        const cancelButton = screen.getByText(FORM_CANCEL_BUTTON_TEXT);

        expect(formHeader).toBeInTheDocument();
        expect(emailInput).toBeInTheDocument();
        expect(codeInput).toBeInTheDocument();
        expect(newPasswordInput).toBeInTheDocument();
        expect(confirmPasswordInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
        expect(resendButton).toBeInTheDocument();
        expect(cancelButton).toBeInTheDocument();
    });

    it('Should display the provided email in the disabled email field', () => {
        render(<TestWrapper providedEmail="user@example.com" />);

        const emailInput = document.getElementById(
            FORM_EMAIL_INPUT_ID
        ) as HTMLInputElement;

        expect(emailInput).toBeDisabled();
        expect(emailInput).toHaveValue('user@example.com');
    });

    it('Should be able to cancel and close the form', async () => {
        const user = userEvent.setup({ delay: null });
        render(<TestWrapper />);

        const cancelButton = screen.getByText(FORM_CANCEL_BUTTON_TEXT);

        await user.click(cancelButton);

        expect(mockSetCodeSent).toHaveBeenCalledWith(false);
        expect(mockSetShowForgotPassword).toHaveBeenCalledWith(false);
    });

    it('Should be able to resend verification code', async () => {
        const user = userEvent.setup({ delay: null });
        mockResetPassword.mockResolvedValueOnce({} as never);

        render(<TestWrapper />);

        const resendButton = screen.getByText(FORM_RESEND_BUTTON_TEXT);

        await user.click(resendButton);

        await waitFor(() => {
            expect(mockResetPassword).toHaveBeenCalledWith({
                username: 'test@example.com',
            });
        });

        expect(mockSetLoading).toHaveBeenCalledWith(true);
        expect(mockSetErrorMsg).toHaveBeenCalledWith('');
        expect(mockSetSuccessMsg).toHaveBeenCalledWith('');
        expect(mockSetSuccessMsg).toHaveBeenCalledWith(
            'Verification code resent!'
        );
        expect(mockSetLoading).toHaveBeenCalledWith(false);
    });

    it('Should successfully reset password with valid inputs', async () => {
        jest.useFakeTimers();

        // Mock document.elementFromPoint
        document.elementFromPoint = jest.fn();

        const user = userEvent.setup({ delay: null });
        mockConfirmResetPassword.mockResolvedValueOnce(undefined as never);

        render(<TestWrapper />);

        // Get form inputs
        const codeInput = screen.getByTestId(FORM_CODE_INPUT_ID);
        const newPasswordInput = screen.getByTestId(FORM_NEW_PASSWORD_INPUT_ID);
        const confirmPasswordInput = screen.getByTestId(
            FORM_CONFIRM_PASSWORD_INPUT_ID
        );
        const submitButton = screen.getByTestId(FORM_SUBMIT_BUTTON_ID);

        await user.type(codeInput, '123456');
        await user.type(newPasswordInput, 'NewPassword123!');
        await user.type(confirmPasswordInput, 'NewPassword123!');
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockConfirmResetPassword).toHaveBeenCalledWith({
                username: 'test@example.com',
                confirmationCode: '123456',
                newPassword: 'NewPassword123!',
            });
        });

        expect(mockSetLoading).toHaveBeenCalledWith(true);
        expect(mockSetErrorMsg).toHaveBeenCalledWith('');
        expect(mockSetSuccessMsg).toHaveBeenCalledWith('');
        expect(mockSetSuccessMsg).toHaveBeenCalledWith(
            'Password reset successfully! You can now sign in with your new password.'
        );
        expect(mockSetLoading).toHaveBeenCalledWith(false);

        // Fast-forward time by 2000ms
        jest.advanceTimersByTime(2000);

        expect(mockSetShowForgotPassword).toHaveBeenCalledWith(false);
    });

    it('Should not submit if code is missing', async () => {
        const user = userEvent.setup({ delay: null });
        render(<TestWrapper />);

        const newPasswordInput = screen.getByTestId(FORM_NEW_PASSWORD_INPUT_ID);
        const confirmPasswordInput = screen.getByTestId(
            FORM_CONFIRM_PASSWORD_INPUT_ID
        );
        const submitButton = screen.getByTestId(FORM_SUBMIT_BUTTON_ID);

        // Fill in passwords only
        await user.type(newPasswordInput, 'NewPassword123!');
        await user.type(confirmPasswordInput, 'NewPassword123!');

        // Form validation should prevent submission
        await user.click(submitButton);
        expect(mockConfirmResetPassword).not.toHaveBeenCalled();
    });

    it('Should not submit if code is too short', async () => {
        const user = userEvent.setup({ delay: null });
        render(<TestWrapper />);

        const codeInput = screen.getByTestId(FORM_CODE_INPUT_ID);
        const newPasswordInput = screen.getByTestId(FORM_NEW_PASSWORD_INPUT_ID);
        const confirmPasswordInput = screen.getByTestId(
            FORM_CONFIRM_PASSWORD_INPUT_ID
        );
        const submitButton = screen.getByTestId(FORM_SUBMIT_BUTTON_ID);

        // Fill in verification code
        await user.type(codeInput, '12345');

        // Fill in passwords
        await user.type(newPasswordInput, 'NewPassword123!');
        await user.type(confirmPasswordInput, 'NewPassword123!');

        await user.click(submitButton);

        // Form validation should prevent submission
        expect(mockConfirmResetPassword).not.toHaveBeenCalled();
    });

    it('Should not submit if passwords do not match', async () => {
        const user = userEvent.setup({ delay: null });
        render(<TestWrapper />);

        const codeInput = screen.getByTestId(FORM_CODE_INPUT_ID);
        const newPasswordInput = screen.getByTestId(FORM_NEW_PASSWORD_INPUT_ID);
        const confirmPasswordInput = screen.getByTestId(
            FORM_CONFIRM_PASSWORD_INPUT_ID
        );
        const submitButton = screen.getByTestId(FORM_SUBMIT_BUTTON_ID);

        // Fill in verification code
        await user.type(codeInput, '12345');

        // Fill in non-matching passwords
        await user.type(newPasswordInput, 'NewPassword123!');
        await user.type(confirmPasswordInput, 'DifferentPassword123!');

        await user.click(submitButton);

        // Form validation should prevent submission
        expect(mockConfirmResetPassword).not.toHaveBeenCalled();
    });

    it('Should not submit if password is too short', async () => {
        const user = userEvent.setup({ delay: null });
        render(<TestWrapper />);

        const codeInput = screen.getByTestId(FORM_CODE_INPUT_ID);
        const newPasswordInput = screen.getByTestId(FORM_NEW_PASSWORD_INPUT_ID);
        const confirmPasswordInput = screen.getByTestId(
            FORM_CONFIRM_PASSWORD_INPUT_ID
        );
        const submitButton = screen.getByTestId(FORM_SUBMIT_BUTTON_ID);

        // Fill in verification code
        await user.type(codeInput, '12345');

        // Fill in short passwords
        await user.type(newPasswordInput, 'short');
        await user.type(confirmPasswordInput, 'short');

        await user.click(submitButton);

        // Form validation should prevent submission
        expect(mockConfirmResetPassword).not.toHaveBeenCalled();
    });

    it('Should display error message when password reset fails', async () => {
        const user = userEvent.setup({ delay: null });
        const errorMessage = 'Invalid verification code';
        mockConfirmResetPassword.mockRejectedValueOnce(new Error(errorMessage));

        mockUseRequestPasswordResetStore.mockReturnValue({
            ...defaultPasswordResetStoreState,
            providedEmail: 'test@example.com',
            errorMsg: errorMessage,
            setLoading: mockSetLoading,
            setErrorMsg: mockSetErrorMsg,
            setSuccessMsg: mockSetSuccessMsg,
            setCodeSent: mockSetCodeSent,
        });

        render(<TestWrapper />);

        const codeInput = screen.getByTestId(FORM_CODE_INPUT_ID);
        const newPasswordInput = screen.getByTestId(FORM_NEW_PASSWORD_INPUT_ID);
        const confirmPasswordInput = screen.getByTestId(
            FORM_CONFIRM_PASSWORD_INPUT_ID
        );
        const submitButton = screen.getByTestId(FORM_SUBMIT_BUTTON_ID);

        // Fill in verification code
        await user.type(codeInput, '123456');

        // Fill in form
        await user.type(newPasswordInput, 'NewPassword123!');
        await user.type(confirmPasswordInput, 'NewPassword123!');

        await user.click(submitButton);

        await waitFor(() => {
            expect(mockSetErrorMsg).toHaveBeenCalledWith(errorMessage);
        });

        expect(mockSetLoading).toHaveBeenCalledWith(false);

        const errorText = screen.getByTestId(FORM_ERROR_ID);
        expect(errorText).toBeInTheDocument();
        expect(errorText).toHaveClass(FORM_ERROR);
    });

    it('Should display success message when password is reset successfully', () => {
        const successMessage =
            'Password reset successfully! You can now sign in with your new password.';

        mockUseRequestPasswordResetStore.mockReturnValue({
            ...defaultPasswordResetStoreState,
            providedEmail: 'test@example.com',
            successMsg: successMessage,
            setLoading: mockSetLoading,
            setErrorMsg: mockSetErrorMsg,
            setSuccessMsg: mockSetSuccessMsg,
            setCodeSent: mockSetCodeSent,
        });

        render(<TestWrapper />);

        const successText = screen.getByTestId(FORM_SUCCESS_ID);
        expect(successText).toBeInTheDocument();
        expect(successText).toHaveClass(FORM_SUCCESS);
    });

    it('Should display error message when resend code fails', async () => {
        const user = userEvent.setup({ delay: null });
        const errorMessage = 'Failed to resend code';
        mockResetPassword.mockRejectedValueOnce(new Error(errorMessage));

        render(<TestWrapper />);

        const resendButton = screen.getByTestId(FORM_RESEND_BUTTON_ID);

        await user.click(resendButton);

        await waitFor(() => {
            expect(mockSetErrorMsg).toHaveBeenCalledWith(errorMessage);
        });

        expect(mockSetLoading).toHaveBeenCalledWith(false);
    });

    it('Should show loading state when submitting', () => {
        mockUseRequestPasswordResetStore.mockReturnValue({
            ...defaultPasswordResetStoreState,
            providedEmail: 'test@example.com',
            isLoading: true,
            setLoading: mockSetLoading,
            setErrorMsg: mockSetErrorMsg,
            setSuccessMsg: mockSetSuccessMsg,
            setCodeSent: mockSetCodeSent,
        });

        render(<TestWrapper />);

        const submitButton = screen.getByTestId(FORM_SUBMIT_BUTTON_ID);
        const resendButton = screen.getByTestId(FORM_RESEND_BUTTON_ID);

        expect(submitButton).toBeDisabled();
        expect(submitButton).toHaveTextContent('Resetting...');
        expect(resendButton).toBeDisabled();
    });

    it('Should display success message when code is resent', () => {
        const successMessage = 'Verification code resent!';

        mockUseRequestPasswordResetStore.mockReturnValue({
            ...defaultPasswordResetStoreState,
            providedEmail: 'test@example.com',
            successMsg: successMessage,
            setLoading: mockSetLoading,
            setErrorMsg: mockSetErrorMsg,
            setSuccessMsg: mockSetSuccessMsg,
            setCodeSent: mockSetCodeSent,
        });

        render(<TestWrapper />);

        const successText = screen.getByTestId(FORM_SUCCESS_ID);
        expect(successText).toBeInTheDocument();
        expect(successText).toHaveClass(FORM_SUCCESS);
    });
});
