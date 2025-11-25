import { uploadData, getUrl } from 'aws-amplify/storage';
import { updateUserAttributes, fetchUserAttributes } from 'aws-amplify/auth';

export class AvatarService {
    /**
     * Uploads a file to S3 and updates the user's 'picture' attribute with the new URL.
     * @param file The file object selected by the user
     * @returns The public URL of the uploaded avatar
     */
    static async updateUserAvatar(file: File): Promise<string> {
        try {
            // 1. Upload the file to the user's protected folder
            // We use a fixed name 'avatar' to overwrite existing ones, saving space
            // We keep the original extension or force png/jpg based on your preference
            const fileExtension = file.name.split('.').pop();
            const key = `avatar.${fileExtension}`;

            const uploadResult = await uploadData({
                path: ({ identityId }) => `avatars/${identityId}/${key}`,
                data: file,
                options: {
                    contentType: file.type,
                },
            }).result;

            console.log('Upload successful:', uploadResult);

            // 2. Get the accessible URL for the uploaded image
            const urlResult = await getUrl({
                path: ({ identityId }) => `avatars/${identityId}/${key}`,
                // Ensure the URL doesn't expire quickly if you want to store it
                // However, for 'guest' accessible files, the URL structure is usually predictable
            });

            const avatarUrl = urlResult.url.toString();

            // 3. Update the Cognito User Attribute 'picture' (or 'profilePicture')
            await updateUserAttributes({
                userAttributes: {
                    picture: avatarUrl,
                    // Or if you used 'profilePicture' in your resource.ts:
                    // profilePicture: avatarUrl
                },
            });

            return avatarUrl;
        } catch (error) {
            console.error('Error updating avatar:', error);
            throw error;
        }
    }

    /**
     * Fetches the current user's avatar URL from their attributes
     */
    static async getCurrentAvatarUrl(): Promise<string | undefined> {
        try {
            const attributes = await fetchUserAttributes();
            // Returns the 'picture' attribute or 'profilePicture' depending on your setup
            return attributes.picture || attributes.profilePicture;
        } catch (error) {
            console.error('Error fetching user attributes:', error);
            return undefined;
        }
    }
}
