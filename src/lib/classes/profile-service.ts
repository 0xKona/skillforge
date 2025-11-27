import {
    fetchUserAttributes,
    updateUserAttributes,
    updatePassword,
} from 'aws-amplify/auth';

export interface UserProfile {
    username?: string;
    bio?: string;
    email?: string;
}

export class ProfileService {
    /**
     * Fetches the current user's profile attributes.
     */
    static async getProfile(): Promise<UserProfile> {
        try {
            const attributes = await fetchUserAttributes();
            return {
                username: attributes.preferred_username,
                bio: attributes['custom:bio'],
                email: attributes.email,
            };
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        }
    }

    /**
     * Updates the user's profile attributes.
     * @param profile The profile data to update
     */
    static async updateProfile(profile: UserProfile): Promise<void> {
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

    /**
     * Updates the user's password.
     * @param oldPassword The current password
     * @param newPassword The new password
     */
    static async updateUserPassword(
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
}
