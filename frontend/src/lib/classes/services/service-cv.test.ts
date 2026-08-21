import { CvService } from './service-cv';
import { CvContent } from '@/lib/types/cv-types';

// Mock the API client module
jest.mock('@/lib/api/client', () => ({
    apiGet: jest.fn(),
    apiPost: jest.fn(),
    apiPut: jest.fn(),
    apiDelete: jest.fn(),
}));

import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client';

const mockApiGet = apiGet as jest.Mock;
const mockApiPost = apiPost as jest.Mock;
const mockApiPut = apiPut as jest.Mock;
const mockApiDelete = apiDelete as jest.Mock;

describe('CvService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockCvContent: CvContent = { sections: [] };

    const mockApiCv = {
        id: 'cv-123',
        title: 'My CV',
        description: 'A test CV',
        version: 1,
        cvContent: JSON.stringify(mockCvContent),
        owner: 'user-123',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
    };

    describe('createCv', () => {
        it('should POST to /cv and return the mapped CV', async () => {
            mockApiPost.mockResolvedValue(mockApiCv);

            const result = await CvService.createCv({
                title: 'My CV',
                description: 'A test CV',
                version: 1,
                cvContent: mockCvContent,
            });

            expect(mockApiPost).toHaveBeenCalledWith('/cv', {
                title: 'My CV',
                description: 'A test CV',
                version: 1,
                cvContent: JSON.stringify(mockCvContent),
            });
            expect(result).toEqual({
                id: 'cv-123',
                title: 'My CV',
                description: 'A test CV',
                version: 1,
                cvContent: mockCvContent,
                createdAt: '2023-01-01',
                updatedAt: '2023-01-01',
            });
        });

        it('should propagate API errors', async () => {
            mockApiPost.mockRejectedValue(new Error('Request failed'));

            await expect(
                CvService.createCv({
                    title: 'Test',
                    version: 1,
                    cvContent: mockCvContent,
                })
            ).rejects.toThrow('Request failed');
        });
    });

    describe('getCv', () => {
        it('should GET /cv/:id and return the mapped CV', async () => {
            mockApiGet.mockResolvedValue(mockApiCv);

            const result = await CvService.getCv('cv-123');

            expect(mockApiGet).toHaveBeenCalledWith('/cv/cv-123');
            expect(result).toEqual(
                expect.objectContaining({ id: 'cv-123', title: 'My CV' })
            );
        });

        it('should return null on 404', async () => {
            const error = new Error('Not found');
            (error as unknown as { status: number }).status = 404;
            mockApiGet.mockRejectedValue(error);

            const result = await CvService.getCv('cv-999');

            expect(result).toBeNull();
        });

        it('should rethrow non-404 errors', async () => {
            mockApiGet.mockRejectedValue(new Error('Server error'));

            await expect(CvService.getCv('cv-123')).rejects.toThrow(
                'Server error'
            );
        });
    });

    describe('listCvs', () => {
        it('should GET /cv and return mapped items', async () => {
            mockApiGet.mockResolvedValue({ items: [mockApiCv] });

            const result = await CvService.listCvs();

            expect(mockApiGet).toHaveBeenCalledWith('/cv');
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('cv-123');
        });

        it('should return empty array when no CVs exist', async () => {
            mockApiGet.mockResolvedValue({ items: [] });

            const result = await CvService.listCvs();

            expect(result).toEqual([]);
        });
    });

    describe('updateCv', () => {
        it('should PUT /cv/:id with updated fields', async () => {
            const updatedCv = { ...mockApiCv, title: 'Updated CV' };
            mockApiPut.mockResolvedValue(updatedCv);

            const result = await CvService.updateCv({
                id: 'cv-123',
                title: 'Updated CV',
                description: 'A test CV',
                version: 2,
                cvContent: mockCvContent,
                createdAt: '2023-01-01',
                updatedAt: '2023-01-01',
            });

            expect(mockApiPut).toHaveBeenCalledWith('/cv/cv-123', {
                title: 'Updated CV',
                description: 'A test CV',
                version: 2,
                cvContent: JSON.stringify(mockCvContent),
            });
            expect(result.title).toBe('Updated CV');
        });
    });

    describe('deleteCv', () => {
        it('should DELETE /cv/:id', async () => {
            mockApiDelete.mockResolvedValue({});

            await CvService.deleteCv('cv-123');

            expect(mockApiDelete).toHaveBeenCalledWith('/cv/cv-123');
        });
    });

    describe('deleteAllCvs', () => {
        it('should list all then delete each', async () => {
            mockApiGet.mockResolvedValue({
                items: [
                    { ...mockApiCv, id: 'cv-1' },
                    { ...mockApiCv, id: 'cv-2' },
                ],
            });
            mockApiDelete.mockResolvedValue({});

            await CvService.deleteAllCvs();

            expect(mockApiGet).toHaveBeenCalledWith('/cv');
            expect(mockApiDelete).toHaveBeenCalledTimes(2);
            expect(mockApiDelete).toHaveBeenCalledWith('/cv/cv-1');
            expect(mockApiDelete).toHaveBeenCalledWith('/cv/cv-2');
        });
    });
});
