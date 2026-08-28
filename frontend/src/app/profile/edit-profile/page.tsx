'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/ui/shadcn/button';
import FormInput from '@/ui/form-input';
import FormTextarea from '@/ui/form-textarea';
import {
    editProfileFormSchema,
    EditProfileFormValues,
} from '@/lib/schemas/edit-profile-schema';
import { userApi } from '@/lib/api/user';
import type { UserProfile } from '@/lib/types/user-types';

export default function EditProfilePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const form = useForm<EditProfileFormValues>({
        resolver: zodResolver(editProfileFormSchema),
        defaultValues: { username: '', bio: '' },
    });

    useEffect(() => {
        async function loadProfile() {
            try {
                const profile = await userApi.getUserProfile();
                form.reset({
                    username: profile.username || '',
                    bio: profile.bio || '',
                });
            } catch {
                toast.error('Failed to load profile');
            } finally {
                setIsLoading(false);
            }
        }
        loadProfile();
    }, [form]);

    async function onSubmit(data: EditProfileFormValues) {
        setIsSaving(true);
        try {
            await userApi.updateUserProfile(data as UserProfile);
            toast.success('Profile updated');
        } catch {
            toast.error('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-6 max-w-md animate-pulse">
                <div className="h-5 w-32 rounded bg-slag" />
                <div className="h-10 w-full rounded bg-slag" />
                <div className="h-32 w-full rounded bg-slag" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-md">
            <div>
                <h2 className="text-lg font-semibold text-text-primary">
                    Profile
                </h2>
                <p className="text-sm text-ash">
                    Update your display name and bio.
                </p>
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormInput
                    form={form}
                    id="profile-username"
                    inputName="username"
                    label="Username"
                    placeholder="Your display name"
                />
                <FormTextarea
                    form={form}
                    id="profile-bio"
                    inputName="bio"
                    label="Bio"
                    placeholder="A short bio"
                    className="resize-none h-32"
                />
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={isSaving}
                        className="h-10 px-4 bg-flux hover:bg-flux-hover text-white font-medium rounded-md"
                    >
                        {isSaving ? 'Saving...' : 'Save changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
