/**
 * Global mock setup for Jest
 */

// Mock AWS Amplify globally to prevent real API calls during tests
jest.mock('aws-amplify/auth', () => ({
    resetPassword: jest.fn(),
    confirmResetPassword: jest.fn(),
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    getCurrentUser: jest.fn(),
    confirmSignUp: jest.fn(),
    resendSignUpCode: jest.fn(),
}));

// Mock ResizeObserver (Needed for OTP component)
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// Mock document.elementFromPoint
document.elementFromPoint = jest.fn();
