'use client';

import { Button } from '@/components/shadcn-components/button';
import FormInput from '@/components/ui/form-input';
import { ProfileService } from '@/lib/classes/profile-service';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
    editPasswordFormSchema,
    EditPasswordFormValues,
} from '@/lib/form-schemas/edit-password-schema';

export default function EditPasswordPage() {
    const [isSaving, setIsSaving] = useState(false);

    const form = useForm<EditPasswordFormValues>({
        resolver: zodResolver(editPasswordFormSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    async function onSubmit(data: EditPasswordFormValues) {
        setIsSaving(true);
        try {
            await ProfileService.updateUserPassword(
                data.currentPassword,
                data.newPassword
            );
            toast.success('Password updated successfully');
            form.reset();
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Failed to update password');
            }
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h3 className="text-lg font-medium">Edit Password</h3>
                <p className="text-sm text-muted-foreground">
                    Change your password to keep your account secure.
                </p>
            </div>
            <div className="h-[1px] bg-border" />
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormInput
                    form={form}
                    id="currentPassword"
                    inputName="currentPassword"
                    label="Current Password"
                    placeholder="Enter your current password"
                    type="password"
                />

                <FormInput
                    form={form}
                    id="newPassword"
                    inputName="newPassword"
                    label="New Password"
                    placeholder="Enter your new password"
                    type="password"
                />

                <FormInput
                    form={form}
                    id="confirmPassword"
                    inputName="confirmPassword"
                    label="Confirm New Password"
                    placeholder="Confirm your new password"
                    type="password"
                />

                <div className="flex justify-end">
                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
