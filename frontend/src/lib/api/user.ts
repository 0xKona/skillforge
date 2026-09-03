import {
    fetchUserAttributes,
    updatePassword,
    updateUserAttributes,
} from 'aws-amplify/auth';
import { UserProfile } from '../types/user-types';
import { uploadData } from 'aws-amplify/storage';
import { apiDelete } from './client';
import { signOut } from './auth';

async function getUserProfile(): Promise<UserProfile> {
    const attributes = await fetchUserAttributes();
    return {
        username: attributes.preferred_username as string,
        bio: attributes['custom:bio'] as string,
        email: attributes.email as string,
    };
}

async function updateUserProfile(profile: UserProfile): Promise<void> {
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
}

async function updateUserPassword(
    oldPassword: string,
    newPassword: string
): Promise<void> {
    await updatePassword({
        oldPassword,
        newPassword,
    });
}

async function deleteUserAccount(): Promise<void> {
    await apiDelete('/user/data');
    try {
        await signOut();
    } catch {
        // Cognito user may already be gone; local session is cleared in signOut.
    }
}

async function updateUserAvatar(file: File): Promise<string> {
    const fileExtension = file.name.split('.').pop();
    const key = `avatar.${fileExtension}`;

    const uploadResult = await uploadData({
        path: ({ identityId }) => `avatars/${identityId}/${key}`,
        data: file,
        options: {
            contentType: file.type,
        },
    }).result;

    const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET;
    const region = process.env.NEXT_PUBLIC_AWS_REGION;
    const path = uploadResult.path;

    const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${path}`;

    await updateUserAttributes({
        userAttributes: {
            picture: publicUrl,
        },
    });

    return publicUrl;
}

async function getCurrentAvatarUrl(): Promise<string | undefined> {
    const attributes = await fetchUserAttributes();
    const pictureAttribute = attributes.picture || attributes.profilePicture;

    if (!pictureAttribute) return undefined;

    if (pictureAttribute.startsWith('http')) {
        return pictureAttribute;
    }

    return undefined;
}

export const userApi = {
    getUserProfile,
    updateUserProfile,
    updateUserPassword,
    deleteUserAccount,
    updateUserAvatar,
    getCurrentAvatarUrl,
};
