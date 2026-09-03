import { cvApi } from './cv';
import { apiGet, apiPost, apiPut, apiDelete } from './client';

jest.mock('./client');

const mockApiGet = apiGet as jest.Mock;
const mockApiPost = apiPost as jest.Mock;
const mockApiPut = apiPut as jest.Mock;
const mockApiDelete = apiDelete as jest.Mock;

beforeEach(() => {
    jest.clearAllMocks();
});

const mockCvApiResponse = {
    id: 'cv-1',
    title: 'My CV',
    description: 'A test CV',
    version: 1,
    cvContent: JSON.stringify({
        sections: [
            {
                id: 'section-1',
                type: 'experience',
                title: 'Experience',
                visible: true,
                items: [{ id: 'item-1', fields: { companyName: 'Acme' } }],
            },
        ],
    }),
    owner: 'user-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
};

describe('cvApi', () => {
    describe('getCvById', () => {
        it('fetches a CV by ID and maps the response', async () => {
            mockApiGet.mockResolvedValue(mockCvApiResponse);

            const result = await cvApi.getCvById('cv-1');

            expect(mockApiGet).toHaveBeenCalledWith('/cv/cv-1');
            expect(result).toEqual({
                id: 'cv-1',
                title: 'My CV',
                description: 'A test CV',
                version: 1,
                content: {
                    sections: [
                        {
                            id: 'section-1',
                            type: 'experience',
                            title: 'Experience',
                            visible: true,
                            items: [
                                {
                                    id: 'item-1',
                                    fields: { companyName: 'Acme' },
                                },
                            ],
                        },
                    ],
                },
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-02T00:00:00Z',
            });
        });

        it('propagates errors from the API client', async () => {
            mockApiGet.mockRejectedValue(new Error('Not found'));

            await expect(cvApi.getCvById('cv-999')).rejects.toThrow(
                'Not found'
            );
        });
    });

    describe('getAllCvsForUser', () => {
        it('fetches all CVs and maps each response', async () => {
            mockApiGet.mockResolvedValue({
                items: [mockCvApiResponse],
            });

            const result = await cvApi.getAllCvsForUser();

            expect(mockApiGet).toHaveBeenCalledWith('/cv');
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('cv-1');
            expect(result[0].content.sections).toHaveLength(1);
        });

        it('returns empty array when no CVs exist', async () => {
            mockApiGet.mockResolvedValue({ items: [] });

            const result = await cvApi.getAllCvsForUser();

            expect(result).toEqual([]);
        });
    });

    describe('createCv', () => {
        it('posts a new CV with stringified content', async () => {
            mockApiPost.mockResolvedValue(mockCvApiResponse);

            const newCv = {
                title: 'My CV',
                description: 'A test CV',
                version: 1,
                content: { sections: [] },
            };

            const result = await cvApi.createCv(newCv);

            expect(mockApiPost).toHaveBeenCalledWith('/cv', {
                title: 'My CV',
                description: 'A test CV',
                version: 1,
                cvContent: JSON.stringify({ sections: [] }),
            });
            expect(result.id).toBe('cv-1');
        });
    });

    describe('updateCv', () => {
        it('puts an updated CV with stringified content', async () => {
            mockApiPut.mockResolvedValue(mockCvApiResponse);

            const cv = {
                id: 'cv-1',
                title: 'Updated CV',
                description: 'Updated',
                version: 2,
                content: { sections: [] },
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-02T00:00:00Z',
            };

            const result = await cvApi.updateCv(cv);

            expect(mockApiPut).toHaveBeenCalledWith('/cv/cv-1', {
                title: 'Updated CV',
                description: 'Updated',
                version: 2,
                cvContent: JSON.stringify({ sections: [] }),
            });
            expect(result.id).toBe('cv-1');
        });
    });

    describe('deleteCvById', () => {
        it('deletes a CV by ID', async () => {
            mockApiDelete.mockResolvedValue(undefined);

            await cvApi.deleteCvById('cv-1');

            expect(mockApiDelete).toHaveBeenCalledWith('/cv/cv-1');
        });
    });

    describe('content mapping', () => {
        it('handles content as empty string gracefully', async () => {
            mockApiGet.mockResolvedValue({
                ...mockCvApiResponse,
                cvContent: '',
            });

            const result = await cvApi.getCvById('cv-1');

            expect(result.content).toEqual({ sections: [] });
        });

        it('handles content as invalid JSON gracefully', async () => {
            mockApiGet.mockResolvedValue({
                ...mockCvApiResponse,
                cvContent: '{broken',
            });

            const result = await cvApi.getCvById('cv-1');

            expect(result.content).toEqual({ sections: [] });
        });

        it('handles missing content field gracefully', async () => {
            mockApiGet.mockResolvedValue({
                ...mockCvApiResponse,
                cvContent: undefined,
            });

            const result = await cvApi.getCvById('cv-1');

            expect(result.content).toEqual({ sections: [] });
        });
    });
});
