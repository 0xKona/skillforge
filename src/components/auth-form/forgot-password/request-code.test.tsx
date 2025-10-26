// Mock the Zustand stores
jest.mock('@/store/password-reset');
jest.mock('@/store/auth-form');

// Mock only the custom components
jest.mock('../form-header', () => {
    return function MockFormHeader() {
        return <div data-testid="form-header">Form Header</div>;
    };
});

jest.mock('@/components/ui/form-input', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function MockFormInput({ inputName, label }: any) {
        return (
            <div data-testid={`form-input-${inputName}`}>
                <label>{label}</label>
            </div>
        );
    };
});

jest.mock('../submit-form', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function MockSubmitAuthForm({ buttonText, isLoading }: any) {
        return (
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Loading...' : buttonText}
            </button>
        );
    };
});

describe('RequestPasswordResetForm Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Should render the form with all elements', () => {});

    // Should be able to type in email

    // Should be able to cancel

    // Should be able to type in email and request code

    // Should not be able to request code if no email supplied

    // Should not be able to request code is an invalid input (not email) is supplied.
});
