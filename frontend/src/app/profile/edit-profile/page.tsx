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
import {
    SettingsCard,
    SettingsSectionHeader,
} from '@/components/features/profile/settings-card';

export default function EditProfilePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [email, setEmail] = useState('');

    const form = useForm<EditProfileFormValues>({
        resolver: zodResolver(editProfileFormSchema),
        defaultValues: { username: '', bio: '' },
    });

    useEffect(() => {
        async function loadProfile() {
            try {
                const profile = await userApi.getUserProfile();
                setEmail(profile.email || '');
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
            <SettingsCard>
                <div className="animate-pulse space-y-6">
                    <div className="space-y-2">
                        <div className="h-5 w-24 rounded bg-slag" />
                        <div className="h-4 w-56 rounded bg-slag" />
                    </div>
                    <div className="h-10 w-full rounded bg-slag" />
                    <div className="h-10 w-full rounded bg-slag" />
                    <div className="h-32 w-full rounded bg-slag" />
                </div>
            </SettingsCard>
        );
    }

    return (
        <SettingsCard>
            <SettingsSectionHeader
                title="Profile"
                description="Update your display name and bio."
            />
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-ash">
                        Email
                    </p>
                    <p className="text-sm text-text-primary">{email || '—'}</p>
                </div>
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
                    className="h-32 resize-none"
                />
                <div className="flex justify-end">
                    <Button type="submit" disabled={isSaving} size="lg">
                        {isSaving ? 'Saving...' : 'Save changes'}
                    </Button>
                </div>
            </form>
        </SettingsCard>
    );
}
