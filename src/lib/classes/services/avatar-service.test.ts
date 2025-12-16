import { AvatarService } from './avatar-service';
import { uploadData, getUrl } from 'aws-amplify/storage';
import { updateUserAttributes, fetchUserAttributes } from 'aws-amplify/auth';

// Mock AWS Amplify modules with factories
jest.mock('aws-amplify/storage', () => ({
    uploadData: jest.fn(),
    getUrl: jest.fn(),
}));

jest.mock('aws-amplify/auth', () => ({
    updateUserAttributes: jest.fn(),
    fetchUserAttributes: jest.fn(),
}));

// Mock the amplify_outputs.json file
jest.mock('../../../../amplify_outputs.json', () => ({
    __esModule: true,
    default: {
        storage: {
            bucket_name: 'test-bucket',
            aws_region: 'test-region',
        },
    },
}));

describe('AvatarService', () => {
    // Reset mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('updateUserAvatar', () => {
        it('should upload file, update attributes with public URL, and return the new URL', async () => {
            // Arrange
            const mockFile = new File(['dummy content'], 'avatar.png', {
                type: 'image/png',
            });
            const mockS3Key = 'avatars/user123/avatar.png';
            // The expected public URL based on our mock outputs
            const expectedPublicUrl =
                'https://test-bucket.s3.test-region.amazonaws.com/avatars/user123/avatar.png';

            // Mock uploadData to return a successful result
            (uploadData as jest.Mock).mockReturnValue({
                result: Promise.resolve({ path: mockS3Key }),
            });

            // Mock updateUserAttributes to resolve successfully
            (updateUserAttributes as jest.Mock).mockResolvedValue({});

            // Act
            const result = await AvatarService.updateUserAvatar(mockFile);

            // Assert
            // 1. Verify uploadData was called correctly
            expect(uploadData).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: mockFile,
                    options: { contentType: 'image/png' },
                })
            );

            // 2. Verify updateUserAttributes was called with the PUBLIC URL
            expect(updateUserAttributes).toHaveBeenCalledWith({
                userAttributes: { picture: expectedPublicUrl },
            });

            // 3. Verify getUrl was NOT called (we don't use signed URLs anymore)
            expect(getUrl).not.toHaveBeenCalled();

            // 4. Verify the returned URL matches
            expect(result).toBe(expectedPublicUrl);
        });

        it('should throw an error if upload fails', async () => {
            // Arrange
            const mockFile = new File([''], 'test.png', { type: 'image/png' });
            const mockError = new Error('Upload failed');

            (uploadData as jest.Mock).mockReturnValue({
                result: Promise.reject(mockError),
            });

            // Act & Assert
            await expect(
                AvatarService.updateUserAvatar(mockFile)
            ).rejects.toThrow('Upload failed');
        });
    });

    describe('getCurrentAvatarUrl', () => {
        it('should return undefined if no picture attribute exists', async () => {
            // Arrange
            (fetchUserAttributes as jest.Mock).mockResolvedValue({});

            // Act
            const result = await AvatarService.getCurrentAvatarUrl();

            // Assert
            expect(result).toBeUndefined();
        });

        it('should return the URL directly if it is an HTTP URL', async () => {
            // Arrange
            const mockHttpUrl = 'https://example.com/pic.jpg';
            (fetchUserAttributes as jest.Mock).mockResolvedValue({
                picture: mockHttpUrl,
            });

            // Act
            const result = await AvatarService.getCurrentAvatarUrl();

            // Assert
            expect(result).toBe(mockHttpUrl);
        });

        it('should return undefined if the picture attribute is not a full URL', async () => {
            // Arrange
            const s3Path = 'avatars/user123/pic.png';

            (fetchUserAttributes as jest.Mock).mockResolvedValue({
                picture: s3Path,
            });

            // Act
            const result = await AvatarService.getCurrentAvatarUrl();

            // Assert
            expect(result).toBeUndefined();
        });

        it('should return undefined if fetching attributes fails', async () => {
            // Arrange
            (fetchUserAttributes as jest.Mock).mockRejectedValue(
                new Error('Auth error')
            );

            // Act
            const result = await AvatarService.getCurrentAvatarUrl();

            // Assert
            expect(result).toBeUndefined();
        });
    });
});
