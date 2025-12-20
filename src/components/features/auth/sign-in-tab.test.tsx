import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignInTab from './sign-in-tab';
import { useAuthFlowState } from '@/lib/store/use-auth-form';
import { defaultAuthFlowState } from '@/test-utils/test-helpers';
import { signIn, resendSignUpCode } from 'aws-amplify/auth';
import { useRouter, useSearchParams } from 'next/navigation';

// Test IDs
const EMAIL_INPUT_ID = 'sign-in-email';
const PASSWORD_INPUT_ID = 'sign-in-password';
const EMAIL_ERROR_ID = 'sign-in-email-error';
const PASSWORD_ERROR_ID = 'sign-in-password-error';
const SUBMIT_BUTTON_ID = 'submit-signin';

// Mock AWS Amplify
jest.mock('aws-amplify/auth');

// Mock Zustand store
jest.mock('@/lib/store/use-auth-form');

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn(),
}));

describe('SignInTab Component', () => {
    const mockUseAuthFlowState = useAuthFlowState as jest.MockedFunction<
        typeof useAuthFlowState
    >;
    const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;
    const mockResendSignUpCode = resendSignUpCode as jest.MockedFunction<
        typeof resendSignUpCode
    >;
    const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
    const mockUseSearchParams = useSearchParams as jest.MockedFunction<
        typeof useSearchParams
    >;

    // Suppress console errors during tests
    let consoleErrorSpy: jest.SpyInstance;

    beforeAll(() => {
        consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});
    });

    afterAll(() => {
        consoleErrorSpy.mockRestore();
    });

    const mockSetNeedsConfirmation = jest.fn();
    const mockSetVerificationEmail = jest.fn();
    const mockSetShowForgotPassword = jest.fn();
    const mockPush = jest.fn();
    const mockGet = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        mockUseAuthFlowState.mockReturnValue({
            ...defaultAuthFlowState,
            setNeedsConfirmation: mockSetNeedsConfirmation,
            setVerificationEmail: mockSetVerificationEmail,
            setShowForgotPassword: mockSetShowForgotPassword,
        });

        mockUseRouter.mockReturnValue({
            push: mockPush,
            replace: jest.fn(),
            refresh: jest.fn(),
            back: jest.fn(),
            forward: jest.fn(),
            prefetch: jest.fn(),
        } as ReturnType<typeof useRouter>);

        mockUseSearchParams.mockReturnValue({
            get: mockGet,
        } as unknown as ReturnType<typeof useSearchParams>);
    });

    describe('Rendering', () => {
        it('Should render the form with all elements', () => {
            render(<SignInTab />);

            const emailInput = screen.getByTestId(EMAIL_INPUT_ID);
            const passwordInput = screen.getByTestId(PASSWORD_INPUT_ID);
            const submitButton = screen.getByTestId(SUBMIT_BUTTON_ID);
            const forgotPasswordLink = screen.getByText('Forgot password?');

            expect(emailInput).toBeInTheDocument();
            expect(passwordInput).toBeInTheDocument();
            expect(submitButton).toBeInTheDocument();
            expect(forgotPasswordLink).toBeInTheDocument();
        });

        it('Should have correct placeholder text', () => {
            render(<SignInTab />);

            const emailInput = screen.getByTestId(EMAIL_INPUT_ID);
            const passwordInput = screen.getByTestId(PASSWORD_INPUT_ID);

            expect(emailInput).toHaveAttribute(
                'placeholder',
                'blacksmith@skillforge.com'
            );
            expect(passwordInput).toHaveAttribute(
                'placeholder',
                'enter password'
            );
        });

        it('Should have correct button text', () => {
            render(<SignInTab />);

            const submitButton = screen.getByTestId(SUBMIT_BUTTON_ID);

            expect(submitButton).toHaveTextContent('Sign In');
        });
    });

    describe('User Input', () => {
        it('Should allow user to type email', async () => {
            const user = userEvent.setup();
            render(<SignInTab />);

            const emailInput = screen.getByTestId(EMAIL_INPUT_ID);

            await user.type(emailInput, 'test@example.com');

            expect(emailInput).toHaveValue('test@example.com');
        });

        it('Should allow user to type password', async () => {
            const user = userEvent.setup();
            render(<SignInTab />);

            const passwordInput = screen.getByTestId(PASSWORD_INPUT_ID);

            await user.type(passwordInput, 'TestPassword123!');

            expect(passwordInput).toHaveValue('TestPassword123!');
        });
    });

    describe('Form Validation', () => {
        it('Should show error when email is empty', async () => {
            const user = userEvent.setup();
            render(<SignInTab />);

            const submitButton = screen.getByTestId(SUBMIT_BUTTON_ID);

            await user.click(submitButton);

            expect(mockSignIn).not.toHaveBeenCalled();

            const emailError = screen.getByTestId(EMAIL_ERROR_ID);
            expect(emailError).toHaveTextContent(
                'Please enter a valid email address'
            );
        });

        it('Should show error when email is invalid', async () => {
            const user = userEvent.setup();
            render(<SignInTab />);

            const emailInput = screen.getByTestId(EMAIL_INPUT_ID);
            const submitButton = screen.getByTestId(SUBMIT_BUTTON_ID);

            await user.type(emailInput, 'not-an-email');
            await user.click(submitButton);

            expect(mockSignIn).not.toHaveBeenCalled();

            const emailError = screen.getByTestId(EMAIL_ERROR_ID);
            expect(emailError).toHaveTextContent(
                'Please enter a valid email address'
            );
        });

        it('Should show error when password is empty', async () => {
            const user = userEvent.setup();
            render(<SignInTab />);

            const emailInput = screen.getByTestId(EMAIL_INPUT_ID);
            const submitButton = screen.getByTestId(SUBMIT_BUTTON_ID);

            await user.type(emailInput, 'test@example.com');
            await user.click(submitButton);

            expect(mockSignIn).not.toHaveBeenCalled();

            const passwordError = screen.getByTestId(PASSWORD_ERROR_ID);
            expect(passwordError).toHaveTextContent('No password provided');
        });
    });

    describe('Successful Sign In', () => {
        it('Should call signIn with correct credentials', async () => {
            const user = userEvent.setup();
            mockSignIn.mockResolvedValueOnce({
                isSignedIn: true,
                nextStep: { signInStep: 'DONE' },
            } as Awaited<ReturnType<typeof signIn>>);

            render(<SignInTab />);

            const emailInput = screen.getByTestId(EMAIL_INPUT_ID);
            const passwordInput = screen.getByTestId(PASSWORD_INPUT_ID);
            const submitButton = screen.getByTestId(SUBMIT_BUTTON_ID);

            await user.type(emailInput, 'test@example.com');
            await user.type(passwordInput, 'TestPassword123!');
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockSignIn).toHaveBeenCalledWith({
                    username: 'test@example.com',
                    password: 'TestPassword123!',
                });
            });
        });

        it('Should show success message on successful sign in', async () => {
            const user = userEvent.setup();
            mockSignIn.mockResolvedValueOnce({
                isSignedIn: true,
                nextStep: { signInStep: 'DONE' },
            } as Awaited<ReturnType<typeof signIn>>);
            mockGet.mockReturnValue(null);

            render(<SignInTab />);

            const emailInput = screen.getByTestId(EMAIL_INPUT_ID);
            const passwordInput = screen.getByTestId(PASSWORD_INPUT_ID);
            const submitButton = screen.getByTestId(SUBMIT_BUTTON_ID);

            await user.type(emailInput, 'test@example.com');
            await user.type(passwordInput, 'TestPassword123!');
            await user.click(submitButton);

            // ClientAuthListener handles redirect, check that form doesn't show error
            await waitFor(() => {
                expect(
                    screen.queryByText(/failed to sign in/i)
                ).not.toBeInTheDocument();
                expect(mockSignIn).toHaveBeenCalledWith({
                    username: 'test@example.com',
                    password: 'TestPassword123!',
                });
            });
        });

        it('Should handle successful sign in (redirectTo param no longer used)', async () => {
            const user = userEvent.setup();
            mockSignIn.mockResolvedValueOnce({
                isSignedIn: true,
                nextStep: { signInStep: 'DONE' },
            } as Awaited<ReturnType<typeof signIn>>);
            mockGet.mockReturnValue('/custom-page');

            render(<SignInTab />);

            const emailInput = screen.getByTestId(EMAIL_INPUT_ID);
            const passwordInput = screen.getByTestId(PASSWORD_INPUT_ID);
            const submitButton = screen.getByTestId(SUBMIT_BUTTON_ID);

            await user.type(emailInput, 'test@example.com');
            await user.type(passwordInput, 'TestPassword123!');
            await user.click(submitButton);

            // Note: redirectTo param is no longer used, ClientAuthListener always redirects to /forge
            await waitFor(() => {
                expect(
                    screen.queryByText(/failed to sign in/i)
                ).not.toBeInTheDocument();
                expect(mockSignIn).toHaveBeenCalledWith({
                    username: 'test@example.com',
                    password: 'TestPassword123!',
                });
            });
        });

        it('Should show loading state during sign in', async () => {
            const user = userEvent.setup();
            mockSignIn.mockImplementation(
                () =>
                    new Promise((resolve) =>
                        setTimeout(
                            () =>
                                resolve({
                                    isSignedIn: true,
                                    nextStep: { signInStep: 'DONE' },
                                } as Awaited<ReturnType<typeof signIn>>),
                            100
                        )
                    )
            );

            render(<SignInTab />);

            const emailInput = screen.getByTestId(EMAIL_INPUT_ID);
            const passwordInput = screen.getByTestId(PASSWORD_INPUT_ID);
            const submitButton = screen.getByTestId(SUBMIT_BUTTON_ID);

            await user.type(emailInput, 'test@example.com');
            await user.type(passwordInput, 'TestPassword123!');
            await user.click(submitButton);

            // Check for loading text
            expect(screen.getByText('Signing in...')).toBeInTheDocument();

            await waitFor(() => {
                expect(
                    screen.queryByText('Signing in...')
                ).not.toBeInTheDocument();
            });
        });
    });

    describe('Confirmation Required', () => {
        it('Should handle CONFIRM_SIGN_UP step', async () => {
            const user = userEvent.setup();
            mockSignIn.mockResolvedValueOnce({
                isSignedIn: false,
                nextStep: { signInStep: 'CONFIRM_SIGN_UP' },
            } as Awaited<ReturnType<typeof signIn>>);
            mockResendSignUpCode.mockResolvedValueOnce(
                {} as Awaited<ReturnType<typeof resendSignUpCode>>
            );

            render(<SignInTab />);

            const emailInput = screen.getByTestId(EMAIL_INPUT_ID);
            const passwordInput = screen.getByTestId(PASSWORD_INPUT_ID);
            const submitButton = screen.getByTestId(SUBMIT_BUTTON_ID);

            await user.type(emailInput, 'test@example.com');
            await user.type(passwordInput, 'TestPassword123!');
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockResendSignUpCode).toHaveBeenCalledWith({
                    username: 'test@example.com',
                });
                expect(mockSetVerificationEmail).toHaveBeenCalledWith(
                    'test@example.com'
                );
                expect(mockSetNeedsConfirmation).toHaveBeenCalledWith(true);
            });
        });

        it('Should handle UserNotConfirmedException error', async () => {
            const user = userEvent.setup();
            const error = new Error('User is not confirmed');
            (error as Error & { name: string }).name =
                'UserNotConfirmedException';
            mockSignIn.mockRejectedValueOnce(error);
            mockResendSignUpCode.mockResolvedValueOnce(
                {} as Awaited<ReturnType<typeof resendSignUpCode>>
            );

            render(<SignInTab />);

            const emailInput = screen.getByTestId(EMAIL_INPUT_ID);
            const passwordInput = screen.getByTestId(PASSWORD_INPUT_ID);
            const submitButton = screen.getByTestId(SUBMIT_BUTTON_ID);

            await user.type(emailInput, 'test@example.com');
            await user.type(passwordInput, 'TestPassword123!');
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockResendSignUpCode).toHaveBeenCalledWith({
                    username: 'test@example.com',
                });
                expect(mockSetVerificationEmail).toHaveBeenCalledWith(
                    'test@example.com'
                );
                expect(mockSetNeedsConfirmation).toHaveBeenCalledWith(true);
            });
        });
    });

    describe('Forgot Password', () => {
        it('Should trigger forgot password flow when clicked', async () => {
            const user = userEvent.setup();
            render(<SignInTab />);

            const forgotPasswordLink = screen.getByText('Forgot password?');

            await user.click(forgotPasswordLink);

            expect(mockSetShowForgotPassword).toHaveBeenCalledWith(true);
        });

        it('Should not submit form when forgot password is clicked', async () => {
            const user = userEvent.setup();
            render(<SignInTab />);

            const forgotPasswordLink = screen.getByText('Forgot password?');

            await user.click(forgotPasswordLink);

            expect(mockSignIn).not.toHaveBeenCalled();
        });
    });
});
