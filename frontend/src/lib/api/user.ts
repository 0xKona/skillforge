import {
    deleteUser,
    fetchUserAttributes,
    updatePassword,
    updateUserAttributes,
} from 'aws-amplify/auth';
import { UserProfile } from '../types/user-types';

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

export const userApi = {
    getUserProfile,
    updateUserProfile,
    updateUserPassword,
    deleteUserAccount,
};
