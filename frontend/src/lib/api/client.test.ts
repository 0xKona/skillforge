import { apiGet, apiPost, apiPut, apiDelete, ApiError } from './client';

// Mock dependencies
jest.mock('aws-amplify/auth', () => ({
    fetchAuthSession: jest.fn(),
}));

jest.mock('@/lib/store/use-auth', () => ({
    useAuth: {
        getState: () => ({
            signOut: jest.fn(),
        }),
    },
}));

jest.mock('@/lib/config/backend-config', () => ({
    backendConfig: {
        apiUrl: 'https://api.test.com',
    },
}));

import { fetchAuthSession } from 'aws-amplify/auth';
import { useAuth } from '@/lib/store/use-auth';

const mockFetchAuthSession = fetchAuthSession as jest.Mock;
const mockSignOut = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    (useAuth.getState as jest.Mock) = jest.fn(() => ({ signOut: mockSignOut }));
    mockFetchAuthSession.mockResolvedValue({
        tokens: { idToken: { toString: () => 'mock-token' } },
    });
});

describe('API Client', () => {
    describe('authentication', () => {
        it('attaches the auth token to requests', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ id: '1' }),
            });

            await apiGet('/test');

            expect(global.fetch).toHaveBeenCalledWith(
                'https://api.test.com/test',
                expect.objectContaining({
                    headers: expect.objectContaining({
                        Authorization: 'Bearer mock-token',
                    }),
                })
            );
        });

        it('throws ApiError 401 when no token is available', async () => {
            mockFetchAuthSession.mockResolvedValue({ tokens: null });

            await expect(apiGet('/test')).rejects.toThrow(ApiError);
            await expect(apiGet('/test')).rejects.toMatchObject({
                status: 401,
                message: 'Not authenticated',
            });
        });

        it('calls signOut on 401 from missing token', async () => {
            mockFetchAuthSession.mockResolvedValue({ tokens: null });

            await expect(apiGet('/test')).rejects.toThrow();
            expect(mockSignOut).toHaveBeenCalled();
        });

        it('calls signOut on 401 response from server', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: false,
                status: 401,
                json: () => Promise.resolve({ error: 'Token expired' }),
            });

            await expect(apiGet('/test')).rejects.toThrow();
            expect(mockSignOut).toHaveBeenCalled();
        });
    });

    describe('apiGet', () => {
        it('makes a GET request and returns parsed JSON', async () => {
            const mockData = { id: '1', name: 'Test' };
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(mockData),
            });

            const result = await apiGet('/ingot/1');

            expect(global.fetch).toHaveBeenCalledWith(
                'https://api.test.com/ingot/1',
                expect.objectContaining({ method: 'GET', body: undefined })
            );
            expect(result).toEqual(mockData);
        });

        it('appends query params when provided', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ items: [] }),
            });

            await apiGet('/ingot', { type: 'ingot_education' });

            expect(global.fetch).toHaveBeenCalledWith(
                'https://api.test.com/ingot?type=ingot_education',
                expect.anything()
            );
        });

        it('filters out empty query params', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ items: [] }),
            });

            await apiGet('/ingot', { type: '', name: 'test' });

            expect(global.fetch).toHaveBeenCalledWith(
                'https://api.test.com/ingot?name=test',
                expect.anything()
            );
        });
    });

    describe('apiPost', () => {
        it('makes a POST request with JSON body', async () => {
            const mockResponse = { id: '1', name: 'New Ingot' };
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(mockResponse),
            });

            const body = { name: 'New Ingot', type: 'ingot_education' };
            const result = await apiPost('/ingot', body);

            expect(global.fetch).toHaveBeenCalledWith(
                'https://api.test.com/ingot',
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify(body),
                })
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('apiPut', () => {
        it('makes a PUT request with JSON body', async () => {
            const mockResponse = { id: '1', name: 'Updated' };
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(mockResponse),
            });

            const body = { name: 'Updated' };
            const result = await apiPut('/ingot/1', body);

            expect(global.fetch).toHaveBeenCalledWith(
                'https://api.test.com/ingot/1',
                expect.objectContaining({
                    method: 'PUT',
                    body: JSON.stringify(body),
                })
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('apiDelete', () => {
        it('makes a DELETE request', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({}),
            });

            await apiDelete('/ingot/1');

            expect(global.fetch).toHaveBeenCalledWith(
                'https://api.test.com/ingot/1',
                expect.objectContaining({ method: 'DELETE', body: undefined })
            );
        });
    });

    describe('error handling', () => {
        it('throws ApiError with status and message from error body', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: false,
                status: 404,
                json: () => Promise.resolve({ error: 'Ingot not found' }),
            });

            await expect(apiGet('/ingot/999')).rejects.toMatchObject({
                status: 404,
                message: 'Ingot not found',
            });
        });

        it('throws ApiError with fallback message when body has no error field', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: false,
                status: 500,
                json: () => Promise.resolve({}),
            });

            await expect(apiGet('/ingot/1')).rejects.toMatchObject({
                status: 500,
                message: 'Request failed with status 500',
            });
        });

        it('throws ApiError with fallback when body is not parseable JSON', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: false,
                status: 502,
                json: () => Promise.reject(new Error('not json')),
            });

            await expect(apiGet('/ingot/1')).rejects.toMatchObject({
                status: 502,
                message: 'Request failed with status 502',
            });
        });

        it('does not call signOut on non-401 errors', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: false,
                status: 500,
                json: () => Promise.resolve({ error: 'Server error' }),
            });

            await expect(apiGet('/test')).rejects.toThrow();
            expect(mockSignOut).not.toHaveBeenCalled();
        });
    });
});
