import { ingotApi } from './ingot';
import { apiGet, apiPost, apiPut, apiDelete } from './client';

jest.mock('./client');

const mockApiGet = apiGet as jest.Mock;
const mockApiPost = apiPost as jest.Mock;
const mockApiPut = apiPut as jest.Mock;
const mockApiDelete = apiDelete as jest.Mock;

beforeEach(() => {
    jest.clearAllMocks();
});

const mockIngotApiResponse = {
    id: 'ingot-1',
    name: 'My Education',
    type: 'ingot_education',
    content: JSON.stringify({
        fields: {
            institution: { value: 'MIT', mandatory: true, inputType: 'text' },
        },
        billetFormat: null,
        billets: [],
    }),
    owner: 'user-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
};

describe('ingotApi', () => {
    describe('getIngot', () => {
        it('fetches a single ingot by ID and maps the response', async () => {
            mockApiGet.mockResolvedValue(mockIngotApiResponse);

            const result = await ingotApi.getIngot('ingot-1');

            expect(mockApiGet).toHaveBeenCalledWith('/ingot/ingot-1');
            expect(result).toEqual({
                id: 'ingot-1',
                name: 'My Education',
                type: 'ingot_education',
                content: {
                    fields: {
                        institution: {
                            value: 'MIT',
                            mandatory: true,
                            inputType: 'text',
                        },
                    },
                    billetFormat: null,
                    billets: [],
                },
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-02T00:00:00Z',
            });
        });

        it('propagates errors from the API client', async () => {
            mockApiGet.mockRejectedValue(new Error('Network error'));

            await expect(ingotApi.getIngot('ingot-1')).rejects.toThrow(
                'Network error'
            );
        });
    });

    describe('getAllIngots', () => {
        it('fetches all ingots and maps each response', async () => {
            mockApiGet.mockResolvedValue({
                items: [mockIngotApiResponse],
            });

            const result = await ingotApi.getAllIngots();

            expect(mockApiGet).toHaveBeenCalledWith('/ingot', {});
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('ingot-1');
            expect(result[0].content.fields).toBeDefined();
        });

        it('passes type filter as query param', async () => {
            mockApiGet.mockResolvedValue({ items: [] });

            await ingotApi.getAllIngots('ingot_education');

            expect(mockApiGet).toHaveBeenCalledWith('/ingot', {
                type: 'ingot_education',
            });
        });

        it('returns empty array when no ingots exist', async () => {
            mockApiGet.mockResolvedValue({ items: [] });

            const result = await ingotApi.getAllIngots();

            expect(result).toEqual([]);
        });
    });

    describe('createIngot', () => {
        it('posts a new ingot with stringified content', async () => {
            mockApiPost.mockResolvedValue(mockIngotApiResponse);

            const content = {
                fields: {
                    institution: {
                        value: 'MIT',
                        mandatory: true,
                        inputType: 'text' as const,
                    },
                },
                billetFormat: null,
                billets: [],
            };

            const result = await ingotApi.createIngot(
                'ingot_education',
                'My Education',
                content
            );

            expect(mockApiPost).toHaveBeenCalledWith('/ingot', {
                name: 'My Education',
                type: 'ingot_education',
                content: JSON.stringify(content),
            });
            expect(result.id).toBe('ingot-1');
        });
    });

    describe('updateIngot', () => {
        it('puts an updated ingot with stringified content', async () => {
            mockApiPut.mockResolvedValue(mockIngotApiResponse);

            const content = {
                fields: {
                    institution: {
                        value: 'MIT',
                        mandatory: true,
                        inputType: 'text' as const,
                    },
                },
                billetFormat: null,
                billets: [],
            };

            const result = await ingotApi.updateIngot(
                'ingot-1',
                'My Education',
                content
            );

            expect(mockApiPut).toHaveBeenCalledWith('/ingot/ingot-1', {
                name: 'My Education',
                content: JSON.stringify(content),
            });
            expect(result.id).toBe('ingot-1');
        });
    });

    describe('deleteIngot', () => {
        it('deletes an ingot by ID', async () => {
            mockApiDelete.mockResolvedValue(undefined);

            await ingotApi.deleteIngot('ingot-1');

            expect(mockApiDelete).toHaveBeenCalledWith('/ingot/ingot-1');
        });
    });

    describe('content mapping', () => {
        it('handles content as empty string gracefully', async () => {
            mockApiGet.mockResolvedValue({
                ...mockIngotApiResponse,
                content: '',
            });

            const result = await ingotApi.getIngot('ingot-1');

            expect(result.content).toEqual({});
        });

        it('handles content as invalid JSON gracefully', async () => {
            mockApiGet.mockResolvedValue({
                ...mockIngotApiResponse,
                content: 'not-json{{{',
            });

            const result = await ingotApi.getIngot('ingot-1');

            expect(result.content).toEqual({});
        });

        it('handles missing content field gracefully', async () => {
            mockApiGet.mockResolvedValue({
                ...mockIngotApiResponse,
                content: undefined,
            });

            const result = await ingotApi.getIngot('ingot-1');

            expect(result.content).toEqual({});
        });
    });
});
