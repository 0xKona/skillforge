/**
 * Test utility functions and helpers
 *
 * This file provides reusable test setup functions to reduce
 * boilerplate in individual test files.
 */

/**
 * Default mock values for password reset store
 */
export const defaultPasswordResetStoreState = {
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

/**
 * Default mock values for auth flow state
 */
export const defaultAuthFlowState = {
    needsConfirmation: false,
    showForgotPassword: false,
    verificationEmail: '',
    setNeedsConfirmation: jest.fn(),
    setShowForgotPassword: jest.fn(),
    setVerificationEmail: jest.fn(),
    resetAuthFlow: jest.fn(),
};
