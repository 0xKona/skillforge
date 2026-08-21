import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUpTab from './sign-up-tab';
import { useAuthFlowState } from '@/lib/store/use-auth-form';
import { defaultAuthFlowState } from '@/test-utils/test-helpers';
import { signUp } from 'aws-amplify/auth';

// Test IDs
const EMAIL_INPUT_ID = 'signup-email';
const USERNAME_INPUT_ID = 'signup-username';
const PASSWORD_INPUT_ID = 'signup-password';
const CONFIRM_PASSWORD_INPUT_ID = 'signup-confirm-password';
const EMAIL_ERROR_ID = 'signup-email-error';
const USERNAME_ERROR_ID = 'signup-username-error';
const PASSWORD_ERROR_ID = 'signup-password-error';
const CONFIRM_PASSWORD_ERROR_ID = 'signup-confirm-password-error';
const SUBMIT_BUTTON_ID = 'submit-signup';

// Mock AWS Amplify
jest.mock('aws-amplify/auth');

// Mock Zustand store
jest.mock('@/lib/store/use-auth-form');

describe('SignUpTab Component', () => {
    const mockUseAuthFlowState = useAuthFlowState as jest.MockedFunction<
        typeof useAuthFlowState
    >;
    const mockSignUp = signUp as jest.MockedFunction<typeof signUp>;

    const mockSetNeedsConfirmation = jest.fn();
    const mockSetVerificationEmail = jest.fn();

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

    beforeEach(() => {
        jest.clearAllMocks();

        mockUseAuthFlowState.mockReturnValue({
            ...defaultAuthFlowState,
            setNeedsConfirmation: mockSetNeedsConfirmation,
            setVerificationEmail: mockSetVerificationEmail,
        });
    });

    describe('Rendering', () => {
        it('Should render the form with all elements', () => {
            render(<SignUpTab />);

            const emailInput = screen.getByTestId(EMAIL_INPUT_ID);
            const usernameInput = screen.getByTestId(USERNAME_INPUT_ID);
            const passwordInput = screen.getByTestId(PASSWORD_INPUT_ID);
            const confirmPasswordInput = screen.getByTestId(
                CONFIRM_PASSWORD_INPUT_ID
            );
            const submitButton = screen.getByTestId(SUBMIT_BUTTON_ID);

            expect(emailInput).toBeInTheDocument();
            expect(usernameInput).toBeInTheDocument();
            expect(passwordInput).toBeInTheDocument();
            expect(confirmPasswordInput).toBeInTheDocument();
            expect(submitButton).toBeInTheDocument();
        });

        it('Should have correct placeholder text', () => {
            render(<SignUpTab />);

            const emailInput = screen.getByTestId(EMAIL_INPUT_ID);
            const usernameInput = screen.getByTestId(USERNAME_INPUT_ID);
            const passwordInput = screen.getByTestId(PASSWORD_INPUT_ID);
            const confirmPasswordInput = screen.getByTestId(
                CONFIRM_PASSWORD_INPUT_ID
            );

            expect(emailInput).toHaveAttribute(
                'placeholder',
                'blacksmith@skillforge.com'
            );
            expect(usernameInput).toHaveAttribute('placeholder', 'Forger');
            expect(passwordInput).toHaveAttribute(
                'placeholder',
                'Enter your password'
            );
            expect(confirmPasswordInput).toHaveAttribute(
                'placeholder',
                'Confirm your password'
            );
        });

        it('Should have correct button text', () => {
            render(<SignUpTab />);

            const submitButton = screen.getByTestId(SUBMIT_BUTTON_ID);

            expect(submitButton).toHaveTextContent('Sign Up');
        });
    });

    describe('User Input', () => {
        it('Should allow user to type email', async () => {
            const user = userEvent.setup();
            render(<SignUpTab />);

            const emailInput = screen.getByTestId(EMAIL_INPUT_ID);

            await user.type(emailInput, 'test@example.com');

            expect(emailInput).toHaveValue('test@example.com');
        });

        it('Should allow user to type username', async () => {
            const user = userEvent.setup();
            render(<SignUpTab />);

            const usernameInput = screen.getByTestId(USERNAME_INPUT_ID);

            await user.type(usernameInput, 'TestUser');

            expect(usernameInput).toHaveValue('TestUser');
        });

        it('Should allow user to type password', async () => {
            const user = userEvent.setup();
            render(<SignUpTab />);

            const passwordInput = screen.getByTestId(PASSWORD_INPUT_ID);

            await user.type(passwordInput, 'TestPassword123!');

            expect(passwordInput).toHaveValue('TestPassword123!');
        });

        it('Should allow user to type confirm password', async () => {
            const user = userEvent.setup();
            render(<SignUpTab />);

            const confirmPasswordInput = screen.getByTestId(
                CONFIRM_PASSWORD_INPUT_ID
            );

            await user.type(confirmPasswordInput, 'TestPassword123!');

            expect(confirmPasswordInput).toHaveValue('TestPassword123!');
        });
    });

    describe('Form Validation', () => {
        it('Should show error when email is empty', async () => {
            const user = userEvent.setup();
            render(<SignUpTab />);

            const submitButton = screen.getByTestId(SUBMIT_BUTTON_ID);

            await user.click(submitButton);

            expect(mockSignUp).not.toHaveBeenCalled();

            const emailError = screen.getByTestId(EMAIL_ERROR_ID);
            expect(emailError).toHaveTextContent(
                'Please enter a valid email address'
            );
        });

        it('Should show error when email is invalid', async () => {
            const user = userEvent.setup();
            render(<SignUpTab />);

            const emailInput = screen.getByTestId(EMAIL_INPUT_ID);
            const submitButton = screen.getByTestId(SUBMIT_BUTTON_ID);

            await user.type(emailInput, 'not-an-email');
            await user.click(submitButton);

            expect(mockSignUp).not.toHaveBeenCalled();

            const emailError = screen.getByTestId(EMAIL_ERROR_ID);
            expect(emailError).toHaveTextContent(
                'Please enter a valid email address'
            );
        });

        it('Should show error when username is empty', async () => {
            const user = userEvent.setup();
            render(<SignUpTab />);

            const emailInput = screen.getByTestId(EMAIL_INPUT_ID);
            const submitButton = screen.getByTestId(SUBMIT_BUTTON_ID);

            await user.type(emailInput, 'test@example.com');
            await user.click(submitButton);

            expect(mockSignUp).not.toHaveBeenCalled();

            const usernameError = screen.getByTestId(USERNAME_ERROR_ID);
            expect(usernameError).toHaveTextContent(
                'Username must be at least 2 characters'
            );
        });

        it('Should show error when username is too short', async () => {
            const user = userEvent.setup();
            render(<SignUpTab />);

            const emailInput = screen.getByTestId(EMAIL_INPUT_ID);
            const usernameInput = screen.getByTestId(USERNAME_INPUT_ID);
            const submitButton = screen.getByTestId(SUBMIT_BUTTON_ID);

            await user.type(emailInput, 'test@example.com');
            await user.type(usernameInput, 'a');
            await user.click(submitButton);

            expect(mockSignUp).not.toHaveBeenCalled();

            const usernameError = screen.getByTestId(USERNAME_ERROR_ID);
            expect(usernameError).toHaveTextContent(
                'Username must be at least 2 characters'
            );
        });

        it('Should show error when password is empty', async () => {
            const user = userEvent.setup();
            render(<SignUpTab />);

            const emailInput = screen.getByTestId(EMAIL_INPUT_ID);
            const usernameInput = screen.getByTestId(USERNAME_INPUT_ID);
            const submitButton = screen.getByTestId(SUBMIT_BUTTON_ID);

            await user.type(emailInput, 'test@example.com');
            await user.type(usernameInput, 'TestUser');
            await user.click(submitButton);

            expect(mockSignUp).not.toHaveBeenCalled();

            const passwordError = screen.getByTestId(PASSWORD_ERROR_ID);
            expect(passwordError).toHaveTextContent(
                'Password must be at least 8 characters'
            );
        });

        it('Should show error when password is too short', async () => {
            const user = userEvent.setup();
            render(<SignUpTab />);

            const emailInput = screen.getByTestId(EMAIL_INPUT_ID);
            const usernameInput = screen.getByTestId(USERNAME_INPUT_ID);
            const passwordInput = screen.getByTestId(PASSWORD_INPUT_ID);
            const submitButton = screen.getByTestId(SUBMIT_BUTTON_ID);

            await user.type(emailInput, 'test@example.com');
            await user.type(usernameInput, 'TestUser');
            await user.type(passwordInput, 'short');
            await user.click(submitButton);

            expect(mockSignUp).not.toHaveBeenCalled();

            const passwordError = screen.getByTestId(PASSWORD_ERROR_ID);
            expect(passwordError).toHaveTextContent(
                'Password must be at least 8 characters'
            );
        });

        it('Should show error when passwords do not match', async () => {
            const user = userEvent.setup();
            render(<SignUpTab />);

            const emailInput = screen.getByTestId(EMAIL_INPUT_ID);
            const usernameInput = screen.getByTestId(USERNAME_INPUT_ID);
            const passwordInput = screen.getByTestId(PASSWORD_INPUT_ID);
            const confirmPasswordInput = screen.getByTestId(
                CONFIRM_PASSWORD_INPUT_ID
            );
            const submitButton = screen.getByTestId(SUBMIT_BUTTON_ID);

            await user.type(emailInput, 'test@example.com');
            await user.type(usernameInput, 'TestUser');
            await user.type(passwordInput, 'TestPassword123!');
            await user.type(confirmPasswordInput, 'DifferentPassword123!');
            await user.click(submitButton);

            expect(mockSignUp).not.toHaveBeenCalled();

            const confirmPasswordError = screen.getByTestId(
                CONFIRM_PASSWORD_ERROR_ID
            );
            expect(confirmPasswordError).toHaveTextContent(
                "Passwords don't match"
            );
        });
    });

    describe('Successful Sign Up', () => {
        it('Should call signUp with correct data', async () => {
            const user = userEvent.setup();
            mockSignUp.mockResolvedValueOnce({
                isSignUpComplete: false,
                nextStep: { signUpStep: 'CONFIRM_SIGN_UP' },
            } as Awaited<ReturnType<typeof signUp>>);

            render(<SignUpTab />);

            const emailInput = screen.getByTestId(EMAIL_INPUT_ID);
            const usernameInput = screen.getByTestId(USERNAME_INPUT_ID);
            const passwordInput = screen.getByTestId(PASSWORD_INPUT_ID);
            const confirmPasswordInput = screen.getByTestId(
                CONFIRM_PASSWORD_INPUT_ID
            );
            const submitButton = screen.getByTestId(SUBMIT_BUTTON_ID);

            await user.type(emailInput, 'test@example.com');
            await user.type(usernameInput, 'TestUser');
            await user.type(passwordInput, 'TestPassword123!');
            await user.type(confirmPasswordInput, 'TestPassword123!');
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockSignUp).toHaveBeenCalledWith({
                    username: 'test@example.com',
                    password: 'TestPassword123!',
                    options: {
                        userAttributes: {
                            email: 'test@example.com',
                            preferred_username: 'TestUser',
                            picture:
                                'https://img.icons8.com/?size=100&id=99268&format=png&color=ffffff',
                        },
                    },
                });
            });
        });

        it('Should transition to verification view when CONFIRM_SIGN_UP is required', async () => {
            const user = userEvent.setup();
            mockSignUp.mockResolvedValueOnce({
                isSignUpComplete: false,
                nextStep: { signUpStep: 'CONFIRM_SIGN_UP' },
            } as Awaited<ReturnType<typeof signUp>>);

            render(<SignUpTab />);

            const emailInput = screen.getByTestId(EMAIL_INPUT_ID);
            const usernameInput = screen.getByTestId(USERNAME_INPUT_ID);
            const passwordInput = screen.getByTestId(PASSWORD_INPUT_ID);
            const confirmPasswordInput = screen.getByTestId(
                CONFIRM_PASSWORD_INPUT_ID
            );
            const submitButton = screen.getByTestId(SUBMIT_BUTTON_ID);

            await user.type(emailInput, 'test@example.com');
            await user.type(usernameInput, 'TestUser');
            await user.type(passwordInput, 'TestPassword123!');
            await user.type(confirmPasswordInput, 'TestPassword123!');
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockSetVerificationEmail).toHaveBeenCalledWith(
                    'test@example.com'
                );
                expect(mockSetNeedsConfirmation).toHaveBeenCalledWith(true);
            });
        });

        it('Should show loading state during sign up', async () => {
            const user = userEvent.setup();
            mockSignUp.mockImplementation(
                () =>
                    new Promise((resolve) =>
                        setTimeout(
                            () =>
                                resolve({
                                    isSignUpComplete: false,
                                    nextStep: { signUpStep: 'CONFIRM_SIGN_UP' },
                                } as Awaited<ReturnType<typeof signUp>>),
                            100
                        )
                    )
            );

            render(<SignUpTab />);

            const emailInput = screen.getByTestId(EMAIL_INPUT_ID);
            const usernameInput = screen.getByTestId(USERNAME_INPUT_ID);
            const passwordInput = screen.getByTestId(PASSWORD_INPUT_ID);
            const confirmPasswordInput = screen.getByTestId(
                CONFIRM_PASSWORD_INPUT_ID
            );
            const submitButton = screen.getByTestId(SUBMIT_BUTTON_ID);

            await user.type(emailInput, 'test@example.com');
            await user.type(usernameInput, 'TestUser');
            await user.type(passwordInput, 'TestPassword123!');
            await user.type(confirmPasswordInput, 'TestPassword123!');
            await user.click(submitButton);

            // Check for loading text
            expect(screen.getByText('Creating account...')).toBeInTheDocument();

            await waitFor(() => {
                expect(
                    screen.queryByText('Creating account...')
                ).not.toBeInTheDocument();
            });
        });
    });

    describe('Error Handling', () => {
        it('Should call signUp and handle errors', async () => {
            const user = userEvent.setup();
            mockSignUp.mockRejectedValueOnce(new Error('User already exists'));

            render(<SignUpTab />);

            const emailInput = screen.getByTestId(EMAIL_INPUT_ID);
            const usernameInput = screen.getByTestId(USERNAME_INPUT_ID);
            const passwordInput = screen.getByTestId(PASSWORD_INPUT_ID);
            const confirmPasswordInput = screen.getByTestId(
                CONFIRM_PASSWORD_INPUT_ID
            );
            const submitButton = screen.getByTestId(SUBMIT_BUTTON_ID);

            await user.type(emailInput, 'test@example.com');
            await user.type(usernameInput, 'TestUser');
            await user.type(passwordInput, 'TestPassword123!');
            await user.type(confirmPasswordInput, 'TestPassword123!');
            await user.click(submitButton);

            await waitFor(
                () => {
                    expect(mockSignUp).toHaveBeenCalled();
                },
                { timeout: 3000 }
            );
        });

        it('Should handle unknown error types', async () => {
            const user = userEvent.setup();
            mockSignUp.mockRejectedValueOnce('Unknown error');

            render(<SignUpTab />);

            const emailInput = screen.getByTestId(EMAIL_INPUT_ID);
            const usernameInput = screen.getByTestId(USERNAME_INPUT_ID);
            const passwordInput = screen.getByTestId(PASSWORD_INPUT_ID);
            const confirmPasswordInput = screen.getByTestId(
                CONFIRM_PASSWORD_INPUT_ID
            );
            const submitButton = screen.getByTestId(SUBMIT_BUTTON_ID);

            await user.type(emailInput, 'test@example.com');
            await user.type(usernameInput, 'TestUser');
            await user.type(passwordInput, 'TestPassword123!');
            await user.type(confirmPasswordInput, 'TestPassword123!');
            await user.click(submitButton);

            await waitFor(
                () => {
                    expect(mockSignUp).toHaveBeenCalled();
                },
                { timeout: 3000 }
            );
        });
    });
});
