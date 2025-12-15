import type * as ServerUtils from './server-utils';

describe('server-utils', () => {
    let mockRunWithAmplifyServerContext: jest.Mock;
    let getAuthenticatedUser: typeof ServerUtils.getAuthenticatedUser;
    let getUserAttributes: typeof ServerUtils.getUserAttributes;
    let isAuthenticated: typeof ServerUtils.isAuthenticated;
    let fetchAuthSession: jest.Mock;
    let fetchUserAttributes: jest.Mock;
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(async () => {
        // Reset modules to ensure a clean state for each test
        jest.resetModules();

        // Spy on console.error to suppress expected error logs during tests
        consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        mockRunWithAmplifyServerContext = jest.fn();

        // Mock @aws-amplify/adapter-nextjs to intercept createServerRunner
        jest.doMock('@aws-amplify/adapter-nextjs', () => ({
            createServerRunner: jest.fn(() => ({
                runWithAmplifyServerContext: mockRunWithAmplifyServerContext,
            })),
        }));

        // Mock next/headers to avoid actual server-side cookie access
        jest.doMock('next/headers', () => ({
            cookies: jest.fn(),
        }));

        // Mock aws-amplify/auth/server functions
        jest.doMock('aws-amplify/auth/server', () => ({
            fetchAuthSession: jest.fn(),
            fetchUserAttributes: jest.fn(),
        }));

        // Mock the generated amplify_outputs.json file
        jest.doMock('../../../amplify_outputs.json', () => ({}), {
            virtual: true,
        });

        // Import the module under test using dynamic import to apply mocks
        const utils = await import('./server-utils');
        getAuthenticatedUser = utils.getAuthenticatedUser;
        getUserAttributes = utils.getUserAttributes;
        isAuthenticated = utils.isAuthenticated;

        // Import mocked auth functions to control their behavior in tests
        const auth = await import('aws-amplify/auth/server');
        fetchAuthSession = auth.fetchAuthSession as unknown as jest.Mock;
        fetchUserAttributes = auth.fetchUserAttributes as unknown as jest.Mock;
    });

    afterEach(() => {
        // Restore console.error after each test
        consoleErrorSpy.mockRestore();
    });

    describe('getAuthenticatedUser', () => {
        it('returns session when tokens exist', async () => {
            const mockSession = { tokens: { accessToken: 'token' } };

            // Mock the context runner to execute the operation immediately
            mockRunWithAmplifyServerContext.mockImplementation(
                async ({
                    operation,
                }: {
                    operation: (context: unknown) => Promise<unknown>;
                }) => {
                    return operation({});
                }
            );

            fetchAuthSession.mockResolvedValue(mockSession);

            const result = await getAuthenticatedUser();

            expect(result).toEqual(mockSession);
            expect(mockRunWithAmplifyServerContext).toHaveBeenCalled();
            expect(fetchAuthSession).toHaveBeenCalled();
        });

        it('returns null when tokens do not exist', async () => {
            const mockSession = { tokens: undefined };

            // Mock the context runner to execute the operation immediately
            mockRunWithAmplifyServerContext.mockImplementation(
                async ({
                    operation,
                }: {
                    operation: (context: unknown) => Promise<unknown>;
                }) => {
                    return operation({});
                }
            );

            fetchAuthSession.mockResolvedValue(mockSession);

            const result = await getAuthenticatedUser();

            expect(result).toBeNull();
        });

        it('returns null when an error occurs', async () => {
            // Simulate an error during the Amplify server context execution
            mockRunWithAmplifyServerContext.mockRejectedValue(
                new Error('Auth error')
            );

            const result = await getAuthenticatedUser();

            expect(result).toBeNull();
        });
    });

    describe('getUserAttributes', () => {
        it('returns attributes on success', async () => {
            const mockAttributes = { email: 'test@example.com' };

            // Mock the context runner to execute the operation immediately
            mockRunWithAmplifyServerContext.mockImplementation(
                async ({
                    operation,
                }: {
                    operation: (context: unknown) => Promise<unknown>;
                }) => {
                    return operation({});
                }
            );

            fetchUserAttributes.mockResolvedValue(mockAttributes);

            const result = await getUserAttributes();

            expect(result).toEqual(mockAttributes);
            expect(fetchUserAttributes).toHaveBeenCalled();
        });

        it('returns null on error', async () => {
            // Simulate an error during attribute fetching
            mockRunWithAmplifyServerContext.mockRejectedValue(
                new Error('Fetch error')
            );

            const result = await getUserAttributes();

            expect(result).toBeNull();
        });
    });

    describe('isAuthenticated', () => {
        it('returns true when user has tokens', async () => {
            const mockSession = { tokens: { accessToken: 'token' } };

            // Mock the context runner to execute the operation immediately
            mockRunWithAmplifyServerContext.mockImplementation(
                async ({
                    operation,
                }: {
                    operation: (context: unknown) => Promise<unknown>;
                }) => {
                    return operation({});
                }
            );

            fetchAuthSession.mockResolvedValue(mockSession);

            const result = await isAuthenticated();

            expect(result).toBe(true);
        });

        it('returns false when user has no tokens', async () => {
            const mockSession = { tokens: undefined };

            // Mock the context runner to execute the operation immediately
            mockRunWithAmplifyServerContext.mockImplementation(
                async ({
                    operation,
                }: {
                    operation: (context: unknown) => Promise<unknown>;
                }) => {
                    return operation({});
                }
            );

            fetchAuthSession.mockResolvedValue(mockSession);

            const result = await isAuthenticated();

            expect(result).toBe(false);
        });

        it('returns false when error occurs', async () => {
            // Simulate an error during authentication check
            mockRunWithAmplifyServerContext.mockRejectedValue(
                new Error('Auth error')
            );

            const result = await isAuthenticated();

            expect(result).toBe(false);
        });
    });
});
