'use client';

import { Skeleton } from '@/components/ui/component-library/shadcn-components/skeleton';
import { Button } from '@/components/ui/component-library/shadcn-components/button';
import FormInput from '@/components/ui/form-input';
import FormTextarea from '@/components/ui/form-textarea';
import { ProfileService } from '@/lib/classes/services/profile-service';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
    editProfileFormSchema,
    EditProfileFormValues,
} from '@/lib/form-schemas/edit-profile-schema';
import {
    TypographyH3,
    TypographyP,
} from '@/components/ui/typography/typography';

export default function EditProfilePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const form = useForm<EditProfileFormValues>({
        resolver: zodResolver(editProfileFormSchema),
        defaultValues: {
            username: '',
            bio: '',
        },
    });

    useEffect(() => {
        async function loadProfile() {
            try {
                const profile = await ProfileService.getProfile();
                form.reset({
                    username: profile.username || '',
                    bio: profile.bio || '',
                });
            } catch (error) {
                console.error(error);
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
            await ProfileService.updateProfile(data);
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="space-y-6 w-full">
            <div>
                <TypographyH3>Edit Profile</TypographyH3>
                <TypographyP className="text-muted-foreground">
                    Update your profile information.
                </TypographyP>
            </div>
            <div className="h-[1px] bg-border" />
            {isLoading ? (
                <div className="space-y-8">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-9 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-8" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                    <div className="flex justify-end">
                        <Skeleton className="h-9 w-28" />
                    </div>
                </div>
            ) : (
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <FormInput
                        form={form}
                        id="username"
                        inputName="username"
                        label="Username"
                        placeholder="Your username"
                    />
                    <FormTextarea
                        form={form}
                        id="bio"
                        inputName="bio"
                        label="Bio"
                        placeholder="Tell us a little bit about yourself"
                        className="resize-none h-32"
                    />
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
