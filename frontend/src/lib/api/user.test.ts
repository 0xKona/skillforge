import { userApi } from './user';

jest.mock('aws-amplify/auth', () => ({
    fetchUserAttributes: jest.fn(),
    updateUserAttributes: jest.fn(),
    updatePassword: jest.fn(),
    deleteUser: jest.fn(),
}));

jest.mock('aws-amplify/storage', () => ({
    uploadData: jest.fn(),
}));

import {
    fetchUserAttributes,
    updateUserAttributes,
    updatePassword,
    deleteUser,
} from 'aws-amplify/auth';
import { uploadData } from 'aws-amplify/storage';

const mockFetchUserAttributes = fetchUserAttributes as jest.Mock;
const mockUpdateUserAttributes = updateUserAttributes as jest.Mock;
const mockUpdatePassword = updatePassword as jest.Mock;
const mockDeleteUser = deleteUser as jest.Mock;
const mockUploadData = uploadData as jest.Mock;

beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_S3_BUCKET = 'test-bucket';
    process.env.NEXT_PUBLIC_AWS_REGION = 'eu-west-2';
});

describe('userApi', () => {
    describe('getUserProfile', () => {
        it('fetches user attributes and returns a UserProfile', async () => {
            mockFetchUserAttributes.mockResolvedValue({
                preferred_username: 'Forger',
                'custom:bio': 'I forge things',
                email: 'forger@test.com',
            });

            const result = await userApi.getUserProfile();

            expect(result).toEqual({
                username: 'Forger',
                bio: 'I forge things',
                email: 'forger@test.com',
            });
        });

        it('propagates errors from fetchUserAttributes', async () => {
            mockFetchUserAttributes.mockRejectedValue(
                new Error('Not authenticated')
            );

            await expect(userApi.getUserProfile()).rejects.toThrow(
                'Not authenticated'
            );
        });
    });

    describe('updateUserProfile', () => {
        it('updates username and bio attributes', async () => {
            mockUpdateUserAttributes.mockResolvedValue(undefined);

            await userApi.updateUserProfile({
                username: 'NewName',
                bio: 'New bio',
                email: 'test@test.com',
            });

            expect(mockUpdateUserAttributes).toHaveBeenCalledWith({
                userAttributes: {
                    preferred_username: 'NewName',
                    'custom:bio': 'New bio',
                },
            });
        });

        it('only includes defined fields in the update', async () => {
            mockUpdateUserAttributes.mockResolvedValue(undefined);

            await userApi.updateUserProfile({
                username: 'OnlyName',
                bio: undefined as unknown as string,
                email: 'test@test.com',
            });

            expect(mockUpdateUserAttributes).toHaveBeenCalledWith({
                userAttributes: {
                    preferred_username: 'OnlyName',
                },
            });
        });
    });

    describe('updateUserPassword', () => {
        it('calls updatePassword with old and new password', async () => {
            mockUpdatePassword.mockResolvedValue(undefined);

            await userApi.updateUserPassword('oldpass', 'newpass');

            expect(mockUpdatePassword).toHaveBeenCalledWith({
                oldPassword: 'oldpass',
                newPassword: 'newpass',
            });
        });

        it('propagates errors from updatePassword', async () => {
            mockUpdatePassword.mockRejectedValue(
                new Error('Incorrect password')
            );

            await expect(
                userApi.updateUserPassword('wrong', 'new')
            ).rejects.toThrow('Incorrect password');
        });
    });

    describe('deleteUserAccount', () => {
        it('calls deleteUser', async () => {
            mockDeleteUser.mockResolvedValue(undefined);

            await userApi.deleteUserAccount();

            expect(mockDeleteUser).toHaveBeenCalled();
        });
    });

    describe('updateUserAvatar', () => {
        it('uploads file and updates picture attribute with constructed URL', async () => {
            mockUploadData.mockReturnValue({
                result: Promise.resolve({ path: 'avatars/user-1/avatar.png' }),
            });
            mockUpdateUserAttributes.mockResolvedValue(undefined);

            const file = new File(['data'], 'photo.png', { type: 'image/png' });
            const result = await userApi.updateUserAvatar(file);

            expect(mockUploadData).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: file,
                    options: { contentType: 'image/png' },
                })
            );
            expect(mockUpdateUserAttributes).toHaveBeenCalledWith({
                userAttributes: {
                    picture:
                        'https://test-bucket.s3.eu-west-2.amazonaws.com/avatars/user-1/avatar.png',
                },
            });
            expect(result).toBe(
                'https://test-bucket.s3.eu-west-2.amazonaws.com/avatars/user-1/avatar.png'
            );
        });
    });

    describe('getCurrentAvatarUrl', () => {
        it('returns the picture attribute when it is a full URL', async () => {
            mockFetchUserAttributes.mockResolvedValue({
                picture:
                    'https://bucket.s3.region.amazonaws.com/avatars/user/avatar.png',
            });

            const result = await userApi.getCurrentAvatarUrl();

            expect(result).toBe(
                'https://bucket.s3.region.amazonaws.com/avatars/user/avatar.png'
            );
        });

        it('returns undefined when no picture attribute exists', async () => {
            mockFetchUserAttributes.mockResolvedValue({});

            const result = await userApi.getCurrentAvatarUrl();

            expect(result).toBeUndefined();
        });

        it('returns undefined when picture is not a URL', async () => {
            mockFetchUserAttributes.mockResolvedValue({
                picture: 'some-relative-path',
            });

            const result = await userApi.getCurrentAvatarUrl();

            expect(result).toBeUndefined();
        });

        it('propagates errors from fetchUserAttributes', async () => {
            mockFetchUserAttributes.mockRejectedValue(new Error('Failed'));

            await expect(userApi.getCurrentAvatarUrl()).rejects.toThrow(
                'Failed'
            );
        });
    });
});
