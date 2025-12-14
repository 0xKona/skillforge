import * as z from 'zod';

export const editProfileFormSchema = z.object({
    username: z
        .string()
        .min(2, {
            message: 'Username must be at least 2 characters.',
        })
        .max(30, {
            message: 'Username must not be longer than 30 characters.',
        }),
    bio: z
        .string()
        .max(160, {
            message: 'Bio must not be longer than 160 characters.',
        })
        .optional(),
});

export type EditProfileFormValues = z.infer<typeof editProfileFormSchema>;