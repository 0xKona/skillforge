import { ProfileService } from './profile-service';
import {
    fetchUserAttributes,
    updateUserAttributes,
    updatePassword,
    deleteUser,
} from 'aws-amplify/auth';
import { IngotService } from './ingot-service';
import { CvService } from './service-cv';

// Mock dependencies
jest.mock('aws-amplify/auth', () => ({
    fetchUserAttributes: jest.fn(),
    updateUserAttributes: jest.fn(),
    updatePassword: jest.fn(),
    deleteUser: jest.fn(),
}));
jest.mock('./ingot-service');
jest.mock('./service-cv');

describe('ProfileService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('getProfile', () => {
        it('should fetch and map user attributes to profile', async () => {
            // Arrange
            (fetchUserAttributes as jest.Mock).mockResolvedValue({
                preferred_username: 'testuser',
                'custom:bio': 'Test Bio',
                email: 'test@example.com',
            });

            // Act
            const result = await ProfileService.getProfile();

            // Assert
            expect(fetchUserAttributes).toHaveBeenCalled();
            expect(result).toEqual({
                username: 'testuser',
                bio: 'Test Bio',
                email: 'test@example.com',
            });
        });

        it('should throw an error if fetching fails', async () => {
            // Arrange
            (fetchUserAttributes as jest.Mock).mockRejectedValue(
                new Error('Fetch failed')
            );

            // Act & Assert
            await expect(ProfileService.getProfile()).rejects.toThrow(
                'Fetch failed'
            );
        });
    });

    describe('updateProfile', () => {
        it('should update user attributes', async () => {
            // Arrange
            const profileUpdate = {
                username: 'newuser',
                bio: 'New Bio',
            };
            (updateUserAttributes as jest.Mock).mockResolvedValue({});

            // Act
            await ProfileService.updateProfile(profileUpdate);

            // Assert
            expect(updateUserAttributes).toHaveBeenCalledWith({
                userAttributes: {
                    preferred_username: 'newuser',
                    'custom:bio': 'New Bio',
                },
            });
        });

        it('should only update provided fields', async () => {
            // Arrange
            const profileUpdate = {
                username: 'newuser',
            };
            (updateUserAttributes as jest.Mock).mockResolvedValue({});

            // Act
            await ProfileService.updateProfile(profileUpdate);

            // Assert
            expect(updateUserAttributes).toHaveBeenCalledWith({
                userAttributes: {
                    preferred_username: 'newuser',
                },
            });
        });
    });

    describe('updateUserPassword', () => {
        it('should update the password', async () => {
            // Arrange
            (updatePassword as jest.Mock).mockResolvedValue({});

            // Act
            await ProfileService.updateUserPassword('oldPass', 'newPass');

            // Assert
            expect(updatePassword).toHaveBeenCalledWith({
                oldPassword: 'oldPass',
                newPassword: 'newPass',
            });
        });
    });

    describe('deleteUserAccount', () => {
        it('should delete ingots, CVs, and the user account', async () => {
            // Arrange
            (IngotService.deleteAllIngots as jest.Mock).mockResolvedValue(
                undefined
            );
            (CvService.deleteAllCvs as jest.Mock).mockResolvedValue(undefined);
            (deleteUser as jest.Mock).mockResolvedValue(undefined);

            // Act
            await ProfileService.deleteUserAccount();

            // Assert
            expect(IngotService.deleteAllIngots).toHaveBeenCalled();
            expect(CvService.deleteAllCvs).toHaveBeenCalled();
            expect(deleteUser).toHaveBeenCalled();
        });

        it('should throw an error if any step fails', async () => {
            // Arrange
            (IngotService.deleteAllIngots as jest.Mock).mockRejectedValue(
                new Error('Delete failed')
            );

            // Act & Assert
            await expect(ProfileService.deleteUserAccount()).rejects.toThrow(
                'Delete failed'
            );
        });
    });
});
