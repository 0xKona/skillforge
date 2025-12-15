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
        it('should upload file, update attributes, and return the new URL', async () => {
            // Arrange
            const mockFile = new File(['dummy content'], 'avatar.png', {
                type: 'image/png',
            });
            const mockS3Key = 'avatars/user123/avatar.png';
            const mockUrl = new URL('https://example.com/avatar.png');

            // Mock uploadData to return a successful result
            (uploadData as jest.Mock).mockReturnValue({
                result: Promise.resolve({ path: mockS3Key }),
            });

            // Mock updateUserAttributes to resolve successfully
            (updateUserAttributes as jest.Mock).mockResolvedValue({});

            // Mock getUrl to return the signed URL
            (getUrl as jest.Mock).mockResolvedValue({ url: mockUrl });

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

            // 2. Verify updateUserAttributes was called with the correct key
            expect(updateUserAttributes).toHaveBeenCalledWith({
                userAttributes: { picture: mockS3Key },
            });

            // 3. Verify getUrl was called with the correct key
            expect(getUrl).toHaveBeenCalledWith({ path: mockS3Key });

            // 4. Verify the returned URL matches
            expect(result).toBe(mockUrl.toString());
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

        it('should attempt to convert legacy public S3 URLs to signed URLs', async () => {
            // Arrange
            const legacyUrl =
                'https://bucket.s3.amazonaws.com/avatars/user/pic.jpg';
            const s3Key = 'avatars/user/pic.jpg';
            const signedUrl = new URL('https://signed-url.com/pic.jpg');

            (fetchUserAttributes as jest.Mock).mockResolvedValue({
                picture: legacyUrl,
            });
            (getUrl as jest.Mock).mockResolvedValue({ url: signedUrl });

            // Act
            const result = await AvatarService.getCurrentAvatarUrl();

            // Assert
            expect(getUrl).toHaveBeenCalledWith({ path: s3Key });
            expect(result).toBe(signedUrl.toString());
        });

        it('should generate a signed URL for S3 paths', async () => {
            // Arrange
            const s3Path = 'avatars/user123/pic.png';
            const signedUrl = new URL('https://signed-url.com/pic.png');

            (fetchUserAttributes as jest.Mock).mockResolvedValue({
                picture: s3Path,
            });
            (getUrl as jest.Mock).mockResolvedValue({ url: signedUrl });

            // Act
            const result = await AvatarService.getCurrentAvatarUrl();

            // Assert
            expect(getUrl).toHaveBeenCalledWith({ path: s3Path });
            expect(result).toBe(signedUrl.toString());
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
