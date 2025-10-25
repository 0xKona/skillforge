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
}));
