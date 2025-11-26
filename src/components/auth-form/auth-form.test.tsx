import { render, screen } from '@testing-library/react';
import AuthForm from './auth-form';
import { useAuthFlowState } from '@/lib/store/auth-form';
import { defaultAuthFlowState } from '@/test-utils/test-helpers';

// Mock the auth flow state store
jest.mock('@/store/auth-form');

// Mock the child components - we only care which component is rendered, not how it works
jest.mock('./verify-code', () => {
    return function MockVerifyCodeCard() {
        return <div data-testid="verify-code-card">Verify Code Card</div>;
    };
});

jest.mock('./sign-in-tab', () => {
    return function MockSignInTab() {
        return <div data-testid="sign-in-tab">Sign In Tab</div>;
    };
});

jest.mock('./sign-up-tab', () => {
    return function MockSignUpTab() {
        return <div data-testid="sign-up-tab">Sign Up Tab</div>;
    };
});

jest.mock('./forgot-password/forgot-password', () => {
    return function MockForgotPassword() {
        return <div data-testid="forgot-password">Forgot Password</div>;
    };
});

describe('AuthForm Component', () => {
    const mockUseAuthFlowState = useAuthFlowState as jest.MockedFunction<
        typeof useAuthFlowState
    >;

    const mockResetAuthFlow = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Default mock for useAuthFlowState
        mockUseAuthFlowState.mockReturnValue({
            ...defaultAuthFlowState,
            resetAuthFlow: mockResetAuthFlow,
        });
    });

    describe('Rendering based on auth flow state', () => {
        it('Should render sign in/sign up tabs by default', () => {
            mockUseAuthFlowState.mockReturnValue({
                ...defaultAuthFlowState,
                needsConfirmation: false,
                showForgotPassword: false,
                resetAuthFlow: mockResetAuthFlow,
            });

            render(<AuthForm />);

            // Check for tabs
            expect(screen.getByText('Sign In')).toBeInTheDocument();
            expect(screen.getByText('Sign Up')).toBeInTheDocument();

            // Check for tab content
            expect(screen.getByTestId('sign-in-tab')).toBeInTheDocument();
            expect(screen.getByTestId('sign-up-tab')).toBeInTheDocument();

            // Should not show other views
            expect(
                screen.queryByTestId('verify-code-card')
            ).not.toBeInTheDocument();
            expect(
                screen.queryByTestId('forgot-password')
            ).not.toBeInTheDocument();
        });

        it('Should render VerifyCodeCard when needsConfirmation is true', () => {
            mockUseAuthFlowState.mockReturnValue({
                ...defaultAuthFlowState,
                needsConfirmation: true,
                showForgotPassword: false,
                resetAuthFlow: mockResetAuthFlow,
            });

            render(<AuthForm />);

            // Should show verify code card
            expect(screen.getByTestId('verify-code-card')).toBeInTheDocument();

            // Should not show other views
            expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
            expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
            expect(
                screen.queryByTestId('forgot-password')
            ).not.toBeInTheDocument();
        });

        it('Should render ForgotPassword when showForgotPassword is true', () => {
            mockUseAuthFlowState.mockReturnValue({
                ...defaultAuthFlowState,
                needsConfirmation: false,
                showForgotPassword: true,
                resetAuthFlow: mockResetAuthFlow,
            });

            render(<AuthForm />);

            // Should show forgot password
            expect(screen.getByTestId('forgot-password')).toBeInTheDocument();

            // Should not show other views
            expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
            expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
            expect(
                screen.queryByTestId('verify-code-card')
            ).not.toBeInTheDocument();
        });

        it('Should prioritize needsConfirmation over showForgotPassword', () => {
            mockUseAuthFlowState.mockReturnValue({
                ...defaultAuthFlowState,
                needsConfirmation: true,
                showForgotPassword: true,
                resetAuthFlow: mockResetAuthFlow,
            });

            render(<AuthForm />);

            // Should show verify code card (checked first)
            expect(screen.getByTestId('verify-code-card')).toBeInTheDocument();

            // Should not show forgot password
            expect(
                screen.queryByTestId('forgot-password')
            ).not.toBeInTheDocument();
        });
    });

    describe('Lifecycle and cleanup', () => {
        it('Should call resetAuthFlow on component unmount', () => {
            mockUseAuthFlowState.mockReturnValue({
                ...defaultAuthFlowState,
                resetAuthFlow: mockResetAuthFlow,
            });

            const { unmount } = render(<AuthForm />);

            expect(mockResetAuthFlow).not.toHaveBeenCalled();

            unmount();

            expect(mockResetAuthFlow).toHaveBeenCalledTimes(1);
        });

        it('Should not call resetAuthFlow on render', () => {
            mockUseAuthFlowState.mockReturnValue({
                ...defaultAuthFlowState,
                resetAuthFlow: mockResetAuthFlow,
            });

            render(<AuthForm />);

            expect(mockResetAuthFlow).not.toHaveBeenCalled();
        });
    });

    describe('State transitions', () => {
        it('Should transition from tabs to verification view', () => {
            mockUseAuthFlowState.mockReturnValue({
                ...defaultAuthFlowState,
                needsConfirmation: false,
                showForgotPassword: false,
                resetAuthFlow: mockResetAuthFlow,
            });

            const { rerender } = render(<AuthForm />);

            // Initially shows tabs
            expect(screen.getByText('Sign In')).toBeInTheDocument();
            expect(screen.getByText('Sign Up')).toBeInTheDocument();

            // Update state to show verification
            mockUseAuthFlowState.mockReturnValue({
                ...defaultAuthFlowState,
                needsConfirmation: true,
                showForgotPassword: false,
                resetAuthFlow: mockResetAuthFlow,
            });

            rerender(<AuthForm />);

            // Now shows verification card
            expect(screen.getByTestId('verify-code-card')).toBeInTheDocument();
            expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
        });

        it('Should transition from tabs to forgot password view', () => {
            mockUseAuthFlowState.mockReturnValue({
                ...defaultAuthFlowState,
                needsConfirmation: false,
                showForgotPassword: false,
                resetAuthFlow: mockResetAuthFlow,
            });

            const { rerender } = render(<AuthForm />);

            // Initially shows tabs
            expect(screen.getByText('Sign In')).toBeInTheDocument();

            // Update state to show forgot password
            mockUseAuthFlowState.mockReturnValue({
                ...defaultAuthFlowState,
                needsConfirmation: false,
                showForgotPassword: true,
                resetAuthFlow: mockResetAuthFlow,
            });

            rerender(<AuthForm />);

            // Now shows forgot password
            expect(screen.getByTestId('forgot-password')).toBeInTheDocument();
            expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
        });

        it('Should transition back from verification to tabs', () => {
            mockUseAuthFlowState.mockReturnValue({
                ...defaultAuthFlowState,
                needsConfirmation: true,
                showForgotPassword: false,
                resetAuthFlow: mockResetAuthFlow,
            });

            const { rerender } = render(<AuthForm />);

            // Initially shows verification
            expect(screen.getByTestId('verify-code-card')).toBeInTheDocument();

            // Update state to show tabs
            mockUseAuthFlowState.mockReturnValue({
                ...defaultAuthFlowState,
                needsConfirmation: false,
                showForgotPassword: false,
                resetAuthFlow: mockResetAuthFlow,
            });

            rerender(<AuthForm />);

            // Now shows tabs
            expect(screen.getByText('Sign In')).toBeInTheDocument();
            expect(screen.getByText('Sign Up')).toBeInTheDocument();
            expect(
                screen.queryByTestId('verify-code-card')
            ).not.toBeInTheDocument();
        });
    });

    describe('Tab structure', () => {
        it('Should render tabs with correct default value', () => {
            render(<AuthForm />);

            const tabsList = screen.getByRole('tablist');
            expect(tabsList).toBeInTheDocument();
        });

        it('Should have both sign in and sign up tabs', () => {
            render(<AuthForm />);

            const signInTab = screen.getByRole('tab', { name: /sign in/i });
            const signUpTab = screen.getByRole('tab', { name: /sign up/i });

            expect(signInTab).toBeInTheDocument();
            expect(signUpTab).toBeInTheDocument();
        });

        it('Should render both tab panels', () => {
            render(<AuthForm />);

            expect(screen.getByTestId('sign-in-tab')).toBeInTheDocument();
            expect(screen.getByTestId('sign-up-tab')).toBeInTheDocument();
        });

        it('Should have correct CSS classes on tabs container', () => {
            render(<AuthForm />);

            const tabsList = screen.getByRole('tablist');
            expect(tabsList).toHaveClass('grid', 'w-full', 'grid-cols-2');
        });
    });
});
