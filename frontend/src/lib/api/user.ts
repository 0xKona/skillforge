import {
    deleteUser,
    fetchUserAttributes,
    updatePassword,
    updateUserAttributes,
} from 'aws-amplify/auth';
import { UserProfile } from '../types/user-types';
import { uploadData } from 'aws-amplify/storage';

// Get user profile
async function getUserProfile(): Promise<UserProfile> {
    try {
        const attributes = await fetchUserAttributes();
        return {
            // TODO - Check typing, should always be a string of empty string
            username: attributes.preferred_username as string,
            bio: attributes['custom:bio'] as string,
            email: attributes.email as string,
        };
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
}

// Update user profile
async function updateUserProfile(profile: UserProfile): Promise<void> {
    try {
        const attributes: Record<string, string> = {};

        if (profile.username !== undefined) {
            attributes.preferred_username = profile.username;
        }

        if (profile.bio !== undefined) {
            attributes['custom:bio'] = profile.bio;
        }

        await updateUserAttributes({
            userAttributes: attributes,
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
}

// Update user password
async function updateUserPassword(
    oldPassword: string,
    newPassword: string
): Promise<void> {
    try {
        await updatePassword({
            oldPassword,
            newPassword,
        });
    } catch (error) {
        console.error('Error updating password:', error);
        throw error;
    }
}

// Delete user account and all data
async function deleteUserAccount(): Promise<void> {
    try {
        // TODO - Full backend pipeline to delete all user data needs implementing
        await deleteUser();
    } catch (error) {
        console.error('Error deleting user account:', error);
        throw error;
    }
}

// Update user avatar, upload to S3 and update Cognito attribute
async function updateUserAvatar(file: File): Promise<string> {
    try {
        // 1. Upload the file to the user's protected folder
        const fileExtension = file.name.split('.').pop();
        const key = `avatar.${fileExtension}`;

        const uploadResult = await uploadData({
            path: ({ identityId }) => `avatars/${identityId}/${key}`,
            data: file,
            options: {
                contentType: file.type,
            },
        }).result;

        // 2. Construct the public URL
        const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET;
        const region = process.env.NEXT_PUBLIC_AWS_REGION;
        const path = uploadResult.path;

        const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${path}`;

        // 3. Update the Cognito User Attribute 'picture' with the public URL
        await updateUserAttributes({
            userAttributes: {
                picture: publicUrl,
            },
        });

        return publicUrl;
    } catch (error) {
        console.error('Error updating avatar:', error);
        throw error;
    }
}

// Get current avatar url from attributes
async function getCurrentAvatarUrl(): Promise<string | undefined> {
    try {
        const attributes = await fetchUserAttributes();
        const pictureAttribute =
            attributes.picture || attributes.profilePicture;

        if (!pictureAttribute) return undefined;

        // If it's already a full URL, return it
        if (pictureAttribute.startsWith('http')) {
            return pictureAttribute;
        }

        return undefined;
    } catch (error) {
        console.error('Error fetching avatar URL:', error);
        return undefined;
    }
}

export const userApi = {
    getUserProfile,
    updateUserProfile,
    updateUserPassword,
    deleteUserAccount,
    updateUserAvatar,
    getCurrentAvatarUrl,
};
