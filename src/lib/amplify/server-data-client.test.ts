describe('server-data-client', () => {
    let generateServerClientUsingCookies: jest.Mock;
    let cookies: jest.Mock;

    beforeEach(() => {
        // Reset modules to ensure a clean state for each test
        jest.resetModules();

        generateServerClientUsingCookies = jest.fn(() => 'mock-client');
        cookies = jest.fn();

        // Mock @aws-amplify/adapter-nextjs/data to intercept client generation
        jest.doMock('@aws-amplify/adapter-nextjs/data', () => ({
            generateServerClientUsingCookies,
        }));

        // Mock next/headers to avoid actual server-side cookie access
        jest.doMock('next/headers', () => ({
            cookies,
        }));

        // Mock the generated amplify_outputs.json file
        jest.doMock(
            '../../../amplify_outputs.json',
            () => ({
                some: 'config',
            }),
            { virtual: true }
        );
    });

    it('generates server client with correct config', async () => {
        // Import the module to trigger the code execution
        const { serverClient } = await import('./server-data-client');

        // Verify that generateServerClientUsingCookies was called with the expected configuration
        expect(generateServerClientUsingCookies).toHaveBeenCalledWith({
            config: expect.objectContaining({ some: 'config' }),
            cookies: cookies,
        });

        // Verify that the exported client is the one returned by the mock
        expect(serverClient).toBe('mock-client');
    });
});
