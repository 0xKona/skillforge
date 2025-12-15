import { render, screen } from '@testing-library/react';
import ForgotPassword from './forgot-password';
import { useRequestPasswordResetStore } from '@/lib/store/use-password-reset';
import { defaultPasswordResetStoreState } from '@/test-utils/test-helpers';

// Mock the Zustand store that manages password reset state
jest.mock('@/lib/store/use-password-reset');

// Mock the child components - we only care which component is rendered, not how it works
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

describe('ForgotPassword Component', () => {
    const mockUseRequestPasswordResetStore =
        useRequestPasswordResetStore as jest.MockedFunction<
            typeof useRequestPasswordResetStore
        >;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Should render RequestPasswordResetForm when codeSent is false', () => {
        mockUseRequestPasswordResetStore.mockReturnValue({
            ...defaultPasswordResetStoreState,
            codeSent: false,
        });

        render(<ForgotPassword />);

        expect(
            screen.getByTestId('request-password-reset-form')
        ).toBeInTheDocument();

        expect(
            screen.queryByTestId('password-reset-form')
        ).not.toBeInTheDocument();
    });

    it('Should render PasswordResetForm when codeSent is true', () => {
        mockUseRequestPasswordResetStore.mockReturnValue({
            ...defaultPasswordResetStoreState,
            codeSent: true,
        });

        render(<ForgotPassword />);

        expect(screen.getByTestId('password-reset-form')).toBeInTheDocument();
        expect(
            screen.queryByTestId('request-password-reset-form')
        ).not.toBeInTheDocument();
    });

    it('Should transition from request form to reset form when state changes', () => {
        mockUseRequestPasswordResetStore.mockReturnValue({
            ...defaultPasswordResetStoreState,
            providedEmail: '',
            codeSent: false,
        });

        const { rerender } = render(<ForgotPassword />);

        expect(
            screen.getByTestId('request-password-reset-form')
        ).toBeInTheDocument();

        mockUseRequestPasswordResetStore.mockReturnValue({
            ...defaultPasswordResetStoreState,
            providedEmail: 'test@example.com',
            codeSent: true,
        });

        rerender(<ForgotPassword />);

        expect(screen.getByTestId('password-reset-form')).toBeInTheDocument();
        expect(
            screen.queryByTestId('request-password-reset-form')
        ).not.toBeInTheDocument();
    });
});
