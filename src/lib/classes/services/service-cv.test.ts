import { CvService } from './service-cv';
import { generateClient } from 'aws-amplify/data';
import CvHelpers from '../helpers/cv-helpers';
import { NewCV, CvContent } from '@/lib/types/cv-types';

// Mock dependencies
jest.mock('../helpers/cv-helpers');

// Mock AWS Amplify Data with a factory
jest.mock('aws-amplify/data', () => ({
    generateClient: jest.fn(() => ({
        models: {
            CV: {
                create: jest.fn(),
                get: jest.fn(),
                list: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
        },
    })),
}));

describe('CvService', () => {
    let mockCreate: jest.Mock;
    let mockGet: jest.Mock;
    let mockList: jest.Mock;
    let mockUpdate: jest.Mock;
    let mockDelete: jest.Mock;

    beforeAll(() => {
        // Get the mock functions from the client instance created at module level
        const client = (generateClient as jest.Mock).mock.results[0].value;
        mockCreate = client.models.CV.create;
        mockGet = client.models.CV.get;
        mockList = client.models.CV.list;
        mockUpdate = client.models.CV.update;
        mockDelete = client.models.CV.delete;
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockCvContent: CvContent = {
        sections: [],
    };

    const mockNewCv: NewCV = {
        title: 'Test CV',
        version: 1,
        description: 'Test Description',
        cvContent: mockCvContent,
    };

    const mockDbCv = {
        id: 'cv-123',
        title: 'Test CV',
        version: 1,
        description: 'Test Description',
        cvContent: JSON.stringify(mockCvContent),
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
    };

    const mockMappedCv = {
        ...mockNewCv,
        id: 'cv-123',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
    };

    beforeEach(() => {
        (CvHelpers.mapDbDataToCv as jest.Mock).mockReturnValue(mockMappedCv);
    });

    describe('createCv', () => {
        it('should create a CV and return the mapped object', async () => {
            // Arrange
            mockCreate.mockResolvedValue({ data: mockDbCv, errors: undefined });

            // Act
            const result = await CvService.createCv(mockNewCv);

            // Assert
            expect(mockCreate).toHaveBeenCalledWith({
                title: 'Test CV',
                description: 'Test Description',
                version: 1,
                cvContent: JSON.stringify(mockCvContent),
            });
            expect(result).toEqual(mockMappedCv);
        });

        it('should throw an error if creation fails', async () => {
            // Arrange
            mockCreate.mockResolvedValue({
                data: null,
                errors: [{ message: 'Creation failed' }],
            });

            // Act & Assert
            await expect(CvService.createCv(mockNewCv)).rejects.toThrow(
                'Failed to create CV: Creation failed'
            );
        });
    });

    describe('getCv', () => {
        it('should retrieve a CV by ID', async () => {
            // Arrange
            mockGet.mockResolvedValue({ data: mockDbCv, errors: undefined });

            // Act
            const result = await CvService.getCv('cv-123');

            // Assert
            expect(mockGet).toHaveBeenCalledWith({ id: 'cv-123' });
            expect(result).toEqual(mockMappedCv);
        });

        it('should return null if CV is not found', async () => {
            // Arrange
            mockGet.mockResolvedValue({ data: null, errors: undefined });

            // Act
            const result = await CvService.getCv('cv-999');

            // Assert
            expect(result).toBeNull();
        });
    });

    describe('listCvs', () => {
        it('should list all CVs', async () => {
            // Arrange
            mockList.mockResolvedValue({
                data: [mockDbCv],
                errors: undefined,
            });

            // Act
            const result = await CvService.listCvs();

            // Assert
            expect(mockList).toHaveBeenCalled();
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual(mockMappedCv);
        });
    });

    describe('updateCv', () => {
        it('should update a CV', async () => {
            // Arrange
            mockUpdate.mockResolvedValue({
                data: mockDbCv,
                errors: undefined,
            });

            // Act
            const result = await CvService.updateCv(mockMappedCv);

            // Assert
            expect(mockUpdate).toHaveBeenCalledWith({
                id: 'cv-123',
                title: 'Test CV',
                description: 'Test Description',
                version: 1,
                cvContent: JSON.stringify(mockCvContent),
            });
            expect(result).toEqual(mockMappedCv);
        });
    });

    describe('deleteCv', () => {
        it('should delete a CV', async () => {
            // Arrange
            mockDelete.mockResolvedValue({ errors: undefined });

            // Act
            await CvService.deleteCv('cv-123');

            // Assert
            expect(mockDelete).toHaveBeenCalledWith({ id: 'cv-123' });
        });
    });

    describe('deleteAllCvs', () => {
        it('should delete all CVs returned by list', async () => {
            // Arrange
            mockList.mockResolvedValue({
                data: [
                    { ...mockDbCv, id: 'cv-1' },
                    { ...mockDbCv, id: 'cv-2' },
                ],
                errors: undefined,
            });
            mockDelete.mockResolvedValue({ errors: undefined });
            (CvHelpers.mapDbDataToCv as jest.Mock).mockImplementation(
                (data) => ({
                    ...mockMappedCv,
                    id: data.id,
                })
            );

            // Act
            await CvService.deleteAllCvs();

            // Assert
            expect(mockList).toHaveBeenCalled();
            expect(mockDelete).toHaveBeenCalledTimes(2);
            expect(mockDelete).toHaveBeenCalledWith({ id: 'cv-1' });
            expect(mockDelete).toHaveBeenCalledWith({ id: 'cv-2' });
        });
    });
});
