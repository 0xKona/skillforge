import { uploadData } from 'aws-amplify/storage';
import { updateUserAttributes, fetchUserAttributes } from 'aws-amplify/auth';
import outputs from '../../../../amplify_outputs.json';

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

            // 2. Construct the public URL
            // Format: https://<bucket-name>.s3.<region>.amazonaws.com/<path>
            const bucketName = outputs.storage.bucket_name;
            const region = outputs.storage.aws_region;
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

    /**
     * Fetches the current user's avatar URL from their attributes
     */
    static async getCurrentAvatarUrl(): Promise<string | undefined> {
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
}
