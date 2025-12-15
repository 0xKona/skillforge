import { IngotService } from './ingot-service';
import { generateClient } from 'aws-amplify/data';
import MappingHelpers from '../helpers/mapping-helpers';
import { IngotContent } from '@/lib/types/ingot-types';

// Mock dependencies
jest.mock('../helpers/mapping-helpers');

// Mock AWS Amplify Data with a factory
jest.mock('aws-amplify/data', () => ({
    generateClient: jest.fn(() => ({
        models: {
            Ingot: {
                create: jest.fn(),
                get: jest.fn(),
                list: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
        },
    })),
}));

describe('IngotService', () => {
    let mockCreate: jest.Mock;
    let mockGet: jest.Mock;
    let mockList: jest.Mock;
    let mockUpdate: jest.Mock;
    let mockDelete: jest.Mock;

    beforeAll(() => {
        // Get the mock functions from the client instance created at module level
        const client = (generateClient as jest.Mock).mock.results[0].value;
        mockCreate = client.models.Ingot.create;
        mockGet = client.models.Ingot.get;
        mockList = client.models.Ingot.list;
        mockUpdate = client.models.Ingot.update;
        mockDelete = client.models.Ingot.delete;
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockIngotContent: IngotContent = {
        fields: {},
        billetFormat: null,
        billets: [],
    };

    const mockDbIngot = {
        id: '123',
        name: 'Test Ingot',
        type: 'ingot_experience',
        content: JSON.stringify(mockIngotContent),
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
    };

    describe('createIngot', () => {
        it('should create an ingot and return the mapped object', async () => {
            // Arrange
            mockCreate.mockResolvedValue({
                data: mockDbIngot,
                errors: undefined,
            });

            // Act
            const result = await IngotService.createIngot(
                'ingot_experience',
                'Test Ingot',
                mockIngotContent
            );

            // Assert
            expect(mockCreate).toHaveBeenCalledWith({
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

        it('should throw an error if creation fails', async () => {
            // Arrange
            mockCreate.mockResolvedValue({
                data: null,
                errors: [{ message: 'Creation failed' }],
            });

            // Act & Assert
            await expect(
                IngotService.createIngot(
                    'ingot_experience',
                    'Test Ingot',
                    mockIngotContent
                )
            ).rejects.toThrow('Failed to create Ingot: Creation failed');
        });
    });

    describe('getIngot', () => {
        it('should retrieve an ingot by ID', async () => {
            // Arrange
            mockGet.mockResolvedValue({ data: mockDbIngot, errors: undefined });

            // Act
            const result = await IngotService.getIngot('123');

            // Assert
            expect(mockGet).toHaveBeenCalledWith({ id: '123' });
            expect(result).toEqual(expect.objectContaining({ id: '123' }));
        });

        it('should return null if ingot is not found', async () => {
            // Arrange
            mockGet.mockResolvedValue({ data: null, errors: undefined });

            // Act
            const result = await IngotService.getIngot('999');

            // Assert
            expect(result).toBeNull();
        });

        it('should throw an error if retrieval fails', async () => {
            // Arrange
            mockGet.mockResolvedValue({
                data: null,
                errors: [{ message: 'Get failed' }],
            });

            // Act & Assert
            await expect(IngotService.getIngot('123')).rejects.toThrow(
                'Failed to get Ingot: Get failed'
            );
        });
    });

    describe('listIngots', () => {
        it('should list all ingots', async () => {
            // Arrange
            mockList.mockResolvedValue({
                data: [mockDbIngot],
                errors: undefined,
            });

            // Act
            const result = await IngotService.listIngots();

            // Assert
            expect(mockList).toHaveBeenCalledWith({ filter: undefined });
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('123');
        });

        it('should filter ingots by type', async () => {
            // Arrange
            mockList.mockResolvedValue({ data: [], errors: undefined });

            // Act
            await IngotService.listIngots('ingot_experience');

            // Assert
            expect(mockList).toHaveBeenCalledWith({
                filter: { type: { eq: 'ingot_experience' } },
            });
        });
    });

    describe('updateIngot', () => {
        it('should update an ingot', async () => {
            // Arrange
            const updatedDbIngot = { ...mockDbIngot, name: 'Updated Name' };
            mockUpdate.mockResolvedValue({
                data: updatedDbIngot,
                errors: undefined,
            });

            // Act
            const result = await IngotService.updateIngot(
                '123',
                'Updated Name',
                mockIngotContent
            );

            // Assert
            expect(mockUpdate).toHaveBeenCalledWith({
                id: '123',
                name: 'Updated Name',
                content: JSON.stringify(mockIngotContent),
            });
            expect(result.name).toBe('Updated Name');
        });
    });

    describe('deleteIngot', () => {
        it('should delete an ingot', async () => {
            // Arrange
            mockDelete.mockResolvedValue({ errors: undefined });

            // Act
            await IngotService.deleteIngot('123');

            // Assert
            expect(mockDelete).toHaveBeenCalledWith({ id: '123' });
        });
    });

    describe('deleteAllIngots', () => {
        it('should delete all ingots returned by list', async () => {
            // Arrange
            mockList.mockResolvedValue({
                data: [
                    { ...mockDbIngot, id: '1' },
                    { ...mockDbIngot, id: '2' },
                ],
                errors: undefined,
            });
            mockDelete.mockResolvedValue({ errors: undefined });

            // Act
            await IngotService.deleteAllIngots();

            // Assert
            expect(mockList).toHaveBeenCalled();
            expect(mockDelete).toHaveBeenCalledTimes(2);
            expect(mockDelete).toHaveBeenCalledWith({ id: '1' });
            expect(mockDelete).toHaveBeenCalledWith({ id: '2' });
        });
    });

    describe('getAnvilCardDisplayDetails', () => {
        it('should return display details for a known type', () => {
            // Arrange
            (MappingHelpers.getIngotLabelByType as jest.Mock).mockReturnValue(
                'Experience'
            );

            // Act
            const result =
                IngotService.getAnvilCardDisplayDetails('ingot_experience');

            // Assert
            expect(result.label).toBe('Experience');
            expect(result.color).toBe('bg-emerald-500');
            expect(result.icon).toBeDefined();
        });

        it('should return default details for unknown type', () => {
            // Arrange
            (MappingHelpers.getIngotLabelByType as jest.Mock).mockReturnValue(
                'Unknown'
            );

            // Act
            const result =
                IngotService.getAnvilCardDisplayDetails('unknown_type');

            // Assert
            expect(result.color).toBe('bg-slate-500');
        });
    });
});
