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

            // 2. Update the Cognito User Attribute 'picture' with the S3 key (path)
            // We store the path so we can generate fresh signed URLs on demand
            const s3Key = uploadResult.path;

            await updateUserAttributes({
                userAttributes: {
                    picture: s3Key,
                },
            });

            // 3. Get the accessible URL for the uploaded image to return immediately
            const urlResult = await getUrl({
                path: s3Key,
            });

            return urlResult.url.toString();
        } catch (error) {
            console.error('Error updating avatar:', error);
            throw error;
        }
    }

    /**
     * Fetches the current user's avatar URL from their attributes
     * If the attribute is an S3 path, generates a fresh signed URL
     */
    static async getCurrentAvatarUrl(): Promise<string | undefined> {
        try {
            const attributes = await fetchUserAttributes();
            const pictureAttribute =
                attributes.picture || attributes.profilePicture;

            if (!pictureAttribute) return undefined;

            // Check if it's a full URL (e.g. from social provider or legacy implementation)
            if (pictureAttribute.startsWith('http')) {
                // Attempt to rescue broken public S3 URLs that return 403
                // Pattern: ...amazonaws.com/avatars/...
                if (pictureAttribute.includes('.amazonaws.com/avatars/')) {
                    const keyMatch = pictureAttribute.match(/(avatars\/.*)/);
                    if (keyMatch && keyMatch[1]) {
                        try {
                            const urlResult = await getUrl({
                                path: keyMatch[1],
                            });
                            return urlResult.url.toString();
                        } catch (e) {
                            console.warn(
                                'Failed to convert public URL to signed URL:',
                                e
                            );
                        }
                    }
                }
                return pictureAttribute;
            }

            // Assume it's an S3 path and generate a signed URL
            const urlResult = await getUrl({
                path: pictureAttribute,
            });

            return urlResult.url.toString();
        } catch (error) {
            console.error('Error fetching avatar URL:', error);
            return undefined;
        }
    }
}
