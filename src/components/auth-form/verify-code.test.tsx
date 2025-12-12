import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VerifyCodeCard from './verify-code';
import { useAuthFlowState, passwordStorage } from '@/lib/store/use-auth-form';
import { confirmSignUp, resendSignUpCode, signIn } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';

// Mock AWS Amplify
jest.mock('aws-amplify/auth');

// Mock Zustand store
jest.mock('@/lib/store/use-auth-form');

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe('VerifyCodeCard Component', () => {
    const mockUseAuthFlowState = useAuthFlowState as jest.MockedFunction<
        typeof useAuthFlowState
    >;
    const mockConfirmSignUp = confirmSignUp as jest.MockedFunction<
        typeof confirmSignUp
    >;
    const mockResendSignUpCode = resendSignUpCode as jest.MockedFunction<
        typeof resendSignUpCode
    >;
    const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;
    const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

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
    const mockResetAuthFlow = jest.fn();
    const mockPush = jest.fn();
    const mockPasswordStorageGet = jest.fn();
    const mockPasswordStorageClear = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock password storage
        (passwordStorage as jest.Mocked<typeof passwordStorage>).get =
            mockPasswordStorageGet;
        (passwordStorage as jest.Mocked<typeof passwordStorage>).clear =
            mockPasswordStorageClear;

        // Mock router
        mockUseRouter.mockReturnValue({
            push: mockPush,
            back: jest.fn(),
            forward: jest.fn(),
            refresh: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
        } as ReturnType<typeof useRouter>);

        // Mock auth flow state
        mockUseAuthFlowState.mockReturnValue({
            verificationEmail: 'test@example.com',
            setNeedsConfirmation: mockSetNeedsConfirmation,
            resetAuthFlow: mockResetAuthFlow,
        } as ReturnType<typeof useAuthFlowState>);
    });

    // Renders correctly
    it('Should render the verification form with all required elements', () => {
        render(<VerifyCodeCard />);

        expect(screen.getByText('Confirm Your Email')).toBeInTheDocument();
        expect(
            screen.getByText(/Enter the confirmation code sent to/i)
        ).toBeInTheDocument();
        expect(screen.getByLabelText('Confirmation Code')).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /Confirm Email/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /Back to Sign In/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /Resend Code/i })
        ).toBeInTheDocument();
    });

    // Handle confirm sign up if password stored
    it('Should confirm email and auto sign-in when password is stored', async () => {
        const user = userEvent.setup();

        mockPasswordStorageGet.mockReturnValue('storedPassword123');
        mockConfirmSignUp.mockResolvedValueOnce({
            isSignUpComplete: true,
            nextStep: { signUpStep: 'DONE' },
        } as Awaited<ReturnType<typeof confirmSignUp>>);
        mockSignIn.mockResolvedValueOnce({
            isSignedIn: true,
            nextStep: { signInStep: 'DONE' },
        } as Awaited<ReturnType<typeof signIn>>);

        render(<VerifyCodeCard />);

        const otpInput = screen.getByLabelText('Confirmation Code');
        const submitButton = screen.getByRole('button', {
            name: /Confirm Email/i,
        });

        await user.type(otpInput, '123456');
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockConfirmSignUp).toHaveBeenCalledWith({
                username: 'test@example.com',
                confirmationCode: '123456',
            });
        });

        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalledWith({
                username: 'test@example.com',
                password: 'storedPassword123',
            });
        });

        await waitFor(() => {
            expect(mockPasswordStorageClear).toHaveBeenCalled();
            expect(mockResetAuthFlow).toHaveBeenCalled();
            expect(mockPush).toHaveBeenCalledWith('/forge');
        });
    });

    // Handle confirm sign up if no password stored
    it('Should confirm email and redirect to sign in when no password is stored', async () => {
        const user = userEvent.setup();

        mockPasswordStorageGet.mockReturnValue(null);
        mockConfirmSignUp.mockResolvedValueOnce({
            isSignUpComplete: true,
            nextStep: { signUpStep: 'DONE' },
        } as Awaited<ReturnType<typeof confirmSignUp>>);

        render(<VerifyCodeCard />);

        const otpInput = screen.getByLabelText('Confirmation Code');
        const submitButton = screen.getByRole('button', {
            name: /Confirm Email/i,
        });

        await user.type(otpInput, '123456');
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockConfirmSignUp).toHaveBeenCalledWith({
                username: 'test@example.com',
                confirmationCode: '123456',
            });
        });

        await waitFor(() => {
            expect(
                screen.getByText('Email confirmed! Redirecting to sign in...')
            ).toBeInTheDocument();
        });

        expect(mockSignIn).not.toHaveBeenCalled();
    });

    // Handle confirm sign up error
    it('Should handle confirmation errors', async () => {
        const user = userEvent.setup();

        mockConfirmSignUp.mockRejectedValueOnce(
            new Error('Invalid verification code')
        );

        render(<VerifyCodeCard />);

        const otpInput = screen.getByLabelText('Confirmation Code');
        const submitButton = screen.getByRole('button', {
            name: /Confirm Email/i,
        });

        await user.type(otpInput, '123456');
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockConfirmSignUp).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(
                screen.getByText('Invalid verification code')
            ).toBeInTheDocument();
        });
    });

    // handle resend code
    it('Should resend verification code successfully', async () => {
        const user = userEvent.setup();

        mockResendSignUpCode.mockResolvedValueOnce(
            {} as Awaited<ReturnType<typeof resendSignUpCode>>
        );

        render(<VerifyCodeCard />);

        const resendButton = screen.getByRole('button', {
            name: /Resend Code/i,
        });

        await user.click(resendButton);

        await waitFor(() => {
            expect(mockResendSignUpCode).toHaveBeenCalledWith({
                username: 'test@example.com',
            });
        });

        await waitFor(() => {
            expect(
                screen.getByText(
                    'Verification code sent! Please check your email.'
                )
            ).toBeInTheDocument();
        });
    });

    // handle resend code error
    it('Should handle resend code errors', async () => {
        const user = userEvent.setup();

        mockResendSignUpCode.mockRejectedValueOnce(
            new Error('Rate limit exceeded')
        );

        render(<VerifyCodeCard />);

        const resendButton = screen.getByRole('button', {
            name: /Resend Code/i,
        });

        await user.click(resendButton);

        await waitFor(() => {
            expect(mockResendSignUpCode).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(screen.getByText('Rate limit exceeded')).toBeInTheDocument();
        });
    });
});
