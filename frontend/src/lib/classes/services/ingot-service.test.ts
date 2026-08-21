import { IngotService } from './ingot-service';
import MappingHelpers from '../helpers/mapping-helpers';
import { IngotContent } from '@/lib/types/ingot-types';

// Mock dependencies
jest.mock('../helpers/mapping-helpers');

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

describe('IngotService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockIngotContent: IngotContent = {
        fields: {},
        billetFormat: null,
        billets: [],
    };

    const mockApiIngot = {
        id: '123',
        name: 'Test Ingot',
        type: 'ingot_experience',
        content: JSON.stringify(mockIngotContent),
        owner: 'user-123',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
    };

    describe('createIngot', () => {
        it('should POST to /ingot and return the mapped object', async () => {
            mockApiPost.mockResolvedValue(mockApiIngot);

            const result = await IngotService.createIngot(
                'ingot_experience',
                'Test Ingot',
                mockIngotContent
            );

            expect(mockApiPost).toHaveBeenCalledWith('/ingot', {
                name: 'Test Ingot',
                type: 'ingot_experience',
                content: JSON.stringify(mockIngotContent),
            });
            expect(result).toEqual({
                id: '123',
                name: 'Test Ingot',
                type: 'ingot_experience',
                content: mockIngotContent,
                createdAt: '2023-01-01',
                updatedAt: '2023-01-01',
            });
        });

        it('should propagate API errors', async () => {
            mockApiPost.mockRejectedValue(new Error('Request failed'));

            await expect(
                IngotService.createIngot(
                    'ingot_experience',
                    'Test Ingot',
                    mockIngotContent
                )
            ).rejects.toThrow('Request failed');
        });
    });

    describe('getIngot', () => {
        it('should GET /ingot/:id and return the mapped object', async () => {
            mockApiGet.mockResolvedValue(mockApiIngot);

            const result = await IngotService.getIngot('123');

            expect(mockApiGet).toHaveBeenCalledWith('/ingot/123');
            expect(result).toEqual(expect.objectContaining({ id: '123' }));
        });

        it('should return null on 404', async () => {
            const error = new Error('Not found');
            (error as unknown as { status: number }).status = 404;
            mockApiGet.mockRejectedValue(error);

            const result = await IngotService.getIngot('999');

            expect(result).toBeNull();
        });

        it('should rethrow non-404 errors', async () => {
            mockApiGet.mockRejectedValue(new Error('Server error'));

            await expect(IngotService.getIngot('123')).rejects.toThrow(
                'Server error'
            );
        });
    });

    describe('listIngots', () => {
        it('should GET /ingot and return mapped items', async () => {
            mockApiGet.mockResolvedValue({ items: [mockApiIngot] });

            const result = await IngotService.listIngots();

            expect(mockApiGet).toHaveBeenCalledWith('/ingot', {});
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('123');
        });

        it('should pass type filter as query param', async () => {
            mockApiGet.mockResolvedValue({ items: [] });

            await IngotService.listIngots('ingot_experience');

            expect(mockApiGet).toHaveBeenCalledWith('/ingot', {
                type: 'ingot_experience',
            });
        });
    });

    describe('listAnvilIngotData', () => {
        it('should GET /ingot with fields query param', async () => {
            mockApiGet.mockResolvedValue({ items: [mockApiIngot] });

            await IngotService.listAnvilIngotData();

            expect(mockApiGet).toHaveBeenCalledWith('/ingot', {
                fields: 'id,name,type,updatedAt',
            });
        });
    });

    describe('updateIngot', () => {
        it('should PUT /ingot/:id with name and content', async () => {
            const updatedIngot = { ...mockApiIngot, name: 'Updated Name' };
            mockApiPut.mockResolvedValue(updatedIngot);

            const result = await IngotService.updateIngot(
                '123',
                'Updated Name',
                mockIngotContent
            );

            expect(mockApiPut).toHaveBeenCalledWith('/ingot/123', {
                name: 'Updated Name',
                content: JSON.stringify(mockIngotContent),
            });
            expect(result.name).toBe('Updated Name');
        });
    });

    describe('deleteIngot', () => {
        it('should DELETE /ingot/:id', async () => {
            mockApiDelete.mockResolvedValue({});

            await IngotService.deleteIngot('123');

            expect(mockApiDelete).toHaveBeenCalledWith('/ingot/123');
        });
    });

    describe('deleteAllIngots', () => {
        it('should list all then delete each', async () => {
            mockApiGet.mockResolvedValue({
                items: [
                    { ...mockApiIngot, id: '1' },
                    { ...mockApiIngot, id: '2' },
                ],
            });
            mockApiDelete.mockResolvedValue({});

            await IngotService.deleteAllIngots();

            expect(mockApiGet).toHaveBeenCalledWith('/ingot', {});
            expect(mockApiDelete).toHaveBeenCalledTimes(2);
            expect(mockApiDelete).toHaveBeenCalledWith('/ingot/1');
            expect(mockApiDelete).toHaveBeenCalledWith('/ingot/2');
        });
    });

    describe('getAnvilCardDisplayDetails', () => {
        it('should return display details for a known type', () => {
            (MappingHelpers.getIngotLabelByType as jest.Mock).mockReturnValue(
                'Experience'
            );

            const result =
                IngotService.getAnvilCardDisplayDetails('ingot_experience');

            expect(result.label).toBe('Experience');
            expect(result.color).toBe('bg-emerald-500');
            expect(result.icon).toBeDefined();
        });

        it('should return default details for unknown type', () => {
            (MappingHelpers.getIngotLabelByType as jest.Mock).mockReturnValue(
                'Unknown'
            );

            const result =
                IngotService.getAnvilCardDisplayDetails('unknown_type');

            expect(result.color).toBe('bg-slate-500');
        });
    });
});
